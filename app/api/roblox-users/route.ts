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

    const ids = data.map((player: { id: number }) => player.id).join(',')
    let thumbnails: { data?: { targetId?: number; imageUrl?: string }[] } = {}
    if (ids) {
      try {
        const thumbResponse = await fetch(
          `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids}&size=150x150&format=Png&isCircular=false`,
          { headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(8000) },
        )
        if (thumbResponse.ok) thumbnails = await thumbResponse.json()
      } catch {}
    }
    const avatarById = new Map(
      (thumbnails.data ?? []).map((thumbnail) => [thumbnail.targetId, thumbnail.imageUrl]),
    )
    return NextResponse.json({
      data: data.map((player: { id: number; name: string; displayName: string }) => ({
        ...player,
        avatarUrl: avatarById.get(player.id) ?? null,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Roblox player search is temporarily unavailable.' }, { status: 502 })
  }
}
