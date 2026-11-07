'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProfileSiteHeader } from '@/components/catalog/profile-site-header'
import { LeftNav } from '@/components/catalog/left-nav'

type Player = {
  id: number
  name: string
  displayName: string
  avatarUrl?: string
  hasVerifiedBadge?: boolean
}

function VerifiedBadge() {
  return <span title="Verified" className="inline-flex size-4 items-center justify-center rounded-full bg-[#335fff] text-[10px] font-black text-white">✓</span>
}

function PeopleSearchContent() {
  const params = useSearchParams()
  const keyword = params.get('keyword')?.trim() ?? ''
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState<number[]>([])

  useEffect(() => {
    let active = true
    const run = async () => {
      setLoading(true)
      setMessage('')
      try {
        const response = await fetch(`/api/roblox-users?keyword=${encodeURIComponent(keyword)}`, { cache: 'no-store' })
        if (!response.ok) throw new Error('Search failed')
        const payload = await response.json()
        if (!active) return
        const data = Array.isArray(payload.data) ? payload.data : []
        setPlayers(data)
        setMessage(data.length ? '' : 'No results found.')
      } catch {
        if (active) setMessage('Could not load people right now. Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    }
    if (keyword.length >= 3) void run()
    else { setPlayers([]); setMessage('Enter at least 3 characters.'); setLoading(false) }
    return () => { active = false }
  }, [keyword])

  return (
    <main className="min-h-screen bg-black text-white">
      <ProfileSiteHeader />
      <LeftNav dark onNotify={(msg) => window.alert(msg)} />
      <div className="ml-0 w-full px-4 pb-24 pt-7 sm:px-8 md:ml-[220px] md:w-[calc(100%-220px)]">
        <div className="mb-6 border-b border-[#292a2e] pb-5">
          <h1 className="text-2xl font-extrabold sm:text-3xl">People Results for {keyword}</h1>
          {!loading && <p className="mt-2 text-sm text-[#a3a5ab]">{players.length} results</p>}
        </div>

        {loading ? (
          <p className="py-10 text-sm text-[#a3a5ab]">Loading people…</p>
        ) : message ? (
          <p className="py-10 text-sm text-[#a3a5ab]">{message}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {players.map((player) => (
              <article key={player.id} className="flex min-h-[270px] flex-col items-center rounded-xl bg-[#191a1f] px-5 py-5 text-center transition-colors hover:bg-[#202127]">
                <a href={`/users/${player.id}/${encodeURIComponent(player.name)}`} className="flex w-full flex-col items-center">
                  {player.avatarUrl
                    ? <img src={player.avatarUrl} alt={`Avatar of ${player.name}`} className="size-28 rounded-full object-cover" />
                    : <div className="size-28 rounded-full bg-[#303136]" />}
                  <span className="mt-3 flex max-w-full items-center justify-center gap-1 truncate text-base font-bold">
                    <span className="truncate">{player.displayName}</span>
                    {player.hasVerifiedBadge && <VerifiedBadge />}
                  </span>
                  <span className="mt-1 max-w-full truncate text-sm text-[#a3a5ab]">@{player.name}</span>
                  <span className="mt-2 text-xs text-[#858891]">Offline</span>
                </a>
                <button
                  type="button"
                  disabled={sent.includes(player.id)}
                  onClick={() => setSent((current) => current.includes(player.id) ? current : [...current, player.id])}
                  className="mt-auto w-full max-w-[220px] rounded-lg bg-[#335fff] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#264de0] disabled:cursor-default disabled:bg-[#343640] disabled:text-[#b8bac2]"
                >
                  {sent.includes(player.id) ? 'Request Sent' : 'Add Friend'}
                </button>
              </article>
            ))}
          </div>
        )}
        <p className="mt-10 text-xs text-[#777b85]">Public profile information from Roblox. This fan-made site is not affiliated with Roblox.</p>
      </div>
    </main>
  )
}


export default function PeopleSearchPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black px-6 py-12 text-white">Loading people…</main>}>
      <PeopleSearchContent />
    </Suspense>
  )
}
