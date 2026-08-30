'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
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
import { useRegion } from '@/components/region-provider'
import { buildConsultationEmail, CONTACT_EMAIL, SUPPORT_COPY } from '@/lib/support-copy'

// The selected market supplies the initial code, not the visitor's nationality.
// Include every EU member state: the EU itself has no shared calling code.
const COUNTRIES = [
  { code: 'ID', dial: '+62', flag: '🇮🇩' },
  { code: 'SG', dial: '+65', flag: '🇸🇬' },
  { code: 'MY', dial: '+60', flag: '🇲🇾' },
  { code: 'AU', dial: '+61', flag: '🇦🇺' },
  { code: 'US', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', flag: '🇬🇧' },
  { code: 'DE', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', dial: '+33', flag: '🇫🇷' },
  { code: 'IT', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', dial: '+34', flag: '🇪🇸' },
  { code: 'NL', dial: '+31', flag: '🇳🇱' },
  { code: 'BE', dial: '+32', flag: '🇧🇪' },
  { code: 'IE', dial: '+353', flag: '🇮🇪' },
  { code: 'PT', dial: '+351', flag: '🇵🇹' },
  { code: 'AT', dial: '+43', flag: '🇦🇹' },
  { code: 'DK', dial: '+45', flag: '🇩🇰' },
  { code: 'SE', dial: '+46', flag: '🇸🇪' },
  { code: 'FI', dial: '+358', flag: '🇫🇮' },
  { code: 'PL', dial: '+48', flag: '🇵🇱' },
  { code: 'CZ', dial: '+420', flag: '🇨🇿' },
  { code: 'GR', dial: '+30', flag: '🇬🇷' },
  { code: 'HU', dial: '+36', flag: '🇭🇺' },
  { code: 'RO', dial: '+40', flag: '🇷🇴' },
  { code: 'BG', dial: '+359', flag: '🇧🇬' },
  { code: 'HR', dial: '+385', flag: '🇭🇷' },
  { code: 'CY', dial: '+357', flag: '🇨🇾' },
  { code: 'EE', dial: '+372', flag: '🇪🇪' },
  { code: 'LV', dial: '+371', flag: '🇱🇻' },
  { code: 'LT', dial: '+370', flag: '🇱🇹' },
  { code: 'LU', dial: '+352', flag: '🇱🇺' },
  { code: 'MT', dial: '+356', flag: '🇲🇹' },
  { code: 'SK', dial: '+421', flag: '🇸🇰' },
  { code: 'SI', dial: '+386', flag: '🇸🇮' },
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
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [productName, setProductName] = useState<string | null>(null)

  const open = useCallback((name?: string) => {
    setProductName(name ?? null)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])

  // A shared root provider survives client navigation. Never carry an open
  // request (or the previous product) into a different market/product page.
  useEffect(() => {
    setIsOpen(false)
    setProductName(null)
  }, [pathname])

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
  const { region, language } = useRegion()
  const copy = SUPPORT_COPY[language].modal
  const [countryDial, setCountryDial] = useState(region.dialCode)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [agreed, setAgreed] = useState(false)
  // Two-step flow: fill the form, then choose how to send the email. A
  // programmatic mailto: navigation silently fails on desktops with no mail
  // handler, so we present explicit send options instead.
  const [step, setStep] = useState<'form' | 'send'>('form')
  const [copied, setCopied] = useState<'address' | 'message' | null>(null)
  const [copyFailed, setCopyFailed] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const countryNames = useMemo(() => new Intl.DisplayNames([region.locale], { type: 'region' }), [region.locale])

  useEffect(() => {
    setCountryDial(region.dialCode)
    setPhoneNumber('')
    setAgreed(false)
    setStep('form')
    setCopied(null)
    setCopyFailed(false)
  }, [region.id, region.dialCode])

  // Reset to the form step each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setStep('form')
      setCopied(null)
      setCopyFailed(false)
    }
  }, [isOpen])

  // Keep keyboard focus in the dialog and restore it to the opener on close.
  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) {
        e.preventDefault()
        panel.focus()
      } else if (!panel.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previousFocus?.focus()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const frame = requestAnimationFrame(() => {
      if (step === 'send') titleRef.current?.focus()
      else closeButtonRef.current?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [isOpen, step])

  const digits = phoneNumber.replace(/\D/g, '')
  const fullDigits = countryDial.replace(/\D/g, '') + digits
  const canContinue = digits.length >= 6 && fullDigits.length <= 15 && agreed

  const { subject, body, mailtoUrl, gmailUrl } = useMemo(() => buildConsultationEmail({
    language,
    region,
    productName,
    countryDial,
    phoneNumber,
  }), [language, region, countryDial, phoneNumber, productName])

  function handleContinue() {
    if (!canContinue) return
    // Advance to the send step; the user picks their email method there.
    setStep('send')
  }

  async function copyText(kind: 'address' | 'message', text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setCopyFailed(false)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopyFailed(true)
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
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-title"
            aria-describedby="consultation-description"
            tabIndex={-1}
            className="relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label={copy.close}
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="bg-primary px-6 py-5 text-primary-foreground">
              <h2
                ref={titleRef}
                id="consultation-title"
                tabIndex={-1}
                className="pr-6 font-display text-xl font-bold tracking-tight outline-none"
              >
                {step === 'form'
                  ? copy.title
                  : copy.sendTitle}
              </h2>
              <p id="consultation-description" className="mt-1 pr-4 text-sm text-primary-foreground/80">
                {step === 'form'
                  ? copy.description
                  : copy.sendDescription}
              </p>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {step === 'form' ? (
                <>
              <div className="flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-3.5">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-accent" />
                <div className="text-sm leading-relaxed text-foreground">
                  <p className="font-semibold">{copy.scamTitle}</p>
                  <p className="mt-1 text-muted-foreground">
                    {copy.scamDescription}
                  </p>
                </div>
              </div>

              <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                {copy.introduction}
              </p>

              <p className="mt-3 text-sm font-medium text-foreground">
                <span className="text-muted-foreground">{copy.regionLabel}: </span>
                {region.name} · {region.currency}
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
                    {copy.phone}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0">
                      <select
                        aria-label={copy.countryCode}
                        autoComplete="tel-country-code"
                        value={countryDial}
                        onChange={(e) => setCountryDial(e.target.value)}
                        className="h-12 w-28 appearance-none rounded-xl border border-input bg-background pl-3 pr-8 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.dial}>
                            {c.flag} {c.dial} · {countryNames.of(c.code)}
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
                      maxLength={25}
                      aria-describedby="consultation-phone-help"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder={copy.phonePlaceholder}
                    />
                  </div>
                  <p id="consultation-phone-help" className="text-xs leading-relaxed text-muted-foreground">
                    {region.id === 'eu' ? `${copy.euDialHint} ` : ''}{copy.phoneHint}
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <input
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-5 shrink-0 rounded border-input text-accent accent-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <span>{copy.agreement}</span>
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
                          {copy.contact}
                        </p>
                        <p className="mt-0.5 break-all font-display text-base font-bold text-foreground">
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
                  {copy.continue}
                </Button>
              </form>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-border bg-muted/50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {copy.to}
                    </p>
                    <p className="break-all font-display text-base font-bold text-foreground">
                      {CONTACT_EMAIL}
                    </p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {copy.subject}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">{subject}</p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {copy.message}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">
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
                      {copy.gmail}
                    </a>
                    {/* Opens the default mail app — works on phones and desktop
                        clients like Outlook or Apple Mail. */}
                    <a
                      href={mailtoUrl}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {copy.emailApp}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyText('address', CONTACT_EMAIL)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {copied === 'address' ? (
                        <Check className="size-3.5 text-accent" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      {copied === 'address' ? copy.copied : copy.copyAddress}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyText('message', body)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {copied === 'message' ? (
                        <Check className="size-3.5 text-accent" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      {copied === 'message' ? copy.copied : copy.copyMessage}
                    </button>
                  </div>

                  <p role="status" className="text-center text-xs leading-relaxed text-muted-foreground">
                    {copyFailed ? copy.copyFailed : copied ? copy.copied : copy.draftNotice}
                  </p>

                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    {copy.back}
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
