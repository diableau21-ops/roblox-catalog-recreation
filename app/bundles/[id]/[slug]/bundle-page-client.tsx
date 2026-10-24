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
  const [giftLoadingStep, setGiftLoadingStep] = useState(0)
  const [giftSuccess, setGiftSuccess] = useState(false)
  const [giftManualMode, setGiftManualMode] = useState(false)
  const [giftReview, setGiftReview] = useState(false)
  const [giftBundle, setGiftBundle] = useState<'korblox' | 'headless' | 'combo'>('headless')
  const giftCost = giftBundle === 'korblox' ? 17000 : giftBundle === 'headless' ? 31000 : 48000
  const continueGift = async () => {
    if (!giftSelectedPlayer || giftSending) return
    if (balance < giftCost) {
      setGiftMessage(`Not enough Robux. This item costs ${giftCost.toLocaleString('en-US')} Robux, and your balance is ${balance.toLocaleString('en-US')}.`)
      return
    }
    setGiftSending(true)
    setGiftLoadingStep(0)
    setGiftMessage('')
    const stages = [
      { step: 4, delay: 1800 },
    ]
    for (const stage of stages) {
      await new Promise((resolve) => window.setTimeout(resolve, stage.delay))
      setGiftLoadingStep(stage.step)
    }
    setBalance((current) => current - giftCost)
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
      setGiftSearchMessage(players.length
        ? `${players.length} account(s) found. Choose the account you want from the list.`
        : `No Roblox players found for “${keyword}”.`)
    } catch {
      setGiftPlayers([])
      setGiftSearchMessage('Could not load players. Roblox may be temporarily unavailable or blocking this request.')
    } finally {
      setGiftSearching(false)
    }
  }
  useEffect(() => {
    if (!giftOpen || giftSelectedPlayer || giftSuccess || giftSending) return
    const keyword = giftUsername.trim()
    if (keyword.length < 3) return
    const timer = window.setTimeout(() => { void searchGiftPlayers() }, 500)
    return () => window.clearTimeout(timer)
  }, [giftUsername, giftOpen, giftSelectedPlayer, giftSuccess, giftSending])

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
  const canGift = !isEightBit
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
              <div className="flex flex-wrap items-center gap-2.5"><h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{item.name}</h1>{canGift && <button type="button" onClick={() => { setGiftManualMode(false); setGiftOpen(true); setGiftSuccess(false); setGiftMessage(""); setGiftSearchMessage(""); setGiftSelectedPlayer(null); setGiftPlayers([]); setGiftUsername("") }} aria-label="Open gift cart" title="Gift" className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:bg-white/10"><ShoppingCart aria-hidden="true" className="size-5" /></button>}</div>
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
                <button type="button" onClick={() => { setGiftManualMode(false); setGiftSuccess(false); setGiftMessage(''); setGiftSearchMessage(''); setGiftSelectedPlayer(null); setGiftPlayers([]); setGiftUsername(''); setGiftReview(false); setGiftOpen(true) }} className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-5 text-base font-semibold transition hover:bg-secondary/70"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg" alt="" aria-hidden="true" className="size-4 brightness-0 invert" /><span>Gift</span></button>
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
          {isKorblox && <section className="mt-8 w-full max-w-[900px] overflow-hidden rounded-xl border border-white/10 bg-[#202020] p-4 text-white">
            <h2 className="mb-4 text-xl font-bold">Recommendations</h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {[
                { id: '154', name: 'Korblox Lord of Death', price: '4,230', image: 'https://tr.rbxcdn.com/30DAY-Avatar-E130600A8A15FA27C8DD03FE92687684-Png/150/150/Avatar/Webp/noFilter', href: 'https://www.roblox.com/bundles/154/Korblox-Lord-of-Death' },
                { id: '295', name: 'Skeleton', price: '470', image: 'https://tr.rbxcdn.com/30DAY-Avatar-9CB20F0A583EFE53F52F18CC445ED252-Png/150/150/Avatar/Webp/noFilter', href: 'https://www.roblox.com/bundles/295/Skeleton' },
                { id: '306', name: 'Pirate Swashbuckler', price: '376', image: 'https://tr.rbxcdn.com/30DAY-Avatar-36E71AFFC4409FB8948630D44D631338-Png/150/150/Avatar/Webp/noFilter', href: 'https://www.roblox.com/bundles/306/Pirate-Swashbuckler' },
                { id: '501', name: 'Oinan Thickhoof', price: '235', image: 'https://tr.rbxcdn.com/30DAY-Avatar-9F3055134576927E4B4F5D6BC93F6B27-Png/150/150/Avatar/Webp/noFilter', href: 'https://www.roblox.com/bundles/501/Oinan-Thickhoof' },
                { id: '591', name: 'Mr. Toilet', price: '329', image: 'https://tr.rbxcdn.com/30DAY-Avatar-F292BDA4BD92D143B4C9397E0DEE6108-Png/150/150/Avatar/Webp/noFilter', href: 'https://www.roblox.com/bundles/591/Mr-Toilet' },
                { id: '870', name: 'Iron Bulb', price: '250', image: 'https://tr.rbxcdn.com/30DAY-Avatar-CCEE2D8513B25B66957A137905454A8B-Png/150/150/Avatar/Webp/noFilter', href: 'https://www.roblox.com/bundles/870/Iron-Bulb' },
                { id: '1628', name: 'Doll Avatar (Fashion)', price: '', image: 'https://tr.rbxcdn.com/30DAY-Avatar-78A1C588B417A08956AA29A097AB0974-Png/150/150/Avatar/Webp/noFilter', href: 'https://www.roblox.com/bundles/1628/Doll-Avatar-Fashion' },
              ].map((recommendation) => <a key={recommendation.id} href={recommendation.href} target="_blank" rel="noreferrer" className="group min-w-0 overflow-hidden rounded-lg bg-[#232323] transition hover:bg-[#303030]">
                <div className="aspect-square overflow-hidden bg-[#303030]">
                  <img src={recommendation.image} alt={recommendation.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                </div>
                <div className="p-2">
                  <p className="line-clamp-2 min-h-8 text-xs font-semibold text-white">{recommendation.name}</p>
                  {recommendation.price && <p className="mt-1 flex items-center gap-1 text-xs font-bold text-white"><RobuxIcon />{recommendation.price}</p>}
                </div>
              </a>)}
            </div>
          </section>}
          {isKorblox && <section className="mt-8 w-full max-w-[900px] overflow-hidden rounded-xl border border-white/10 bg-[#202020] p-4 text-white">
            <h2 className="mb-4 text-xl font-bold">Sponsored</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {[
                { id: '139571479624081', name: 'Sam Shoulder Pal', creator: 'past tense.', price: '60', image: 'https://tr.rbxcdn.com/180DAY-2105baff9f1be3577e1d6819a08e09fe/150/150/ShoulderAccessory/Webp/noFilter', href: 'https://www.roblox.com/catalog/139571479624081/Sam-Shoulder-Pal' },
                { id: '113170671801700', name: 'Alien with a Cap', creator: 'Little Luxe Co.', price: '135', image: 'https://tr.rbxcdn.com/180DAY-aca8845fc60bf7e0c37501515327ec4c/150/150/BackAccessory/Webp/noFilter', href: 'https://www.roblox.com/catalog/113170671801700/Alien-with-a-Cap' },
                { id: '18529518454', name: '🍀Yellow Duck RainCoat', creator: 'LILY & LIFFY', price: '65', image: 'https://tr.rbxcdn.com/180DAY-f3c03a35f845c1b5738db45b68edd465/150/150/JacketAccessory/Webp/noFilter', href: 'https://www.roblox.com/catalog/18529518454/Yellow-Duck-RainCoat' },
                { id: '131251657230383', name: 'Unkept Spiky Vkei Anime Boy Hair (Black)', creator: 'angelvamp', price: '60', image: 'https://tr.rbxcdn.com/180DAY-b6e3563fbf077c1e6f9084f113275f1e/150/150/HairAccessory/Webp/noFilter', href: 'https://www.roblox.com/catalog/131251657230383/Unkept-Spiky-Vkei-Anime-Boy-Hair-Black' },
                { id: '137694910373760', name: 'Christmas', creator: "Peachieb's Christmas", price: '60', image: 'https://tr.rbxcdn.com/180DAY-10c7f793260f21f7a1f3aac264cb6a68/150/150/HairAccessory/Webp/noFilter', href: 'https://www.roblox.com/catalog/137694910373760/Christmas' },
                { id: '106888386738089', name: 'Black Cat', creator: 'The Greatest UGC', price: '60', image: 'https://tr.rbxcdn.com/180DAY-66d4687db750357bf57589d5b59dbdb/150/150/WaistAccessory/Webp/noFilter', href: 'https://www.roblox.com/catalog/106888386738089/Black-Cat' },
                { id: '120455941297782', name: 'Animated Rainbow Prism Devil Horns (Glowing)', creator: 'SEE GOD', price: '500', image: 'https://tr.rbxcdn.com/180DAY-21aa1c362485ddc86f4a11d77c4c6e5a/150/150/Hat/Webp/noFilter', href: 'https://www.roblox.com/catalog/120455941297782/Animated-Rainbow-Prism-Devil-Horns-Glowing' },
              ].map((sponsored) => <a key={sponsored.id} href={sponsored.href} target="_blank" rel="noreferrer" className="group min-w-0 overflow-hidden rounded-lg bg-[#232323] transition hover:bg-[#303030]">
                <div className="aspect-square overflow-hidden bg-[#303030]"><img src={sponsored.image} alt={sponsored.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.03]" /></div>
                <div className="p-2"><p className="line-clamp-2 min-h-8 text-xs font-semibold">{sponsored.name}</p><p className="mt-1 truncate text-[10px] text-white/60">By {sponsored.creator}</p><p className="mt-1 flex items-center gap-1 text-xs font-bold"><RobuxIcon />{sponsored.price}</p></div>
              </a>)}
            </div>
          </section>}
          {isKorblox && <section className="mt-8 w-full max-w-[900px] overflow-hidden rounded-xl border border-white/10 bg-[#202020] p-4 text-white">
            <h2 className="mb-4 text-xl font-bold">Included Items</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { id: '139607570', name: 'Korblox Deathspeaker Left Arm', type: 'Left Arm', image: 'https://tr.rbxcdn.com/180DAY-a1bf01bc29296997905589e5a283c48a/150/150/LeftArm/Webp/noFilter', href: 'https://www.roblox.com/catalog/139607570/Korblox-Deathspeaker-Left-Arm' },
                { id: '139607625', name: 'Korblox Deathspeaker Right Arm', type: 'Right Arm', image: 'https://tr.rbxcdn.com/180DAY-9e3bf01696f41c56d3dac309336e7b0e/150/150/RightArm/Webp/noFilter', href: 'https://www.roblox.com/catalog/139607625/Korblox-Deathspeaker-Right-Arm' },
                { id: '139607673', name: 'Korblox Deathspeaker Left Leg', type: 'Left Leg', image: 'https://tr.rbxcdn.com/180DAY-f51cd53ee6a4553a20cd755f756df418/150/150/LeftLeg/Webp/noFilter', href: 'https://www.roblox.com/catalog/139607673/Korblox-Deathspeaker-Left-Leg' },
                { id: '139607718', name: 'Korblox Deathspeaker Right Leg', type: 'Right Arm', image: 'https://tr.rbxcdn.com/180DAY-143642d519de55c2cfa50b3473a0ecc6/150/150/RightLeg/Webp/noFilter', href: 'https://www.roblox.com/catalog/139607718/Korblox-Deathspeaker-Right-Leg' },
                { id: '139607770', name: 'Korblox Deathspeaker Torso', type: 'Torso', image: 'https://tr.rbxcdn.com/180DAY-f79a974f6df791c33572eff9cb247345/150/150/Torso/Webp/noFilter', href: 'https://www.roblox.com/catalog/139607770/Korblox-Deathspeaker-Torso' },
                { id: '139610147', name: 'Korblox Deathspeaker Hood', type: 'Hat · Off Sale', image: 'https://tr.rbxcdn.com/180DAY-06b054ae2a3be5025665371a146c3add/150/150/Hat/Webp/noFilter', href: 'https://www.roblox.com/catalog/139610147/Korblox-Deathspeaker-Hood' },
              ].map((included) => <a key={included.id} href={included.href} target="_blank" rel="noreferrer" className="group min-w-0 overflow-hidden rounded-lg bg-[#232323] transition hover:bg-[#303030]">
                <div className="aspect-square overflow-hidden bg-[#303030]"><img src={included.image} alt={included.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.03]" /></div>
                <div className="p-2"><p className="line-clamp-2 min-h-8 text-xs font-semibold">{included.name}</p><p className="mt-1 text-[10px] text-white/60">{included.type}</p></div>
              </a>)}
            </div>
          </section>}
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
        <section role="dialog" aria-modal="true" aria-labelledby="gift-title" className="relative z-10 my-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#41414b] bg-[#17171c] p-5 text-[#f7f6f2] shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}>
          <div className="relative z-10">
          {giftSuccess ? (
            <div className="py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Roblox_Plus.svg" alt="" aria-hidden="true" className="size-6 shrink-0 brightness-0 invert" />
                  <h2 id="gift-title" className="text-xl font-extrabold">Send an item</h2>
                </div>
                <span className="flex shrink-0 items-center gap-2 text-lg font-bold text-white/80"><RobuxIcon className="size-5" />{balance.toLocaleString('en-US')}</span>
              </div>
              <div className="mx-auto mt-8 flex size-16 items-center justify-center rounded-full border-2 border-white bg-transparent text-white">
                <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
              </div>
              <p className="mt-4 text-center text-sm text-white/75">You sent {giftBundle === 'korblox' ? 'Korblox Deathspeaker' : giftBundle === 'headless' ? 'Headless Horseman' : 'Headless + Korblox'} to @{giftSelectedPlayer?.name}</p>
              <button type="button" onClick={() => { setGiftOpen(false); setGiftSuccess(false); setGiftMessage(''); setGiftSearchMessage(''); setGiftUsername(''); setGiftSelectedPlayer(null); setGiftPlayers([]); setGiftSending(false); setGiftReview(false); setGiftManualMode(false) }} className="mt-6 h-14 w-full rounded-xl bg-[#335fff] px-7 text-2xl font-extrabold text-white transition hover:bg-[#244be0]">OK</button>
            </div>
          ) : giftSending ? (
            <div className="py-8 text-center">
              <h2 id="gift-title" className="text-2xl font-extrabold">Sending gift</h2>
              <div className="mt-7 flex flex-col items-center">
                {giftSelectedPlayer?.avatarUrl ? <img src={giftSelectedPlayer.avatarUrl} alt="" className="size-24 rounded-full bg-[#303030] object-cover" /> : <span className="flex size-24 items-center justify-center rounded-full bg-[#303030] text-2xl font-bold">{(giftSelectedPlayer?.displayName || giftSelectedPlayer?.name || '?').slice(0,2).toUpperCase()}</span>}
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xl font-bold">{giftSelectedPlayer?.displayName}{giftSelectedPlayer?.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</p>
                <p className="text-sm text-white/60">@{giftSelectedPlayer?.name}</p>
              </div>
              <div className="mx-auto mt-8 size-12 animate-spin rounded-full border-4 border-white/15 border-t-[#146bff]" role="status" aria-label="Sending" />
              <p className="mt-4 text-sm text-white/65">Sending gift to @{giftSelectedPlayer?.name}…</p>
            </div>
          ) : (
          <>
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-widest text-[#a7a7b3]">Gift</p><h2 id="gift-title" className="mt-1 text-2xl font-extrabold">Send Gift</h2></div>
            <button type="button" onClick={() => { setGiftOpen(false); setGiftManualMode(false) }} aria-label="Close" className="rounded-lg px-2 py-1 text-xl hover:bg-secondary">×</button>
          </div>
          {!giftSelectedPlayer && !giftReview && !giftManualMode ? (
            <div className="mt-5">
              <h3 className="mb-3 text-lg font-bold">Choose gift</h3>
              <button type="button" onClick={() => setGiftBundle('headless')} aria-pressed={giftBundle === 'headless'} className={`mb-3 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${giftBundle === 'headless' ? 'border-[#146bff] bg-[#146bff]/10 ring-1 ring-[#146bff]' : 'border-white/15 hover:border-[#146bff]'}`}>
                <img src="/items/headless.png" alt="Headless Horseman" className="size-20 shrink-0 rounded-lg bg-[#202020] object-contain p-1" />
                <span className="min-w-0 flex-1"><span className="block font-bold">Headless Horseman</span><span className="mt-1 block text-sm text-white/55">Headless Horseman bundle</span><span className="mt-2 flex items-center gap-1.5 text-sm font-extrabold"><RobuxIcon className="size-4" />31,000</span></span>
              </button>
              <button type="button" onClick={() => setGiftBundle('combo')} aria-pressed={giftBundle === 'combo'} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${giftBundle === 'combo' ? 'border-[#146bff] bg-[#146bff]/10 ring-1 ring-[#146bff]' : 'border-white/15 hover:border-[#146bff]'}`}>
                <span className="flex size-20 shrink-0 items-center justify-center gap-0.5 rounded-lg bg-[#202020] p-1"><img src="/items/headless.png" alt="Headless Horseman" className="h-16 min-w-0 flex-1 object-contain" /><img src="/items/korblox.png" alt="Korblox Deathspeaker" className="h-16 min-w-0 flex-1 object-contain" /></span>
                <span className="min-w-0 flex-1"><span className="block font-bold">Headless + Korblox</span><span className="mt-1 block text-sm text-white/55">Both bundles together</span><span className="mt-2 flex items-center gap-1.5 text-sm font-extrabold"><RobuxIcon className="size-4" />48,000</span></span>
              </button>
              <button type="button" onClick={() => { setGiftUsername(''); setGiftSelectedPlayer(null); setGiftPlayers([]); setGiftSearchMessage(''); setGiftMessage(''); setGiftReview(false); setGiftManualMode(true) }} className="mt-4 h-12 w-full rounded-xl bg-[#146bff] text-base font-extrabold">Next</button>
            </div>
          ) : giftSelectedPlayer && giftReview ? (
            <div className="mt-6">
              <div className="flex flex-col items-center text-center">
                {giftSelectedPlayer.avatarUrl ? <img src={giftSelectedPlayer.avatarUrl} alt="" className="size-24 rounded-full bg-[#303030] object-cover" /> : <span className="flex size-24 items-center justify-center rounded-full bg-[#303030] text-2xl font-bold">{giftSelectedPlayer.displayName.slice(0,2).toUpperCase()}</span>}
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xl font-bold">{giftSelectedPlayer.displayName}{giftSelectedPlayer.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</p>
                <p className="text-sm text-white/60">@{giftSelectedPlayer.name}</p>
              </div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center gap-4 rounded-xl bg-[#292929] p-3">
                  <img src={giftBundle === 'korblox' ? '/items/korblox.png' : '/items/headless.png'} alt="" className="size-16 rounded-lg bg-[#202020] object-contain p-1" />
                  <div className="min-w-0 flex-1"><p className="font-bold">{giftBundle === 'korblox' ? 'Korblox Deathspeaker' : giftBundle === 'headless' ? 'Headless Horseman' : 'Headless + Korblox'}</p><p className="mt-1 text-sm text-white/60">Gift for @{giftSelectedPlayer.name}</p><p className="mt-2 flex items-center gap-1.5 text-sm font-extrabold"><RobuxIcon className="size-4" />{giftCost.toLocaleString('en-US')} Robux</p></div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button type="button" disabled={giftSending} onClick={() => { setGiftMessage(''); void continueGift() }} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#146bff] text-base font-extrabold disabled:cursor-wait disabled:opacity-80">{giftSending ? 'Sending…' : 'Send'}</button>
                  <button type="button" onClick={() => {setGiftReview(false);setGiftMessage('')}} className="h-12 flex-1 rounded-xl border border-white/20 text-base font-bold">Edit</button>
                </div>
                {giftMessage && <p role="status" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{giftMessage}</p>}
              </div>
            </div>
          ) : giftSelectedPlayer ? (
            <div className="mt-5 flex flex-col items-center text-center">
              <div className="flex w-full items-center justify-center gap-3 border-b border-white/10 pb-5">
                {giftSelectedPlayer.avatarUrl ? <img src={giftSelectedPlayer.avatarUrl} alt="" className="size-16 rounded-full bg-[#303030] object-cover" /> : <span className="flex size-16 items-center justify-center rounded-full bg-[#303030] text-xl font-bold">{giftSelectedPlayer.displayName.slice(0,2).toUpperCase()}</span>}
                <div className="text-left"><p className="flex items-center gap-1.5 text-lg font-bold">{giftSelectedPlayer.displayName}{giftSelectedPlayer.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</p><p className="text-sm text-white/60">@{giftSelectedPlayer.name}</p></div>
              </div>
              <div className="mt-5 w-full overflow-hidden rounded-xl border border-white/10 bg-[#202020] text-left">
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-[#171717]">
                  <img src={giftBundle === 'korblox' ? '/items/korblox.png' : '/items/headless.png'} alt={giftBundle === 'korblox' ? 'Korblox Deathspeaker' : 'Headless Horseman'} loading="eager" fetchPriority="high" className="h-full w-full object-contain p-3" />
                </div>
                <div className="p-4">
                  <p className="text-lg font-bold">{giftBundle === 'korblox' ? 'Korblox Deathspeaker' : 'Headless Horseman'}</p>
                  <p className="mt-1 text-sm text-white/60">Recipient: @{giftSelectedPlayer.name}</p>
                </div>
              </div>
              <button type="button" onClick={() => { setGiftMessage(''); setGiftReview(true) }} disabled={giftSending} className="mt-5 h-12 w-full rounded-lg bg-[#335fff] text-base font-extrabold text-white transition-colors hover:bg-[#244be0] disabled:opacity-50">Next</button>
              <button type="button" onClick={() => {setGiftSelectedPlayer(null);setGiftReview(false);setGiftMessage('')}} className="mt-3 text-xs text-white/65 underline">Choose another player</button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-[#a8a8b0]">Choose an item, then select the Roblox player.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setGiftBundle('korblox')} aria-pressed={giftBundle === 'korblox'} className={`overflow-hidden rounded-xl border text-left transition ${giftBundle === 'korblox' ? 'border-[#335fff] bg-[#335fff]/15 ring-1 ring-[#335fff]' : 'border-white/15 bg-white/[0.03] hover:bg-white/[0.07]'}`}>
                  <div className="flex aspect-square w-full items-center justify-center bg-[#202020]">
                    <img src="/items/korblox.png" alt="Korblox Deathspeaker" loading="eager" fetchPriority="high" className="h-full w-full object-contain p-2" />
                  </div>
                  <span className="block px-3 pb-3 pt-2 text-sm font-bold">Korblox Deathspeaker</span>
                </button>
                <button type="button" onClick={() => setGiftBundle('headless')} aria-pressed={giftBundle === 'headless'} className={`overflow-hidden rounded-xl border text-left transition ${giftBundle === 'headless' ? 'border-[#335fff] bg-[#335fff]/15 ring-1 ring-[#335fff]' : 'border-white/15 bg-white/[0.03] hover:bg-white/[0.07]'}`}>
                  <div className="flex aspect-square w-full items-center justify-center bg-[#202020]">
                    <img src="/items/headless.png" alt="Headless Horseman" loading="eager" fetchPriority="high" className="h-full w-full object-contain p-2" />
                  </div>
                  <span className="block px-3 pb-3 pt-2 text-sm font-bold">Headless Horseman</span>
                </button>
              </div>
              <div className="mt-4">
                <input value={giftUsername} onChange={(event) => { setGiftUsername(event.target.value); setGiftSearchMessage(''); setGiftPlayers([]); setGiftSelectedPlayer(null); setGiftMessage(''); setGiftSuccess(false) }} placeholder="Enter a Roblox username" aria-label="Roblox player username" className="h-12 w-full rounded-lg border border-[#34343b] bg-[#202024] px-3 text-sm text-[#f7f6f2] outline-none placeholder:text-[#85858f] focus:border-[#7183ff] focus:ring-2 focus:ring-[#335fff]/30" />
              </div>
              {giftPlayers.length > 0 && <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                {giftPlayers.map((player) => <button key={player.id} type="button" onClick={() => { setGiftSelectedPlayer(player); setGiftMessage('') }} className="flex w-full items-center justify-between rounded-lg border border-white/15 p-3 text-left transition hover:border-[#335fff] hover:bg-white/5">
                  <span className="flex min-w-0 items-center gap-3">
                    {player.avatarUrl ? <img src={player.avatarUrl} alt={`Avatar de ${player.displayName}`} onError={(event) => { const image = event.currentTarget; image.style.display = 'none'; const fallback = image.nextElementSibling as HTMLElement | null; if (fallback) fallback.style.display = 'flex' }} className="size-12 shrink-0 rounded-full bg-white/10 object-cover" /> : null}<span aria-hidden="true" style={{display: player.avatarUrl ? 'none' : 'flex'}} className="size-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-sm font-bold text-white">{player.displayName.slice(0, 2).toUpperCase()}</span>
                    <span className="min-w-0"><span className="flex min-w-0 items-center gap-1.5 truncate font-semibold">{player.displayName}{player.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</span><span className="block truncate text-sm text-white/70">@{player.name}</span></span>
                  </span>
                  <span className="text-sm font-semibold text-[#8ca0ff]">Select</span>
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
      <footer className="mt-8 w-full border-t border-white/10 bg-[#191919] px-4 py-5 text-white/75">
        <div className="mx-auto max-w-[1000px]">
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold sm:text-sm">
            <a className="hover:text-white" href="https://www.roblox.com/info/about-us?locale=en_us" target="_blank" rel="noreferrer">About Us</a>
            <a className="hover:text-white" href="https://www.roblox.com/info/jobs?locale=en_us" target="_blank" rel="noreferrer">Jobs</a>
            <a className="hover:text-white" href="https://www.roblox.com/info/blog?locale=en_us" target="_blank" rel="noreferrer">Newsroom</a>
            <a className="hover:text-white" href="https://www.roblox.com/info/parents?locale=en_us" target="_blank" rel="noreferrer">Parents</a>
            <a className="hover:text-white" href="https://www.roblox.com/giftcards?locale=en_us" target="_blank" rel="noreferrer">Buy Gift Cards</a>
            <a className="hover:text-white" href="https://www.roblox.com/info/help?locale=en_us" target="_blank" rel="noreferrer">Help</a>
            <a className="hover:text-white" href="https://www.roblox.com/info/terms?locale=en_us" target="_blank" rel="noreferrer">Terms</a>
            <a className="hover:text-white" href="https://www.roblox.com/info/accessibility?locale=en_us" target="_blank" rel="noreferrer">Accessibility</a>
            <a className="hover:text-white" href="https://www.roblox.com/info/privacy?locale=en_us" target="_blank" rel="noreferrer">Privacy</a>
            <button type="button" className="hover:text-white" onClick={() => window.open('https://www.roblox.com/info/privacy?locale=en_us', '_blank', 'noopener,noreferrer')}>Your Privacy Choices <span aria-hidden="true">▧</span></button>
            <a className="hover:text-white" href="https://www.roblox.com/sitemap?locale=en_us" target="_blank" rel="noreferrer">Sitemap</a>
          </nav>
          <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-3 sm:flex-row">
            <label htmlFor="footer-language" className="text-xs font-semibold text-white/80">Language</label>
            <select id="footer-language" aria-label="Change language" defaultValue="en-us" onChange={(event) => { const locale = event.target.value; const url = new URL(window.location.href); url.searchParams.set('locale', locale); window.location.href = url.toString() }} className="min-w-40 rounded-md border border-white/15 bg-[#252525] px-2.5 py-1.5 text-xs text-white outline-none focus:border-white/40">
              <option value="en-us">English (United States)</option>
              <option value="fr-ca">Français (Canada)</option>
              <option value="fr-fr">Français (France)</option>
              <option value="es-es">Español</option>
              <option value="pt-br">Português (Brasil)</option>
              <option value="de-de">Deutsch</option>
              <option value="ja-jp">日本語</option>
              <option value="ko-kr">한국어</option>
              <option value="zh-cn">简体中文</option>
            </select>
          </div>
          <p className="mt-3 text-center text-[10px] leading-4 text-white/55 sm:text-left sm:text-xs">©2026 Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.</p>
        </div>
      </footer>
    </main>
  )
}
