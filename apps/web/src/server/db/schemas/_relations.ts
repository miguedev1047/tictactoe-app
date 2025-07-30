import { relations } from 'drizzle-orm'

import { games } from '@/server/db/schemas/games'
import { user } from '@/server/db/schemas/auth'
import { boards } from '@/server/db/schemas/boards'
import { gamePlayers } from '@/server/db/schemas/game-players'

export const gameRelations = relations(games, ({ one, many }) => ({
  owner: one(user, {
    fields: [games.ownerId],
    references: [user.id],
  }),
  boards: many(boards),
  gamePlayers: many(gamePlayers),
}))

export const boardRelations = relations(boards, ({ one }) => ({
  game: one(games, {
    fields: [boards.gameId],
    references: [games.id],
  }),
}))

export const gamePlayerRelations = relations(gamePlayers, ({ one }) => ({
  game: one(games, {
    fields: [gamePlayers.gameId],
    references: [games.id],
  }),
  player: one(user, {
    fields: [gamePlayers.userId],
    references: [user.id],
  }),
}))
