import { cn } from '@/lib/utils'

export function RobuxIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('size-4 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinejoin="round"
    >
      <path d="M12 2.5 20.5 7.25v9.5L12 21.5 3.5 16.75v-9.5Z" />
      <rect x="9" y="9" width="6" height="6" rx="0.5" />
    </svg>
  )
}

export function Price({
  price,
  className,
}: {
  price: number | null
  className?: string
}) {
  if (price === null)
    return <span className={cn('text-muted-foreground', className)}>Off Sale</span>
  if (price === 0)
    return <span className={cn('font-semibold text-foreground', className)}>Free</span>
  return (
    <span className={cn('inline-flex items-center gap-1 font-semibold text-foreground', className)}>
      <RobuxIcon />
      {price.toLocaleString('en-US')}
    </span>
  )
}
