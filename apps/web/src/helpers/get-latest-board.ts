'use server'

import { db } from '@/server/db'

export async function getLatestBoard(roomId: string) {
  const findRoom = await db.query.games.findFirst({
    where: (game, { eq }) => eq(game.id, roomId),
    with: {
      boards: true,
    },
  })
  return findRoom?.boards ?? []
}
