import * as s from 'drizzle-orm/sqlite-core'
import { user } from '@/server/db/schemas/auth'
import { games } from '@/server/db/schemas/games'

export const gamePlayers = s.sqliteTable(
  'game_players',
  {
    id: s.text('id').primaryKey(),
    gameId: s
      .text('game_id')
      .references(() => games.id, { onDelete: 'cascade' }),
    userId: s.text('user_id').references(() => user.id),
    playerNumber: s.integer('player_number').notNull(), // 0 o 1
    isOwner: s.integer('is_owner', { mode: 'boolean' }).default(false),
    isPlayerTurn: s
      .integer('is_player_turn', { mode: 'boolean' })
      .default(false),
    symbol: s.text('symbol', { enum: ['X', 'O'] }).notNull(),
    joinedAt: s
      .integer('joined_at', { mode: 'timestamp' })
      .$default(() => new Date()),
  },
  (table) => [
    s.uniqueIndex('unique_game_player').on(table.gameId, table.userId),
    s.uniqueIndex('unique_game_symbol').on(table.gameId, table.symbol),
  ]
)
