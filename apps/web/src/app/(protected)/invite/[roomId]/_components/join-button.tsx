'use client'

import { Badge } from '@/components/ui/8bit/badge'
import { Button } from '@/components/ui/8bit/button'
import { toast } from '@/components/ui/8bit/toast'
import { useGame } from '@/providers/room-provider'
import { api } from '@/trpc/react'
import { useParams, useRouter } from 'next/navigation'

export function JoinButton() {
  const router = useRouter()

  const { roomId } = useParams<{ roomId: string }>()
  const [currentUser] = api.session.currentUser.useSuspenseQuery()
  const { room, status } = useGame()

  const playerTwoId = room?.gamePlayers[1]?.userId

  const gameOwnerId = room?.ownerId
  const invitedUserId = currentUser.id

  const isSameOwnId = invitedUserId === gameOwnerId
  const isSameInvitedId = playerTwoId === gameOwnerId

  const mutation = api.realtime.joinGame.useMutation({
    onSuccess: () => {
      toast('Game joined!')
      return router.push(`/room/${roomId}`)
    },
    onError: ({ message }) => {
      toast(message)
    },
  })

  const handleJoin = async () => {
    if (isSameOwnId) {
      toast('Cannot join your own game!')
      return
    }

    if (isSameInvitedId) {
      toast('You already joined this game!')
      return
    }

    mutation.mutate({
      gameId: roomId,
      id: crypto.randomUUID(),
      isOwner: false,
      isPlayerTurn: false,
      playerNumber: 1,
      symbol: 'O',
      userId: currentUser.id,
    })
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center gap-x-6 gap-y-4'>
        <Badge>Status: {room?.status}</Badge>
      </div>

      <Button
        onClick={handleJoin}
        disabled={isSameOwnId || isSameInvitedId || status === 'connecting'}
      >
        {status === 'connecting' ? 'Connecting...' : 'Join Game'}
      </Button>
    </div>
  )
}
