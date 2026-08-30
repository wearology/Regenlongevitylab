import { Reveal } from '@/components/reveal'
import { BeforeAfterSlider } from '@/components/before-after-slider'

export function Testimonial() {
  return (
    <section className="bg-background pb-8 pt-16 md:pb-12 md:pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-gradient text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by athletes and wellness practitioners
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Fitness and regeneration &amp; lifespan practitioners make Regen&apos;s
            premium peptides part of their routine.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            *Experiences shown are individual and do not necessarily represent
            the same results for everyone.
          </p>
        </Reveal>

        <Reveal>
          <article className="mt-12 grid gap-8 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            <BeforeAfterSlider />
            <div>
              <h3 className="text-balance font-display text-2xl font-bold text-foreground">
                &ldquo;My progress is back, and it keeps me motivated.&rdquo;
              </h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                I&apos;ve been training for a long time, but only now am I seeing
                real change. Within a few weeks my physique looked denser,
                muscles more defined, and my energy during training felt far
                better.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground">
                  MB
                </span>
                <div>
                  <p className="font-semibold text-foreground">Michael B.</p>
                  <p className="text-sm text-muted-foreground">
                    Bodybuilding &amp; wellness practitioner
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
