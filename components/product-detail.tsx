'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  FlaskConical,
  FileCheck2,
  Snowflake,
  Headset,
  MessageCircle,
} from 'lucide-react'
import { ConsultationButton } from '@/components/consultation-button'
import { VARIANTS, type Product, type VariantId } from '@/lib/products'

const usps = [
  { icon: FlaskConical, label: 'European Laboratory Tested' },
  { icon: FileCheck2, label: 'Batch-specific COA' },
  { icon: Snowflake, label: 'Cold Chain Shipping' },
  { icon: Headset, label: 'Scientific Support' },
]

export function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState<VariantId>('cartridge')
  const active = VARIANTS.find((v) => v.id === variant) ?? VARIANTS[0]

  // Each product has three image slides: the cartridge package (primary on
  // entry), the pen package, and the individual product shot. The first two
  // slides stay in sync with the format the customer selects.
  const gallery: {
    src: string
    alt: string
    variant: VariantId | null
  }[] = [
    {
      src: '/products/cartridge-package.jpeg',
      alt: `Regen ${product.name} cartridge package contents`,
      variant: 'cartridge',
    },
    {
      src: '/products/pen-package.jpeg',
      alt: `Regen ${product.name} pen package contents`,
      variant: 'pen',
    },
    {
      src: product.image || '/placeholder.svg',
      alt: `Regen ${product.name} pre-filled cartridge`,
      variant: null,
    },
  ]

  const [activeImage, setActiveImage] = useState(0)

  function selectVariant(id: VariantId) {
    setVariant(id)
    const idx = gallery.findIndex((g) => g.variant === id)
    if (idx >= 0) setActiveImage(idx)
  }

  function selectImage(idx: number) {
    setActiveImage(idx)
    const v = gallery[idx].variant
    if (v) setVariant(v)
  }

  return (
    <section className="bg-background pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Link
          href="/#katalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to catalog
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: product image gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
              <Image
                key={gallery[activeImage].src}
                src={gallery[activeImage].src}
                alt={gallery[activeImage].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, idx) => {
                const selected = idx === activeImage
                return (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => selectImage(idx)}
                    aria-label={`View ${img.alt}`}
                    aria-pressed={selected}
                    className={`relative aspect-square overflow-hidden rounded-xl border bg-card transition-all ${
                      selected
                        ? 'border-accent ring-1 ring-accent'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-contain p-1"
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: product info */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {product.category}
            </span>
            <h1 className="mt-2 text-balance font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-primary">
                {active.price}
              </span>
              <span className="text-sm text-muted-foreground">
                / {active.label.toLowerCase()}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Dosing reference: {product.dosage}
            </p>

            {/* Variant selector */}
            <div className="mt-6">
              <span className="text-sm font-medium text-foreground">
                Choose your format
              </span>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {VARIANTS.map((v) => {
                  const selected = v.id === variant
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => selectVariant(v.id)}
                      aria-pressed={selected}
                      className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? 'border-accent bg-accent/5 ring-1 ring-accent'
                          : 'border-border bg-card hover:border-accent/50'
                      }`}
                    >
                      <span className="font-display text-sm font-semibold text-foreground">
                        {v.label}
                      </span>
                      <span className="mt-1 font-display text-lg font-bold text-primary">
                        {v.price}
                      </span>
                      <span className="mt-1 text-xs leading-snug text-muted-foreground">
                        {v.note}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <ConsultationButton
              size="lg"
              productName={product.name}
              className="mt-6 w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <MessageCircle className="size-4" />
              Order &amp; Consultation
            </ConsultationButton>

            {/* USP icons row */}
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
              {usps.map((usp) => (
                <li
                  key={usp.label}
                  className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left"
                >
                  <usp.icon className="size-5 text-accent" aria-hidden="true" />
                  <span className="text-xs leading-snug text-muted-foreground">
                    {usp.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
