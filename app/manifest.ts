import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Marché Roblox',
    short_name: 'Marché',
    description: "Catalogue d'avatars et d'articles Roblox.",
    start_url: '/login',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#111216',
    theme_color: '#00A2FF',
    lang: 'fr-CA',
    icons: [
      {
        src: '/icon-roblox.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-roblox.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
