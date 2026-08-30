'use client'

import { ExternalLink, Info } from 'lucide-react'
import { useRegion } from '@/components/region-provider'
import type { Product } from '@/lib/products'
import {
  FDA_REFERENCE_BADGE_PREFIX,
  FDA_REFERENCE_COPY,
  getFdaMedicineReference,
} from '@/lib/fda-references'

export function FdaMedicineReference({
  product,
  detail = false,
}: {
  product: Product
  detail?: boolean
}) {
  const { language, region } = useRegion()
  const reference = getFdaMedicineReference(product)
  if (!reference) return null

  const copy = FDA_REFERENCE_COPY[language]
  const badge = (
    <p
      lang="en"
      data-fda-medicine-badge="true"
      className="flex min-w-0 max-w-full items-start gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1.5 text-xs font-medium leading-relaxed text-foreground"
    >
      <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="min-w-0 break-words">
        {FDA_REFERENCE_BADGE_PREFIX} {reference.medicineName}
      </span>
    </p>
  )
  const disclaimer = (
    <p
      data-fda-disclaimer="true"
      className={`mt-1.5 break-words leading-relaxed text-foreground ${detail ? 'text-sm font-semibold' : 'text-xs font-medium'}`}
    >
      {copy.disclaimer}
    </p>
  )

  // ProductCard is itself a link: the compact reference must remain entirely
  // non-interactive, with the qualification visible beside the medicine name.
  if (!detail) {
    return (
      <div
        role="note"
        aria-label={copy.heading}
        data-fda-medicine-reference="compact"
        data-reference-scope={reference.scope}
        className="mt-3 min-w-0 max-w-full"
      >
        {badge}
        {disclaimer}
      </div>
    )
  }

  const checkedDate = new Intl.DateTimeFormat(region.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${reference.checkedOn}T00:00:00Z`))

  return (
    <aside
      id="fda-medicine-reference"
      aria-labelledby="fda-medicine-reference-heading"
      data-fda-medicine-reference="detail"
      data-reference-scope={reference.scope}
      className="mt-5 min-w-0 rounded-xl border border-border bg-muted/30 p-4"
    >
      <h2 id="fda-medicine-reference-heading" className="text-sm font-semibold text-foreground">
        {copy.heading}
      </h2>
      <div className="mt-3 min-w-0">
        {badge}
        {disclaimer}
      </div>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
        <p>{copy.indication}</p>
        <p className="font-medium text-foreground">{copy.limitation}</p>
        <p>{copy.distinction}</p>
      </div>
      <div className="mt-4 flex min-w-0 flex-col items-start gap-2">
        <a
          href={reference.recordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full items-start gap-1.5 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          <span className="min-w-0 break-words">{copy.recordLink}</span>
          <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        </a>
        <a
          href={reference.labelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full items-start gap-1.5 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          <span className="min-w-0 break-words">{copy.labelLink}</span>
          <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        </a>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {copy.checkedOn}: <time dateTime={reference.checkedOn}>{checkedDate}</time>
      </p>
    </aside>
  )
}
