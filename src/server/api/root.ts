import { createCallerFactory, createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const appRouter = createTRPCRouter({
  ok: publicProcedure.query(() => {
    return { ok: true }
  }),
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
