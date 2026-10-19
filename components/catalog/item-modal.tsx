'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Heart, Share2, X } from 'lucide-react'
import { VerifiedBadge } from './verified-badge'
import { formatCount, resellers, type CatalogItem } from '@/lib/catalog-data'
import { cn } from '@/lib/utils'
import { Price, RobuxIcon } from './robux-icon'

type Props = {
  item: CatalogItem
  owned: boolean
  favorited: boolean
  balance: number
  onClose: () => void
  onBuy: (price: number) => void
  onToggleFavorite: () => void
  onAddToCart: () => void
  onTryOn: () => void
  onBuyRobux: () => void
  onNotify: (msg: string) => void
}

export function ItemModal({
  item,
  owned,
  favorited,
  balance,
  onClose,
  onBuy,
  onToggleFavorite,
  onAddToCart,
  onTryOn,
  onBuyRobux,
  onNotify,
}: Props) {
  const [confirming, setConfirming] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const resale = resellers[item.id]
  const effectivePrice = item.price ?? resale ?? null
  const canBuy = !owned && effectivePrice !== null
  const insufficient = effectivePrice !== null && effectivePrice > balance

  useEffect(() => {
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-xl bg-card outline-none md:flex-row"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 hover:bg-secondary"
        >
          <X className="size-5" />
        </button>

        <div className="relative aspect-square w-full shrink-0 bg-thumb md:w-[45%]">
          <Image src={item.image?.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${item.image || '/placeholder.svg'}`} alt={item.name} fill sizes="400px" className="object-contain p-4" />
          {item.limited && (
            <span className="absolute bottom-3 left-3 flex overflow-hidden rounded text-xs font-bold uppercase">
              <span className="bg-limited px-2 py-0.5 text-black">Limited</span>
              {item.limited === 'Limited U' && <span className="bg-foreground px-2 py-0.5 text-background">U</span>}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
          <div className="pr-8">
            <h2 id="item-title" className="text-balance text-2xl font-bold">
              {item.name}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              By <span className="font-semibold text-foreground">@{item.creator}</span>
              {item.verified && <VerifiedBadge className="size-4" />}
            </p>
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Price</dt>
            <dd>
              {item.price === null && resale ? (
                <span className="flex flex-col">
                  <Price price={resale} />
                  <span className="text-xs text-muted-foreground">Lowest resale price</span>
                </span>
              ) : (
                <Price price={item.price} />
              )}
            </dd>
            <dt className="text-muted-foreground">Type</dt>
            <dd>{item.subcategory}</dd>
            <dt className="text-muted-foreground">Description</dt>
            <dd className="text-pretty leading-relaxed">{item.description}</dd>
          </dl>

          <div className="mt-auto flex flex-col gap-2">
            {owned ? (
              <div className="rounded-lg bg-secondary px-4 py-3 text-center text-sm font-semibold">
                {'You own this item'}
              </div>
            ) : confirming && effectivePrice !== null ? (
              <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
                <p className="text-sm">
                  Would you like to buy <strong>{item.name}</strong> for{' '}
                  <Price price={effectivePrice} className="inline-flex" />?
                </p>
                {insufficient ? (
                  <>
                    <p className="text-sm text-destructive">
                      {`You need ${(effectivePrice - balance).toLocaleString('en-US')} more Robux to buy this item.`}
                    </p>
                    <button
                      type="button"
                      onClick={onBuyRobux}
                      className="h-10 rounded-lg bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      Buy Robux
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onBuy(effectivePrice)
                      setConfirming(false)
                    }}
                    className="h-10 rounded-lg bg-success font-bold text-white hover:bg-success/90"
                  >
                    {effectivePrice === 0 ? 'Get Now' : 'Buy Now'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="h-9 rounded-lg bg-secondary text-sm font-semibold hover:bg-secondary/80"
                >
                  Cancel
                </button>
                {!insufficient && effectivePrice > 0 && (
                  <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    Balance after transaction: <RobuxIcon className="size-3" />
                    {(balance - effectivePrice).toLocaleString('en-US')}
                  </p>
                )}
              </div>
            ) : (
              <button
                type="button"
                disabled={!canBuy}
                onClick={() => setConfirming(true)}
                className="h-11 rounded-lg bg-success font-bold text-white hover:bg-success/90 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground"
              >
                {effectivePrice === null ? 'Off Sale' : effectivePrice === 0 ? 'Get' : 'Buy'}
              </button>
            )}

            {!owned && effectivePrice !== null && <button type="button" onClick={onAddToCart} className="h-10 rounded-lg border border-border text-sm font-semibold hover:bg-secondary">Add to Cart</button>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onTryOn}
                className="h-10 flex-1 rounded-lg bg-secondary text-sm font-semibold hover:bg-secondary/80"
              >
                Try On
              </button>
              <button
                type="button"
                onClick={onToggleFavorite}
                aria-pressed={favorited}
                className="flex h-10 items-center gap-1.5 rounded-lg bg-secondary px-3 text-sm font-semibold hover:bg-secondary/80"
              >
                <Heart className={cn('size-4', favorited && 'fill-favorite text-favorite')} />
                {formatCount(item.favorites + (favorited ? 1 : 0))}
              </button>
              <button
                type="button"
                aria-label="Share"
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}/catalog/${item.id}`)
                  onNotify('Link copied to clipboard')
                }}
                className="flex h-10 items-center rounded-lg bg-secondary px-3 hover:bg-secondary/80"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
