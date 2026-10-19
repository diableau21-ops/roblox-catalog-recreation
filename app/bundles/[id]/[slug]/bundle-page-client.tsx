"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ShoppingCart, Info, Check } from 'lucide-react'
import { catalogItems } from '@/lib/catalog-data'
import { VerifiedBadge } from '@/components/catalog/verified-badge'
import { Price, RobuxIcon } from '@/components/catalog/robux-icon'
import { Korblox3D } from '@/components/catalog/korblox-3d'
import { SiteHeader } from '@/components/catalog/site-header'
import { LeftNav } from '@/components/catalog/left-nav'

const robuxOptions = [400, 800, 1700, 4500, 10000, 22500]

export default function BundlePageClient({ id, slug }: { id: string; slug: string }) {
  const [query, setQuery] = useState('')
  const [robloxThumbnail, setRobloxThumbnail] = useState<string | null>(null)
  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get('q') ?? '')
  }, [])
  const [balance, setBalance] = useState(1250)
  const [balanceReady, setBalanceReady] = useState(false)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('catalog-demo-robux-balance')
      if (saved !== null) {
        const parsed = Number(saved)
        if (Number.isFinite(parsed) && parsed >= 0) setBalance(parsed)
      }
    } catch {}
    setBalanceReady(true)
  }, [])
  useEffect(() => {
    if (!balanceReady) return
    try {
      window.localStorage.setItem('catalog-demo-robux-balance', String(balance))
    } catch {}
  }, [balance, balanceReady])
  const [giftOpen, setGiftOpen] = useState(false)
  const [giftUsername, setGiftUsername] = useState('')
  const [giftPlayers, setGiftPlayers] = useState<{id: number; name: string; displayName: string; avatarUrl: string | null; hasVerifiedBadge: boolean}[]>([])
  const [giftSearching, setGiftSearching] = useState(false)
  const [giftSearchMessage, setGiftSearchMessage] = useState('')
  const [giftSelectedPlayer, setGiftSelectedPlayer] = useState<{id: number; name: string; displayName: string; avatarUrl: string | null; hasVerifiedBadge: boolean} | null>(null)
  const [giftMessage, setGiftMessage] = useState('')
  const [giftSending, setGiftSending] = useState(false)
  const [giftSuccess, setGiftSuccess] = useState(false)
  const continueGift = async () => {
    if (!giftSelectedPlayer || giftSending) return
    const giftPrice = id === '192' || slug.toLowerCase().includes('korblox')
      ? 17000
      : id === '201' || slug.toLowerCase().includes('headless')
        ? 31000
        : item?.price ?? 0
    if (balance < giftPrice) {
      setGiftMessage(`Not enough Robux. You need ${(giftPrice - balance).toLocaleString('en-US')} more Robux to send this gift.`)
      return
    }
    setGiftSending(true)
    setGiftMessage('')
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    setBalance((current) => current - giftPrice)
    setGiftSuccess(true)
    setGiftSending(false)
  }
  const searchGiftPlayers = async () => {
    const keyword = giftUsername.trim()
    if (keyword.length < 3) return
    setGiftSearching(true)
    setGiftSearchMessage('')
    setGiftPlayers([])
    setGiftSelectedPlayer(null)
    try {
      let result: { data?: unknown[] } | null = null
      const apiUrls = [
        `/api/roblox-users?keyword=${encodeURIComponent(keyword)}`,
        `https://roblox-catalog-recreation.vercel.app/api/roblox-users?keyword=${encodeURIComponent(keyword)}`,
      ]
      for (const url of apiUrls) {
        try {
          const response = await fetch(url, { cache: 'no-store' })
          if (!response.ok) continue
          const payload = await response.json()
          if (Array.isArray(payload.data)) {
            result = payload
            break
          }
        } catch {}
      }
      if (!result) throw new Error('Player search unavailable')
      const players = Array.isArray(result.data)
        ? result.data
            .filter((player: { id?: number; name?: string; displayName?: string }) =>
              Number.isFinite(player.id) && typeof player.name === 'string',
            )
            .map((player: { id: number; name: string; displayName?: string; avatarUrl?: string | null; hasVerifiedBadge?: boolean }) => ({
              id: player.id,
              name: player.name,
              displayName: player.displayName || player.name,
              avatarUrl: typeof player.avatarUrl === 'string' ? player.avatarUrl : null,
              hasVerifiedBadge: player.hasVerifiedBadge === true,
            }))
        : []

      setGiftPlayers(players)
      setGiftSearchMessage(players.length ? '' : `No Roblox players found for “${keyword}”.`)
    } catch {
      setGiftPlayers([])
      setGiftSearchMessage('Could not load players. Roblox may be temporarily unavailable or blocking this request.')
    } finally {
      setGiftSearching(false)
    }
  }
  useEffect(() => {
    const keyword = giftUsername.trim()
    if (keyword.length < 3) {
      setGiftPlayers([])
      setGiftSearchMessage('')
      setGiftSelectedPlayer(null)
      setGiftSearching(false)
      return
    }
    const timer = window.setTimeout(() => { void searchGiftPlayers() }, 350)
    return () => window.clearTimeout(timer)
  }, [giftUsername])
  const [robuxShopOpen, setRobuxShopOpen] = useState(false)
  const [selectedRobux, setSelectedRobux] = useState(800)
  const [customRobux, setCustomRobux] = useState('800')
  const [show2D, setShow2D] = useState(true)
  const [tryOn, setTryOn] = useState(false)
  const [priceRange, setPriceRange] = useState('1M')
  const notify = (_msg: string) => {}
  const isHeadless = id === '201' || slug.toLowerCase().includes('headless')
  const isEightBit = id === '14' || slug.toLowerCase().includes('8-bit')
  const isKorblox = !isHeadless && !isEightBit
  const item = catalogItems.find((entry) => entry.id === (isHeadless ? 13 : isEightBit ? 14 : 10))

  useEffect(() => {
    if (!isKorblox) return
    const controller = new AbortController()
    fetch('https://thumbnails.roblox.com/v1/bundles/thumbnails?bundleIds=192&size=420x420&format=Png&isCircular=false', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Thumbnail unavailable')))
      .then((result: { data?: { imageUrl?: string }[] }) => {
        const imageUrl = result.data?.[0]?.imageUrl
        if (imageUrl) setRobloxThumbnail(imageUrl)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [isKorblox])

  if (!item) return <main className="min-h-screen bg-background p-8 text-foreground">Bundle not found.</main>

  const itemImage = robloxThumbnail ?? (item.image?.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${item.image || '/placeholder.svg'}`)
  const itemUrl = isHeadless
    ? 'https://www.roblox.com/bundles/201/Headless-Horseman'
    : isEightBit
      ? 'https://www.roblox.com/catalog/1365767/8-Bit-Royal-Crown'
      : 'https://www.roblox.com/bundles/192/Korblox-Deathspeaker'

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader balance={balance} query={query} onQueryChange={setQuery} onBuyRobux={() => setRobuxShopOpen(true)} onNotify={notify} />
      <LeftNav onNotify={notify} onBuyRobux={() => setRobuxShopOpen(true)} />

      <div className="ml-[220px] max-w-[calc(100%-220px)] px-4 py-8 md:px-8">
        <section className="flex flex-col items-center">
          <div className="flex w-full max-w-[900px] flex-col gap-5 overflow-hidden border-0 bg-transparent md:flex-row">
            <div className="flex w-full shrink-0 flex-col md:w-[400px]">
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl border border-[#3b3b3b] bg-[#232323] md:aspect-auto md:h-[400px] md:w-[400px]">
            <div className={`absolute inset-0 ${show2D || isHeadless ? 'block' : 'hidden'}`}>
              {robloxThumbnail ? (
                <img src={robloxThumbnail} alt={item.name} className="absolute inset-0 h-full w-full object-contain p-2" />
              ) : (
                <Image src={itemImage} alt={item.name} fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-contain p-2" />
              )}
            </div>
            {isKorblox && <div className={`absolute inset-0 ${show2D ? 'invisible' : 'visible'}`}><Korblox3D /></div>}
            {isKorblox && <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
              <button type="button" onClick={() => setTryOn((value) => !value)} aria-pressed={tryOn} className={`rounded-lg px-4 py-2 text-sm font-bold shadow-lg transition ${tryOn ? 'bg-[#00b06f] text-white' : 'bg-white text-[#222] hover:bg-gray-200'}`}>{tryOn ? 'Wearing' : 'Try On'}</button>
              <button type="button" onClick={() => setShow2D((value) => !value)} aria-pressed={!show2D} className="rounded-lg border border-white/20 bg-[#333] px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-[#444]">{show2D ? '3D' : '2D'}</button>
            </div>}
            {isEightBit && <span className="absolute bottom-4 left-4 z-20 rounded-md bg-[#00b06f] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">Limited</span>}
          </div>
            <div className="mt-2 flex items-center gap-1.5 self-start rounded-md bg-black/60 px-2 py-1 text-sm text-white"><span className="text-xl leading-none text-white">★</span><span>{item.favorites.toLocaleString('en-US')}</span></div>
            </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 text-white">
            <div>
              <div className="flex items-center gap-2.5"><h1 className="text-3xl font-bold tracking-tight md:text-4xl">{item.name}</h1>{isKorblox && <span className="relative mt-2 inline-flex shrink-0"><ShoppingCart aria-label="Shopping cart" className="size-6 text-white" /><span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#335fff] text-[10px] font-bold leading-none text-white">0</span></span>}</div>
              <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm text-muted-foreground">By <span className="font-semibold text-foreground">Roblox</span><VerifiedBadge className="size-4" /><span className="ml-2 inline-flex items-center gap-1.5 font-semibold text-[#00b06f]"><span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00b06f] text-white"><Check className="size-3.5 stroke-[3]" /></span>Item Owned</span></div><p className="mt-1 text-sm text-muted-foreground">This item is available in your inventory</p>
              <div className="mt-3 h-px w-full bg-border" />
            </div>


            <div className="mt-2 flex w-full max-w-[360px] flex-col gap-3">
              {isKorblox ? (
                <div className="flex w-full items-center justify-between border-b border-white/10 pb-3 text-sm">
                  <span className="font-medium text-muted-foreground">Price</span>
                  <span className="text-base font-bold"><Price price={17000} /></span>
                </div>
              ) : (
                <div className="flex w-full items-center justify-between text-sm">
                  <span className="font-medium text-muted-foreground">{isEightBit ? 'Best Price' : 'Price'}</span>
                  <Price price={item.price} />
                </div>
              )}
              <>
                <button type="button" aria-label="Owned" title="Owned" className="flex h-10 w-full cursor-default items-center justify-center rounded-md bg-[#335fff] text-white transition hover:bg-[#244be0]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="4.8" r="2.7" />
                    <path d="M8.5 9h7c.8 0 1.3.6 1.4 1.4l.8 5.3h-3v4.1h-2.1v-5h-1.2v5H9.3v-4.1h-3l.8-5.3C7.2 9.6 7.7 9 8.5 9Z" />
                    <ellipse cx="12" cy="22" rx="8.5" ry="1.5" />
                  </svg>
                </button>
                <button type="button" onClick={() => { setGiftMessage(''); setGiftSelectedPlayer(null); setGiftOpen(true) }} className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-5 text-base font-semibold transition hover:bg-secondary/70">Gift</button>
              </>
            </div>

            <dl className="mt-2 grid grid-cols-[112px_minmax(0,1fr)] items-start gap-x-5 gap-y-4 border-t border-border pt-5 text-sm sm:grid-cols-[128px_minmax(0,1fr)]">
              <dt className="font-medium text-muted-foreground">Tradable</dt><dd className="min-w-0 text-white">{isEightBit ? 'Yes' : 'No'}</dd>
              <dt className="flex items-center gap-1.5 font-medium text-muted-foreground">Type <span title="The category this item belongs to" className="inline-flex size-4 items-center justify-center rounded-full border border-current text-[10px] font-semibold leading-none">i</span></dt><dd className="min-w-0 text-white">{isEightBit ? 'Accessory' : 'Characters'}</dd>
              <dt className="font-medium text-muted-foreground">Placement</dt><dd className="min-w-0 text-white">{isEightBit ? 'Hat' : 'Full Body'}</dd>
              <dt className="font-medium text-muted-foreground">Created</dt><dd className="min-w-0 text-white">{isHeadless ? 'Aug 14, 2018' : isEightBit ? 'Jun 12, 2009' : 'Dec 26, 2013'}</dd>
              <dt className="font-medium text-muted-foreground">Description</dt><dd className="min-w-0 break-words leading-6 text-white">{isHeadless ? '"No, you must believe me. It was a horseman, a dead one. Headless."' : item.description || 'A classic Roblox collectible.'}</dd>
            </dl>
          </div>
          </div>
          {isEightBit && <div className="mt-8 w-full max-w-[900px] rounded-xl border border-[#3b3b3b] bg-[#232323] p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Price Chart</h2>
              <div className="flex flex-wrap gap-1.5">
                {['30D', '90D', 'All'].map((range) => <button key={range} type="button" onClick={() => setPriceRange(range)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${priceRange === range ? 'bg-white text-[#222]' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>{range}</button>)}
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div><p className="text-xs text-gray-400">Current price</p><p className="mt-1 text-2xl font-bold">27,849 <span className="text-sm font-medium text-gray-400">Robux</span></p></div>
              <p className="text-xs text-gray-400">Price history</p>
            </div>
            <div className="mt-4 w-full overflow-hidden">
              <svg viewBox="0 0 760 220" role="img" aria-label={`8-Bit Royal Crown price history, range ${priceRange}`} className="h-auto w-full">
                {[35, 75, 115, 155, 195].map((y) => <line key={y} x1="0" y1={y} x2="760" y2={y} stroke="#444" strokeWidth="1" />)}
                <defs><linearGradient id="eightBitChartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00b06f" stopOpacity=".3" /><stop offset="100%" stopColor="#00b06f" stopOpacity="0" /></linearGradient></defs>
                <path d={priceRange === '30D' ? 'M0 145 L70 135 L140 150 L210 112 L280 120 L350 95 L420 110 L490 78 L560 92 L630 62 L700 70 L760 48 L760 210 L0 210 Z' : priceRange === '90D' ? 'M0 165 L70 140 L140 152 L210 100 L280 125 L350 90 L420 108 L490 65 L560 80 L630 55 L700 68 L760 35 L760 210 L0 210 Z' : priceRange === '90D' ? 'M0 180 L70 155 L140 160 L210 130 L280 145 L350 95 L420 120 L490 85 L560 92 L630 48 L700 65 L760 28 L760 210 L0 210 Z' : priceRange === 'All' ? 'M0 190 L70 175 L140 180 L210 150 L280 158 L350 125 L420 140 L490 95 L560 110 L630 72 L700 60 L760 25 L760 210 L0 210 Z' : 'M0 175 L70 155 L140 165 L210 125 L280 140 L350 100 L420 118 L490 82 L560 100 L630 55 L700 68 L760 32 L760 210 L0 210 Z'} fill="url(#eightBitChartFill)" />
                <path d={priceRange === '1D' ? 'M0 145 L70 135 L140 150 L210 112 L280 120 L350 95 L420 110 L490 78 L560 92 L630 62 L700 70 L760 48' : priceRange === '1W' ? 'M0 165 L70 140 L140 152 L210 100 L280 125 L350 90 L420 108 L490 65 L560 80 L630 55 L700 68 L760 35' : priceRange === '3M' ? 'M0 180 L70 155 L140 160 L210 130 L280 145 L350 95 L420 120 L490 85 L560 92 L630 48 L700 65 L760 28' : priceRange === '1Y' || priceRange === 'All' ? 'M0 190 L70 175 L140 180 L210 150 L280 158 L350 125 L420 140 L490 95 L560 110 L630 72 L700 60 L760 25' : 'M0 175 L70 155 L140 165 L210 125 L280 140 L350 100 L420 118 L490 82 L560 100 L630 55 L700 68 L760 32'} fill="none" stroke="#00b06f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>}
        </section>
      </div>

      {robuxShopOpen && <div className="fixed right-4 top-[60px] z-[60] w-[min(360px,calc(100vw-2rem))]">
        <section role="dialog" aria-modal="false" aria-labelledby="robux-title" className="rounded-xl border border-border bg-card p-4 text-foreground shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <h2 id="robux-title" className="text-lg font-bold">Choisir des Robux</h2>
            <button type="button" onClick={() => setRobuxShopOpen(false)} aria-label="Fermer" className="rounded-lg px-2 py-0.5 text-xl hover:bg-secondary">×</button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Sélectionne la quantité que tu veux.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {robuxOptions.map((amount) => <button key={amount} type="button" onClick={() => { setSelectedRobux(amount); setCustomRobux(String(amount)) }} aria-pressed={selectedRobux === amount && customRobux === String(amount)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg border p-2 text-sm font-bold transition hover:bg-secondary ${selectedRobux === amount ? 'border-[#00b06f] bg-[#00b06f]/10 ring-2 ring-[#00b06f]' : 'border-border'}`}>
              <span className="flex items-center gap-2"><RobuxIcon />{amount}</span>
              <span className="text-[10px] font-medium text-muted-foreground">Robux</span>
            </button>)}
          </div>
          <label htmlFor="custom-robux" className="mt-3 block text-xs font-semibold text-muted-foreground">Ou écris la quantité souhaitée</label>
          <input id="custom-robux" type="number" min="1" max="1000000000" step="1" inputMode="numeric" value={customRobux} onChange={(event) => { setCustomRobux(event.target.value); const amount = Number(event.target.value); if (Number.isSafeInteger(amount) && amount > 0) setSelectedRobux(amount) }} placeholder="Ex. 2500" className="mt-1 h-10 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#00b06f]" />
          <button type="button" onClick={() => { setBalance((current) => current + selectedRobux); setRobuxShopOpen(false) }} className="mt-3 h-10 w-full rounded-lg bg-[#00b06f] text-sm font-bold text-white transition hover:bg-[#009e63]">Ajouter {selectedRobux} Robux</button>
        </section>
      </div>}

      {giftOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/70 p-3" onClick={() => setGiftOpen(false)}>
        <section role="dialog" aria-modal="true" aria-labelledby="gift-title" className="gift-galaxy-card relative z-10 w-full max-w-sm overflow-hidden rounded-xl border border-[#6d75ff]/60 p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div aria-hidden="true" className="gift-galaxy-card-bg pointer-events-none absolute inset-0" />
          <div className="relative z-10">
          {giftSuccess ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center py-8 text-center">
              <div className="relative mb-5 flex size-24 items-center justify-center">
                <div aria-hidden="true" className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/35 via-blue-500/20 to-cyan-400/30 blur-xl" />
                <div className="absolute inset-1 rounded-full border border-violet-300/50 bg-[#080b20]/80 shadow-[0_0_35px_rgba(112,90,255,0.45)]">
                  <div aria-hidden="true" className="absolute inset-0 rounded-full opacity-80" style={{backgroundImage: 'radial-gradient(1.5px 1.5px at 20% 25%, white 60%, transparent), radial-gradient(1px 1px at 72% 35%, #a5d8ff 60%, transparent), radial-gradient(1.5px 1.5px at 60% 75%, #d8b4fe 60%, transparent), radial-gradient(1px 1px at 35% 65%, white 60%, transparent)'}} />
                </div>
                <div className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                  <Check className="size-8 stroke-[3]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Gift was sent successfully!</h3>
              <p className="mt-3 text-sm text-white/75">{item.name}</p>
              {giftSelectedPlayer && <p className="mt-1 text-sm text-white/75">To {giftSelectedPlayer.displayName} (@{giftSelectedPlayer.name})</p>}
              <button type="button" onClick={() => { setGiftOpen(false); setGiftSuccess(false) }} className="mt-7 h-10 min-w-32 rounded-lg bg-[#335fff] px-6 text-sm font-bold text-white transition hover:bg-[#244be0]">Done</button>
            </div>
          ) : (
          <>
          <div className="flex items-center justify-between gap-3">
            <h2 id="gift-title" className="text-lg font-bold">Gift {item.name}</h2>
            <button type="button" onClick={() => setGiftOpen(false)} aria-label="Close" className="rounded-lg px-2 py-1 text-xl hover:bg-secondary">×</button>
          </div>
          {giftSelectedPlayer ? (
            <div className="mt-5 flex flex-col items-center text-center">
              <img src={itemImage} alt={item.name} className="size-24 object-contain" />
              <h3 className="mt-2 text-lg font-bold">{item.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/80"><RobuxIcon className="size-4" /> Gift cost: {(id === '192' || slug.toLowerCase().includes('korblox') ? 17000 : id === '201' || slug.toLowerCase().includes('headless') ? 31000 : item.price ?? 0).toLocaleString('en-US')} Robux</p>
              <p className="text-xs text-white/60">Your balance: {balance.toLocaleString('en-US')} Robux</p>
              <div className="mt-3 flex items-center gap-3">
                {giftSelectedPlayer.avatarUrl ? <img src={giftSelectedPlayer.avatarUrl} alt="" className="size-12 rounded-full object-cover" /> : <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-white/10 text-xl">👤</span>}
                <div className="text-left">
                  <p className="flex items-center gap-1.5 font-semibold">{giftSelectedPlayer.displayName}{giftSelectedPlayer.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</p>
                  <p className="text-sm text-white/70">@{giftSelectedPlayer.name}</p>
                </div>
              </div>
              <button type="button" onClick={() => void continueGift()} disabled={giftSending} className="mt-5 flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg bg-[#335fff] px-6 text-sm font-bold text-white transition hover:bg-[#244be0] disabled:opacity-70">
                {giftSending ? 'Sending…' : 'Gift'}
              </button>
              <button type="button" onClick={() => { setGiftSelectedPlayer(null); setGiftMessage(''); setGiftSearchMessage('') }} className="mt-3 text-xs text-white/70 underline hover:text-white">Choose another player</button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">Search for the Roblox player you want to gift.</p>
              <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); void searchGiftPlayers() }}>
                <input value={giftUsername} onChange={(event) => { setGiftUsername(event.target.value); setGiftSearchMessage(''); setGiftPlayers([]); setGiftSelectedPlayer(null); setGiftMessage('') }} placeholder="Search players (type at least 3 characters)" aria-label="Roblox player username" className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[#335fff]" />
                <button type="submit" disabled={!giftUsername.trim() || giftSearching} className="h-11 rounded-lg bg-[#335fff] px-4 text-sm font-semibold text-white disabled:opacity-50">{giftSearching ? 'Searching…' : 'Search'}</button>
              </form>
              {giftPlayers.length > 0 && <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                {giftPlayers.map((player) => <button key={player.id} type="button" onClick={() => { setGiftSelectedPlayer(player); setGiftMessage('') }} className="flex w-full items-center justify-between rounded-lg border border-white/15 p-3 text-left transition hover:border-[#335fff] hover:bg-white/5">
                  <span className="flex min-w-0 items-center gap-3">
                    {player.avatarUrl ? <img src={player.avatarUrl} alt="" className="size-12 shrink-0 rounded-full bg-white/10 object-cover" /> : <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">👤</span>}
                    <span className="min-w-0"><span className="flex min-w-0 items-center gap-1.5 truncate font-semibold">{player.displayName}{player.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</span><span className="block truncate text-sm text-white/70">@{player.name}</span></span>
                  </span>
                  <span className="text-sm font-semibold text-[#8ca0ff]">Select</span>
                </button>)}
              </div>}
              {giftSearching && <p className="mt-4 text-sm text-muted-foreground">Looking for Roblox players…</p>}
              {!giftSearching && giftSearchMessage && <p role="status" className="mt-4 text-sm text-muted-foreground">{giftSearchMessage}</p>}
            </>
          )}
                    {giftMessage && <div role="status" className="mt-2 rounded-lg border border-[#8ca0ff]/50 bg-[#10152c]/80 p-2.5 text-xs text-white backdrop-blur-sm"><p>{giftMessage}</p></div>}
          </>
          )}
          </div>
        </section>
      </div>}
    </main>
  )
}
