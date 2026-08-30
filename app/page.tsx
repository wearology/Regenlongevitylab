import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { RegionLanding } from '@/components/region-landing'
import { REGION_COOKIE, getRegion, regionPath } from '@/lib/regions'

export const metadata: Metadata = {
  title: 'Choose your region — Regen',
  description: 'Choose your Regen regional website, language and currency.',
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const region = getRegion((await cookies()).get(REGION_COOKIE)?.value)
  if (region) redirect(regionPath(region.id))
  return <RegionLanding />
}
