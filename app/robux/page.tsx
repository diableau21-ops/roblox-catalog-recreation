'use client'

import { useEffect, useState } from 'react'
import { RobuxIcon } from '@/components/catalog/robux-icon'
import { SiteHeader } from '@/components/catalog/site-header'
import { LeftNav } from '@/components/catalog/left-nav'

const packages: { amount: string; previous: string; bonus: string; price: string; featured?: boolean }[] = [
  { amount: '24,000', previous: '22,500', bonus: '+1,500 de plus', price: '279.99 $' },
  { amount: '11,000', previous: '10,000', bonus: '+1,000 de plus', price: '139.99 $' },
  { amount: '5,250', previous: '4,500', bonus: '+750 de plus', price: '69.99 $' },
  { amount: '3,625', previous: '3,150', bonus: '+475 de plus', price: '49.99 $', featured: true },
  { amount: '2,000', previous: '1,700', bonus: '+300 de plus', price: '27.99 $' },
  { amount: '1,500', previous: '1,200', bonus: '+300 de plus', price: '19.99 $' },
  { amount: '1,000', previous: '800', bonus: '+200 de plus', price: '13.99 $' },
  { amount: '500', previous: '400', bonus: '+100 de plus', price: '6.99 $' },
]


function VerifiedBadge({ className = 'size-4' }: { className?: string }) {
  return (
    <svg aria-label="Verified Roblox account" role="img" viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="#00A2FF" d="M12 1.2 15 3l3.5-.1 1.2 3.3 3 2-1 3.8 1 3.5-3 2.4-1.2 3.2-3.5-.1-3 1.9-3-1.9-3.5.1-1.2-3.2-3-2.4 1-3.5-1-3.8 3-2L5.5 2.9 9 3z"/>
      <path fill="#fff" d="m10.1 15.9-3.3-3.3 1.7-1.7 1.6 1.6 4.8-4.8 1.7 1.7z"/>
    </svg>
  )
}

export default function RobuxPage() {
  const [balance, setBalance] = useState(1250)
  const [balanceReady, setBalanceReady] = useState(false)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const savedBalance = window.localStorage.getItem('catalog-demo-robux-balance')
      if (savedBalance !== null) {
        const parsed = Number(savedBalance)
        if (Number.isFinite(parsed) && parsed >= 0) {
          // Repair balances saved by the earlier string-concatenation bug.
          const priorPackageAmounts = [24000, 11000, 5250, 3625]
          const corruptedSuffix = priorPackageAmounts.find((amount) => savedBalance === `1250${amount}`)
          setBalance(corruptedSuffix ? 1250 + corruptedSuffix : parsed)
        }
      }
      const recipient = new URLSearchParams(window.location.search).get('q') ?? ''
      setQuery(recipient)
      if (recipient) { setEnvoyerUsername(recipient); setEnvoyerOpen(true) }
    } catch {}
    setBalanceReady(true)
  }, [])

  useEffect(() => {
    if (!balanceReady) return
    try { window.localStorage.setItem('catalog-demo-robux-balance', String(balance)) } catch {}
  }, [balance, balanceReady])

  const notify = (text: string) => setMessage(text)
  const openPackages = () => document.getElementById('robux-packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const [sendOpen, setEnvoyerOpen] = useState(false)
  const [sendUsername, setEnvoyerUsername] = useState('')
  const [sendPlayers, setEnvoyerPlayers] = useState<{id:number;name:string;displayName:string;avatarUrl?:string|null;hasVerifiedBadge?:boolean}[]>([])
  const [sendPlayer, setEnvoyerPlayer] = useState<{id:number;name:string;displayName:string;avatarUrl?:string|null;hasVerifiedBadge?:boolean}|null>(null)
  const [sendSearching, setEnvoyerSearching] = useState(false)
  const [sendError, setEnvoyerError] = useState('')
  const [sendAmount, setEnvoyerAmount] = useState('100')
  const [sendSuccess, setEnvoyerSuccess] = useState(false)
  const [sendReview, setEnvoyerReview] = useState(false)
  const [sendProcessing, setEnvoyerProcessing] = useState(false)
  const [selectedPackage, setSélectionneredPackage] = useState<(typeof packages)[number] | null>(null)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')

  const searchPlayers = async () => {
    const keyword = sendUsername.trim()
    if (keyword.length < 3) {
      setEnvoyerError('Entre au moins 3 caractères.')
      return
    }
    setEnvoyerSearching(true)
    setEnvoyerError('')
    setEnvoyerPlayers([])
    setEnvoyerPlayer(null)
    try {
      let response: Response | null = null
      // Retry transient Roblox/Vercel network failures before showing an error.
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          response = await fetch(`/api/roblox-users?keyword=${encodeURIComponent(keyword)}&attempt=${attempt}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(12000),
          })
          if (response.ok) break
        } catch {}
        if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 500 * (attempt + 1)))
      }
      if (!response?.ok) throw new Error('Roblox search is temporarily unavailable')
      const payload = await response.json()
      const players = Array.isArray(payload.data) ? payload.data
        .filter((p: {id?:number;name?:string}) => Number.isFinite(p.id) && typeof p.name === 'string')
        .map((p: {id:number;name:string;displayName?:string;avatarUrl?:string|null;hasVerifiedBadge?:boolean}) => ({
          id:p.id, name:p.name, displayName:p.displayName || p.name,
          avatarUrl:p.avatarUrl || null, hasVerifiedBadge:p.hasVerifiedBadge === true
        })) : []
      setEnvoyerPlayers(players)
      const exactMatch = players.find((player) => player.name.toLowerCase() === keyword.toLowerCase())
      if (exactMatch) {
        setEnvoyerPlayer(exactMatch)
      } else if (!players.length) {
        setEnvoyerError(`Aucun joueur Roblox trouvé pour “${keyword}”.`)
      }
    } catch {
      setEnvoyerError('Aucun résultat pour le moment. Vérifie le nom d'utilisateur Roblox et réessaie.')
    } finally {
      setEnvoyerSearching(false)
    }
  }

  useEffect(() => {
    if (!sendOpen || sendPlayer) return
    const keyword = sendUsername.trim()
    if (keyword.length < 3) return
    const timer = window.setTimeout(() => {
      void searchPlayers()
    }, 500)
    return () => window.clearTimeout(timer)
  }, [sendUsername, sendOpen, sendPlayer])

  return (
    <main className="min-h-dvh bg-[#0B0B0D] text-[#F7F6F2]">
      <SiteHeader balance={balance} query={query} onQueryChange={setQuery} onBuyRobux={openPackages} onNotify={notify} onSetBalance={setBalance} />
      <LeftNav onNotify={notify} onBuyRobux={openPackages} />
      <div className="ml-0 px-4 pb-12 pt-5 sm:px-6 sm:pt-7 md:ml-[220px] md:px-6">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-end">
        <div className="flex items-center gap-3 rounded-lg bg-[#29292E] p-1.5 pl-3 text-sm font-extrabold" aria-label={`${balance.toLocaleString('en-US')} Robux balance`}>
          <RobuxIcon className="size-5" />
          <span className="tabular-nums">{balance.toLocaleString('en-US')}</span>
          <button
            type="button"
            onClick={() => { setEnvoyerOpen(true); setEnvoyerSuccess(false); setEnvoyerReview(false); setEnvoyerError(''); setEnvoyerPlayer(null); setEnvoyerPlayers([]) }}
            className="rounded-md bg-[#38383F] px-4 py-2 transition-colors hover:bg-[#484850] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Envoyer
          </button>
        </div>
      </header>

      <section id="robux-packages" className="mx-auto mt-12 w-full max-w-3xl scroll-mt-20 sm:mt-16">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Profite de jusqu'à 25 % de Robux en plus
        </h1>
        <h2 className="mt-8 text-xl font-extrabold tracking-tight sm:mt-10 sm:text-2xl">
          Forfaits de Robux
        </h2>

        <ul className="mt-4 space-y-3">
          {packages.map((pack) => (
            <li
              key={pack.amount}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-[#202024] px-3 py-4 sm:gap-5 sm:px-5 sm:py-5"
            >
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <RobuxIcon className="size-6 sm:size-7" />
                  <span className="whitespace-nowrap text-lg font-extrabold tabular-nums sm:text-2xl">
                    {pack.amount}
                  </span>
                  {pack.featured && (
                    <span className="shrink-0 rounded-md bg-[#34343B] px-2 py-1 text-[10px] font-extrabold sm:text-xs">
                      Pour toi
                    </span>
                  )}
                </div>
                <div className="ml-[34px] mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:ml-10">
                  <span className="text-sm font-semibold text-[#A8A8B0] line-through sm:text-base">
                    {pack.previous}
                  </span>
                  <span className="whitespace-nowrap rounded-md bg-[#35353B] px-2 py-1 text-xs font-extrabold text-[#F7F6F2] sm:text-sm">
                    {pack.bonus}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setSélectionneredPackage(pack); setPaying(false); setPaid(false); setPaymentMethod('card') }}
                className={`min-w-[104px] rounded-lg px-3 py-3 text-sm font-extrabold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-w-[132px] sm:px-5 sm:text-base ${pack.featured ? 'bg-[#335FFF] text-white hover:bg-[#244BE0]' : 'bg-[#34343A] text-white hover:bg-[#45454D]'}`}
              >
                {pack.price}
              </button>
            </li>
          ))}
        </ul>


        {message && (
          <p role="status" className="mt-4 rounded-lg border border-[#34343A] bg-[#202024] px-4 py-3 text-sm text-[#D7D7DC]">
            {message}
          </p>
        )}
        {selectedPackage && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3" onClick={() => setSélectionneredPackage(null)}>
            <section role="dialog" aria-modal="true" aria-labelledby="package-info-title" className="w-full max-w-md rounded-2xl border border-[#41414b] bg-[#17171c] p-5 text-[#f7f6f2] shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between gap-3">
                <h2 id="package-info-title" className="text-2xl font-extrabold">Aperçu du forfait de Robux</h2>
                <button type="button" onClick={() => setSélectionneredPackage(null)} aria-label="Fermer" className="rounded-lg px-3 py-1 text-2xl text-white/70 hover:bg-white/10">×</button>
              </div>
              <div className="mt-5 rounded-xl border border-[#34343b] bg-[#202024] p-4">
                <div className="flex items-center gap-3"><RobuxIcon className="size-9" /><div><p className="font-extrabold">{selectedPackage.amount} Robux</p><p className="text-sm text-white/60">Aperçu visuel du catalogue · {selectedPackage.price}</p></div></div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/75">Ceci est une maquette non officielle créée par des fans. Les achats sont désactivés : aucun paiement n'est prélevé et aucun Robux n'est livré. Pour acheter des Robux, visite le site officiel de Roblox.</p>
              <a href="https://www.roblox.com/upgrades/robux" target="_blank" rel="noreferrer" className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-[#335fff] font-extrabold hover:bg-[#244be0]">Ouvrir le site officiel de Roblox</a>
              <button type="button" onClick={() => setSélectionneredPackage(null)} className="mt-2 h-11 w-full rounded-lg border border-white/15 font-bold hover:bg-white/5">Fermer preview</button>
            </section>
          </div>
        )}

        {sendOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3" onClick={() => setEnvoyerOpen(false)}>
            <section role="dialog" aria-modal="true" aria-labelledby="send-robux-title" className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#383838] bg-[#1f1f1f] p-5 text-white shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}>
              <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" style={{backgroundImage:'radial-gradient(1.5px 1.5px at 15% 20%, white 60%, transparent), radial-gradient(1px 1px at 78% 26%, #a5d8ff 60%, transparent), radial-gradient(1.5px 1.5px at 64% 75%, #d8b4fe 60%, transparent)'}} />
              <div className="relative z-10">
                {sendProcessing ? (
                  <div className="py-8 text-center">
                    <h2 id="send-robux-title" className="text-2xl font-extrabold">Envoyering</h2>
                    <div className="mt-7 flex flex-col items-center">
                      {sendPlayer?.avatarUrl ? <img src={sendPlayer.avatarUrl} alt="" className="size-24 rounded-full bg-[#303030] object-cover" /> : <span className="flex size-24 items-center justify-center rounded-full bg-[#303030] text-2xl font-bold">{(sendPlayer?.displayName || sendPlayer?.name || '?').slice(0,2).toUpperCase()}</span>}
                      <p className="mt-3 flex items-center justify-center gap-1.5 text-xl font-bold">{sendPlayer?.displayName}{sendPlayer?.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</p>
                      <p className="text-sm text-white/60">@{sendPlayer?.name}</p>
                    </div>
                    <div className="mx-auto mt-8 size-12 animate-spin rounded-full border-4 border-white/15 border-t-[#146bff]" role="status" aria-label="Envoyering" />
                    <p className="mt-4 text-sm text-white/65">Envoyering {Number(sendAmount || 0).toLocaleString('en-US')} Robux…</p>
                  </div>
                ) : sendSuccess ? (
                  <div className="py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <img src="https://robux-send-fake-creator-iker.lovable.app/__l5e/assets-v1/1aea3764-f82d-470c-b9d7-fc4c6220088e/robux-menu-icon.png" alt="Robux" className="size-6 shrink-0 object-contain" />
                        <h2 id="send-robux-title" className="text-xl font-extrabold">Envoyer Robux</h2>
                      </div>
                      <span className="flex shrink-0 items-center gap-2 text-lg font-bold text-white/80"><RobuxIcon className="size-5"/>{balance.toLocaleString('en-US')}</span>
                    </div>
                    <div className="mx-auto mt-8 flex size-16 items-center justify-center rounded-full border-2 border-white bg-transparent text-3xl font-semibold text-white"><svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg></div>
                    <button type="button" onClick={() => {setEnvoyerOpen(false);setEnvoyerReview(false)}} className="mt-6 h-14 w-full rounded-xl bg-[#335fff] px-7 text-2xl font-extrabold">OK</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5"><img src="https://robux-send-fake-creator-iker.lovable.app/__l5e/assets-v1/1aea3764-f82d-470c-b9d7-fc4c6220088e/robux-menu-icon.png" alt="Robux" className="size-6 shrink-0 object-contain" /><h2 id="send-robux-title" className="text-2xl font-extrabold">Envoyer Robux</h2></div><span className="ml-auto flex items-center gap-2 text-lg text-white/65"><RobuxIcon className="size-5"/>{balance.toLocaleString("en-US")}</span>
                      <button type="button" onClick={() => setEnvoyerOpen(false)} aria-label="Fermer" className="rounded-lg px-2 py-1 text-xl text-white/75 hover:bg-white/10">×</button>
                    </div>
                    {sendPlayer && sendReview ? (
                      <div className="mt-6">
                        <div className="flex flex-col items-center text-center">
                          {sendPlayer.avatarUrl ? <img src={sendPlayer.avatarUrl} alt="" className="size-24 rounded-full bg-[#303030] object-cover" /> : <span className="flex size-24 items-center justify-center rounded-full bg-[#303030] text-2xl font-bold">{sendPlayer.displayName.slice(0,2).toUpperCase()}</span>}
                          <p className="mt-3 flex items-center justify-center gap-1.5 text-xl font-bold">{sendPlayer.displayName}{sendPlayer.hasVerifiedBadge && <VerifiedBadge className="size-4" />}</p>
                          <p className="text-sm text-white/60">@{sendPlayer.name}</p>
                          <p className="mt-1 text-xs text-white/55">0 relation en commun · Inscrit en {sendPlayer.name.toLowerCase()==='jordanfafard'?'2017':'recent years'}</p>
                        </div>
                        <div className="mt-6 border-t border-white/10 pt-5">
                          <div className="flex items-center justify-between rounded-xl bg-[#292929] p-4">
                            <span className="text-sm font-semibold">Robux</span>
                            <span className="flex items-center gap-2 text-2xl font-extrabold"><RobuxIcon className="size-6"/>{Number(sendAmount||0).toLocaleString('en-US')}</span>
                          </div>
                          <div className="mt-4 flex gap-3">
                            <button type="button" disabled={sendProcessing} onClick={()=>{const amount=Number(sendAmount);if(!Number.isSafeInteger(amount)||amount<1||amount>balance){setEnvoyerError('Entre un montant valide qui ne dépasse pas ton solde.');return;}setEnvoyerError('');setEnvoyerProcessing(true);window.setTimeout(()=>{setEnvoyerProcessing(false);setEnvoyerSuccess(true)},800)}} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#146bff] text-base font-extrabold disabled:cursor-wait disabled:opacity-80">{sendProcessing ? <><span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />Envoyering…</> : 'Envoyer'}</button>
                            <button type="button" onClick={()=>{setEnvoyerReview(false);setEnvoyerError('')}} className="h-12 flex-1 rounded-xl border border-white/20 text-base font-bold">Modifier</button>
                          </div>
                          {sendError && <p role="status" className="mt-3 text-sm leading-5 text-red-300">{sendError}</p>}
                        </div>
                      </div>
                    ) : sendPlayer ? (
                      <div className="mt-5">
                        <div className="flex flex-col items-center border-b border-white/10 pb-5 text-center">
                          {sendPlayer.avatarUrl ? <img src={sendPlayer.avatarUrl} alt="" className="size-28 rounded-full bg-[#303030] object-cover" /> : <span className="flex size-28 items-center justify-center rounded-full bg-[#303030] text-2xl font-bold">{sendPlayer.displayName.slice(0,2).toUpperCase()}</span>}
                          <p className="mt-3 flex items-center gap-2 text-2xl font-extrabold">{sendPlayer.displayName}{sendPlayer.hasVerifiedBadge && <VerifiedBadge className="size-5" />}</p><p className="text-sm text-white/60">@{sendPlayer.name}</p>
                        </div>
                        <div className="mt-5 flex items-center justify-center gap-3 text-5xl font-extrabold"><RobuxIcon className="size-10" />{Number(sendAmount||0).toLocaleString('en-US')}</div>
                        <p className="mt-2 text-center text-sm text-white/60">Appuie sur le nombre pour entrer un montant personnalisé</p>
                        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {[25,50,100,200].map((amount)=> <button key={amount} type="button" onClick={()=>setEnvoyerAmount(String(amount))} className={`flex h-14 items-center justify-center gap-2 rounded-full text-base font-bold transition ${Number(sendAmount)===amount?'border-2 border-[#146bff] bg-[#172b50]':'bg-[#292929] hover:bg-[#383838]'}`}><RobuxIcon className="size-5"/>{amount}</button>)}
                        </div>
                        <label htmlFor="send-robux-amount" className="mt-4 block text-sm font-semibold text-white/70">Montant personnalisé</label>
                        <input id="send-robux-amount" type="number" min="1" step="1" inputMode="numeric" value={sendAmount} onChange={(event) => setEnvoyerAmount(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-[#292929] px-3 text-white outline-none focus:border-[#146bff]" />
                        {sendError && <p role="status" className="mt-2 text-sm text-red-300">{sendError}</p>}
                        <button type="button" onClick={() => {const amount=Number(sendAmount);if(!Number.isSafeInteger(amount)||amount<1)return;if(amount>balance){setEnvoyerError('Tu n'as pas assez de Robux dans ton solde.');return;}setEnvoyerError('');setEnvoyerReview(true)}} disabled={!Number.isSafeInteger(Number(sendAmount))||Number(sendAmount)<1} className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#146bff] text-xl font-extrabold disabled:cursor-not-allowed disabled:opacity-60">Suivant</button>
                        <p className="mt-4 text-center text-sm text-white/55">Les Robux sont envoyés instantanément, sans frais</p>
                        <button type="button" onClick={() => {setEnvoyerPlayer(null);setEnvoyerError('')}} className="mt-3 w-full text-xs text-white/65 underline">Choisir un autre joueur</button>
                      </div>
                    ) : (
                      <>
                        <p className="mt-2 text-sm text-white/70">Recherche le joueur Roblox à qui tu veux envoyer des Robux.</p>
                        <form className="mt-4" onSubmit={(event) => { event.preventDefault(); void searchPlayers() }}>
                          <input value={sendUsername} onChange={(event) => { setEnvoyerUsername(event.target.value); setEnvoyerError(''); setEnvoyerPlayers([]); setEnvoyerPlayer(null) }} placeholder="Nom d'utilisateur Roblox" aria-label="Nom d'utilisateur du joueur Roblox" className="h-12 w-full rounded-xl border-2 border-[#146bff] bg-[#292929] px-4 text-base text-white outline-none focus:border-[#146bff]" />
                        </form>
                        {sendSearching && <p className="mt-3 text-sm text-white/60">Recherche du joueur…</p>}
                        {sendError && <p role="status" className="mt-3 text-sm text-white/70">{sendError}</p>}
                        {sendPlayers.length > 0 && <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
                          {sendPlayers.map((player) => <button key={player.id} type="button" onClick={() => setEnvoyerPlayer(player)} className="flex w-full items-center gap-3 rounded-lg border border-white/15 p-3 text-left hover:border-[#7183ff] hover:bg-white/5">
                            {player.avatarUrl ? <img src={player.avatarUrl} alt="" className="size-11 rounded-full object-cover" /> : <span className="flex size-11 items-center justify-center rounded-full bg-white/10">👤</span>}
                            <span className="min-w-0 flex-1"><span className="flex items-center gap-1.5 truncate font-semibold">{player.displayName}{player.hasVerifiedBadge && <span title="Verified Roblox account" aria-label="Verified account" className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#335fff] text-[10px] font-black text-white">✓</span>}</span><span className="block truncate text-sm text-white/60">@{player.name}</span></span>
                            <span className="text-sm font-bold text-[#9eafff]">Sélectionner</span>
                          </button>)}
                        </div>}
                      </>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        )}
      </section>
      </div>
    </main>
  )
}
