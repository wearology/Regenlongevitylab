'use client'

import { Star } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'
import { useRegion } from '@/components/region-provider'
import { homeCopy } from '@/lib/home-copy'

export function Reviews() {
  const { language, region } = useRegion()
  const copy = homeCopy[language].reviews
  const isSample = copy.isSample === true

  return (
    <section
      id="ulasan"
      aria-labelledby="reviews-heading"
      aria-describedby={isSample ? 'reviews-notice' : undefined}
      className="bg-secondary py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="reviews-heading" className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.heading}
          </h2>
          {isSample ? (
            <p id="reviews-notice" role="note" className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {copy.sampleNotice}
            </p>
          ) : (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-accent text-accent" />
                ))}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                <strong className="text-foreground">
                  {new Intl.NumberFormat(region.locale, { maximumFractionDigits: 1 }).format(4.9)}
                </strong>{' '}
                {copy.rating}
              </span>
            </div>
          )}
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((review) => (
            <StaggerItem
              key={review.name + review.detail}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              {!isSample && (
                <span className="flex" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-accent text-accent" />
                  ))}
                </span>
              )}
              <p className={`flex-1 text-sm leading-relaxed text-foreground/90${isSample ? '' : ' mt-4'}`}>
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
