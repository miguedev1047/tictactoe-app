import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from '@/server/api/trpc'
import { gamesRouter } from '@/server/api/routers/game'
import { sessionRouter } from '@/server/api/routers/session'
import { realtime } from '@/server/api/routers/realtime'

export const appRouter = createTRPCRouter({
  ok: publicProcedure.query(() => {
    return { ok: true }
  }),
  games: gamesRouter,
  session: sessionRouter,
  realtime: realtime,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
