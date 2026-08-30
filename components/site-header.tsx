'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Quality', href: '#kualitas' },
  { label: 'Reviews', href: '#ulasan' },
  { label: 'FAQ', href: '#faq' },
]

export function SiteHeader({ forceSolid = false }: { forceSolid?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // "Solid" = frosted opaque state with the forest-green logo.
  // Mobile menu open also forces the solid state for readability.
  const solid = forceSolid || scrolled || hovered || open

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Transparent state: subtle full-bleed blur that fades out at the
          bottom edge (masked) so there is no hard dividing line. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-background/5 backdrop-blur-sm transition-opacity duration-500 ease-out',
          '[mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]',
          '[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]',
          solid ? 'opacity-0' : 'opacity-100',
        )}
      />
      {/* Solid state: full-width white header bar that cross-fades in on
          scroll/hover, with a subtle bottom border. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 border-b border-border/70 bg-background shadow-sm transition-opacity duration-500 ease-out',
          solid ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="relative flex items-center" aria-label="Regen home">
          {/* Forest logo (solid state) */}
          <Logo
            className={cn(
              'transition-opacity duration-500',
              solid ? 'opacity-100' : 'opacity-0',
            )}
          />
          {/* White logo (transparent state) */}
          <Logo
            variant="light"
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              solid ? 'opacity-0' : 'opacity-100',
            )}
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                solid
                  ? 'text-muted-foreground hover:text-primary'
                  : 'text-primary-foreground/80 hover:text-primary-foreground',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Button
            render={<a href="/#katalog" />}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            View Catalog
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex size-11 items-center justify-center rounded-lg transition-colors md:hidden',
            solid ? 'text-primary' : 'text-primary-foreground',
          )}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background md:hidden">
          <nav
            className="mx-auto flex w-full max-w-6xl flex-col px-4 py-2"
            aria-label="Mobile"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center border-b border-border/60 text-base font-medium text-foreground last:border-b-0"
              >
                {link.label}
              </a>
            ))}
            <Button
              render={<a href="/#katalog" />}
              onClick={() => setOpen(false)}
              className="my-3 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              View Catalog
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
