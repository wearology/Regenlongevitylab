'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRegion } from '@/components/region-provider'
import { regionalSupportText, SUPPORT_COPY } from '@/lib/support-copy'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const { language, region } = useRegion()
  const copy = SUPPORT_COPY[language].faq

  return (
    <section id="faq" className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            {copy.eyebrow}
          </span>
          <h2 className="heading-gradient mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.title}
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {copy.items.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={faq.q}
                id={i === copy.items.length - 1 ? 'pengiriman' : undefined}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-accent transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {regionalSupportText(faq.a, region)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-muted/50 p-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
            {copy.disclaimerTitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {copy.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}
