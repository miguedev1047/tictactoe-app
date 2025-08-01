import {
  boardRelations,
  gamePlayerRelations,
  gameRelations,
  userRelations,
} from '@/server/db/schemas/_relations'

import { user, account, session, verification } from '@/server/db/schemas/auth'
import { boards } from '@/server/db/schemas/boards'
import { games } from '@/server/db/schemas/games'
import { gamePlayers } from '@/server/db/schemas/game-players'

export {
  user,
  account,
  session,
  verification,
  boards,
  games,
  gamePlayers,
  boardRelations,
  gamePlayerRelations,
  gameRelations,
  userRelations
}
