'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useId, useRef, useState } from 'react'
import { Check, ChevronDown, Globe2, X } from 'lucide-react'
import { rememberRegion, useRegion } from '@/components/region-provider'
import { REGIONS, switchRegionPath } from '@/lib/regions'
import { cn } from '@/lib/utils'

const copy = {
  en: {
    change: 'Change region', title: 'Your region. Your Regen.',
    description: 'Choose your region, language and currency.', close: 'Close region selector', current: 'Current region',
    note: 'Product availability, shipping and final pricing are confirmed by our team.',
  },
  ms: {
    change: 'Tukar region', title: 'Pilih Regen untuk region anda.',
    description: 'Pilih region, bahasa dan mata wang anda.', close: 'Tutup pilihan region', current: 'Region sekarang',
    note: 'Team kami akan sahkan stok, penghantaran dan harga akhir sebelum anda order.',
  },
  id: {
    change: 'Ganti region', title: 'Pilih Regen untuk region kamu.',
    description: 'Pilih region, bahasa, dan mata uang kamu.', close: 'Tutup pilihan region', current: 'Region sekarang',
    note: 'Tim kami akan konfirmasi stok, pengiriman, dan harga akhir sebelum kamu order.',
  },
}

export function RegionSwitcher({ variant = 'default', className }: {
  variant?: 'default' | 'light'
  className?: string
}) {
  const { region, language } = useRegion()
  const pathname = usePathname()
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [open, setOpen] = useState(false)
  const [locationSuffix, setLocationSuffix] = useState('')
  const text = copy[language]

  function show() {
    setLocationSuffix(window.location.search + window.location.hash)
    dialog.current?.showModal()
    setOpen(true)
  }

  return (
    <>
      <button
        type="button" onClick={show} aria-haspopup="dialog" aria-expanded={open}
        aria-label={`${text.change}: ${region.name}, ${region.languageName}, ${region.currency}`}
        className={cn(
          'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-sm',
          variant === 'light' ? 'border-white/25 text-white hover:bg-white/10' : 'border-border bg-white text-primary hover:bg-secondary',
          className,
        )}
      >
        <Globe2 className="size-4 shrink-0" aria-hidden="true" />
        <span>{region.shortName} <span className="text-current/40">/</span> {region.currency}</span>
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </button>
      <dialog
        ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId}
        onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close() }}
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-primary/65 backdrop:backdrop-blur-sm"
        data-lenis-prevent
      >
        <div className="relative p-6 sm:p-8">
          <button type="button" onClick={() => dialog.current?.close()} aria-label={text.close}
            className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-primary">
            <X className="size-5" aria-hidden="true" />
          </button>
          <Globe2 className="mb-4 size-7 text-accent" aria-hidden="true" />
          <h2 id={titleId} className="pr-5 font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">{text.title}</h2>
          <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted-foreground">{text.description}</p>
          <nav className="mt-6 grid gap-2.5 sm:grid-cols-2" aria-label={text.change}>
            {REGIONS.map((item) => (
              <Link key={item.id} href={switchRegionPath(pathname, item.id) + locationSuffix}
                prefetch={false} hrefLang={item.id === 'eu' ? 'en' : item.locale}
                aria-current={item.id === region.id ? 'page' : undefined}
                onClick={() => { rememberRegion(item.id); dialog.current?.close() }}
                className={cn(
                  'group flex min-h-20 items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-4',
                  item.id === region.id ? 'border-primary bg-secondary' : 'border-border hover:border-primary/40 hover:bg-secondary/50',
                )}
              >
                <span className="text-2xl" aria-hidden="true">{item.flag}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-primary">{item.nativeName}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{item.languageName} · {item.currency}</span>
                </span>
                {item.id === region.id && <Check className="size-4 shrink-0 text-primary" aria-label={text.current} />}
              </Link>
            ))}
          </nav>
          <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">{text.note}</p>
        </div>
      </dialog>
    </>
  )
}
