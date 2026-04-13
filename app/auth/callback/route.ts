import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Vytvoř řádek v public.users pokud ještě neexistuje (Google OAuth uživatelé)
      const user = data.user
      const meta = user.user_metadata ?? {}
      await supabase.from('users').upsert(
        {
          id:         user.id,
          full_name:  meta.full_name ?? meta.name ?? user.email?.split('@')[0] ?? 'Uživatel',
          avatar_url: meta.avatar_url ?? meta.picture ?? null,
          city:       '',
        },
        { onConflict: 'id', ignoreDuplicates: true }
      )

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/prihlaseni?error=auth`)
}
