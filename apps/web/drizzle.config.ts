import { type Config } from 'drizzle-kit'
import { env } from '@/env'

export default {
  schema: './src/server/db/schemas',
  out: './src/server/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config
