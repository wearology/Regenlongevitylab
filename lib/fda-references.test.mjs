import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import * as fdaReferences from './fda-references.ts'
import { products } from './products.ts'
import { REGIONS } from './regions.ts'

const {
  FDA_MEDICINE_REFERENCES,
  FDA_REFERENCE_BADGE_PREFIX,
  FDA_REFERENCE_COPY,
  getFdaMedicineReference,
} = fdaReferences
const require = createRequire(import.meta.url)
const ts = require('typescript')
const jsxRuntime = require('react/jsx-runtime')
const reviewedProduct = products.find((product) => product.slug === 'tesamorelin')
const expectedBadge = 'FDA-approved medicine: EGRIFTA WR'
const expectedReference = {
  productSlug: 'tesamorelin',
  productName: 'Tesamorelin 10mg',
  ingredient: 'tesamorelin',
  medicineName: 'EGRIFTA WR',
  formulation: '11.6 mg/vial',
  jurisdiction: 'US',
  application: 'BLA 022505',
  scope: 'reference-medicine-only',
  checkedOn: '2026-08-31',
  recordUrl: 'https://purplebooksearch.fda.gov/index.cfm?blaNo=022505&event=productdetails',
  labelUrl: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/022505s020lbl.pdf',
}

// These fixtures deliberately resemble catalog identities without being the
// exact, own-property identity that was reviewed. Do not infer approval from a
// shared ingredient, a substring, a different strength or a prototype lookup.
const excludedIdentities = [
  ...products.filter((product) => product.slug !== 'tesamorelin'),
  ...products.filter((product) => product.slug !== 'tesamorelin').map((product) => ({ ...product, fdaApproved: true })),
  { slug: 'tesamorelin', name: 'Tesamorelin' },
  { slug: 'tesamorelin', name: 'Tesamorelin 5mg' },
  { slug: 'tesamorelin', name: 'Tesamorelin 20mg' },
  { slug: 'tesamorelin', name: 'Tesamorelin 10 mg' },
  { slug: 'tesamorelin', name: 'Tesamorelin 10mg Pen' },
  { slug: 'tesamorelin', name: 'Tesamorelin 10mg + Ipamorelin 5mg' },
  { slug: 'tesamorelin', name: 'EGRIFTA WR 11.6mg' },
  { slug: 'tesamorelin', name: 'tesamorelin 10mg' },
  { slug: 'tesamorelin', name: 'Tesamorelin 10mg ' },
  { slug: 'tesamorelin-blend', name: 'Tesamorelin 10mg' },
  { slug: 'tesamorelin-10mg', name: 'Tesamorelin 10mg' },
  { slug: 'tesa', name: 'Tesamorelin 10mg' },
  { slug: 'TESAMORELIN', name: 'Tesamorelin 10mg' },
  { slug: 'unknown-product', name: 'Tesamorelin 10mg' },
  { slug: 'tesamorelin', name: '' },
  { slug: '', name: 'Tesamorelin 10mg' },
  { slug: 'tesamorelin', name: null },
  { slug: 'tesamorelin' },
  { name: 'Tesamorelin 10mg' },
  Object.create({ slug: 'tesamorelin', name: 'Tesamorelin 10mg' }),
  Object.assign(Object.create({ name: 'Tesamorelin 10mg' }), { slug: 'tesamorelin' }),
  Object.assign(Object.create({ slug: 'tesamorelin' }), { name: 'Tesamorelin 10mg' }),
  Object.create(null),
  ...['__proto__', 'prototype', 'constructor', 'toString', 'valueOf', 'hasOwnProperty'].map((slug) => ({ slug, name: 'Tesamorelin 10mg' })),
  null,
  undefined,
  'tesamorelin',
  false,
  0,
]

const componentSource = ts.transpileModule(
  readFileSync(new URL('../components/fda-medicine-reference.tsx', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  },
).outputText

// Render the actual component. Only context and neutral icon rendering are
// boundaries; the allowlist, copy and conditional markup are real. Unknown
// icon imports fail rather than silently accepting a seal or approval tick.
function loadReferenceComponent(region) {
  const componentModule = { exports: {} }
  const dependencies = {
    'react/jsx-runtime': jsxRuntime,
    'lucide-react': new Proxy({ Info: 'ReferenceInfo', ExternalLink: 'ReferenceExternalLink' }, {
      get(icons, name) {
        if (!Object.hasOwn(icons, name)) throw new Error(`Unexpected FDA-reference icon: ${String(name)}`)
        return icons[name]
      },
    }),
    '@/components/region-provider': { useRegion: () => ({ region, language: region.language }) },
    '@/lib/fda-references': fdaReferences,
  }
  vm.runInNewContext(componentSource, {
    module: componentModule,
    exports: componentModule.exports,
    Intl,
    require(id) {
      if (!Object.hasOwn(dependencies, id)) throw new Error(`Unexpected reference dependency: ${id}`)
      return dependencies[id]
    },
  })
  return componentModule.exports.FdaMedicineReference
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

function pathTo(node, target, ancestors = []) {
  if (node == null || typeof node !== 'object') return undefined
  if (Array.isArray(node)) {
    for (const child of node) {
      const path = pathTo(child, target, ancestors)
      if (path) return path
    }
    return undefined
  }
  const path = [...ancestors, node]
  return node === target ? path : pathTo(node.props?.children, target, path)
}

function assertVisible(root, node) {
  const path = pathTo(root, node)
  assert.ok(path, 'the qualification is present in actual rendered content')
  for (const ancestor of path) {
    const props = ancestor.props ?? {}
    assert.ok(props.hidden == null || props.hidden === false, 'qualification must not have a hidden ancestor')
    assert.notEqual(String(props['aria-hidden']), 'true', 'qualification is available to assistive technology')
    assert.doesNotMatch(props.className ?? '', /(?:^|[\s:])(?:hidden|invisible|sr-only|opacity-0|h-0|max-h-0|w-0|text-transparent)(?:\s|$)/,
      'qualification must not be visually hidden or depend on hover/focus')
    assert.notEqual(props.style?.display, 'none')
    assert.notEqual(props.style?.visibility, 'hidden')
    if (props.style?.opacity != null) assert.notEqual(Number(props.style.opacity), 0)
    if (ancestor.type === 'details') assert.equal(props.open, true, 'qualification must not require opening a disclosure')
  }
}

function assertBadgeAndDisclaimer(tree, copy) {
  const nodes = descendants(tree)
  const badges = nodes.filter((node) => String(node.props?.['data-fda-medicine-badge']) === 'true')
  const disclaimers = nodes.filter((node) => String(node.props?.['data-fda-disclaimer']) === 'true')
  assert.equal(badges.length, 1)
  assert.equal(disclaimers.length, 1)
  const [badge] = badges
  const [disclaimer] = disclaimers
  assert.equal(badge.type, 'p')
  assert.equal(badge.props.lang, 'en')
  assert.equal(content(badge), expectedBadge)
  assert.equal(disclaimer.type, 'p')
  assert.equal(content(disclaimer), copy.disclaimer)
  assertVisible(tree, badge)
  assertVisible(tree, disclaimer)
  const badgePath = pathTo(tree, badge)
  const disclaimerPath = pathTo(tree, disclaimer)
  const parent = badgePath.at(-2)
  assert.equal(parent, disclaimerPath.at(-2), 'approval qualifier stays beside the badge, not in a distant footer')
  const siblings = [parent.props.children].flat(Infinity).filter(Boolean)
  assert.equal(siblings[siblings.indexOf(badge) + 1], disclaimer, 'the disclaimer immediately follows the medicine name')
  assert.equal(nodes.some((node) => ['img', 'picture', 'svg', 'canvas'].includes(node.type)), false,
    'do not display an FDA seal/logo or certification artwork')
  assert.equal(nodes.filter((node) => node.type === 'ReferenceInfo').length, 1)
  for (const icon of nodes.filter((node) => ['ReferenceInfo', 'ReferenceExternalLink'].includes(node.type))) {
    assert.equal(String(icon.props['aria-hidden']), 'true')
  }
}

test('the reviewed allowlist names only the US EGRIFTA WR medicine and its exact FDA sources, not a Regen product approval', () => {
  assert.deepEqual(FDA_MEDICINE_REFERENCES, [expectedReference])
  assert.equal(FDA_REFERENCE_BADGE_PREFIX, 'FDA-approved medicine:')
  const record = new URL(FDA_MEDICINE_REFERENCES[0].recordUrl)
  const label = new URL(FDA_MEDICINE_REFERENCES[0].labelUrl)
  for (const url of [record, label]) {
    assert.equal(url.protocol, 'https:')
    assert.match(url.hostname, /(?:^|\.)fda\.gov$/)
    assert.equal(url.username, '')
    assert.equal(url.password, '')
  }
  assert.equal(record.hostname, 'purplebooksearch.fda.gov')
  assert.equal(record.searchParams.get('blaNo'), '022505')
  assert.equal(record.searchParams.get('event'), 'productdetails')
  assert.equal(label.pathname, '/drugsatfda_docs/label/2025/022505s020lbl.pdf')
  for (const product of products) assert.equal(Object.hasOwn(product, 'fdaApproved'), false)
})

test('only the exact reviewed Tesamorelin 10mg catalog identity receives a medicine reference', () => {
  assert.equal(products.length, 8)
  assert.ok(reviewedProduct)
  assert.equal(reviewedProduct.name, 'Tesamorelin 10mg')
  for (const product of products) {
    const reference = getFdaMedicineReference(product)
    if (product.slug === 'tesamorelin') assert.equal(reference, FDA_MEDICINE_REFERENCES[0])
    else assert.equal(reference, undefined, product.slug)
  }
  assert.equal(getFdaMedicineReference({ slug: 'tesamorelin', name: 'Tesamorelin 10mg' }), FDA_MEDICINE_REFERENCES[0])
})

test('unknown products, blends, partial identities, changed strengths, prototype keys and inherited catalog lookalikes fail closed', () => {
  for (const [index, product] of excludedIdentities.entries()) {
    assert.equal(getFdaMedicineReference(product), undefined, `excluded identity ${index + 1}`)
  }
})

test('English, Malay and Indonesian qualifications retain the restricted indication, general-weight-loss exclusion and different Regen product/formats', () => {
  const requiredTerms = {
    en: {
      heading: [/United States/i],
      disclaimer: [/EGRIFTA WR approval only/i, /not approval.*Regen research product/i],
      indication: [/tesamorelin/i, /approved in the US/i, /reduce excess abdominal fat/i, /adults/i, /HIV-associated lipodystrophy/i],
      limitation: [/not indicated/i, /general weight-loss management/i],
      distinction: [/prescription medicine/i, /11\.6 mg\/vial/i, /Regen.*10 mg research product/i, /not EGRIFTA WR/i, /not FDA-approved/i, /not a claim of approval in any other country/i],
    },
    ms: {
      heading: [/Amerika Syarikat/i],
      disclaimer: [/EGRIFTA WR sahaja/i, /bukan.*produk kajian Regen/i],
      indication: [/tesamorelin/i, /diluluskan di Amerika Syarikat/i, /lemak berlebihan/i, /abdomen/i, /orang dewasa/i, /lipodistrofi berkaitan HIV/i],
      limitation: [/bukan/i, /penurunan berat badan secara umum/i],
      distinction: [/ubat preskripsi/i, /11\.6 mg\/vial/i, /produk kajian Regen 10 mg/i, /bukan EGRIFTA WR/i, /tidak diluluskan FDA/i, /bukan dakwaan kelulusan di negara lain/i],
    },
    id: {
      heading: [/Amerika Serikat/i],
      disclaimer: [/hanya untuk EGRIFTA WR/i, /bukan.*produk riset Regen/i],
      indication: [/tesamorelin/i, /disetujui di Amerika Serikat/i, /kelebihan lemak perut/i, /orang dewasa/i, /lipodistrofi terkait HIV/i],
      limitation: [/tidak disetujui/i, /penurunan berat badan secara umum/i],
      distinction: [/obat resep/i, /11,6 mg\/vial/i, /produk riset Regen 10 mg/i, /bukan EGRIFTA WR/i, /tidak disetujui FDA/i, /bukan klaim persetujuan di negara lain/i],
    },
  }
  assert.deepEqual(Object.keys(FDA_REFERENCE_COPY).sort(), ['en', 'id', 'ms'])
  for (const [language, fields] of Object.entries(requiredTerms)) {
    const copy = FDA_REFERENCE_COPY[language]
    for (const [field, expressions] of Object.entries(fields)) {
      for (const expression of expressions) assert.match(copy[field], expression, `${language}.${field}`)
    }
    for (const format of ['Basic', 'Cartridge', 'Pen']) assert.ok(copy.distinction.includes(format), `${language}: ${format} is not an approved medicine`)
    assert.match(copy.labelLink, /\bPDF\b/)
    assert.ok(copy.recordLink.length > 5)
    assert.ok(copy.checkedOn.length > 5)
  }
})

test('all seven compact references display the English medicine name with an adjacent visible localized non-approval qualifier and no nested interactive content', () => {
  for (const region of REGIONS) {
    const Reference = loadReferenceComponent(region)
    const tree = Reference({ product: reviewedProduct })
    const copy = FDA_REFERENCE_COPY[region.language]
    assert.equal(tree.type, 'div')
    assert.equal(tree.props.role, 'note')
    assert.equal(tree.props['aria-label'], copy.heading)
    assert.equal(tree.props['data-fda-medicine-reference'], 'compact')
    assert.equal(tree.props['data-reference-scope'], 'reference-medicine-only')
    assertBadgeAndDisclaimer(tree, copy)
    for (const node of descendants(tree)) {
      assert.equal(['a', 'button', 'input', 'select', 'textarea', 'summary'].includes(node.type), false)
      assert.ok(node.props?.tabIndex == null || node.props.tabIndex < 0)
      assert.equal(Object.hasOwn(node.props ?? {}, 'href'), false, 'the compact reference sits inside an already-linked product card')
    }
  }
})

test('all seven detailed references visibly retain the medicine-only indication, exclusions, safe official sources and localized checked date', () => {
  for (const region of REGIONS) {
    const Reference = loadReferenceComponent(region)
    const tree = Reference({ product: reviewedProduct, detail: true })
    const nodes = descendants(tree)
    const copy = FDA_REFERENCE_COPY[region.language]
    assert.equal(tree.type, 'aside')
    assert.equal(tree.props['data-fda-medicine-reference'], 'detail')
    assert.equal(tree.props['data-reference-scope'], 'reference-medicine-only')
    const heading = nodes.find((node) => node.props?.id === tree.props['aria-labelledby'])
    assert.equal(heading?.type, 'h2')
    assert.equal(content(heading), copy.heading)
    assertBadgeAndDisclaimer(tree, copy)
    for (const field of ['indication', 'limitation', 'distinction']) {
      const paragraphs = nodes.filter((node) => node.type === 'p' && content(node) === copy[field])
      assert.equal(paragraphs.length, 1, `${region.id}: show ${field} as ordinary content`)
      assertVisible(tree, paragraphs[0])
    }
    const links = nodes.filter((node) => node.type === 'a')
    assert.equal(links.length, 2)
    for (const [index, link] of links.entries()) {
      assert.equal(link.props.href, index === 0 ? expectedReference.recordUrl : expectedReference.labelUrl)
      assert.equal(content(link), index === 0 ? copy.recordLink : copy.labelLink)
      assert.equal(link.props.target, '_blank')
      for (const token of ['noopener', 'noreferrer']) assert.ok(link.props.rel.split(/\s+/).includes(token))
      assertVisible(tree, link)
    }
    assert.match(content(links[1]), /\bPDF\b/)
    const dates = nodes.filter((node) => node.type === 'time')
    assert.equal(dates.length, 1)
    assert.equal(dates[0].props.dateTime, '2026-08-31')
    assert.equal(content(dates[0]), new Intl.DateTimeFormat(region.locale, {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(new Date('2026-08-31T00:00:00Z')))
    assertVisible(tree, dates[0])
    assert.ok(content(tree).includes(`${copy.checkedOn}: ${content(dates[0])}`))
  }
})

test('the actual compact and detailed components render nothing for every unreviewed identity in every region', () => {
  for (const region of REGIONS) {
    const Reference = loadReferenceComponent(region)
    for (const product of excludedIdentities) {
      assert.equal(Reference({ product }), null, `${region.id}: no compact badge for an unreviewed identity`)
      assert.equal(Reference({ product, detail: true }), null, `${region.id}: no detailed medicine claim for an unreviewed identity`)
    }
  }
})
