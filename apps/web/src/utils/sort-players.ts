import type { playerWithUser } from '@/server/types'

export function sortPlayersByCreation(
  players: playerWithUser[]
): playerWithUser[] {
  return [...players].sort(
    (a, b) =>
      new Date(a.joinedAt ?? 0).getTime() - new Date(b.joinedAt ?? 0).getTime()
  )
}
