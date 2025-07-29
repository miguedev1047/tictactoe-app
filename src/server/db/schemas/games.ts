import * as s from 'drizzle-orm/sqlite-core'
import { user } from '@/server/db/schemas/auth'

export const games = s.sqliteTable('games', {
  id: s.text('id').primaryKey(),
  name: s.text('name').notNull(),
  ownerId: s
    .text('owner_id')
    .references(() => user.id, { onDelete: 'cascade' }),
  gameTurn: s.text('game_turn', { enum: ['X', 'O'] }),
  winner: s.text('winner', { enum: ['X', 'O', 'draw', 'none'] }),
  status: s
    .text('status', { enum: ['waiting', 'in_progress', 'finished'] })
    .notNull()
    .default('waiting'),
  createdAt: s
    .integer('created_at', { mode: 'timestamp' })
    .$default(() => new Date())
    .notNull(),
  updatedAt: s
    .integer('updated_at', { mode: 'timestamp' })
    .$default(() => new Date())
    .notNull(),
})

