import { NextResponse, type NextRequest } from 'next/server'

// Proxy je pasivní — neprovádí žádné Supabase volání.
// Všechny chráněné stránky jsou 'use client' a auth řeší přes getSession() samy.
// Jakékoliv server-side volání Supabase auth zde způsobuje lock contention s klientem.
export function proxy(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
