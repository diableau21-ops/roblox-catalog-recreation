'use client'

import { Bell, Menu, Search, Settings } from 'lucide-react'
import { RobuxIcon } from './robux-icon'

type Props = {
  balance: number
  query: string
  onQueryChange: (q: string) => void
  onBuyRobux: () => void
  onNotify: (msg: string) => void
}

export function SiteHeader({ balance, query, onQueryChange, onBuyRobux, onNotify }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-header">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-3 md:gap-6 md:px-6">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => onNotify('Menu opened')}
          className="rounded-md p-2 text-foreground hover:bg-secondary lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <a href="#" className="flex items-center gap-2" aria-label="Roblox home">
          <span className="flex size-8 rotate-12 items-center justify-center rounded-[6px] bg-foreground">
            <span className="size-2.5 rounded-[2px] bg-header" />
          </span>
          <span className="hidden text-xl font-black tracking-tight sm:inline">ROBLOX</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {['Charts', 'Marketplace', 'Create'].map((label) => (
            <a
              key={label}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (label !== 'Marketplace') onNotify(`${label} is coming soon`)
              }}
              aria-current={label === 'Marketplace' ? 'page' : undefined}
              className="rounded-md px-3 py-1.5 text-sm font-bold text-foreground hover:bg-secondary aria-[current=page]:bg-secondary"
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            onClick={onBuyRobux}
            className="rounded-md px-3 py-1.5 text-sm font-bold text-foreground hover:bg-secondary"
          >
            Robux
          </button>
        </nav>

        <label className="relative ml-auto flex max-w-md flex-1 items-center">
          <span className="sr-only">Search the Marketplace</span>
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onBuyRobux}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold hover:bg-secondary"
            aria-label={`${balance} Robux, buy more`}
          >
            <RobuxIcon className="size-5" />
            <span className="tabular-nums">{balance.toLocaleString('en-US')}</span>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => onNotify('No new notifications')}
            className="hidden rounded-md p-2 hover:bg-secondary sm:block"
          >
            <Bell className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            onClick={() => onNotify('Settings are coming soon')}
            className="hidden rounded-md p-2 hover:bg-secondary sm:block"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
