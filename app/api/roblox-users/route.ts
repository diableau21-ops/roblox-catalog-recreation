import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

export async function GET(request: Request) {
  const keyword = new URL(request.url).searchParams.get('keyword')?.trim()

  if (!keyword || keyword.length < 3) {
    return NextResponse.json({ data: [] }, { headers: corsHeaders })
  }

  try {
    const upstream = await fetch(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(keyword)}&limit=25`,
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      },
    )

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Roblox player search is temporarily unavailable.' }, { status: 502, headers: corsHeaders })
    }

    const result = await upstream.json()
    const data = Array.isArray(result.data)
      ? result.data
          .filter((player: { id?: number; name?: string; displayName?: string }) =>
            Number.isFinite(player.id) && typeof player.name === 'string',
          )
          .map((player: { id: number; name: string; displayName?: string; hasVerifiedBadge?: boolean }) => ({
            id: player.id,
            name: player.name,
            displayName: player.displayName || player.name,
            hasVerifiedBadge: player.hasVerifiedBadge === true,
          }))
      : []

    return NextResponse.json({
      data: data.map((player: { id: number; name: string; displayName: string; hasVerifiedBadge: boolean }) => ({
        ...player,
        avatarUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${player.id}&width=150&height=150&format=png`,
      })),
    }, { headers: corsHeaders })
  } catch {
    return NextResponse.json({ error: 'Roblox player search is temporarily unavailable.' }, { status: 502, headers: corsHeaders })
  }
}
