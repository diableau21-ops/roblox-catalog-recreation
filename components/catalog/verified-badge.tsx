import { cn } from '@/lib/utils'

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      role="img"
      aria-label="Verified"
      className={cn('inline-block shrink-0', className)}
    >
      <title>Verified</title>
      <path
        fill="#0066FF"
        d="M9.6 1.8a3 3 0 0 1 4.4 0l.9 1a3 3 0 0 0 2.5.9l1.3-.2a3 3 0 0 1 3.4 2.6l.2 1.3a3 3 0 0 0 1.5 2.2l1.1.7a3 3 0 0 1 1 4.2l-.7 1.1a3 3 0 0 0-.3 2.6l.4 1.3a3 3 0 0 1-2.1 3.8l-1.3.3a3 3 0 0 0-2 1.7l-.5 1.2a3 3 0 0 1-4 1.6l-1.2-.6a3 3 0 0 0-2.6 0l-1.2.6a3 3 0 0 1-4-1.6l-.5-1.2a3 3 0 0 0-2-1.7l-1.3-.3a3 3 0 0 1-2.1-3.8l.4-1.3a3 3 0 0 0-.3-2.6l-.7-1.1a3 3 0 0 1 1-4.2l1.1-.7A3 3 0 0 0 5 7.4l.2-1.3a3 3 0 0 1 3.4-2.6l1.3.2"
        transform="translate(1.8 0)"
      />
      <path
        d="m9 14.2 3.3 3.3L19.5 10"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
