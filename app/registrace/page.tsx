'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CITIES } from '@/lib/constants'

export default function RegistracePage() {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    city: 'Mohelnice',
    preferredTransferLocation: 'Mohelnice',
    phone: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.passwordConfirm) {
      setError('Hesla se neshodují.')
      return
    }
    if (formData.password.length < 8) {
      setError('Heslo musí mít alespoň 8 znaků.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          city:      formData.city,
          phone:     formData.phone || null,
          preferred_transfer_location: formData.preferredTransferLocation,
        },
      },
    })

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Tento e-mail je již zaregistrovaný.'
        : `Chyba při registraci: ${error.message}`)
      setLoading(false)
      return
    }

    router.push('/email-confirmation')
    router.refresh()
  }

  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
    focus:outline-none focus:ring-2 focus:border-transparent`
  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Registrace</h1>
          <p className="text-gray-500 text-sm mt-1">Připoj se ke komunitnímu bazaru Mohelnice</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
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
              value={formData.fullName}
              onChange={set('fullName')}
              required
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
              value={formData.email}
              onChange={set('email')}
              required
              placeholder="vas@email.cz"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Město <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.city}
              onChange={set('city')}
              required
              className={inputClass}
              style={ringStyle}
            >
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Telefon
              <span className="text-gray-400 font-normal text-xs ml-1">(volitelné)</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={set('phone')}
              placeholder="+420 777 123 456"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preferované místo předání <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.preferredTransferLocation}
              onChange={set('preferredTransferLocation')}
              required
              className={inputClass}
              style={ringStyle}
            >
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Kde ti nejlépe vyhovuje si převzít/předat věci
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Heslo <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={set('password')}
              required
              placeholder="min. 8 znaků"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Heslo znovu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.passwordConfirm}
              onChange={set('passwordConfirm')}
              required
              placeholder="••••••••"
              className={inputClass}
              style={ringStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium py-3 rounded-xl transition-opacity
                       disabled:opacity-60 mt-2"
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
