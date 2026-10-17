import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600

type BundleItem = {
  id?: number
  name?: string
  type?: string
  assetType?: string
}

async function getPreview(item: BundleItem, apiKey: string) {
  if (!item.id) return { ...item, previewState: 'MissingId' }
  try {
    const endpoint = new URL('https://thumbnails.roblox.com/v1/assets-thumbnail-3d')
    endpoint.searchParams.set('assetId', String(item.id))
    const response = await fetch(endpoint, {
      headers: { 'x-api-key': apiKey, accept: 'application/json' },
      cache: 'no-store',
    })
    if (!response.ok) return { ...item, previewState: `HTTP${response.status}` }
    const payload = await response.json()
    const preview = Array.isArray(payload?.data) ? payload.data[0] : null
    if (!preview || preview.state !== 'Completed' || typeof preview.imageUrl !== 'string') {
      return { ...item, previewState: preview?.state ?? 'Unavailable' }
    }

    const metadataUrl = new URL(preview.imageUrl)
    if (metadataUrl.protocol !== 'https:' || !metadataUrl.hostname.endsWith('.rbxcdn.com')) {
      return { ...item, previewState: 'InvalidMetadataUrl' }
    }
    const metadataResponse = await fetch(metadataUrl, { cache: 'no-store' })
    if (!metadataResponse.ok) return { ...item, previewState: 'MetadataUnavailable' }
    const metadata = await metadataResponse.json()
    const assetUrl = (hash: unknown) => typeof hash === 'string' && /^[a-f0-9]{16,128}$/i.test(hash)
      ? `https://t0.rbxcdn.com/${hash}`
      : null
    const obj = assetUrl(metadata?.obj)
    const mtl = assetUrl(metadata?.mtl)
    if (!obj) return { ...item, previewState: 'NoObj' }
    return { ...item, previewState: 'Completed', obj, mtl }
  } catch {
    return { ...item, previewState: 'Error' }
  }
}

export async function GET() {
  const apiKey = process.env.ROBLOX_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ROBLOX_API_KEY is not configured in Vercel.' }, { status: 503 })
  }

  try {
    const response = await fetch('https://catalog.roblox.com/v1/bundles/192/details', {
      headers: { accept: 'application/json' },
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      return NextResponse.json({ error: `Roblox bundle details request failed (HTTP ${response.status}).` }, { status: 502 })
    }
    const bundle = await response.json()
    const items: BundleItem[] = Array.isArray(bundle?.Items) ? bundle.Items : Array.isArray(bundle?.items) ? bundle.items : []
    if (!items.length) {
      return NextResponse.json({ error: 'Roblox returned no bundle items.' }, { status: 502 })
    }

    const previews = await Promise.all(items.map((item) => getPreview(item, apiKey)))
    return NextResponse.json({
      id: bundle.Id ?? bundle.id ?? 192,
      name: bundle.Name ?? bundle.name ?? 'Korblox Deathspeaker',
      items: previews,
      availablePreviewCount: previews.filter((item) => item.previewState === 'Completed').length,
      note: 'OBJ previews are separate asset previews; Roblox does not guarantee that they can be assembled into an exact avatar rig.',
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'Could not contact Roblox Catalog or 3D preview service.' }, { status: 502 })
  }
}
