import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Stránky, které vyžadují přihlášení
const PROTECTED = ['/pridat', '/profil']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some(
    p => pathname === p || pathname.startsWith(p + '/')
  )

  // Veřejné stránky – propustíme bez kontroly
  if (!isProtected) {
    return NextResponse.next({ request })
  }

  // Pro chráněné stránky zkontrolujeme session z cookie (bez network requestu)
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getSession() čte JWT z cookie – žádný network request, žádný auth lock
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = '/prihlaseni'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/pridat',
    '/pridat/:path*',
    '/profil',
    '/profil/:path*',
  ],
}
