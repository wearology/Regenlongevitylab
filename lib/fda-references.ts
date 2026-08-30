import type { Product } from './products'
import type { Language } from './regions'

/**
 * References to specific US-approved medicines, NOT approval of Regen products.
 * Add an entry only after checking the named medicine, formulation, indication
 * and current FDA record. A shared ingredient, NDC/UNII listing, compounding
 * nomination, or trial registration does not approve a Regen research SKU.
 */
export interface FdaMedicineReference {
  readonly productSlug: string
  readonly productName: string
  readonly ingredient: string
  readonly medicineName: string
  readonly formulation: string
  readonly jurisdiction: 'US'
  readonly application: string
  readonly scope: 'reference-medicine-only'
  readonly checkedOn: string
  readonly recordUrl: string
  readonly labelUrl: string
}

export const FDA_MEDICINE_REFERENCES: readonly FdaMedicineReference[] = [
  {
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
  },
]

// Exact reviewed catalog identities only: no partial names, blends, prototype
// keys, or automatic inheritance by newly added products or strengths.
export function getFdaMedicineReference(
  product: Pick<Product, 'slug' | 'name'>,
): FdaMedicineReference | undefined {
  if (!product || !Object.hasOwn(product, 'slug') || !Object.hasOwn(product, 'name')) {
    return undefined
  }
  return FDA_MEDICINE_REFERENCES.find((reference) =>
    reference.productSlug === product.slug && reference.productName === product.name,
  )
}

type FdaReferenceCopy = {
  heading: string
  disclaimer: string
  indication: string
  limitation: string
  distinction: string
  recordLink: string
  labelLink: string
  checkedOn: string
}

// The badge names the approved medicine in English; all qualifications are
// visible in the selected language, never hidden in a hover-only tooltip.
export const FDA_REFERENCE_BADGE_PREFIX = 'FDA-approved medicine:'

export const FDA_REFERENCE_COPY: Record<Language, FdaReferenceCopy> = {
  en: {
    heading: 'FDA medicine reference (United States)',
    disclaimer: 'EGRIFTA WR approval only — not approval of this Regen research product.',
    indication: 'EGRIFTA WR contains tesamorelin and is approved in the US to reduce excess abdominal fat in adults with HIV-associated lipodystrophy.',
    limitation: 'It is not indicated for general weight-loss management.',
    distinction: 'The approval covers the named prescription medicine and its 11.6 mg/vial formulation. Regen’s 10 mg research product, including its Basic, Cartridge and Pen packages, is not EGRIFTA WR and is not FDA-approved. This is not a claim of approval in any other country.',
    recordLink: 'FDA approval record',
    labelLink: 'FDA prescribing information (PDF)',
    checkedOn: 'FDA sources checked',
  },
  ms: {
    heading: 'Rujukan ubat FDA (Amerika Syarikat)',
    disclaimer: 'Kelulusan untuk EGRIFTA WR sahaja — bukan untuk produk kajian Regen ini.',
    indication: 'EGRIFTA WR mengandungi tesamorelin dan diluluskan di Amerika Syarikat untuk mengurangkan lemak berlebihan di bahagian abdomen bagi orang dewasa dengan lipodistrofi berkaitan HIV.',
    limitation: 'Ia bukan ubat yang diluluskan untuk pengurusan penurunan berat badan secara umum.',
    distinction: 'Kelulusan ini khusus untuk ubat preskripsi tersebut dan formulasi 11.6 mg/vial. Produk kajian Regen 10 mg, termasuk pakej Basic, Cartridge dan Pen, bukan EGRIFTA WR dan tidak diluluskan FDA. Ini juga bukan dakwaan kelulusan di negara lain.',
    recordLink: 'Rekod kelulusan FDA',
    labelLink: 'Maklumat preskripsi FDA (PDF)',
    checkedOn: 'Sumber FDA disemak',
  },
  id: {
    heading: 'Referensi obat FDA (Amerika Serikat)',
    disclaimer: 'Persetujuan hanya untuk EGRIFTA WR — bukan untuk produk riset Regen ini.',
    indication: 'EGRIFTA WR mengandung tesamorelin dan disetujui di Amerika Serikat untuk mengurangi kelebihan lemak perut pada orang dewasa dengan lipodistrofi terkait HIV.',
    limitation: 'Obat ini tidak disetujui untuk penurunan berat badan secara umum.',
    distinction: 'Persetujuan ini khusus untuk obat resep tersebut dengan formulasi 11,6 mg/vial. Produk riset Regen 10 mg, termasuk paket Basic, Cartridge dan Pen, bukan EGRIFTA WR dan tidak disetujui FDA. Ini juga bukan klaim persetujuan di negara lain.',
    recordLink: 'Data persetujuan FDA',
    labelLink: 'Informasi peresepan FDA (PDF)',
    checkedOn: 'Sumber FDA diperiksa',
  },
}
