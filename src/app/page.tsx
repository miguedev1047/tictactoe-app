import { DiscordSignin } from '@/components/discord-singnin'
import { HydrateClient } from '@/trpc/server'

export default function Home() {
  return (
    <HydrateClient>
      <main className='p-8 space-y-4'>
        <h2>Home</h2>
        <DiscordSignin />
      </main>
    </HydrateClient>
  )
}
