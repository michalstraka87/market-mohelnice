'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PrihlaseniPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const authError = searchParams.get('error')
  const supabase = createClient()

  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]               = useState(
    authError ? 'Přihlášení selhalo. Zkus to znovu.' : ''
  )
  const [loading, setLoading] = useState(false)

  // Pokud je uživatel už přihlášený, přesměruj ho
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = redirect
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError('Nesprávný e-mail nebo heslo.')
        return
      }

      if (!data.session) {
        setError('Přihlášení selhalo — zkus to znovu.')
        return
      }

      window.location.href = redirect
    } catch {
      setError('Připojení selhalo. Zkus to znovu.')
    } finally {
      setLoading(false)
    }
  }

  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

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

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="vas@email.cz"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={ringStyle}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Heslo</label>
              <Link
                href="/zapomenute-heslo"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Zapomněl jsi heslo?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:border-transparent"
                style={ringStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
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
            className="w-full text-white font-medium py-3 rounded-xl transition-opacity disabled:opacity-60 mt-2"
            style={{ backgroundColor: '#E84040' }}
          >
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </button>
        </form>

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
