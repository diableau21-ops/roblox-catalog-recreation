'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { RobuxIcon } from './robux-icon'

const packages = [
  { robux: 400, price: '$4.99' },
  { robux: 800, price: '$9.99' },
  { robux: 1700, price: '$19.99' },
  { robux: 4500, price: '$49.99' },
  { robux: 10000, price: '$99.99' },
  { robux: 22500, price: '$199.99' },
]

export function RobuxModal({ onClose, onAdd }: { onClose: () => void; onAdd: (n: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="robux-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-xl bg-card p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-secondary"
        >
          <X className="size-5" />
        </button>
        <h2 id="robux-title" className="text-xl font-bold">
          Buy Robux
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Demo mode: no real payment is made.</p>
        <ul className="mt-5 grid grid-cols-2 gap-3">
          {packages.map((p) => (
            <li key={p.robux}>
              <button
                type="button"
                onClick={() => onAdd(p.robux)}
                className="flex w-full flex-col items-center gap-1 rounded-lg border border-border bg-secondary/50 p-4 hover:border-primary hover:bg-secondary"
              >
                <span className="flex items-center gap-1.5 text-lg font-bold">
                  <RobuxIcon className="size-5" />
                  {p.robux.toLocaleString('en-US')}
                </span>
                <span className="text-sm text-muted-foreground">{p.price}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
