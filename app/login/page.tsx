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
  const [message, setMessage] = useState('')
  const [gameImages, setGameImages] = useState<Record<string, string>>({})

  useEffect(() => {
    let active = true
    fetch('/api/game-thumbnails')
      .then((response) => response.ok ? response.json() : {})
      .then((images) => { if (active) setGameImages(images) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  function demoAction() {
    setMessage('Demo only — no Roblox account is connected. Do not enter your real password.')
  }

  return (
    <main className="login-scene relative flex h-screen min-h-[680px] items-center justify-center overflow-hidden bg-[#08090d] px-4 py-5 text-white">
      <div className="login-stars" aria-hidden="true" />
      <div className="game-collage" aria-hidden="true">
        {games.map((game, index) => (
          <div className={`game-tile ${game.className}`} key={game.placeId}>
            {gameImages[game.placeId] ? (
              <img src={gameImages[game.placeId]} alt="" />
            ) : (
              <div className={`game-fallback fallback-${index + 1}`}><span>{game.title}</span></div>
            )}
          </div>
        ))}
      </div>
      <section className="relative z-10 w-full max-w-[420px] rounded-[18px] bg-[#191a1f]/95 px-5 pb-5 pt-5 shadow-[0_18px_70px_rgba(0,0,0,.55)] backdrop-blur-[2px]">
        <h1 className="mb-5 text-[22px] font-bold tracking-tight">Sign in</h1>

        <form onSubmit={(event) => { event.preventDefault(); demoAction() }}>
          <label htmlFor="demo-username" className="mb-2 block text-sm font-semibold">Username, email, or phone</label>
          <input id="demo-username" type="text" autoComplete="off" placeholder="Username, email, or phone" className="mb-4 h-[44px] w-full rounded-[10px] border border-[#626675] bg-[#191a1f] px-4 text-base text-white outline-none placeholder:text-[#a7a9b1] focus:border-[#8b91a3]" />

          <label htmlFor="demo-password" className="mb-2 block text-sm font-semibold">Password</label>
          <input id="demo-password" type="password" autoComplete="new-password" placeholder="Password (demo only)" className="h-[44px] w-full rounded-[10px] border border-[#626675] bg-[#191a1f] px-4 text-base text-white outline-none placeholder:text-[#a7a9b1] focus:border-[#8b91a3]" />

          <button type="submit" className="mt-4 h-[44px] w-full rounded-[10px] bg-[#292a31] text-base font-semibold text-[#a5a6ad] hover:bg-[#34353d]">Sign in</button>
        </form>

        <button type="button" onClick={demoAction} className="mt-3 text-sm text-[#c3c4ca] underline underline-offset-2">Forgot password or username?</button>

        <div className="my-4 flex items-center gap-4 text-xs text-[#c5c6cc]"><span className="h-px flex-1 bg-[#34353c]" />OR<span className="h-px flex-1 bg-[#34353c]" /></div>

        <div className="space-y-2">
          <button type="button" onClick={demoAction} className="h-[44px] w-full rounded-[10px] bg-[#303139] text-base font-semibold hover:bg-[#3a3b44]">✉　Email a code</button>
          <button type="button" onClick={demoAction} className="h-[44px] w-full rounded-[10px] bg-[#303139] text-base font-semibold hover:bg-[#3a3b44]">▦　QR code</button>
          <button type="button" onClick={demoAction} className="h-[44px] w-full rounded-[10px] bg-[#303139] text-base font-semibold hover:bg-[#3a3b44]">Other sign-in options</button>
        </div>

        {message && <p role="status" className="mt-4 rounded-lg bg-[#292a31] p-3 text-center text-sm text-[#e5e6eb]">{message}</p>}

        <p className="mt-5 text-center text-sm font-semibold">Don't have an account? <button type="button" onClick={demoAction} className="underline underline-offset-2">Create one</button></p>
        <p className="mt-3 text-center text-xs leading-5 text-[#a5a6ad]">Demo page only. Nothing you type is saved or sent anywhere. Never enter your real Roblox password here.</p>
        <button type="button" onClick={() => router.push('/')} className="mt-3 w-full text-sm font-semibold text-[#c6c7cd] underline underline-offset-2">Back to Marketplace</button>
      </section>
      <style jsx>{`
        .login-stars { position: fixed; inset: 0; pointer-events: none; opacity: .75; background-image: radial-gradient(1px 1px at 8% 18%,#fff 99%,transparent),radial-gradient(1px 1px at 22% 73%,#fff 99%,transparent),radial-gradient(2px 2px at 78% 15%,#fff 99%,transparent),radial-gradient(1px 1px at 91% 62%,#fff 99%,transparent),radial-gradient(1px 1px at 64% 84%,#fff 99%,transparent),radial-gradient(1px 1px at 42% 31%,#fff 99%,transparent); background-size: 230px 190px; }
        .game-collage { position: fixed; inset: 0; overflow: hidden; pointer-events: none; }
        .game-tile { position: absolute; width: clamp(190px, 22vw, 340px); aspect-ratio: 16/9; overflow: hidden; border: 3px solid rgba(255,255,255,.16); border-radius: 13px; background: #20232c; box-shadow: 0 18px 45px rgba(0,0,0,.55); }
        .game-tile img { width: 100%; height: 100%; object-fit: cover; display: block; }
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
