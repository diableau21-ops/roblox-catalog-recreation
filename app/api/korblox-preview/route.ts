import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600

const KORBLOX_CLASSIC_ASSET_ID = '139610216'
const KORBLOX_BUNDLE_ID = '192'

async function getOfficialThumbnail() {
  try {
    const url = new URL('https://thumbnails.roblox.com/v1/bundles/thumbnails')
    url.searchParams.set('bundleIds', KORBLOX_BUNDLE_ID)
    url.searchParams.set('size', '420x420')
    url.searchParams.set('format', 'Png')
    url.searchParams.set('isCircular', 'false')
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return null
    const payload = await response.json()
    const imageUrl = payload?.data?.[0]?.imageUrl
    return typeof imageUrl === 'string' ? imageUrl : null
  } catch {
    return null
  }
}

export async function GET() {
  const apiKey = process.env.ROBLOX_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ROBLOX_API_KEY is not configured in Vercel.' }, { status: 503 })
  }

  try {
    const endpoint = new URL('https://thumbnails.roblox.com/v1/assets-thumbnail-3d')
    endpoint.searchParams.set('assetId', KORBLOX_CLASSIC_ASSET_ID)

    const response = await fetch(endpoint, {
      headers: { 'x-api-key': apiKey, accept: 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Roblox 3D preview request failed (HTTP ${response.status}). Check the API key's thumbnails/read permission.`, thumbnailUrl: await getOfficialThumbnail() },
        { status: 502 },
      )
    }

    const payload = await response.json()
    const preview = Array.isArray(payload?.data) ? payload.data[0] : null

    if (!preview || preview.state !== 'Completed' || typeof preview.imageUrl !== 'string') {
      return NextResponse.json({
        error: 'Roblox has not generated a 3D preview for this asset.',
        state: preview?.state ?? 'Unknown',
        thumbnailUrl: await getOfficialThumbnail(),
      }, { status: 502 })
    }

    const metadataUrl = new URL(preview.imageUrl)
    if (metadataUrl.protocol !== 'https:' || !metadataUrl.hostname.endsWith('.rbxcdn.com')) {
      return NextResponse.json({ error: 'Roblox returned an unexpected preview metadata URL.', thumbnailUrl: await getOfficialThumbnail() }, { status: 502 })
    }

    const metadataResponse = await fetch(metadataUrl, { cache: 'no-store' })
    if (!metadataResponse.ok) {
      return NextResponse.json({ error: 'Could not read Roblox 3D preview metadata.', thumbnailUrl: await getOfficialThumbnail() }, { status: 502 })
    }

    const metadata = await metadataResponse.json()
    if (typeof metadata?.obj !== 'string') {
      return NextResponse.json({ error: 'Roblox preview metadata does not contain a 3D model.', thumbnailUrl: await getOfficialThumbnail() }, { status: 502 })
    }

    const assetUrl = (hash: unknown) => typeof hash === 'string' && /^[a-f0-9]{16,128}$/i.test(hash)
      ? `https://t0.rbxcdn.com/${hash}`
      : null

    const obj = assetUrl(metadata.obj)
    const mtl = assetUrl(metadata.mtl)
    if (!obj) {
      return NextResponse.json({ error: 'Roblox returned an invalid model reference.', thumbnailUrl: await getOfficialThumbnail() }, { status: 502 })
    }

    return NextResponse.json({ obj, mtl, state: preview.state }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'Could not contact Roblox 3D preview service.', thumbnailUrl: await getOfficialThumbnail() }, { status: 502 })
  }
}
