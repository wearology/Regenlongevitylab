'use client'

import { Reveal } from '@/components/reveal'
import { BeforeAfterSlider } from '@/components/before-after-slider'
import { useRegion } from '@/components/region-provider'
import { homeCopy } from '@/lib/home-copy'

export function Testimonial() {
  const { language } = useRegion()
  const copy = homeCopy[language].testimonial

  return (
    <section className="bg-background pb-8 pt-16 md:pb-12 md:pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {copy.disclaimer}
          </p>
        </Reveal>

        <Reveal>
          <article className="mt-12 grid gap-8 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            <BeforeAfterSlider />
            <div>
              <h3 className="text-balance font-display text-2xl font-bold text-foreground">
                {copy.quote}
              </h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {copy.body}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground">
                  MB
                </span>
                <div>
                  <p className="font-semibold text-foreground">Michael B.</p>
                  <p className="text-sm text-muted-foreground">
                    {copy.detail}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
