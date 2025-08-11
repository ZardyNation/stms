import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // If supabase is not configured, do not block the request
  if (!supabase) {
    return response;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = new URL(request.url)

  if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow access to login and signup pages for non-authenticated users.
  if (!user && url.pathname !== '/login' && url.pathname !== '/signup') {
    // Exclude static assets and API routes from redirection
    if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) {
      return response;
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
