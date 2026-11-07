import Link from 'next/link'

export const dynamic = 'force-dynamic'

type RobloxUser = {
  id: number
  name: string
  displayName: string
  description?: string
  created?: string
  isBanned?: boolean
  hasVerifiedBadge?: boolean
}

async function getProfile(id: string) {
  try {
    const [userResponse, avatarResponse, friendsResponse, followersResponse] = await Promise.all([
      fetch(`https://users.roblox.com/v1/users/${encodeURIComponent(id)}`, { cache: 'no-store', signal: AbortSignal.timeout(7000) }),
      fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(id)}&size=420x420&format=Png&isCircular=false`, { cache: 'no-store', signal: AbortSignal.timeout(7000) }),
      fetch(`https://friends.roblox.com/v1/users/${encodeURIComponent(id)}/friends/count`, { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
      fetch(`https://friends.roblox.com/v1/users/${encodeURIComponent(id)}/followers/count`, { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
    ])
    if (!userResponse.ok) return null
    const user = await userResponse.json() as RobloxUser
    const avatarData = avatarResponse.ok ? await avatarResponse.json() : null
    const friendsData = friendsResponse.ok ? await friendsResponse.json() : null
    const followersData = followersResponse.ok ? await followersResponse.json() : null
    return {
      user,
      avatar: avatarData?.data?.[0]?.imageUrl as string | undefined,
      friends: typeof friendsData?.count === 'number' ? friendsData.count : null,
      followers: typeof followersData?.count === 'number' ? followersData.count : null,
    }
  } catch {
    return null
  }
}

function VerifiedBadge() {
  return <span title="Compte vérifié" className="inline-flex size-[18px] items-center justify-center rounded-full bg-[#335fff] text-[11px] font-black text-white">✓</span>
}

export default async function RobloxUserProfile({ params }: { params: Promise<{ id: string; username: string }> }) {
  const { id } = await params
  const result = await getProfile(id)

  return (
    <main className="min-h-screen bg-[#111216] text-white">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-5 border-b border-[#292b32] bg-[#191a20] px-4 shadow-[0_4px_24px_rgba(0,0,0,0.22)] sm:px-7">
        <Link href="/" aria-label="Retour au Marketplace" className="shrink-0 text-xl font-black tracking-tight text-white">ROBLOX</Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#d1d3d8] sm:flex">
          <Link href="/" className="hover:text-black">Charts</Link>
          <Link href="/" className="hover:text-black">Marketplace</Link>
          <Link href="/" className="hover:text-black">Create</Link>
          <Link href="/" className="hover:text-black">Robux</Link>
        </nav>
        <div className="ml-auto flex h-9 max-w-md flex-1 items-center rounded-md bg-[#24262e] px-3 text-sm text-[#a4a7b0]">
          <span className="mr-2">⌕</span><span>Search</span>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-3 py-5 sm:px-6 sm:py-7">
        <Link href="/" className="mb-4 inline-flex text-sm font-semibold text-[#335fff] hover:underline">← Retour au Marketplace</Link>
        {!result ? (
          <section className="rounded-lg bg-[#191a20] p-8 shadow-sm">
            <h1 className="text-2xl font-bold">Profil introuvable</h1>
            <p className="mt-2 text-sm text-[#60656b]">Ce profil Roblox n’existe pas ou les informations ne sont pas disponibles.</p>
          </section>
        ) : (
          <>
            <section className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
                <div className="size-32 shrink-0 overflow-hidden rounded-full bg-[#292b33] sm:size-40">
                  {result.avatar ? <img src={result.avatar} alt={`Avatar de ${result.user.name}`} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-5xl">👤</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold sm:text-3xl">{result.user.displayName}{result.user.hasVerifiedBadge && <VerifiedBadge />}</h1>
                  <p className="mt-1 text-base text-[#60656b]">@{result.user.name}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold">{result.friends?.toLocaleString('en-US') ?? '—'} <span className="font-normal text-[#60656b]">Friends</span></span>
                    <span className="text-[#c4c7ca]">•</span>
                    <span className="font-semibold">{result.followers?.toLocaleString('en-US') ?? '—'} <span className="font-normal text-[#60656b]">Followers</span></span>
                  </div>
                </div>
              </div>
              <nav className="flex gap-7 border-t border-[#30323a] px-5 sm:px-7" aria-label="Profile sections">
                <a href="#about" className="border-b-[3px] border-[#335fff] py-4 text-sm font-bold">About</a>
                <a href="#creations" className="py-4 text-sm font-semibold text-[#60656b] hover:text-[#191b1f]">Creations</a>
              </nav>
            </section>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <section id="about" className="rounded-lg bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-xl font-extrabold">About</h2>
                <p className="mt-4 min-h-16 whitespace-pre-wrap break-words text-sm leading-6 text-[#393b3d]">{result.user.description?.trim() || 'This user has no description.'}</p>
                {result.user.created && <p className="mt-6 border-t border-[#e7e8ea] pt-4 text-sm text-[#60656b]">Join Date: {new Date(result.user.created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
              </section>
              <aside className="h-fit rounded-lg bg-white p-5 shadow-sm">
                <h2 className="text-lg font-extrabold">Statistics</h2>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="flex items-center justify-between"><span className="text-[#60656b]">Friends</span><strong>{result.friends?.toLocaleString('en-US') ?? '—'}</strong></div>
                  <div className="flex items-center justify-between"><span className="text-[#60656b]">Followers</span><strong>{result.followers?.toLocaleString('en-US') ?? '—'}</strong></div>
                  <div className="flex items-center justify-between"><span className="text-[#60656b]">Account status</span><strong>{result.user.isBanned ? 'Banned' : 'Active'}</strong></div>
                </div>
              </aside>
            </div>

            <section id="creations" className="mt-5 rounded-lg bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-extrabold">Creations</h2>
              <p className="mt-3 text-sm text-[#60656b]">This user's public creations can be viewed on their Roblox profile.</p>
            </section>
          </>
        )}
        <p className="mt-6 text-center text-xs text-[#777b86]">Public profile information from Roblox. This fan-made site is not affiliated with Roblox.</p>
      </div>
    </main>
  )
}
