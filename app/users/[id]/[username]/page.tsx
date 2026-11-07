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
    const [userResponse, avatarResponse, friendsResponse, followersResponse, followingResponse] = await Promise.all([
      fetch(`https://users.roblox.com/v1/users/${encodeURIComponent(id)}`, { cache: 'no-store', signal: AbortSignal.timeout(7000) }),
      fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(id)}&size=420x420&format=Png&isCircular=false`, { cache: 'no-store', signal: AbortSignal.timeout(7000) }),
      fetch(`https://friends.roblox.com/v1/users/${encodeURIComponent(id)}/friends/count`, { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
      fetch(`https://friends.roblox.com/v1/users/${encodeURIComponent(id)}/followers/count`, { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
      fetch(`https://friends.roblox.com/v1/users/${encodeURIComponent(id)}/followings/count`, { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
    ])
    if (!userResponse.ok) return null
    const user = await userResponse.json() as RobloxUser
    const avatarData = avatarResponse.ok ? await avatarResponse.json() : null
    const friendsData = friendsResponse.ok ? await friendsResponse.json() : null
    const followersData = followersResponse.ok ? await followersResponse.json() : null
    const followingData = followingResponse.ok ? await followingResponse.json() : null
    return {
      user,
      avatar: avatarData?.data?.[0]?.imageUrl as string | undefined,
      friends: typeof friendsData?.count === 'number' ? friendsData.count : null,
      followers: typeof followersData?.count === 'number' ? followersData.count : null,
      following: typeof followingData?.count === 'number' ? followingData.count : null,
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
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-5 border-b border-[#252525] bg-black px-4 sm:px-7">
        <Link href="/" aria-label="Retour au Marketplace" className="shrink-0 text-xl font-black tracking-tight text-white">ROBLOX</Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-white sm:flex">
          <Link href="/" className="hover:text-white">Charts</Link>
          <Link href="/" className="hover:text-white">Marketplace</Link>
          <Link href="/" className="hover:text-white">Create</Link>
          <Link href="/" className="hover:text-white">Robux</Link>
        </nav>
        <div className="ml-auto flex h-9 max-w-md flex-1 items-center rounded-none border-b border-[#333333] bg-transparent px-3 text-sm text-[#d0d0d0]">
          <span className="mr-2">⌕</span><span>Search</span>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-3 py-5 sm:px-6 sm:py-7">
        <Link href="/" className="mb-4 inline-flex text-sm font-semibold text-[#335fff] hover:underline">← Retour au Marketplace</Link>
        {!result ? (
          <section className="bg-transparent p-0">
            <h1 className="text-2xl font-bold">Profil introuvable</h1>
            <p className="mt-2 text-sm text-[#c4c4c4]">Ce profil Roblox n’existe pas ou les informations ne sont pas disponibles.</p>
          </section>
        ) : (
          <>
            <section className="overflow-hidden rounded-none border-0 bg-transparent shadow-none">
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
                <div className="size-32 shrink-0 overflow-hidden rounded-full bg-[#171717] sm:size-40">
                  {result.avatar ? <img src={result.avatar} alt={`Avatar de ${result.user.name}`} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-5xl">👤</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold sm:text-3xl">{result.user.displayName}{result.user.hasVerifiedBadge && <VerifiedBadge />}</h1>
                  <p className="mt-1 text-base text-[#a4a7b0]">@{result.user.name}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold">{result.friends?.toLocaleString('en-US') ?? '—'} <span className="font-normal text-[#a4a7b0]">Friends</span></span>
                    <span className="text-[#777777]">•</span>
                    <span className="font-semibold">{result.followers?.toLocaleString('en-US') ?? '—'} <span className="font-normal text-[#a4a7b0]">Followers</span></span>
                    <span className="text-[#555963]">•</span>
                    <span className="font-semibold">{result.following?.toLocaleString('en-US') ?? '—'} <span className="font-normal text-[#a4a7b0]">Following</span></span>
                  </div>
                </div>
              </div>
              <nav className="flex gap-7 border-t border-[#252525] px-5 sm:px-7" aria-label="Profile sections">
                <a href="#about" className="border-b-[3px] border-[#335fff] py-4 text-sm font-bold">About</a>
                
              </nav>
            </section>

            <div className="mt-5">
              <section id="about" className="rounded-none border-0 bg-transparent p-0 shadow-none sm:p-0">
                <h2 className="text-xl font-extrabold">About</h2>
                <p className="mt-4 min-h-16 whitespace-pre-wrap break-words text-sm leading-6 text-[#d1d3d8]">{result.user.description?.trim() || 'This user has no description.'}</p>
                {result.user.created && <p className="mt-6 border-t border-[#252525] pt-4 text-sm text-[#a4a7b0]">Join Date: {new Date(result.user.created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
              </section>
            </div>

          </>
        )}
        <p className="mt-6 text-center text-xs text-[#a0a0a0]">Public profile information from Roblox. This fan-made site is not affiliated with Roblox.</p>
      </div>
    </main>
  )
}
