import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600

// Roblox's classic asset ID associated with the Korblox Deathspeaker bundle.
const KORBLOX_CLASSIC_ASSET_ID = '139610216'

export async function GET() {
  const apiKey = process.env.ROBLOX_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'ROBLOX_API_KEY is not configured in the Vercel project.' },
      { status: 503 },
    )
  }

  try {
    const url = new URL('https://thumbnails.roblox.com/v1/assets-thumbnail-3d')
    url.searchParams.set('assetId', KORBLOX_CLASSIC_ASSET_ID)

    const response = await fetch(url, {
      headers: { 'x-api-key': apiKey, accept: 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Roblox 3D preview request failed (HTTP ${response.status}). Check the API key permissions and asset ID.` },
        { status: response.status === 401 || response.status === 403 ? 502 : response.status },
      )
    }

    const payload = await response.json()
    const preview = Array.isArray(payload?.data) ? payload.data[0] : null

    if (!preview || preview.state !== 'Completed' || !preview.obj) {
      return NextResponse.json(
        { error: 'Roblox has not returned a completed 3D model for this asset yet.', state: preview?.state ?? 'Unknown' },
        { status: 502 },
      )
    }

    // Only return Roblox-hosted preview URLs; never expose the API key.
    const allowedHost = (value: unknown) => {
      if (typeof value !== 'string') return null
      try {
        const parsed = new URL(value)
        return parsed.protocol === 'https:' && (parsed.hostname === 'roblox.com' || parsed.hostname.endsWith('.roblox.com') || parsed.hostname.endsWith('.rbxcdn.com')) ? parsed.toString() : null
      } catch {
        return null
      }
    }

    const obj = allowedHost(preview.obj)
    const mtl = allowedHost(preview.mtl)
    if (!obj) {
      return NextResponse.json({ error: 'Roblox returned an unexpected model URL.' }, { status: 502 })
    }

    return NextResponse.json({ obj, mtl, state: preview.state }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'Could not contact the Roblox thumbnail service.' }, { status: 502 })
  }
}
