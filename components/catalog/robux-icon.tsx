import { cn } from '@/lib/utils'

export function RobuxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-4 shrink-0', className)} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M12 1.5 21.1 6.75v10.5L12 22.5l-9.1-5.25V6.75L12 1.5Zm0 3.2L5.7 8.33v7.34L12 19.3l6.3-3.63V8.33L12 4.7Zm-3.2 4.1h6.4v6.4H8.8V8.8Zm2.2 2.2v2h2v-2h-2Z"
      />
    </svg>
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
