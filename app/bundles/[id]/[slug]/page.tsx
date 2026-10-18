import BundlePageClient from './bundle-page-client'

export function generateStaticParams() {
  return [
    { id: '192', slug: 'Korblox-Deathspeaker' },
    { id: '201', slug: 'Headless-Horseman' },
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
