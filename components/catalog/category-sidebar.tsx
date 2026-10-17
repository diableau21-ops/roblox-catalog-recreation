'use client'

import { ChevronDown } from 'lucide-react'
import { categories, type Category } from '@/lib/catalog-data'
import { cn } from '@/lib/utils'

export type PriceFilter = 'any' | 'free' | 'under100' | 'over100'

type Props = {
  category: Category
  subcategory: string | null
  onSelect: (c: Category, sub: string | null) => void
  priceFilter: PriceFilter
  onPriceFilter: (p: PriceFilter) => void
  hideOffSale: boolean
  onHideOffSale: (v: boolean) => void
}

const priceOptions: { id: PriceFilter; label: string }[] = [
  { id: 'any', label: 'Any Price' },
  { id: 'free', label: 'Free' },
  { id: 'under100', label: 'Under 100' },
  { id: 'over100', label: '100 and up' },
]

export function CategorySidebar({
  category,
  subcategory,
  onSelect,
  priceFilter,
  onPriceFilter,
  hideOffSale,
  onHideOffSale,
}: Props) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block" aria-label="Filters">
      <h2 className="mb-2 px-2 text-sm font-bold text-muted-foreground">Category</h2>
      <ul className="flex flex-col gap-0.5">
        {categories.map((c) => {
          const active = category === c.id
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id, null)}
                aria-pressed={active && !subcategory}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-secondary',
                  active && 'bg-secondary font-bold',
                )}
              >
                {c.label}
                {c.subs && (
                  <ChevronDown
                    className={cn('size-4 text-muted-foreground transition-transform', active && 'rotate-180')}
                  />
                )}
              </button>
              {active && c.subs && (
                <ul className="mb-1 ml-3 flex flex-col border-l border-border pl-2">
                  {c.subs.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => onSelect(c.id, s)}
                        aria-pressed={subcategory === s}
                        className={cn(
                          'w-full rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground',
                          subcategory === s && 'font-bold text-foreground',
                        )}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      <h2 className="mb-2 mt-6 px-2 text-sm font-bold text-muted-foreground">Price</h2>
      <fieldset className="flex flex-col gap-0.5">
        <legend className="sr-only">Price filter</legend>
        {priceOptions.map((p) => (
          <label
            key={p.id}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary"
          >
            <input
              type="radio"
              name="price"
              checked={priceFilter === p.id}
              onChange={() => onPriceFilter(p.id)}
              className="accent-primary"
            />
            {p.label}
          </label>
        ))}
      </fieldset>

      <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary">
        <input
          type="checkbox"
          checked={hideOffSale}
          onChange={(e) => onHideOffSale(e.target.checked)}
          className="accent-primary"
        />
        Hide off-sale items
      </label>
    </aside>
  )
}
