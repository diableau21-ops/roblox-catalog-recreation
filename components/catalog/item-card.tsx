'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'
import { VerifiedBadge } from './verified-badge'
import type { CatalogItem } from '@/lib/catalog-data'
import { cn } from '@/lib/utils'
import { Price } from './robux-icon'

type Props = {
  item: CatalogItem
  owned: boolean
  favorited: boolean
  onOpen: () => void
  onToggleFavorite: () => void
}

export function ItemCard({ item, owned, favorited, onOpen, onToggleFavorite }: Props) {
  return (
    <article className="group relative flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        className="relative aspect-square overflow-hidden rounded-lg bg-thumb transition-shadow group-hover:shadow-[0_0_0_2px_var(--foreground)] focus-visible:outline-2 focus-visible:outline-foreground"
        aria-label={`View ${item.name}`}
      >
        <Image
          src={item.image || '/placeholder.svg'}
          alt=""
          fill
          sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-1"
        />
        {item.limited && (
          <span className="absolute bottom-1.5 left-1.5 flex items-center overflow-hidden rounded-[4px] text-[11px] font-black uppercase italic leading-none">
            <span className="bg-limited px-1.5 py-1 text-white">Limited</span>
            {item.limited === 'Limited U' && <span className="bg-[#fdb92d] px-1.5 py-1 text-black">U</span>}
          </span>
        )}
        {owned && (
          <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-success px-1.5 py-1 text-[11px] font-bold leading-none text-white">
            Owned
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-pressed={favorited}
        aria-label={favorited ? `Unfavorite ${item.name}` : `Favorite ${item.name}`}
        className={cn(
          'absolute right-1.5 top-1.5 rounded-full bg-black/55 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
          favorited && 'opacity-100',
        )}
      >
        <Heart className={cn('size-4', favorited && 'fill-favorite text-favorite')} />
      </button>
      <button type="button" onClick={onOpen} className="mt-1.5 flex flex-col items-start text-left">
        <h3 className="line-clamp-2 text-[15px] font-medium leading-tight text-foreground">{item.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-[13px] text-muted-foreground">
          By <span className="font-medium text-foreground/80">@{item.creator}</span>
          {item.verified && <VerifiedBadge className="size-3.5" />}
        </p>
        <Price price={item.price} className="mt-1 text-[15px]" />
      </button>
    </article>
  )
}
