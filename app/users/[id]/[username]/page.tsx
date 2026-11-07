import Image from 'next/image'
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
  return <span title="Compte vérifié" className="inline-flex size-5 items-center justify-center rounded-full bg-[#335fff] text-xs font-black text-white">✓</span>
}

export default async function RobloxUserProfile({ params }: { params: Promise<{ id: string; username: string }> }) {
  const { id } = await params
  const result = await getProfile(id)

  return (
    <main className="min-h-screen bg-[#f2f4f5] text-[#202227]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/" className="text-sm font-semibold text-[#335fff] hover:underline">← Retour au Marketplace</Link>
        {!result ? (
          <section className="mt-6 rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold">Profil introuvable</h1>
            <p className="mt-2 text-sm text-[#60656b]">Ce profil Roblox n’existe pas ou les informations ne sont pas disponibles.</p>
          </section>
        ) : (
          <>
            <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="h-36 bg-gradient-to-r from-[#273b68] via-[#4565a8] to-[#9bb7df] sm:h-48" />
              <div className="px-5 pb-6 sm:px-8">
                <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end">
                  <div className="size-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-[#e5e7eb] shadow sm:size-32">
                    {result.avatar ? <img src={result.avatar} alt={`Avatar de ${result.user.name}`} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-4xl">👤</div>}
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold sm:text-3xl">{result.user.displayName}{result.user.hasVerifiedBadge && <VerifiedBadge />}</h1>
                    <p className="mt-1 text-sm text-[#60656b]">@{result.user.name}</p>
                  </div>
                  <a href={`https://www.roblox.com/users/${result.user.id}/profile`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#335fff] px-5 text-sm font-bold text-white hover:bg-[#244bd6]">Voir sur Roblox ↗</a>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#e7e8ea] pt-5 sm:grid-cols-3">
                  <div><p className="text-xl font-extrabold">{result.friends?.toLocaleString('fr-CA') ?? '—'}</p><p className="text-sm text-[#60656b]">Amis</p></div>
                  <div><p className="text-xl font-extrabold">{result.followers?.toLocaleString('fr-CA') ?? '—'}</p><p className="text-sm text-[#60656b]">Abonnés</p></div>
                  <div><p className="text-xl font-extrabold">{result.user.isBanned ? 'Oui' : 'Non'}</p><p className="text-sm text-[#60656b]">Compte banni</p></div>
                </div>
              </div>
            </section>
            <section className="mt-5 rounded-xl bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-extrabold">À propos</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#454950]">{result.user.description?.trim() || 'Cet utilisateur n’a pas de description.'}</p>
              {result.user.created && <p className="mt-5 text-xs text-[#777d84]">Membre depuis le {new Date(result.user.created).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
            </section>
          </>
        )}
        <p className="mt-5 text-center text-xs text-[#858a91]">Profil public basé sur les informations Roblox disponibles. Ce site n’est pas affilié à Roblox.</p>
      </div>
    </main>
  )
}
