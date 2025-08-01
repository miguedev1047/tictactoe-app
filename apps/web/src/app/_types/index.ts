export type SquareProps = {
  symbol: 'X' | 'O' | 'EMPTY' | null
  id: string
  createdAt: Date | null
  gameId: string | null
  position: number
  index: number
}