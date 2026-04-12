'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PrihlaseniPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const resetOk = searchParams.get('reset') === 'ok'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Nesprávný e-mail nebo heslo.')
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/images/logo_1.png"
              alt="Market Mohelnice"
              width={240}
              height={90}
              className="mx-auto mb-6 w-60 h-auto"
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
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#E84040' } as React.CSSProperties}
            />
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
