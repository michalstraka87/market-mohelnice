import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marketmohelnice.cz'

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/prihlaseni?error=no_code`)
  }

  // Připravíme response – cookies se nastaví na ni přes setAll
  const response = NextResponse.redirect(`${siteUrl}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[auth/callback] exchangeCodeForSession error:', error?.message)
    return NextResponse.redirect(`${siteUrl}/prihlaseni?error=auth`)
  }

  // Vytvoř řádek v public.users pokud ještě neexistuje
  const user = data.user
  const meta = user.user_metadata ?? {}
  const { error: upsertErr } = await (supabase as any).from('users').upsert(
    {
      id:         user.id,
      full_name:  meta.full_name ?? meta.name ?? user.email?.split('@')[0] ?? 'Uživatel',
      avatar_url: meta.avatar_url ?? meta.picture ?? null,
      city:       meta.city ?? '',
      phone:      meta.phone ?? null,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  )

  if (upsertErr) {
    console.error('[auth/callback] upsert users error:', upsertErr.message)
  }

  return response
}
