import '@/styles/retro.css'
import '@/styles/globals.css'

import { type Metadata } from 'next'
import { Geist } from 'next/font/google'
import { TRPCReactProvider } from '@/trpc/react'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Tic Tac Toe Game',
  description: 'This a simple tictactoe multiplayer game',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang='en'
      className={`${geist.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className='retro'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
