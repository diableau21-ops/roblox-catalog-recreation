'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const games = [
  { placeId: '920587237', title: 'Adopt Me!', className: 'game-one' },
  { placeId: '4924922222', title: 'Brookhaven RP', className: 'game-two' },
  { placeId: '2753915549', title: 'Blox Fruits', className: 'game-three' },
  { placeId: '15101393044', title: 'Dress To Impress', className: 'game-four' },
  { placeId: '1962086868', title: 'Tower of Hell', className: 'game-five' },
  { placeId: '142823291', title: 'Murder Mystery 2', className: 'game-six' },
  { placeId: '286090429', title: 'Arsenal', className: 'game-seven' },
  { placeId: '537413528', title: 'Build A Boat', className: 'game-eight' },
]

export default function LoginPage() {
  const router = useRouter()
  const [gameImages, setGameImages] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [search, setSearch] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/game-thumbnails')
      .then((response) => response.ok ? response.json() : {})
      .then((images) => { if (active) setGameImages(images) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  async function demoAction() {
    const requestedName = username.trim()
    if (password.length <= 4) { setLoginError('Entre un mot de passe fictif de plus de 4 caractères.'); return }
    if (requestedName.length < 3) { setLoginError('Entre un nom d'utilisateur Roblox d'au moins 3 caractères.'); return }
    setSigningIn(true)
    setLoginError('')
    try {
      const response = await fetch('/api/roblox-users?keyword=' + encodeURIComponent(requestedName), { cache: 'no-store' })
      if (!response.ok) throw new Error('La recherche du profil Roblox a échoué')
      const payload = await response.json()
      const players = Array.isArray(payload.data) ? payload.data : []
      const player = players.find((item: { name?: string }) => item.name?.toLowerCase() === requestedName.toLowerCase())
      if (!player) { setLoginError("Nom d'utilisateur Roblox introuvable. Vérifie l'orthographe et réessaie."); return }
      // This selects a local demo profile; it does not authenticate with Roblox.
      window.localStorage.setItem('catalog-demo-profile', JSON.stringify(player))
      window.sessionStorage.setItem('catalog-demo-signed-in', 'true')
      window.dispatchEvent(new CustomEvent('catalog-profile-updated', { detail: player }))
      // Use a full navigation so the home page re-reads sessionStorage reliably.
      window.location.assign('/')
    } catch { setLoginError('Impossible de charger ce profil Roblox. Réessaie.') }
    finally { setSigningIn(false) }
  }

  return (
    <main className="login-scene relative flex h-screen min-h-[680px] items-center justify-center overflow-hidden bg-[#08090d] px-4 pb-5 pt-[88px] text-white">
      <header className="login-topbar fixed inset-x-0 top-0 z-30 flex h-[64px] items-center gap-6 border-b border-[#393a3f] bg-[#191a1f] px-5 text-white shadow-lg">
        <a href="/" aria-label="Roblox home" className="flex shrink-0 items-center text-white">
          <span className="flex items-center text-[25px] font-black leading-none tracking-[-1.8px]">
            ROBL
            <svg viewBox="0 0 36 36" className="mx-[1px] h-[22px] w-[22px] shrink-0" aria-hidden="true"><path fill="currentColor" d="M8.1 1.8 34.2 8.1 27.9 34.2 1.8 27.9 8.1 1.8Zm6.1 9.1-2.2 9.1 9.1 2.2 2.2-9.1-9.1-2.2Z"/></svg>
            X
          </span>
        </a>
        <nav className="hidden items-center gap-5 whitespace-nowrap text-[15px] font-semibold text-[#e5e5e7] md:flex">
          <a href="/" className="transition hover:text-white">Classements</a>
          <a href="/catalog" className="transition hover:text-white">Marché</a>
          <a href="/create" className="transition hover:text-white">Créer</a>
          <a href="/robux" className="transition hover:text-white">Robux</a>
        </nav>
        <form className="flex h-[36px] w-full max-w-[300px] items-center rounded-lg border border-[#55565d] bg-[#292a30] px-3 focus-within:border-[#a7a8ad]" onSubmit={(event) => event.preventDefault()}>
          <svg viewBox="0 0 24 24" className="mr-2 h-[18px] w-[18px] shrink-0 text-[#bdbec4]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
          <input aria-label="Rechercher" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#bdbec4]" />
        </form>
      </header>
      <div className="login-stars" aria-hidden="true" />
      <div className="game-collage" aria-hidden="true">
        {games.map((game, index) => (
          <div className={`game-tile ${game.className}`} key={game.placeId}>
            {gameImages[game.placeId] ? (
              <img src={gameImages[game.placeId]} alt="" />
            ) : (
              <div className={`game-fallback fallback-${index + 1}`}><span>{game.title}</span></div>
            )}
            {game.placeId === '142823291' && (
              <span className="mm2-notice">Ceci n'est pas une page de connexion officielle de Roblox. N'entre pas ton vrai mot de passe.</span>
            )}
          </div>
        ))}
      </div>
      <section className="relative z-10 w-full max-w-[420px] rounded-[18px] bg-[#191a1f]/95 px-5 pb-5 pt-5 shadow-[0_18px_70px_rgba(0,0,0,.55)] backdrop-blur-[2px]">
        <h1 className="mb-5 text-[22px] font-bold tracking-tight">Connexion</h1>

        <form onSubmit={(event) => { event.preventDefault(); demoAction() }}>
          <label htmlFor="demo-username" className="mb-2 block text-sm font-semibold">Nom d'utilisateur</label>
          <input id="demo-username" type="text" autoComplete="off" value={username} onChange={(event) => { setUsername(event.target.value); setLoginError('') }} placeholder="Nom d'utilisateur" className="mb-4 h-[44px] w-full rounded-[10px] border border-[#626675] bg-[#191a1f] px-4 text-base text-white outline-none placeholder:text-[#a7a9b1] focus:border-[#8b91a3]" />

          <label htmlFor="demo-password" className="mb-2 block text-sm font-semibold">Mot de passe</label>
          <div className="relative">
            <input id="demo-password" type={showPassword ? 'text' : 'password'} autoComplete="off" value={password} onChange={(event) => { setPassword(event.target.value); setLoginError('') }} placeholder="Mot de passe" className="h-[44px] w-full rounded-[10px] border border-[#626675] bg-[#191a1f] py-2 pl-4 pr-12 text-base text-white outline-none placeholder:text-[#a7a9b1] focus:border-[#8b91a3]" />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#c3c4ca] hover:text-white">
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.4 3.3" /><path d="M6.2 6.2C3.9 7.6 2.7 9.6 2.5 12c.7 1.8 3.8 7 9.5 7 1.2 0 2.3-.2 3.3-.7" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>

          <button type="submit" disabled={signingIn || password.length <= 4} className={`mt-4 h-[44px] w-full rounded-[10px] text-base font-semibold transition-colors ${password.length > 4 && !signingIn ? 'bg-[#292a31] text-white hover:bg-[#34353d]' : 'cursor-not-allowed bg-[#17181d] text-[#777982]'} disabled:cursor-not-allowed`}>{signingIn ? 'Chargement du profil…' : 'Connexion'}</button>
          {loginError && <p role="alert" className="mt-3 text-sm text-[#ff8585]">{loginError}</p>}
        </form>

        <button type="button" onClick={demoAction} className="mt-3 text-sm text-[#c3c4ca] underline underline-offset-2">Mot de passe ou nom d'utilisateur oublié ?</button>

        <div className="my-4 flex items-center gap-4 text-xs text-[#c5c6cc]"><span className="h-px flex-1 bg-[#34353c]" />OU<span className="h-px flex-1 bg-[#34353c]" /></div>

        <p className="mt-5 text-center text-sm font-semibold">Tu n'as pas de compte ? <button type="button" onClick={demoAction} className="underline underline-offset-2">Créer one</button></p>
        <button type="button" onClick={() => router.push('/')} className="mt-3 w-full text-sm font-semibold text-[#c6c7cd] underline underline-offset-2">Back to Marché</button>
      </section>
      <style jsx>{`
        .login-topbar { box-sizing: border-box; }\n        .login-stars { position: fixed; inset: 0; pointer-events: none; opacity: .75; background-image: radial-gradient(1px 1px at 8% 18%,#fff 99%,transparent),radial-gradient(1px 1px at 22% 73%,#fff 99%,transparent),radial-gradient(2px 2px at 78% 15%,#fff 99%,transparent),radial-gradient(1px 1px at 91% 62%,#fff 99%,transparent),radial-gradient(1px 1px at 64% 84%,#fff 99%,transparent),radial-gradient(1px 1px at 42% 31%,#fff 99%,transparent); background-size: 230px 190px; }
        .game-collage { position: fixed; inset: 0; overflow: hidden; pointer-events: none; }
        .game-tile { position: absolute; width: clamp(190px, 22vw, 340px); aspect-ratio: 16/9; overflow: hidden; border: 3px solid rgba(255,255,255,.16); border-radius: 13px; background: #20232c; box-shadow: 0 18px 45px rgba(0,0,0,.55); }
        .game-tile img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .mm2-notice { position:absolute; inset:auto 7px 7px 7px; z-index:2; padding:5px 7px; border-radius:6px; background:rgba(0,0,0,.82); color:#fff; font-size:clamp(8px, .8vw, 11px); line-height:1.45; text-align:center; font-weight:600; }
        .game-one { left: -3%; top: 5%; transform: rotate(-13deg); }
        .game-two { right: -2%; top: 3%; transform: rotate(11deg); }
        .game-three { left: 7%; top: 42%; transform: rotate(9deg); }
        .game-four { right: 6%; top: 39%; transform: rotate(-10deg); }
        .game-five { left: -2%; bottom: -8%; transform: rotate(8deg); }
        .game-six { right: -3%; bottom: -7%; transform: rotate(-12deg); }
        .game-seven { left: 35%; top: -13%; transform: rotate(7deg); }
        .game-eight { right: 31%; bottom: -14%; transform: rotate(-7deg); }
        .game-fallback { width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:12px;text-align:center;font-weight:800;font-size:clamp(17px,2vw,25px);color:white;text-shadow:0 2px 8px #000;background:linear-gradient(135deg,#243b68,#151923 55%,#60416c); }
        .fallback-2,.fallback-4 { background:linear-gradient(135deg,#176b76,#17233b 60%,#5d3f72); }
        .fallback-3,.fallback-6 { background:linear-gradient(135deg,#7a4a1f,#23202c 60%,#a03d4a); }
        .fallback-5,.fallback-7,.fallback-8 { background:linear-gradient(135deg,#315a3d,#1c2630 60%,#586c9a); }
        @media (max-width: 700px) { .game-tile { width: 45vw; opacity: .55; } .game-seven,.game-eight { display:none; } .game-three { left:-14%; top:48%; } .game-four { right:-14%; top:48%; } }
      `}</style>
    </main>
  )
}
