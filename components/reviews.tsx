import { Star } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'

const reviews = [
  {
    body: 'What sold me was the consultation. I came in with a list of questions and left actually understanding what I was ordering instead of just guessing.',
    initial: 'M',
    name: 'Marcus',
    detail: '43, Operations Manager',
  },
  {
    body: 'Box turned up cold, ice packs still solid, everything sealed. Honestly did not expect the packaging to be this careful.',
    initial: 'C',
    name: 'Chloe',
    detail: '29, Brand Strategist',
  },
  {
    body: 'Been through a few suppliers over the years and most go quiet the moment you pay. These guys actually kept checking in after the order landed.',
    initial: 'D',
    name: 'Daniel',
    detail: '47, Sales Director',
  },
  {
    body: 'Ngl I was skeptical at first, but the whole thing felt legit. Verification code checked out, and the guide book made it easy to follow.',
    initial: 'K',
    name: 'Kayla',
    detail: '26, Content Creator',
  },
  {
    body: 'As a practitioner I need to see documentation, not marketing. Lorenic sent the Certificate of Analysis without me even having to ask twice. That earns trust.',
    initial: 'H',
    name: 'Dr. Hannah',
    detail: '39, Physician',
  },
  {
    body: 'Pen setup is genuinely easy. The clicks are precise so I always know exactly where my dose is.',
    initial: 'R',
    name: 'Ryan',
    detail: '34, Personal Trainer',
  },
  {
    body: 'Support replied within minutes when my shipment got held up, kept me posted the whole way, and sorted it out. Little things like that matter.',
    initial: 'G',
    name: 'Grace',
    detail: '37, Project Manager',
  },
  {
    body: 'Been running my protocol for a couple months now and the consistency batch to batch is what keeps me here. No surprises.',
    initial: 'N',
    name: 'Nathan',
    detail: '41, Software Engineer',
  },
  {
    body: 'Clean, no fuss, delivered on time. The cold-chain packaging is next level tbh.',
    initial: 'E',
    name: 'Emma',
    detail: '24, Nutritionist',
  },
]

export function Reviews() {
  return (
    <section id="ulasan" className="bg-secondary py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            What they say about Lorenic
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-accent text-accent" />
              ))}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              <strong className="text-foreground">4.9</strong> from 107 verified
              reviews
            </span>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <StaggerItem
              key={review.name + review.detail}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-accent text-accent" />
                ))}
              </span>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                {review.body}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground">
                  {review.initial}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.detail}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
