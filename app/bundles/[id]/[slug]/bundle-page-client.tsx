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
  const [giftConfirmOpen, setGiftConfirmOpen] = useState(false)
  const [giftManualMode, setGiftManualMode] = useState(false)
  const [giftRunId, setGiftRunId] = useState(0)
  const [giftAutoStage, setGiftAutoStage] = useState<'search' | 'confirm' | 'result'>('search')
  useEffect(() => {
    if (!giftOpen || !giftSuccess) return
    const timer = window.setTimeout(() => {
      setGiftSuccess(false)
      setGiftMessage('')
      setGiftSearchMessage('')
      setGiftUsername('')
      setGiftSelectedPlayer(null)
      setGiftPlayers([])
      setGiftSending(false)
      setGiftRunId((value) => value + 1)
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [giftOpen, giftSuccess])
  const continueGift = async () => {
    if (!giftSelectedPlayer || giftSending) return
    const giftPrice = id === '192' || slug.toLowerCase().includes('korblox')
      ? 17000
      : id === '201' || slug.toLowerCase().includes('headless')
        ? 31000
        : item?.price ?? 0

    // Read the shared balance at confirmation time so this page doesn't use a stale value.
    let currentBalance = balance
    try {
      const savedBalance = window.localStorage.getItem('catalog-demo-robux-balance')
      if (savedBalance !== null) {
        const parsedBalance = Number(savedBalance)
        if (Number.isFinite(parsedBalance) && parsedBalance >= 0) currentBalance = parsedBalance
      }
    } catch {}
    setBalance(currentBalance)

    if (currentBalance < giftPrice) {
      setGiftMessage(`Not enough Robux. You need ${(giftPrice - currentBalance).toLocaleString('en-US')} more Robux to send this gift.`)
      return
    }
    setGiftSending(true)
    setGiftMessage('')
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    const updatedBalance = currentBalance - giftPrice
    setBalance(updatedBalance)
    try { window.localStorage.setItem('catalog-demo-robux-balance', String(updatedBalance)) } catch {}
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
      const response = await fetch(`/api/roblox-users?keyword=${encodeURIComponent(keyword)}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Player search unavailable')
      const payload = await response.json()
      const players = Array.isArray(payload.data)
        ? payload.data
            .filter((player: { id?: number; name?: string }) =>
                Number.isFinite(player.id) && typeof player.name === 'string' && /\d/.test(player.name),
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
      setGiftSearchMessage(players.length
        ? `Found ${players.length} real Roblox account(s).`
        : `No Roblox players found for “${keyword}”. Try another username.`)
    } catch {
      setGiftPlayers([])
      setGiftSearchMessage('')
    } finally {
      setGiftSearching(false)
    }
  }


  useEffect(() => {
    if (!giftManualMode || giftSuccess || giftSelectedPlayer) return
    const keyword = giftUsername.trim()
    if (keyword.length < 3) {
      setGiftPlayers([])
      setGiftSearchMessage('')
      setGiftSelectedPlayer(null)
      setGiftSearching(false)
      return
    }
    const timer = window.setTimeout(() => { void searchGiftPlayers() }, 700)
    return () => window.clearTimeout(timer)
  }, [giftUsername, giftSuccess, giftSelectedPlayer, giftManualMode])
  // Automatic preview: cycle through searches and real public Roblox accounts.
  useEffect(() => {
    if (!giftOpen || giftManualMode) return
    let cancelled = false
    let activeTimer: number | undefined
    const pause = (ms: number) => new Promise<void>((resolve) => {
      activeTimer = window.setTimeout(resolve, ms)
    })
    // Search broad username fragments, not guessed full usernames; keep only real results whose usernames contain digits.
    const terms = ['rob', 'the', 'pro', 'xx', 'yt', 'its', 'real', 'king', 'cool', 'play']
    const runCycle = async () => {
      let turn = 0
      while (!cancelled) {
        const keyword = terms[turn % terms.length]
        setGiftSelectedPlayer(null)
        setGiftAutoStage('search')
        setGiftConfirmOpen(false)
        setGiftPlayers([])
        setGiftSearchMessage('')
        setGiftMessage('')
        setGiftUsername('')
        for (let i = 1; i <= keyword.length && !cancelled; i++) {
          setGiftUsername(keyword.slice(0, i))
          await pause(180)
        }
        if (cancelled) break
        await pause(500)
        try {
          const response = await fetch(`/api/roblox-users?keyword=${encodeURIComponent(keyword)}`, { cache: 'no-store' })
          if (!response.ok) throw new Error('Search unavailable')
          const payload = await response.json()
          const players = Array.isArray(payload.data)
            ? payload.data.filter((player: { id?: number; name?: string }) =>
                Number.isFinite(player.id) && typeof player.name === 'string' && /\d/.test(player.name),
              ).map((player: { id: number; name: string; displayName?: string; avatarUrl?: string | null; hasVerifiedBadge?: boolean }) => ({
                id: player.id,
                name: player.name,
                displayName: player.displayName || player.name,
                avatarUrl: typeof player.avatarUrl === 'string' ? player.avatarUrl : null,
                hasVerifiedBadge: player.hasVerifiedBadge === true,
              }))
            : []
          if (cancelled) break
          setGiftPlayers(players)
          if (players.length) {
            // Pick the first matching real account; no random account or name generation.
            setGiftSelectedPlayer(players[0])
            setGiftSearchMessage('')
            setGiftAutoStage('confirm')
            await pause(1100)
            if (cancelled) break
            setGiftAutoStage('result')
            await pause(1500)
          } else {
            setGiftSearchMessage('')
            await pause(500)
          }
        } catch {
          if (!cancelled) {
            setGiftPlayers([])
            setGiftSelectedPlayer(null)
            await pause(900)
          }
        }
        turn++
      }
    }
    void runCycle()
    return () => {
      cancelled = true
      if (activeTimer !== undefined) window.clearTimeout(activeTimer)
    }
  }, [giftOpen, giftManualMode])

  const [robuxShopOpen, setRobuxShopOpen] = useState(false)
  const [selectedRobux, setSelectedRobux] = useState(800)
  const [customRobux, setCustomRobux] = useState('800')
  const [show2D, setShow2D] = useState(true)
  const [tryOn, setTryOn] = useState(false)
  const [priceRange, setPriceRange] = useState('180 Days')
  const [hoveredPricePoint, setHoveredPricePoint] = useState<{x: number; y: number; price: number} | null>(null)
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

      <div className="w-full px-3 py-4 pb-24 sm:px-5 sm:py-6 md:ml-[220px] md:max-w-[calc(100%-220px)] md:px-8 md:py-8">
        <section className="flex flex-col items-center">
          <div className="flex w-full max-w-[900px] flex-col gap-5 overflow-hidden border-0 bg-transparent sm:gap-6 md:flex-row">
            <div className="flex w-full min-w-0 shrink-0 flex-col md:w-[400px]">
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
              <button type="button" onClick={() => setTryOn((value) => !value)} aria-pressed={tryOn} className="rounded-lg border border-white/20 bg-[#333] px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-[#444]">{tryOn ? 'Wearing' : 'Try On'}</button>
              <button type="button" onClick={() => setShow2D((value) => !value)} aria-pressed={!show2D} className="rounded-lg border border-white/20 bg-[#333] px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-[#444]">{show2D ? '3D' : '2D'}</button>
            </div>}
            {isEightBit && <span className="absolute bottom-4 left-4 z-20 rounded-md bg-[#00b06f] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">Limited</span>}
          </div>
            <div className="mt-2 flex items-center gap-1.5 self-start rounded-md bg-black/60 px-2 py-1 text-sm text-white"><span className="text-xl leading-none text-white">★</span><span>{item.favorites.toLocaleString('en-US')}</span></div>
            </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 text-white">
            <div>
              <div className="flex flex-wrap items-center gap-2.5"><h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{item.name}</h1>{isKorblox && <button type="button" onClick={() => { setGiftManualMode(false); setGiftOpen(true); setGiftSuccess(false); setGiftConfirmOpen(false); setGiftMessage(""); setGiftSearchMessage(""); setGiftSelectedPlayer(null); setGiftPlayers([]); setGiftUsername("") }} aria-label="Open gift cart" title="Gift" className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:bg-white/10"><ShoppingCart aria-hidden="true" className="size-5" /></button>}</div>
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
                  <span className={`font-medium ${isEightBit ? 'text-white' : 'text-muted-foreground'}`}>{isEightBit ? 'Best Price' : 'Price'}</span>
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
                <button type="button" onClick={() => { setGiftManualMode(false); setGiftMessage(''); setGiftSelectedPlayer(null); setGiftOpen(true) }} className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-5 text-base font-semibold transition hover:bg-secondary/70"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg" alt="" aria-hidden="true" className="size-4 brightness-0 invert" /><span>Gift</span></button>
              </>
            </div>

            <dl className="mt-2 grid grid-cols-[112px_minmax(0,1fr)] items-start gap-x-5 gap-y-4 border-t border-border pt-5 text-sm sm:grid-cols-[128px_minmax(0,1fr)]">
              <dt className="font-medium text-muted-foreground">Tradable</dt><dd className="min-w-0 text-white">{isEightBit ? 'Yes' : 'No'}</dd>
              {isEightBit && <><dt className="font-medium text-muted-foreground">Holding Period</dt><dd className="min-w-0 text-white">Yes</dd></>}
              <dt className="flex items-center gap-1.5 font-medium text-muted-foreground">Type <span title="The category this item belongs to" className="inline-flex size-4 items-center justify-center rounded-full border border-current text-[10px] font-semibold leading-none">i</span></dt><dd className="min-w-0 text-white">{isEightBit ? 'Head Accessories' : 'Characters'}</dd>
              <dt className="font-medium text-muted-foreground">Placement</dt><dd className="min-w-0 text-white">{isEightBit ? 'Accessories | Head' : 'Full Body'}</dd>
              <dt className="font-medium text-muted-foreground">Created</dt><dd className="min-w-0 text-white">{isHeadless ? 'Aug 14, 2018' : isEightBit ? 'Jul 08, 2022' : 'Dec 26, 2013'}</dd>
              <dt className="font-medium text-muted-foreground">Description</dt><dd className="min-w-0 break-words leading-6 text-white">{isHeadless ? '"No, you must believe me. It was a horseman, a dead one. Headless."' : isEightBit ? 'Perfect for sending adventurers out to save the princess.' : item.description || 'A classic Roblox collectible.'}</dd>
            </dl>
          </div>
          </div>
          {isEightBit && <div className="mt-8 w-full max-w-[900px] overflow-hidden bg-[#303030] text-[#e5e5e5]">
            <div className="px-5 pt-4">
              <h2 className="text-[21px] font-semibold leading-7 text-[#f2f2f2]">Price Chart</h2>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-6 text-[13px] text-[#a8a8a8]">
                  <span className="flex items-center gap-2"><span className="h-[4px] w-[14px] rounded-full bg-[#00b957]" />Recent Average Price</span>
                  <span className="flex items-center gap-2"><span className="h-[4px] w-[14px] bg-[#dedede]" />Volume</span>
                </div>
                <select aria-label="Price chart period" value={priceRange} onChange={(event) => setPriceRange(event.target.value)} className="min-w-[180px] rounded-xl border border-[#555] bg-[#252525] px-3 py-2 text-base text-[#e5e5e5] outline-none focus:border-[#999]">
                  <option value="30 Days">30 Days</option><option value="90 Days">90 Days</option><option value="180 Days">180 Days</option>
                </select>
              </div>
              <svg viewBox="0 0 960 190" role="img" aria-label={`Price Chart for 8-Bit Royal Crown, ${priceRange}`} className="mt-4 h-auto w-full">
                {[35,75,115].map(y => <line key={y} x1="64" y1={y} x2="930" y2={y} stroke="#505050" />)}
                <g fill="#bdbdbd" fontSize="12"><text x="50" y="39" textAnchor="end">30K</text><text x="50" y="79" textAnchor="end">28K</text><text x="50" y="119" textAnchor="end">26K</text></g>
                {Array.from({length:29},(_,i)=><line key={i} x1={70+i*30} y1={153-(i%5===0?18:i%3===0?11:0)} x2={70+i*30} y2="165" stroke="#777777" strokeWidth="1.5" />)}
                <line x1="64" y1="165" x2="930" y2="165" stroke="#5b5b5b" />
                <path d={priceRange === '30 Days' ? 'M70 91 L100 83 L130 83 L160 94 L190 96 L220 88 L250 88 L280 48 L310 94 L340 103 L370 57 L400 100 L430 95 L460 72 L490 67 L520 74 L550 84 L580 87 L610 91 L640 96 L670 94 L700 83 L730 95 L760 78 L790 87 L820 91 L850 96 L880 87 L910 69 L930 91' : priceRange === '90 Days' ? 'M70 101 L100 91 L130 97 L160 88 L190 93 L220 81 L250 90 L280 63 L310 83 L340 98 L370 68 L400 93 L430 88 L460 74 L490 71 L520 78 L550 82 L580 87 L610 93 L640 89 L670 80 L700 94 L730 75 L760 82 L790 90 L820 85 L850 92 L880 77 L910 69 L930 86' : 'M70 108 L100 98 L130 100 L160 91 L190 96 L220 88 L250 91 L280 65 L310 89 L340 103 L370 72 L400 98 L430 92 L460 76 L490 69 L520 78 L550 85 L580 87 L610 94 L640 97 L670 90 L700 80 L730 94 L760 76 L790 86 L820 90 L850 96 L880 86 L910 71 L930 93'} fill="none" stroke="#00b957" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {[[70,91],[100,83],[130,83],[160,94],[190,96],[220,88],[250,88],[280,48],[310,94],[340,103],[370,57],[400,100],[430,95],[460,72],[490,67],[520,74],[550,84],[580,87],[610,91],[640,96],[670,94],[700,83],[730,95],[760,78],[790,87],[820,91],[850,96],[880,87],[910,69],[930,91]].map(([x,y],i)=>{const price=Math.max(100,Math.round((30000-(y-35)*50)/10)*10);return <g key={i} onMouseEnter={()=>setHoveredPricePoint({x,y,price})} onMouseLeave={()=>setHoveredPricePoint(null)} className="cursor-crosshair"><circle cx={x} cy={y} r="10" fill="transparent"/><circle cx={x} cy={y} r="3.8" fill="#00b957" stroke="#303030" strokeWidth="1.5"><title>{price.toLocaleString("en-US")+" Robux"}</title></circle></g>})}
                {hoveredPricePoint && <g pointerEvents="none"><rect x={Math.max(65,Math.min(844,hoveredPricePoint.x-42))} y={Math.max(2,hoveredPricePoint.y-39)} width="84" height="28" rx="5" fill="#171717" stroke="#777"/><text x={Math.max(107,Math.min(886,hoveredPricePoint.x))} y={Math.max(20,hoveredPricePoint.y-21)} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">{hoveredPricePoint.price.toLocaleString("en-US")+" R$"}</text></g>}
                <g fill="#a0a0a0" fontSize="11">{['03/10','03/12','03/14','03/16','03/18','03/20','03/22','03/24','03/26','03/28','03/30','04/01','04/03','04/05','04/07'].map((d,i)=><text key={d} x={100+i*57} y="139" textAnchor="middle">{d}</text>)}</g>
              </svg>
              <div className="grid grid-cols-3 border-t border-[#505050] pb-5 pt-3 text-center">
                <div><div className="text-[16px] font-semibold text-[#e5e5e5]">Quantity Sold</div><div className="mt-2 text-[17px] text-[#f0f0f0]">N/A</div></div>
                <div><div className="text-[16px] font-semibold text-[#e5e5e5]">Original Price</div><div className="mt-2 text-[17px] text-[#f0f0f0]">300</div></div>
                <div><div className="text-[16px] font-semibold text-[#e5e5e5]">Average Price</div><div className="mt-2 text-[17px] text-[#f0f0f0]">N/A</div></div>
              </div>
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

      {giftOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/70 p-3" onClick={() => { setGiftOpen(false); setGiftManualMode(false) }}>
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
              <h3 className="text-xl font-bold text-white">Gift was sent successfully</h3>
              <p className="mt-3 text-sm text-white/75">{item.name}</p>
              {giftSelectedPlayer && <p className="mt-1 text-sm text-white/75">To {giftSelectedPlayer.displayName} (@{giftSelectedPlayer.name})</p>}
              <button type="button" onClick={() => { setGiftSuccess(false); setGiftMessage(""); setGiftSearchMessage(""); setGiftUsername(""); setGiftSelectedPlayer(null); setGiftPlayers([]); setGiftSending(false); setGiftRunId((value) => value + 1) }} className="mt-7 h-10 min-w-32 rounded-lg bg-[#335fff] px-6 text-sm font-bold text-white transition hover:bg-[#244be0]">Done</button>
            </div>
          ) : (
          <>
          <div className="flex items-center justify-between gap-3">
            <h2 id="gift-title" className="text-lg font-bold">Gift {item.name}</h2>
            <button type="button" onClick={() => { setGiftOpen(false); setGiftManualMode(false) }} aria-label="Close" className="rounded-lg px-2 py-1 text-xl hover:bg-secondary">×</button>
          </div>
          {giftSelectedPlayer ? (
            <div className="mt-5 flex flex-col items-center text-center">
              <img src={itemImage} alt={item.name} className="size-24 object-contain" />
              <h3 className="mt-2 text-lg font-bold">{item.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/80"><RobuxIcon className="size-4" /> Gift cost: {(id === '192' || slug.toLowerCase().includes('korblox') ? 17000 : id === '201' || slug.toLowerCase().includes('headless') ? 31000 : item.price ?? 0).toLocaleString('en-US')} Robux</p>
              <p className="text-xs text-white/60">Your balance: {balance.toLocaleString('en-US')} Robux</p>
              <div className="mt-3 flex items-center gap-3">
                {giftSelectedPlayer.avatarUrl ? <img src={giftSelectedPlayer.avatarUrl} alt={`Avatar de ${giftSelectedPlayer.displayName}`} onError={(event) => { const image = event.currentTarget; image.style.display = 'none'; const fallback = image.nextElementSibling as HTMLElement | null; if (fallback) fallback.style.display = 'flex' }} className="size-12 rounded-full object-cover" /> : null}<span aria-hidden="true" style={{display: giftSelectedPlayer.avatarUrl ? 'none' : 'flex'}} className="size-12 items-center justify-center rounded-full bg-indigo-500/30 text-sm font-bold text-white">{giftSelectedPlayer.displayName.slice(0, 2).toUpperCase()}</span>
                <div className="text-left">
                  <p className="flex items-center gap-1.5 font-semibold">{giftSelectedPlayer.displayName}{giftSelectedPlayer.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</p>
                  <p className="text-sm text-white/70">@{giftSelectedPlayer.name}</p>
                </div>
              </div>
{giftManualMode ? (
                <>
                  <button type="button" onClick={() => { setGiftConfirmOpen(true); setGiftMessage('') }} disabled={giftSending} className="mt-5 flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg bg-[#335fff] px-6 text-sm font-bold text-white transition hover:bg-[#244be0] disabled:opacity-70">
                    {giftSending ? 'Sending…' : <><img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg" alt="" aria-hidden="true" className="size-4 brightness-0 invert" /><span>Continue</span></>}
                  </button>
                  <button type="button" onClick={() => { setGiftSelectedPlayer(null); setGiftConfirmOpen(false); setGiftMessage(''); setGiftSearchMessage('') }} className="mt-3 text-xs text-white/70 underline hover:text-white">Choose another player</button>
                  {giftConfirmOpen && <div className="mt-4 w-full rounded-lg border border-white/20 bg-black/30 p-3 text-left"><p className="font-bold text-white">Confirm gift?</p><p className="mt-1 text-sm text-white/75">Send {item.name} to @{giftSelectedPlayer.name} for {(id === '192' || slug.toLowerCase().includes('korblox') ? 17000 : id === '201' || slug.toLowerCase().includes('headless') ? 31000 : item.price ?? 0).toLocaleString('en-US')} Robux?</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => setGiftConfirmOpen(false)} className="h-10 flex-1 rounded-lg border border-white/20 text-sm font-semibold">Cancel</button><button type="button" onClick={() => { setGiftConfirmOpen(false); void continueGift() }} disabled={giftSending} className="h-10 flex-1 rounded-lg bg-[#335fff] text-sm font-bold disabled:opacity-60">Confirm</button></div></div>}
                </>
              ) : (
                <div className="mt-4 w-full rounded-lg border border-white/15 bg-black/25 p-3 text-left text-sm text-white/85">
                  {giftAutoStage === 'confirm' ? (
                    <><p className="font-bold">Confirm gift?</p><p className="mt-1">Aperçu : offrir {item.name} à @{giftSelectedPlayer.name}.</p><p className="mt-2 text-xs text-white/60">Étape visuelle seulement — aucun cadeau réel n’est envoyé.</p></>
                  ) : giftAutoStage === 'result' ? (
                    <><p className="font-bold text-emerald-300">{item.name} — cadeau aperçu terminé</p><p className="mt-1">Pour @{giftSelectedPlayer.name}. Aucun cadeau réel envoyé et aucun Robux retiré.</p></>
                  ) : (
                    <p className="text-xs text-white/75">Recherche de comptes Roblox réels dont le nom contient des chiffres…</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">Search for a Roblox player to send this gift.</p>
              <div className="mt-4">
                <input value={giftUsername} onChange={(event) => { setGiftUsername(event.target.value); setGiftSearchMessage(''); setGiftPlayers([]); setGiftSelectedPlayer(null); setGiftMessage(''); setGiftSuccess(false) }} placeholder=" " aria-label="Roblox player username" className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-[#335fff]" />
              </div>
              {giftPlayers.length > 0 && <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                {giftPlayers.map((player) => <button type="button" key={player.id} onClick={() => { setGiftSelectedPlayer(player); setGiftConfirmOpen(false); setGiftMessage('') }} className="flex w-full items-center justify-between rounded-lg border border-white/15 p-3 text-left transition hover:border-[#8ca0ff]/70 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#8ca0ff]">
                  <span className="flex min-w-0 items-center gap-3">
                    {player.avatarUrl ? <img src={player.avatarUrl} alt={`Avatar de ${player.displayName}`} onError={(event) => { const image = event.currentTarget; image.style.display = 'none'; const fallback = image.nextElementSibling as HTMLElement | null; if (fallback) fallback.style.display = 'flex' }} className="size-12 shrink-0 rounded-full bg-white/10 object-cover" /> : null}<span aria-hidden="true" style={{display: player.avatarUrl ? 'none' : 'flex'}} className="size-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-sm font-bold text-white">{player.displayName.slice(0, 2).toUpperCase()}</span>
                    <span className="min-w-0"><span className="flex min-w-0 items-center gap-1.5 truncate font-semibold">{player.displayName}{player.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</span><span className="block truncate text-sm text-white/70">@{player.name}</span></span>
                  </span>
                </button>)}
              </div>}
              {giftSearching && giftSearchMessage && <p className="mt-4 text-sm text-muted-foreground">{giftSearchMessage}</p>}
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
