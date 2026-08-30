'use client'

import { Check, MessageCircle, ShieldCheck } from 'lucide-react'
import { ConsultationButton } from '@/components/consultation-button'
import { Reveal } from '@/components/reveal'
import { useRegion } from '@/components/region-provider'
import { SUPPORT_COPY } from '@/lib/support-copy'

export function Consultation() {
  const { language } = useRegion()
  const copy = SUPPORT_COPY[language].consultation

  return (
    <section
      id="konsultasi"
      className="bg-primary py-16 text-primary-foreground md:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            {copy.eyebrow}
          </span>
          <h2 className="heading-gradient-light mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
            {copy.description}
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm text-primary-foreground/90">
            {copy.points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <Check className="size-5 shrink-0 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur-sm sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <ShieldCheck className="size-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold">
              {copy.cardTitle}
            </h3>
            <p className="mt-3 leading-relaxed text-primary-foreground/80">
              {copy.cardDescription}
            </p>
            <ConsultationButton
              size="lg"
              className="mt-6 w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <MessageCircle className="size-4" />
              {copy.start}
            </ConsultationButton>
            <p className="mt-4 text-center text-xs text-primary-foreground/60">
              {copy.privacy}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
