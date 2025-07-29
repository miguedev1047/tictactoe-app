'use client'

import { Button } from '@/components/ui/8bit/button'
import { toast } from '@/components/ui/8bit/toast'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'

export function NewGame() {
  const [currentUser] = api.session.currentUser.useSuspenseQuery()
  const router = useRouter()
  const utils = api.useUtils()

  const mutation = api.games.createRoom.useMutation({
    onSettled: async () => {
      await utils.games.invalidate()
    },
    onMutate: async () => {
      toast('Creating game...')
    },
    onError: () => {
      toast('An error ocurred')
    },
  })

  const handleNewGame = async () => {
    const roomId = crypto.randomUUID()
    
    if (!currentUser) return

    mutation.mutate({
      gameTurn: 'X',
      id: roomId,
      name: `triki-room-${roomId}`,
      ownerId: currentUser.id,
      status: 'waiting',
      winner: 'none',
    })

    router.push(`/room/${roomId}`)
  }

  return (
    <Button
      onClick={handleNewGame || !currentUser}
      variant='outline'
    >
      New Game
    </Button>
  )
}
