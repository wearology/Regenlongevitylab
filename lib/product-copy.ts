import type { Product, VariantId } from './products'
import type { Language } from './regions'

type LocalizedProductCopy = Pick<Product, 'category' | 'tagline' | 'description'>

const translations: Record<'ms' | 'id', Record<string, LocalizedProductCopy>> = {
  ms: {
    retatrutide: {
      category: 'LEMAK & KOMPOSISI BADAN',
      tagline: 'Agonis tiga reseptor yang dikaji untuk komposisi badan.',
      description: 'Retatrutide ialah agonis tiga reseptor (GLP-1 / GIP / glukagon) yang dikaji dalam persekitaran penyelidikan bagi kesannya terhadap keseimbangan tenaga, isyarat selera makan dan komposisi badan. Dibekalkan sebagai kartrij penyelidikan 10mg.',
    },
    'cjc-1295-ipamorelin': {
      category: 'OTOT & PERTUMBUHAN',
      tagline: 'Campuran analog GHRH dan ghrelin untuk penyelidikan hormon pertumbuhan.',
      description: 'Campuran CJC-1295 (No DAC), sejenis analog GHRH, dan Ipamorelin, sejenis sekretagog hormon pertumbuhan terpilih. Kedua-duanya dikaji bersama untuk pelepasan hormon pertumbuhan secara berdenyut, pemulihan dan sokongan tisu tanpa lemak.',
    },
    klow80: {
      category: 'CAMPURAN PEMULIHAN & PEMBAIKAN',
      tagline: 'Campuran berbilang peptida yang dikaji untuk pembaikan dan pemulihan.',
      description: 'KLOW80 ialah campuran berbilang peptida yang menggabungkan sebatian regeneratif dan reparatif. Dikaji untuk pembaikan tisu, kualiti kulit dan sokongan pemulihan keseluruhan dalam satu format.',
    },
    'mots-c': {
      category: 'METABOLISME & JANGKA HAYAT',
      tagline: 'Peptida terbitan mitokondria untuk penyelidikan metabolisme.',
      description: 'MOTS-C ialah peptida terbitan mitokondria yang dikaji untuk peranannya dalam pengawalan metabolisme, sensitiviti insulin dan tenaga sel. Sebatian yang semakin mendapat perhatian dalam penyelidikan metabolisme dan jangka hayat.',
    },
    'nad-plus': {
      category: 'REGENERASI & JANGKA HAYAT',
      tagline: 'Koenzim yang berperanan penting dalam tenaga dan pembaikan sel.',
      description: 'NAD+ (nikotinamida adenina dinukleotida) ialah koenzim yang berperanan penting dalam penghasilan tenaga sel dan pembaikan DNA. Dikaji secara meluas dalam penyelidikan regenerasi dan jangka hayat. Format katalog ini mengandungi 500mg.',
    },
    tesamorelin: {
      category: 'LEMAK & PERTUMBUHAN',
      tagline: 'Analog GHRH yang dikaji untuk lemak viseral dan hormon pertumbuhan.',
      description: 'Tesamorelin ialah analog GHRH yang distabilkan dan dikaji bagi kesannya terhadap pengurangan lemak viseral serta rangsangan hormon pertumbuhan. Dibekalkan sebagai kartrij penyelidikan 10mg.',
    },
    'bpc-157': {
      category: 'PEMULIHAN & PEMBAIKAN',
      tagline: 'Sebatian perlindungan badan yang dikaji untuk pembaikan tisu.',
      description: 'BPC-157 ialah pentadekapeptida gastrik stabil yang dikaji secara meluas untuk pembaikan tisu, pemulihan tendon dan ligamen serta kesihatan usus dalam penyelidikan praklinikal.',
    },
    'ghk-cu': {
      category: 'KULIT & REGENERASI',
      tagline: 'Peptida kuprum yang dikaji untuk kulit dan regenerasi.',
      description: 'GHK-Cu ialah tripeptida kuprum semula jadi yang dikaji untuk regenerasi kulit, sintesis kolagen dan penyembuhan luka. Dibekalkan dalam format 100mg untuk kegunaan penyelidikan.',
    },
  },
  id: {
    retatrutide: {
      category: 'LEMAK & KOMPOSISI TUBUH',
      tagline: 'Agonis tiga reseptor yang diteliti untuk komposisi tubuh.',
      description: 'Retatrutide adalah agonis tiga reseptor (GLP-1 / GIP / glukagon) yang diteliti dalam lingkungan riset untuk pengaruhnya terhadap keseimbangan energi, sinyal nafsu makan, dan komposisi tubuh. Tersedia sebagai kartrid penelitian 10mg.',
    },
    'cjc-1295-ipamorelin': {
      category: 'OTOT & PERTUMBUHAN',
      tagline: 'Campuran analog GHRH dan ghrelin untuk penelitian hormon pertumbuhan.',
      description: 'Campuran CJC-1295 (No DAC), analog GHRH, dan Ipamorelin, sekretagog hormon pertumbuhan selektif. Keduanya diteliti bersama untuk pelepasan hormon pertumbuhan secara pulsatif, pemulihan, dan dukungan jaringan tanpa lemak.',
    },
    klow80: {
      category: 'CAMPURAN PEMULIHAN & PERBAIKAN',
      tagline: 'Campuran beberapa peptida yang diteliti untuk perbaikan dan pemulihan.',
      description: 'KLOW80 adalah campuran beberapa peptida yang menggabungkan senyawa regeneratif dan reparatif. Diteliti untuk perbaikan jaringan, kualitas kulit, dan dukungan pemulihan secara keseluruhan dalam satu format.',
    },
    'mots-c': {
      category: 'METABOLISME & RENTANG HIDUP',
      tagline: 'Peptida turunan mitokondria untuk penelitian metabolisme.',
      description: 'MOTS-C adalah peptida turunan mitokondria yang diteliti untuk perannya dalam pengaturan metabolisme, sensitivitas insulin, dan energi sel. Senyawa yang semakin menarik perhatian dalam penelitian metabolisme dan rentang hidup.',
    },
    'nad-plus': {
      category: 'REGENERASI & RENTANG HIDUP',
      tagline: 'Koenzim yang berperan penting dalam energi dan perbaikan sel.',
      description: 'NAD+ (nikotinamida adenin dinukleotida) adalah koenzim yang berperan penting dalam produksi energi sel dan perbaikan DNA. Banyak diteliti dalam riset regenerasi dan rentang hidup. Format katalog ini mengandung 500mg.',
    },
    tesamorelin: {
      category: 'LEMAK & PERTUMBUHAN',
      tagline: 'Analog GHRH yang diteliti untuk lemak viseral dan hormon pertumbuhan.',
      description: 'Tesamorelin adalah analog GHRH yang distabilkan dan diteliti untuk pengaruhnya terhadap pengurangan lemak viseral serta stimulasi hormon pertumbuhan. Tersedia sebagai kartrid penelitian 10mg.',
    },
    'bpc-157': {
      category: 'PEMULIHAN & PERBAIKAN',
      tagline: 'Senyawa perlindungan tubuh yang diteliti untuk perbaikan jaringan.',
      description: 'BPC-157 adalah pentadekapeptida lambung stabil yang banyak diteliti untuk perbaikan jaringan, pemulihan tendon dan ligamen, serta kesehatan usus dalam penelitian praklinis.',
    },
    'ghk-cu': {
      category: 'KULIT & REGENERASI',
      tagline: 'Peptida tembaga yang diteliti untuk kulit dan regenerasi.',
      description: 'GHK-Cu adalah tripeptida tembaga alami yang diteliti untuk regenerasi kulit, sintesis kolagen, dan penyembuhan luka. Tersedia dalam format 100mg untuk keperluan penelitian.',
    },
  },
}

export function getProductCopy(product: Product, language: Language): Product {
  if (language === 'en') return product
  return {
    ...product,
    ...translations[language][product.slug],
    dosage: product.dosage.replaceAll('clicks', 'klik'),
  }
}

type CatalogCopy = {
  heading: string
  intro: string
  talkToTeam: string
  viewProduct: string
  backToCatalog: string
  labelReference: string
  selectFormat: string
  orderConsultation: string
  viewImage: string
  researchOnly: string
  priceNotice: string
  photoNotice: string
  recommendedHeading: string
  recommendedBody: string
  usps: [string, string, string, string]
  variants: Record<VariantId, { label: string; note: string; alt: string }>
  imageAlt: string
  formatsHeading: string
  formatsBody: string
  formats: Record<VariantId, { name: string; body: string }>
}

export const catalogCopy: Record<Language, CatalogCopy> = {
  en: {
    heading: 'Explore our research peptide catalog',
    intro: 'Talk to our team about your research and the catalog options for your selected region.',
    talkToTeam: 'Talk to Our Team',
    viewProduct: 'View Product',
    backToCatalog: 'Back to catalog',
    labelReference: 'Cartridge label reference (not usage guidance)',
    selectFormat: 'Choose your format',
    orderConsultation: 'Product & Pricing Inquiry',
    viewImage: 'View',
    researchOnly: 'For laboratory research only. Not for human consumption or therapeutic use.',
    priceNotice: 'Prices are shown in your selected currency where a catalog price is available. Ask our team to confirm final pricing, availability, shipping and any applicable taxes for your region.',
    photoNotice: 'Catalog images are illustrative. Confirm product and packaging details with our team.',
    recommendedHeading: 'More from the catalog.',
    recommendedBody: 'Explore other research peptides in the Regen catalog.',
    usps: ['Laboratory documentation', 'Batch-specific COA', 'Ask about shipping', 'Research support'],
    variants: {
      cartridge: { label: 'Cartridge', note: 'Refill cartridge for the compatible Regen Pen device.', alt: 'cartridge package contents' },
      pen: { label: 'Pen Package', note: 'Pre-filled pen package for laboratory research.', alt: 'pen package contents' },
    },
    imageAlt: 'research cartridge',
    formatsHeading: 'One quality standard. Two research formats.',
    formatsBody: 'Explore cartridge and pen packaging. Our team can confirm format compatibility and availability for your research.',
    formats: {
      cartridge: { name: 'Cartridge Format', body: 'A refill cartridge for research setups using the compatible Regen Pen device. Ask our team to confirm compatibility and product details.' },
      pen: { name: 'Pen Package', body: 'A pre-filled pen format for laboratory research. Ask our team about package contents, handling information and regional availability.' },
    },
  },
  ms: {
    heading: 'Terokai katalog peptida penyelidikan kami',
    intro: 'Bincang dengan pasukan kami tentang penyelidikan anda dan pilihan katalog untuk rantau yang anda pilih.',
    talkToTeam: 'Hubungi Pasukan Kami',
    viewProduct: 'Lihat Produk',
    backToCatalog: 'Kembali ke katalog',
    labelReference: 'Rujukan label kartrij (bukan panduan penggunaan)',
    selectFormat: 'Pilih format anda',
    orderConsultation: 'Pertanyaan Produk & Harga',
    viewImage: 'Lihat',
    researchOnly: 'Untuk penyelidikan makmal sahaja. Bukan untuk penggunaan manusia atau tujuan terapeutik.',
    priceNotice: 'Harga dipaparkan dalam mata wang pilihan anda apabila harga katalog tersedia. Hubungi pasukan kami untuk mengesahkan harga akhir, ketersediaan, penghantaran dan cukai yang berkenaan bagi rantau anda.',
    photoNotice: 'Imej katalog adalah untuk ilustrasi. Sahkan butiran produk dan pembungkusan dengan pasukan kami.',
    recommendedHeading: 'Lagi daripada katalog.',
    recommendedBody: 'Terokai peptida penyelidikan lain dalam katalog Regen.',
    usps: ['Dokumentasi makmal', 'COA khusus kelompok', 'Tanya tentang penghantaran', 'Sokongan penyelidikan'],
    variants: {
      cartridge: { label: 'Kartrij', note: 'Kartrij isian semula untuk peranti Regen Pen yang serasi.', alt: 'kandungan pakej kartrij' },
      pen: { label: 'Pakej Pen', note: 'Pakej pen pra-isi untuk penyelidikan makmal.', alt: 'kandungan pakej pen' },
    },
    imageAlt: 'kartrij penyelidikan',
    formatsHeading: 'Satu piawaian kualiti. Dua format penyelidikan.',
    formatsBody: 'Terokai pembungkusan kartrij dan pen. Pasukan kami boleh mengesahkan keserasian format dan ketersediaan untuk penyelidikan anda.',
    formats: {
      cartridge: { name: 'Format Kartrij', body: 'Kartrij isian semula untuk penyelidikan yang menggunakan peranti Regen Pen yang serasi. Hubungi pasukan kami untuk mengesahkan keserasian dan butiran produk.' },
      pen: { name: 'Pakej Pen', body: 'Format pen pra-isi untuk penyelidikan makmal. Tanya pasukan kami tentang kandungan pakej, maklumat pengendalian dan ketersediaan serantau.' },
    },
  },
  id: {
    heading: 'Jelajahi katalog peptida penelitian kami',
    intro: 'Diskusikan penelitian Anda dan pilihan katalog untuk wilayah yang Anda pilih bersama tim kami.',
    talkToTeam: 'Hubungi Tim Kami',
    viewProduct: 'Lihat Produk',
    backToCatalog: 'Kembali ke katalog',
    labelReference: 'Referensi label kartrid (bukan panduan penggunaan)',
    selectFormat: 'Pilih format Anda',
    orderConsultation: 'Pertanyaan Produk & Harga',
    viewImage: 'Lihat',
    researchOnly: 'Hanya untuk penelitian laboratorium. Bukan untuk konsumsi manusia atau penggunaan terapeutik.',
    priceNotice: 'Harga ditampilkan dalam mata uang pilihan Anda jika harga katalog tersedia. Hubungi tim kami untuk mengonfirmasi harga akhir, ketersediaan, pengiriman, dan pajak yang berlaku untuk wilayah Anda.',
    photoNotice: 'Gambar katalog hanya sebagai ilustrasi. Konfirmasikan detail produk dan kemasan dengan tim kami.',
    recommendedHeading: 'Lainnya dari katalog.',
    recommendedBody: 'Jelajahi peptida penelitian lainnya dalam katalog Regen.',
    usps: ['Dokumentasi laboratorium', 'COA khusus batch', 'Tanyakan pengiriman', 'Dukungan penelitian'],
    variants: {
      cartridge: { label: 'Kartrid', note: 'Kartrid isi ulang untuk perangkat Regen Pen yang kompatibel.', alt: 'isi paket kartrid' },
      pen: { label: 'Paket Pen', note: 'Paket pen praisi untuk penelitian laboratorium.', alt: 'isi paket pen' },
    },
    imageAlt: 'kartrid penelitian',
    formatsHeading: 'Satu standar kualitas. Dua format penelitian.',
    formatsBody: 'Jelajahi kemasan kartrid dan pen. Tim kami dapat mengonfirmasi kompatibilitas format dan ketersediaan untuk penelitian Anda.',
    formats: {
      cartridge: { name: 'Format Kartrid', body: 'Kartrid isi ulang untuk penelitian dengan perangkat Regen Pen yang kompatibel. Hubungi tim kami untuk mengonfirmasi kompatibilitas dan detail produk.' },
      pen: { name: 'Paket Pen', body: 'Format pen praisi untuk penelitian laboratorium. Tanyakan kepada tim kami tentang isi paket, informasi penanganan, dan ketersediaan di wilayah Anda.' },
    },
  },
}
