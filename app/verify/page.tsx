import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ScanLine } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Product Authenticity — Lorenic',
  robots: { index: false, follow: false },
}

async function submitCode(formData: FormData) {
  'use server'
  const code = String(formData.get('code') ?? '').trim()
  if (code) {
    redirect(`/verify/${encodeURIComponent(code)}`)
  }
}

export default function VerifyLandingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
            <ScanLine className="size-7 text-primary" aria-hidden="true" />
          </span>
          <h1 className="text-balance font-display text-2xl font-bold text-foreground">
            Check product authenticity
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Scan the QR code on the authenticity card inside your package. If the
            scan will not work, enter the code printed beside it below.
          </p>
        </div>

        <form action={submitCode} className="mt-6 flex flex-col gap-3">
          <label htmlFor="code" className="sr-only">
            Verification code
          </label>
          <input
            id="code"
            name="code"
            required
            autoComplete="off"
            placeholder="e.g. LRN-RETA-0001"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base text-foreground outline-none ring-ring placeholder:text-muted-foreground focus:ring-2"
          />
          <Button
            type="submit"
            className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Verify Now
          </Button>
        </form>
      </div>

      <footer className="mt-8 flex flex-col items-center gap-1 text-center">
        <Logo variant="light" />
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/60">
          Regenerative Peptide Labs &amp; Research
        </p>
      </footer>
    </main>
  )
}
