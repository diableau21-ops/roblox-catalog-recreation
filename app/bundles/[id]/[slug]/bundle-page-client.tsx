"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Gift, ShoppingCart, Info, Check } from 'lucide-react'
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
        <section className="flex justify-center">
          <div className={`flex w-full max-w-[900px] flex-col overflow-hidden ${isKorblox || isEightBit ? 'gap-5 border-0 bg-transparent' : 'gap-0 rounded-xl border border-[#3b3b3b] bg-[#232323]'} md:flex-row`}>
            <div className={isKorblox ? "flex w-full shrink-0 flex-col md:w-[400px]" : "contents"}>
            <div className={`relative aspect-square w-full shrink-0 md:aspect-auto md:h-[400px] ${isKorblox ? 'overflow-hidden rounded-xl border border-[#3b3b3b] bg-[#232323] md:w-[400px]' : 'overflow-hidden rounded-none border border-[#3b3b3b] bg-[#232323] md:w-[400px]'}`}>
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
          </div>
            {isKorblox && <div className="mt-2 flex items-center gap-1.5 self-start rounded-md bg-black/60 px-2 py-1 text-sm text-white"><span className="text-xl leading-none text-white">★</span><span>3.4M</span></div>}
            </div>

          <div className={`flex min-w-0 flex-1 flex-col gap-4 text-white ${isKorblox || isEightBit ? '' : 'border-t border-white/10 bg-[#232323] p-5 md:border-l md:border-t-0 md:p-6'}`}>
            <div>
              {!isEightBit && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{isKorblox ? '' : 'Bundle'}</p>}
              <div className="flex items-center gap-3"><h1 className="text-3xl font-bold tracking-tight md:text-4xl">{item.name}</h1>{isKorblox && <span className="relative mt-2 inline-flex shrink-0"><ShoppingCart aria-label="Shopping cart" className="size-6 text-white" /><span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#335fff] text-[10px] font-bold leading-none text-white">0</span></span>}</div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">By <span className="font-semibold text-foreground">Roblox</span><VerifiedBadge className="size-4" /></p>{isKorblox && <div className="mt-3 flex items-center gap-2.5 text-sm"><span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00b06f] text-white"><Check className="size-4 stroke-[3]" /></span><span className="font-medium text-[#00b06f]">Item Owned</span></div>}{isKorblox && <p className="mt-1 text-sm text-muted-foreground">This item is available in your inventory</p>}
              <div className="mt-3 h-px w-full bg-border" />
            </div>

            {(isHeadless || isEightBit) && <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>}

            <div className={`mt-2 flex flex-col gap-3 w-full ${isKorblox ? 'max-w-[360px]' : ''}`}>
              {isKorblox ? (
                <div className="flex w-full items-center justify-between border-b border-white/10 pb-3 text-sm">
                  <span className="font-medium text-muted-foreground">Price</span>
                  <span className="text-base font-bold"><Price price={17000} /></span>
                </div>
              ) : (
                <div className="flex w-full items-center justify-between text-sm">
                  <span className="font-medium text-muted-foreground">Price</span>
                  <Price price={item.price} />
                </div>
              )}
              {isHeadless ? <>
                <button type="button" onClick={() => {}} className="flex h-11 w-full items-center justify-center rounded-md bg-[#00b06f] px-5 text-base font-bold text-white transition hover:bg-[#009e63]">Owned</button>
                <button type="button" onClick={() => setGiftOpen(true)} className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-5 text-base font-semibold transition hover:bg-secondary/70"><Gift className="size-4" /> Gift</button>
              </> : isEightBit ? <>
                <a href={itemUrl} target="_blank" rel="noopener noreferrer" className="flex h-11 w-full items-center justify-center rounded-md bg-[#335fff] px-5 text-base font-bold text-white transition hover:bg-[#244be0]">Buy</a>
                <button type="button" onClick={() => setGiftOpen(true)} className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-5 text-base font-semibold transition hover:bg-secondary/70"><Gift className="size-4" /> Gift</button>
              </> : <>
                <button type="button" aria-label="Owned" title="Owned" className="flex h-10 w-full cursor-default items-center justify-center rounded-md bg-[#335fff] text-white transition hover:bg-[#244be0]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="4.8" r="2.7" />
                    <path d="M8.5 9h7c.8 0 1.3.6 1.4 1.4l.8 5.3h-3v4.1h-2.1v-5h-1.2v5H9.3v-4.1h-3l.8-5.3C7.2 9.6 7.7 9 8.5 9Z" />
                    <ellipse cx="12" cy="22" rx="8.5" ry="1.5" />
                  </svg>
                </button>
                <button type="button" onClick={() => setGiftOpen(true)} className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-5 text-base font-semibold transition hover:bg-secondary/70"><Gift className="size-4" /> Gift</button>
              </>}
            </div>

            {isKorblox && <dl className="mt-2 grid grid-cols-[112px_minmax(0,1fr)] items-start gap-x-5 gap-y-4 border-t border-border pt-5 text-sm sm:grid-cols-[128px_minmax(0,1fr)]">
              <dt className="font-medium text-muted-foreground">Tradable</dt><dd className="min-w-0 text-white">No</dd>
              <dt className="flex items-center gap-1.5 font-medium text-muted-foreground">Type <span title="The category this item belongs to" className="inline-flex size-4 items-center justify-center rounded-full border border-current text-[10px] font-semibold leading-none">i</span></dt><dd className="min-w-0 text-white">Characters</dd>
              <dt className="font-medium text-muted-foreground">Placement</dt><dd className="min-w-0 text-white">Full Body</dd>
              <dt className="font-medium text-muted-foreground">Created</dt><dd className="min-w-0 text-white">Dec 26, 2013</dd>
              <dt className="font-medium text-muted-foreground">Description</dt><dd className="min-w-0 break-words leading-6 text-white">His tribe is widely considered the best and strongest of the twelve Korblox tribes. No one dares challenge his authority.</dd>
            </dl>}
          </div>
          </div>
          {isEightBit && <div className="mt-8 w-full max-w-[900px] rounded-xl border border-[#3b3b3b] bg-[#232323] p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Price Chart</h2>
              <div className="flex flex-wrap gap-1.5">
                {['1D', '1W', '1M', '3M', '1Y', 'All'].map((range) => <button key={range} type="button" onClick={() => setPriceRange(range)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${priceRange === range ? 'bg-white text-[#222]' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>{range}</button>)}
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div><p className="text-xs text-gray-400">Current price</p><p className="mt-1 text-2xl font-bold">27,849 <span className="text-sm font-medium text-gray-400">Robux</span></p></div>
              <p className="text-xs text-gray-400">Illustrative chart preview</p>
            </div>
            <div className="mt-4 w-full overflow-hidden">
              <svg viewBox="0 0 760 220" role="img" aria-label={`Illustrative 8-Bit Royal Crown price chart, range ${priceRange}`} className="h-auto w-full">
                {[35, 75, 115, 155, 195].map((y) => <line key={y} x1="0" y1={y} x2="760" y2={y} stroke="#444" strokeWidth="1" />)}
                <defs><linearGradient id="eightBitChartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00b06f" stopOpacity=".3" /><stop offset="100%" stopColor="#00b06f" stopOpacity="0" /></linearGradient></defs>
                <path d={priceRange === '1D' ? 'M0 145 L70 135 L140 150 L210 112 L280 120 L350 95 L420 110 L490 78 L560 92 L630 62 L700 70 L760 48 L760 210 L0 210 Z' : priceRange === '1W' ? 'M0 165 L70 140 L140 152 L210 100 L280 125 L350 90 L420 108 L490 65 L560 80 L630 55 L700 68 L760 35 L760 210 L0 210 Z' : priceRange === '3M' ? 'M0 180 L70 155 L140 160 L210 130 L280 145 L350 95 L420 120 L490 85 L560 92 L630 48 L700 65 L760 28 L760 210 L0 210 Z' : priceRange === '1Y' || priceRange === 'All' ? 'M0 190 L70 175 L140 180 L210 150 L280 158 L350 125 L420 140 L490 95 L560 110 L630 72 L700 60 L760 25 L760 210 L0 210 Z' : 'M0 175 L70 155 L140 165 L210 125 L280 140 L350 100 L420 118 L490 82 L560 100 L630 55 L700 68 L760 32 L760 210 L0 210 Z'} fill="url(#eightBitChartFill)" />
                <path d={priceRange === '1D' ? 'M0 145 L70 135 L140 150 L210 112 L280 120 L350 95 L420 110 L490 78 L560 92 L630 62 L700 70 L760 48' : priceRange === '1W' ? 'M0 165 L70 140 L140 152 L210 100 L280 125 L350 90 L420 108 L490 65 L560 80 L630 55 L700 68 L760 35' : priceRange === '3M' ? 'M0 180 L70 155 L140 160 L210 130 L280 145 L350 95 L420 120 L490 85 L560 92 L630 48 L700 65 L760 28' : priceRange === '1Y' || priceRange === 'All' ? 'M0 190 L70 175 L140 180 L210 150 L280 158 L350 125 L420 140 L490 95 L560 110 L630 72 L700 60 L760 25' : 'M0 175 L70 155 L140 165 L210 125 L280 140 L350 100 L420 118 L490 82 L560 100 L630 55 L700 68 L760 32'} fill="none" stroke="#00b06f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mt-2 text-xs text-gray-500">Demo visual only — historical Roblox price data is not connected.</p>
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

      {giftOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setGiftOpen(false)}>
        <section role="dialog" aria-modal="true" aria-labelledby="gift-title" className="w-full max-w-md rounded-xl border border-border bg-card p-6" onClick={(event) => event.stopPropagation()}>
          <h2 id="gift-title" className="text-xl font-bold">Gift {item.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">The Gift button is a visual demo. Sending real gifts is not connected on this fan-made site.</p>
          <button type="button" onClick={() => setGiftOpen(false)} className="mt-5 h-10 w-full rounded-lg bg-secondary font-semibold hover:bg-secondary/80">Close</button>
        </section>
      </div>}
    </main>
  )
}
