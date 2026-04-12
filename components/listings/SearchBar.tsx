'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'

interface SearchBarProps {
  defaultValue?: string
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = inputRef.current?.value.trim()
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    router.push(`/?${params.toString()}`)
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-4">
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          defaultValue={defaultValue}
          placeholder="Hledat inzeráty..."
          className="w-full pl-10 pr-20 py-3 rounded-xl border border-gray-200 bg-white
                     text-gray-900 placeholder-gray-400 text-sm
                     focus:outline-none focus:ring-2 focus:border-transparent
                     shadow-sm"
          style={{ '--tw-ring-color': '#E84040' } as React.CSSProperties}
        />
        {defaultValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-sm font-medium
                     px-4 py-1.5 rounded-lg transition-colors"
          style={{ backgroundColor: '#E84040' }}
        >
          Hledat
        </button>
      </div>
    </form>
  )
}
