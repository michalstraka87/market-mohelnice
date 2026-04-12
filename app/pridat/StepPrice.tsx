'use client'

import { SYMBOLIC_OPTIONS } from '@/lib/constants'
import type { PriceType } from '@/lib/supabase/types'
import type { WizardData } from './page'
import LocationPicker from '@/components/listings/LocationPicker'

interface Props {
  data: WizardData
  update: (partial: Partial<WizardData>) => void
}

interface PriceOption {
  id: PriceType
  label: string
  desc: string
  icon: string
}

const PRICE_OPTIONS: PriceOption[] = [
  { id: 'free',       label: 'Zdarma',          desc: 'Dáváš věc zadarmo komunitě',          icon: '🎁' },
  { id: 'symbolic',   label: 'Symbolická cena',  desc: 'Čokoláda, káva, pivo nebo vlastní',   icon: '☕' },
  { id: 'fixed',      label: 'Pevná cena',       desc: 'Zadáš konkrétní částku v Kč',         icon: '💰' },
  { id: 'negotiable', label: 'Dohodou',          desc: 'Cena se domluví při kontaktu',        icon: '🤝' },
]

export default function StepPrice({ data, update }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Typ ceny</h2>
        <p className="text-sm text-gray-400 mb-5">Jak chceš svoji věc nabídnout?</p>
      </div>

      {/* Výběr typu ceny */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRICE_OPTIONS.map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => update({ priceType: opt.id, priceAmount: '', priceText: '' })}
            className={`
              text-left p-4 rounded-xl border-2 transition-all duration-150
              ${data.priceType === opt.id
                ? 'border-red-400 bg-red-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
              }
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{opt.icon}</span>
              <span className={`font-medium text-sm ${data.priceType === opt.id ? 'text-red-700' : 'text-gray-900'}`}>
                {opt.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 ml-9">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* Symbolická cena — výběr */}
      {data.priceType === 'symbolic' && (
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Vyber symbolickou odměnu:
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {SYMBOLIC_OPTIONS.filter(o => o.id !== 'vlastni').map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update({ priceText: opt.label })}
                className={`
                  px-4 py-2 rounded-full border text-sm transition-all
                  ${data.priceText === opt.label
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }
                `}
                style={data.priceText === opt.label ? { backgroundColor: '#E84040' } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={SYMBOLIC_OPTIONS.some(o => o.label === data.priceText && o.id !== 'vlastni') ? '' : data.priceText}
            onChange={e => update({ priceText: e.target.value })}
            placeholder="Nebo napiš vlastní (např. Domácí koláč 🍰)"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': '#E84040' } as React.CSSProperties}
          />
        </div>
      )}

      {/* Pevná cena — input */}
      {data.priceType === 'fixed' && (
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Cena v Kč <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="9999999"
              value={data.priceAmount}
              onChange={e => update({ priceAmount: e.target.value })}
              placeholder="0"
              className="w-full pl-3.5 pr-12 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#E84040' } as React.CSSProperties}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              Kč
            </span>
          </div>
        </div>
      )}

      {/* Souhrn */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs text-gray-500 font-medium mb-1">Náhled ceny v inzerátu:</p>
        <p className="text-lg font-bold text-gray-900">
          {data.priceType === 'free' && 'Zdarma 🎁'}
          {data.priceType === 'negotiable' && 'Dohodou 🤝'}
          {data.priceType === 'symbolic' && (data.priceText || 'Symbolická cena')}
          {data.priceType === 'fixed' && (
            data.priceAmount
              ? `${parseFloat(data.priceAmount).toLocaleString('cs-CZ')} Kč`
              : 'Zadej cenu výše'
          )}
        </p>
      </div>

      {/* Místo předání */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Kde se věc předá? <span className="text-red-500">*</span>
        </label>
        <LocationPicker
          lat={data.locationLat}
          lng={data.locationLng}
          locationName={data.transferLocation}
          onLocationChange={(lat, lng, name) =>
            update({ locationLat: lat, locationLng: lng, transferLocation: name })
          }
        />
      </div>
    </div>
  )
}
