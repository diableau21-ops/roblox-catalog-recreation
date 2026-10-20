import type { Metadata, Viewport } from 'next'
import './globals.css'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title: 'Marketplace - Avatar Shop',
  description:
    'Customize your avatar with a never-ending marketplace of clothing, accessories, gear, and more.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: `${basePath}/icon-light-32x32.png`,
        media: '(prefers-color-scheme: light)',
      },
      {
        url: `${basePath}/icon-dark-32x32.png`,
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: `${basePath}/icon.svg`,
        type: 'image/svg+xml',
      },
    ],
    apple: `${basePath}/apple-icon.png`,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#111216',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="roblox">
      <body className="antialiased">{children}<footer style={{ padding: "12px 16px", textAlign: "center", color: "#8b8b8b", fontSize: "12px" }}>デモサイト</footer></body>
    </html>
  )
}
