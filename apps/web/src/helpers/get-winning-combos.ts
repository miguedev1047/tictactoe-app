import { WINNER_COMBOS } from '@/constants/game'
import type { Board, Winner } from '@/server/types'

export function getWinningCombos(board: Board[] | undefined) {
  if (!board) return null

  for (const [a = 0, b = 0, c = 0] of WINNER_COMBOS) {
    if (
      board[a]?.symbol !== 'EMPTY' &&
      board[a]?.symbol === board[b]?.symbol &&
      board[a]?.symbol === board[c]?.symbol
    ) {
      return board[a]?.symbol as Winner
    }
  }

  return null
}
