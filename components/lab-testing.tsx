import { ConsultationButton } from '@/components/consultation-button'

export function LabTesting() {
  return (
    <section id="kualitas" className="bg-background pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Laboratory Testing
          </span>
          <h2 className="heading-gradient mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Tested in European laboratories
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Every batch we ship is tested by independent European laboratories
            against European quality standards, referencing the European
            Pharmacopoeia (Ph. Eur.) where applicable. A Certificate of Analysis
            is available for every order.
          </p>
          <ConsultationButton
            size="lg"
            className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Start Free Consultation
          </ConsultationButton>
        </div>
      </div>
    </section>
  )
}
