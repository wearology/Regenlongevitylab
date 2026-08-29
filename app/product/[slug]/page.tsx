import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductDetail } from '@/components/product-detail'
import { Formats } from '@/components/formats'
import { LabTesting } from '@/components/lab-testing'
import { Reviews } from '@/components/reviews'
import { RecommendedProducts } from '@/components/recommended-products'
import { Faq } from '@/components/faq'
import { getProduct, products } from '@/lib/products'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: 'Product not found — Lorenic' }
  return {
    title: `${product.name} — Lorenic`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader forceSolid />
      <main className="flex-1">
        <ProductDetail product={product} />
        <Formats />
        <LabTesting />
        <Reviews />
        <RecommendedProducts currentSlug={product.slug} />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  )
}
