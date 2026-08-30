import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import * as regions from './regions.ts'
import { buildConsultationEmail, CONTACT_EMAIL, SUPPORT_COPY } from './support-copy.ts'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const { NextRequest } = require('next/server')

// Exercise the real Next.js request/response objects without network requests
// or a running browser. Only the workspace import alias needs resolving here.
const source = readFileSync(new URL('../proxy.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const proxyModule = { exports: {} }
vm.runInNewContext(compiled, {
  exports: proxyModule.exports,
  module: proxyModule,
  require: (id) => id === '@/lib/regions' ? regions : require(id),
  Headers,
})
const { proxy } = proxyModule.exports

test('all direct regional routes forward the correct SSR region and persist a preference', () => {
  for (const region of regions.REGIONS) {
    for (const suffix of ['', '/product/retatrutide']) {
      const response = proxy(new NextRequest(`https://regen.test/${region.id}${suffix}`))
      assert.equal(response.headers.get(`x-middleware-request-${regions.REGION_HEADER}`), region.id)
      const cookie = response.cookies.get(regions.REGION_COOKIE)
      assert.equal(cookie.value, region.id)
      assert.equal(cookie.path, '/')
      assert.equal(cookie.sameSite, 'lax')
      assert.equal(cookie.secure, true)
    }
  }
})

test('a direct URL overrides stale preferences and ignores spoofed region headers', () => {
  const response = proxy(new NextRequest('https://regen.test/my', {
    headers: { cookie: 'regen-region=au', 'x-regen-region': 'id' },
  }))
  assert.equal(response.headers.get('x-middleware-request-x-regen-region'), 'my')
  assert.equal(response.cookies.get('regen-region').value, 'my')
})

test('existing preferences, prefetches and non-GET requests do not rewrite cookies', () => {
  for (const headers of [
    { cookie: 'regen-region=sg' },
    { rsc: '1' },
    { 'next-router-prefetch': '1' },
    { purpose: 'prefetch' },
    { 'sec-purpose': 'prefetch;prerender' },
  ]) {
    const response = proxy(new NextRequest('https://regen.test/sg', { headers }))
    assert.equal(response.headers.get('set-cookie'), null)
    assert.equal(response.headers.get('x-middleware-request-x-regen-region'), 'sg')
  }
  const response = proxy(new NextRequest('https://regen.test/sg', { method: 'POST' }))
  assert.equal(response.headers.get('set-cookie'), null)
})

test('unknown regions and unlisted verification URLs do not create a regional preference', () => {
  for (const path of ['/', '/unknown', '/myanmar', '/verify', '/verify/LRN-RETA-0001']) {
    const response = proxy(new NextRequest(`https://regen.test${path}`, {
      headers: { 'x-regen-region': 'my' },
    }))
    assert.equal(response.headers.get('x-middleware-request-x-regen-region'), '')
    assert.equal(response.headers.get('set-cookie'), null)
  }
})

test('HTTP local preview preferences do not require a secure transport', () => {
  const response = proxy(new NextRequest('http://localhost:3000/id'))
  assert.equal(response.cookies.get('regen-region').secure, false)
})

test('all regional consultation drafts retain the selected market, currency and product', () => {
  for (const region of regions.REGIONS) {
    for (const productName of [null, 'Retatrutide 10mg']) {
      const draft = buildConsultationEmail({
        region, language: region.language, productName,
        countryDial: region.dialCode, phoneNumber: '000000000',
      })
      assert.ok(draft.subject.includes(region.currency))
      assert.ok(draft.subject.includes(region.name))
      assert.ok(draft.body.includes(region.currency))
      assert.ok(draft.body.includes(region.name))
      assert.ok(draft.body.includes(`${region.dialCode} 000000000`))
      if (productName) assert.ok(draft.body.includes(productName))
      assert.equal(new URL(draft.gmailUrl).searchParams.get('body'), draft.body)
      assert.equal(new URL(draft.gmailUrl).searchParams.get('to'), CONTACT_EMAIL)
      assert.equal(new URL(draft.mailtoUrl).searchParams.get('body'), draft.body)
      assert.ok(draft.body.startsWith(SUPPORT_COPY[region.language].email.greeting))
    }
  }
})
