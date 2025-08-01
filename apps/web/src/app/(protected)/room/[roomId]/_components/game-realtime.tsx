'use client'

import { Button } from '@/components/ui/8bit/button'
import { useGame } from '@/providers/room-provider'
import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import { GameInfoRealtime } from './game-info-realtime'
import { BoardRealtime } from './board-realtime'
import { CopyGameLink } from '@/components/copy-game-link'
import { StartGameButton } from './start-game-button'
import { WinnerStatusCard } from './winner-card'
import { DeleteGameButton } from './delete-game-button'

const MAX_PLAYERS = 2

export function GameRealtime() {
  const router = useRouter()
  const { room, status } = useGame()

  if (status === 'error') {
    return (
      <div className='space-y-8'>
        <h2>I can find this game</h2>
        <Button onClick={() => router.push('/home')}>Back to home</Button>
      </div>
    )
  }

  if (status === 'connecting' || !room) {
    return (
      <div>
        <h2>Connecting the room...</h2>
      </div>
    )
  }

  return <GameContent />
}

function GameContent() {
  const { room } = useGame()
  const [currentUser] = api.session.currentUser.useSuspenseQuery()

  if (!room) return null

  const isWaiting = room.status === 'waiting'
  const isPlaying = room.status === 'in_progress'
  const isFinished = room.status === 'finished'
  const isOwnerRoom = currentUser.id === room.ownerId
  const maxPlayers = room.gamePlayers.length === MAX_PLAYERS

  const canStartGame = isWaiting && isOwnerRoom && maxPlayers
  const isOwnerWaiting = isWaiting && isOwnerRoom
  const isNotOwnerWaiting = isWaiting && !isOwnerRoom

  if (canStartGame) {
    return (
      <div className='space-y-8'>
        <GameInfoRealtime />

        <div className='space-y-8'>
          <h2 className='text-xl'>All rigth!</h2>

          <div className='space-y-6'>
            <p>Can start the game</p>
            <StartGameButton />
          </div>
        </div>
      </div>
    )
  }

  if (isOwnerWaiting) {
    return (
      <div className='space-y-8'>
        <GameInfoRealtime />

        <div className='space-y-8'>
          <h2 className='text-xl'>Waiting second player...</h2>

          <div className='space-y-6'>
            <p>Invite other players with this link:</p>

            <div className='inline-flex flex-col gap-8'>
              <CopyGameLink />
              <DeleteGameButton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isNotOwnerWaiting) {
    return (
      <div className='space-y-8'>
        <GameInfoRealtime />
        <h2>Waiting the owner to start the game...</h2>
      </div>
    )
  }

  if (isPlaying) {
    return (
      <div className='space-y-8'>
        <GameInfoRealtime />
        <BoardRealtime />
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className='space-y-8'>
        <h2>Game finished</h2>
        <GameInfoRealtime />
        <WinnerStatusCard />
        <BoardRealtime />
        <DeleteGameButton />
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <h2>There anything here</h2>
    </div>
  )
}
