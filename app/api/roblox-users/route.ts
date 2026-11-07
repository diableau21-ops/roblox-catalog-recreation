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
    const players = Array.isArray(result.data)
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

    if (players.length === 0) {
      return NextResponse.json({ data: [] }, { headers: corsHeaders })
    }

    // Use Roblox's current thumbnails endpoint instead of the retired headshot URL.
    const ids = players.map((player: { id: number }) => player.id).join(',')
    const thumbnailsUrl = new URL('https://thumbnails.roblox.com/v1/users/avatar-headshot')
    thumbnailsUrl.search = new URLSearchParams({
      userIds: ids,
      size: '150x150',
      format: 'Png',
      isCircular: 'false',
    }).toString()

    const thumbnailsResponse = await fetch(thumbnailsUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })

    const thumbnailsResult = thumbnailsResponse.ok ? await thumbnailsResponse.json() : { data: [] }
    const avatarById = new Map<number, string>(
      (Array.isArray(thumbnailsResult.data) ? thumbnailsResult.data : [])
        .filter((thumbnail: { targetId?: number; imageUrl?: string; state?: string }) =>
          Number.isFinite(thumbnail.targetId) && typeof thumbnail.imageUrl === 'string' && thumbnail.state === 'Completed',
        )
        .map((thumbnail: { targetId: number; imageUrl: string }) => [thumbnail.targetId, thumbnail.imageUrl]),
    )

    return NextResponse.json({
      data: players.map((player: { id: number; name: string; displayName: string; hasVerifiedBadge: boolean }) => ({
        ...player,
        avatarUrl: avatarById.get(player.id) ?? null,
      })),
    }, { headers: corsHeaders })
  } catch {
    return NextResponse.json({ error: 'Roblox player search is temporarily unavailable.' }, { status: 502, headers: corsHeaders })
  }
}
