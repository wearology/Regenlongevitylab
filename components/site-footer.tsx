import { Mail, MessageCircle, MapPin } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

export function SiteFooter() {
  return (
    <footer id="kontak" className="bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 border-b border-primary-foreground/15 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to order? Start with a free consultation.
            </h2>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
              Our team is ready to help you choose the product and package that
              fit your research needs.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button
              render={<a href="https://wa.me/6280000000000" />}
              size="lg"
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <MessageCircle className="size-4" />
              Chat with Us
            </Button>
            <Button
              render={<a href="mailto:contact@regenlongevitylab.com" />}
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Mail className="size-4" />
              Email Us
            </Button>
          </div>
        </div>

        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="light" withTagline />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Laboratory-grade research peptides, researched and tested for
              reliable results.
            </p>
          </div>

          <nav aria-label="Products">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Products
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#katalog" className="hover:text-accent">
                  Peptide Catalog
                </a>
              </li>
              <li>
                <a href="#format" className="hover:text-accent">
                  Pre-filled Cartridge Version
                </a>
              </li>
              <li>
                <a href="#format" className="hover:text-accent">
                  Pen Version
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#kualitas" className="hover:text-accent">
                  Quality
                </a>
              </li>
              <li>
                <a href="#pengiriman" className="hover:text-accent">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-accent">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-accent" /> contact@regenlongevitylab.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-accent" /> Shipping across Europe &amp; worldwide
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-primary-foreground/15 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Regen. All rights reserved.
          </p>
          <p className="max-w-lg text-pretty sm:text-right">
            For laboratory research only.
          </p>
        </div>
      </div>
    </footer>
  )
}
