import Link from 'next/link'
import { ProfileSiteHeader } from '@/components/catalog/profile-site-header'
import { LeftNav } from '@/components/catalog/left-nav'
import { ProfileActions } from '@/components/catalog/profile-actions'

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
      <ProfileSiteHeader />
      <LeftNav dark />

      <div className="ml-0 w-full px-3 pb-20 pt-5 sm:px-8 sm:py-7 md:ml-[220px] md:w-[calc(100%-220px)]">
        <Link href="/" className="mb-4 inline-flex text-sm font-semibold text-[#335fff] hover:underline">← Retour au Marketplace</Link>
        {!result ? (
          <section className="bg-transparent p-0">
            <h1 className="text-2xl font-bold">Profil introuvable</h1>
            <p className="mt-2 text-sm text-[#c4c4c4]">Ce profil Roblox n’existe pas ou les informations ne sont pas disponibles.</p>
          </section>
        ) : (
          <>
            <section className="w-full border-0 bg-transparent shadow-none">
              <div className="flex w-full flex-col gap-5 p-0 sm:flex-row sm:items-center sm:py-5">
                <div className="size-32 shrink-0 overflow-hidden rounded-full bg-[#171717] sm:size-40">
                  {result.avatar ? <img src={result.avatar} alt={`Avatar de ${result.user.name}`} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-5xl">👤</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold sm:text-3xl">{result.user.displayName}{result.user.hasVerifiedBadge && <VerifiedBadge />}</h1>
                  <p className="mt-1 text-base text-[#a4a7b0]">@{result.user.name}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold">{result.friends?.toLocaleString('fr-CA') ?? '—'} <span className="font-normal text-[#a4a7b0]">Amis</span></span>
                    <span className="text-[#777777]">•</span>
                    <span className="font-semibold">{result.followers?.toLocaleString('fr-CA') ?? '—'} <span className="font-normal text-[#a4a7b0]">Abonnés</span></span>
                    <span className="text-[#555963]">•</span>
                    <span className="font-semibold">{result.following?.toLocaleString('fr-CA') ?? '—'} <span className="font-normal text-[#a4a7b0]">Abonnements</span></span>
                  </div>
                </div>
                <ProfileActions username={result.user.name} />
              </div>
              <nav className="flex gap-7 border-b border-[#252525] px-0" aria-label="Sections du profil">
                <a href="#about" className="border-b-[3px] border-[#335fff] py-4 text-sm font-bold">À propos</a>
                
              </nav>
            </section>

            <div className="mt-5 w-full">
              <section id="about" className="w-full border-0 bg-transparent p-0 shadow-none">
                <h2 className="text-xl font-extrabold">À propos</h2>
                <p className="mt-4 min-h-16 whitespace-pre-wrap break-words text-sm leading-6 text-[#d1d3d8]">{result.user.description?.trim() || 'This user has no description.'}</p>
                {result.user.created && <p className="mt-6 border-t border-[#252525] pt-4 text-sm text-[#a4a7b0]">Join Date: {new Date(result.user.created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
              </section>
            </div>

          </>
        )}
        <p className="mt-6 text-left text-xs text-[#a0a0a0]">Informations publiques du profil provenant de Roblox. Ce site créé par des fans n’est pas affilié à Roblox.</p>
      </div>
    </main>
  )
}
