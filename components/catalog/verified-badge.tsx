import { cn } from '@/lib/utils'

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      role="img"
      aria-label="Verified"
      className={cn('inline-block shrink-0 align-middle', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Verified</title>
      <path
        fill="#0066FF"
        d="M8.05 1.15 26.85 6.2 21.8 25 3 19.95 8.05 1.15Z"
      />
      <path
        d="m8.25 13.65 3.55 3.55 7.95-7.95"
        fill="none"
        stroke="#fff"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
