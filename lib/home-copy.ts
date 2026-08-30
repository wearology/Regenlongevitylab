import type { Language, RegionId } from '@/lib/regions'

type HomeCopy = {
  viewCatalog: string
  freeConsultation: string
  startConsultation: string
  hero: {
    trusted: string
    body: string
    settings: string
    trust: readonly [string, string, string]
  }
  principles: {
    heading: string
    items: readonly { title: string; body: string }[]
  }
  testimonial: {
    heading: string
    intro: string
    disclaimer: string
    quote: string
    body: string
    detail: string
  }
  journey: {
    heading: string
    intro: string
    steps: readonly { title: string; body: string }[]
  }
  reviews: {
    heading: string
    rating: string
    items: readonly { body: string; initial: string; name: string; detail: string }[]
  }
  lab: { label: string; heading: string; body: string }
  slider: { before: string; after: string; label: string }
  documents: { heading: string; verify: string }
}

// Each landing page has its own introduction. These describe the experience,
// not local product approval, delivery coverage, or clinical availability.
export const regionHeroCopy: Record<RegionId, { headline: string; accent: string }> = {
  au: { headline: 'A considered approach to', accent: 'regeneration.' },
  eu: { headline: 'European research.', accent: 'A new perspective.' },
  us: { headline: 'Explore the science of', accent: 'your next chapter.' },
  uk: { headline: 'Regeneration begins with', accent: 'understanding.' },
  sg: { headline: 'A clearer view of', accent: 'regeneration research.' },
  my: { headline: 'Terokai sains di sebalik', accent: 'regenerasi.' },
  id: { headline: 'Kenali sains untuk', accent: 'langkah berikutnya.' },
}

export const homeCopy: Record<Language, HomeCopy> = {
  en: {
    viewCatalog: 'View Catalog',
    freeConsultation: 'Free Consultation',
    startConsultation: 'Start Free Consultation',
    hero: {
      trusted: 'Trusted and used by influencers, physicians, and wellness practitioners.',
      body: 'European research-grade peptides for fat loss, muscle gain, regeneration & lifespan, recovery, and cognitive focus — all on one platform.',
      settings: 'Your regional settings',
      trust: [
        'Lab-tested before every shipment.',
        '24/7 customer support.',
        'Secure, temperature-controlled delivery.',
      ],
    },
    principles: {
      heading: 'Built for those serious about regeneration & lifespan',
      items: [
        { title: 'Controlled Quality', body: 'No products of unclear origin. Every batch is produced in manufacturing facilities that meet European quality standards, with strict quality control.' },
        { title: 'Free 24/7 Consultation', body: 'Our team helps you choose the right product and protocol before you buy. No cost, no pressure.' },
        { title: 'Full Transparency', body: 'Product specifications are verifiable for every order. You know exactly what you are working with.' },
      ],
    },
    testimonial: {
      heading: 'Trusted by athletes and wellness practitioners',
      intro: "Fitness and regeneration & lifespan practitioners make Regen's premium peptides part of their routine.",
      disclaimer: '*Experiences shown are individual and do not necessarily represent the same results for everyone.',
      quote: '“My progress is back, and it keeps me motivated.”',
      body: "I've been training for a long time, but only now am I seeing real change. Within a few weeks my physique looked denser, muscles more defined, and my energy during training felt far better.",
      detail: 'Bodybuilding & wellness practitioner',
    },
    journey: {
      heading: 'Your regeneration & lifespan journey starts here',
      intro: 'From the first consultation to usage guidance, we help simplify every step so you can focus on your goal.',
      steps: [
        { title: 'Define your goal', body: 'Everyone has a different target — regeneration & lifespan, fat loss, recovery, performance, or cognitive support. We help clarify your goal before recommending the next step.' },
        { title: 'Get a tailored recommendation', body: 'Based on your goal and situation, our team explains the product options, protocols, and the approach that is most relevant. No consultation fee and no obligation to buy.' },
        { title: 'Start with confidence', body: 'Once you choose the right protocol, you receive usage guidance, product documentation, and full support from our team throughout the process.' },
      ],
    },
    reviews: {
      heading: 'What they say about Regen',
      rating: 'from 107 verified reviews',
      items: [
        { body: 'What sold me was the consultation. I came in with a list of questions and left actually understanding what I was ordering instead of just guessing.', initial: 'M', name: 'Marcus', detail: '43, Operations Manager' },
        { body: 'Box turned up cold, ice packs still solid, everything sealed. Honestly did not expect the packaging to be this careful.', initial: 'C', name: 'Chloe', detail: '29, Brand Strategist' },
        { body: 'Been through a few suppliers over the years and most go quiet the moment you pay. These guys actually kept checking in after the order landed.', initial: 'D', name: 'Daniel', detail: '47, Sales Director' },
        { body: 'Ngl I was skeptical at first, but the whole thing felt legit. Verification code checked out, and the guide book made it easy to follow.', initial: 'K', name: 'Kayla', detail: '26, Content Creator' },
        { body: 'As a practitioner I need to see documentation, not marketing. Regen sent the Certificate of Analysis without me even having to ask twice. That earns trust.', initial: 'H', name: 'Dr. Hannah', detail: '39, Physician' },
        { body: 'Pen setup is genuinely easy. The clicks are precise so I always know exactly where my dose is.', initial: 'R', name: 'Ryan', detail: '34, Personal Trainer' },
        { body: 'Support replied within minutes when my shipment got held up, kept me posted the whole way, and sorted it out. Little things like that matter.', initial: 'G', name: 'Grace', detail: '37, Project Manager' },
        { body: 'Been running my protocol for a couple months now and the consistency batch to batch is what keeps me here. No surprises.', initial: 'N', name: 'Nathan', detail: '41, Software Engineer' },
        { body: 'Clean, no fuss, delivered on time. The cold-chain packaging is next level tbh.', initial: 'E', name: 'Emma', detail: '24, Nutritionist' },
      ],
    },
    lab: {
      label: 'Laboratory Testing',
      heading: 'Tested in European laboratories',
      body: 'Every batch we ship is tested by independent European laboratories against European quality standards, referencing the European Pharmacopoeia (Ph. Eur.) where applicable. A Certificate of Analysis is available for every order.',
    },
    slider: { before: 'Before', after: 'After', label: 'Before and after image comparison' },
    documents: { heading: 'COA and other lab testing documents', verify: 'Verify on the Janoshik website' },
  },
  ms: {
    viewCatalog: 'Lihat Katalog',
    freeConsultation: 'Konsultasi Percuma',
    startConsultation: 'Mulakan Konsultasi Percuma',
    hero: {
      trusted: 'Dipercayai dan digunakan oleh pempengaruh, doktor dan pengamal kesejahteraan.',
      body: 'Peptida gred penyelidikan Eropah untuk pengurangan lemak, pembinaan otot, regenerasi dan jangka hayat, pemulihan serta fokus kognitif — semuanya dalam satu platform.',
      settings: 'Tetapan wilayah anda',
      trust: [
        'Diuji di makmal sebelum setiap penghantaran.',
        'Sokongan pelanggan 24/7.',
        'Penghantaran selamat dengan suhu terkawal.',
      ],
    },
    principles: {
      heading: 'Untuk mereka yang serius tentang regenerasi dan jangka hayat',
      items: [
        { title: 'Kualiti Terkawal', body: 'Tiada produk yang tidak jelas asal usulnya. Setiap kelompok dihasilkan di kemudahan pembuatan yang memenuhi piawaian kualiti Eropah, dengan kawalan kualiti yang ketat.' },
        { title: 'Konsultasi Percuma 24/7', body: 'Pasukan kami membantu anda memilih produk dan protokol yang sesuai sebelum membeli. Tanpa bayaran, tanpa tekanan.' },
        { title: 'Ketelusan Sepenuhnya', body: 'Spesifikasi produk boleh disahkan bagi setiap pesanan. Anda tahu dengan jelas produk yang anda gunakan.' },
      ],
    },
    testimonial: {
      heading: 'Dipercayai oleh atlet dan pengamal kesejahteraan',
      intro: 'Pengamal kecergasan, regenerasi dan jangka hayat menjadikan peptida premium Regen sebahagian daripada rutin mereka.',
      disclaimer: '*Pengalaman yang dipaparkan ialah pengalaman individu dan tidak semestinya memberikan hasil yang sama untuk semua orang.',
      quote: '“Saya mula melihat kemajuan semula, dan itu terus mendorong saya.”',
      body: 'Saya sudah lama berlatih, tetapi baru sekarang saya melihat perubahan yang nyata. Dalam beberapa minggu, tubuh saya kelihatan lebih padat, otot lebih jelas dan saya berasa jauh lebih bertenaga semasa latihan.',
      detail: 'Pengamal bina badan dan kesejahteraan',
    },
    journey: {
      heading: 'Perjalanan regenerasi dan jangka hayat anda bermula di sini',
      intro: 'Daripada konsultasi pertama hingga panduan penggunaan, kami membantu memudahkan setiap langkah supaya anda boleh memberi tumpuan kepada matlamat anda.',
      steps: [
        { title: 'Tentukan matlamat anda', body: 'Setiap orang mempunyai sasaran berbeza — regenerasi dan jangka hayat, pengurangan lemak, pemulihan, prestasi atau sokongan kognitif. Kami membantu memperjelas matlamat anda sebelum mencadangkan langkah seterusnya.' },
        { title: 'Dapatkan cadangan yang bersesuaian', body: 'Berdasarkan matlamat dan keadaan anda, pasukan kami menerangkan pilihan produk, protokol dan pendekatan yang paling relevan. Tiada yuran konsultasi dan tiada kewajipan untuk membeli.' },
        { title: 'Bermula dengan yakin', body: 'Selepas memilih protokol yang sesuai, anda menerima panduan penggunaan, dokumentasi produk dan sokongan penuh daripada pasukan kami sepanjang proses.' },
      ],
    },
    reviews: {
      heading: 'Apa kata mereka tentang Regen',
      rating: 'daripada 107 ulasan yang disahkan',
      items: [
        { body: 'Konsultasi itulah yang meyakinkan saya. Saya datang dengan senarai soalan dan akhirnya benar-benar memahami apa yang saya pesan, bukan sekadar meneka.', initial: 'M', name: 'Marcus', detail: '43, Pengurus Operasi' },
        { body: 'Kotak tiba dalam keadaan sejuk, pek ais masih beku dan semua bungkusan masih tertutup rapat. Sejujurnya, saya tidak menyangka pembungkusannya begitu teliti.', initial: 'C', name: 'Chloe', detail: '29, Pakar Strategi Jenama' },
        { body: 'Saya pernah berurusan dengan beberapa pembekal selama bertahun-tahun dan kebanyakannya senyap selepas pembayaran. Pasukan ini masih menghubungi saya selepas pesanan tiba.', initial: 'D', name: 'Daniel', detail: '47, Pengarah Jualan' },
        { body: 'Sejujurnya saya agak ragu-ragu pada mulanya, tetapi seluruh proses terasa meyakinkan. Kod pengesahan sah dan buku panduannya mudah diikuti.', initial: 'K', name: 'Kayla', detail: '26, Pencipta Kandungan' },
        { body: 'Sebagai pengamal, saya perlu melihat dokumentasi, bukan pemasaran. Regen menghantar Sijil Analisis tanpa saya perlu meminta berkali-kali. Itu membina kepercayaan.', initial: 'H', name: 'Dr. Hannah', detail: '39, Doktor' },
        { body: 'Persediaan pen memang mudah. Setiap klik tepat, jadi saya sentiasa tahu tetapan dos saya.', initial: 'R', name: 'Ryan', detail: '34, Jurulatih Peribadi' },
        { body: 'Apabila penghantaran saya tertangguh, pasukan sokongan membalas dalam beberapa minit, terus memaklumkan perkembangannya dan menyelesaikan masalah itu. Perkara kecil begini sangat bermakna.', initial: 'G', name: 'Grace', detail: '37, Pengurus Projek' },
        { body: 'Saya sudah mengikuti protokol saya selama beberapa bulan. Konsistensi antara kelompok membuatkan saya terus memilih Regen. Tiada kejutan.', initial: 'N', name: 'Nathan', detail: '41, Jurutera Perisian' },
        { body: 'Bersih, mudah dan tiba tepat pada masanya. Pembungkusan rantaian sejuknya memang mengagumkan.', initial: 'E', name: 'Emma', detail: '24, Pakar Pemakanan' },
      ],
    },
    lab: {
      label: 'Ujian Makmal',
      heading: 'Diuji di makmal Eropah',
      body: 'Setiap kelompok yang kami hantar diuji oleh makmal bebas di Eropah mengikut piawaian kualiti Eropah, dengan rujukan kepada Farmakope Eropah (Ph. Eur.) jika berkenaan. Sijil Analisis tersedia bagi setiap pesanan.',
    },
    slider: { before: 'Sebelum', after: 'Selepas', label: 'Perbandingan gambar sebelum dan selepas' },
    documents: { heading: 'COA dan dokumen ujian makmal lain', verify: 'Sahkan di laman web Janoshik' },
  },
  id: {
    viewCatalog: 'Lihat Katalog',
    freeConsultation: 'Konsultasi Gratis',
    startConsultation: 'Mulai Konsultasi Gratis',
    hero: {
      trusted: 'Dipercaya dan digunakan oleh influencer, dokter, dan praktisi kebugaran.',
      body: 'Peptida berkualitas riset Eropa untuk pengurangan lemak, pembentukan otot, regenerasi dan umur panjang, pemulihan, serta fokus kognitif — semua dalam satu platform.',
      settings: 'Pengaturan wilayah Anda',
      trust: [
        'Diuji di laboratorium sebelum setiap pengiriman.',
        'Dukungan pelanggan 24/7.',
        'Pengiriman aman dengan suhu terkontrol.',
      ],
    },
    principles: {
      heading: 'Untuk Anda yang serius tentang regenerasi dan umur panjang',
      items: [
        { title: 'Kualitas Terkontrol', body: 'Tidak ada produk dengan asal-usul yang tidak jelas. Setiap batch diproduksi di fasilitas manufaktur yang memenuhi standar kualitas Eropa, dengan kontrol kualitas yang ketat.' },
        { title: 'Konsultasi Gratis 24/7', body: 'Tim kami membantu Anda memilih produk dan protokol yang sesuai sebelum membeli. Tanpa biaya, tanpa tekanan.' },
        { title: 'Transparansi Penuh', body: 'Spesifikasi produk dapat diverifikasi untuk setiap pesanan. Anda tahu persis produk yang Anda gunakan.' },
      ],
    },
    testimonial: {
      heading: 'Dipercaya oleh atlet dan praktisi kebugaran',
      intro: 'Praktisi kebugaran, regenerasi, dan umur panjang menjadikan peptida premium Regen bagian dari rutinitas mereka.',
      disclaimer: '*Pengalaman yang ditampilkan bersifat individual dan tidak selalu memberikan hasil yang sama bagi setiap orang.',
      quote: '“Progres saya kembali, dan itu membuat saya terus termotivasi.”',
      body: 'Saya sudah lama berlatih, tetapi baru sekarang melihat perubahan yang nyata. Dalam beberapa minggu, tubuh saya terlihat lebih padat, otot lebih tegas, dan energi saat latihan terasa jauh lebih baik.',
      detail: 'Praktisi binaraga dan kebugaran',
    },
    journey: {
      heading: 'Perjalanan regenerasi dan umur panjang Anda dimulai di sini',
      intro: 'Dari konsultasi pertama hingga panduan penggunaan, kami membantu menyederhanakan setiap langkah agar Anda dapat fokus pada tujuan Anda.',
      steps: [
        { title: 'Tentukan tujuan Anda', body: 'Setiap orang memiliki target berbeda — regenerasi dan umur panjang, pengurangan lemak, pemulihan, performa, atau dukungan kognitif. Kami membantu memperjelas tujuan Anda sebelum merekomendasikan langkah berikutnya.' },
        { title: 'Dapatkan rekomendasi yang sesuai', body: 'Berdasarkan tujuan dan kondisi Anda, tim kami menjelaskan pilihan produk, protokol, dan pendekatan yang paling relevan. Tanpa biaya konsultasi dan tanpa kewajiban membeli.' },
        { title: 'Mulai dengan yakin', body: 'Setelah memilih protokol yang sesuai, Anda menerima panduan penggunaan, dokumentasi produk, dan dukungan penuh dari tim kami sepanjang proses.' },
      ],
    },
    reviews: {
      heading: 'Apa kata mereka tentang Regen',
      rating: 'dari 107 ulasan terverifikasi',
      items: [
        { body: 'Yang meyakinkan saya adalah konsultasinya. Saya datang dengan daftar pertanyaan dan pulang dengan benar-benar memahami apa yang saya pesan, bukan sekadar menebak.', initial: 'M', name: 'Marcus', detail: '43, Manajer Operasional' },
        { body: 'Kotaknya tiba dalam keadaan dingin, ice pack masih beku, dan semuanya tersegel. Jujur, saya tidak menyangka pengemasannya seteliti ini.', initial: 'C', name: 'Chloe', detail: '29, Ahli Strategi Merek' },
        { body: 'Selama bertahun-tahun saya sudah mencoba beberapa pemasok dan kebanyakan menghilang setelah pembayaran. Tim ini tetap menanyakan kabar setelah pesanan tiba.', initial: 'D', name: 'Daniel', detail: '47, Direktur Penjualan' },
        { body: 'Jujur, awalnya saya ragu, tetapi keseluruhan proses terasa meyakinkan. Kode verifikasinya valid dan buku panduannya mudah diikuti.', initial: 'K', name: 'Kayla', detail: '26, Kreator Konten' },
        { body: 'Sebagai praktisi, saya perlu melihat dokumentasi, bukan pemasaran. Regen mengirimkan Sertifikat Analisis tanpa perlu saya minta berulang kali. Itu membangun kepercayaan.', initial: 'H', name: 'Dr. Hannah', detail: '39, Dokter' },
        { body: 'Menyiapkan pen benar-benar mudah. Kliknya presisi sehingga saya selalu tahu pengaturan dosis saya.', initial: 'R', name: 'Ryan', detail: '34, Pelatih Pribadi' },
        { body: 'Saat pengiriman saya tertunda, dukungan pelanggan membalas dalam hitungan menit, terus memberi kabar, dan menyelesaikan masalahnya. Hal-hal kecil seperti itu berarti.', initial: 'G', name: 'Grace', detail: '37, Manajer Proyek' },
        { body: 'Saya sudah menjalankan protokol selama beberapa bulan. Konsistensi antarbatch membuat saya tetap memilih Regen. Tidak ada kejutan.', initial: 'N', name: 'Nathan', detail: '41, Insinyur Perangkat Lunak' },
        { body: 'Bersih, tidak ribet, dan tiba tepat waktu. Pengemasan rantai dinginnya benar-benar mengesankan.', initial: 'E', name: 'Emma', detail: '24, Ahli Gizi' },
      ],
    },
    lab: {
      label: 'Pengujian Laboratorium',
      heading: 'Diuji di laboratorium Eropa',
      body: 'Setiap batch yang kami kirim diuji oleh laboratorium independen di Eropa sesuai standar kualitas Eropa, dengan mengacu pada Farmakope Eropa (Ph. Eur.) jika berlaku. Sertifikat Analisis tersedia untuk setiap pesanan.',
    },
    slider: { before: 'Sebelum', after: 'Sesudah', label: 'Perbandingan gambar sebelum dan sesudah' },
    documents: { heading: 'COA dan dokumen pengujian laboratorium lainnya', verify: 'Verifikasi di situs Janoshik' },
  },
}
