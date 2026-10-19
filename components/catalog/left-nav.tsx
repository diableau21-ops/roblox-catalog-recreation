'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
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

export function LeftNav({ onNotify, onBuyRobux }: Props) {
  const [profile, setProfile] = useState<{ id: number; name: string; displayName: string; avatarUrl?: string; hasVerifiedBadge?: boolean } | null>(null)

  useEffect(() => {
    const loadProfile = (event?: Event) => {
      const eventProfile = (event as CustomEvent | undefined)?.detail
      if (eventProfile) {
        setProfile(eventProfile)
        return
      }
      try {
        const saved = window.localStorage.getItem('catalog-demo-profile')
        setProfile(saved ? JSON.parse(saved) : null)
      } catch {}
    }
    loadProfile()
    window.addEventListener('catalog-profile-updated', loadProfile)
    window.addEventListener('storage', loadProfile)
    return () => {
      window.removeEventListener('catalog-profile-updated', loadProfile)
      window.removeEventListener('storage', loadProfile)
    }
  }, [])

  return (
    <>
      <nav
        aria-label="Account"
        className={cn(
          'fixed bottom-0 left-0 top-14 z-40 flex w-[220px] flex-col overflow-y-auto border-r border-border bg-header px-3 py-4',
        )}
      >
        <button
          type="button"
          onClick={() => onNotify('Opening your profile')}
          className="mb-3 flex items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-secondary"
        >
          <span className="relative size-9 overflow-hidden rounded-full bg-thumb">
            {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-9 object-cover" /> : <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/avatar.png`} alt="" fill sizes="36px" className="object-cover" />}
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-1 truncate text-base font-bold"><span className="truncate">{profile?.displayName || 'Builderman'}</span>{profile?.hasVerifiedBadge && <img src="https://cdn3.emoji.gg/emojis/9389-roblox-verified.png" alt="Verified Roblox account" title="Verified Roblox account" className="size-4 shrink-0" />}</span>
        </button>
        <ul className="flex flex-col gap-0.5">
          {links.map(({ label, icon: Icon, badge }) => (
            <li key={label}>
              <a
                href={label === 'Home' ? (process.env.NEXT_PUBLIC_BASE_PATH ?? '') + '/' : '#'}
                onClick={(e) => {
                  if (label !== 'Home') {
                    e.preventDefault()
                    onNotify(`${label} is coming soon`)
                  }
                }}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[15px] font-medium text-foreground/90 transition-colors hover:bg-secondary hover:text-foreground"
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
        <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-3.5">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg"
                alt="Roblox Plus"
                className="size-7 object-contain brightness-0 invert"
              />
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
