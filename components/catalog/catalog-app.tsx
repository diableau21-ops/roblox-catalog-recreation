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


const translations: Record<string, Record<string, string>> = {
  English: {},
  Français: {
    Marketplace: 'Marché', 'All Categories': 'Toutes les catégories', Featured: 'En vedette',
    Clothing: 'Vêtements', Accessories: 'Accessoires', 'Heads & Faces': 'Têtes et visages',
    Bundles: 'Packs', Gear: 'Équipement', Relevance: 'Pertinence',
    'Most Favorited': 'Les plus populaires', 'Recently Created': 'Récemment créés',
    'Price (Low to High)': 'Prix (croissant)', 'Price (High to Low)': 'Prix (décroissant)',
    result: 'résultat', results: 'résultats', 'No results found': 'Aucun résultat trouvé',
    'Try a different search or clear your filters.': 'Essaie une autre recherche ou efface les filtres.',
    'Clear filters': 'Effacer les filtres', 'About Us': 'À propos', Jobs: 'Emplois', Blog: 'Blog',
    Parents: 'Parents', 'Gift Cards': 'Cartes-cadeaux', Help: 'Aide', Terms: 'Conditions',
    Accessibility: 'Accessibilité', Privacy: 'Confidentialité', Language: 'Langue',
  },
  Español: {
    Marketplace: 'Mercado', 'All Categories': 'Todas las categorías', Featured: 'Destacados',
    Clothing: 'Ropa', Accessories: 'Accesorios', 'Heads & Faces': 'Cabezas y caras',
    Bundles: 'Paquetes', Gear: 'Equipo', Relevance: 'Relevancia', 'Most Favorited': 'Más favoritos',
    'Recently Created': 'Creados recientemente', 'Price (Low to High)': 'Precio (menor a mayor)',
    'Price (High to Low)': 'Precio (mayor a menor)', result: 'resultado', results: 'resultados',
    'No results found': 'No se encontraron resultados', 'Try a different search or clear your filters.': 'Prueba otra búsqueda o borra los filtros.',
    'Clear filters': 'Borrar filtros', 'About Us': 'Sobre nosotros', Jobs: 'Empleos', Blog: 'Blog',
    Parents: 'Padres', 'Gift Cards': 'Tarjetas regalo', Help: 'Ayuda', Terms: 'Términos',
    Accessibility: 'Accesibilidad', Privacy: 'Privacidad', Language: 'Idioma',
  },
  Português: {
    Marketplace: 'Mercado', 'All Categories': 'Todas as categorias', Featured: 'Em destaque',
    Clothing: 'Roupas', Accessories: 'Acessórios', 'Heads & Faces': 'Cabeças e rostos',
    Bundles: 'Pacotes', Gear: 'Equipamento', Relevance: 'Relevância', 'Most Favorited': 'Mais favoritos',
    'Recently Created': 'Criados recentemente', 'Price (Low to High)': 'Preço (menor para maior)',
    'Price (High to Low)': 'Preço (maior para menor)', result: 'resultado', results: 'resultados',
    'No results found': 'Nenhum resultado encontrado', 'Try a different search or clear your filters.': 'Tente outra pesquisa ou limpe os filtros.',
    'Clear filters': 'Limpar filtros', 'About Us': 'Sobre nós', Jobs: 'Empregos', Blog: 'Blog',
    Parents: 'Pais', 'Gift Cards': 'Cartões-presente', Help: 'Ajuda', Terms: 'Termos',
    Accessibility: 'Acessibilidade', Privacy: 'Privacidade', Language: 'Idioma',
  },
  Deutsch: {
    Marketplace: 'Marktplatz', 'All Categories': 'Alle Kategorien', Featured: 'Empfohlen',
    Clothing: 'Kleidung', Accessories: 'Accessoires', 'Heads & Faces': 'Köpfe und Gesichter',
    Bundles: 'Pakete', Gear: 'Ausrüstung', Relevance: 'Relevanz', 'Most Favorited': 'Am häufigsten favorisiert',
    'Recently Created': 'Kürzlich erstellt', 'Price (Low to High)': 'Preis (aufsteigend)',
    'Price (High to Low)': 'Preis (absteigend)', result: 'Ergebnis', results: 'Ergebnisse',
    'No results found': 'Keine Ergebnisse gefunden', 'Try a different search or clear your filters.': 'Versuche eine andere Suche oder lösche die Filter.',
    'Clear filters': 'Filter löschen', 'About Us': 'Über uns', Jobs: 'Jobs', Blog: 'Blog',
    Parents: 'Eltern', 'Gift Cards': 'Geschenkkarten', Help: 'Hilfe', Terms: 'Bedingungen',
    Accessibility: 'Barrierefreiheit', Privacy: 'Datenschutz', Language: 'Sprache',
  },
  Italiano: {
    Marketplace: 'Mercato', 'All Categories': 'Tutte le categorie', Featured: 'In evidenza',
    Clothing: 'Abbigliamento', Accessories: 'Accessori', 'Heads & Faces': 'Teste e volti',
    Bundles: 'Pacchetti', Gear: 'Equipaggiamento', Relevance: 'Rilevanza', 'Most Favorited': 'Più preferiti',
    'Recently Created': 'Creati di recente', 'Price (Low to High)': 'Prezzo crescente',
    'Price (High to Low)': 'Prezzo decrescente', result: 'risultato', results: 'risultati',
    'No results found': 'Nessun risultato trovato', 'Try a different search or clear your filters.': 'Prova un’altra ricerca o cancella i filtri.',
    'Clear filters': 'Cancella filtri', 'About Us': 'Chi siamo', Jobs: 'Lavora con noi', Blog: 'Blog',
    Parents: 'Genitori', 'Gift Cards': 'Carte regalo', Help: 'Aiuto', Terms: 'Termini',
    Accessibility: 'Accessibilità', Privacy: 'Privacy', Language: 'Lingua',
  },
  日本語: {
    Marketplace: 'マーケットプレイス', 'All Categories': 'すべてのカテゴリ', Featured: 'おすすめ',
    Clothing: '服', Accessories: 'アクセサリー', 'Heads & Faces': '頭と顔', Bundles: 'バンドル',
    Gear: 'ギア', Relevance: '関連性', 'Most Favorited': 'お気に入りが多い順',
    'Recently Created': '新着順', 'Price (Low to High)': '価格の安い順', 'Price (High to Low)': '価格の高い順',
    result: '件', results: '件', 'No results found': '結果が見つかりません', 'Clear filters': 'フィルターをクリア',
    'About Us': 'Robloxについて', Jobs: '採用情報', Blog: 'ブログ', Parents: '保護者', 'Gift Cards': 'ギフトカード',
    Help: 'ヘルプ', Terms: '利用規約', Accessibility: 'アクセシビリティ', Privacy: 'プライバシー', Language: '言語',
    'Try a different search or clear your filters.': '別の検索を試すか、フィルターをクリアしてください。',
  },
  한국어: {
    Marketplace: '마켓플레이스', 'All Categories': '모든 카테고리', Featured: '추천',
    Clothing: '의류', Accessories: '액세서리', 'Heads & Faces': '머리 및 얼굴', Bundles: '번들',
    Gear: '장비', Relevance: '관련성', 'Most Favorited': '즐겨찾기 많은 순', 'Recently Created': '최근 생성',
    'Price (Low to High)': '가격 낮은 순', 'Price (High to Low)': '가격 높은 순',
    result: '개 결과', results: '개 결과', 'No results found': '결과를 찾을 수 없습니다',
    'Try a different search or clear your filters.': '다른 검색어를 입력하거나 필터를 지우세요.',
    'Clear filters': '필터 지우기', 'About Us': '회사 소개', Jobs: '채용', Blog: '블로그', Parents: '부모',
    'Gift Cards': '기프트 카드', Help: '도움말', Terms: '약관', Accessibility: '접근성', Privacy: '개인정보 보호', Language: '언어',
  },
  '简体中文': {
    Marketplace: '市场', 'All Categories': '所有类别', Featured: '精选', Clothing: '服装',
    Accessories: '配饰', 'Heads & Faces': '头部和面部', Bundles: '套装', Gear: '装备',
    Relevance: '相关性', 'Most Favorited': '收藏最多', 'Recently Created': '最近创建',
    'Price (Low to High)': '价格从低到高', 'Price (High to Low)': '价格从高到低',
    result: '个结果', results: '个结果', 'No results found': '未找到结果',
    'Try a different search or clear your filters.': '请尝试其他搜索或清除筛选条件。',
    'Clear filters': '清除筛选', 'About Us': '关于我们', Jobs: '工作机会', Blog: '博客',
    Parents: '家长', 'Gift Cards': '礼品卡', Help: '帮助', Terms: '条款', Accessibility: '无障碍',
    Privacy: '隐私', Language: '语言',
  },
}

export function CatalogApp() {
  const [balance, setBalance] = useState(1250)
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('English')
  const t = (text: string) => translations[language]?.[text] ?? text
  const [category, setCategory] = useState<Category>('all')
  const [subcategory, setSubcategory] = useState<string | null>(null)
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('any')
  const [hideOffSale, setHideOffSale] = useState(true)
  const [sort, setSort] = useState<Sort>('relevance')
  const [owned, setOwned] = useState<Set<number>>(() => new Set([8]))
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set())
  const [openId, setOpenId] = useState<number | null>(null)
  const [robuxOpen, setRobuxOpen] = useState(false)
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
      if (i.price === 0) return false
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
      />

      <LeftNav
        onNotify={notify}
        onBuyRobux={() => setRobuxOpen(true)}
      />

      <main
        className={cn(
          'ml-[220px] flex min-h-[calc(100dvh-56px)] w-[calc(100%-220px)] gap-6 px-4 py-7 sm:px-5 lg:gap-8 lg:px-8 xl:px-10',
        )}
      >
        <section className="min-w-0 flex-1" aria-labelledby="catalog-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 id="catalog-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
                {t('Marketplace')}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t(categoryLabel)}
                {subcategory ? ` / ${subcategory}` : ''} {'·'} {items.length}{' '}
                {t(items.length === 1 ? 'result' : 'results')}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-9 max-w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                {Object.entries(sortLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {t(l)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="-mx-3 mt-4 flex gap-2 overflow-x-auto px-3 pb-2 lg:mx-0 lg:mt-5 lg:px-0" role="group" aria-label="Categories">
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
              <p className="text-lg font-semibold">{t('No results found')}</p>
              <p className="text-sm text-muted-foreground">{t('Try a different search or clear your filters.')}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  selectCategory('all', null)
                  setPriceFilter('any')
                  setHideOffSale(true)
                }}
                className="mt-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80"
              >
                {t('Clear filters')}
              </button>
            </div>
          ) : (
            <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
              {items.map((item) => (
                <li key={item.id}>
                  <ItemCard
                    item={item}
                    owned={owned.has(item.id)}
                    favorited={favorites.has(item.id)}
                    onOpen={() => {
                      if (item.id === 13) {
                        window.location.href = '/bundles/201/Headless-Horseman' + (query ? '?q=' + encodeURIComponent(query) : '')
                      } else if (item.id === 10) {
                        window.location.href = '/bundles/192/Korblox-Deathspeaker' + (query ? '?q=' + encodeURIComponent(query) : '')
                      } else {
                        setOpenId(item.id)
                      }
                    }}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="mt-12 border-t border-border">
        <div className="ml-[220px] flex flex-wrap gap-x-6 gap-y-2 px-6 py-8 text-sm text-muted-foreground lg:px-8">
          {['About Us', 'Jobs', 'Blog', 'Parents', 'Gift Cards', 'Help', 'Terms', 'Accessibility', 'Privacy'].map(
            (l) => (
              <a
                key={l}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-semibold hover:text-foreground"
              >
                {t(l)}
              </a>
            ),
          )}
          <div className="flex w-full flex-wrap items-center gap-2 border-t border-border pt-5">
            <label htmlFor="site-language" className="font-semibold text-foreground">{t('Language')}:</label>
            <select
              id="site-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
            >
              {['English', 'Français', 'Español', 'Português', 'Deutsch', 'Italiano', '日本語', '한국어', '简体中文'].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <p className="w-full pt-3 text-xs leading-relaxed text-muted-foreground">
            ©2026 Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.
          </p>
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
