import type { VariantId } from './products'
import type { Region, RegionId } from './regions'

/** Published numeric catalog prices, not live currency conversions.
 * The original catalog documented IDR 2,500,000 / 3,500,000 and displayed
 * EUR 143 / 200. Preserve those amounts until the team supplies market lists.
 * Set an approved local price here to replace that market's inquiry label.
 */
export const REGIONAL_PRICES: Record<RegionId, Record<VariantId, number | null>> = {
  au: { cartridge: null, pen: null },
  eu: { cartridge: 143, pen: 200 },
  us: { cartridge: null, pen: null },
  uk: { cartridge: null, pen: null },
  sg: { cartridge: null, pen: null },
  my: { cartridge: null, pen: null },
  id: { cartridge: 2_500_000, pen: 3_500_000 },
}

export function getRegionalPriceAmount(regionId: RegionId, variant: VariantId): number | null {
  return REGIONAL_PRICES[regionId][variant]
}

export function formatRegionPrice(region: Region, variant: VariantId): string | null {
  const amount = getRegionalPriceAmount(region.id, variant)
  if (amount === null) return null

  return new Intl.NumberFormat(region.locale, {
    style: 'currency',
    currency: region.currency,
    currencyDisplay: 'code',
    minimumFractionDigits: 0,
    maximumFractionDigits: region.currency === 'IDR' ? 0 : 2,
  }).format(amount)
}

export function getRegionalPriceLabel(region: Region, variant: VariantId): string {
  const price = formatRegionPrice(region, variant)
  if (price !== null) return price
  if (region.language === 'ms') return `Tanya harga ${region.currency}`
  if (region.language === 'id') return `Tanya harga ${region.currency}`
  return `Request ${region.currency} pricing`
}
