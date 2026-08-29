import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'light'
  withTagline?: boolean
}

export function Logo({
  className,
  variant = 'default',
  withTagline = false,
}: LogoProps) {
  const wordmarkColor =
    variant === 'light' ? 'text-primary-foreground' : 'text-primary'
  const taglineColor =
    variant === 'light'
      ? 'text-primary-foreground/70'
      : 'text-muted-foreground'

  return (
    <span className={cn('inline-flex flex-col leading-none', className)}>
      <span className="inline-flex items-center gap-2">
        <span
          className={cn(
            'font-display text-2xl font-bold tracking-tight',
            wordmarkColor,
          )}
        >
          Lorenic
        </span>
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="size-2 rounded-full bg-accent" />
          <span className="size-2 rounded-full bg-accent" />
          <span className="size-2 rounded-full bg-accent" />
        </span>
      </span>
      {withTagline && (
        <span
          className={cn(
            'mt-1 text-[0.6rem] font-medium uppercase tracking-[0.18em]',
            taglineColor,
          )}
        >
          Peptide Science. Researched &amp; Tested.
        </span>
      )}
    </span>
  )
}
