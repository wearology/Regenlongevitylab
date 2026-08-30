'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ShieldAlert,
  ChevronDown,
  X,
  Mail,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Official Regen consultation contact.
// Temporary: consultations run over email instead of WhatsApp.
const CONTACT_EMAIL = 'contact@regenlongevitylab.com'

// Country dial codes offered in the phone field. Indonesia is the default.
const COUNTRIES = [
  { code: 'ID', dial: '+62', flag: '🇮🇩' },
  { code: 'SG', dial: '+65', flag: '🇸🇬' },
  { code: 'MY', dial: '+60', flag: '🇲🇾' },
  { code: 'AU', dial: '+61', flag: '🇦🇺' },
  { code: 'US', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', flag: '🇬🇧' },
  { code: 'AE', dial: '+971', flag: '🇦🇪' },
  { code: 'HK', dial: '+852', flag: '🇭🇰' },
]

type ConsultationContextValue = {
  /** Optionally pass a product name to personalize the email message. */
  open: (productName?: string) => void
  close: () => void
}

const ConsultationContext = createContext<ConsultationContextValue | null>(null)

export function useConsultation() {
  const ctx = useContext(ConsultationContext)
  if (!ctx) {
    throw new Error('useConsultation must be used within a ConsultationProvider')
  }
  return ctx
}

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [productName, setProductName] = useState<string | null>(null)

  const open = useCallback((name?: string) => {
    setProductName(name ?? null)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      <ConsultationModal
        isOpen={isOpen}
        onClose={close}
        productName={productName}
      />
    </ConsultationContext.Provider>
  )
}

function ConsultationModal({
  isOpen,
  onClose,
  productName,
}: {
  isOpen: boolean
  onClose: () => void
  productName: string | null
}) {
  const [countryDial, setCountryDial] = useState('+62')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [agreed, setAgreed] = useState(false)
  // Two-step flow: fill the form, then choose how to send the email. A
  // programmatic mailto: navigation silently fails on desktops with no mail
  // handler, so we present explicit send options instead.
  const [step, setStep] = useState<'form' | 'send'>('form')
  const [copied, setCopied] = useState<'address' | 'message' | null>(null)

  // Reset to the form step each time the modal opens.
  useEffect(() => {
    if (isOpen) setStep('form')
  }, [isOpen])

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  const digits = phoneNumber.replace(/\D/g, '')
  // The official contact is only revealed once a valid number is entered and
  // the terms are agreed to — this also gates the Continue action.
  const canContinue = digits.length >= 6 && agreed

  // Build the pre-filled consultation email once, shared by every send option.
  const { body, mailtoUrl, gmailUrl } = useMemo(() => {
    const fullPhone = `${countryDial} ${phoneNumber}`.trim()
    // Personalize the message when the consultation was started from a
    // specific product page; otherwise use the general consultation intro.
    const body = productName
      ? `Hi Regen, I'm interested in ${productName}. I'd like more information about this product. My contact number is ${fullPhone}.`
      : `Hi Regen, I'd like to start a consultation. My contact number is ${fullPhone}.`
    const subject = productName
      ? `Consultation request — ${productName}`
      : 'Consultation request'
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    // Gmail web compose — the reliable path for desktop webmail users.
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      CONTACT_EMAIL,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    return { body, mailtoUrl, gmailUrl }
  }, [countryDial, phoneNumber, productName])

  function handleContinue() {
    if (!canContinue) return
    // Advance to the send step; the user picks their email method there.
    setStep('send')
  }

  async function copy(kind: 'address' | 'message', text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard API unavailable — silently ignore; links still work.
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="consultation-title"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close consultation"
            onClick={onClose}
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="bg-primary px-6 py-5 text-primary-foreground">
              <h2
                id="consultation-title"
                className="font-display text-xl font-bold tracking-tight"
              >
                {step === 'form'
                  ? 'Consultation Verification'
                  : 'Send your request'}
              </h2>
              <p className="mt-1 text-sm text-primary-foreground/80">
                {step === 'form'
                  ? 'Please read before starting your consultation.'
                  : 'Choose how you’d like to email Regen.'}
              </p>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {step === 'form' ? (
                <>
              <div className="flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-3.5">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-accent" />
                <div className="text-sm leading-relaxed text-foreground">
                  <p className="font-semibold">Please be aware of scams!</p>
                  <p className="mt-1 text-muted-foreground">
                    Our official email address is revealed below only after you
                    enter your number and agree to the terms. Only that address
                    is our official contact.
                  </p>
                </div>
              </div>

              <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                Regen prioritizes quality, scientific support, and customer
                care over competing on price. Every consultation includes
                guidance before purchase and ongoing after-sales support.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleContinue()
                }}
                className="mt-5 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="consultation-phone"
                    className="text-sm font-medium text-foreground"
                  >
                    Phone number for your consultation
                  </label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0">
                      <select
                        aria-label="Country code"
                        value={countryDial}
                        onChange={(e) => setCountryDial(e.target.value)}
                        className="h-12 appearance-none rounded-xl border border-input bg-background pl-3 pr-8 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.dial}>
                            {c.flag} {c.dial}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>
                    <input
                      id="consultation-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="812 3456 7890"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-5 shrink-0 rounded border-input text-accent accent-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <span>
                    I confirm that I am at least 18 years old and agree to the{' '}
                    <span className="font-medium text-foreground">
                      Terms &amp; Conditions
                    </span>{' '}
                    and{' '}
                    <span className="font-medium text-foreground">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>

                <AnimatePresence initial={false}>
                  {canContinue && (
                    <motion.div
                      key="official-contact"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          Our official email contact
                        </p>
                        <p className="mt-0.5 font-display text-base font-bold text-foreground">
                          {CONTACT_EMAIL}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!canContinue}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </Button>
              </form>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-border bg-muted/50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      To
                    </p>
                    <p className="font-display text-base font-bold text-foreground">
                      {CONTACT_EMAIL}
                    </p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Message
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                      {body}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Reliable for desktop browser webmail users. */}
                    <a
                      href={gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                    >
                      <Mail className="size-4" />
                      Compose in Gmail
                    </a>
                    {/* Opens the default mail app — works on phones and desktop
                        clients like Outlook or Apple Mail. */}
                    <a
                      href={mailtoUrl}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Open my email app
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copy('address', CONTACT_EMAIL)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {copied === 'address' ? (
                        <Check className="size-3.5 text-accent" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      {copied === 'address' ? 'Copied' : 'Copy address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => copy('message', body)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {copied === 'message' ? (
                        <Check className="size-3.5 text-accent" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      {copied === 'message' ? 'Copied' : 'Copy message'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
