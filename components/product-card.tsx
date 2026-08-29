import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CARTRIDGE_PRICE, type Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-square bg-white">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={`Lorenic ${product.name} pre-filled cartridge`}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-accent">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] font-display text-base font-semibold leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-1.5 pt-3">
          <span className="font-display text-lg font-bold text-primary">
            {CARTRIDGE_PRICE}
          </span>
          <span className="text-xs text-muted-foreground">/ cartridge</span>
        </div>
        <span className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors group-hover:bg-secondary/70">
          View Product
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
