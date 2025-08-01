import type { InferSelectModel } from 'drizzle-orm'
import type { boards, gamePlayers, games, user } from '../db/schema'

// ============================================
// TIPOS BASE DE LAS TABLAS
// ============================================

// ============================================
export type Game = InferSelectModel<typeof games>
export type GamePlayer = InferSelectModel<typeof gamePlayers>
export type Board = InferSelectModel<typeof boards>
export type User = InferSelectModel<typeof user>

// ============================================
// ENUMS Y CONSTANTES
// ============================================
export type GameStatus = 'waiting' | 'in_progress' | 'finished'
export type BoardSymbol = 'X' | 'O' | 'EMPTY'
export type Winner = 'X' | 'O' | 'draw' | 'none'
export type ConnectionStatus = 'connecting' | 'error' | 'idle' | 'pending'

// ============================================
// TIPOS CON RELACIONES
// ============================================
export type playerWithUser = GamePlayer & {
  player: User
}

export type gamePlayersWithPlayers = Game & {
  gamePlayers: playerWithUser[]
}

export type RoomWithBoards = Game & {
  boards: Board[]
}

export type RoomWithFullRelations = Game & {
  gamePlayers: playerWithUser[]
  boards: Board[]
}
