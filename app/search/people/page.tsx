'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProfileSiteHeader } from '@/components/catalog/profile-site-header'
import { LeftNav } from '@/components/catalog/left-nav'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { RobuxIcon } from '@/components/catalog/robux-icon'

type Player = {
  id: number
  name: string
  displayName: string
  avatarUrl?: string
  hasVerifiedBadge?: boolean
}

function VerifiedBadge() {
  return <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Roblox_Verification_Badge.svg" alt="Verified" title="Verified" className="inline-block size-4 shrink-0 object-contain" />
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
  const [robuxBalance, setRobuxBalance] = useState(1250)

  useEffect(() => {
    const readBalance = () => {
      try {
        const saved = window.localStorage.getItem('catalog-demo-robux-balance')
        if (saved !== null && Number.isFinite(Number(saved)) && Number(saved) >= 0) setRobuxBalance(Number(saved))
      } catch {}
    }
    readBalance()
    window.addEventListener('storage', readBalance)
    return () => window.removeEventListener('storage', readBalance)
  }, [])

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
                    <button type="button" onClick={() => { setSendRecipient(player); setSendAmount('0'); setSendStage('edit'); setSendMessage(''); setOpenMenu(null) }} className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Send Robux</button>
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
        {sendRecipient && sendStage === "loading" && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-3" onClick={() => setSendRecipient(null)}>
            <section role="status" aria-live="polite" onClick={(event) => event.stopPropagation()} className="flex min-h-[460px] w-full max-w-lg flex-col rounded-2xl border border-[#383838] bg-[#1f1f1f] px-5 py-5 text-white shadow-2xl sm:p-6">
              <div className="flex w-full items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex min-w-0 items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg" alt="" className="size-7 shrink-0 object-contain brightness-0 invert" />
                  <span className="truncate text-xl font-extrabold">Send Robux</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-sm font-bold"><RobuxIcon className="size-5" /><span className="tabular-nums">{robuxBalance.toLocaleString('en-US')}</span></div>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-5 text-center">
              {sendRecipient.avatarUrl ? <img src={sendRecipient.avatarUrl} alt="" className="size-16 rounded-full object-cover opacity-80" /> : <span className="size-16 rounded-full bg-[#3a3b40]" />}
              <span aria-label="Loading" className="mt-6 size-8 animate-spin rounded-full border-[3px] border-white/20 border-t-white" />
              <p className="mt-5 text-lg font-bold">Sending Robux...</p>
              <p className="mt-1 text-sm text-white/60">To @{sendRecipient.name}</p>
              </div>
            </section>
          </div>
        )}
        {sendRecipient && sendStage !== "loading" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3" onClick={() => setSendRecipient(null)}>
            <section role="dialog" aria-modal="true" aria-labelledby="people-send-title" className="relative w-full max-w-lg rounded-2xl border border-[#383838] bg-[#1f1f1f] p-5 text-white shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg" alt="" className="size-7 shrink-0 object-contain brightness-0 invert" />
                  <h2 id="people-send-title" className="truncate text-xl font-extrabold">Send Robux</h2>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-sm font-bold"><RobuxIcon className="size-5" /><span className="tabular-nums">{robuxBalance.toLocaleString('en-US')}</span></div>
              </div>
              {sendStage === "success" ? (
                <div className="flex min-h-[370px] flex-col items-center px-2 pb-1 pt-8 text-center">
                  {sendRecipient.avatarUrl ? <img src={sendRecipient.avatarUrl} alt={`Avatar of ${sendRecipient.name}`} className="size-20 rounded-full object-cover" /> : <span className="size-20 rounded-full bg-[#3a3b40]" />}
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-lg font-bold">{sendRecipient.displayName}{sendRecipient.hasVerifiedBadge && <VerifiedBadge />}</p>
                  <p className="mt-0.5 text-sm text-white/60">@{sendRecipient.name}</p>
                  <p className="mt-5 text-sm font-semibold text-white/65">Robux sent</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Robux_2019_Logo_gold.svg" alt="" className="size-7 object-contain brightness-0 invert" />
                    <p className="text-2xl font-extrabold">{Number(sendAmount).toLocaleString("en-US")}</p>
                  </div>
                  <button type="button" onClick={() => setSendRecipient(null)} className="mt-auto h-12 w-full max-w-[220px] rounded-xl bg-[#146bff] font-extrabold hover:bg-[#2878ff]">OK</button>
                </div>
              ) : (
                <>
                  {sendStage === "edit" ? (
                    <>
                      <div className="flex flex-col items-center px-2 pb-1 pt-7 text-center">
                        {sendRecipient.avatarUrl ? <img src={sendRecipient.avatarUrl} alt="" className="size-[68px] rounded-full object-cover" /> : <span className="size-[68px] rounded-full bg-[#3a3b40]" />}
                        <p className="mt-3 flex items-center justify-center gap-1.5 text-base font-bold">{sendRecipient.displayName}{sendRecipient.hasVerifiedBadge && <VerifiedBadge />}</p>
                        <p className="mt-0.5 text-sm text-white/55">@{sendRecipient.name}</p>
                        <div className="mt-7 flex items-center justify-center gap-2">
                          <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Robux_2019_Logo_gold.svg" alt="" className="size-9 object-contain brightness-0 invert" />
                          <label htmlFor="people-send-amount" className="sr-only">Robux amount</label>
                          <input id="people-send-amount" type="number" min="1" step="1" value={sendAmount} onChange={(event) => { setSendAmount(event.target.value); setSendMessage("") }} className="w-32 bg-transparent text-center text-5xl font-extrabold text-white outline-none" />
                        </div>
                        <div className="mt-8 grid w-full grid-cols-4 gap-2">
                          {[25, 50, 100, 200].map((amount) => (
                            <button key={amount} type="button" onClick={() => setSendAmount(String(amount))} className={`flex h-12 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-bold transition-colors ${Number(sendAmount) === amount ? "bg-[#3a3b44]" : "bg-[#303139] hover:bg-[#3a3b44]"}`}>
                              <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Robux_2019_Logo_gold.svg" alt="" className="size-5 object-contain brightness-0 invert" />{amount}
                            </button>
                          ))}
                        </div>
                        <button type="button" disabled={!Number.isSafeInteger(Number(sendAmount)) || Number(sendAmount) < 1} onClick={() => { setSendMessage(""); setSendStage("confirm") }} className="mt-9 h-11 w-full rounded-lg bg-[#335fff] font-bold text-white transition-colors hover:bg-[#426cff] disabled:cursor-not-allowed disabled:opacity-45">Next</button>
                        <p className="mt-3 text-xs text-white/65">Robux are sent instantly with no fees</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-5 rounded-lg bg-[#292a31] px-4 py-5 text-center">
                        {sendRecipient.avatarUrl ? <img src={sendRecipient.avatarUrl} alt="" className="mx-auto size-[68px] rounded-full object-cover" /> : <span className="mx-auto block size-[68px] rounded-full bg-[#3a3b40]" />}
                        <p className="mt-3 flex items-center justify-center gap-1.5 text-base font-bold">{sendRecipient.displayName}{sendRecipient.hasVerifiedBadge && <VerifiedBadge />}</p>
                        <p className="mt-0.5 text-sm text-white/65">@{sendRecipient.name}</p>
                      </div>
                      <div className="mt-4 rounded-lg bg-[#292a31] px-4 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Robux_2019_Logo_gold.svg" alt="" className="size-9 object-contain brightness-0 invert" />
                          <p className="text-4xl font-extrabold">{Number(sendAmount).toLocaleString("en-US")}</p>
                        </div>
                        <p className="mt-2 text-sm text-white/65">The recipient will get {Number(sendAmount).toLocaleString("en-US")} Robux.</p>
                      </div>
                      <div className="mt-5 flex gap-2">
                        <button type="button" onClick={() => { setSendStage("loading"); window.setTimeout(() => setSendStage("success"), 1600) }} className="h-11 flex-1 rounded-lg bg-[#335fff] font-bold text-white hover:bg-[#426cff]">Send</button>
                        <button type="button" onClick={() => setSendStage("edit")} className="h-11 flex-1 rounded-lg bg-[#303139] font-bold text-white hover:bg-[#3a3b44]">Edit</button>
                      </div>
                      <p className="mt-3 text-center text-xs text-white/65">You need an age check or parental consent to send Robux. Once you send, you cannot cancel.</p>
                    </>
                  )}
                </>
              )}
            </section>
          </div>
        )}
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
