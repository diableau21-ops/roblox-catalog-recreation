'use client'

import Image from 'next/image'
import { BadgeCheck, Heart } from 'lucide-react'
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
        className="relative aspect-square overflow-hidden rounded-lg bg-thumb focus-visible:outline-2 focus-visible:outline-primary"
        aria-label={`View ${item.name}`}
      >
        <Image
          src={item.image || '/placeholder.svg'}
          alt=""
          fill
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
        {item.limited && (
          <span className="absolute bottom-2 left-2 flex items-center overflow-hidden rounded text-[10px] font-bold uppercase">
            <span className="bg-limited px-1.5 py-0.5 text-black">Limited</span>
            {item.limited === 'Limited U' && (
              <span className="bg-foreground px-1.5 py-0.5 text-background">U</span>
            )}
          </span>
        )}
        {owned && (
          <span className="absolute left-2 top-2 rounded bg-success px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
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
          'absolute right-2 top-2 rounded-full bg-background/70 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
          favorited && 'opacity-100',
        )}
      >
        <Heart className={cn('size-4', favorited && 'fill-favorite text-favorite')} />
      </button>
      <button type="button" onClick={onOpen} className="mt-2 flex flex-col items-start text-left">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:underline">
          {item.name}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          By <span className="text-foreground/80">{item.creator}</span>
          {item.verified && <BadgeCheck className="size-3.5 text-primary" aria-label="Verified" />}
        </p>
        <Price price={item.price} className="mt-1 text-sm" />
      </button>
    </article>
  )
}
