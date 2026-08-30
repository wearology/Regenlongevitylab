import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getProduct } from '@/lib/products'
import { DEFAULT_REGION, REGION_COOKIE, getRegion, regionPath } from '@/lib/regions'

// Old shared URLs stay valid and respect the visitor's saved region.
export default async function LegacyProductPage({ params }: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!getProduct(slug)) notFound()
  const region = getRegion((await cookies()).get(REGION_COOKIE)?.value)
  redirect(regionPath(region?.id ?? DEFAULT_REGION, `/product/${slug}`))
}
