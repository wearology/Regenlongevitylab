'use client'

import { ConsultationButton } from '@/components/consultation-button'
import { useRegion } from '@/components/region-provider'
import { homeCopy } from '@/lib/home-copy'

export function LabTesting() {
  const { language } = useRegion()
  const copy = homeCopy[language]

  return (
    <section id="kualitas" className="bg-background pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            {copy.lab.label}
          </span>
          <h2 className="heading-gradient mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.lab.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {copy.lab.body}
          </p>
          <ConsultationButton
            size="lg"
            className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {copy.startConsultation}
          </ConsultationButton>
        </div>
      </div>
    </section>
  )
}
