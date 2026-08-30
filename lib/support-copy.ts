import type { Language, Region } from '@/lib/regions'

// Keep consultation requests on the contact already used by the site.
export const CONTACT_EMAIL = 'contact@regenlongevitylab.com'

interface SupportCopy {
  consultation: {
    eyebrow: string
    title: string
    description: string
    points: string[]
    cardTitle: string
    cardDescription: string
    start: string
    privacy: string
  }
  modal: {
    close: string
    title: string
    sendTitle: string
    description: string
    sendDescription: string
    scamTitle: string
    scamDescription: string
    introduction: string
    regionLabel: string
    phone: string
    countryCode: string
    phonePlaceholder: string
    phoneHint: string
    euDialHint: string
    agreement: string
    contact: string
    continue: string
    to: string
    subject: string
    message: string
    gmail: string
    emailApp: string
    copyAddress: string
    copyMessage: string
    copied: string
    copyFailed: string
    back: string
    draftNotice: string
  }
  email: {
    subject: string
    greeting: string
    general: string
    product: string
    region: string
    currency: string
    phone: string
    availability: string
  }
  faq: {
    eyebrow: string
    title: string
    items: { q: string; a: string }[]
    disclaimerTitle: string
    disclaimer: string
  }
  footer: {
    title: string
    description: string
    start: string
    email: string
    tagline: string
    about: string
    products: string
    catalog: string
    cartridge: string
    pen: string
    company: string
    quality: string
    shipping: string
    faq: string
    contact: string
    regionShipping: string
    copyright: string
    researchOnly: string
  }
}

export const SUPPORT_COPY: Record<Language, SupportCopy> = {
  en: {
    consultation: {
      eyebrow: 'Free consultation',
      title: 'Talk to our team before you order',
      description: 'Tell us about your research needs. Our team can help you explore the catalog and confirm product information, regional pricing, and availability. No cost, no obligation to buy.',
      points: ['Product and format information', 'Regional pricing and shipping enquiries', 'Support before and after your order'],
      cardTitle: 'Contact the Regen team',
      cardDescription: 'Prepare an email for our team with your selected region and currency. You can review the message before sending it from Gmail or your email app.',
      start: 'Start free consultation',
      privacy: 'Nothing is sent until you choose to send the email.',
    },
    modal: {
      close: 'Close consultation',
      title: 'Consultation request',
      sendTitle: 'Review your request',
      description: 'Read the information below before continuing.',
      sendDescription: 'Choose how you would like to email Regen.',
      scamTitle: 'Be alert to scams',
      scamDescription: 'Use the contact address shown here to contact Regen. Check the recipient before sharing personal details or making a payment.',
      introduction: 'Our team can help with product information, pricing, and availability for your selected region. This enquiry does not place an order.',
      regionLabel: 'Selected region and currency',
      phone: 'Phone number for your consultation',
      countryCode: 'Country calling code',
      phonePlaceholder: 'Your phone number',
      phoneHint: 'Choose your own country code, even if it differs from your selected region. Enter 6 or more digits, up to 15 including the country code.',
      euDialHint: 'The EU has multiple country codes. Germany (+49) is selected initially; please choose your country.',
      agreement: 'I confirm that I am at least 18 years old and understand that these details will be included in the email I choose to send to Regen.',
      contact: 'Consultation email address',
      continue: 'Continue',
      to: 'To',
      subject: 'Subject',
      message: 'Message',
      gmail: 'Compose in Gmail',
      emailApp: 'Open my email app',
      copyAddress: 'Copy address',
      copyMessage: 'Copy message',
      copied: 'Copied',
      copyFailed: 'Copying is unavailable. Please select and copy the text above.',
      back: 'Back',
      draftNotice: 'These options open a draft only. Review it and send it yourself when ready.',
    },
    email: {
      subject: 'Consultation request',
      greeting: 'Hello Regen,',
      general: 'I would like to start a consultation.',
      product: 'I would like more information about {product}.',
      region: 'Selected region',
      currency: 'Preferred currency',
      phone: 'My contact number',
      availability: 'Please confirm product availability, pricing, and shipping options for my region.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        { q: 'What are peptides and how do they work?', a: 'Peptides are short chains of amino acids that can act as biological signals. Researchers study them to better understand processes such as recovery, metabolism, and ageing. Research findings do not establish that every peptide is safe or effective for personal use.' },
        { q: 'What product information can Regen provide?', a: 'Ask our team for available product specifications, batch documentation, Certificates of Analysis (COAs), and handling information for the product you are considering.' },
        { q: 'Are peptides safe to use?', a: 'A purity test or COA does not establish safety for human use. Safety depends on the compound, its intended use, and individual circumstances. Seek advice from a qualified healthcare professional rather than using this website as medical guidance.' },
        { q: 'Does choosing a region mean every product is approved there?', a: 'No. Selecting a region changes the website language and currency display; it is not a statement of regulatory approval. Product classifications, import rules, and availability vary. Confirm the details for the specific product and destination before ordering.' },
        { q: 'How do I choose a product?', a: 'Start by reviewing the product information and the purpose of your research. Our team can explain the catalog and available formats. Personal medical decisions should be discussed with a qualified healthcare professional.' },
        { q: 'How soon can results be expected?', a: 'Outcomes and timelines vary by compound and research context. The website does not guarantee an outcome or a timeline for results.' },
        { q: 'How do I read a Certificate of Analysis (COA)?', a: 'A COA typically identifies the compound, batch, purity, testing method, date, and laboratory results. Match the batch number on the product to the document. A COA describes testing; it is not proof of medical approval or suitability for personal use.' },
        { q: 'Can peptides be combined?', a: 'Do not assume that research into individual compounds establishes the safety of combining them. This website does not provide personalised combination or dosing advice.' },
        { q: 'What is the difference between a pen and a pre-filled cartridge?', a: 'The pen format includes the pen device. A pre-filled cartridge is intended for use with a compatible device. Check the product specifications and compatibility with our team before ordering.' },
        { q: 'Who is this catalog intended for?', a: 'The catalog provides information about laboratory research products for adults. It does not provide medical advice or establish that a product is suitable for human use.' },
        { q: 'What if there is a problem with my order?', a: 'Contact our team promptly with your order details and any relevant photos or batch information. Return eligibility and the next steps will be confirmed for your product and region.' },
        { q: 'Can I order from my selected region?', a: 'You are viewing Regen for {region}, with {currency} as the selected currency. Our team will confirm product availability, final pricing, and shipping options for your destination before you order.' },
      ],
      disclaimerTitle: 'Disclaimer',
      disclaimer: 'This content is provided for educational and informational purposes regarding peptide research compounds. It is not intended to diagnose, treat, cure, or prevent any disease and is not a substitute for professional medical advice. Consult a qualified healthcare professional about medical decisions. Selecting a region does not imply product approval or guaranteed delivery.',
    },
    footer: {
      title: 'Questions before you order? Start with a free consultation.',
      description: 'Our team can help you explore the catalog and confirm the information relevant to your region.',
      start: 'Talk to our team',
      email: 'Email us',
      tagline: 'Regenerative Science. Clearly Delivered.',
      about: 'Explore research peptides, product documentation, and support from the Regen team.',
      products: 'Products',
      catalog: 'Peptide catalog',
      cartridge: 'Pre-filled cartridges',
      pen: 'Pen format',
      company: 'Company',
      quality: 'Quality',
      shipping: 'Shipping',
      faq: 'FAQ',
      contact: 'Contact',
      regionShipping: 'Availability and shipping to {region} are confirmed by our team.',
      copyright: 'All rights reserved.',
      researchOnly: 'For laboratory research only.',
    },
  },
  ms: {
    consultation: {
      eyebrow: 'Rundingan percuma',
      title: 'Hubungi pasukan kami sebelum membuat pesanan',
      description: 'Kongsikan keperluan penyelidikan anda. Pasukan kami boleh membantu anda meneroka katalog serta mengesahkan maklumat produk, harga dan ketersediaan untuk rantau anda. Percuma, tanpa kewajipan membeli.',
      points: ['Maklumat produk dan format', 'Pertanyaan harga dan penghantaran mengikut rantau', 'Sokongan sebelum dan selepas pesanan'],
      cardTitle: 'Hubungi pasukan Regen',
      cardDescription: 'Sediakan e-mel kepada pasukan kami dengan rantau dan mata wang pilihan anda. Semak mesej sebelum menghantarnya melalui Gmail atau aplikasi e-mel anda.',
      start: 'Mulakan rundingan percuma',
      privacy: 'Tiada maklumat dihantar sehingga anda sendiri menghantar e-mel.',
    },
    modal: {
      close: 'Tutup rundingan',
      title: 'Permintaan rundingan',
      sendTitle: 'Semak permintaan anda',
      description: 'Baca maklumat di bawah sebelum meneruskan.',
      sendDescription: 'Pilih cara anda ingin menghantar e-mel kepada Regen.',
      scamTitle: 'Berwaspada terhadap penipuan',
      scamDescription: 'Gunakan alamat yang dipaparkan di sini untuk menghubungi Regen. Semak penerima sebelum berkongsi maklumat peribadi atau membuat pembayaran.',
      introduction: 'Pasukan kami boleh membantu dengan maklumat produk, harga dan ketersediaan untuk rantau pilihan anda. Pertanyaan ini bukan pesanan pembelian.',
      regionLabel: 'Rantau dan mata wang pilihan',
      phone: 'Nombor telefon untuk urusan rundingan',
      countryCode: 'Kod panggilan negara',
      phonePlaceholder: 'Nombor telefon anda',
      phoneHint: 'Pilih kod negara anda sendiri, walaupun berbeza daripada rantau pilihan. Masukkan sekurang-kurangnya 6 digit, dengan jumlah maksimum 15 digit termasuk kod negara.',
      euDialHint: 'EU mempunyai beberapa kod negara. Jerman (+49) dipilih pada awalnya; sila pilih negara anda.',
      agreement: 'Saya mengesahkan bahawa saya berumur sekurang-kurangnya 18 tahun dan memahami bahawa butiran ini akan dimasukkan dalam e-mel yang saya pilih untuk dihantar kepada Regen.',
      contact: 'Alamat e-mel rundingan',
      continue: 'Teruskan',
      to: 'Kepada',
      subject: 'Subjek',
      message: 'Mesej',
      gmail: 'Karang dalam Gmail',
      emailApp: 'Buka aplikasi e-mel saya',
      copyAddress: 'Salin alamat',
      copyMessage: 'Salin mesej',
      copied: 'Disalin',
      copyFailed: 'Fungsi salin tidak tersedia. Sila pilih dan salin teks di atas.',
      back: 'Kembali',
      draftNotice: 'Pilihan ini hanya membuka draf. Semak dan hantar sendiri apabila anda bersedia.',
    },
    email: {
      subject: 'Permintaan rundingan',
      greeting: 'Salam Regen,',
      general: 'Saya ingin memulakan rundingan.',
      product: 'Saya ingin mendapatkan maklumat lanjut tentang {product}.',
      region: 'Rantau pilihan',
      currency: 'Mata wang pilihan',
      phone: 'Nombor telefon saya',
      availability: 'Sila sahkan ketersediaan produk, harga dan pilihan penghantaran untuk rantau saya.',
    },
    faq: {
      eyebrow: 'Soalan lazim',
      title: 'Soalan yang sering ditanya',
      items: [
        { q: 'Apakah peptida dan bagaimana ia berfungsi?', a: 'Peptida ialah rantaian pendek asid amino yang boleh bertindak sebagai isyarat biologi. Para penyelidik mengkajinya untuk memahami proses seperti pemulihan, metabolisme dan penuaan. Hasil penyelidikan tidak membuktikan bahawa setiap peptida selamat atau berkesan untuk kegunaan peribadi.' },
        { q: 'Apakah maklumat produk yang boleh diberikan oleh Regen?', a: 'Hubungi pasukan kami untuk mendapatkan spesifikasi produk, dokumentasi kelompok, Sijil Analisis (COA) dan maklumat pengendalian yang tersedia bagi produk yang anda pertimbangkan.' },
        { q: 'Adakah peptida selamat digunakan?', a: 'Ujian ketulenan atau COA tidak membuktikan keselamatan untuk kegunaan manusia. Keselamatan bergantung pada sebatian, tujuan penggunaan dan keadaan individu. Dapatkan nasihat profesional kesihatan yang berkelayakan dan jangan gunakan laman web ini sebagai panduan perubatan.' },
        { q: 'Adakah pemilihan rantau bermakna semua produk diluluskan di sana?', a: 'Tidak. Pemilihan rantau menukar bahasa dan paparan mata wang laman web; ia bukan pengesahan kelulusan kawal selia. Pengelasan produk, peraturan import dan ketersediaan berbeza-beza. Sahkan butiran produk dan destinasi tertentu sebelum membuat pesanan.' },
        { q: 'Bagaimanakah saya memilih produk?', a: 'Mulakan dengan menyemak maklumat produk dan tujuan penyelidikan anda. Pasukan kami boleh menerangkan katalog dan format yang tersedia. Keputusan perubatan peribadi hendaklah dibincangkan dengan profesional kesihatan yang berkelayakan.' },
        { q: 'Bilakah hasil boleh dijangkakan?', a: 'Hasil dan tempohnya berbeza mengikut sebatian serta konteks penyelidikan. Laman web ini tidak menjamin hasil atau tempoh tertentu.' },
        { q: 'Bagaimanakah saya membaca Sijil Analisis (COA)?', a: 'COA lazimnya menyatakan sebatian, kelompok, ketulenan, kaedah ujian, tarikh dan keputusan makmal. Padankan nombor kelompok pada produk dengan dokumen. COA menerangkan ujian, bukan bukti kelulusan perubatan atau kesesuaian untuk kegunaan peribadi.' },
        { q: 'Bolehkah peptida digabungkan?', a: 'Jangan menganggap bahawa kajian terhadap sebatian secara berasingan membuktikan keselamatan menggabungkannya. Laman web ini tidak memberikan nasihat gabungan atau dos yang diperibadikan.' },
        { q: 'Apakah perbezaan antara pen dan kartrij praisi?', a: 'Format pen merangkumi peranti pen. Kartrij praisi bertujuan untuk digunakan dengan peranti yang serasi. Semak spesifikasi dan keserasian produk dengan pasukan kami sebelum membuat pesanan.' },
        { q: 'Katalog ini ditujukan kepada siapa?', a: 'Katalog ini menyediakan maklumat produk penyelidikan makmal untuk orang dewasa. Ia tidak memberikan nasihat perubatan atau membuktikan bahawa sesuatu produk sesuai untuk kegunaan manusia.' },
        { q: 'Apakah yang perlu saya lakukan jika ada masalah dengan pesanan?', a: 'Hubungi pasukan kami dengan segera bersama butiran pesanan dan sebarang gambar atau maklumat kelompok yang berkaitan. Kelayakan pemulangan dan langkah seterusnya akan disahkan mengikut produk dan rantau anda.' },
        { q: 'Bolehkah saya membuat pesanan dari rantau pilihan saya?', a: 'Anda sedang melihat Regen untuk {region}, dengan {currency} sebagai mata wang pilihan. Pasukan kami akan mengesahkan ketersediaan produk, harga akhir dan pilihan penghantaran ke destinasi anda sebelum anda membuat pesanan.' },
      ],
      disclaimerTitle: 'Penafian',
      disclaimer: 'Kandungan ini disediakan untuk tujuan pendidikan dan maklumat tentang sebatian peptida penyelidikan. Ia tidak bertujuan untuk mendiagnosis, merawat, menyembuhkan atau mencegah sebarang penyakit dan bukan pengganti nasihat perubatan profesional. Rujuk profesional kesihatan yang berkelayakan bagi keputusan perubatan. Pemilihan rantau tidak menandakan kelulusan produk atau jaminan penghantaran.',
    },
    footer: {
      title: 'Ada soalan sebelum memesan? Mulakan dengan rundingan percuma.',
      description: 'Pasukan kami boleh membantu anda meneroka katalog dan mengesahkan maklumat yang berkaitan dengan rantau anda.',
      start: 'Hubungi pasukan kami',
      email: 'E-mel kami',
      tagline: 'Sains Regeneratif. Disampaikan dengan Jelas.',
      about: 'Terokai peptida penyelidikan, dokumentasi produk dan sokongan daripada pasukan Regen.',
      products: 'Produk',
      catalog: 'Katalog peptida',
      cartridge: 'Kartrij praisi',
      pen: 'Format pen',
      company: 'Syarikat',
      quality: 'Kualiti',
      shipping: 'Penghantaran',
      faq: 'Soalan lazim',
      contact: 'Hubungi kami',
      regionShipping: 'Ketersediaan dan penghantaran ke {region} akan disahkan oleh pasukan kami.',
      copyright: 'Hak cipta terpelihara.',
      researchOnly: 'Untuk penyelidikan makmal sahaja.',
    },
  },
  id: {
    consultation: {
      eyebrow: 'Konsultasi gratis',
      title: 'Hubungi tim kami sebelum memesan',
      description: 'Ceritakan kebutuhan riset Anda. Tim kami dapat membantu Anda menjelajahi katalog serta mengonfirmasi informasi produk, harga, dan ketersediaan untuk wilayah Anda. Gratis, tanpa kewajiban membeli.',
      points: ['Informasi produk dan format', 'Pertanyaan harga dan pengiriman sesuai wilayah', 'Dukungan sebelum dan setelah pemesanan'],
      cardTitle: 'Hubungi tim Regen',
      cardDescription: 'Siapkan email untuk tim kami dengan wilayah dan mata uang pilihan Anda. Tinjau pesan sebelum mengirimnya melalui Gmail atau aplikasi email Anda.',
      start: 'Mulai konsultasi gratis',
      privacy: 'Tidak ada informasi yang dikirim sampai Anda sendiri mengirim email.',
    },
    modal: {
      close: 'Tutup konsultasi',
      title: 'Permintaan konsultasi',
      sendTitle: 'Tinjau permintaan Anda',
      description: 'Baca informasi berikut sebelum melanjutkan.',
      sendDescription: 'Pilih cara mengirim email kepada Regen.',
      scamTitle: 'Waspadai penipuan',
      scamDescription: 'Gunakan alamat yang ditampilkan di sini untuk menghubungi Regen. Periksa penerima sebelum membagikan data pribadi atau melakukan pembayaran.',
      introduction: 'Tim kami dapat membantu dengan informasi produk, harga, dan ketersediaan untuk wilayah pilihan Anda. Pertanyaan ini tidak membuat pesanan.',
      regionLabel: 'Wilayah dan mata uang pilihan',
      phone: 'Nomor telepon untuk konsultasi',
      countryCode: 'Kode telepon negara',
      phonePlaceholder: 'Nomor telepon Anda',
      phoneHint: 'Pilih kode negara nomor Anda, meskipun berbeda dari wilayah pilihan. Masukkan minimal 6 digit, dengan total maksimal 15 digit termasuk kode negara.',
      euDialHint: 'UE memiliki beberapa kode negara. Jerman (+49) dipilih sebagai awal; silakan pilih negara Anda.',
      agreement: 'Saya menyatakan bahwa saya berusia minimal 18 tahun dan memahami bahwa data ini akan disertakan dalam email yang saya pilih untuk dikirim kepada Regen.',
      contact: 'Alamat email konsultasi',
      continue: 'Lanjutkan',
      to: 'Kepada',
      subject: 'Subjek',
      message: 'Pesan',
      gmail: 'Tulis di Gmail',
      emailApp: 'Buka aplikasi email saya',
      copyAddress: 'Salin alamat',
      copyMessage: 'Salin pesan',
      copied: 'Disalin',
      copyFailed: 'Fitur salin tidak tersedia. Silakan pilih dan salin teks di atas.',
      back: 'Kembali',
      draftNotice: 'Pilihan ini hanya membuka draf. Periksa dan kirim sendiri saat Anda siap.',
    },
    email: {
      subject: 'Permintaan konsultasi',
      greeting: 'Halo Regen,',
      general: 'Saya ingin memulai konsultasi.',
      product: 'Saya ingin mendapatkan informasi lebih lanjut tentang {product}.',
      region: 'Wilayah pilihan',
      currency: 'Mata uang pilihan',
      phone: 'Nomor telepon saya',
      availability: 'Mohon konfirmasi ketersediaan produk, harga, dan pilihan pengiriman untuk wilayah saya.',
    },
    faq: {
      eyebrow: 'Tanya jawab',
      title: 'Pertanyaan yang sering diajukan',
      items: [
        { q: 'Apa itu peptida dan bagaimana cara kerjanya?', a: 'Peptida adalah rantai pendek asam amino yang dapat berperan sebagai sinyal biologis. Para peneliti mempelajarinya untuk memahami proses seperti pemulihan, metabolisme, dan penuaan. Hasil riset tidak membuktikan bahwa setiap peptida aman atau efektif untuk penggunaan pribadi.' },
        { q: 'Informasi produk apa yang dapat diberikan Regen?', a: 'Hubungi tim kami untuk meminta spesifikasi produk, dokumentasi batch, Sertifikat Analisis (COA), dan informasi penanganan yang tersedia untuk produk yang Anda pertimbangkan.' },
        { q: 'Apakah peptida aman digunakan?', a: 'Uji kemurnian atau COA tidak membuktikan keamanan untuk penggunaan manusia. Keamanan bergantung pada senyawa, tujuan penggunaan, dan kondisi individu. Mintalah saran tenaga kesehatan yang berkualifikasi, bukan menjadikan situs ini sebagai panduan medis.' },
        { q: 'Apakah memilih wilayah berarti semua produk disetujui di sana?', a: 'Tidak. Pemilihan wilayah mengubah bahasa dan tampilan mata uang situs; ini bukan pernyataan persetujuan regulasi. Klasifikasi produk, aturan impor, dan ketersediaan dapat berbeda. Konfirmasikan detail produk dan tujuan pengiriman sebelum memesan.' },
        { q: 'Bagaimana cara memilih produk?', a: 'Mulailah dengan meninjau informasi produk dan tujuan riset Anda. Tim kami dapat menjelaskan katalog dan format yang tersedia. Keputusan medis pribadi perlu dibahas dengan tenaga kesehatan yang berkualifikasi.' },
        { q: 'Kapan hasil dapat diharapkan?', a: 'Hasil dan waktunya berbeda menurut senyawa serta konteks riset. Situs ini tidak menjamin hasil atau jangka waktu tertentu.' },
        { q: 'Bagaimana cara membaca Sertifikat Analisis (COA)?', a: 'COA biasanya mencantumkan senyawa, batch, kemurnian, metode pengujian, tanggal, dan hasil laboratorium. Cocokkan nomor batch pada produk dengan dokumen. COA menjelaskan pengujian, bukan bukti persetujuan medis atau kesesuaian untuk penggunaan pribadi.' },
        { q: 'Apakah peptida dapat dikombinasikan?', a: 'Jangan menganggap bahwa riset atas masing-masing senyawa membuktikan keamanan menggabungkannya. Situs ini tidak memberikan saran kombinasi atau dosis yang dipersonalisasi.' },
        { q: 'Apa perbedaan antara pen dan kartrid siap pakai?', a: 'Format pen menyertakan perangkat pen. Kartrid siap pakai ditujukan untuk digunakan dengan perangkat yang kompatibel. Periksa spesifikasi dan kompatibilitas produk dengan tim kami sebelum memesan.' },
        { q: 'Untuk siapa katalog ini ditujukan?', a: 'Katalog ini menyediakan informasi produk riset laboratorium untuk orang dewasa. Katalog tidak memberikan saran medis atau membuktikan bahwa produk cocok untuk penggunaan manusia.' },
        { q: 'Apa yang harus dilakukan jika ada masalah dengan pesanan?', a: 'Segera hubungi tim kami dengan detail pesanan serta foto atau informasi batch yang relevan. Kelayakan pengembalian dan langkah berikutnya akan dikonfirmasi sesuai produk dan wilayah Anda.' },
        { q: 'Apakah saya dapat memesan dari wilayah pilihan saya?', a: 'Anda sedang melihat Regen untuk {region}, dengan {currency} sebagai mata uang pilihan. Tim kami akan mengonfirmasi ketersediaan produk, harga akhir, dan pilihan pengiriman ke tujuan Anda sebelum pemesanan.' },
      ],
      disclaimerTitle: 'Penyangkalan',
      disclaimer: 'Konten ini disediakan untuk tujuan edukasi dan informasi tentang senyawa peptida riset. Konten tidak dimaksudkan untuk mendiagnosis, merawat, menyembuhkan, atau mencegah penyakit dan bukan pengganti saran medis profesional. Konsultasikan keputusan medis dengan tenaga kesehatan yang berkualifikasi. Pemilihan wilayah tidak berarti persetujuan produk atau jaminan pengiriman.',
    },
    footer: {
      title: 'Ada pertanyaan sebelum memesan? Mulai dengan konsultasi gratis.',
      description: 'Tim kami dapat membantu Anda menjelajahi katalog dan mengonfirmasi informasi yang relevan untuk wilayah Anda.',
      start: 'Hubungi tim kami',
      email: 'Email kami',
      tagline: 'Sains Regeneratif. Disampaikan dengan Jelas.',
      about: 'Jelajahi peptida riset, dokumentasi produk, dan dukungan dari tim Regen.',
      products: 'Produk',
      catalog: 'Katalog peptida',
      cartridge: 'Kartrid siap pakai',
      pen: 'Format pen',
      company: 'Perusahaan',
      quality: 'Kualitas',
      shipping: 'Pengiriman',
      faq: 'Tanya jawab',
      contact: 'Kontak',
      regionShipping: 'Ketersediaan dan pengiriman ke {region} akan dikonfirmasi oleh tim kami.',
      copyright: 'Hak cipta dilindungi.',
      researchOnly: 'Hanya untuk riset laboratorium.',
    },
  },
}

export function regionalSupportText(text: string, region: Region): string {
  return text.replaceAll('{region}', region.name).replaceAll('{currency}', region.currency)
}

/** Builds an email draft only. Sending remains an explicit visitor action. */
export function buildConsultationEmail({
  language,
  region,
  productName,
  countryDial,
  phoneNumber,
}: {
  language: Language
  region: Region
  productName: string | null
  countryDial: string
  phoneNumber: string
}) {
  const copy = SUPPORT_COPY[language].email
  const subject = `${copy.subject} — ${region.name} (${region.currency})${productName ? ` — ${productName}` : ''}`
  const body = [
    copy.greeting,
    '',
    productName ? copy.product.replace('{product}', productName) : copy.general,
    '',
    `${copy.region}: ${region.name}`,
    `${copy.currency}: ${region.currency}`,
    `${copy.phone}: ${countryDial} ${phoneNumber.trim()}`,
    '',
    copy.availability,
  ].join('\n')

  return {
    subject,
    body,
    mailtoUrl: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    gmailUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  }
}
