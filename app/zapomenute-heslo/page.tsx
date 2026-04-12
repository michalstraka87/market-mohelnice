'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ZapomenutehesloPage() {
  const supabase = createClient()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-hesla`,
    })

    if (error) {
      setError('Nepodařilo se odeslat e-mail. Zkontroluj adresu a zkus to znovu.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Zapomenuté heslo</h1>
          <p className="text-gray-500 text-sm mt-1">
            Zašleme ti odkaz pro reset hesla na e-mail.
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-4xl mb-4">📬</p>
            <h2 className="font-semibold text-gray-900 mb-2">E-mail odeslán</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Zkontroluj svou schránku na adrese <strong>{email}</strong> a klikni na odkaz pro reset hesla.
            </p>
            <p className="text-xs text-gray-400 mt-3">E-mail může trvat pár minut. Zkontroluj i složku se spamem.</p>
            <Link
              href="/prihlaseni"
              className="inline-block mt-6 text-sm font-medium"
              style={{ color: '#E84040' }}
            >
              ← Zpět na přihlášení
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
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
                placeholder="vas@email.cz"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:border-transparent"
                style={ringStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-medium py-3 rounded-xl transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#E84040' }}
            >
              {loading ? 'Odesílám...' : 'Odeslat odkaz'}
            </button>

            <Link
              href="/prihlaseni"
              className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Zpět na přihlášení
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
