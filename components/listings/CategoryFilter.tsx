'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES } from '@/lib/constants'

interface CategoryFilterProps {
  activeCategory?: string
}

export default function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('kategorie', categoryId)
    } else {
      params.delete('kategorie')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto chips-scroll pb-2">
        {/* Chip "Vše" */}
        <button
          onClick={() => handleClick(null)}
          className={`
            flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-150 whitespace-nowrap border
            ${!activeCategory
              ? 'text-white border-transparent shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }
          `}
          style={!activeCategory ? { backgroundColor: '#E84040' } : {}}
        >
          Vše
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-150 whitespace-nowrap border
                ${isActive
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }
              `}
              style={isActive ? { backgroundColor: '#E84040' } : {}}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
