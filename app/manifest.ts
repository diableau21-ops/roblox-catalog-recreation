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
        src: '/riblox-app.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/riblox-app.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
