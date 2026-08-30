import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import * as productData from './products.ts'
import * as productCopy from './product-copy.ts'
import * as pricing from './region-pricing.ts'
import { getRegion, regionPath } from './regions.ts'
import { buildConsultationEmail, CONTACT_EMAIL, SUPPORT_COPY } from './support-copy.ts'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const jsxRuntime = require('react/jsx-runtime')

// Independent expectations for the eight approved Indonesian catalog products.
// Do not derive these from the production price map: reintroducing one flat
// price, mixing formats, or looking up the wrong product must fail these tests.
const indonesianPriceLabels = {
  retatrutide: { cartridge: 'IDR 1.199.000', pen: 'IDR 1.799.000' },
  'cjc-1295-ipamorelin': { cartridge: 'IDR 1.298.000', pen: 'IDR 1.898.000' },
  klow80: { cartridge: 'IDR 2.000.000', pen: 'IDR 2.600.000' },
  'mots-c': { cartridge: 'IDR 1.376.000', pen: 'IDR 1.976.000' },
  'nad-plus': { cartridge: 'IDR 1.362.000', pen: 'IDR 1.962.000' },
  tesamorelin: { cartridge: 'IDR 1.572.000', pen: 'IDR 2.172.000' },
  'bpc-157': { cartridge: 'IDR 1.362.000', pen: 'IDR 1.962.000' },
  'ghk-cu': { cartridge: 'IDR 1.278.000', pen: 'IDR 1.878.000' },
}

// Exercise real TSX render paths and event handlers. Only React state,
// framework/image/icon rendering, and the consultation context are controlled
// boundaries. Product data, copy, price lookup/formatting and email drafts are
// the real implementations. No browser, network, email send or new dependency.
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

const cardSource = compileComponent('../components/product-card.tsx')
const detailSource = compileComponent('../components/product-detail.tsx')
const consultationButtonSource = compileComponent('../components/consultation-button.tsx')

function loadComponent(source, dependencies) {
  const componentModule = { exports: {} }
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

const normalizedContent = (node) => content(node).replace(/\s+/g, ' ').trim()
const directChildren = (node) => [node.props?.children].flat(Infinity).filter(Boolean)

function priceAndUnit(tree) {
  // Both real components present a price and a separately styled / unit label.
  // Inspect that semantic pair rather than implementation-specific CSS.
  const blocks = descendants(tree).filter((node) => node.type === 'div' &&
    directChildren(node).some((child) => child.type === 'span' && normalizedContent(child).startsWith('/ ')))
  assert.equal(blocks.length, 1, 'one primary price/unit pair is rendered')
  const spans = directChildren(blocks[0]).filter((node) => node.type === 'span')
  assert.equal(spans.length, 2)
  return { price: normalizedContent(spans[0]), unit: normalizedContent(spans[1]) }
}

function formatButtons(tree) {
  const fieldsets = descendants(tree).filter((node) => node.type === 'fieldset')
  assert.equal(fieldsets.length, 1, 'the format selector is present')
  const buttons = descendants(fieldsets[0]).filter((node) => node.type === 'button')
  assert.equal(buttons.length, 2, 'both package formats are offered')
  return buttons
}

function formatButton(tree, label) {
  const matches = formatButtons(tree).filter((button) =>
    directChildren(button).some((node) => node.type === 'span' && normalizedContent(node) === label))
  assert.equal(matches.length, 1, `format button for ${label}`)
  return matches[0]
}

function assertFormatButtons(tree, language, prices, selectedVariant) {
  for (const variant of ['cartridge', 'pen']) {
    const label = productCopy.catalogCopy[language].variants[variant].label
    const button = formatButton(tree, label)
    const spans = directChildren(button).filter((node) => node.type === 'span')
    assert.equal(normalizedContent(spans[1]), prices[variant], `${label} button price`)
    assert.equal(button.props['aria-pressed'], variant === selectedVariant, `${label} selection state`)
  }
}

function inquiryButton(tree) {
  const buttons = descendants(tree).filter((node) => node.type === 'ConsultationButton')
  assert.equal(buttons.length, 1, 'one consultation entry point is rendered')
  return buttons[0]
}

function galleryButtons(tree) {
  const buttons = descendants(tree).filter((node) => node.type === 'button' &&
    typeof node.props['aria-label'] === 'string' &&
    descendants(node).some((child) => child.type === 'ProductImage'))
  assert.equal(buttons.length, 3, 'both package images and the individual product image are present')
  return buttons
}

function primaryImage(tree) {
  const images = descendants(tree).filter((node) => node.type === 'ProductImage' && node.props.priority === true)
  assert.equal(images.length, 1)
  return images[0]
}

function createHarness(regionId) {
  const region = getRegion(regionId)
  assert.ok(region)
  const state = []
  let stateIndex = 0
  const consultationRequests = []
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
    'next/image': 'ProductImage',
    'next/link': 'RegionalLink',
    'lucide-react': {
      ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', FlaskConical: 'FlaskConical',
      FileCheck2: 'FileCheck2', Truck: 'Truck', Headset: 'Headset', MessageCircle: 'MessageCircle',
    },
    '@/components/consultation-button': { ConsultationButton: 'ConsultationButton' },
    '@/components/ui/button': { Button: 'Button' },
    '@/components/consultation-modal': { useConsultation: () => ({ open: (name) => consultationRequests.push(name) }) },
    '@/components/region-provider': {
      useRegion: () => ({ region, language: region.language, href: (path) => regionPath(region.id, path) }),
    },
    '@/lib/products': productData,
    '@/lib/product-copy': productCopy,
    '@/lib/region-pricing': pricing,
    '@/lib/support-copy': { SUPPORT_COPY },
  }
  const { ProductCard } = loadComponent(cardSource, dependencies)
  const { ProductDetail } = loadComponent(detailSource, dependencies)
  const { ConsultationButton } = loadComponent(consultationButtonSource, dependencies)

  return {
    region,
    consultationRequests,
    renderCard(product) { return ProductCard({ product }) },
    renderDetail(product) {
      stateIndex = 0
      return ProductDetail({ product })
    },
    openInquiry(tree) {
      // Pass the real ProductDetail props through the real button handler to
      // the controlled context. Merely rendering must never open a request.
      const button = ConsultationButton(inquiryButton(tree).props)
      assert.equal(button.type, 'Button')
      button.props.onClick({ defaultPrevented: false })
      return consultationRequests.at(-1)
    },
  }
}

test('all eight Indonesian product cards render their own cartridge-set price with IDR grouping and unit', () => {
  assert.deepEqual(Object.keys(indonesianPriceLabels).sort(), productData.products.map((product) => product.slug).sort())
  assert.equal(productCopy.catalogCopy.id.variants.cartridge.label, 'Cartridge Set')
  const harness = createHarness('id')
  const renderedPrices = []
  for (const product of productData.products) {
    const tree = harness.renderCard(product)
    const pair = priceAndUnit(tree)
    assert.deepEqual(pair, { price: indonesianPriceLabels[product.slug].cartridge, unit: '/ cartridge set' }, product.slug)
    assert.equal(tree.type, 'RegionalLink')
    assert.equal(tree.props.href, `/id/product/${product.slug}`)
    assert.doesNotMatch(pair.price, /2\.500\.000|3\.500\.000/, 'retired flat prices must not reappear')
    renderedPrices.push(pair.price)
  }
  assert.equal(new Set(renderedPrices).size, 7, 'only the two intentionally equal cartridge prices match')
  assert.deepEqual(harness.consultationRequests, [])
})

test('Indonesian detail pages start with the matching cartridge-set price and show both product-specific format prices', () => {
  for (const product of productData.products) {
    const harness = createHarness('id')
    const tree = harness.renderDetail(product)
    const prices = indonesianPriceLabels[product.slug]
    assert.deepEqual(priceAndUnit(tree), { price: prices.cartridge, unit: '/ cartridge set' }, product.slug)
    assertFormatButtons(tree, 'id', prices, 'cartridge')
    assert.equal(inquiryButton(tree).props.productName, `${product.name} — Cartridge Set`)
    assert.equal(primaryImage(tree).props.src, '/products/cartridge-package.jpeg')
    assert.deepEqual(harness.consultationRequests, [])
  }
})

test('selecting Paket Pen and then Cartridge Set updates the actual detail price, unit and selected buttons for every product', () => {
  assert.equal(productCopy.catalogCopy.id.variants.pen.label, 'Paket Pen')
  for (const product of productData.products) {
    const harness = createHarness('id')
    const prices = indonesianPriceLabels[product.slug]
    let tree = harness.renderDetail(product)
    formatButton(tree, 'Paket Pen').props.onClick()
    tree = harness.renderDetail(product)
    assert.deepEqual(priceAndUnit(tree), { price: prices.pen, unit: '/ paket pen' }, product.slug)
    assertFormatButtons(tree, 'id', prices, 'pen')
    assert.equal(primaryImage(tree).props.src, '/products/pen-package.jpeg')
    assert.equal(inquiryButton(tree).props.productName, `${product.name} — Paket Pen`)

    formatButton(tree, 'Cartridge Set').props.onClick()
    tree = harness.renderDetail(product)
    assert.deepEqual(priceAndUnit(tree), { price: prices.cartridge, unit: '/ cartridge set' }, product.slug)
    assertFormatButtons(tree, 'id', prices, 'cartridge')
    assert.equal(primaryImage(tree).props.src, '/products/cartridge-package.jpeg')
    assert.equal(inquiryButton(tree).props.productName, `${product.name} — Cartridge Set`)
    assert.deepEqual(harness.consultationRequests, [], 'format changes do not start an enquiry')
  }
})

test('gallery package selection updates prices and the individual product photo preserves the selected package', () => {
  for (const product of productData.products) {
    const harness = createHarness('id')
    const prices = indonesianPriceLabels[product.slug]
    let tree = harness.renderDetail(product)
    galleryButtons(tree)[1].props.onClick()
    tree = harness.renderDetail(product)
    assert.deepEqual(priceAndUnit(tree), { price: prices.pen, unit: '/ paket pen' }, product.slug)
    assertFormatButtons(tree, 'id', prices, 'pen')

    galleryButtons(tree)[2].props.onClick()
    tree = harness.renderDetail(product)
    assert.equal(primaryImage(tree).props.src, product.image)
    assert.deepEqual(priceAndUnit(tree), { price: prices.pen, unit: '/ paket pen' }, product.slug)
    assert.equal(inquiryButton(tree).props.productName, `${product.name} — Paket Pen`)

    galleryButtons(tree)[0].props.onClick()
    tree = harness.renderDetail(product)
    assert.deepEqual(priceAndUnit(tree), { price: prices.cartridge, unit: '/ cartridge set' }, product.slug)
    assertFormatButtons(tree, 'id', prices, 'cartridge')
  }
})

test('all sixteen selected Indonesian product/package combinations reach the consultation context and encoded email drafts', () => {
  for (const product of productData.products) {
    const harness = createHarness('id')
    let tree = harness.renderDetail(product)
    for (const variant of ['cartridge', 'pen']) {
      const label = productCopy.catalogCopy.id.variants[variant].label
      formatButton(tree, label).props.onClick()
      tree = harness.renderDetail(product)
      const countBeforeClick = harness.consultationRequests.length
      const productName = harness.openInquiry(tree)
      assert.equal(harness.consultationRequests.length, countBeforeClick + 1)
      assert.equal(productName, `${product.name} — ${label}`)
      const draft = buildConsultationEmail({
        region: harness.region, language: 'id', productName,
        countryDial: '+62', phoneNumber: '000000000',
      })
      assert.ok(draft.subject.includes(productName), `${product.slug}/${variant}: subject retains selected package`)
      assert.ok(draft.body.includes(productName), `${product.slug}/${variant}: body retains selected package`)
      assert.ok(draft.subject.includes('Indonesia (IDR)'))
      assert.ok(draft.body.includes('IDR'))
      for (const url of [draft.mailtoUrl, draft.gmailUrl]) {
        assert.equal(new URL(url).searchParams.get('body'), draft.body)
      }
      assert.equal(new URL(draft.gmailUrl).searchParams.get('to'), CONTACT_EMAIL)
      assert.equal(new URL(draft.mailtoUrl).pathname, CONTACT_EMAIL)
    }
  }
})

test('EUR cards and detail format switching retain EUR 143 / EUR 200 and the original inquiry product name', () => {
  for (const product of productData.products) {
    const harness = createHarness('eu')
    const prices = { cartridge: 'EUR 143', pen: 'EUR 200' }
    const card = harness.renderCard(product)
    assert.deepEqual(priceAndUnit(card), { price: prices.cartridge, unit: '/ cartridge' }, product.slug)
    assert.equal(card.props.href, `/eu/product/${product.slug}`)
    let tree = harness.renderDetail(product)
    assert.deepEqual(priceAndUnit(tree), { price: prices.cartridge, unit: '/ cartridge' }, product.slug)
    assertFormatButtons(tree, 'en', prices, 'cartridge')
    assert.equal(inquiryButton(tree).props.productName, product.name)

    formatButton(tree, 'Pen Package').props.onClick()
    tree = harness.renderDetail(product)
    assert.deepEqual(priceAndUnit(tree), { price: prices.pen, unit: '/ pen package' }, product.slug)
    assertFormatButtons(tree, 'en', prices, 'pen')
    assert.equal(harness.openInquiry(tree), product.name, 'non-Indonesian inquiry behavior is unchanged')
  }
})

test('the other five markets keep currency-specific inquiry labels in cards and both detail formats', () => {
  for (const regionId of ['au', 'us', 'uk', 'sg', 'my']) {
    for (const product of productData.products) {
      const harness = createHarness(regionId)
      const { region } = harness
      const copy = productCopy.catalogCopy[region.language]
      const expected = region.language === 'ms' ? 'Tanya harga MYR' : `Request ${region.currency} pricing`
      assert.deepEqual(priceAndUnit(harness.renderCard(product)), {
        price: expected, unit: `/ ${copy.variants.cartridge.label.toLowerCase()}`,
      }, `${regionId}/${product.slug}`)
      let tree = harness.renderDetail(product)
      assert.equal(priceAndUnit(tree).price, expected)
      assertFormatButtons(tree, region.language, { cartridge: expected, pen: expected }, 'cartridge')
      formatButton(tree, copy.variants.pen.label).props.onClick()
      tree = harness.renderDetail(product)
      assert.deepEqual(priceAndUnit(tree), { price: expected, unit: `/ ${copy.variants.pen.label.toLowerCase()}` })
      assertFormatButtons(tree, region.language, { cartridge: expected, pen: expected }, 'pen')
      assert.equal(inquiryButton(tree).props.productName, product.name)
    }
  }
})

test('an Indonesian product without an approved price renders an inquiry rather than either retired flat amount', () => {
  const product = { ...productData.products[0], slug: 'unpriced-regression-fixture' }
  const harness = createHarness('id')
  assert.deepEqual(priceAndUnit(harness.renderCard(product)), { price: 'Tanya harga IDR', unit: '/ cartridge set' })
  let tree = harness.renderDetail(product)
  assertFormatButtons(tree, 'id', { cartridge: 'Tanya harga IDR', pen: 'Tanya harga IDR' }, 'cartridge')
  assert.deepEqual(priceAndUnit(tree), { price: 'Tanya harga IDR', unit: '/ cartridge set' })
  formatButton(tree, 'Paket Pen').props.onClick()
  tree = harness.renderDetail(product)
  assert.deepEqual(priceAndUnit(tree), { price: 'Tanya harga IDR', unit: '/ paket pen' })
  assert.doesNotMatch(normalizedContent(tree), /2\.500\.000|3\.500\.000/)
})
