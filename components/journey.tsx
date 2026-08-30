'use client'

import { Target, Compass, ShieldCheck } from 'lucide-react'
import { ConsultationButton } from '@/components/consultation-button'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'
import { useRegion } from '@/components/region-provider'
import { homeCopy } from '@/lib/home-copy'

const stepIcons = [Target, Compass, ShieldCheck]

export function Journey() {
  const { language } = useRegion()
  const copy = homeCopy[language]

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.journey.heading}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {copy.journey.intro}
          </p>
        </Reveal>

        <Stagger className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Connecting line across steps (desktop only) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-7 hidden md:block"
          >
            <div className="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {copy.journey.steps.map((step, i) => {
            const Icon = stepIcons[i]
            return (
              <StaggerItem
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative flex size-14 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                  <Icon className="size-6 text-accent" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-accent font-display text-xs font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </StaggerItem>
            )
          })}
        </Stagger>

        <div className="mt-14 text-center">
          <ConsultationButton
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {copy.startConsultation}
          </ConsultationButton>
        </div>
      </div>
    </section>
  )
}
