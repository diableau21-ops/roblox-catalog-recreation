import { NextResponse } from 'next/server'

const games = [
  { placeId: '920587237', title: 'Adopt Me!' },
  { placeId: '4924922222', title: 'Brookhaven RP' },
  { placeId: '2753915549', title: 'Blox Fruits' },
  { placeId: '15101393044', title: 'Dress To Impress' },
  { placeId: '1962086868', title: 'Tower of Hell' },
  { placeId: '142823291', title: 'Murder Mystery 2' },
  { placeId: '286090429', title: 'Arsenal' },
  { placeId: '537413528', title: 'Build A Boat' },
]

export async function GET() {
  const results = await Promise.all(games.map(async (game) => {
    try {
      const universeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${game.placeId}/universe`, { next: { revalidate: 3600 } })
      if (!universeResponse.ok) return [game.placeId, ''] as const
      const universe = await universeResponse.json()
      const iconResponse = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universe.universeId}&size=512x512&format=Png&isCircular=false`, { next: { revalidate: 3600 } })
      if (!iconResponse.ok) return [game.placeId, ''] as const
      const icons = await iconResponse.json()
      return [game.placeId, icons.data?.[0]?.imageUrl || ''] as const
    } catch {
      return [game.placeId, ''] as const
    }
  }))
  return NextResponse.json(Object.fromEntries(results), {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
