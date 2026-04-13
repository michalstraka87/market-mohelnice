'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marketmohelnice.cz'

export default function RegistracePage() {
  const supabase = createClient()

  const [fullName, setFullName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [city, setCity]           = useState('')
  const [phone, setPhone]         = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Heslo musí mít alespoň 8 znaků.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Po potvrzení emailu Supabase přesměruje sem
          emailRedirectTo: `${SITE_URL}/auth/callback`,
          data: {
            full_name: fullName.trim(),
            city:      city.trim(),
            phone:     phone.trim() || null,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setError('Tento e-mail je již zaregistrovaný. Přihlaš se.')
        } else {
          setError(`Chyba při registraci: ${error.message}`)
        }
        return
      }

      setDone(true)
    } catch {
      setError('Připojení selhalo. Zkus to znovu.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent'
  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  if (done) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zkontroluj e-mail</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Poslali jsme ti potvrzovací odkaz na <strong>{email}</strong>.
            Klikni na něj a účet bude aktivní.
          </p>
          <p className="text-gray-400 text-xs mt-4">
            Pokud email nevidíš, zkontroluj složku Spam.
          </p>
          <Link
            href="/prihlaseni"
            className="inline-block mt-6 text-sm font-medium"
            style={{ color: '#E84040' }}
          >
            ← Zpět na přihlášení
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Registrace</h1>
          <p className="text-gray-500 text-sm mt-1">Připoj se ke komunitnímu bazaru Mohelnice</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Jméno a příjmení <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Jan Novák"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="vas@email.cz"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Město <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
              autoComplete="address-level2"
              placeholder="Mohelnice"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Telefon
              <span className="text-gray-400 font-normal text-xs ml-1">(volitelné)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="+420 777 123 456"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Heslo <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="min. 8 znaků"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium py-3 rounded-xl transition-opacity disabled:opacity-60 mt-2"
            style={{ backgroundColor: '#E84040' }}
          >
            {loading ? 'Registruji...' : 'Zaregistrovat se zdarma'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Již máš účet?{' '}
          <Link href="/prihlaseni" className="font-medium" style={{ color: '#E84040' }}>
            Přihlásit se
          </Link>
        </p>
      </div>
    </div>
  )
}
