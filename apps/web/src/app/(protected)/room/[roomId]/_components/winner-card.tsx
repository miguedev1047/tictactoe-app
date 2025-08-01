import { useMemo } from 'react'
import { useGame } from '@/providers/room-provider'
import { sortPlayersByCreation } from '@/utils/sort-players'

export function WinnerStatusCard() {
  const { room } = useGame()
  const winner = room?.winner
  const players = room?.gamePlayers

  const winnerName = useMemo(() => {
    if (!winner || !players?.length) return null
    if (winner === 'draw') return null

    const [playerX, playerO] = sortPlayersByCreation(players)

    return winner === 'X' ? playerX?.player.name : playerO?.player.name
  }, [winner, players])

  if (!winner) return null

  return (
    <div>
      {winner === 'draw' ? (
        <p>The match is a draw!</p>
      ) : (
        <p>The player {winnerName} is the winner!</p>
      )}
    </div>
  )
}
