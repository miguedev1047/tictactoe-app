import { SignOutButton } from '@/components/signout'
import { NewGame } from '@/app/(protected)/home/_components/new-game'
import { api, HydrateClient } from '@/trpc/server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  void api.session.currentUser.prefetch()

  return (
    <HydrateClient>
      <div className='p-8 space-y-8'>
        <div className='space-y-2'>
          <h2>Home Page</h2>
          <SignOutButton />
        </div>

        <NewGame />
      </div>
    </HydrateClient>
  )
}
