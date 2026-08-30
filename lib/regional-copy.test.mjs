import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import { REGIONS } from './regions.ts'
import { HOME_TAGLINE, homeCopy } from './home-copy.ts'
import { SUPPORT_COPY } from './support-copy.ts'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const jsxRuntime = require('react/jsx-runtime')
const expectedTagline = 'European research-grade peptides, delivered with precision.'

// Exercise the actual components with a regional context. Animation, icon and
// button boundaries are substituted; the copy and conditional UI are real.
function compileComponent(path) {
  return ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
}

const heroSource = compileComponent('../components/hero.tsx')
const reviewsSource = compileComponent('../components/reviews.tsx')

function loadComponent(source, region) {
  const componentModule = { exports: {} }
  const dependencies = {
    'react/jsx-runtime': jsxRuntime,
    'lucide-react': { FlaskConical: 'LabIcon', Headset: 'SupportIcon', Truck: 'ShippingIcon', Star: 'RatingStar' },
    'framer-motion': { motion: { div: 'div', h1: 'h1', p: 'p', ul: 'ul' } },
    '@/components/ui/button': { Button: 'Button' },
    '@/components/consultation-button': { ConsultationButton: 'ConsultationButton' },
    '@/components/trust-carousel': { TrustCarousel: 'TrustCarousel' },
    '@/components/reveal': { Reveal: 'Reveal', Stagger: 'Stagger', StaggerItem: 'StaggerItem' },
    '@/components/region-provider': { useRegion: () => ({ region, language: region.language }) },
    '@/lib/home-copy': { HOME_TAGLINE, homeCopy },
  }
  vm.runInNewContext(source, {
    module: componentModule,
    exports: componentModule.exports,
    Intl,
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

test('every regional hero renders the exact shared English tagline with English language markup', () => {
  assert.equal(`${HOME_TAGLINE.headline} ${HOME_TAGLINE.accent}`, expectedTagline)
  for (const region of REGIONS) {
    const { Hero } = loadComponent(heroSource, region)
    const tree = Hero()
    const headings = descendants(tree).filter((node) => node.type === 'h1')
    assert.equal(headings.length, 1, region.id)
    assert.equal(content(headings[0]), expectedTagline, region.id)
    assert.equal(headings[0].props.lang, 'en', region.id)
    assert.ok(content(tree).includes(homeCopy[region.language].hero.body), region.id)
  }
})

test('each hero ends with one full-width trust carousel while retaining its regional copy, catalog CTA, consultation and video', () => {
  for (const region of REGIONS) {
    const { Hero } = loadComponent(heroSource, region)
    const tree = Hero()
    const nodes = descendants(tree)
    const copy = homeCopy[region.language]
    const carousels = nodes.filter((node) => node.type === 'TrustCarousel')
    assert.equal(tree.type, 'section')
    assert.equal(tree.props.id, 'beranda')
    assert.equal(carousels.length, 1, region.id)
    const rootChildren = [tree.props.children].flat(Infinity).filter(Boolean)
    assert.equal(rootChildren.at(-1), carousels[0], 'the carousel is a direct, final child outside the constrained hero copy')
    const copyWrappers = rootChildren.filter((node) => /\bmax-w-6xl\b/.test(node.props?.className ?? ''))
    assert.equal(copyWrappers.length, 1)
    assert.equal(descendants(copyWrappers[0]).includes(carousels[0]), false)
    assert.ok(content(tree).includes(copy.hero.body))
    assert.ok(content(tree).includes(copy.hero.trusted))
    assert.ok(content(tree).includes(region.nativeName))
    assert.ok(content(tree).includes(`${region.currency} · ${region.languageName}`))
    for (const removedBadge of copy.hero.trust) {
      assert.ok(!content(tree).includes(removedBadge), `${region.id}: the previous three-card trust row is removed`)
    }

    const catalogButtons = nodes.filter((node) => node.type === 'Button')
    assert.equal(catalogButtons.length, 1)
    assert.equal(content(catalogButtons[0]), copy.viewCatalog)
    assert.equal(catalogButtons[0].props.render.type, 'a')
    assert.equal(catalogButtons[0].props.render.props.href, '#katalog')
    const consultationButtons = nodes.filter((node) => node.type === 'ConsultationButton')
    assert.equal(consultationButtons.length, 1)
    assert.equal(content(consultationButtons[0]), copy.freeConsultation)

    const videos = nodes.filter((node) => node.type === 'video')
    assert.equal(videos.length, 1)
    for (const flag of ['autoPlay', 'muted', 'loop', 'playsInline']) assert.equal(videos[0].props[flag], true)
    assert.equal(videos[0].props.poster, '/hero-pen-poster.jpg')
    const sources = descendants(videos[0]).filter((node) => node.type === 'source')
    assert.equal(sources.length, 1)
    assert.equal(sources[0].props.src, '/hero-pen.mp4')
    assert.equal(sources[0].props.type, 'video/mp4')
  }
})

test('the brand tagline stays in English in all regional footers', () => {
  for (const language of ['en', 'ms', 'id']) {
    assert.equal(SUPPORT_COPY[language].footer.tagline, expectedTagline, language)
  }
})

test('Indonesian sample comments are distinct and explicitly not real customer testimonials', () => {
  const reviews = homeCopy.id.reviews
  assert.equal(reviews.isSample, true)
  assert.equal(reviews.rating, '')
  assert.match(reviews.sampleNotice, /bukan/i)
  assert.match(reviews.sampleNotice, /testimoni|ulasan/i)
  assert.match(reviews.sampleLabel, /contoh/i)
  assert.equal(reviews.items.length, 9)
  assert.equal(new Set(reviews.items.map((item) => item.body)).size, reviews.items.length)
  const otherNames = new Set([...homeCopy.en.reviews.items, ...homeCopy.ms.reviews.items].map((item) => item.name))
  for (const item of reviews.items) {
    assert.match(item.name, /contoh/i)
    assert.match(item.detail, /bukan/i)
    assert.ok(!otherNames.has(item.name))
    assert.ok(item.body.length > 35)
  }
})

test('the Indonesian review section labels every sample and shows no stars or aggregate rating', () => {
  const region = REGIONS.find((item) => item.id === 'id')
  const { Reviews } = loadComponent(reviewsSource, region)
  const tree = Reviews()
  const nodes = descendants(tree)
  const note = nodes.find((node) => node.props?.role === 'note')
  assert.equal(content(note), homeCopy.id.reviews.sampleNotice)
  assert.equal(nodes.filter((node) => node.type === 'RatingStar').length, 0)
  assert.equal(nodes.filter((node) => node.type === 'StaggerItem').length, homeCopy.id.reviews.items.length)
  assert.equal(nodes.filter((node) => node.type === 'span' && content(node) === homeCopy.id.reviews.sampleLabel).length, homeCopy.id.reviews.items.length)
  assert.doesNotMatch(content(tree), /4[.,]9|107|terverifikasi|verified/i)
})

test('other regional review sections retain their existing content and are not relabeled as Indonesian samples', () => {
  for (const region of REGIONS.filter((item) => item.id !== 'id')) {
    const { Reviews } = loadComponent(reviewsSource, region)
    const tree = Reviews()
    const nodes = descendants(tree)
    const copy = homeCopy[region.language].reviews
    assert.equal(nodes.some((node) => node.props?.role === 'note'), false)
    assert.equal(nodes.filter((node) => node.type === 'RatingStar').length, 5 + copy.items.length * 5)
    assert.ok(content(tree).includes(copy.rating))
    for (const review of copy.items) assert.ok(content(tree).includes(review.body))
  }
})
