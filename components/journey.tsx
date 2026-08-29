import { Target, Compass, ShieldCheck } from 'lucide-react'
import { ConsultationButton } from '@/components/consultation-button'
import { Reveal, Stagger, StaggerItem } from '@/components/reveal'

const steps = [
  {
    icon: Target,
    title: 'Define your goal',
    body: 'Everyone has a different target — regeneration & lifespan, fat loss, recovery, performance, or cognitive support. We help clarify your goal before recommending the next step.',
  },
  {
    icon: Compass,
    title: 'Get a tailored recommendation',
    body: 'Based on your goal and situation, our team explains the product options, protocols, and the approach that is most relevant. No consultation fee and no obligation to buy.',
  },
  {
    icon: ShieldCheck,
    title: 'Start with confidence',
    body: 'Once you choose the right protocol, you receive usage guidance, product documentation, and full support from our team throughout the process.',
  },
]

export function Journey() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your regeneration &amp; lifespan journey starts here
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            From the first consultation to usage guidance, we help simplify every
            step so you can focus on your goal.
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

          {steps.map((step, i) => (
            <StaggerItem
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative flex size-14 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <step.icon className="size-6 text-accent" aria-hidden="true" />
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
          ))}
        </Stagger>

        <div className="mt-14 text-center">
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
