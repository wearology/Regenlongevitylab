'use client'

import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { useConsultation } from '@/components/consultation-modal'
import { useRegion } from '@/components/region-provider'
import { SUPPORT_COPY } from '@/lib/support-copy'

type ConsultationButtonProps = Omit<ComponentProps<typeof Button>, 'render'> & {
  /** When set, the consultation message is personalized for this product. */
  productName?: string
}

/**
 * A Button that opens the global consultation modal.
 * Can be dropped into server components since it is a client component.
 */
export function ConsultationButton({
  children,
  onClick,
  productName,
  ...props
}: ConsultationButtonProps) {
  const { open } = useConsultation()
  const { language } = useRegion()
  return (
    <Button
      {...props}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) open(productName)
      }}
    >
      {children ?? SUPPORT_COPY[language].consultation.start}
    </Button>
  )
}
