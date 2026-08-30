import { Check, ShieldAlert } from 'lucide-react'
import { LabDocumentsDisclosure } from '@/components/lab-documents-disclosure'
import { Logo } from '@/components/logo'
import { VerifiedTick } from '@/components/verified-tick'
import { Button } from '@/components/ui/button'
import { TEST_POINTS, type ProductRecord } from '@/lib/verify-codes'

const SUPPORT_WHATSAPP = 'https://wa.me/6282298889781'

function Shell({
  children,
  wide = false,
}: {
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-primary px-4 py-10">
      <div className={wide ? 'w-full max-w-2xl' : 'w-full max-w-md'}>
        {children}
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

export function VerifiedResult({ record }: { record: ProductRecord }) {
  const details: Array<{ label: string; value: string }> = [
    { label: 'Batch', value: record.batch },
    { label: 'Manufactured', value: record.manufactured },
    { label: 'Expiry', value: record.expiry },
    { label: 'Tested', value: record.tested },
    { label: 'Laboratory', value: record.lab },
  ]

  return (
    <Shell wide>
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        {/* Confirmation */}
        <div className="flex flex-col items-center px-6 pb-8 pt-10 text-center sm:px-10">
          <VerifiedTick />

          <h1 className="mt-6 text-balance font-display text-2xl font-bold text-foreground sm:text-3xl">
            Authentic product verified.
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            Your product identifies as
          </p>
          <p className="mt-1.5 text-balance font-display text-xl font-bold text-primary sm:text-2xl">
            {record.product}
          </p>

          {/* Headline results from the batch reports */}
          <dl className="mt-6 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3">
            {record.results.map((r) => (
              <div
                key={r.label}
                className="flex flex-col gap-0.5 rounded-xl bg-secondary px-4 py-3"
              >
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {r.label}
                </dt>
                <dd className="font-display text-base font-bold text-foreground">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Analysis panel */}
        <div className="border-t border-border px-6 py-8 sm:px-10">
          <h2 className="font-display text-base font-semibold text-foreground">
            This batch has been tested for:
          </h2>

          <ul className="mt-4 flex flex-col gap-4">
            {TEST_POINTS.map((point) => (
              <li key={point.title} className="flex gap-3">
                <span
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success"
                  aria-hidden="true"
                >
                  <Check
                    className="size-3.5 text-success-foreground"
                    strokeWidth={3}
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {point.title}
                  </p>
                  <p className="mt-0.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* The lab reports are the point of this page, so show them up front. */}
          <LabDocumentsDisclosure documents={record.documents} defaultOpen />
        </div>

        {/* Batch provenance */}
        <div className="border-t border-border bg-secondary/40 px-6 py-6 sm:px-10">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {details.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4"
              >
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-right text-sm font-semibold text-foreground">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Shell>
  )
}

export function NotVerifiedResult({ code }: { code?: string }) {
  return (
    <Shell>
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        <div className="flex flex-col items-center gap-3 bg-destructive px-6 py-8 text-center text-white">
          <span className="flex size-16 items-center justify-center rounded-full bg-white/15">
            <ShieldAlert className="size-9" aria-hidden="true" />
          </span>
          <h1 className="text-balance font-display text-2xl font-bold">
            This code could not be verified.
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-white/90">
            We could not match this code to an authentic Regen product.
          </p>
        </div>
        <div className="px-6 py-6">
          {code && (
            <p className="mb-4 rounded-xl bg-secondary px-4 py-3 text-center text-sm text-secondary-foreground">
              Scanned code:{' '}
              <span className="font-semibold text-foreground">{code}</span>
            </p>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground">
            This code is not in our records. Your product may be counterfeit, or
            the authenticity card may be damaged. Please do not use the product
            and contact our team right away so we can help.
          </p>
          <Button
            render={<a href={SUPPORT_WHATSAPP} target="_blank" rel="noreferrer" />}
            className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Contact the Regen Team
          </Button>
        </div>
      </div>
    </Shell>
  )
}
