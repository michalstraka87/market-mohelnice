import { NextResponse, type NextRequest } from 'next/server'

// Optimistic auth check — docs: "Proxy should not be used as a full
// session management solution, use it for optimistic checks only."
// Full validation happens inside each page/route handler.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedPaths = ['/pridat', '/profil', '/diskuze']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  const adminPath = pathname.startsWith('/admin')

  if (isProtected || adminPath) {
    // Optimistic check: does an auth cookie exist?
    const hasSession = request.cookies.getAll().some(
      c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    )

    if (!hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = '/prihlaseni'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
