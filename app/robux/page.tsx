'use client'

import { useEffect, useState } from 'react'
import { RobuxIcon } from '@/components/catalog/robux-icon'
import { SiteHeader } from '@/components/catalog/site-header'
import { LeftNav } from '@/components/catalog/left-nav'

const packages = [
  { amount: '24,000', previous: '22,500', bonus: '+1,500 more', price: '279.99 $' },
  { amount: '11,000', previous: '10,000', bonus: '+1,000 more', price: '139.99 $' },
  { amount: '5,250', previous: '4,500', bonus: '+750 more', price: '69.99 $' },
  { amount: '3,625', previous: '3,150', bonus: '+475 more', price: '49.99 $', featured: true },
]

export default function RobuxPage() {
  const [balance, setBalance] = useState(1250)
  const [balanceReady, setBalanceReady] = useState(false)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const savedBalance = window.localStorage.getItem('catalog-demo-robux-balance')
      if (savedBalance !== null) {
        const parsed = Number(savedBalance)
        if (Number.isFinite(parsed) && parsed >= 0) {
          // Repair balances saved by the earlier string-concatenation bug.
          const priorPackageAmounts = [24000, 11000, 5250, 3625]
          const corruptedSuffix = priorPackageAmounts.find((amount) => savedBalance === `1250${amount}`)
          setBalance(corruptedSuffix ? 1250 + corruptedSuffix : parsed)
        }
      }
      setQuery(new URLSearchParams(window.location.search).get('q') ?? '')
    } catch {}
    setBalanceReady(true)
  }, [])

  useEffect(() => {
    if (!balanceReady) return
    try { window.localStorage.setItem('catalog-demo-robux-balance', String(balance)) } catch {}
  }, [balance, balanceReady])

  const notify = (text: string) => setMessage(text)
  const openPackages = () => document.getElementById('robux-packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const [sendOpen, setSendOpen] = useState(false)
  const [sendUsername, setSendUsername] = useState('')
  const [sendPlayers, setSendPlayers] = useState<{id:number;name:string;displayName:string;avatarUrl?:string|null;hasVerifiedBadge?:boolean}[]>([])
  const [sendPlayer, setSendPlayer] = useState<{id:number;name:string;displayName:string;avatarUrl?:string|null;hasVerifiedBadge?:boolean}|null>(null)
  const [sendSearching, setSendSearching] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendAmount, setSendAmount] = useState('100')
  const [sendSuccess, setSendSuccess] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<(typeof packages)[number] | null>(null)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  const searchPlayers = async () => {
    const keyword = sendUsername.trim()
    if (keyword.length < 3) {
      setSendError('Enter at least 3 characters.')
      return
    }
    setSendSearching(true)
    setSendError('')
    setSendPlayers([])
    setSendPlayer(null)
    try {
      const response = await fetch(`/api/roblox-users?keyword=${encodeURIComponent(keyword)}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Search failed')
      const payload = await response.json()
      const players = Array.isArray(payload.data) ? payload.data
        .filter((p: {id?:number;name?:string}) => Number.isFinite(p.id) && typeof p.name === 'string')
        .map((p: {id:number;name:string;displayName?:string;avatarUrl?:string|null;hasVerifiedBadge?:boolean}) => ({
          id:p.id, name:p.name, displayName:p.displayName || p.name,
          avatarUrl:p.avatarUrl || null, hasVerifiedBadge:p.hasVerifiedBadge === true
        })) : []
      setSendPlayers(players)
      if (!players.length) setSendError(`No Roblox players found for “${keyword}”.`)
    } catch {
      setSendError('Could not load players. Please try again.')
    } finally {
      setSendSearching(false)
    }
  }

  return (
    <main className="min-h-dvh bg-[#0B0B0D] text-[#F7F6F2]">
      <SiteHeader balance={balance} query={query} onQueryChange={setQuery} onBuyRobux={openPackages} onNotify={notify} onSetBalance={setBalance} />
      <LeftNav onNotify={notify} onBuyRobux={openPackages} />
      <div className="ml-0 px-4 pb-12 pt-5 sm:px-6 sm:pt-7 md:ml-[220px] md:px-6">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-end gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-[#29292E] px-3 py-2.5 text-sm font-extrabold" aria-label={`${balance.toLocaleString('en-US')} Robux balance`}>
          <RobuxIcon className="size-5" />
          <span className="tabular-nums">{balance.toLocaleString('en-US')}</span>
        </div>
        <button
          type="button"
          onClick={() => { setSendOpen(true); setSendSuccess(false); setSendError(''); setSendPlayer(null); setSendPlayers([]) }}
          className="rounded-lg bg-[#29292E] px-5 py-2.5 text-sm font-extrabold transition-colors hover:bg-[#38383F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Send
        </button>
      </header>

      <section id="robux-packages" className="mx-auto mt-12 w-full max-w-3xl scroll-mt-20 sm:mt-16">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Enjoy up to 25% more Robux
        </h1>
        <h2 className="mt-8 text-xl font-extrabold tracking-tight sm:mt-10 sm:text-2xl">
          Robux packages
        </h2>

        <ul className="mt-4 space-y-3">
          {packages.map((pack) => (
            <li
              key={pack.amount}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-[#202024] px-3 py-4 sm:gap-5 sm:px-5 sm:py-5"
            >
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <RobuxIcon className="size-6 sm:size-7" />
                  <span className="whitespace-nowrap text-lg font-extrabold tabular-nums sm:text-2xl">
                    {pack.amount}
                  </span>
                  {pack.featured && (
                    <span className="shrink-0 rounded-md bg-[#34343B] px-2 py-1 text-[10px] font-extrabold sm:text-xs">
                      For you
                    </span>
                  )}
                </div>
                <div className="ml-[34px] mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:ml-10">
                  <span className="text-sm font-semibold text-[#A8A8B0] line-through sm:text-base">
                    {pack.previous}
                  </span>
                  <span className="whitespace-nowrap rounded-md bg-[#35353B] px-2 py-1 text-xs font-extrabold text-[#F7F6F2] sm:text-sm">
                    {pack.bonus}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setSelectedPackage(pack); setPaying(false); setPaid(false) }}
                className={`min-w-[104px] rounded-lg px-3 py-3 text-sm font-extrabold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-w-[132px] sm:px-5 sm:text-base ${pack.featured ? 'bg-[#335FFF] text-white hover:bg-[#244BE0]' : 'bg-[#34343A] text-white hover:bg-[#45454D]'}`}
              >
                {pack.price}
              </button>
            </li>
          ))}
        </ul>

        {message && (
          <p role="status" className="mt-4 rounded-lg border border-[#34343A] bg-[#202024] px-4 py-3 text-sm text-[#D7D7DC]">
            {message}
          </p>
        )}
        {selectedPackage && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/80 p-3" onClick={() => !paying && setSelectedPackage(null)}>
            <section role="dialog" aria-modal="true" aria-labelledby="payment-title" className="my-auto w-full max-w-md rounded-2xl border border-[#41414b] bg-[#17171c] p-5 text-[#f7f6f2] shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-[#a7a7b3]">Checkout</p><h2 id="payment-title" className="mt-1 text-2xl font-extrabold">{paid ? 'Payment complete!' : 'Complete your purchase'}</h2></div>{!paying && <button type="button" onClick={() => setSelectedPackage(null)} aria-label="Close" className="rounded-lg px-3 py-1 text-2xl text-white/70 hover:bg-white/10">×</button>}</div>
              {paid ? (
                <div className="py-8 text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-4xl font-black text-emerald-400">✓</div><h3 className="mt-4 text-xl font-extrabold">Checkout complete</h3><p className="mt-2 text-sm text-white/65">{selectedPackage.amount} Robux · {selectedPackage.price}</p><button type="button" onClick={() => setSelectedPackage(null)} className="mt-6 h-11 w-full rounded-lg bg-[#335fff] font-extrabold hover:bg-[#244be0]">Done</button></div>
              ) : paying ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center"><div className="size-12 animate-spin rounded-full border-4 border-white/15 border-t-[#7183ff]" /><h3 className="mt-5 text-lg font-extrabold">Processing your order…</h3><p className="mt-2 text-sm text-white/60">Please wait…</p></div>
              ) : (
                <>
                  <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#24242c] p-4"><div className="flex items-center gap-3"><RobuxIcon className="size-8" /><div><p className="font-extrabold">{selectedPackage.amount} Robux</p><p className="text-xs text-white/55">Robux package</p></div></div><p className="text-lg font-extrabold">{selectedPackage.price}</p></div>
                  <div className="mt-5 rounded-xl border border-[#454550] bg-gradient-to-br from-[#333b71] via-[#20243f] to-[#15151b] p-4"><div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/70"><span>Bank card preview</span><span>PREVIEW</span></div><div className="mt-6 text-lg font-semibold tracking-[0.15em]">••••  ••••  ••••  4242</div><div className="mt-5 flex items-end justify-between gap-3 text-xs text-white/70"><div><p className="text-[9px] uppercase tracking-widest text-white/45">Cardholder</p><p className="mt-1 font-semibold">YOUR NAME</p></div><div><p className="text-[9px] uppercase tracking-widest text-white/45">Expires</p><p className="mt-1 font-semibold">MM/YY</p></div><span className="text-lg font-black italic">CARD</span></div></div>
                  <p className="mt-4 text-center text-xs text-white/45">Purchases are currently unavailable.</p>
                  <button type="button" onClick={() => { setPaying(true); window.setTimeout(() => { setBalance((current) => current + Number(selectedPackage.amount)); setPaying(false); setPaid(true) }, 1800) }} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#335fff] font-extrabold hover:bg-[#244be0]">Simulate payment · {selectedPackage.price}</button>
                  <p className="mt-3 text-center text-[11px] text-white/40">Checkout preview</p>
                </>
              )}
            </section>
          </div>
        )}

        {sendOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3" onClick={() => setSendOpen(false)}>
            <section role="dialog" aria-modal="true" aria-labelledby="send-robux-title" className="relative w-full max-w-sm overflow-hidden rounded-xl border border-[#626bff]/60 bg-[#101322] p-5 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" style={{backgroundImage:'radial-gradient(1.5px 1.5px at 15% 20%, white 60%, transparent), radial-gradient(1px 1px at 78% 26%, #a5d8ff 60%, transparent), radial-gradient(1.5px 1.5px at 64% 75%, #d8b4fe 60%, transparent)'}} />
              <div className="relative z-10">
                {sendSuccess ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-3xl font-black">✓</div>
                    <h2 id="send-robux-title" className="mt-4 text-xl font-extrabold">Robux sent successfully!</h2>
                    <p className="mt-2 text-sm text-white/75">{sendAmount} Robux sent to {sendPlayer?.displayName} (@{sendPlayer?.name}).</p>
                    
                    <button type="button" onClick={() => setSendOpen(false)} className="mt-6 h-10 rounded-lg bg-[#335fff] px-7 text-sm font-bold">Done</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <h2 id="send-robux-title" className="text-xl font-extrabold">Send Robux</h2>
                      <button type="button" onClick={() => setSendOpen(false)} aria-label="Close" className="rounded-lg px-2 py-1 text-xl text-white/75 hover:bg-white/10">×</button>
                    </div>
                    {sendPlayer ? (
                      <div className="mt-5">
                        <div className="flex items-center gap-3 rounded-lg border border-white/15 p-3">
                          {sendPlayer.avatarUrl ? <img src={sendPlayer.avatarUrl} alt="" className="size-12 rounded-full object-cover" /> : <span className="flex size-12 items-center justify-center rounded-full bg-white/10">👤</span>}
                          <div className="min-w-0"><p className="truncate font-bold">{sendPlayer.displayName}</p><p className="truncate text-sm text-white/65">@{sendPlayer.name}</p></div>
                        </div>
                        <label htmlFor="send-robux-amount" className="mt-4 block text-sm font-semibold">Robux amount</label>
                        <input id="send-robux-amount" type="number" min="1" step="1" inputMode="numeric" value={sendAmount} onChange={(event) => setSendAmount(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-white outline-none focus:border-[#7183ff]" />
                        <button type="button" disabled={!Number.isSafeInteger(Number(sendAmount)) || Number(sendAmount) < 1} onClick={() => setSendSuccess(true)} className="mt-4 h-11 w-full rounded-lg bg-[#335fff] text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-50">Send Robux</button>
                        <button type="button" onClick={() => { setSendPlayer(null); setSendError('') }} className="mt-3 w-full text-xs text-white/65 underline">Choose another player</button>
                      </div>
                    ) : (
                      <>
                        <p className="mt-2 text-sm text-white/70">Search for the Roblox player you want to send Robux to.</p>
                        <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); void searchPlayers() }}>
                          <input value={sendUsername} onChange={(event) => { setSendUsername(event.target.value); setSendError(''); setSendPlayers([]) }} placeholder="Roblox username" aria-label="Roblox player username" className="h-11 min-w-0 flex-1 rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-white outline-none focus:border-[#7183ff]" />
                          <button type="submit" disabled={sendSearching || sendUsername.trim().length < 3} className="h-11 rounded-lg bg-[#335fff] px-4 text-sm font-bold disabled:opacity-50">{sendSearching ? 'Searching…' : 'Search'}</button>
                        </form>
                        {sendError && <p role="status" className="mt-3 text-sm text-white/70">{sendError}</p>}
                        {sendPlayers.length > 0 && <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
                          {sendPlayers.map((player) => <button key={player.id} type="button" onClick={() => setSendPlayer(player)} className="flex w-full items-center gap-3 rounded-lg border border-white/15 p-3 text-left hover:border-[#7183ff] hover:bg-white/5">
                            {player.avatarUrl ? <img src={player.avatarUrl} alt="" className="size-11 rounded-full object-cover" /> : <span className="flex size-11 items-center justify-center rounded-full bg-white/10">👤</span>}
                            <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{player.displayName}</span><span className="block truncate text-sm text-white/60">@{player.name}</span></span>
                            <span className="text-sm font-bold text-[#9eafff]">Select</span>
                          </button>)}
                        </div>}
                      </>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        )}
      </section>
      </div>
    </main>
  )
}
