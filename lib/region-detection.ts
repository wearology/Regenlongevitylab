import type { RegionId } from './regions'

export const REGION_SUGGESTION_DISMISSED_COOKIE = 'regen-region-suggestion-dismissed'
export const COUNTRY_HEADER = 'x-vercel-ip-country'

// ISO 3166-1 alpha-2 country codes. EU means the 27 member countries, not
// geographic Europe: the UK has its own storefront, and CH/NO are not EU.
const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
])

const COUNTRY_REGIONS: Readonly<Record<string, RegionId>> = {
  AU: 'au', US: 'us', GB: 'uk', SG: 'sg', MY: 'my', ID: 'id',
}

export function regionForCountry(country: string | null | undefined): RegionId | null {
  const code = country?.trim().toUpperCase()
  if (!code || !/^[A-Z]{2}$/.test(code)) return null
  if (EU_COUNTRIES.has(code)) return 'eu'
  return COUNTRY_REGIONS[code] ?? null
}

/** Hosting-provided country only: no GPS, raw IP storage, browser-language
 * guesses, or third-party IP lookup. Unknown/unsupported countries stay on
 * the ordinary chooser. Never use the suggestion to redirect automatically.
 */
export function suggestedRegion({ country, isVercel, dismissed }: {
  country: string | null | undefined
  isVercel: boolean
  dismissed: boolean
}): RegionId | null {
  if (!isVercel || dismissed) return null
  return regionForCountry(country)
}
