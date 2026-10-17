"use client";

import { useMemo, useState } from "react";

type Item = { id: number; name: string; category: string; price: string; icon: string; background: string; tag?: string };

const items: Item[] = [
  { id: 201, name: "Headless Horseman", category: "Bundles", price: "31,000", icon: "🎃", background: "linear-gradient(145deg,#24202f,#6e3b34)", tag: "Populaire" },
  { id: 2, name: "Classic Smile", category: "Visages", price: "🙂", icon: "☺️", background: "linear-gradient(145deg,#dce8ee,#f7d9b2)" },
  { id: 3, name: "Midnight Hood", category: "Accessoires", price: "125", icon: "🖤", background: "linear-gradient(145deg,#171923,#43465a)" },
  { id: 4, name: "Golden Crown", category: "Accessoires", price: "450", icon: "👑", background: "linear-gradient(145deg,#f8e6a5,#c78b26)", tag: "Nouveau" },
  { id: 5, name: "Skybound Hair", category: "Cheveux", price: "85", icon: "💙", background: "linear-gradient(145deg,#b5e5fa,#627ec9)" },
  { id: 6, name: "Emerald Explorer", category: "Vêtements", price: "75", icon: "🧥", background: "linear-gradient(145deg,#c4e8cf,#39795b)" },
  { id: 7, name: "Starry Wings", category: "Accessoires", price: "300", icon: "✨", background: "linear-gradient(145deg,#d9c8ff,#6756a5)" },
  { id: 8, name: "Retro Shades", category: "Accessoires", price: "60", icon: "🕶️", background: "linear-gradient(145deg,#f6d0bc,#b96753)" },
  { id: 9, name: "Cloud Nine", category: "Cheveux", price: "95", icon: "☁️", background: "linear-gradient(145deg,#e2f4ff,#98bde0)" },
  { id: 10, name: "Crimson Armor", category: "Vêtements", price: "180", icon: "🛡️", background: "linear-gradient(145deg,#f3c4c5,#922f43)" },
  { id: 11, name: "Pixel Pal", category: "Bundles", price: "250", icon: "🤖", background: "linear-gradient(145deg,#c5e9e7,#478b90)" },
  { id: 12, name: "Moonlight Mask", category: "Visages", price: "110", icon: "🌙", background: "linear-gradient(145deg,#d7d5f8,#6667a8)" },
];
const categories = ["Tout", "Bundles", "Accessoires", "Visages", "Cheveux", "Vêtements"];

export default function Page() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tout");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<Item | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const filtered = useMemo(() => {
    const result = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && (category === "Tout" || item.category === category));
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price") result.sort((a, b) => Number(a.price.replace(",", "")) - Number(b.price.replace(",", "")));
    return result;
  }, [search, category, sort]);

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#191b1f]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-3 md:px-8">
          <a href="#" className="flex shrink-0 items-center gap-2 text-xl font-black tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#335fff] text-lg text-white">R</span>
            <span>roblox<span className="text-[#335fff]">.market</span></span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#555963] lg:flex">
            <a className="text-[#191b1f] hover:text-[#335fff]" href="#catalogue">Marketplace</a>
            <button className="hover:text-[#335fff]" onClick={() => { setCategory("Bundles"); document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" }); }}>Bundles</button>
            <button className="hover:text-[#335fff]" onClick={() => { setCategory("Accessoires"); document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" }); }}>Accessoires</button>
          </nav>
          <div className="relative ml-auto hidden max-w-xl flex-1 md:block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400">⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher des articles" aria-label="Rechercher des articles" className="w-full rounded-xl border border-[#e1e2e5] bg-[#f7f7f8] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#335fff] focus:bg-white" />
          </div>
          <a href="https://www.roblox.com/" target="_blank" rel="noreferrer" className="shrink-0 rounded-xl bg-[#335fff] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2449d8]">Roblox officiel ↗</a>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="⌕  Rechercher des articles" aria-label="Rechercher des articles" className="w-full rounded-xl border border-[#e1e2e5] bg-[#f7f7f8] px-4 py-2.5 text-sm outline-none focus:border-[#335fff]" />
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-10">
        <div className="mb-7 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#747782]">
          <span>Accueil</span><span>/</span><span className="text-[#24262b]">Marketplace</span>
          <span className="ml-auto rounded-full bg-[#e9edff] px-3 py-1.5 text-[#335fff]">APERÇU NON OFFICIEL</span>
        </div>
        <section className="relative mb-10 overflow-hidden rounded-3xl bg-[#171923] text-white">
          <div className="absolute -right-10 -top-24 h-80 w-80 rounded-full bg-[#5a70ff]/30 blur-3xl" />
          <div className="absolute bottom-[-100px] right-[20%] h-64 w-64 rounded-full bg-[#ff9b58]/20 blur-3xl" />
          <div className="relative grid min-h-[270px] items-center gap-8 px-6 py-9 sm:px-10 md:grid-cols-[1.2fr_.8fr] md:px-14">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#cdd5ff]">Explore le catalogue</span>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">Trouve ton prochain <span className="text-[#91a3ff]">look.</span></h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/70 sm:text-base">Découvre des bundles, accessoires, visages et styles pour personnaliser ton avatar.</p>
              <a href="#catalogue" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#171923] transition hover:bg-[#e8ebff]">Explorer le Marketplace <span>→</span></a>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative grid h-44 w-44 place-items-center rounded-[2rem] border border-white/15 bg-white/10 text-8xl shadow-2xl shadow-black/20 sm:h-52 sm:w-52 sm:text-9xl" style={{ background: "linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.04))" }}>
                🎃<span className="absolute -bottom-3 -right-4 rounded-xl bg-[#ffcf75] px-3 py-2 text-xs font-black text-[#3b2b18] shadow-lg">À LA UNE</span>
              </div>
            </div>
          </div>
        </section>

        <section id="catalogue">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-1 text-xs font-bold uppercase tracking-[.16em] text-[#747782]">À découvrir</p><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Marketplace</h2><p className="mt-1 text-sm text-[#747782]">{filtered.length} articles dans cette sélection</p></div>
            <label className="flex items-center gap-2 text-sm text-[#666a73]">Trier par
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-[#e1e2e5] bg-white px-3 py-2.5 font-semibold text-[#24262b] outline-none focus:border-[#335fff]"><option value="featured">En vedette</option><option value="name">Nom A–Z</option><option value="price">Prix croissant</option></select>
            </label>
          </div>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((name) => <button key={name} onClick={() => setCategory(name)} className={"shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition " + (category === name ? "bg-[#24262b] text-white shadow-sm" : "border border-[#e1e2e5] bg-white text-[#666a73] hover:border-[#aeb5c8] hover:text-[#24262b]")}>{name}</button>)}
          </div>
          {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[#d5d7de] bg-white p-12 text-center"><div className="text-4xl">🔎</div><p className="mt-3 font-bold">Aucun article trouvé</p><p className="mt-1 text-sm text-[#747782]">Essaie un autre mot ou une autre catégorie.</p><button onClick={() => { setSearch(""); setCategory("Tout"); }} className="mt-4 rounded-lg bg-[#335fff] px-4 py-2 text-sm font-bold text-white">Réinitialiser</button></div> :
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
            {filtered.map((item) => <article key={item.id} className="group overflow-hidden rounded-2xl border border-[#e7e8ec] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#c8d0ff] hover:shadow-xl hover:shadow-[#243b8a]/[.07]">
              <div className="relative">
                <button onClick={() => setSelected(item)} className="block w-full text-left" aria-label={"Voir " + item.name}>
                  <div className="relative grid aspect-square place-items-center overflow-hidden text-7xl sm:text-8xl" style={{ background: item.background }}>
                    <span className="drop-shadow-md transition duration-300 group-hover:scale-110">{item.icon}</span>
                    {item.tag && <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#333640]">{item.tag}</span>}
                  </div>
                  <div className="p-3 sm:p-4"><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#8a8d96]">{item.category}</p><h3 className="min-h-10 text-sm font-bold leading-5 text-[#25272d]">{item.name}</h3><div className="mt-3 flex items-center justify-between gap-1"><span className="text-sm font-extrabold">{item.price === "🙂" || item.price === "☺️" ? "Gratuit" : item.price + " R$"}</span><span className="text-xs text-[#8a8d96]">Détails ↗</span></div></div>
                </button>
                <button onClick={() => setFavorites((old) => old.includes(item.id) ? old.filter((id) => id !== item.id) : [...old, item.id])} aria-label={favorites.includes(item.id) ? "Retirer des favoris" : "Ajouter aux favoris"} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-lg shadow-sm transition hover:scale-105">{favorites.includes(item.id) ? "♥" : "♡"}</button>
              </div>
            </article>)}
          </div>}
        </section>
        <footer className="mt-14 border-t border-[#e2e3e8] py-6 text-center text-xs leading-5 text-[#858894]"><p className="font-bold text-[#575b65]">roblox.market — Démo de fan, non officielle</p><p className="mt-1">Ce site n’est pas affilié à Roblox Corporation. Les articles et prix affichés sont des exemples et aucun achat réel n’est effectué.</p></footer>
      </main>

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
        <div role="dialog" aria-modal="true" aria-labelledby="item-title" className="relative grid w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl sm:grid-cols-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setSelected(null)} aria-label="Fermer" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-xl shadow">×</button>
          <div className="grid min-h-64 place-items-center text-9xl" style={{ background: selected.background }}>{selected.icon}</div>
          <div className="flex flex-col p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-[#335fff]">{selected.category}</p><h2 id="item-title" className="mt-2 text-2xl font-black">{selected.name}</h2><p className="mt-3 text-sm leading-6 text-[#70737d]">Un article de démonstration pour ton avatar. Cette fiche reproduit le principe d’une page d’article de catalogue.</p><div className="mt-6 rounded-xl bg-[#f5f6f8] p-4"><p className="text-xs font-semibold text-[#777b85]">Prix indicatif</p><p className="mt-1 text-2xl font-black">{selected.price === "🙂" || selected.price === "☺️" ? "Gratuit" : selected.price + " R$"}</p></div><button onClick={() => setFavorites((old) => old.includes(selected.id) ? old.filter((id) => id !== selected.id) : [...old, selected.id])} className="mt-4 rounded-xl bg-[#335fff] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#2449d8]">{favorites.includes(selected.id) ? "♥ Dans tes favoris" : "♡ Ajouter aux favoris"}</button>{selected.id === 201 && <a href="https://www.roblox.com/bundles/201/Headless-Horseman" target="_blank" rel="noreferrer" className="mt-3 text-center text-sm font-bold text-[#335fff] hover:underline">Voir la page officielle Headless Horseman ↗</a>}<p className="mt-auto pt-5 text-[11px] leading-4 text-[#9699a1]">Démo uniquement : aucun achat ni connexion Roblox n’est disponible.</p></div>
        </div>
      </div>}
    </div>
  );
}
