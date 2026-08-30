"use client"

import { FlaskConical, Headset, Truck } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ConsultationButton } from "@/components/consultation-button"

const trust = [
  { icon: FlaskConical, label: "Lab-tested before every shipment." },
  { icon: Headset, label: "24/7 customer support." },
  { icon: Truck, label: "Secure, temperature-controlled delivery." },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
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
            <motion.p variants={item} className="max-w-xl text-sm font-medium text-muted-foreground">
              Trusted and used by influencers, physicians, and wellness practitioners.
            </motion.p>
            <motion.h1
              variants={item}
              className="mt-5 max-w-xl text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl"
            >
              European research-grade peptides, <span className="text-accent">delivered with precision.</span>
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Research peptides for fat loss, muscle gain, regeneration &amp; lifespan, recovery, and cognitive focus —
              all on one platform.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                render={<a href="#katalog" />}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                View Catalog
              </Button>
              <ConsultationButton
                size="lg"
                variant="outline"
                className="border-primary/25 bg-transparent text-primary hover:bg-primary/5 hover:text-primary"
              >
                Free Consultation
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
          {trust.map((t) => (
            <li
              key={t.label}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm"
            >
              <t.icon className="size-5 shrink-0 text-accent" />
              <span className="text-sm text-foreground/80">{t.label}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
