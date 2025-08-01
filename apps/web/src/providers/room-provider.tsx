'use client'

import { toast } from '@/components/ui/8bit/toast'
import type { ConnectionStatus, RoomWithFullRelations } from '@/server/types'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { createContext, use } from 'react'

export type GameWithRelations = {
  room: RoomWithFullRelations | undefined
  status: ConnectionStatus
}

const GameContext = createContext<GameWithRelations | null>(null)

export function RoomProvider({
  roomId,
  children,
}: {
  roomId: string
  children: React.ReactNode
}) {
  const router = useRouter()

  const { data, status } = api.realtime.gameByRoom.useSubscription(
    { roomId },
    {
      onData(ctx) {
        const winnerStatus = ctx.data.winner
        switch (winnerStatus) {
          case 'X':
            toast('X is the winner!')
            break
          case 'O':
            toast('O is the winner!')
            break
          case 'draw':
            toast('Draw!')
            break
        }
      },
      onError() {
        router.push('/home')
      },
    }
  )
  const room = data?.data as RoomWithFullRelations | undefined

  return (
    <GameContext.Provider value={{ room, status }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = use(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
