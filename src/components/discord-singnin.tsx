'use client'

import { Button } from '@/components/ui/8bit/button'
import { toast } from '@/components/ui/8bit/toast'
import { useTransition } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function DiscordSignin() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSignIn = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: 'discord',
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
    >
      Sign in with discord
    </Button>
  )
}
