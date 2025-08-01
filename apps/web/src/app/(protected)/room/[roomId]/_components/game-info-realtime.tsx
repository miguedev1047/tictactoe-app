import { Badge } from '@/components/ui/8bit/badge'
import { useGame } from '@/providers/room-provider'
import { api } from '@/trpc/react'

export function GameInfoRealtime() {
  const { room } = useGame()
  const [currentUser] = api.session.currentUser.useSuspenseQuery()

  const players = room?.gamePlayers.length
  const gameTurn = room?.gameTurn
  const gameStatus = room?.status
  const winnerStatus = room?.winner
  const playerSymbol = currentUser.symbol

  return (
    <div className='space-y-12'>
      <div className='flex flex-wrap items-center gap-x-8 gap-y-4'>
        <Badge>Your symbol: {playerSymbol}</Badge>
        <Badge>Game turn: {gameTurn}</Badge>
        <Badge>Status: {gameStatus}</Badge>
        <Badge>Winner: {winnerStatus}</Badge>
        <Badge>Players: {players}</Badge>
      </div>
    </div>
  )
}
