import type { Metadata } from 'next'
import { REGIONS, regionPath, type Region } from '@/lib/regions'

const descriptions = {
  en: 'Explore the Regen research catalog, product information and scientific support for your region.',
  ms: 'Terokai katalog penyelidikan Regen, maklumat produk dan sokongan saintifik untuk Malaysia.',
  id: 'Jelajahi katalog penelitian Regen, informasi produk, dan dukungan ilmiah untuk Indonesia.',
}

export function regionAlternates(region: Region, path = ''): Metadata['alternates'] {
  return {
    canonical: regionPath(region.id, path),
    languages: {
      'x-default': '/',
      ...Object.fromEntries(REGIONS.map((item) => [item.id === 'eu' ? 'en' : item.locale, regionPath(item.id, path)])),
    },
  }
}

export function regionMetadata(region: Region): Metadata {
  const title = `Regen ${region.name} | ${region.currency}`
  const description = descriptions[region.language]
  return {
    title, description,
    alternates: regionAlternates(region),
    openGraph: { title, description, type: 'website', url: regionPath(region.id), locale: region.locale.replace('-', '_') },
  }
}
