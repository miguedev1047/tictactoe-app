'use client'

import { api } from '@/trpc/react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/8bit/badge'

export function GameInfo() {
  const { roomId } = useParams<{ roomId: string }>()
  const [gameInfo] = api.games.gameByRoom.useSuspenseQuery({ roomId })

  const players = gameInfo?.gamePlayers.length


  return (
    <div className='space-y-8'>
      <h2>Game state:</h2>

      <div className='flex flex-wrap items-center gap-x-8 gap-y-4'>
        <Badge>Status: {gameInfo?.status}</Badge>
        <Badge>Winner: {gameInfo?.winner}</Badge>
        <Badge>Owner: {gameInfo?.owner?.name}</Badge>
        <Badge>Turn: {gameInfo?.gameTurn}</Badge>
        <Badge>Players: {players}</Badge>
      </div>

      {/* <pre>
        <code>
          {JSON.stringify(gameInfo, null, 2)}
        </code>
      </pre> */}
    </div>
  )
}
