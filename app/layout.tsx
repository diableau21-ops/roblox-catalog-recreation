import type { Metadata, Viewport } from 'next'
import './globals.css'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title: 'Riblox',
  description:
    "Catalogue non officiel d'avatars et d'articles inspirés de Roblox.",
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      {
        url: `${basePath}/riblox-app.svg`,
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
    apple: `${basePath}/riblox-app.svg`,
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
