'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { catalogItems, categories, type Category } from '@/lib/catalog-data'
import { cn } from '@/lib/utils'
import { SiteHeader } from './site-header'
import { LeftNav } from './left-nav'
import { CategorySidebar, type PriceFilter } from './category-sidebar'
import { ItemCard } from './item-card'
import { ItemModal } from './item-modal'
import { RobuxModal } from './robux-modal'

type Sort = 'relevance' | 'favorited' | 'recent' | 'priceLow' | 'priceHigh'

const sortLabels: Record<Sort, string> = {
  relevance: 'Relevance',
  favorited: 'Most Favorited',
  recent: 'Recently Created',
  priceLow: 'Price (Low to High)',
  priceHigh: 'Price (High to Low)',
}

export function CatalogApp() {
  const [balance, setBalance] = useState(1250)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [subcategory, setSubcategory] = useState<string | null>(null)
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('any')
  const [hideOffSale, setHideOffSale] = useState(false)
  const [sort, setSort] = useState<Sort>('relevance')
  const [owned, setOwned] = useState<Set<number>>(() => new Set([8]))
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set())
  const [openId, setOpenId] = useState<number | null>(null)
  const [robuxOpen, setRobuxOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const notify = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }, [])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = catalogItems.filter((i) => {
      if (category === 'featured' && !i.featured) return false
      if (category !== 'all' && category !== 'featured' && i.category !== category) return false
      if (subcategory && i.subcategory !== subcategory) return false
      if (hideOffSale && i.price === null) return false
      if (priceFilter === 'free' && i.price !== 0) return false
      if (priceFilter === 'under100' && (i.price === null || i.price >= 100)) return false
      if (priceFilter === 'over100' && (i.price === null || i.price < 100)) return false
      if (q && !`${i.name} ${i.creator} ${i.subcategory}`.toLowerCase().includes(q)) return false
      return true
    })
    const p = (v: number | null, fallback: number) => v ?? fallback
    switch (sort) {
      case 'favorited':
        return list.sort((a, b) => b.favorites - a.favorites)
      case 'recent':
        return list.sort((a, b) => b.createdAt - a.createdAt)
      case 'priceLow':
        return list.sort((a, b) => p(a.price, Infinity) - p(b.price, Infinity))
      case 'priceHigh':
        return list.sort((a, b) => p(b.price, -1) - p(a.price, -1))
      default:
        return list
    }
  }, [query, category, subcategory, hideOffSale, priceFilter, sort])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectCategory = (c: Category, sub: string | null) => {
    setCategory(c)
    setSubcategory(sub)
  }

  const openItem = catalogItems.find((i) => i.id === openId) ?? null
  const categoryLabel = categories.find((c) => c.id === category)?.label ?? 'All Categories'

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader
        balance={balance}
        query={query}
        onQueryChange={setQuery}
        onBuyRobux={() => setRobuxOpen(true)}
        onNotify={notify}
        onToggleNav={() => setNavOpen((o) => !o)}
      />

      <LeftNav
        open={navOpen}
        onClose={() => setNavOpen(false)}
        onNotify={notify}
        onBuyRobux={() => setRobuxOpen(true)}
      />

      <main
        className={cn(
          'mx-auto flex max-w-[1400px] gap-8 px-3 py-6 transition-[padding] md:px-6',
          navOpen && 'xl:pl-[244px]',
        )}
      >
        <CategorySidebar
          category={category}
          subcategory={subcategory}
          onSelect={selectCategory}
          priceFilter={priceFilter}
          onPriceFilter={setPriceFilter}
          hideOffSale={hideOffSale}
          onHideOffSale={setHideOffSale}
        />

        <section className="min-w-0 flex-1" aria-labelledby="catalog-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 id="catalog-heading" className="text-2xl font-bold md:text-3xl">
                Marketplace
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {categoryLabel}
                {subcategory ? ` / ${subcategory}` : ''} {'·'} {items.length}{' '}
                {items.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {Object.entries(sortLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="-mx-3 mt-4 flex gap-2 overflow-x-auto px-3 pb-1 lg:hidden" role="group" aria-label="Categories">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id, null)}
                aria-pressed={category === c.id}
                className={cn(
                  'shrink-0 rounded-full border border-border px-3 py-1.5 text-sm',
                  category === c.id ? 'bg-foreground font-semibold text-background' : 'hover:bg-secondary',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-3 text-center">
              <p className="text-lg font-semibold">No results found</p>
              <p className="text-sm text-muted-foreground">Try a different search or clear your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  selectCategory('all', null)
                  setPriceFilter('any')
                  setHideOffSale(false)
                }}
                className="mt-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {items.map((item) => (
                <li key={item.id}>
                  <ItemCard
                    item={item}
                    owned={owned.has(item.id)}
                    favorited={favorites.has(item.id)}
                    onOpen={() => setOpenId(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="mt-12 border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-x-6 gap-y-2 px-6 py-8 text-sm text-muted-foreground">
          {['About Us', 'Jobs', 'Blog', 'Parents', 'Gift Cards', 'Help', 'Terms', 'Accessibility', 'Privacy'].map(
            (l) => (
              <a
                key={l}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-semibold hover:text-foreground"
              >
                {l}
              </a>
            ),
          )}
          <p className="w-full pt-4 text-xs">{'Fan-made recreation for demo purposes. Not affiliated with Roblox Corporation.'}</p>
        </div>
      </footer>

      {openItem && (
        <ItemModal
          key={openItem.id}
          item={openItem}
          owned={owned.has(openItem.id)}
          favorited={favorites.has(openItem.id)}
          balance={balance}
          onClose={() => setOpenId(null)}
          onBuy={(price) => {
            setBalance((b) => b - price)
            setOwned((prev) => new Set(prev).add(openItem.id))
            notify(`You purchased ${openItem.name}!`)
          }}
          onToggleFavorite={() => toggleFavorite(openItem.id)}
          onTryOn={() => notify(`Trying on ${openItem.name}`)}
          onBuyRobux={() => setRobuxOpen(true)}
          onNotify={notify}
        />
      )}

      {robuxOpen && (
        <RobuxModal
          onClose={() => setRobuxOpen(false)}
          onAdd={(n) => {
            setBalance((b) => b + n)
            setRobuxOpen(false)
            notify(`${n.toLocaleString('en-US')} Robux added to your balance`)
          }}
        />
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        {toast && (
          <p className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-lg">{toast}</p>
        )}
      </div>
    </div>
  )
}
