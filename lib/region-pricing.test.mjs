import assert from 'node:assert/strict'
import test from 'node:test'
import { products } from './products.ts'
import { catalogCopy, getProductCopy } from './product-copy.ts'
import { REGIONS, getRegion } from './regions.ts'
import {
  REGIONAL_PRICES,
  INDONESIAN_PRODUCT_PRICES,
  formatRegionPrice,
  getRegionalPriceAmount,
  getRegionalPriceLabel,
} from './region-pricing.ts'

// Independently transcribed from the verified 'idr pricing' D/E cells for
// existing catalog strengths only. Do not derive expected amounts from the
// implementation table or from a Basic Set price / currency conversion.
const EXPECTED_IDR_PRICES = {
  retatrutide: { cartridge: 1_199_000, pen: 1_799_000 },
  tesamorelin: { cartridge: 1_572_000, pen: 2_172_000 },
  'ghk-cu': { cartridge: 1_278_000, pen: 1_878_000 },
  'nad-plus': { cartridge: 1_362_000, pen: 1_962_000 },
  klow80: { cartridge: 2_000_000, pen: 2_600_000 },
  'cjc-1295-ipamorelin': { cartridge: 1_298_000, pen: 1_898_000 },
  'mots-c': { cartridge: 1_376_000, pen: 1_976_000 },
  'bpc-157': { cartridge: 1_362_000, pen: 1_962_000 },
}

test('each of the seven regions has both variant price settings', () => {
  assert.equal(REGIONS.length, 7)
  assert.deepEqual(Object.keys(REGIONAL_PRICES).sort(), REGIONS.map((region) => region.id).sort())
  for (const region of REGIONS) {
    assert.deepEqual(Object.keys(REGIONAL_PRICES[region.id]).sort(), ['cartridge', 'pen'])
  }
})

test('all eight Indonesian products match both verified format prices exactly', () => {
  assert.equal(Object.keys(EXPECTED_IDR_PRICES).length, 8)
  assert.deepEqual(Object.keys(INDONESIAN_PRODUCT_PRICES).sort(), products.map((product) => product.slug).sort())
  assert.deepEqual(INDONESIAN_PRODUCT_PRICES, EXPECTED_IDR_PRICES)
  for (const [slug, prices] of Object.entries(EXPECTED_IDR_PRICES)) {
    assert.deepEqual(Object.keys(INDONESIAN_PRODUCT_PRICES[slug]).sort(), ['cartridge', 'pen'])
    for (const variant of ['cartridge', 'pen']) {
      assert.equal(getRegionalPriceAmount('id', slug, variant), prices[variant], `${slug}/${variant}`)
      assert.ok(Number.isSafeInteger(prices[variant]) && prices[variant] > 0)
    }
  }
})

test('Indonesian product prices retire flat defaults without changing non-ID markets', () => {
  assert.deepEqual(REGIONAL_PRICES.id, { cartridge: null, pen: null })
  for (const product of products) {
    assert.equal(getRegionalPriceAmount('eu', product.slug, 'cartridge'), 143)
    assert.equal(getRegionalPriceAmount('eu', product.slug, 'pen'), 200)
    for (const id of ['au', 'us', 'uk', 'sg', 'my']) {
      assert.equal(getRegionalPriceAmount(id, product.slug, 'cartridge'), null)
      assert.equal(getRegionalPriceAmount(id, product.slug, 'pen'), null)
    }
  }
})

test('unknown or missing Indonesian products and formats never inherit a price', () => {
  const region = getRegion('id')
  const invalidKeys = [undefined, null, '', 'unknown', '__proto__', 'constructor', 'toString', 'hasOwnProperty', 'valueOf']
  for (const slug of [...invalidKeys, 'retatrutide-20mg', 'Retatrutide', 'semaglutide']) {
    for (const variant of ['cartridge', 'pen']) {
      assert.equal(getRegionalPriceAmount('id', slug, variant), null, `${String(slug)}/${variant}`)
      assert.equal(formatRegionPrice(region, slug, variant), null)
      assert.equal(getRegionalPriceLabel(region, slug, variant), 'Tanya harga IDR')
    }
  }
  for (const variant of [...invalidKeys, 'basic', 'basic-set', 'vial', 'box']) {
    assert.equal(getRegionalPriceAmount('id', 'retatrutide', variant), null, String(variant))
    assert.equal(formatRegionPrice(region, 'retatrutide', variant), null)
    assert.equal(getRegionalPriceLabel(region, 'retatrutide', variant), 'Tanya harga IDR')
  }
})

test('known IDR and EUR prices use locale formatting and explicit currency codes', () => {
  const normalize = (value) => value.replaceAll('\u00a0', ' ')
  for (const [slug, prices] of Object.entries(EXPECTED_IDR_PRICES)) {
    for (const variant of ['cartridge', 'pen']) {
      const digits = String(prices[variant]).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      assert.equal(normalize(formatRegionPrice(getRegion('id'), slug, variant)), `IDR ${digits}`)
      assert.equal(normalize(getRegionalPriceLabel(getRegion('id'), slug, variant)), `IDR ${digits}`)
    }
    assert.equal(normalize(formatRegionPrice(getRegion('eu'), slug, 'cartridge')), 'EUR 143')
    assert.equal(normalize(formatRegionPrice(getRegion('eu'), slug, 'pen')), 'EUR 200')
  }
})

test('unapproved prices are inquiries in the selected language and currency', () => {
  for (const id of ['au', 'us', 'uk', 'sg', 'my']) {
    const region = getRegion(id)
    for (const product of products) {
      for (const variant of ['cartridge', 'pen']) {
        assert.equal(formatRegionPrice(region, product.slug, variant), null)
        assert.equal(getRegionalPriceLabel(region, product.slug, variant), region.language === 'ms'
          ? `Tanya harga ${region.currency}`
          : `Request ${region.currency} pricing`)
      }
    }
  }
})

test('all catalog entries are localized without changing scientific names, images or identifiers', () => {
  for (const language of ['ms', 'id']) {
    for (const product of products) {
      const copy = getProductCopy(product, language)
      assert.equal(copy.name, product.name)
      assert.equal(copy.slug, product.slug)
      assert.equal(copy.image, product.image)
      assert.notEqual(copy.category, product.category)
      assert.notEqual(copy.description, product.description)
      assert.notEqual(copy.tagline, product.tagline)
      assert.match(copy.dosage, /klik/)
      assert.ok(copy.description.length > 20)
    }
    assert.ok(catalogCopy[language].researchOnly.length > 20)
    assert.ok(catalogCopy[language].priceNotice.length > 20)
  }
})
