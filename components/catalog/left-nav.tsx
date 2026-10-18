'use client'

import Image from 'next/image'
import {
  Gift,
  House,
  MessageSquare,
  Package,
  Repeat,
  Shirt,
  UserRound,
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
  { label: 'Profil', icon: UserRound },
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
          'fixed bottom-0 left-0 top-[60px] z-40 flex w-[min(320px,88vw)] flex-col overflow-y-auto border-r border-border bg-header px-4 py-4 shadow-2xl transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <button
          type="button"
          onClick={() => onNotify('Opening your profile')}
          className="mb-4 flex min-h-14 items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-secondary"
        >
          <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-thumb">
            <Image src="/avatar.png" alt="" fill sizes="44px" className="object-cover" />
          </span>
          <span className="text-lg font-bold">Builderman</span>
        </button>
        <ul className="flex flex-col gap-1">
          {links.map(({ label, icon: Icon, badge }) => (
            <li key={label}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onNotify(`${label} is coming soon`)
                }}
                className="flex min-h-12 items-center gap-4 rounded-xl px-3 py-3 text-lg font-medium text-foreground/90 hover:bg-secondary hover:text-foreground"
              >
                <Icon className="size-6 shrink-0" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="rounded-full bg-favorite px-2 py-0.5 text-sm font-bold text-white">{badge}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg"
                alt="Roblox Plus"
                className="size-8 object-contain brightness-0 invert"
              />
            </span>
            <span className="text-base font-bold leading-5 text-foreground">Roblox Plus</span>
          </div>
          <p className="text-base font-bold leading-6 text-foreground">More fun for less Robux.</p>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">Subscribe to Roblox Plus.</p>
          <button
            type="button"
            onClick={onBuyRobux}
            className="mt-3 text-sm font-semibold text-foreground underline underline-offset-2 hover:text-foreground/80"
          >
            Subscribe
          </button>
        </div>
      </nav>
    </>
  )
}
