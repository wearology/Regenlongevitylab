import type { Metadata } from 'next'
import { NotVerifiedResult, VerifiedResult } from '@/components/verify-result'
import { normalizeCode, verifyCode } from '@/lib/verify-codes'

// Keep verification pages hidden from search engines and out of the sitemap.
export const metadata: Metadata = {
  title: 'Product Authenticity — Lorenic',
  robots: { index: false, follow: false },
}

export default async function VerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const record = verifyCode(code)

  if (!record) {
    return <NotVerifiedResult code={normalizeCode(code)} />
  }

  return <VerifiedResult record={record} />
}
