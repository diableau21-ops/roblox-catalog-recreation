import type { Metadata, Viewport } from 'next'
import './globals.css'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title: "Marché - Boutique d'avatars",
  description:
    'Personnalise ton avatar avec des vêtements, accessoires, équipements et plus encore.',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      {
        url: `${basePath}/icon-roblox.svg`,
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
    apple: `${basePath}/icon-roblox.svg`,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#00A2FF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="roblox">
      <body className="antialiased">{children}</body>
    </html>
  )
}
