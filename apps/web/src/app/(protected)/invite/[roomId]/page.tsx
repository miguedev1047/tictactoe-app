import { api, HydrateClient } from '@/trpc/server'
import { JoinButton } from '@/app/(protected)/invite/[roomId]/_components/join-button'
import { SigninButton } from '@/components/signin-button'
import { getServerCurrentSession } from '@/server/data/auth'
import { RoomProvider } from '@/providers/room-provider'

export default async function InviteRoonPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params
  const session = await getServerCurrentSession()

  if (!session)
    return (
      <div className='p-8 space-y-4'>
        <h2>If want to play need sign in</h2>

        <div className='inline-flex flex-col space-y-8'>
          <SigninButton provider='discord'>Sign in with Discord</SigninButton>
          <SigninButton provider='google'>Sign in with Google</SigninButton>
          <SigninButton provider='github'>Sign in with Github</SigninButton>
        </div>
      </div>
    )

  void api.session.currentUser.prefetch()
  void api.games.gameByRoom.prefetch({ roomId })

  return (
    <HydrateClient>
      <div className='p-8'>
        <RoomProvider roomId={roomId}>
          <JoinButton />
        </RoomProvider>
      </div>
    </HydrateClient>
  )
}
