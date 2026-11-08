'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Settings } from 'lucide-react'
import { RobloxLogo, RobloxMark, RobuxIcon } from './robux-icon'

type Props = {
  balance: number
  query: string
  onQueryChange: (q: string) => void
  onBuyRobux: () => void
  onNotify: (msg: string) => void
  onSetBalance?: (balance: number) => void
  onBellClick?: () => void
}

const navLinks = ['Charts', 'Catalog', 'Create', 'Robux'] as const

function VerifiedBadge({ className = 'size-4' }: { className?: string }) {
  return (
    <img
      src="https://cdn3.emoji.gg/emojis/9389-roblox-verified.png"
      alt="Verified Roblox account"
      title="Verified Roblox account"
      className={className}
      draggable={false}
    />
  )
}

export function SiteHeader({ balance, query, onQueryChange, onBuyRobux, onNotify, onSetBalance, onBellClick }: Props) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [robuxPickerOpen, setRobuxPickerOpen] = useState(false)
  const [robuxAmount, setRobuxAmount] = useState(String(balance))
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [siteTheme, setSiteTheme] = useState<'dark' | 'light'>('dark')
  const [siteFont, setSiteFont] = useState('Manrope')
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileQuery, setProfileQuery] = useState('')
  const [profileSearching, setProfileSearching] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileResults, setProfileResults] = useState<{ id: number; name: string; displayName: string; avatarUrl?: string; hasVerifiedBadge?: boolean }[]>([])
  const [profile, setProfile] = useState<{ id: number; name: string; displayName: string; avatarUrl?: string; hasVerifiedBadge?: boolean } | null>(null)

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('catalog-site-theme')
      const savedFont = window.localStorage.getItem('catalog-site-font')
      if (savedTheme === 'light' || savedTheme === 'dark') setSiteTheme(savedTheme)
      if (savedFont) setSiteFont(savedFont)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.dataset.siteTheme = siteTheme
    document.documentElement.style.setProperty('--site-font', siteFont === 'Trebuchet MS' ? "'Trebuchet MS'" : siteFont)
    try {
      window.localStorage.setItem('catalog-site-theme', siteTheme)
      window.localStorage.setItem('catalog-site-font', siteFont)
    } catch {}
  }, [siteTheme, siteFont])

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

  const searchCategories = ['Games', 'People', 'Catalog', 'Communities', 'Creator Store']

  const searchPeople = () => {
    const keyword = query.trim()
    if (keyword.length < 3) return
    setSearchOpen(false)
    router.push(`/search/people?keyword=${encodeURIComponent(keyword)}`)
  }

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
                if (label === 'Robux') {
                  window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/robux`
                } else if (label !== 'Catalog') onNotify(`${label} is coming soon`)
              }}
              aria-current={label === 'Catalog' ? 'page' : undefined}
              className="relative px-2.5 py-[18px] text-sm font-semibold text-foreground/90 transition-colors hover:text-foreground lg:px-3 lg:text-base aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-2.5 aria-[current=page]:after:bottom-0 aria-[current=page]:after:h-[3px] aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-foreground lg:aria-[current=page]:after:inset-x-3"
            >
              {label}
            </a>
          ))}
        </nav>

        <label className="relative mx-auto flex min-w-0 max-w-[600px] flex-1 items-center">
          <span className="sr-only">Search the catalog</span>
          <Search className="pointer-events-none absolute left-2.5 size-[18px] text-[#606162]" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); void searchPeople() } }}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search"
            style={{ backgroundColor: "#2a2b30", color: "#f7f7f8" }}
            className="h-8 w-full rounded-md border border-[#3a3b40] !bg-[#2a2b30] pl-9 pr-3 text-sm text-[#f7f7f8] placeholder:text-[#a3a5ab] transition-colors focus:!bg-[#2a2b30] focus:border-[#55565d] focus:outline-none focus:ring-1 focus:ring-[#55565d] sm:h-9 sm:text-sm"
          />
          {searchOpen && query.trim() && (
            <div className="absolute left-0 right-0 top-full z-[60] mt-1 overflow-hidden rounded-md border border-[#45464d] bg-[#2a2b30] py-1 text-[#f7f7f8] shadow-xl">
              {searchCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (category === 'People') { void searchPeople(); return }
                    onQueryChange(query.trim())
                    setSearchOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-[#3a3b42]"
                >
                  <Search className="size-4 shrink-0 text-[#a3a5ab]" />
                  <span className="min-w-0 truncate">
                    <span className="font-semibold text-white">{query.trim()} </span><span className="text-[#a3a5ab]">in </span><span className="text-white">{category}</span>
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
            <span className="flex items-center gap-1 text-sm font-bold">{profile?.displayName || 'Builderman'}{profile?.hasVerifiedBadge && <VerifiedBadge className="size-4 shrink-0" />}</span>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => { setAppearanceOpen((open) => !open); setSettingsOpen(false) }}
            className="relative rounded-lg p-2 hover:bg-secondary"
          >
            <Bell className="size-5" />
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-favorite text-[10px] font-bold text-white">2</span>
          </button>
          {appearanceOpen && (
            <div className="absolute right-0 top-full z-[120] mt-2 w-72 rounded-xl border border-[#38393e] bg-[#242529] p-4 text-white shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold">Appearance</h2>
                <button type="button" aria-label="Close appearance" onClick={() => setAppearanceOpen(false)} className="rounded-md px-2 py-1 text-lg text-white/70 hover:bg-white/10">×</button>
              </div>
              <p className="mb-2 text-xs font-semibold text-white/60">Site color</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" aria-pressed={siteTheme === 'dark'} onClick={() => setSiteTheme('dark')} className={`rounded-lg border px-3 py-2.5 text-sm font-semibold ${siteTheme === 'dark' ? 'border-blue-400 bg-[#343944]' : 'border-white/10 bg-[#1b1c20]'}`}>Black</button>
                <button type="button" aria-pressed={siteTheme === 'light'} onClick={() => setSiteTheme('light')} className={`rounded-lg border px-3 py-2.5 text-sm font-semibold ${siteTheme === 'light' ? 'border-blue-400 bg-white text-black' : 'border-white/10 bg-[#1b1c20]'}`}>White</button>
              </div>
              <label htmlFor="site-font-choice-main" className="mb-2 mt-4 block text-xs font-semibold text-white/60">Font</label>
              <select id="site-font-choice-main" value={siteFont} onChange={(event) => setSiteFont(event.target.value)} className="h-10 w-full rounded-lg border border-white/15 bg-[#1b1c20] px-3 text-sm text-white outline-none focus:border-blue-400">
                <option value="Manrope">Manrope</option><option value="Arial">Arial</option><option value="Verdana">Verdana</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Georgia">Georgia</option>
              </select>
              <p className="mt-3 text-[11px] text-white/50">Your choices are saved on this device.</p>
            </div>
          )}
          {robuxPickerOpen && onSetBalance && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4" onClick={() => setRobuxPickerOpen(false)}>
              <section role="dialog" aria-modal="true" aria-labelledby="robux-picker-title" className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between gap-3">
                  <h2 id="robux-picker-title" className="text-xl font-extrabold">Choose your Robux balance</h2>
                  <button type="button" onClick={() => setRobuxPickerOpen(false)} aria-label="Close" className="rounded-lg px-2 py-1 text-xl hover:bg-secondary">×</button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Choose 9,000 Robux or more.</p>
                <label htmlFor="custom-robux-balance" className="mt-4 block text-sm font-semibold">Robux amount</label>
                <input id="custom-robux-balance" type="number" min="9000" step="1" value={robuxAmount} onChange={(event) => setRobuxAmount(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground outline-none focus:border-[#7183ff]" />
                <button type="button" disabled={!Number.isSafeInteger(Number(robuxAmount)) || Number(robuxAmount) < 9000} onClick={() => { onSetBalance(Number(robuxAmount)); setRobuxPickerOpen(false) }} className="mt-4 h-11 w-full rounded-lg bg-[#335fff] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50">Set balance</button>
              </section>
            </div>
          )}
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
            onClick={() => setSettingsOpen((open) => !open)}
            className="hidden rounded-lg p-2 transition-colors hover:bg-secondary sm:block"
          >
            <Settings className="size-5" />
          </button>
          {settingsOpen && (
            <div className="absolute right-4 top-12 z-[70] w-56 overflow-hidden rounded-lg border border-border bg-card py-1 text-foreground shadow-xl sm:right-5 lg:right-6">
              {['Settings', 'Quick Sign In', 'Help and Safety', 'Switch Accounts', 'Logout'].map((label) => (
                <button key={label} type="button" onClick={() => {
                  setSettingsOpen(false)
                  if (label === 'Logout') {
                    setProfile(null)
                    try { window.localStorage.removeItem('catalog-demo-profile') } catch {}
                    window.dispatchEvent(new CustomEvent('catalog-profile-updated', { detail: null }))
                    router.push('/login')
                  }
                }} className="flex w-full items-center px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  {label}
                </button>
              ))}
            </div>
          )}
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
              <div className="min-w-0"><p className="flex items-center gap-1 truncate font-semibold">{profile.displayName}{profile.hasVerifiedBadge && <VerifiedBadge className="size-4 shrink-0" />}</p><p className="truncate text-sm text-muted-foreground">@{profile.name}</p></div>
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
                <span className="min-w-0 flex-1"><span className="flex items-center gap-1 truncate font-semibold">{player.displayName}{player.hasVerifiedBadge && <VerifiedBadge className="size-4 shrink-0" />}</span><span className="block truncate text-sm text-muted-foreground">@{player.name}</span></span>
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
