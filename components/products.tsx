import { ProductCard } from '@/components/product-card'
import { ConsultationButton } from '@/components/consultation-button'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'
import { products } from '@/lib/products'

export function Products() {
  return (
    <section id="katalog" className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            One of the most complete research peptide catalogs
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Talk to our team about your goals and we&apos;ll help you find the
            options best suited to your research.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.slug} className="h-full">
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 text-center">
          <ConsultationButton
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Talk to Our Team
          </ConsultationButton>
        </div>

        <p className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-muted/50 p-4 text-center text-xs text-muted-foreground">
          All products are intended{' '}
          <span className="font-semibold text-foreground">
            for laboratory research only
          </span>
          .
        </p>
      </div>
    </section>
  )
}
