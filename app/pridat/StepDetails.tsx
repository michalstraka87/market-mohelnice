'use client'

import { CATEGORIES } from '@/lib/constants'
import type { WizardData } from './page'

interface Props {
  data: WizardData
  update: (partial: Partial<WizardData>) => void
}

export default function StepDetails({ data, update }: Props) {
  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
    focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400`
  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Popis inzerátu</h2>
        <p className="text-sm text-gray-400 mb-5">Popiš, co nabízíš, aby kupující věděli, co dostanou.</p>
      </div>

      {/* Název */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Název <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={e => update({ title: e.target.value })}
          required
          maxLength={100}
          placeholder="Např. Dámské kolo Trek 26&quot; — výborný stav"
          className={inputClass}
          style={ringStyle}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{data.title.length}/100</p>
      </div>

      {/* Popis */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Popis <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={e => update({ description: e.target.value })}
          required
          maxLength={2000}
          rows={5}
          placeholder="Popiš stav, rozměry, důvod prodeje, co je v ceně..."
          className={`${inputClass} resize-none`}
          style={ringStyle}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{data.description.length}/2000</p>
      </div>

      {/* Kategorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategorie <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => update({ category: cat.id })}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm text-left
                transition-all duration-150
                ${data.category === cat.id
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }
              `}
              style={data.category === cat.id ? { backgroundColor: '#E84040' } : {}}
            >
              <span>{cat.icon}</span>
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
