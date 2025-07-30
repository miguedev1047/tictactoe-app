import z from 'zod'

export const gameSchema = z.object({
  id: z.string(),
  name: z.string(),
  gameTurn: z.enum(['X', 'O']),
  ownerId: z.string(),
  status: z.enum(['waiting', 'in_progress', 'finished']),
  winner: z.enum(['X', 'O', 'draw', 'none']),
})

export const boardSchema = z.object({
  id: z.string(),
  gameId: z.string().nullable(),
  symbol: z.enum(['X', 'O', 'EMPTY']),
  createdAt: z.date().nullable(),
  gameTurn: z.enum(['X', 'O']),
})

export const joinGameSchema = z.object({
  id: z.string(),
  gameId: z.string().nullable(),
  playerNumber: z.number(),
  symbol: z.enum(['X', 'O']),
  isOwner: z.boolean(),
  isPlayerTurn: z.boolean(),
  userId: z.string(),
})

export const gameRoom = z.object({
  roomId: z.string(),
})


