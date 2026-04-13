'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PrihlaseniPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const supabase = createClient()

  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const resetOk = searchParams.get('reset') === 'ok'

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      })
      if (error) {
        setError(`Google chyba: ${error.message}`)
        setLoadingGoogle(false)
      } else if (!data.url) {
        setError('Google přihlášení není nakonfigurováno. Zkus e-mail.')
        setLoadingGoogle(false)
      }
      // Pokud data.url existuje, prohlížeč přesměruje automaticky
    } catch (e: unknown) {
      setError(`Připojení selhalo: ${e instanceof Error ? e.message : String(e)}`)
      setLoadingGoogle(false)
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError('Nesprávný e-mail nebo heslo.')
        return
      }

      // Hard redirect — vynutí načtení session z cookies
      window.location.href = redirect
    } catch {
      setError('Připojení selhalo. Zkus to znovu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/images/logo_1.png"
              alt="Market Mohelnice"
              width={320}
              height={120}
              className="mx-auto mb-6 w-80 h-auto"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Přihlásit se</h1>
          <p className="text-gray-500 text-sm mt-1">Vítej zpátky v Market Mohelnice!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {resetOk && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              Heslo bylo změněno. Přihlaš se novým heslem.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="vas@email.cz"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#E84040' } as React.CSSProperties}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Heslo</label>
              <Link href="/zapomenute-heslo" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Zapomněl jsi heslo?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#E84040' } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  // oko zavřené
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  // oko otevřené
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium py-3 rounded-xl transition-opacity
                       disabled:opacity-60 mt-2"
            style={{ backgroundColor: '#E84040' }}
          >
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </button>
        </form>

        {/* Google */}
        <div className="mt-4">
          <div className="relative flex items-center my-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="mx-3 text-xs text-gray-400">nebo</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <button
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {loadingGoogle ? 'Přesměrovávám...' : 'Pokračovat přes Google'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Nemáš účet?{' '}
          <Link href="/registrace" className="font-medium" style={{ color: '#E84040' }}>
            Zaregistruj se zdarma
          </Link>
        </p>
      </div>
    </div>
  )
}
