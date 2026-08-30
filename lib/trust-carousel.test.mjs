import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import { REGIONS } from './regions.ts'
import { TRUST_CAROUSEL_COPY, TRUST_CAROUSEL_ITEMS } from './trust-carousel-copy.ts'
import { homeCopy } from './home-copy.ts'
import { products } from './products.ts'
import { catalogCopy } from './product-copy.ts'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const jsxRuntime = require('react/jsx-runtime')
const expectedItems = [
  { id: 'endotoxin', label: 'Endotoxin tested' },
  { id: 'research', label: 'Research grade' },
  { id: 'coa', label: 'Batch-specific COA' },
  { id: 'hplc', label: 'HPLC tested' },
]
const expectedLabels = expectedItems.map((item) => item.label)

function compileComponent(path) {
  return ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText
}

const carouselSource = compileComponent('../components/trust-carousel.tsx')
const catalogSource = compileComponent('../components/products.tsx')
const globalCSS = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')
const carouselCSSStart = globalCSS.indexOf('.trust-carousel {')
assert.ok(carouselCSSStart >= 0, 'the carousel has its own scoped stylesheet rules')
const carouselCSS = globalCSS.slice(carouselCSSStart)

function loadComponent(source, dependencies) {
  const componentModule = { exports: {} }
  vm.runInNewContext(source, {
    module: componentModule,
    exports: componentModule.exports,
    require(id) {
      if (!Object.hasOwn(dependencies, id)) throw new Error(`Unexpected component dependency: ${id}`)
      return dependencies[id]
    },
  })
  return componentModule.exports
}

function descendants(node) {
  if (node == null || typeof node !== 'object') return []
  if (Array.isArray(node)) return node.flatMap(descendants)
  return [node, ...descendants(node.props?.children)]
}

function content(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(content).join('')
  return content(node.props?.children)
}

const isHidden = (node) => String(node.props?.['aria-hidden']) === 'true'
const hasClass = (node, className) => (node.props?.className ?? '').split(/\s+/).includes(className)

function byClass(tree, className) {
  const matches = descendants(tree).filter((node) => hasClass(node, className))
  assert.equal(matches.length, 1, `one ${className} boundary is rendered`)
  return matches[0]
}

function listLabels(list) {
  return descendants(list).filter((node) => node.type === 'li').map(content)
}

function control(tree) {
  const buttons = descendants(tree).filter((node) => node.type === 'button')
  assert.equal(buttons.length, 1)
  return buttons[0]
}

// Real TSX and event handlers with only hooks, decorative icons and framework
// boundaries controlled. Deliberately omit window/document/network globals:
// this visual component should not navigate, fetch, or modify external state.
function createHarness(region) {
  const state = []
  let stateIndex = 0
  const dependencies = {
    'react/jsx-runtime': jsxRuntime,
    react: {
      useState(initial) {
        const index = stateIndex++
        if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial
        return [state[index], (value) => {
          state[index] = typeof value === 'function' ? value(state[index]) : value
        }]
      },
    },
    'lucide-react': { Pause: 'PauseIcon', Play: 'PlayIcon', Sparkles: 'SparklesIcon' },
    '@/components/region-provider': { useRegion: () => ({ region, language: region.language }) },
    '@/lib/trust-carousel-copy': { TRUST_CAROUSEL_COPY, TRUST_CAROUSEL_ITEMS },
    '@/components/product-card': { ProductCard: 'ProductCard' },
    '@/components/consultation-button': { ConsultationButton: 'ConsultationButton' },
    '@/components/reveal': { Reveal: 'Reveal', Stagger: 'Stagger', StaggerItem: 'StaggerItem' },
    '@/lib/products': { products },
    '@/lib/product-copy': { catalogCopy },
  }
  const { TrustCarousel } = loadComponent(carouselSource, dependencies)
  const { Products } = loadComponent(catalogSource, dependencies)
  return {
    render() {
      stateIndex = 0
      return TrustCarousel()
    },
    renderCatalog() { return Products() },
  }
}

// Structural CSS checks complement browser QA; they do not claim pixel-level
// rendering or animation measurements. Balanced blocks keep media/keyframe
// scopes separate without adding a stylesheet-parser dependency.
function cssBlocks(source) {
  const cleaned = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const blocks = []
  let cursor = 0
  while (cursor < cleaned.length) {
    const open = cleaned.indexOf('{', cursor)
    if (open === -1) break
    let depth = 1
    let end = open + 1
    while (end < cleaned.length && depth > 0) {
      if (cleaned[end] === '{') depth++
      else if (cleaned[end] === '}') depth--
      end++
    }
    assert.equal(depth, 0, 'balanced carousel CSS block')
    blocks.push({ header: cleaned.slice(cursor, open).trim(), body: cleaned.slice(open + 1, end - 1) })
    cursor = end
  }
  return blocks
}

function declarations(body) {
  return Object.fromEntries(body.split(';').map((entry) => entry.trim()).filter(Boolean).map((entry) => {
    const colon = entry.indexOf(':')
    assert.ok(colon > 0, `CSS declaration: ${entry}`)
    return [entry.slice(0, colon).trim(), entry.slice(colon + 1).trim()]
  }))
}

function styleFor(source, selector) {
  const matches = cssBlocks(source).filter((block) => !block.header.startsWith('@') &&
    block.header.split(',').map((part) => part.trim()).includes(selector))
  assert.ok(matches.length > 0, `CSS rule exists for ${selector}`)
  return Object.assign({}, ...matches.map((block) => declarations(block.body)))
}

function allStyleRules(source) {
  return cssBlocks(source).flatMap((block) => block.header.startsWith('@')
    ? allStyleRules(block.body)
    : [{ selector: block.header, declarations: declarations(block.body) }])
}

function scopedBlock(pattern) {
  const matches = cssBlocks(carouselCSS).filter((block) => pattern.test(block.header))
  assert.equal(matches.length, 1, `one CSS scope matching ${pattern}`)
  return matches[0].body
}

test('the carousel data contains exactly four requested English badges with localized EN/MS/ID controls', () => {
  assert.deepEqual(TRUST_CAROUSEL_ITEMS, expectedItems)
  assert.equal(new Set(TRUST_CAROUSEL_ITEMS.map((item) => item.id)).size, 4)
  assert.deepEqual(Object.keys(TRUST_CAROUSEL_COPY).sort(), ['en', 'id', 'ms'])
  for (const language of ['en', 'ms', 'id']) {
    const copy = TRUST_CAROUSEL_COPY[language]
    assert.deepEqual(Object.keys(copy).sort(), ['label', 'pause', 'resume'])
    for (const value of Object.values(copy)) assert.ok(value.trim().length > 3)
    assert.notEqual(copy.pause, copy.resume)
  }
  for (const language of ['ms', 'id']) {
    assert.notEqual(TRUST_CAROUSEL_COPY[language].label, TRUST_CAROUSEL_COPY.en.label)
    assert.notEqual(TRUST_CAROUSEL_COPY[language].pause, TRUST_CAROUSEL_COPY.en.pause)
    assert.notEqual(TRUST_CAROUSEL_COPY[language].resume, TRUST_CAROUSEL_COPY.en.resume)
  }
})

test('all seven regions expose one English four-item list and an identical hidden clone for the seamless visual loop', () => {
  for (const region of REGIONS) {
    const tree = createHarness(region).render()
    const nodes = descendants(tree)
    assert.equal(tree.type, 'section')
    assert.equal(tree.props.id, 'quality-highlights')
    assert.equal(tree.props['aria-label'], TRUST_CAROUSEL_COPY[region.language].label)
    assert.equal(tree.props['data-paused'], 'false')
    const lists = nodes.filter((node) => node.type === 'ul')
    assert.equal(lists.length, 2, region.id)
    const primary = lists.filter((list) => !isHidden(list))
    const clones = lists.filter(isHidden)
    assert.equal(primary.length, 1, 'only one list is exposed to assistive technology')
    assert.equal(clones.length, 1)
    assert.equal(hasClass(primary[0], 'trust-carousel__group--duplicate'), false)
    assert.equal(hasClass(clones[0], 'trust-carousel__group--duplicate'), true)
    for (const list of lists) {
      assert.equal(list.props.lang, 'en', `${region.id}: badge terms stay English`)
      assert.equal(list.props.role, 'list', 'list semantics survive list-style:none')
      assert.deepEqual(listLabels(list), expectedLabels)
      const separators = descendants(list).filter((node) => node.type === 'SparklesIcon')
      assert.equal(separators.length, 4)
      assert.ok(separators.every(isHidden), 'sparkle separators are decorative')
      assert.equal(descendants(list).some((node) => ['a', 'button', 'input'].includes(node.type)), false)
    }
    const viewport = byClass(tree, 'trust-carousel__viewport')
    const track = byClass(tree, 'trust-carousel__track')
    assert.equal(viewport.props['aria-live'], 'off', 'the moving loop is not a live announcement')
    assert.ok(descendants(viewport).includes(track))
    assert.equal(control(tree).props['aria-controls'], track.props.id)
  }
})

test('reference-brand ownership, delivery messages and customer counts are not reproduced', () => {
  for (const region of REGIONS) {
    const tree = createHarness(region).render()
    assert.doesNotMatch(content(tree), /Discreet\s+Delivery|Australian\s+Owned|4[,.]?000\+?\s+Customers/i)
    assert.doesNotMatch(content(tree), /\d[\d,.\s]*\+?\s*(?:customers?|pelanggan|klien)/i)
    for (const previousBadge of homeCopy[region.language].hero.trust) {
      assert.ok(!content(tree).includes(previousBadge))
    }
    assert.equal(descendants(tree).some((node) => ['img', 'picture', 'a', 'iframe'].includes(node.type)), false,
      'the label carousel adds no image dependencies, outbound links or embedded external pages')
  }
})

test('localized pause and resume controls toggle only carousel state, including repeated clicks before a re-render', () => {
  for (const region of REGIONS) {
    const harness = createHarness(region)
    const copy = TRUST_CAROUSEL_COPY[region.language]
    let tree = harness.render()
    let button = control(tree)
    assert.equal(button.props.type, 'button')
    assert.equal(button.props['aria-label'], copy.pause)
    assert.equal(button.props.title, copy.pause)
    assert.equal(descendants(button).filter((node) => node.type === 'PauseIcon').length, 1)
    button.props.onClick()

    tree = harness.render()
    button = control(tree)
    assert.equal(tree.props['data-paused'], 'true')
    assert.equal(button.props['aria-label'], copy.resume)
    assert.equal(button.props.title, copy.resume)
    assert.equal(descendants(button).filter((node) => node.type === 'PlayIcon').length, 1)
    button.props.onClick()

    tree = harness.render()
    assert.equal(tree.props['data-paused'], 'false')
    button = control(tree)
    button.props.onClick()
    button.props.onClick()
    tree = harness.render()
    assert.equal(tree.props['data-paused'], 'false', 'functional state updates preserve both rapid toggles')
    assert.equal(control(tree).props['aria-label'], copy.pause)
    for (const list of descendants(tree).filter((node) => node.type === 'ul')) assert.deepEqual(listLabels(list), expectedLabels)
    assert.equal(createHarness(region).render().props['data-paused'], 'false', 'pause state is not shared between instances')
  }
})

test('scoped CSS makes equal-width cloned groups a continuous 24-second linear half-track loop', () => {
  const root = styleFor(carouselCSS, '.trust-carousel')
  const track = styleFor(carouselCSS, '.trust-carousel__track')
  const group = styleFor(carouselCSS, '.trust-carousel__group')
  assert.equal(root.width, '100%')
  assert.equal(root['min-width'], '0')
  assert.equal(root.overflow, 'hidden')
  assert.equal(track.display, 'flex')
  assert.equal(track.width, 'max-content')
  assert.equal(track.gap, '0')
  assert.equal(track.animation, 'trust-carousel-scroll 24s linear infinite')
  assert.equal(group['flex-shrink'], '0')
  assert.equal(group['min-width'], '100vw')
  assert.equal(group.margin, '0')
  assert.equal(group.padding, '0')
  const frames = scopedBlock(/^@keyframes\s+trust-carousel-scroll$/)
  assert.equal(styleFor(frames, 'from').transform, 'translateX(0)')
  assert.equal(styleFor(frames, 'to').transform, 'translateX(-50%)')
})

test('the frosted backdrop is confined to a stationary decorative surface, never the text or moving track', () => {
  const surfaceStyle = styleFor(carouselCSS, '.trust-carousel__surface')
  const viewportStyle = styleFor(carouselCSS, '.trust-carousel__viewport')
  assert.equal(surfaceStyle.position, 'absolute')
  assert.equal(surfaceStyle.inset, '0')
  assert.equal(surfaceStyle['pointer-events'], 'none')
  assert.match(surfaceStyle['backdrop-filter'], /^blur\(\d+(?:\.\d+)?px\)$/)
  assert.equal(surfaceStyle['-webkit-backdrop-filter'], surfaceStyle['backdrop-filter'])
  assert.ok(Number(surfaceStyle['z-index']) < Number(viewportStyle['z-index']))
  for (const rule of allStyleRules(carouselCSS)) {
    assert.ok(!/blur\(/.test(rule.declarations.filter ?? ''), `${rule.selector}: do not blur rendered text`)
    for (const property of ['backdrop-filter', '-webkit-backdrop-filter']) {
      if (rule.declarations[property] && rule.declarations[property] !== 'none') {
        assert.equal(rule.selector, '.trust-carousel__surface', 'only the separate surface blurs the background')
      }
    }
  }
  for (const region of REGIONS) {
    const tree = createHarness(region).render()
    const surface = byClass(tree, 'trust-carousel__surface')
    const wash = byClass(tree, 'trust-carousel__wash')
    const viewport = byClass(tree, 'trust-carousel__viewport')
    const direct = [tree.props.children].flat(Infinity).filter(Boolean)
    for (const layer of [surface, wash]) {
      assert.ok(isHidden(layer))
      assert.ok(direct.includes(layer))
      assert.equal(content(layer), '')
      assert.equal(descendants(layer).includes(viewport), false)
    }
    assert.ok(direct.includes(viewport))
    for (const node of descendants(viewport)) {
      assert.doesNotMatch(node.props?.className ?? '', /(?:^|\s)(?:backdrop-blur|blur)-/)
      assert.equal(node.props?.style?.filter, undefined)
      assert.equal(node.props?.style?.backdropFilter, undefined)
    }
  }
})

test('manual pause and pointer hover pause the moving viewport without trapping the resume button under a parent hover rule', () => {
  const manualRules = cssBlocks(carouselCSS).filter((block) =>
    /^\.trust-carousel\[data-paused=(?:'true'|"true")\]\s+\.trust-carousel__track$/.test(block.header))
  assert.equal(manualRules.length, 1)
  assert.equal(declarations(manualRules[0].body)['animation-play-state'], 'paused')
  const hover = scopedBlock(/^@media\s*\(hover:\s*hover\)$/)
  assert.equal(styleFor(hover, '.trust-carousel__viewport:hover .trust-carousel__track')['animation-play-state'], 'paused')
  const hoverPauseRules = allStyleRules(carouselCSS).filter((rule) =>
    rule.selector.includes(':hover') && rule.declarations['animation-play-state'] === 'paused')
  assert.equal(hoverPauseRules.length, 1)
  assert.equal(hoverPauseRules[0].selector, '.trust-carousel__viewport:hover .trust-carousel__track')
  assert.ok(styleFor(carouselCSS, '.trust-carousel__toggle:focus-visible').outline,
    'the keyboard pause/resume control retains a visible focus indicator')
})

test('reduced-motion CSS stops animation, removes edge masks, wraps all primary items and hides the clone and unnecessary control', () => {
  const reduced = scopedBlock(/^@media\s*\(prefers-reduced-motion:\s*reduce\)$/)
  const track = styleFor(reduced, '.trust-carousel__track')
  const viewport = styleFor(reduced, '.trust-carousel__viewport')
  const group = styleFor(reduced, '.trust-carousel__group')
  const item = styleFor(reduced, '.trust-carousel__item')
  assert.equal(track.animation, 'none')
  assert.equal(track.transform, 'none')
  assert.equal(track.width, '100%')
  assert.equal(viewport['mask-image'], 'none')
  assert.equal(viewport['-webkit-mask-image'], 'none')
  assert.equal(viewport['margin-inline-end'], '0')
  assert.equal(group['flex-wrap'], 'wrap')
  assert.equal(group.width, '100%')
  assert.equal(group['min-width'], '0')
  assert.equal(item['white-space'], 'normal')
  assert.equal(item['flex-shrink'], '1')
  assert.equal(item['min-width'], '0')
  assert.equal(item['max-width'], '100%')
  assert.notEqual(group.display, 'none', 'all four primary labels remain visible')
  assert.equal(styleFor(reduced, '.trust-carousel__group--duplicate').display, 'none')
  assert.equal(styleFor(reduced, '.trust-carousel__toggle').display, 'none')
})

test('the existing regional catalog retains every product, local copy and research/price/photo notices below the hero', () => {
  for (const region of REGIONS) {
    const tree = createHarness(region).renderCatalog()
    const copy = catalogCopy[region.language]
    const cards = descendants(tree).filter((node) => node.type === 'ProductCard')
    assert.equal(tree.props.id, 'katalog')
    assert.deepEqual(cards.map((card) => card.props.product.slug), products.map((product) => product.slug))
    for (const [index, card] of cards.entries()) {
      assert.equal(card.props.product.name, products[index].name)
      assert.equal(card.props.product.image, products[index].image)
    }
    for (const text of [copy.heading, copy.intro, copy.priceNotice, copy.photoNotice, copy.researchOnly, copy.talkToTeam]) {
      assert.ok(content(tree).includes(text), region.id)
    }
    assert.equal(descendants(tree).some((node) => node.props?.id === 'quality-highlights'), false)
  }
})
