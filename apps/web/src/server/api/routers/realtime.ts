import {
  boardSchema,
  finishGameSchema,
  gameRoom,
  joinGameSchema,
  startGameSchema,
} from '@/server/zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { boards, gamePlayers, games, user } from '@/server/db/schema'
import { TRPCError } from '@trpc/server'
import { and, asc, eq } from 'drizzle-orm'
import EventEmitter, { on } from 'node:events'

const ee = new EventEmitter()

export const realtime = createTRPCRouter({
  gameByRoom: protectedProcedure.input(gameRoom).subscription(async function* ({
    ctx,
    input,
  }) {
    const { roomId } = input
    const findRoom = await ctx.db.query.games.findFirst({
      where: (game, { eq }) => eq(game.id, roomId),
      with: {
        gamePlayers: {
          with: { player: true },
          orderBy: asc(gamePlayers.joinedAt),
        },
        boards: true,
      },
    })

    if (!findRoom) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room not found!',
      })
    }

    yield {
      type: 'game-update',
      data: findRoom,
    }

    const eventName = `game-update-${roomId}`

    try {
      for await (const [data] of on(ee, eventName)) {
        yield {
          type: 'game-update',
          data: data as typeof findRoom,
        }
      }
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Subscription failed',
      })
    }
  }),

  startGame: protectedProcedure
    .input(startGameSchema)
    .mutation(async ({ ctx, input }) => {
      const { status, gameId } = input

      if (!gameId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing game id!',
        })
      }

      const findRoom = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
      })

      if (findRoom) {
        await ctx.db.update(games).set({ status }).where(eq(games.id, gameId))

        const updatedRoom = await ctx.db.query.games.findFirst({
          where: (game, { eq }) => eq(game.id, gameId),
          with: {
            gamePlayers: { with: { player: true } },
            boards: true,
          },
        })

        if (updatedRoom) {
          ee.emit(`game-update-${gameId}`, updatedRoom)
        }
      }
    }),

  joinGame: protectedProcedure
    .input(joinGameSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        gameId,
        id,
        isOwner,
        isPlayerTurn,
        playerNumber,
        symbol,
        userId,
      } = input

      if (!gameId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing game id!',
        })
      }

      const findRoom = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
      })

      const alreadyJoined = await ctx.db.query.gamePlayers.findFirst({
        where: and(
          eq(gamePlayers.gameId, gameId),
          eq(gamePlayers.userId, ctx.session.user.id)
        ),
      })

      const isOwnerRoom = findRoom?.ownerId === ctx.session.user.id

      if (isOwnerRoom) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot join your own game!',
        })
      }

      if (alreadyJoined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You already joined this game!',
        })
      }

      // Update symbol the player
      await ctx.db.update(user).set({ symbol: 'O' }).where(eq(user.id, userId))

      if (findRoom) {
        await ctx.db.insert(gamePlayers).values({
          id,
          playerNumber,
          symbol,
          gameId,
          isOwner,
          isPlayerTurn,
          userId,
        })

        const updatedRoom = await ctx.db.query.games.findFirst({
          where: (game, { eq }) => eq(game.id, gameId),
          with: {
            gamePlayers: { with: { player: true } },
            boards: true,
          },
        })

        if (updatedRoom) {
          ee.emit(`game-update-${gameId}`, updatedRoom)
        }
      }
    }),

  updateBoard: protectedProcedure
    .input(boardSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, gameTurn, gameId, symbol } = input

      if (!gameId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing game id!',
        })
      }

      const findRoom = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
      })

      if (findRoom) {
        await ctx.db.update(games).set({ gameTurn }).where(eq(games.id, gameId))

        const findSquare = await ctx.db.query.boards.findFirst({
          where: (board, { eq }) => eq(board.id, id),
        })

        if (findSquare) {
          await ctx.db.update(boards).set({ symbol }).where(eq(boards.id, id))
        }

        const updatedRoom = await ctx.db.query.games.findFirst({
          where: (game, { eq }) => eq(game.id, gameId),
          with: {
            gamePlayers: { with: { player: true } },
            boards: true,
          },
        })

        if (updatedRoom) {
          ee.emit(`game-update-${gameId}`, updatedRoom)
        }
      }
    }),

  finishGame: protectedProcedure
    .input(finishGameSchema)
    .mutation(async ({ ctx, input }) => {
      const { gameId, winner, status } = input

      const findRoom = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
      })

      if (findRoom) {
        await ctx.db
          .update(games)
          .set({ winner, status })
          .where(eq(games.id, gameId))

        const updatedRoom = await ctx.db.query.games.findFirst({
          where: (game, { eq }) => eq(game.id, gameId),
          with: {
            gamePlayers: { with: { player: true } },
            boards: true,
          },
        })

        if (updatedRoom) {
          ee.emit(`game-update-${gameId}`, updatedRoom)
        }
      }
    }),

  deleteGame: protectedProcedure
    .input(gameRoom)
    .mutation(async ({ ctx, input }) => {
      const { roomId } = input

      const findRoom = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, roomId),
      })

      const isOwnerRoom = findRoom?.ownerId === ctx.session.user.id

      if (!isOwnerRoom) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You dont have permission to delete this game!',
        })
      }

      if (!findRoom) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room not found!',
        })
      }

      await ctx.db.delete(games).where(eq(games.id, roomId))
    }),
})
