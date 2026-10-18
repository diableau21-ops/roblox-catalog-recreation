import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const keyword = new URL(request.url).searchParams.get('keyword')?.trim()

  if (!keyword || keyword.length < 3) {
    return NextResponse.json({ data: [] })
  }

  try {
    const upstream = await fetch(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(keyword)}&limit=10`,
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      },
    )

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Roblox player search is temporarily unavailable.' }, { status: 502 })
    }

    const result = await upstream.json()
    const data = Array.isArray(result.data)
      ? result.data
          .filter((player: { id?: number; name?: string; displayName?: string }) =>
            Number.isFinite(player.id) && typeof player.name === 'string',
          )
          .map((player: { id: number; name: string; displayName?: string }) => ({
            id: player.id,
            name: player.name,
            displayName: player.displayName || player.name,
          }))
      : []

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Roblox player search is temporarily unavailable.' }, { status: 502 })
  }
}
