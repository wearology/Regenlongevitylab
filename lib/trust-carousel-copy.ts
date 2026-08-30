import type { Language } from './regions'

// Short brand and testing terms stay in English across regions, like the hero
// tagline. These describe the existing research/testing offering, not medical
// approval, sterility, or a universal purity result.
export const TRUST_CAROUSEL_ITEMS = [
  { id: 'endotoxin', label: 'Endotoxin tested' },
  { id: 'research', label: 'Research grade' },
  { id: 'coa', label: 'Batch-specific COA' },
  { id: 'hplc', label: 'HPLC tested' },
] as const

export const TRUST_CAROUSEL_COPY: Record<Language, {
  label: string
  pause: string
  resume: string
}> = {
  en: {
    label: 'Regen quality highlights',
    pause: 'Pause carousel',
    resume: 'Resume carousel',
  },
  ms: {
    label: 'Kualiti dan ujian Regen',
    pause: 'Jeda carousel',
    resume: 'Teruskan carousel',
  },
  id: {
    label: 'Kualitas dan pengujian Regen',
    pause: 'Jeda carousel',
    resume: 'Lanjutkan carousel',
  },
}
