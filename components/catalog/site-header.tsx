'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Bell, Search, Settings } from 'lucide-react'
import { RobloxLogo, RobloxMark, RobuxIcon } from './robux-icon'

type Props = {
  balance: number
  query: string
  onQueryChange: (q: string) => void
  onBuyRobux: () => void
  onNotify: (msg: string) => void
}

const navLinks = ['Charts', 'Marketplace', 'Create', 'Robux'] as const

export function SiteHeader({ balance, query, onQueryChange, onBuyRobux, onNotify }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileQuery, setProfileQuery] = useState('')
  const [profileSearching, setProfileSearching] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileResults, setProfileResults] = useState<{ id: number; name: string; displayName: string; avatarUrl?: string; hasVerifiedBadge?: boolean }[]>([])
  const [profile, setProfile] = useState<{ id: number; name: string; displayName: string; avatarUrl?: string; hasVerifiedBadge?: boolean } | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('catalog-demo-profile')
      if (saved) setProfile(JSON.parse(saved))
    } catch {}
  }, [])

  const searchProfile = async () => {
    const keyword = profileQuery.trim()
    if (keyword.length < 3) {
      setProfileMessage('Enter at least 3 characters.')
      return
    }
    setProfileSearching(true)
    setProfileMessage('')
    try {
      const response = await fetch(`/api/roblox-users?keyword=${encodeURIComponent(keyword)}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Search failed')
      const payload = await response.json()
      const results = Array.isArray(payload.data) ? payload.data : []
      setProfileResults(results)
      setProfileMessage(results.length ? '' : 'No Roblox users found.')
    } catch {
      setProfileResults([])
      setProfileMessage('Could not search Roblox users. Try again.')
    } finally {
      setProfileSearching(false)
    }
  }

  const chooseProfile = (player: { id: number; name: string; displayName: string; avatarUrl?: string; hasVerifiedBadge?: boolean }) => {
    setProfile(player)
    try { window.localStorage.setItem('catalog-demo-profile', JSON.stringify(player)) } catch {}
    window.dispatchEvent(new CustomEvent('catalog-profile-updated', { detail: player }))
    setProfileOpen(false)
    setProfileQuery('')
    setProfileResults([])
    setProfileMessage('')
  }

  const searchCategories = ['Games', 'People', 'Marketplace', 'Communities', 'Creator Store']

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-header/95 shadow-sm backdrop-blur-md">
      <div className="flex h-14 w-full items-center gap-3 px-3 sm:gap-4 sm:px-5 lg:px-6">
        <a href="#" className="flex items-center text-foreground" aria-label="Roblox home">
          <RobloxLogo className="hidden md:inline-flex" />
          <RobloxMark className="md:hidden" />
        </a>

        <nav aria-label="Main" className="hidden shrink-0 items-center gap-0.5 md:flex">
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
              className="relative px-2.5 py-[18px] text-sm font-semibold text-foreground/90 transition-colors hover:text-foreground lg:px-3 lg:text-base aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-2.5 aria-[current=page]:after:bottom-0 aria-[current=page]:after:h-[3px] aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-foreground lg:aria-[current=page]:after:inset-x-3"
            >
              {label}
            </a>
          ))}
        </nav>

        <label className="relative mx-auto flex min-w-0 max-w-[600px] flex-1 items-center">
          <span className="sr-only">Search the Marketplace</span>
          <Search className="pointer-events-none absolute left-2.5 size-[18px] text-[#606162]" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search"
            style={{ backgroundColor: "#f2f4f5", color: "#393b3d" }}
            className="h-8 w-full rounded-md border border-[#bdbebe] !bg-[#f2f4f5] pl-9 pr-3 text-sm text-[#393b3d] placeholder:text-[#606162] transition-colors focus:!bg-[#f2f4f5] focus:border-[#bdbebe] focus:outline-none focus:ring-1 focus:ring-[#bdbebe] sm:h-9 sm:text-sm"
          />
          {searchOpen && query.trim() && (
            <div className="absolute left-0 right-0 top-full z-[60] mt-1 overflow-hidden rounded-md border border-[#d5d7d8] bg-white py-1 text-[#393b3d] shadow-xl">
              {searchCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onQueryChange(query.trim())
                    setSearchOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-[#e8e8e8]"
                >
                  <Search className="size-4 shrink-0 text-[#606162]" />
                  <span className="min-w-0 truncate">
                    <span className="text-[#606162]">in </span>{category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </label>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => { setProfileQuery(profile?.name ?? ''); setProfileOpen(true); setProfileMessage(''); setProfileResults([]) }}
            className="hidden items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-secondary xl:flex"
          >
            <span className="relative size-8 overflow-hidden rounded-full bg-thumb">
              {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-8 object-cover" /> : <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/avatar.png`} alt="" fill sizes="32px" className="object-cover" />}
            </span>
            <span className="text-sm font-bold">{profile?.displayName || 'Builderman'}</span>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => onNotify('No new notifications')}
            className="relative hidden rounded-lg p-2 hover:bg-secondary sm:block"
          >
            <Bell className="size-5" />
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-favorite text-[10px] font-bold text-white">
              2
            </span>
          </button>
          <button
            type="button"
            onClick={onBuyRobux}
            className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold transition-colors hover:bg-secondary sm:text-base"
            aria-label={`${balance} Robux, buy more`}
          >
            <RobuxIcon className="size-6" />
            <span className="tabular-nums">{balance}</span>
          </button>
          <button
            type="button"
            aria-label="Settings"
            onClick={() => onNotify('Settings are coming soon')}
            className="hidden rounded-lg p-2 transition-colors hover:bg-secondary sm:block"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>
      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => setProfileOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="profile-title" className="w-full max-w-md rounded-xl border border-border bg-card p-5 text-foreground shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <h2 id="profile-title" className="text-lg font-bold">Set your Roblox profile</h2>
              <button type="button" onClick={() => setProfileOpen(false)} aria-label="Close" className="rounded-lg px-2 py-1 text-xl hover:bg-secondary">×</button>
            </div>
            {profile && <div className="mt-4 flex items-center gap-3 rounded-lg border border-border p-3">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-12 rounded-full object-cover" /> : <span className="flex size-12 items-center justify-center rounded-full bg-secondary">👤</span>}
              <div className="min-w-0"><p className="truncate font-semibold">{profile.displayName}</p><p className="truncate text-sm text-muted-foreground">@{profile.name}</p></div>
              <span className="ml-auto text-xs text-muted-foreground">Current profile</span>
            </div>}
            <p className="mt-4 text-sm text-muted-foreground">Enter your Roblox username to find your real avatar and profile name.</p>
            <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); void searchProfile() }}>
              <input value={profileQuery} onChange={(event) => setProfileQuery(event.target.value)} placeholder="Roblox username" aria-label="Roblox username" className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-[#335fff]" />
              <button type="submit" disabled={profileSearching} className="h-10 rounded-lg bg-[#335fff] px-4 text-sm font-semibold text-white disabled:opacity-50">{profileSearching ? 'Searching…' : 'Search'}</button>
            </form>
            {profileMessage && <p role="status" className="mt-3 text-sm text-muted-foreground">{profileMessage}</p>}
            {profileResults.length > 0 && <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
              {profileResults.map((player) => <button key={player.id} type="button" onClick={() => chooseProfile(player)} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-secondary">
                {player.avatarUrl ? <img src={player.avatarUrl} alt="" className="size-11 rounded-full object-cover" /> : <span className="flex size-11 items-center justify-center rounded-full bg-secondary">👤</span>}
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{player.displayName}</span><span className="block truncate text-sm text-muted-foreground">@{player.name}</span></span>
                <span className="text-sm font-semibold text-[#335fff]">Use</span>
              </button>)}
            </div>}
            <p className="mt-4 text-xs text-muted-foreground">This changes the profile shown on this site. It does not sign you in to Roblox.</p>
          </section>
        </div>
      )}
    </header>
  )
}
