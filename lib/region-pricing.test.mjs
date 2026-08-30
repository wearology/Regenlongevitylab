import assert from 'node:assert/strict'
import test from 'node:test'
import { products } from './products.ts'
import { catalogCopy, getProductCopy } from './product-copy.ts'
import { REGIONS, getRegion } from './regions.ts'
import {
  REGIONAL_PRICES,
  formatRegionPrice,
  getRegionalPriceAmount,
  getRegionalPriceLabel,
} from './region-pricing.ts'

test('each of the seven regions has both variant price settings', () => {
  assert.equal(REGIONS.length, 7)
  assert.deepEqual(Object.keys(REGIONAL_PRICES).sort(), REGIONS.map((region) => region.id).sort())
  for (const region of REGIONS) {
    assert.deepEqual(Object.keys(REGIONAL_PRICES[region.id]).sort(), ['cartridge', 'pen'])
  }
})

test('existing EUR and documented IDR amounts are preserved without invented conversions', () => {
  assert.equal(getRegionalPriceAmount('eu', 'cartridge'), 143)
  assert.equal(getRegionalPriceAmount('eu', 'pen'), 200)
  assert.equal(getRegionalPriceAmount('id', 'cartridge'), 2_500_000)
  assert.equal(getRegionalPriceAmount('id', 'pen'), 3_500_000)
  for (const id of ['au', 'us', 'uk', 'sg', 'my']) {
    assert.equal(getRegionalPriceAmount(id, 'cartridge'), null)
    assert.equal(getRegionalPriceAmount(id, 'pen'), null)
  }
})

test('known prices use locale formatting and explicit currency codes', () => {
  const normalize = (value) => value.replaceAll('\u00a0', ' ')
  assert.equal(normalize(formatRegionPrice(getRegion('eu'), 'cartridge')), 'EUR 143')
  assert.equal(normalize(formatRegionPrice(getRegion('eu'), 'pen')), 'EUR 200')
  assert.equal(normalize(formatRegionPrice(getRegion('id'), 'cartridge')), 'IDR 2.500.000')
  assert.equal(normalize(formatRegionPrice(getRegion('id'), 'pen')), 'IDR 3.500.000')
})

test('unapproved prices are inquiries in the selected language and currency', () => {
  for (const id of ['au', 'us', 'uk', 'sg', 'my']) {
    const region = getRegion(id)
    for (const variant of ['cartridge', 'pen']) {
      assert.equal(formatRegionPrice(region, variant), null)
      assert.equal(getRegionalPriceLabel(region, variant), region.language === 'ms'
        ? `Tanya harga ${region.currency}`
        : `Request ${region.currency} pricing`)
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
