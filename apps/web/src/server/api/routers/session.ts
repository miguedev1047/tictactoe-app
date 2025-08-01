import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const sessionRouter = createTRPCRouter({
  currentSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  currentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user
  }),
})
