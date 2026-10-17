'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Gift } from 'lucide-react'
import { catalogItems } from '@/lib/catalog-data'
import { VerifiedBadge } from '@/components/catalog/verified-badge'
import { Price, RobloxMark, RobuxIcon } from '@/components/catalog/robux-icon'

export default function BundlePage() {
  const params = useParams<{ id: string; slug: string }>()
  const [giftOpen, setGiftOpen] = useState(false)
  const [message, setMessage] = useState('')
  const isHeadless = params.id === '201' || params.slug?.toLowerCase().includes('headless')
  const item = catalogItems.find((entry) => entry.id === (isHeadless ? 13 : 10))

  if (!item) return <main className="min-h-screen bg-background p-8 text-foreground">Bundle not found.</main>

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center gap-4 border-b border-border px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-secondary">
          <ArrowLeft className="size-4" /> Marketplace
        </Link>
        <RobloxMark className="size-7" />
        <span className="text-sm text-muted-foreground">/ Bundles</span>
        {!isHeadless && <span className="ml-auto inline-flex items-center gap-1.5 text-base font-bold"><RobuxIcon className="size-5" />{item.price?.toLocaleString('en-US')}</span>}
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Marketplace</Link>
          <span className="mx-2">/</span><span>Bundles</span>
          <span className="mx-2">/</span><span className="text-foreground">{item.name}</span>
        </nav>

        <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-thumb">
            <Image src={item.image || '/placeholder.svg'} alt={item.name} fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-contain p-6" />
          </div>

          <div className="flex flex-col gap-5 py-1">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Bundle</p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{item.name}</h1>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                By <span className="font-semibold text-foreground">Roblox</span>
                <VerifiedBadge className="size-4" />
              </p>
            </div>

            {isHeadless && <div className="border-y border-border py-5">
              <p className="mb-2 text-sm text-muted-foreground">Price</p>
              <div className="text-2xl font-bold"><Price price={item.price} /></div>
            </div>}

            {isHeadless && <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>}

            <div className="mt-2 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setMessage('This is a preview of the Owned button on your demo site.')}
                className="flex h-12 items-center justify-center rounded-lg bg-[#00b06f] px-5 font-bold text-white transition hover:bg-[#009e63]"
              >
                Owned
              </button>
              <button
                type="button"
                onClick={() => setGiftOpen(true)}
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-5 font-semibold transition hover:bg-secondary/70"
              >
                <Gift className="size-4" /> Gift
              </button>
              
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

      {message && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-lg">
          {message}
          <button type="button" onClick={() => setMessage('')} className="ml-3 underline">OK</button>
        </div>
      )}

      {giftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setGiftOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="gift-title" className="w-full max-w-md rounded-xl border border-border bg-card p-6" onClick={(event) => event.stopPropagation()}>
            <h2 id="gift-title" className="text-xl font-bold">Gift {item.name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">The Gift button is a visual demo. Sending real gifts is not connected on this fan-made site.</p>
            <button type="button" onClick={() => setGiftOpen(false)} className="mt-5 h-10 w-full rounded-lg bg-secondary font-semibold hover:bg-secondary/80">Close</button>
          </section>
        </div>
      )}
    </main>
  )
}
