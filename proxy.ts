import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/pridat', '/profil']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some(
    p => pathname === p || pathname.startsWith(p + '/')
  )

  if (!isProtected) {
    return NextResponse.next({ request })
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/prihlaseni'
  loginUrl.searchParams.set('redirect', pathname)

  try {
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

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(loginUrl)
    }

    return response
  } catch {
    // Při jakékoliv chybě přesměruj na login (fail closed)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/pridat', '/pridat/:path*', '/profil', '/profil/:path*'],
}
