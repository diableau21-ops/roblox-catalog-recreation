'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Search, Bell, Settings } from 'lucide-react'
import { RobloxLogo, RobloxMark, RobuxIcon } from '@/components/catalog/robux-icon'

type SavedProfile = { name?: string; displayName?: string; avatarUrl?: string }

export function ProfileSiteHeader() {
  const [balance, setBalance] = useState(1250)
  const [profile, setProfile] = useState<SavedProfile | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    try {
      const storedBalance = window.localStorage.getItem('catalog-demo-robux-balance')
      if (storedBalance && Number.isFinite(Number(storedBalance))) setBalance(Number(storedBalance))
      const storedProfile = window.localStorage.getItem('catalog-demo-profile')
      if (storedProfile) setProfile(JSON.parse(storedProfile))
    } catch {}
    const updateBalance = () => {
      const value = window.localStorage.getItem('catalog-demo-robux-balance')
      if (value && Number.isFinite(Number(value))) setBalance(Number(value))
    }
    window.addEventListener('storage', updateBalance)
    return () => window.removeEventListener('storage', updateBalance)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[#292a2e] bg-black text-white">
      <div className="flex h-14 w-full items-center gap-3 px-3 sm:gap-4 sm:px-5 lg:px-6">
        <Link href="/" aria-label="Roblox home" className="flex shrink-0 items-center text-white">
          <RobloxLogo className="hidden md:inline-flex" />
          <RobloxMark className="md:hidden" />
        </Link>
        <nav aria-label="Main" className="hidden shrink-0 items-center gap-0.5 md:flex">
          <Link href="/" className="px-2.5 py-[18px] text-sm font-semibold text-white/90 hover:text-white lg:px-3 lg:text-base">Charts</Link>
          <Link href="/" className="px-2.5 py-[18px] text-sm font-semibold text-white lg:px-3 lg:text-base">Marketplace</Link>
          <Link href="/" className="px-2.5 py-[18px] text-sm font-semibold text-white/90 hover:text-white lg:px-3 lg:text-base">Create</Link>
          <Link href="/robux" className="px-2.5 py-[18px] text-sm font-semibold text-white/90 hover:text-white lg:px-3 lg:text-base">Robux</Link>
        </nav>
        <form className="relative mx-auto flex min-w-0 max-w-[600px] flex-1 items-center" onSubmit={(event) => { event.preventDefault(); window.location.href = '/?search=' + encodeURIComponent(query) }}>
          <Search className="pointer-events-none absolute left-2.5 size-[18px] text-[#a3a5ab]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search" className="h-8 w-full rounded-md border border-[#3a3b40] bg-[#2a2b30] pl-9 pr-3 text-sm text-white placeholder:text-[#a3a5ab] outline-none focus:border-[#66676d] sm:h-9" />
        </form>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-2 xl:flex">
            {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-8 rounded-full object-cover" /> : <span className="size-8 rounded-full bg-[#303136]" />}
            <span className="max-w-28 truncate text-sm font-bold">{profile?.displayName || 'Builderman'}</span>
          </div>
          <button type="button" aria-label="Notifications" className="rounded-lg p-2 hover:bg-[#242529]"><Bell className="size-5" /></button>
          <Link href="/robux" className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold hover:bg-[#242529] sm:text-base" aria-label={balance.toLocaleString() + ' Robux'}>
            <RobuxIcon className="size-6" />
            <span className="tabular-nums">{balance.toLocaleString('en-US')}</span>
          </Link>
          <button type="button" aria-label="Settings" className="hidden rounded-lg p-2 hover:bg-[#242529] sm:block"><Settings className="size-5" /></button>
        </div>
      </div>
    </header>
  )
}
