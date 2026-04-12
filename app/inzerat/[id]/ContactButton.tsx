'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ContactButtonProps {
  phone: string | null
  listingTitle: string
  listingId: string
}

export default function ContactButton({ phone, listingTitle, listingId }: ContactButtonProps) {
  const [revealed, setRevealed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleReveal = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/prihlaseni?redirect=/inzerat/${listingId}`)
      return
    }
    setRevealed(true)
  }

  if (!phone) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
        <p className="text-gray-400 text-sm">Prodávající neuvedl telefonní číslo.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      {!revealed ? (
        <button
          onClick={handleReveal}
          className="w-full text-white font-medium py-3 px-4 rounded-xl transition-colors text-center"
          style={{ backgroundColor: '#E84040' }}
        >
          📞 Mám zájem — zobrazit telefon
        </button>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Telefon prodávajícího:</p>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="text-2xl font-bold tracking-wide"
            style={{ color: '#E84040' }}
          >
            {phone}
          </a>
          <p className="text-xs text-gray-400 mt-2">
            Při kontaktu uveďte: „{listingTitle}"
          </p>
        </div>
      )}
    </div>
  )
}
