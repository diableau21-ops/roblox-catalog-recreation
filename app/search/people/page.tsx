'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProfileSiteHeader } from '@/components/catalog/profile-site-header'
import { LeftNav } from '@/components/catalog/left-nav'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'

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
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [sendRecipient, setSendRecipient] = useState<Player | null>(null)
  const [sendAmount, setSendAmount] = useState('100')
  const [sendStage, setSendStage] = useState<'edit' | 'confirm' | 'loading' | 'success'>('edit')
  const [sendMessage, setSendMessage] = useState('')

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
              <article key={player.id} className="relative flex min-h-[270px] flex-col items-center rounded-xl bg-[#191a1f] px-5 py-5 text-center transition-colors hover:bg-[#202127]">
                <button type="button" aria-label={`More actions for ${player.name}`} aria-expanded={openMenu === player.id} onClick={() => setOpenMenu((current) => current === player.id ? null : player.id)} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-white hover:bg-[#34353b]">
                  <MoreHorizontal className="size-6" />
                </button>
                {openMenu === player.id && (
                  <div className="absolute right-3 top-12 z-30 w-44 overflow-hidden rounded-md border border-[#38393e] bg-[#242529] py-1 text-left shadow-xl">
                    <button type="button" onClick={() => { setSendRecipient(player); setSendAmount('100'); setSendStage('edit'); setSendMessage(''); setOpenMenu(null) }} className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Send Robux</button>
                    <button type="button" onClick={() => setOpenMenu(null)} className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Follow</button>
                    <button type="button" onClick={() => setOpenMenu(null)} className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Inventory</button>
                    <button type="button" onClick={() => setOpenMenu(null)} className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Favorites</button>
                    <button type="button" onClick={() => setOpenMenu(null)} className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Block User</button>
                    <button type="button" onClick={() => setOpenMenu(null)} className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Report Abuse</button>
                  </div>
                )}
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
                  className="mt-auto w-full max-w-[220px] rounded-lg bg-[#242529] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#303136] active:bg-[#1b1c20] disabled:cursor-default disabled:bg-[#1c1d21] disabled:text-[#858891]"
                >
                  {sent.includes(player.id) ? 'Request Sent' : 'Add Friend'}
                </button>
              </article>
            ))}
          </div>
        )}
        {sendRecipient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3" onClick={() => setSendRecipient(null)}>
            <section role="dialog" aria-modal="true" aria-labelledby="people-send-title" className="relative w-full max-w-lg rounded-2xl border border-[#383838] bg-[#1f1f1f] p-5 text-white shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}>
              {sendStage === "loading" ? (
                <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                  <span className="size-14 animate-spin rounded-full border-4 border-white/15 border-t-white" />
                  <p className="mt-6 text-xl font-extrabold">Sending...</p>
                  <p className="mt-2 text-sm text-white/60">Please wait</p>
                </div>
              ) : sendStage === "success" ? (
                <div className="flex min-h-[370px] flex-col items-center px-2 pb-1 pt-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full border-2 border-white bg-transparent text-4xl font-black leading-none text-white">✓</div>
                  <p className="mt-7 text-2xl font-extrabold">{Number(sendAmount).toLocaleString("en-US")} Robux</p>
                  <p className="mt-3 text-lg font-semibold">to {sendRecipient.name}</p>
                  <button type="button" onClick={() => setSendRecipient(null)} className="mt-auto h-12 w-full max-w-[220px] rounded-xl bg-[#146bff] font-extrabold hover:bg-[#2878ff]">OK</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg" alt="Roblox Plus" className="size-7 shrink-0 object-contain brightness-0 invert" /><h2 id="people-send-title" className="text-2xl font-extrabold">Send Robux</h2></div>
                    <button type="button" onClick={() => setSendRecipient(null)} aria-label="Close" className="rounded-lg px-2 py-1 text-xl text-white/75 hover:bg-white/10">×</button>
                  </div>
                  <div className="mt-6 flex flex-col items-center text-center">
                    {sendRecipient.avatarUrl ? <img src={sendRecipient.avatarUrl} alt="" className="size-24 rounded-full object-cover" /> : <span className="size-24 rounded-full bg-[#303136]" /> }
                    <p className="mt-3 text-xl font-bold">{sendRecipient.displayName}</p>
                    <p className="text-sm text-white/60">@{sendRecipient.name}</p>
                  </div>
                  {sendStage === "edit" ? (
                    <>
                      <label htmlFor="people-send-amount" className="mt-6 block text-sm font-semibold text-white/75">Robux amount</label>
                      <input id="people-send-amount" type="number" min="1" step="1" value={sendAmount} onChange={(event) => { setSendAmount(event.target.value); setSendMessage("") }} className="mt-2 h-12 w-full rounded-lg border border-white/20 bg-[#292929] px-4 text-white outline-none focus:border-[#146bff]" />
                      <button type="button" disabled={!Number.isSafeInteger(Number(sendAmount)) || Number(sendAmount) < 1} onClick={() => { setSendMessage(""); setSendStage("confirm") }} className="mt-5 h-12 w-full rounded-xl bg-[#146bff] font-extrabold disabled:opacity-50">Next</button>
                    </>
                  ) : (
                    <div className="mt-5 flex gap-3">
                      <button type="button" onClick={() => { setSendStage("loading"); window.setTimeout(() => setSendStage("success"), 1600) }} className="h-12 flex-1 rounded-xl bg-[#146bff] font-extrabold">Send</button>
                      <button type="button" onClick={() => setSendStage("edit")} className="h-12 flex-1 rounded-xl border border-white/20 font-bold hover:bg-white/5">Back</button>
                    </div>
                  )}
                </>
              )}
            </section>
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
