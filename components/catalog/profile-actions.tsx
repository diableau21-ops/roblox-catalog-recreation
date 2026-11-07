'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

export function ProfileActions({ username }: { username: string }) {
  const [open, setOpen] = useState(false)
  const [following, setFollowing] = useState(false)
  const [trusted, setTrusted] = useState(false)

  return (
    <div className="relative flex shrink-0 items-center gap-2 self-start sm:self-center">
      <button
        type="button"
        onClick={() => setTrusted((value) => !value)}
        className="h-10 rounded-md bg-[#335fff] px-4 text-sm font-bold text-white hover:bg-[#264bd6]"
      >
        {trusted ? 'Trusted Friend' : 'Add Trusted Friend'}
      </button>
      <button type="button" aria-label="More profile actions" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex size-10 items-center justify-center rounded-full text-white hover:bg-[#242529]">
        <MoreHorizontal className="size-6" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[80] mt-1 w-40 overflow-hidden rounded-md border border-[#38393e] bg-[#242529] py-1 shadow-xl">
          <Link href={'/robux?q=' + encodeURIComponent(username)} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">Send Robux</Link>
          <button type="button" onClick={() => setFollowing((value) => !value)} className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-[#35363c]">{following ? 'Following' : 'Follow'}</button>
        </div>
      )}
    </div>
  )
}
