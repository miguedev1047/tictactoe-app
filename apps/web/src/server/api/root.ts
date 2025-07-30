import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from '@/server/api/trpc'
import { gamesRouter } from '@/server/api/routers/game'
import { sessionRouter } from '@/server/api/routers/session'

export const appRouter = createTRPCRouter({
  ok: publicProcedure.query(() => {
    return { ok: true }
  }),
  games: gamesRouter,
  session: sessionRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
