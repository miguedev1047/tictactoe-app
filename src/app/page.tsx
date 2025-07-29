import { SigninButton } from '@/components/signin-button'
import { HydrateClient } from '@/trpc/server'

export default function Home() {
  return (
    <HydrateClient>
      <main className='p-8 space-y-4'>
        <h2>Home</h2>

        <div className='inline-flex flex-col space-y-8'>
          <SigninButton provider='discord'>Sign in with Discord</SigninButton>
          <SigninButton provider='google'>Sign in with Google</SigninButton>
          <SigninButton provider='github'>Sign in with Github</SigninButton>
        </div>
      </main>
    </HydrateClient>
  )
}
