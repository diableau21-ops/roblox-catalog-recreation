import BundlePageClient from './bundle-page-client'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { id: '192', slug: 'Korblox-Deathspeaker' },
    { id: '201', slug: 'Headless-Horseman' },
    { id: '14', slug: '8-Bit-Royal-Crown' },
  ]
}

export default async function BundlePage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>
}) {
  const { id, slug } = await params
  return <BundlePageClient id={id} slug={slug} />
}
