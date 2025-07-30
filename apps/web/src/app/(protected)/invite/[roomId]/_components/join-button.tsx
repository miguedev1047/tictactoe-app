'use client'

import { Badge } from '@/components/ui/8bit/badge'
import { Button } from '@/components/ui/8bit/button'
import { toast } from '@/components/ui/8bit/toast'
import { api } from '@/trpc/react'
import { useParams, useRouter } from 'next/navigation'

export function JoinButton() {
  const router = useRouter()

  const { roomId } = useParams<{ roomId: string }>()
  const [currentUser] = api.session.currentUser.useSuspenseQuery()
  const [gameInfo] = api.games.gameByRoom.useSuspenseQuery({ roomId })

  const playerTwoId = gameInfo?.gamePlayers[1]?.userId

  const gameOwnerId = gameInfo?.owner?.id
  const invitedUserId = currentUser.id

  const isSameOwnId = invitedUserId === gameOwnerId
  const isSameInvitedId = playerTwoId === gameOwnerId

  const utils = api.useUtils()
  const mutation = api.games.joinGame.useMutation({
    onSettled: async () => {
      await utils.games.gameByRoom.invalidate({ roomId })
    },
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
        <Badge>Status: {gameInfo?.status}</Badge>
        <Badge>Owner: {gameInfo?.owner?.name}</Badge>
      </div>

      <Button
        onClick={handleJoin}
        disabled={isSameOwnId || isSameInvitedId}
      >
        Join Game
      </Button>
    </div>
  )
}
