'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const faqs = [
  {
    q: 'What are peptides and how do they work?',
    a: 'Peptides are short chains of amino acids that act as biological signals. In the context of research compounds, peptides are studied to understand how the body responds to processes such as recovery, metabolism, performance, and healthy aging.',
  },
  {
    q: 'What makes Regen different from other peptide suppliers?',
    a: 'Regen focuses on precision, batch quality, and support. Every product is prepared with COA documentation, cold-chain handling, and clear usage instructions before purchase.',
  },
  {
    q: 'Is Regen peptide safe?',
    a: 'We prioritize products that are documented and tested. However, safety of use still depends on individual conditions, objectives, and chosen protocols. Consult with a healthcare professional before starting.',
  },
  {
    q: 'Are Regen peptides compliant with applicable regulations?',
    a: "Regulatory classifications vary depending on the product and jurisdiction. Always review the product information, Certificate of Analysis (COA), and applicable disclaimers before purchasing. If you require information about a specific product's regulatory status, please contact our team.",
  },
  {
    q: 'Which product should I start with?',
    a: 'Start with your primary goal: weight management, recovery, sleep, body composition, performance, or cognitive support. Our team can help recommend the most suitable options based on your needs and experience.',
  },
  {
    q: 'How long before I notice results?',
    a: 'Individual responses vary. Some users may notice changes within the first few weeks, while other protocols require longer evaluation. Consistency and proper documentation of your progress are recommended.',
  },
  {
    q: 'How do I read a Certificate of Analysis (COA)?',
    a: "A COA typically includes the compound name, batch number, purity, testing method, testing date, and laboratory results. Match your product's batch number with the COA to verify the documentation for the exact batch you received.",
  },
  {
    q: 'Can peptides be combined?',
    a: 'Some peptides are commonly studied in combination protocols, but not every combination is appropriate for every individual. Choose combinations based on your objectives, experience, and professional guidance.',
  },
  {
    q: 'What is the difference between the Pen Version and Pre-filled Cartridge Version?',
    a: "The Pen Version is designed for greater convenience and measured administration. The pre-filled cartridge version is intended for customers who already own Regen's Pen device and wish to continue using it.",
  },
  {
    q: 'Who are Regen peptides suitable for?',
    a: 'Regen products are intended for adult users seeking a more targeted approach to regeneration, lifespan, recovery, performance, or wellness research. They are not intended for children, pregnant or breastfeeding women, or use without professional consideration.',
  },
  {
    q: "What is Regen's return policy?",
    a: 'Due to the nature of these products (pharmaceutical-grade, cold-chain handled, and single-use), we cannot accept returns for products received in good condition. If a product arrives damaged, is incorrectly shipped, or has a documented quality issue, we will review the case individually. Please contact our team within 24 hours of receiving your order.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            FAQ
          </span>
          <h2 className="heading-gradient mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
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
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
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
            Disclaimer
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This content is provided for educational and informational purposes
            regarding peptide research compounds. It is not intended to diagnose,
            treat, cure, or prevent any disease, nor should it be considered a
            substitute for professional medical advice. Always consult a
            qualified healthcare professional before beginning any new protocol.
          </p>
        </div>
      </div>
    </section>
  )
}
