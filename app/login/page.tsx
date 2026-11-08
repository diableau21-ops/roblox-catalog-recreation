'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RobloxLogo } from '@/components/catalog/robux-icon'

export default function LoginPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('This is only a demo sign-in screen. No account is connected.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f4f5] px-4 py-10 text-[#191b1f]">
      <section className="w-full max-w-[420px] rounded-xl bg-white px-8 py-9 shadow-[0_4px_24px_rgba(0,0,0,0.10)] sm:px-10">
        <div className="mb-8 flex justify-center text-black">
          <RobloxLogo />
        </div>
        <h1 className="mb-7 text-center text-2xl font-extrabold">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold" htmlFor="login-username">Username / Email / Phone</label>
          <input id="login-username" autoComplete="off" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" className="h-12 w-full rounded-lg border border-[#b8bbc2] bg-white px-3 text-base outline-none focus:border-[#335fff] focus:ring-1 focus:ring-[#335fff]" />
          <label className="block text-sm font-semibold" htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="off" placeholder="Password" className="h-12 w-full rounded-lg border border-[#b8bbc2] bg-white px-3 text-base outline-none focus:border-[#335fff] focus:ring-1 focus:ring-[#335fff]" />
          <button type="submit" className="mt-2 h-12 w-full rounded-lg border border-[#191b1f] bg-white text-base font-bold text-[#191b1f] transition-colors hover:bg-[#f2f4f5]">Log In</button>
        </form>
        {message && <p role="status" className="mt-4 rounded-lg bg-[#f2f4f5] p-3 text-center text-sm text-[#4b4d53]">{message}</p>}
        <div className="my-6 border-t border-[#e5e6e8]" />
        <p className="text-center text-xs leading-5 text-[#70737a]">Demo page only. Do not enter your real Roblox password. Nothing is sent or saved.</p>
        <button type="button" onClick={() => router.push('/')} className="mt-5 w-full text-sm font-semibold text-[#335fff] hover:underline">Back to Marketplace</button>
      </section>
    </main>
  )
}
