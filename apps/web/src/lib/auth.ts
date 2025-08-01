import * as schema from '@/server/db/schemas/auth'

import { betterAuth } from 'better-auth'
import { db } from '@/server/db'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { env } from '@/env'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema,
  }),
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_ID,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      symbol: {
        required: false,
        defaultValue: 'NONE',
        type: 'string',
      },
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
})
