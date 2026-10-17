import { cn } from '@/lib/utils'

export function RobuxIcon({ className }: { className?: string }) {
  return (
    <img
      src="https://images.rbxcdn.com/3a9b44283e65ae1ead90defcb0bdcb6e-economy_28x28_dark.svg"
      alt=""
      aria-hidden="true"
      className={cn('inline-block size-4 shrink-0 object-contain', className)}
    />
  )
}

export function RobloxLogo({ className }: { className?: string }) {
  const tilted = (
    <span className="mx-[1px] inline-flex size-[0.72em] rotate-[15deg] items-center justify-center bg-current">
      <span className="size-[0.24em] bg-header" />
    </span>
  )
  return (
    <span
      className={cn('inline-flex items-center text-[22px] font-black leading-none tracking-tight', className)}
      aria-hidden="true"
    >
      R{tilted}BL{tilted}X
    </span>
  )
}

export function RobloxMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex size-7 rotate-[15deg] items-center justify-center bg-foreground', className)}
    >
      <span className="size-2 bg-header" />
    </span>
  )
}

export function Price({ price, className }: { price: number | null; className?: string }) {
  if (price === null) return <span className={cn('text-muted-foreground', className)}>Off Sale</span>
  if (price === 0) return <span className={cn('font-bold text-foreground', className)}>Free</span>
  return (
    <span className={cn('inline-flex items-center gap-1 font-bold text-foreground', className)}>
      <RobuxIcon />
      {price.toLocaleString('en-US')}
    </span>
  )
}
