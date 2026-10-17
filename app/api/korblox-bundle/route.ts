import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600

// Official public Roblox Catalog API: returns the real item IDs inside Korblox Deathspeaker.
export async function GET() {
  try {
    const response = await fetch('https://catalog.roblox.com/v1/bundles/192/details', {
      headers: { accept: 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Roblox bundle details request failed (HTTP ${response.status}).` },
        { status: 502 },
      )
    }

    const bundle = await response.json()
    const items = Array.isArray(bundle?.Items) ? bundle.Items : Array.isArray(bundle?.items) ? bundle.items : null

    if (!items) {
      return NextResponse.json(
        { error: 'Roblox returned bundle details without an items list.', bundle },
        { status: 502 },
      )
    }

    return NextResponse.json({
      id: bundle.Id ?? bundle.id ?? 192,
      name: bundle.Name ?? bundle.name ?? 'Korblox Deathspeaker',
      description: bundle.Description ?? bundle.description ?? '',
      bundleType: bundle.BundleType ?? bundle.bundleType ?? 'BodyParts',
      items: items.map((item: Record<string, unknown>) => ({
        id: item.Id ?? item.id,
        name: item.Name ?? item.name,
        type: item.Type ?? item.type,
        assetType: item.AssetType ?? item.assetType,
      })),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json(
      { error: 'Could not contact the official Roblox Catalog API.' },
      { status: 502 },
    )
  }
}
