import { createClient, type Client } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { env } from '@/env'
import * as schema from '@/server/db/schema'

const globalForDb = globalThis as unknown as {
  client: Client | undefined
}

export const client =
  globalForDb.client ??
  createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN })
if (env.NODE_ENV !== 'production') globalForDb.client = client

export const db = drizzle(client, { schema })
