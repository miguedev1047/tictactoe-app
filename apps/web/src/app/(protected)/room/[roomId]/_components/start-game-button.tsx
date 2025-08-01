import { Button } from '@/components/ui/8bit/button'
import { toast } from '@/components/ui/8bit/toast'
import { api } from '@/trpc/react'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'

export function StartGameButton() {
  const [isPending, startTransition] = useTransition()
  const { roomId } = useParams<{ roomId: string }>()

  const mutation = api.realtime.startGame.useMutation({
    onError: () => {
      toast('Something went wrong join the game!')
    },
    onMutate: () => {
      toast('Starting the game...')
    },
  })

  const handleStartGame = () => {
    startTransition(() => {
      mutation.mutate({
        gameId: roomId,
        status: 'in_progress',
      })
    })
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleStartGame}
    >
      Start game
    </Button>
  )
}
