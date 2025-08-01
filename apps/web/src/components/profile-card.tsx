'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/8bit/avatar'
import { api } from '@/trpc/react'
import { cn } from '@/lib/utils'
import { Alert, AlertTitle } from '@/components/ui/8bit/alert'
import { useEffect, useState } from 'react'

export function ProfileCard({ className }: React.ComponentProps<typeof Alert>) {
  const [render, setRender] = useState(false)
  
  useEffect(() => setRender(true), [])

  const [currentUser] = api.session.currentUser.useSuspenseQuery()

  if (!render) return null

  return (
    <Alert className={cn(className, 'flex gap-5 items-center')}>
      <Avatar
        variant='retro'
        className='size-20'
      >
        <AvatarImage
          src={currentUser?.image ?? ''}
          alt={currentUser?.name}
        />
        <AvatarFallback>
          {currentUser?.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-2'>
        <AlertTitle>{currentUser?.name}</AlertTitle>
      </div>
    </Alert>
  )
}
