'use client'

import React, { useTransition } from 'react'
import { Button } from '@/components/ui/8bit/button'
import { toast } from '@/components/ui/8bit/toast'
import { authClient } from '@/lib/auth-client'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface Props extends React.ComponentProps<typeof Button> {
  provider: 'discord' | 'github' | 'google'
}

export function SigninButton({
  children,
  provider,
  className,
  ...props
}: Props) {
  const router = useRouter()
  const { roomId } = useParams<{ roomId: string }>()
  const [isPending, startTransition] = useTransition()

  const handleSignIn = () => {
    const callbackURL = roomId ? `/invite/${roomId}` : '/home'

    startTransition(async () => {
      await authClient.signIn.social({
        provider: provider,
        callbackURL,
        fetchOptions: {
          onSuccess: () => {
            toast('Sign in...')
            return router.refresh()
          },
          onError: (error) => {
            console.error(error)
            toast('An error occurred while signing in')
          },
        },
      })
    })
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleSignIn}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  )
}
