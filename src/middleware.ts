import { type NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const ROOT_ROUTE = '/'
const HOME_ROUTE = '/home'

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  const sessionCookie = getSessionCookie(req.headers)
  const isAuthed = !!sessionCookie

  const isOnRootRoute = nextUrl.pathname === ROOT_ROUTE

  if (isAuthed && isOnRootRoute) {
    return NextResponse.redirect(new URL(HOME_ROUTE, req.url))
  }

  if (!isAuthed && !isOnRootRoute) {
    return NextResponse.redirect(new URL(ROOT_ROUTE, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
