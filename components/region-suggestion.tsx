'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Globe2 } from 'lucide-react'
import { rememberRegion } from '@/components/region-provider'
import { REGION_SUGGESTION_DISMISSED_COOKIE } from '@/lib/region-detection'
import { getRegion, regionPath, type RegionId } from '@/lib/regions'

export function RegionSuggestion({
  suggestedRegionId,
  focusTargetId,
}: {
  suggestedRegionId: RegionId | null
  focusTargetId: string
}) {
  const [dismissed, setDismissed] = useState(false)
  const region = getRegion(suggestedRegionId)

  if (!region || dismissed) return null

  const connectionName = ['eu', 'us', 'uk'].includes(region.id)
    ? `the ${region.name}`
    : region.name

  function dismissSuggestion() {
    // Session-only preference. Never store the connection country or raw IP.
    document.cookie = `${REGION_SUGGESTION_DISMISSED_COOKIE}=1; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`
    setDismissed(true)
    document.getElementById(focusTargetId)?.focus({ preventScroll: true })
  }

  return (
    <aside
      aria-labelledby="region-suggestion-title"
      aria-describedby="region-suggestion-description"
      className="mb-7 rounded-2xl border border-primary/15 bg-secondary/65 p-5"
    >
      <p id="region-suggestion-title" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
        <Globe2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
        A suggestion for you
      </p>
      <p id="region-suggestion-description" className="mt-3 text-sm leading-relaxed text-primary">
        It looks like you’re connecting from {connectionName}. Would you like to visit Regen {region.nativeName}?
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        An approximate suggestion based on your connection’s country, not GPS. You’re always free to choose another region.
      </p>
      <div className="mt-4 flex flex-col items-stretch gap-3 sm:items-start">
        <Link
          href={regionPath(region.id)}
          hrefLang={region.id === 'eu' ? 'en' : region.locale}
          prefetch={false}
          onClick={() => rememberRegion(region.id)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Visit Regen {region.nativeName}
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={dismissSuggestion}
          className="min-h-10 rounded-md px-1 text-sm font-medium text-primary underline decoration-primary/25 underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Choose another region
        </button>
      </div>
    </aside>
  )
}
