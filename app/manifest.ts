import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Riblox',
    short_name: 'Riblox',
    description: "Application catalogue d'avatars et d'articles.",
    start_url: '/login',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone'],
    orientation: 'any',
    background_color: '#111216',
    theme_color: '#00A2FF',
    lang: 'fr-CA',
    icons: [
      {
        src: '/riblox-icon-192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/riblox-icon-512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
