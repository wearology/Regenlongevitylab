"use client"

import { FlaskConical, Headset, Truck } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ConsultationButton } from "@/components/consultation-button"
import { useRegion } from "@/components/region-provider"
import { homeCopy, regionHeroCopy } from "@/lib/home-copy"

const trustIcons = [FlaskConical, Headset, Truck]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
  const { region, language } = useRegion()
  const copy = homeCopy[language]
  const introduction = regionHeroCopy[region.id]

  return (
    <section
      id="beranda"
      className="relative overflow-hidden text-foreground"
      style={{
        // Soft light composition using Regen Mist behind the copy on the
        // left melting into pure white behind the video on the right, plus a
        // vertical fade to white at the bottom so the hero flows seamlessly
        // into the white product catalogue below with no visible edge.
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0) 60%, #ffffff 100%), radial-gradient(120% 90% at 88% 20%, rgba(0,63,53,0.06) 0%, rgba(0,63,53,0) 55%), linear-gradient(100deg, #e8f0ed 0%, #eff5f3 38%, #f8fbfa 62%, #ffffff 82%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:pb-24">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-6 lg:gap-10">
          {/* Left: hero copy */}
          <motion.div
            className="relative z-10"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                Regen / {region.nativeName}
              </p>
              <span
                className="rounded-full border border-primary/15 bg-white/60 px-2.5 py-1 text-[11px] font-medium text-primary/75"
                title={`${copy.hero.settings}: ${region.currency}, ${region.languageName}`}
              >
                {region.currency} · {region.languageName}
              </span>
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-5 max-w-xl text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl"
            >
              {introduction.headline} <span className="text-accent">{introduction.accent}</span>
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {copy.hero.body}
            </motion.p>
            <motion.p variants={item} className="mt-4 max-w-xl text-sm font-medium text-muted-foreground">
              {copy.hero.trusted}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                render={<a href="#katalog" />}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {copy.viewCatalog}
              </Button>
              <ConsultationButton
                size="lg"
                variant="outline"
                className="border-primary/25 bg-transparent text-primary hover:bg-primary/5 hover:text-primary"
              >
                {copy.freeConsultation}
              </ConsultationButton>
            </motion.div>
          </motion.div>

          {/* Right: looping product video. Its white background is designed to
              melt into the white side of the hero gradient, so the products
              appear to float on the page rather than sit in a boxed player. */}
          <motion.div
            className="relative flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <video
              className="h-auto max-h-[360px] w-auto object-contain mix-blend-multiply sm:max-h-[440px] lg:max-h-[560px]"
              autoPlay
              muted
              loop
              playsInline
              poster="/hero-pen-poster.jpg"
              aria-hidden="true"
            >
              <source src="/hero-pen.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>

        {/* Trust badges span the full width beneath the hero */}
        <motion.ul
          className="mt-12 grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        >
          {copy.hero.trust.map((label, index) => {
            const Icon = trustIcons[index]
            return (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm"
              >
                <Icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <span className="text-sm text-foreground/80">{label}</span>
              </li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
