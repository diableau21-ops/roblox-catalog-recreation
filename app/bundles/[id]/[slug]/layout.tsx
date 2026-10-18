import type { ReactNode } from 'react'

export function generateStaticParams() {
  return [
    { id: '201', slug: 'Headless-Horseman' },
    { id: '192', slug: 'Korblox-Deathspeaker' },
  ]
}

export default function BundleLayout({ children }: { children: ReactNode }) {
  return children
}
