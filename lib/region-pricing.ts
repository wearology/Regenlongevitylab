import type { VariantId } from './products'
import type { Region, RegionId } from './regions'

/** Published numeric catalog prices, not live currency conversions.
 * Preserve the existing EUR amounts and inquiry-only prices in other markets.
 * Indonesia has no flat fallback: only the exact product/format prices below
 * may be displayed. The former IDR 2,500,000 / 3,500,000 defaults are retired.
 */
export const REGIONAL_PRICES: Record<RegionId, Record<VariantId, number | null>> = {
  au: { cartridge: null, pen: null },
  eu: { cartridge: 143, pen: 200 },
  us: { cartridge: null, pen: null },
  uk: { cartridge: null, pen: null },
  sg: { cartridge: null, pen: null },
  my: { cartridge: null, pen: null },
  id: { cartridge: null, pen: null },
}

/** IDR prices verified from the supplied sheet on 2026-08-30.
 * Source: https://docs.google.com/spreadsheets/d/1kBjIQ498O3CDZ3d2GzyNS8zG6SJDJbM5A7kwonf6qQk/edit?gid=0#gid=0
 * Tab: 'idr pricing' (gid=0). Ranges: D4:E5, D8:E9, D11:E13, D19:E19.
 * D = harga CARTRIDGE set; E = harga pen complete package.
 * These are complete-format prices, not Basic Set (column C) prices.
 * Only the eight existing catalog products and their matching strengths are
 * included; other strengths, additional products and coming-soon rows are not.
 */
export const INDONESIAN_PRODUCT_PRICES: Readonly<Record<string, Readonly<Record<VariantId, number | null>>>> = {
  retatrutide: { cartridge: 1_199_000, pen: 1_799_000 }, // Row 4: Retatrutide 10mg.
  'cjc-1295-ipamorelin': { cartridge: 1_298_000, pen: 1_898_000 }, // Row 12: CJC-1295 No DAC 5mg + Ipamorelin 5mg.
  klow80: { cartridge: 2_000_000, pen: 2_600_000 }, // Row 11: KLOW 80mg.
  'mots-c': { cartridge: 1_376_000, pen: 1_976_000 }, // Row 13: MOTS-C 10mg.
  'nad-plus': { cartridge: 1_362_000, pen: 1_962_000 }, // Row 9: NAD+ 500mg.
  tesamorelin: { cartridge: 1_572_000, pen: 2_172_000 }, // Row 5: Tesamorelin 10mg.
  'bpc-157': { cartridge: 1_362_000, pen: 1_962_000 }, // Row 19: BPC-157 10mg.
  'ghk-cu': { cartridge: 1_278_000, pen: 1_878_000 }, // Row 8: GHK-Cu 100mg.
}

export function getRegionalPriceAmount(regionId: RegionId, productSlug: string, variant: VariantId): number | null {
  if (regionId === 'id') {
    if (!Object.hasOwn(INDONESIAN_PRODUCT_PRICES, productSlug)) return null
    const prices = INDONESIAN_PRODUCT_PRICES[productSlug]
    return Object.hasOwn(prices, variant) ? prices[variant] : null
  }

  if (!Object.hasOwn(REGIONAL_PRICES, regionId)) return null
  const prices = REGIONAL_PRICES[regionId]
  return Object.hasOwn(prices, variant) ? prices[variant] : null
}

export function formatRegionPrice(region: Region, productSlug: string, variant: VariantId): string | null {
  const amount = getRegionalPriceAmount(region.id, productSlug, variant)
  if (amount === null) return null

  return new Intl.NumberFormat(region.locale, {
    style: 'currency',
    currency: region.currency,
    currencyDisplay: 'code',
    minimumFractionDigits: 0,
    maximumFractionDigits: region.currency === 'IDR' ? 0 : 2,
  }).format(amount)
}

export function getRegionalPriceLabel(region: Region, productSlug: string, variant: VariantId): string {
  const price = formatRegionPrice(region, productSlug, variant)
  if (price !== null) return price
  if (region.language === 'ms') return `Tanya harga ${region.currency}`
  if (region.language === 'id') return `Tanya harga ${region.currency}`
  return `Request ${region.currency} pricing`
}
