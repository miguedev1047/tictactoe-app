import { api, HydrateClient } from '@/trpc/server'
import { ProfileCard } from '@/components/profile-card'
import { GameRealtime } from './_components/game-realtime'
import { RoomProvider } from '@/providers/room-provider'

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params
  void api.session.currentUser.prefetch()

  return (
    <HydrateClient>
      <div className='p-8 space-y-16 inline-flex flex-col'>
        <RoomProvider roomId={roomId}>
          <ProfileCard />
          <GameRealtime />
        </RoomProvider>
      </div>
    </HydrateClient>
  )
}
