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

export const startGameSchema = z.object({
  gameId: z.string().nullable(),
  status: z.enum(['waiting', 'in_progress', 'finished']),
})

export const finishGameSchema = z.object({
  gameId: z.string(),
  winner: z.enum(['X', 'O', 'draw']),
  status: z.enum(['finished']),
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
