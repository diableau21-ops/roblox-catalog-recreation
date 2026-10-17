import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600

const OUTFIT_ID = '131929437'

function safeCdnUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !(url.hostname === 'rbxcdn.com' || url.hostname.endsWith('.rbxcdn.com'))) return null
    return url.toString()
  } catch {
    return null
  }
}

function assetUrl(hash: unknown): string | null {
  return typeof hash === 'string' && /^[a-f0-9]{16,128}$/i.test(hash)
    ? `https://t0.rbxcdn.com/${hash}`
    : null
}

export async function GET() {
  const apiKey = process.env.ROBLOX_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ROBLOX_API_KEY is not configured in Vercel.' }, { status: 503 })
  }

  try {
    const endpoint = new URL('https://thumbnails.roblox.com/v1/users/outfit-3d')
    endpoint.searchParams.set('userOutfitId', OUTFIT_ID)
    endpoint.searchParams.set('useGltf', 'true')
    const response = await fetch(endpoint, {
      headers: { 'x-api-key': apiKey, accept: 'application/json' },
      cache: 'no-store',
    })
    if (!response.ok) {
      const errorBody = (await response.text()).slice(0, 1200)
      return NextResponse.json({
        error: `Roblox outfit 3D request failed (HTTP ${response.status}).`,
        details: errorBody || 'Roblox returned an empty error response.',
        outfitId: OUTFIT_ID,
        requestedFormat: 'gltf',
      }, { status: 502 })
    }

    const payload = await response.json()
    let metadata: Record<string, unknown> = payload && typeof payload === 'object' ? payload : {}
    const metadataUrl = safeCdnUrl(payload?.url ?? payload?.imageUrl)
    if (metadataUrl) {
      const metadataResponse = await fetch(metadataUrl, { cache: 'no-store' })
      if (!metadataResponse.ok) {
        return NextResponse.json({ error: 'Roblox returned an outfit preview URL but its metadata could not be loaded.', state: payload?.state ?? null }, { status: 502 })
      }
      metadata = await metadataResponse.json()
    }

    const obj = safeCdnUrl(metadata.obj) ?? assetUrl(metadata.obj)
    const mtl = safeCdnUrl(metadata.mtl) ?? assetUrl(metadata.mtl)
    const gltf = safeCdnUrl(metadata.gltf) ?? safeCdnUrl(metadata.glb)
    if (!obj && !gltf) {
      return NextResponse.json({
        error: 'Roblox did not provide a directly loadable 3D outfit mesh.',
        state: payload?.state ?? metadata.state ?? 'Unknown',
        availableFields: Object.keys(metadata),
      }, { status: 502 })
    }

    return NextResponse.json({
      outfitId: OUTFIT_ID,
      state: payload?.state ?? metadata.state ?? 'Completed',
      obj,
      mtl,
      gltf,
      note: 'Model supplied by Roblox outfit 3D preview service.',
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'Could not contact Roblox outfit 3D preview service.' }, { status: 502 })
  }
}
