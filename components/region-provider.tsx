'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import {
  DEFAULT_REGION,
  REGION_COOKIE,
  getRegion,
  getRegionFromPath,
  regionPath,
  type Language,
  type Region,
  type RegionId,
} from '@/lib/regions'

type RegionContextValue = {
  region: Region
  language: Language
  href: (path?: string) => string
}

const RegionContext = createContext<RegionContextValue | null>(null)

export function rememberRegion(region: RegionId) {
  document.cookie = `${REGION_COOKIE}=${region}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`
}

export function RegionProvider({
  initialRegion = DEFAULT_REGION,
  children,
}: {
  initialRegion?: RegionId
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const region = getRegionFromPath(pathname) ?? getRegion(initialRegion)!

  useEffect(() => {
    document.documentElement.lang = region.locale
    // A direct regional URL is authoritative, including a shared link that
    // differs from a visitor's saved choice. Do not save a default at /.
    if (getRegionFromPath(pathname)) rememberRegion(region.id)
  }, [pathname, region])

  const value = useMemo<RegionContextValue>(() => ({
    region,
    language: region.language,
    href: (path = '') => regionPath(region.id, path),
  }), [region])

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion() {
  const context = useContext(RegionContext)
  if (!context) throw new Error('useRegion must be used within RegionProvider')
  return context
}
