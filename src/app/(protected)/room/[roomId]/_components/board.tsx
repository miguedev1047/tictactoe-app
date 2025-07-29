'use client'

import { Box } from '@/components/ui/8bit/box'
import { toast } from '@/components/ui/8bit/toast'
import { api } from '@/trpc/react'
import { useParams } from 'next/navigation'

export function Board() {
  const { roomId } = useParams<{ roomId: string }>()
  const [gameInfo] = api.games.gameByRoom.useSuspenseQuery({ roomId })

  const gameBoard = gameInfo?.boards ?? []

  if (!gameInfo) {
    return <div>Loading...</div>
  }

  return (
    <Box className='w-[480px] md:w-[640px] p-8 grid grid-cols-3 gap-y-8 gap-x-10'>
      {gameBoard.map((item, index) => (
        <Square
          index={index}
          key={item.id}
          {...item}
        />
      ))}
    </Box>
  )
}

type SquareProps = {
  symbol: 'X' | 'O' | 'EMPTY' | null
  id: string
  createdAt: Date | null
  gameId: string | null
  position: number
  index: number
}

function Square(props: SquareProps) {
  const { symbol, createdAt, gameId, id } = props
  const { roomId } = useParams<{ roomId: string }>()
  const [gameInfo] = api.games.gameByRoom.useSuspenseQuery({ roomId })

  const gameTurn = gameInfo?.gameTurn

  const playerSymbolX = gameInfo?.gamePlayers[0]?.symbol
  const playerSymbolY = gameInfo?.gamePlayers[1]?.symbol

  const utils = api.useUtils()

  const mutation = api.games.updateBoard.useMutation({
    onSettled: async () => {
      await utils.games.gameByRoom.invalidate({ roomId })
    },
    onError: () => {
      toast('An ocurred a error!')
    },
  })

  const handleChangeSymbol = async () => {
    switch (gameTurn) {
      case 'X':
        if (playerSymbolX !== gameTurn) return

        mutation.mutate({
          id,
          createdAt,
          gameId,
          symbol: 'X',
          gameTurn: 'O',
        })

        console.log('Clicked!')
        return
      case 'O':
        if (playerSymbolY !== gameTurn) return

        mutation.mutate({
          id,
          createdAt,
          gameId,
          symbol: 'O',
          gameTurn: 'X',
        })

        console.log('Clicked!')
        return
    }
  }

  return (
    <Box
      className='aspect-square '
      onClick={handleChangeSymbol}
    >
      <div className='size-full grid place-items-center'>
        <span className='text-7xl'>{symbol !== 'EMPTY' && symbol}</span>
      </div>
    </Box>
  )
}
