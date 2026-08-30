import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import * as productData from './products.ts'
import * as productCopy from './product-copy.ts'
import * as pricing from './region-pricing.ts'
import { REGIONS, getRegion, regionPath } from './regions.ts'
import { buildConsultationEmail, CONTACT_EMAIL, SUPPORT_COPY } from './support-copy.ts'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const jsxRuntime = require('react/jsx-runtime')

// Independent expectations for the eight approved Indonesian catalog products.
// Do not derive these from the production price map: reintroducing one flat
// price, mixing formats, or looking up the wrong product must fail these tests.
const indonesianPriceLabels = {
  retatrutide: { basic: 'IDR 999,000', cartridge: 'IDR 1,199,000', pen: 'IDR 1,799,000' },
  'cjc-1295-ipamorelin': { basic: 'IDR 1,098,000', cartridge: 'IDR 1,298,000', pen: 'IDR 1,898,000' },
  klow80: { basic: 'IDR 1,800,000', cartridge: 'IDR 2,000,000', pen: 'IDR 2,600,000' },
  'mots-c': { basic: 'IDR 1,176,000', cartridge: 'IDR 1,376,000', pen: 'IDR 1,976,000' },
  'nad-plus': { basic: 'IDR 1,162,000', cartridge: 'IDR 1,362,000', pen: 'IDR 1,962,000' },
  tesamorelin: { basic: 'IDR 1,372,000', cartridge: 'IDR 1,572,000', pen: 'IDR 2,172,000' },
  'bpc-157': { basic: 'IDR 1,162,000', cartridge: 'IDR 1,362,000', pen: 'IDR 1,962,000' },
  'ghk-cu': { basic: 'IDR 1,078,000', cartridge: 'IDR 1,278,000', pen: 'IDR 1,878,000' },
}
const indonesianVariants = ['basic', 'cartridge', 'pen']
const cardImageSuffixes = {
  en: 'research cartridge',
  ms: 'cartridge untuk kajian makmal',
  id: 'cartridge untuk riset laboratorium',
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
const formatsSource = compileComponent('../components/formats.tsx')
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
  const units = spans.filter((node) => normalizedContent(node).startsWith('/ '))
  assert.equal(units.length, 1)
  const priceParts = spans.filter((node) => node !== units[0])
  assert.ok(priceParts.length > 0)
  return { price: priceParts.map(normalizedContent).join(' '), unit: normalizedContent(units[0]) }
}

function formatButtons(tree) {
  const fieldsets = descendants(tree).filter((node) => node.type === 'fieldset')
  assert.equal(fieldsets.length, 1, 'the format selector is present')
  const buttons = descendants(fieldsets[0]).filter((node) => node.type === 'button')
  assert.ok(buttons.length >= 2, 'the available package formats are offered')
  return buttons
}

function formatButton(tree, label) {
  const matches = formatButtons(tree).filter((button) =>
    directChildren(button).some((node) => node.type === 'span' && normalizedContent(node) === label))
  assert.equal(matches.length, 1, `format button for ${label}`)
  return matches[0]
}

function assertFormatButtons(tree, language, prices, selectedVariant) {
  const variants = Object.keys(prices)
  const buttons = formatButtons(tree)
  assert.equal(buttons.length, variants.length, 'only the expected regional packages are offered')
  assert.deepEqual(buttons.map((button) => normalizedContent(directChildren(button)[0])),
    variants.map((variant) => productCopy.catalogCopy[language].variants[variant].label),
    'packages retain their intended order')
  for (const variant of variants) {
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

function assertCardImage(tree, product, language) {
  const images = descendants(tree).filter((node) => node.type === 'ProductImage')
  assert.equal(images.length, 1)
  assert.equal(images[0].props.src, product.image, 'catalog cards retain the supplied individual cartridge photo')
  assert.equal(images[0].props.alt, `Regen ${product.name} — ${cardImageSuffixes[language]}`,
    'the existing photo is not relabeled as a Basic package photo')
}

function assertBasicPresentation(tree, product) {
  const copy = productCopy.catalogCopy.id
  assert.deepEqual(priceAndUnit(tree), { price: indonesianPriceLabels[product.slug].basic, unit: '/ paket basic' })
  assert.equal(primaryImage(tree).props.src, product.image, 'Basic uses the existing individual product photo')
  assert.equal(primaryImage(tree).props.alt, `Regen ${product.name} — ${cardImageSuffixes.id}`)
  assert.ok(typeof copy.basicPhotoNotice === 'string' && copy.basicPhotoNotice.length > 20,
    'Basic must explain the illustrative existing photo')
  assert.ok(normalizedContent(tree).includes(copy.basicPhotoNotice))
  assert.ok(!normalizedContent(tree).includes(copy.labelReference), 'cartridge click references are hidden for Basic')
  assert.doesNotMatch(normalizedContent(tree), /\b\d+\s*(?:clicks|klik)\b/i,
    'a cartridge click count must not be presented as a Basic reference')
}

function createHarness(regionId) {
  let region = getRegion(regionId)
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
      ImageOff: 'ImageOff',
    },
    '@/components/consultation-button': { ConsultationButton: 'ConsultationButton' },
    '@/components/reveal': { Reveal: 'Reveal', Stagger: 'Stagger', StaggerItem: 'StaggerItem' },
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
  const { Formats } = loadComponent(formatsSource, dependencies)
  const { ConsultationButton } = loadComponent(consultationButtonSource, dependencies)

  return {
    get region() { return region },
    setRegion(nextRegionId) {
      region = getRegion(nextRegionId)
      assert.ok(region)
    },
    consultationRequests,
    renderCard(product) { return ProductCard({ product }) },
    renderFormats() { return Formats() },
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

test('all seven format overviews preserve the original package images and only Indonesia adds an explicitly photo-free Basic card', () => {
  const existingImages = {
    cartridge: '/products/cartridge-package.jpeg',
    pen: '/products/pen-package.jpeg',
  }
  for (const region of REGIONS) {
    const harness = createHarness(region.id)
    const tree = harness.renderFormats()
    const nodes = descendants(tree)
    const cards = nodes.filter((node) => node.type === 'StaggerItem')
    const variants = region.id === 'id' ? indonesianVariants : ['cartridge', 'pen']
    const copy = productCopy.catalogCopy[region.language]
    assert.equal(cards.length, variants.length, `${region.id}: only the region's package cards are shown`)
    assert.equal(nodes.filter((node) => node.type === 'ProductImage').length, 2,
      `${region.id}: no new package image is invented`)
    assert.equal(nodes.filter((node) => node.type === 'ImageOff').length, region.id === 'id' ? 1 : 0)
    assert.ok(normalizedContent(tree).includes(copy.formatsHeading))
    assert.ok(normalizedContent(tree).includes(copy.formatsBody))

    for (const [index, variant] of variants.entries()) {
      const card = cards[index]
      const cardNodes = descendants(card)
      const headings = cardNodes.filter((node) => node.type === 'h3')
      assert.equal(headings.length, 1)
      assert.equal(normalizedContent(headings[0]), copy.formats[variant].name)
      assert.ok(normalizedContent(card).includes(copy.formats[variant].body))
      const images = cardNodes.filter((node) => ['ProductImage', 'img', 'picture'].includes(node.type))
      if (variant === 'basic') {
        assert.equal(images.length, 0, 'Basic uses text and the ImageOff icon, not a made-up package photo')
        assert.equal(cardNodes.some((node) => Object.hasOwn(node.props ?? {}, 'src')), false)
        const placeholderIcon = cardNodes.find((node) => node.type === 'ImageOff')
        assert.ok(placeholderIcon)
        assert.equal(String(placeholderIcon.props['aria-hidden']), 'true')
        assert.ok(normalizedContent(card).includes('Foto paket menyusul'))
        assert.ok(normalizedContent(card).includes('Isi paket dikonfirmasi tim kami.'))
      } else {
        assert.equal(images.length, 1)
        assert.equal(images[0].type, 'ProductImage')
        assert.equal(images[0].props.src, existingImages[variant])
        assert.equal(images[0].props.alt, `Regen — ${copy.variants[variant].alt}`)
        assert.equal(cardNodes.some((node) => node.type === 'ImageOff'), false)
      }
    }

    if (region.id !== 'id') {
      assert.ok(!normalizedContent(tree).includes(copy.formats.basic.name))
      assert.doesNotMatch(normalizedContent(tree), /Foto paket menyusul|Isi paket dikonfirmasi tim kami\./)
    }
    assert.deepEqual(harness.consultationRequests, [])
  }
})

test('all eight Indonesian cards start from their Basic price with comma-grouped IDR while retaining the original cartridge photo', () => {
  assert.deepEqual(Object.keys(indonesianPriceLabels).sort(), productData.products.map((product) => product.slug).sort())
  assert.equal(productCopy.catalogCopy.id.variants.basic.label, 'Paket Basic')
  assert.equal(productCopy.catalogCopy.id.variants.cartridge.label, 'Cartridge Set')
  const harness = createHarness('id')
  const renderedPrices = []
  for (const product of productData.products) {
    const tree = harness.renderCard(product)
    const pair = priceAndUnit(tree)
    assert.deepEqual(pair, { price: `mulai dari ${indonesianPriceLabels[product.slug].basic}`, unit: '/ paket basic' }, product.slug)
    assert.match(pair.price, /^mulai dari IDR \d{1,3}(?:,\d{3})+$/, 'IDR follows the requested comma-grouping example')
    assert.ok(!pair.price.includes(indonesianPriceLabels[product.slug].cartridge), 'the starting price is not the cartridge-set price')
    assert.equal(tree.type, 'RegionalLink')
    assert.equal(tree.props.href, `/id/product/${product.slug}`)
    assertCardImage(tree, product, 'id')
    assert.doesNotMatch(pair.price, /2[.,]500[.,]000|3[.,]500[.,]000/, 'retired flat prices must not reappear')
    renderedPrices.push(pair.price)
  }
  assert.equal(new Set(renderedPrices).size, 7, 'only the two intentionally equal Basic prices match')
  assert.deepEqual(harness.consultationRequests, [])
})

test('Indonesian detail pages default to Basic, render all three product-specific prices, and clearly qualify the existing photo', () => {
  for (const product of productData.products) {
    const harness = createHarness('id')
    const tree = harness.renderDetail(product)
    const prices = indonesianPriceLabels[product.slug]
    assertBasicPresentation(tree, product)
    assertFormatButtons(tree, 'id', prices, 'basic')
    assert.equal(inquiryButton(tree).props.productName, `${product.name} — Paket Basic`)
    assert.deepEqual(galleryButtons(tree).map((button) => button.props['aria-pressed']), [false, false, true])
    assert.deepEqual(harness.consultationRequests, [])
  }
})

test('switching between Pen, Cartridge Set and Basic updates the price, unit, gallery and cartridge-reference visibility', () => {
  assert.equal(productCopy.catalogCopy.id.variants.pen.label, 'Paket Pen')
  for (const product of productData.products) {
    const harness = createHarness('id')
    const prices = indonesianPriceLabels[product.slug]
    let tree = harness.renderDetail(product)
    for (const variant of ['pen', 'cartridge', 'basic']) {
      const label = productCopy.catalogCopy.id.variants[variant].label
      formatButton(tree, label).props.onClick()
      tree = harness.renderDetail(product)
      assert.deepEqual(priceAndUnit(tree), { price: prices[variant], unit: `/ ${label.toLowerCase()}` }, product.slug)
      assertFormatButtons(tree, 'id', prices, variant)
      assert.equal(inquiryButton(tree).props.productName, `${product.name} — ${label}`)
      if (variant === 'basic') {
        assertBasicPresentation(tree, product)
      } else {
        assert.equal(primaryImage(tree).props.src, `/products/${variant}-package.jpeg`)
        assert.ok(normalizedContent(tree).includes(productCopy.catalogCopy.id.labelReference))
        assert.ok(normalizedContent(tree).includes(productCopy.getProductCopy(product, 'id').dosage))
        assert.ok(!normalizedContent(tree).includes(productCopy.catalogCopy.id.basicPhotoNotice))
      }
    }
    assert.deepEqual(harness.consultationRequests, [], 'format changes do not start an enquiry')
  }
})

test('gallery package thumbnails select Cartridge or Pen while the individual product thumbnail preserves any of the three packages', () => {
  for (const product of productData.products) {
    const harness = createHarness('id')
    const prices = indonesianPriceLabels[product.slug]
    let tree = harness.renderDetail(product)
    for (const [index, variant] of [[0, 'cartridge'], [1, 'pen']]) {
      const label = productCopy.catalogCopy.id.variants[variant].label
      galleryButtons(tree)[index].props.onClick()
      tree = harness.renderDetail(product)
      assert.deepEqual(priceAndUnit(tree), { price: prices[variant], unit: `/ ${label.toLowerCase()}` }, product.slug)
      assertFormatButtons(tree, 'id', prices, variant)

      galleryButtons(tree)[2].props.onClick()
      tree = harness.renderDetail(product)
      assert.equal(primaryImage(tree).props.src, product.image)
      assert.deepEqual(priceAndUnit(tree), { price: prices[variant], unit: `/ ${label.toLowerCase()}` }, product.slug)
      assertFormatButtons(tree, 'id', prices, variant)
      assert.equal(inquiryButton(tree).props.productName, `${product.name} — ${label}`)
    }
    formatButton(tree, 'Paket Basic').props.onClick()
    tree = harness.renderDetail(product)
    galleryButtons(tree)[2].props.onClick()
    tree = harness.renderDetail(product)
    assertBasicPresentation(tree, product)
    assertFormatButtons(tree, 'id', prices, 'basic')
    assert.equal(inquiryButton(tree).props.productName, `${product.name} — Paket Basic`)
  }
})

test('all twenty-four Indonesian product/package combinations reach the consultation context and encoded email drafts', () => {
  for (const product of productData.products) {
    const harness = createHarness('id')
    let tree = harness.renderDetail(product)
    for (const variant of indonesianVariants) {
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
    assertCardImage(card, product, 'en')
    assert.doesNotMatch(normalizedContent(card), /mulai dari|Basic/i)
    let tree = harness.renderDetail(product)
    assert.deepEqual(priceAndUnit(tree), { price: prices.cartridge, unit: '/ cartridge' }, product.slug)
    assertFormatButtons(tree, 'en', prices, 'cartridge')
    assert.equal(inquiryButton(tree).props.productName, product.name)
    assert.equal(primaryImage(tree).props.src, '/products/cartridge-package.jpeg')
    assert.ok(normalizedContent(tree).includes(productCopy.catalogCopy.en.labelReference))
    assert.ok(!normalizedContent(tree).includes(productCopy.catalogCopy.en.variants.basic.label))

    formatButton(tree, 'Pen Package').props.onClick()
    tree = harness.renderDetail(product)
    assert.deepEqual(priceAndUnit(tree), { price: prices.pen, unit: '/ pen package' }, product.slug)
    assertFormatButtons(tree, 'en', prices, 'pen')
    assert.equal(primaryImage(tree).props.src, '/products/pen-package.jpeg')
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
      const card = harness.renderCard(product)
      assert.deepEqual(priceAndUnit(card), {
        price: expected, unit: `/ ${copy.variants.cartridge.label.toLowerCase()}`,
      }, `${regionId}/${product.slug}`)
      assertCardImage(card, product, region.language)
      assert.doesNotMatch(normalizedContent(card), /mulai dari|Basic/i)
      let tree = harness.renderDetail(product)
      assert.equal(priceAndUnit(tree).price, expected)
      assertFormatButtons(tree, region.language, { cartridge: expected, pen: expected }, 'cartridge')
      assert.equal(primaryImage(tree).props.src, '/products/cartridge-package.jpeg')
      assert.ok(normalizedContent(tree).includes(copy.labelReference))
      assert.ok(!normalizedContent(tree).includes(copy.variants.basic.label))
      formatButton(tree, copy.variants.pen.label).props.onClick()
      tree = harness.renderDetail(product)
      assert.deepEqual(priceAndUnit(tree), { price: expected, unit: `/ ${copy.variants.pen.label.toLowerCase()}` })
      assertFormatButtons(tree, region.language, { cartridge: expected, pen: expected }, 'pen')
      assert.equal(inquiryButton(tree).props.productName, product.name)
    }
  }
})

test('missing Indonesian prices show an inquiry for all three formats without a misleading starting-from prefix', () => {
  const product = { ...productData.products[0], slug: 'unpriced-regression-fixture' }
  const harness = createHarness('id')
  const card = harness.renderCard(product)
  assert.deepEqual(priceAndUnit(card), { price: 'Tanya harga IDR', unit: '/ paket basic' })
  assert.doesNotMatch(normalizedContent(card), /mulai dari/i)
  assertCardImage(card, product, 'id')
  let tree = harness.renderDetail(product)
  const prices = { basic: 'Tanya harga IDR', cartridge: 'Tanya harga IDR', pen: 'Tanya harga IDR' }
  assertFormatButtons(tree, 'id', prices, 'basic')
  for (const variant of indonesianVariants) {
    const label = productCopy.catalogCopy.id.variants[variant].label
    formatButton(tree, label).props.onClick()
    tree = harness.renderDetail(product)
    assertFormatButtons(tree, 'id', prices, variant)
    assert.deepEqual(priceAndUnit(tree), { price: 'Tanya harga IDR', unit: `/ ${label.toLowerCase()}` })
    assert.doesNotMatch(normalizedContent(tree), /mulai dari|2[.,]500[.,]000|3[.,]500[.,]000/i)
  }
})

test('a mounted Basic selection cannot leak into any non-Indonesian region', () => {
  for (const regionId of ['au', 'eu', 'us', 'uk', 'sg', 'my']) {
    for (const product of productData.products) {
      const harness = createHarness('id')
      assertBasicPresentation(harness.renderDetail(product), product)
      harness.setRegion(regionId)
      const tree = harness.renderDetail(product)
      const { region } = harness
      const copy = productCopy.catalogCopy[region.language]
      const quote = region.language === 'ms' ? 'Tanya harga MYR' : `Request ${region.currency} pricing`
      const prices = regionId === 'eu'
        ? { cartridge: 'EUR 143', pen: 'EUR 200' }
        : { cartridge: quote, pen: quote }
      assert.deepEqual(priceAndUnit(tree), {
        price: prices.cartridge, unit: `/ ${copy.variants.cartridge.label.toLowerCase()}`,
      }, `${regionId}/${product.slug}: the first render after switching must use an available package`)
      assertFormatButtons(tree, region.language, prices, 'cartridge')
      assert.equal(primaryImage(tree).props.src, '/products/cartridge-package.jpeg')
      assert.equal(inquiryButton(tree).props.productName, product.name)
      assert.ok(normalizedContent(tree).includes(copy.labelReference))
      assert.ok(!normalizedContent(tree).includes(copy.variants.basic.label))
      assert.deepEqual(harness.consultationRequests, [])
    }
  }
})

test('changing the product in a mounted Indonesian detail view resets to that product\'s Basic price and photo', () => {
  for (const [index, firstProduct] of productData.products.entries()) {
    const nextProduct = productData.products[(index + 1) % productData.products.length]
    const harness = createHarness('id')
    let tree = harness.renderDetail(firstProduct)
    formatButton(tree, 'Paket Pen').props.onClick()
    tree = harness.renderDetail(firstProduct)
    assert.equal(priceAndUnit(tree).price, indonesianPriceLabels[firstProduct.slug].pen)
    tree = harness.renderDetail(nextProduct)
    assertBasicPresentation(tree, nextProduct)
    assertFormatButtons(tree, 'id', indonesianPriceLabels[nextProduct.slug], 'basic')
    assert.equal(inquiryButton(tree).props.productName, `${nextProduct.name} — Paket Basic`)
    assert.deepEqual(harness.consultationRequests, [])
  }
})
