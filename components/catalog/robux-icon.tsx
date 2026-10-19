import { cn } from '@/lib/utils'

export function RobuxIcon({ className }: { className?: string }) {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/0/09/Robux_2019_Logo_Black.svg"
      alt=""
      aria-hidden="true"
      className={cn('inline-block size-4 shrink-0 object-contain invert', className)}
    />
  )
}

export function RobloxLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center text-[22px] font-black leading-none tracking-tight', className)}
      aria-label="Roblox"
    >
      R<span className="mx-[1px] inline-flex size-[0.72em] rotate-[15deg] items-center justify-center bg-current align-middle"><span className="size-[0.24em] bg-header" /></span>BLOX
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
      {price}
    </span>
  )
}
