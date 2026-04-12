'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetHeslaPage() {
  const supabase = createClient()
  const router   = useRouter()

  const [password, setPassword]   = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [ready, setReady]         = useState(false)

  // Supabase při příchodu z reset e-mailu automaticky nastaví session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
      else setError('Odkaz není platný nebo vypršel. Požádej o nový reset hesla.')
    })
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Heslo musí mít alespoň 8 znaků.')
      return
    }
    if (password !== password2) {
      setError('Hesla se neshodují.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Nepodařilo se změnit heslo. Zkus to znovu.')
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    window.location.href = '/prihlaseni?reset=ok'
  }

  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Nové heslo</h1>
          <p className="text-gray-500 text-sm mt-1">Zadej nové heslo pro svůj účet.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nové heslo</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="min. 8 znaků"
              disabled={!ready}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-50"
              style={ringStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Potvrzení hesla</label>
            <input
              type="password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              required
              placeholder="••••••••"
              disabled={!ready}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-50"
              style={ringStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !ready}
            className="w-full text-white font-medium py-3 rounded-xl transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#E84040' }}
          >
            {loading ? 'Ukládám...' : 'Nastavit heslo'}
          </button>
        </form>
      </div>
    </div>
  )
}
