'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')

  function demoAction() {
    setMessage('Demo only — no Roblox account is connected. Do not enter your real password.')
  }

  return (
    <main
      className="flex min-h-screen items-start justify-center overflow-y-auto bg-black bg-cover bg-center bg-no-repeat px-4 pb-8 text-white"
      style={{
        backgroundImage: "url('/login-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        paddingTop: 'clamp(88px, 13.5vh, 112px)',
      }}
    >
      <section className="w-full max-w-[520px] rounded-[18px] bg-[#191a1f] px-5 pb-8 pt-7 shadow-none sm:px-5" style={{ minHeight: 'min(700px, calc(100vh - 100px))' }}>
        <h1 className="mb-9 text-[24px] font-bold tracking-tight">Sign in</h1>

        <form onSubmit={(event) => { event.preventDefault(); demoAction() }}>
          <label htmlFor="demo-username" className="mb-3 block text-base font-semibold">Username, email, or phone</label>
          <input
            id="demo-username"
            type="text"
            autoComplete="off"
            placeholder="Username, email, or phone"
            className="mb-5 h-[50px] w-full rounded-[10px] border border-[#626675] bg-[#191a1f] px-4 text-base text-white outline-none placeholder:text-[#a7a9b1] focus:border-[#8b91a3]"
          />

          <label htmlFor="demo-password" className="mb-3 block text-base font-semibold">Password</label>
          <input
            id="demo-password"
            type="password"
            autoComplete="new-password"
            placeholder="Password (demo only)"
            className="h-[50px] w-full rounded-[10px] border border-[#626675] bg-[#191a1f] px-4 text-base text-white outline-none placeholder:text-[#a7a9b1] focus:border-[#8b91a3]"
          />

          <button type="submit" className="mt-5 h-[50px] w-full rounded-[10px] bg-[#292a31] text-base font-semibold text-[#a5a6ad] hover:bg-[#34353d]">
            Sign in
          </button>
        </form>

        <button type="button" onClick={demoAction} className="mt-4 text-sm text-[#c3c4ca] underline underline-offset-2">Forgot password or username?</button>

        <div className="my-6 flex items-center gap-4 text-xs text-[#c5c6cc]">
          <span className="h-px flex-1 bg-[#34353c]" />
          OR
          <span className="h-px flex-1 bg-[#34353c]" />
        </div>

        <div className="space-y-2.5">
          <button type="button" onClick={demoAction} className="h-[50px] w-full rounded-[10px] bg-[#303139] text-base font-semibold hover:bg-[#3a3b44]">✉　Email a code</button>
          <button type="button" onClick={demoAction} className="h-[50px] w-full rounded-[10px] bg-[#303139] text-base font-semibold hover:bg-[#3a3b44]">▦　QR code</button>
          <button type="button" onClick={demoAction} className="h-[50px] w-full rounded-[10px] bg-[#303139] text-base font-semibold hover:bg-[#3a3b44]">Other sign-in options</button>
        </div>

        {message && <p role="status" className="mt-4 rounded-lg bg-[#292a31] p-3 text-center text-sm text-[#e5e6eb]">{message}</p>}

        <p className="mt-7 text-center text-sm font-semibold">
          Don't have an account? <button type="button" onClick={demoAction} className="underline underline-offset-2">Create one</button>
        </p>
        <p className="mt-5 text-center text-xs leading-5 text-[#a5a6ad]">Demo page only. Nothing you type is saved or sent anywhere. Never enter your real Roblox password here.</p>
        <button type="button" onClick={() => router.push('/')} className="mt-4 w-full text-sm font-semibold text-[#c6c7cd] underline underline-offset-2">Back to Marketplace</button>
      </section>
    </main>
  )
}
