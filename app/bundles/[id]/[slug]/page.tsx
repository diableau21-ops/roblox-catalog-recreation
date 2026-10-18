'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import { catalogItems } from '@/lib/catalog-data'
import { VerifiedBadge } from '@/components/catalog/verified-badge'
import { Price, RobuxIcon } from '@/components/catalog/robux-icon'
import { Korblox3D } from '@/components/catalog/korblox-3d'
import { SiteHeader } from '@/components/catalog/site-header'
import { LeftNav } from '@/components/catalog/left-nav'

const robuxOptions = [400, 800, 1700, 4500, 10000, 22500]

export default function BundlePage() {
  const params = useParams<{ id: string; slug: string }>()
  const [query, setQuery] = useState('')
  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get('q') ?? '')
  }, [])
  const [balance, setBalance] = useState(1250)
  const [giftOpen, setGiftOpen] = useState(false)
  const [robuxShopOpen, setRobuxShopOpen] = useState(false)
  const [selectedRobux, setSelectedRobux] = useState(800)
  const [show2D, setShow2D] = useState(false)
  const [tryOn, setTryOn] = useState(false)
  const notify = (_msg: string) => {}
  const isHeadless = params.id === '201' || params.slug?.toLowerCase().includes('headless')
  const item = catalogItems.find((entry) => entry.id === (isHeadless ? 13 : 10))

  if (!item) return <main className="min-h-screen bg-background p-8 text-foreground">Bundle not found.</main>

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader
        balance={balance}
        query={query}
        onQueryChange={setQuery}
        onBuyRobux={() => setRobuxShopOpen(true)}
        onNotify={notify}
      />
      <LeftNav
        onNotify={notify}
        onBuyRobux={() => setRobuxShopOpen(true)}
      />

      <div className="ml-[220px] max-w-[calc(100%-220px)] px-4 py-8 md:px-8">
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className={`relative aspect-square overflow-hidden rounded-xl border border-[#3b3b3b] ${!isHeadless ? 'bg-[#232323]' : 'bg-thumb'}`}>
            <div className={`absolute inset-0 ${show2D || isHeadless ? 'block' : 'hidden'}`}>
              <Image src={item.image || '/placeholder.svg'} alt={item.name} fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-contain p-6" />
            </div>
            {!isHeadless && <div className={`absolute inset-0 ${show2D ? 'invisible' : 'visible'}`}><Korblox3D /></div>}
            {!isHeadless && <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
              <button type="button" onClick={() => setTryOn((value) => !value)} aria-pressed={tryOn} className={`rounded-lg px-4 py-2 text-sm font-bold shadow-lg transition ${tryOn ? 'bg-[#00b06f] text-white' : 'bg-white text-[#222] hover:bg-gray-200'}`}>{tryOn ? 'Wearing' : 'Try On'}</button>
              <button type="button" onClick={() => setShow2D((value) => !value)} aria-pressed={show2D} className="rounded-lg border border-white/20 bg-[#333] px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-[#444]">{show2D ? '3D' : '2D'}</button>
            </div>}
          </div>

          <div className="flex flex-col gap-5 py-1">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Bundle</p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{item.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                By <span className="font-semibold text-foreground">Roblox</span>
                <VerifiedBadge className="size-4" />
              </p>
              <div className="mt-3 h-px w-full bg-border" />
            </div>

            {isHeadless && <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>}

            <div className="mt-2 flex w-full max-w-[400px] flex-col gap-3 self-end">
              <div className="text-left text-sm font-bold"><Price price={item.price} /></div>
              <button type="button" onClick={() => {}} className="flex h-11 items-center justify-center rounded-md bg-[#00b06f] px-5 text-base font-bold text-white transition hover:bg-[#009e63]">Owned</button>
              <button type="button" onClick={() => setGiftOpen(true)} className="flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-5 text-base font-semibold transition hover:bg-secondary/70"><Gift className="size-4" /> Gift</button>
            </div>

            {!isHeadless && <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 border-t border-border pt-5 text-sm">
              <dt className="font-semibold">Tradable</dt><dd>No</dd>
              <dt className="font-semibold">Type</dt><dd>Characters</dd>
              <dt className="font-semibold">Placement</dt><dd>Full Body</dd>
              <dt className="font-semibold">Created</dt><dd>Aug 14, 2018</dd>
              <dt className="font-semibold">Description</dt><dd className="leading-6">His tribe is widely considered the best and strongest of the twelve Korblox tribes. No one dares challenge his authority.</dd>
            </dl>}
          </div>
        </section>
      </div>

      {robuxShopOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" onClick={() => setRobuxShopOpen(false)}>
        <section role="dialog" aria-modal="true" aria-labelledby="robux-title" className="w-full max-w-lg rounded-xl border border-border bg-card p-6 text-foreground shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between gap-4">
            <h2 id="robux-title" className="text-2xl font-bold">Choisir des Robux</h2>
            <button type="button" onClick={() => setRobuxShopOpen(false)} aria-label="Fermer" className="rounded-lg px-3 py-1 text-2xl hover:bg-secondary">×</button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Sélectionne la quantité que tu veux.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {robuxOptions.map((amount) => <button key={amount} type="button" onClick={() => setSelectedRobux(amount)} aria-pressed={selectedRobux === amount} className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border p-3 font-bold transition hover:bg-secondary ${selectedRobux === amount ? 'border-[#00b06f] bg-[#00b06f]/10 ring-2 ring-[#00b06f]' : 'border-border'}`}>
              <span className="flex items-center gap-2"><RobuxIcon />{amount}</span>
              <span className="text-xs font-medium text-muted-foreground">Quantité</span>
            </button>)}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">Démo seulement : aucun paiement réel n'est effectué.</p>
          <button type="button" onClick={() => { setBalance((current) => current + selectedRobux); setRobuxShopOpen(false) }} className="mt-4 h-11 w-full rounded-lg bg-[#00b06f] font-bold text-white transition hover:bg-[#009e63]">Ajouter {selectedRobux} Robux (démo)</button>
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
