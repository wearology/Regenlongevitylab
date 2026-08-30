import { notFound } from 'next/navigation'
import { getRegion } from '@/lib/regions'

export default async function RegionalLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ region: string }>
}) {
  if (!getRegion((await params).region)) notFound()
  return children
}
