import assert from 'node:assert/strict'
import test from 'node:test'
import { regionForCountry, suggestedRegion } from './region-detection.ts'

const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
]

const MARKET_COUNTRIES = {
  AU: 'au',
  DE: 'eu',
  US: 'us',
  GB: 'uk',
  SG: 'sg',
  MY: 'my',
  ID: 'id',
}

test('country ISO codes map to each of the seven requested markets', () => {
  assert.equal(new Set(Object.values(MARKET_COUNTRIES)).size, 7)
  for (const [country, region] of Object.entries(MARKET_COUNTRIES)) {
    assert.equal(regionForCountry(country), region, country)
  }
})

test('all 27 EU member countries map to the EU rather than geographic Europe', () => {
  assert.equal(EU_COUNTRIES.length, 27)
  assert.equal(new Set(EU_COUNTRIES).size, 27)
  for (const country of EU_COUNTRIES) {
    assert.equal(regionForCountry(country), 'eu', country)
  }
  assert.equal(regionForCountry('GB'), 'uk')
  for (const country of ['CH', 'NO', 'IS', 'LI', 'UA', 'RS', 'TR']) {
    assert.equal(regionForCountry(country), null, country)
  }
})

test('country codes are case-insensitive and tolerate surrounding whitespace', () => {
  const expected = { ...Object.fromEntries(EU_COUNTRIES.map((country) => [country, 'eu'])), ...MARKET_COUNTRIES }
  for (const [country, region] of Object.entries(expected)) {
    assert.equal(regionForCountry(country.toLowerCase()), region, country)
    assert.equal(regionForCountry(` \t${country.toLowerCase()}\n`), region, country)
    assert.equal(regionForCountry(country[0] + country[1].toLowerCase()), region, country)
  }
})

test('unknown, local, malformed and unsupported country values yield no suggestion', () => {
  for (const country of [
    null, undefined, '', ' ', '\t\n', 'XX', 'ZZ', 'T1',
    'localhost', '127.0.0.1', '::1', 'CA', 'NZ', 'JP', 'CN', 'AE',
    'CH', 'NO', 'EU', 'UK', 'USA', 'AU,US', 'AU-US', 'A U', '/MY',
  ]) {
    assert.equal(regionForCountry(country), null, String(country))
    assert.equal(suggestedRegion({ country, isVercel: true, dismissed: false }), null, String(country))
  }
})

test('an eligible hosting-country hint produces only the mapped regional suggestion', () => {
  for (const [country, expected] of Object.entries(MARKET_COUNTRIES)) {
    assert.equal(suggestedRegion({ country, isVercel: true, dismissed: false }), expected, country)
  }
  for (const country of EU_COUNTRIES) {
    assert.equal(suggestedRegion({ country, isVercel: true, dismissed: false }), 'eu', country)
  }
})

test('country headers never produce suggestions outside Vercel', () => {
  for (const country of [...Object.keys(MARKET_COUNTRIES), ...EU_COUNTRIES]) {
    assert.equal(suggestedRegion({ country, isVercel: false, dismissed: false }), null, country)
    assert.equal(suggestedRegion({ country, isVercel: false, dismissed: true }), null, country)
  }
})

test('dismissal suppresses all supported suggestions even on Vercel', () => {
  for (const country of [...Object.keys(MARKET_COUNTRIES), ...EU_COUNTRIES]) {
    assert.equal(suggestedRegion({ country, isVercel: true, dismissed: true }), null, country)
  }
})
