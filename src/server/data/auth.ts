import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function getServerCurrentSession() {
  const getSession = await auth.api.getSession({ headers: await headers() })
  if (!getSession) return null
  return getSession.session
}

export async function getServerCurrentUser() {
  const getSession = await auth.api.getSession({ headers: await headers() })
  if (!getSession) return null
  return getSession.user
}
