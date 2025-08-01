import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { boards, gamePlayers, games, user } from '@/server/db/schema'
import {
  boardSchema,
  gameRoom,
  gameSchema,
  joinGameSchema,
  startGameSchema,
} from '@/server/zod'
import { TRPCError } from '@trpc/server'
import { and, asc, eq } from 'drizzle-orm'

const BOARD = Array.from({ length: 9 })

export const gamesRouter = createTRPCRouter({
  createRoom: protectedProcedure
    .input(gameSchema)
    .mutation(async ({ ctx, input }) => {
      const { gameTurn, id, name, ownerId, status, winner } = input
      const userId = ctx.session.user.id

      // First create game room
      await ctx.db.insert(games).values({
        id,
        name,
        gameTurn,
        ownerId,
        status,
        winner,
      })

      // Now create array of 9 positions and info neccesary and create board
      const BOARD_ARRAY = BOARD.map((_, i) => ({
        id: crypto.randomUUID(),
        gameId: id,
        position: i,
        symbol: 'EMPTY' as 'X' | 'O' | 'EMPTY',
        createdAt: new Date(),
      }))

      await ctx.db.insert(boards).values(BOARD_ARRAY)

      // Update symbol the player
      await ctx.db.update(user).set({ symbol: 'X' }).where(eq(user.id, userId))

      // Now add player info and create players table
      const player = {
        id: crypto.randomUUID(),
        playerNumber: 0,
        symbol: 'X' as 'X' | 'O',
        gameId: id,
        isOwner: true,
        isPlayerTurn: true,
        userId,
      }

      await ctx.db.insert(gamePlayers).values(player)
    }),

  gameByRoom: protectedProcedure
    .input(gameRoom)
    .query(async ({ ctx, input }) => {
      const { roomId } = input

      const findRoom = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, roomId),
        with: {
          boards: true,
          gamePlayers: { orderBy: asc(gamePlayers.joinedAt) },
          owner: true,
        },
      })

      if (!findRoom) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room not found!',
        })
      }

      return findRoom
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

      const findGame = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
      })

      if (findGame) {
        await ctx.db.update(games).set({ status }).where(eq(games.id, gameId))
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

      if (!gameId) throw new Error('Missing game id!')

      const findGame = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
      })

      const alreadyJoined = await ctx.db.query.gamePlayers.findFirst({
        where: and(
          eq(gamePlayers.gameId, gameId),
          eq(gamePlayers.userId, ctx.session.user.id)
        ),
      })

      if (findGame?.ownerId === ctx.session.user.id) {
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

      if (findGame) {
        await ctx.db.insert(gamePlayers).values({
          id,
          playerNumber,
          symbol,
          gameId,
          isOwner,
          isPlayerTurn,
          userId,
        })
      }
    }),

  updateBoard: protectedProcedure
    .input(boardSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, gameTurn, gameId, symbol } = input

      if (!gameId) throw new Error('Missing game id!')

      const findSquare = await ctx.db.query.boards.findFirst({
        where: (board, { eq }) => eq(board.id, id),
      })

      const findGame = await ctx.db.query.games.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
      })

      if (findGame) {
        await ctx.db.update(games).set({ gameTurn }).where(eq(games.id, gameId))

        if (findSquare) {
          await ctx.db.update(boards).set({ symbol }).where(eq(boards.id, id))
        }
      }
    }),
})
