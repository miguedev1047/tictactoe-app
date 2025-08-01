import { toast } from '@/components/ui/8bit/toast'
import { Button } from '@/components/ui/8bit/button'
import { useGame } from '@/providers/room-provider'
import { api } from '@/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function DeleteGameButton() {
  const router = useRouter()

  const { room } = useGame()
  const { roomId } = useParams<{ roomId: string }>()
  const [isPending, startTransition] = useTransition()
  const [currentUser] = api.session.currentUser.useSuspenseQuery()

  const isOwnerRoom = currentUser.id === room?.ownerId

  const mutation = api.realtime.deleteGame.useMutation({
    onSuccess: () => {
      toast('Deleting game...')
      router.push('/home')
    },
    onError: () => {
      toast('An ocurred a error')
    },
  })

  const handleDeleteGame = () => {
    startTransition(() => {
      if (isOwnerRoom) {
        mutation.mutate({
          roomId,
        })
      } else {
        router.push('/home')
      }
    })
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleDeleteGame}
      variant='destructive'
    >
      {isOwnerRoom ? 'Delete Game' : 'Leave Game'}
    </Button>
  )
}
