import * as s from 'drizzle-orm/sqlite-core'
import { games } from '@/server/db/schemas/games'

export const boards = s.sqliteTable('boards', {
  id: s.text('id').primaryKey(),
  gameId: s.text('game_id').references(() => games.id, { onDelete: 'cascade' }),
  symbol: s.text('symbol', { enum: ['X', 'O', 'EMPTY'] }),
  position: s.integer('position', { mode: 'number' }).notNull(),
  createdAt: s
    .integer('created_at', { mode: 'timestamp' })
    .$default(() => new Date()),
})

