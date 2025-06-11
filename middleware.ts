import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserTokenCookieName } from './src/lib/auth/config'
import { getCookie } from '@/utils/cookies'


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname

  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      )
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With'
      )
      response.headers.set('Access-Control-Max-Age', '86400')
      return response
    }

    // Handle actual requests
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-CSRF-Token, X-Requested-With'
    )
    return response
  }

  // Define public and protected routes
  const publicRoutes = ['/login']
  const protectedRoutes = [
    '/profile',
    '/dashboard',
    '/'
  ]

  // Get the session from cookie
  // const sessionCookie = request.cookies.get('auth_session')?.value

  // using next/headers
  const cookieUserToken = await getCookie(UserTokenCookieName);
  let sessionToken: string | null = null;

  // if cookie expired or wasn't set, will return undefined
  if (cookieUserToken) {
    sessionToken = cookieUserToken;
    // try {
    //   const parsedSession = JSON.parse(sessionCookie) as TypeSession
    //   // Check if session is expired
    //   if (new Date(parsedSession.expires) < new Date()) {
    //     session = null
    //   } else {
    //     session = parsedSession
    //   }
    // } catch {
    //   session = null
    // }
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || // Exact match
    (route !== '/' && pathname.startsWith(route)) // Starts with but not root
  )

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route)

  // If accessing a protected route and not authenticated
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/login', request.url)
    // Add the original URL as a query parameter for redirect after login
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing public route (like login) while authenticated
  if (isPublicRoute && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 