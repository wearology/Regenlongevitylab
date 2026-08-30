import Image from 'next/image'
import { ConsultationButton } from '@/components/consultation-button'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'

const formats = [
  {
    name: 'Cartridge Version',
    image: '/products/cartridge-package.jpeg',
    body: 'Suitable for customers who have already bought the Pen Package and want to continue their peptide therapy.',
  },
  {
    name: 'Pen Version',
    image: '/products/pen-package.jpeg',
    body: 'Pre-measured and ready to use with no extra steps. Ideal for those who value convenience, consistency, and ease of everyday use.',
  },
]

export function Formats() {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            One quality standard. Two ways to use it.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            The same quality, a different way to use it. Choose the format that
            best fits your routine and needs.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
          {formats.map((format) => (
            <StaggerItem
              key={format.name}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="relative aspect-square bg-card">
                <Image
                  src={format.image || '/placeholder.svg'}
                  alt={`Regen ${format.name} package contents`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {format.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {format.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 text-center">
          <ConsultationButton
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Start Free Consultation
          </ConsultationButton>
        </div>
      </div>
    </section>
  )
}
