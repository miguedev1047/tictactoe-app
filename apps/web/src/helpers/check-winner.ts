import { WINNER_COMBOS } from '@/constants/game'
import type { Board, Winner } from '@/server/types'

export function checkWinnerWithBoard(board: Board[] | undefined) {
  if (!board) return 'none' as Winner

  for (const line of WINNER_COMBOS) {
    const [a = 0, b = 0, c = 0] = line
    if (
      board[a]?.symbol !== 'EMPTY' &&
      board[a]?.symbol === board[b]?.symbol &&
      board[a]?.symbol === board[c]?.symbol
    ) {
      return board[a]?.symbol as Winner
    }
  }

  if (board.every((cell) => cell.symbol !== 'EMPTY')) {
    return 'draw'
  }

  return 'none' as Winner
}
