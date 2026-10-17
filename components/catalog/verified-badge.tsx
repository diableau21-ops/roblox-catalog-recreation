import { cn } from '@/lib/utils'

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="Verified"
      className={cn('inline-block shrink-0 align-middle', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Verified</title>
      <path
        fill="#1877F2"
        d="M12 1.25 14.7 2.7l3.05-.1 1.45 2.7 2.7 1.45-.1 3.05L23.25 12l-1.45 2.7.1 3.05-2.7 1.45-1.45 2.7-3.05-.1L12 23.25 9.3 21.8l-3.05.1-1.45-2.7-2.7-1.45.1-3.05L.75 12 2.2 9.3l-.1-3.05L4.8 4.8l1.45-2.7 3.05.1L12 1.25Z"
      />
      <path
        d="m7.1 12.25 3.15 3.15 6.7-6.7"
        fill="none"
        stroke="#fff"
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
