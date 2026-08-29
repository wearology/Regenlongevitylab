import { Button } from '@/components/ui/button'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'

const principles = [
  {
    no: '01',
    title: 'Controlled Quality',
    body: 'No products of unclear origin. Every batch is produced in manufacturing facilities that meet European quality standards, with strict quality control.',
  },
  {
    no: '02',
    title: 'Free 24/7 Consultation',
    body: 'Our team helps you choose the right product and protocol before you buy. No cost, no pressure.',
  },
  {
    no: '03',
    title: 'Full Transparency',
    body: 'Product specifications are verifiable for every order. You know exactly what you are working with.',
  },
]

export function Principles() {
  return (
    <section className="bg-foreground py-16 text-background md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="heading-gradient-light max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Built for those serious about regeneration &amp; lifespan
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-10 md:grid-cols-3">
          {principles.map((item) => (
            <StaggerItem key={item.no}>
              <span className="font-display text-4xl font-bold text-accent">
                {item.no}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-background/70">
                {item.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12">
          <Button
            render={<a href="#katalog" />}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            View Catalog
          </Button>
        </div>
      </div>
    </section>
  )
}
