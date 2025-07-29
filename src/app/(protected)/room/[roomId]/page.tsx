import { api, HydrateClient } from '@/trpc/server'
import { Game } from './_components/game'

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params
  void api.games.gameByRoom.prefetch({ roomId })

  return (
    <HydrateClient>
      <div className='p-8 space-y-8'>
        <Game/>
      </div>
    </HydrateClient>
  )
}
