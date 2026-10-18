'use client'

import Image from 'next/image'
import { Bell, Menu, Search, Settings } from 'lucide-react'
import { RobloxLogo, RobloxMark, RobuxIcon } from './robux-icon'

type Props = {
  balance: number
  query: string
  onQueryChange: (q: string) => void
  onBuyRobux: () => void
  onNotify: (msg: string) => void
  onToggleNav: () => void
}

const navLinks = ['Charts', 'Marketplace', 'Create', 'Robux'] as const

export function SiteHeader({ balance, query, onQueryChange, onBuyRobux, onNotify, onToggleNav }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-header shadow-[0_1px_0_0_var(--border)]">
      <div className="flex h-[60px] items-center gap-2 px-3 md:gap-4 md:px-4">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={onToggleNav}
          className="rounded-lg p-2 text-foreground hover:bg-secondary"
        >
          <Menu className="size-6" />
        </button>
        <a href="#" className="flex items-center text-foreground" aria-label="Roblox home">
          <RobloxLogo className="hidden md:inline-flex" />
          <RobloxMark className="md:hidden" />
        </a>

        <nav aria-label="Main" className="ml-2 hidden items-center lg:flex">
          {navLinks.map((label) => (
            <a
              key={label}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (label === 'Robux') onBuyRobux()
                else if (label !== 'Marketplace') onNotify(`${label} is coming soon`)
              }}
              aria-current={label === 'Marketplace' ? 'page' : undefined}
              className="relative px-4 py-[19px] text-base font-bold text-foreground/90 hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-4 aria-[current=page]:after:bottom-0 aria-[current=page]:after:h-[3px] aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <label className="relative mx-auto flex max-w-[400px] flex-1 items-center">
          <span className="sr-only">Search the Marketplace</span>
          <Search className="pointer-events-none absolute left-2 size-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search"
            className="h-8 w-full rounded-lg border border-border bg-input pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/60 focus:outline-none"
          />
        </label>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onNotify('Opening your profile')}
            className="hidden items-center gap-2 rounded-lg py-1 pl-1 pr-3 hover:bg-secondary md:flex"
          >
            <span className="relative size-8 overflow-hidden rounded-full bg-thumb">
              <Image src="/avatar.png" alt="" fill sizes="32px" className="object-cover" />
            </span>
            <span className="text-sm font-bold">Builderman</span>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => onNotify('No new notifications')}
            className="relative hidden rounded-lg p-2 hover:bg-secondary sm:block"
          >
            <Bell className="size-6" />
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-favorite text-[10px] font-bold text-white">
              2
            </span>
          </button>
          <button
            type="button"
            onClick={onBuyRobux}
            className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-base font-bold hover:bg-secondary"
            aria-label={`${balance} Robux, buy more`}
          >
            <RobuxIcon className="size-6" />
            <span className="tabular-nums">{balance.toLocaleString('en-US')}</span>
          </button>
          <button
            type="button"
            aria-label="Settings"
            onClick={() => onNotify('Settings are coming soon')}
            className="hidden rounded-lg p-2 hover:bg-secondary sm:block"
          >
            <Settings className="size-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
