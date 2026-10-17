'use client'

import Image from 'next/image'
import {
  Gift,
  House,
  MessageSquare,
  Package,
  Repeat,
  Shirt,
  Users,
  UsersRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  onNotify: (msg: string) => void
  onBuyRobux: () => void
}

const links = [
  { label: 'Home', icon: House },
  { label: 'Messages', icon: MessageSquare, badge: 3 },
  { label: 'Friends', icon: Users },
  { label: 'Avatar', icon: Shirt },
  { label: 'Inventory', icon: Package },
  { label: 'Trade', icon: Repeat },
  { label: 'Communities', icon: UsersRound },
  { label: 'Gift Cards', icon: Gift },
]

export function LeftNav({ open, onClose, onNotify, onBuyRobux }: Props) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 top-[60px] z-30 bg-black/50 xl:hidden"
        />
      )}
      <nav
        aria-label="Account"
        className={cn(
          'fixed bottom-0 left-0 top-[60px] z-30 flex w-[220px] flex-col overflow-y-auto bg-header px-3 py-3 transition-transform',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <button
          type="button"
          onClick={() => onNotify('Opening your profile')}
          className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-secondary"
        >
          <span className="relative size-9 overflow-hidden rounded-full bg-thumb">
            <Image src="/avatar.png" alt="" fill sizes="36px" className="object-cover" />
          </span>
          <span className="text-base font-bold">Builderman</span>
        </button>
        <ul className="flex flex-col gap-0.5">
          {links.map(({ label, icon: Icon, badge }) => (
            <li key={label}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onNotify(`${label} is coming soon`)
                }}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-base font-medium text-foreground/90 hover:bg-secondary hover:text-foreground"
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="rounded-full bg-favorite px-1.5 text-xs font-bold text-white">{badge}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#f5c542] text-[#202020]">
              <span className="font-serif text-[23px] font-black leading-none">&amp;</span>
            </span>
            <span className="text-sm font-bold leading-5 text-foreground">Roblox Plus</span>
          </div>
          <p className="text-sm font-bold leading-5 text-foreground">More fun for less Robux.</p>
          <p className="mt-1 text-xs leading-4 text-muted-foreground">Subscribe to Roblox Plus.</p>
          <button
            type="button"
            onClick={onBuyRobux}
            className="mt-2 text-xs font-semibold text-foreground underline underline-offset-2 hover:text-foreground/80"
          >
            Subscribe
          </button>
        </div>
      </nav>
    </>
  )
}
