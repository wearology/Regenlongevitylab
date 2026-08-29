import { ProductCard } from '@/components/product-card'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'
import { getRelatedProducts } from '@/lib/products'

export function RecommendedProducts({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedProducts(currentSlug, 4)

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Recommended products.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Other research peptides from the Lorenic catalog you may want to
            explore.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {related.map((product) => (
            <StaggerItem key={product.slug}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
