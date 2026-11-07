'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

export function ProfileActions({ username }: { username: string }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleOutsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    return () => document.removeEventListener('pointerdown', handleOutsideClick)
  }, [open])

  return (
    <div ref={containerRef} className="relative flex shrink-0 items-center gap-2 self-start sm:self-center">
      <button type="button" className="h-10 rounded-md bg-[#393b40] px-4 text-sm font-bold text-white hover:bg-[#4a4c52]">
        Add Friend
      </button>
      <button type="button" className="h-10 rounded-md bg-[#335fff] px-4 text-sm font-bold text-white hover:bg-[#264bd6]">
        Add Trusted Friend
      </button>
      <button type="button" aria-label="More profile actions" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex size-10 items-center justify-center rounded-full text-white hover:bg-[#242529]">
        <MoreHorizontal className="size-6" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[80] mt-1 w-44 overflow-hidden rounded-md border border-[#38393e] bg-[#242529] py-1 shadow-xl">
          <Link href={'/robux?q=' + encodeURIComponent(username)} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Send Robux</Link>
          <button type="button" className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Follow</button>
          <button type="button" className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Inventory</button>
          <button type="button" className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Favorites</button>
          <button type="button" className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Block User</button>
          <button type="button" className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Report Abuse</button>
        </div>
      )}
    </div>
  )
}
