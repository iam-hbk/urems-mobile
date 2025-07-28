import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserTokenCookieName } from './src/lib/auth/config'


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(UserTokenCookieName)?.value

  const isLoginPage = pathname.startsWith('/login')

  // If the user is authenticated and tries to access the login page,
  // redirect them to the dashboard.
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If the user is not authenticated and is trying to access any page
  // other than the login page, redirect them to the login page.
  if (!token && !isLoginPage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname) // Remember where they were going
    return NextResponse.redirect(loginUrl)
  }

  // Otherwise, allow the request to proceed.
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 