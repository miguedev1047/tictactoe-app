'use client'

import type { SquareProps } from '@/app/_types'

import { Box } from '@/components/ui/8bit/box'
import { toast } from '@/components/ui/8bit/toast'
import { api } from '@/trpc/react'
import { useGame } from '@/providers/room-provider'
import { checkWinnerWithBoard } from '@/helpers/check-winner'
import { useParams } from 'next/navigation'
import { getLatestBoard } from '@/helpers/get-latest-board'
import type { BoardSymbol } from '@/server/types'

export function BoardRealtime() {
  const { room } = useGame()
  const gameBoard = room?.boards ?? []

  const [currentUser] = api.session.currentUser.useSuspenseQuery()
  const isYourTurn = currentUser.symbol === room?.gameTurn
  const isDraw = room?.winner === 'draw'

  return (
    <div className='space-y-8'>
      {!isDraw && (
        <div>
          <p>{isYourTurn ? 'Its your turn!' : 'Wait your turn!'}</p>
        </div>
      )}

      <Box className='w-[480px] md:w-[640px] p-8 grid grid-cols-3 gap-y-8 gap-x-10'>
        {gameBoard.map((item, index) => (
          <SquareRealtime
            index={index}
            key={item.id}
            {...item}
          />
        ))}
      </Box>
    </div>
  )
}

function SquareRealtime(props: SquareProps) {
  const { roomId } = useParams<{ roomId: string }>()
  const { symbol, createdAt, gameId, id } = props

  const [currentUser] = api.session.currentUser.useSuspenseQuery()
  const { room } = useGame()

  const gameTurn = room?.gameTurn
  const gameWinnerStatus = room?.winner
  const currentPlayerSymbol = currentUser.symbol
  const isYourTurn = currentPlayerSymbol === gameTurn
  const SYMBOL = symbol !== 'EMPTY' && symbol

  const finishGameMutation = api.realtime.finishGame.useMutation({
    onError: () => {
      toast('An ocurred a error while finish the game!')
    },
  })

  const updateBoardMutation = api.realtime.updateBoard.useMutation({
    onSettled: async () => {
      const latestBoard = await getLatestBoard(roomId)

      if (!latestBoard) return

      const winnerStatus = checkWinnerWithBoard(latestBoard)

      if (winnerStatus) {
        switch (winnerStatus) {
          case 'X':
            finishGameMutation.mutate({
              gameId: roomId,
              status: 'finished',
              winner: 'X',
            })
            return
          case 'O':
            finishGameMutation.mutate({
              gameId: roomId,
              status: 'finished',
              winner: 'O',
            })
            return
          case 'draw':
            finishGameMutation.mutate({
              gameId: roomId,
              status: 'finished',
              winner: 'draw',
            })
            return
        }
      }
    },
    onError: () => {
      toast('An ocurred a error!')
    },
  })

  const handleChangeSymbol = async () => {
    if (!isYourTurn) return

    if (gameWinnerStatus !== 'none') return
    const nextTurn = gameTurn === 'X' ? 'O' : 'X'

    updateBoardMutation.mutate({
      id,
      createdAt,
      gameId,
      symbol: gameTurn as BoardSymbol,
      gameTurn: nextTurn,
    })
  }

  return (
    <Box
      className='aspect-square '
      onClick={handleChangeSymbol}
    >
      <div className='size-full grid place-items-center'>
        <span className='text-7xl'>{SYMBOL}</span>
      </div>
    </Box>
  )
}
