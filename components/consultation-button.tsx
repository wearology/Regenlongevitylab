'use client'

import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { useConsultation } from '@/components/consultation-modal'

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
  return (
    <Button
      {...props}
      onClick={(e) => {
        onClick?.(e)
        open(productName)
      }}
    >
      {children}
    </Button>
  )
}
