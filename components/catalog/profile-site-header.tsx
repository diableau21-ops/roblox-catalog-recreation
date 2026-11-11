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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [siteTheme, setSiteTheme] = useState<'dark' | 'light'>('dark')
  const [siteFont, setSiteFont] = useState('Manrope')

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
    window.addEventListener('catalog-demo-balance-change', updateBalance)
    return () => {
      window.removeEventListener('storage', updateBalance)
      window.removeEventListener('catalog-demo-balance-change', updateBalance)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[#292a2e] bg-black text-white">
      <div className="flex h-14 w-full items-center gap-3 px-3 sm:gap-4 sm:px-5 lg:px-6">
        <Link href="/" aria-label="Accueil Roblox" className="flex shrink-0 items-center text-white">
          <RobloxLogo className="hidden md:inline-flex" />
          <RobloxMark className="md:hidden" />
        </Link>
        <nav aria-label="Navigation principale" className="hidden shrink-0 items-center gap-0.5 md:flex">
          <Link href="/" className="px-2.5 py-[18px] text-sm font-semibold text-white/90 hover:text-white lg:px-3 lg:text-base">Classements</Link>
          <Link href="/" className="px-2.5 py-[18px] text-sm font-semibold text-white lg:px-3 lg:text-base">Catalogue</Link>
          <Link href="/" className="px-2.5 py-[18px] text-sm font-semibold text-white/90 hover:text-white lg:px-3 lg:text-base">Créer</Link>
          <Link href="/robux" className="px-2.5 py-[18px] text-sm font-semibold text-white/90 hover:text-white lg:px-3 lg:text-base">Robux</Link>
        </nav>
        <form className="relative mx-auto flex min-w-0 max-w-[600px] flex-1 items-center" onSubmit={(event) => { event.preventDefault(); window.location.href = '/search/people?keyword=' + encodeURIComponent(query) }}>
          <Search className="pointer-events-none absolute left-2.5 size-[18px] text-[#a3a5ab]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher" aria-label="Rechercher" className="h-8 w-full rounded-md border border-[#3a3b40] bg-[#2a2b30] pl-9 pr-3 text-sm text-white placeholder:text-[#a3a5ab] outline-none focus:border-[#66676d] sm:h-9" />
        </form>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-2 xl:flex">
            {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-8 rounded-full object-cover" /> : <span className="size-8 rounded-full bg-[#303136]" />}
            <span className="max-w-28 truncate text-sm font-bold">{profile?.displayName || 'Builderman'}</span>
          </div>
          <div className="relative">
            <button type="button" aria-label="Apparence" aria-expanded={appearanceOpen} onClick={() => { setAppearanceOpen(true); setSettingsOpen(false) }} className="relative z-[100] rounded-lg p-2 hover:bg-[#242529]" title="Ouvrir les paramètres d’apparence"><Bell className="size-5" /></button>
            {appearanceOpen && (
              <div className="absolute right-0 top-full z-[110] mt-2 w-72 rounded-xl border border-[#38393e] bg-[#242529] p-4 text-white shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold">Apparence</h2>
                  <button type="button" aria-label="Close appearance" onClick={() => setAppearanceOpen(false)} className="rounded-md px-2 py-1 text-lg text-white/70 hover:bg-white/10">×</button>
                </div>
                <p className="mb-2 text-xs font-semibold text-white/60">Couleur du site</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" aria-pressed={siteTheme === 'dark'} onClick={() => setSiteTheme('dark')} className={`rounded-lg border px-3 py-2.5 text-sm font-semibold ${siteTheme === 'dark' ? 'border-blue-400 bg-[#343944]' : 'border-white/10 bg-[#1b1c20]'}`}>Noir</button>
                  <button type="button" aria-pressed={siteTheme === 'light'} onClick={() => setSiteTheme('light')} className={`rounded-lg border px-3 py-2.5 text-sm font-semibold ${siteTheme === 'light' ? 'border-blue-400 bg-white text-black' : 'border-white/10 bg-[#1b1c20]'}`}>Blanc</button>
                </div>
                <label htmlFor="site-font-choice" className="mb-2 mt-4 block text-xs font-semibold text-white/60">Police</label>
                <select id="site-font-choice" value={siteFont} onChange={(event) => setSiteFont(event.target.value)} className="h-10 w-full rounded-lg border border-white/15 bg-[#1b1c20] px-3 text-sm text-white outline-none focus:border-blue-400">
                  <option value="Manrope">Manrope</option>
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Georgia">Georgia</option>
                </select>
                <p className="mt-3 text-[11px] text-white/50">Tes choix sont enregistrés sur cet appareil.</p>
              </div>
            )}
          </div>
          <Link href="/robux" className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold hover:bg-[#242529] sm:text-base" aria-label={balance.toLocaleString() + ' Robux'}>
            <RobuxIcon className="size-6" />
            <span className="tabular-nums">{balance.toLocaleString('en-US')}</span>
          </Link>
          <div className="relative">
            <button type="button" aria-label="Paramètres" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((open) => !open)} className="rounded-lg p-2 hover:bg-[#242529]"><Settings className="size-5" /></button>
            {settingsOpen && (
              <div className="absolute right-0 top-full z-[80] mt-1 w-56 overflow-hidden rounded-lg border border-[#38393e] bg-[#242529] py-1 text-white shadow-xl">
                {['Settings', 'Quick Sign In', 'Help and Safety', 'Switch Accounts', 'Logout'].map((label) => (
                  <button key={label} type="button" onClick={() => {
                    setSettingsOpen(false)
                    if (label === 'Logout') {
                      setProfile(null)
                      try { window.localStorage.removeItem('catalog-demo-profile') } catch {}
                      window.dispatchEvent(new CustomEvent('catalog-profile-updated', { detail: null }))
                      window.location.href = '/login'
                    }
                  }} className="flex w-full items-center px-4 py-3 text-left text-sm font-medium hover:bg-[#35363c]">{label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
