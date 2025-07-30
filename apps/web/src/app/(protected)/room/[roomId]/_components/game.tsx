'use client'

import { api } from '@/trpc/react'
import { useParams } from 'next/navigation'
import { GameInfo } from '@/app/(protected)/room/[roomId]/_components/game-info'
import { Board } from '@/app/(protected)/room/[roomId]/_components/board'
import { CopyGameLink } from '@/components/copy-game-link'

export function Game() {
  const { roomId } = useParams<{ roomId: string }>()

  const [gameInfo] = api.games.gameByRoom.useSuspenseQuery({ roomId })

  if (!gameInfo) {
    return <h3>Loading...</h3>
  }

  if (gameInfo.status === 'waiting') {
    return (
      <div className='space-y-8'>
        <GameInfo />

        <div className='space-y-8'>
          <h2>Waiting the players...</h2>
          <CopyGameLink />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <GameInfo />
      <Board />
    </div>
  )
}
