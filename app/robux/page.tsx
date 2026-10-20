'use client'

import { useState } from 'react'
import { RobuxIcon } from '@/components/catalog/robux-icon'

const packages = [
  { amount: '24,000', previous: '22,500', bonus: '+1,500 more', price: '279.99 $' },
  { amount: '11,000', previous: '10,000', bonus: '+1,000 more', price: '139.99 $' },
  { amount: '5,250', previous: '4,500', bonus: '+750 more', price: '69.99 $' },
  { amount: '3,625', previous: '3,150', bonus: '+475 more', price: '49.99 $', featured: true },
]

export default function RobuxPage() {
  const [message, setMessage] = useState('')

  return (
    <main className="min-h-dvh bg-[#0B0B0D] px-4 pb-12 pt-5 text-[#F7F6F2] sm:px-6 sm:pt-7">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-end gap-4">
        <div className="flex items-center gap-2 text-base font-extrabold tabular-nums">
          <RobuxIcon className="size-6" />
          <span>0</span>
        </div>
        <button
          type="button"
          onClick={() => setMessage('You have no Robux available to send.')}
          className="rounded-lg bg-[#29292E] px-5 py-2.5 text-sm font-extrabold transition-colors hover:bg-[#38383F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Send
        </button>
      </header>

      <section className="mx-auto mt-12 w-full max-w-3xl sm:mt-16">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Enjoy up to 25% more Robux
        </h1>
        <h2 className="mt-8 text-xl font-extrabold tracking-tight sm:mt-10 sm:text-2xl">
          Robux packages
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
                      For you
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
                onClick={() => setMessage('Purchases are not processed on this demo site.')}
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
      </section>
    </main>
  )
}
