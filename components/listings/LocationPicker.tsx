'use client'

import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

const LocationMap = dynamic(() => import('./LocationMap'), { ssr: false })

const MOHELNICE = { lat: 49.7748, lng: 16.9198 }

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface Selected {
  lat: number
  lng: number
  name: string
}

interface Props {
  lat: number
  lng: number
  locationName: string
  onLocationChange: (lat: number, lng: number, name: string) => void
}

export default function LocationPicker({ lat, lng, locationName, onLocationChange }: Props) {
  const [query, setQuery]               = useState(locationName || '')
  const [results, setResults]           = useState<NominatimResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searching, setSearching]       = useState(false)
  const [selected, setSelected]         = useState<Selected | null>(
    locationName ? { lat, lng, name: locationName } : null
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
      const data: NominatimResult[] = await res.json()
      setResults(data)
      setShowDropdown(data.length > 0)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(val), 400)
  }

  const pick = (newLat: number, newLng: number, name: string) => {
    const s = { lat: newLat, lng: newLng, name }
    setSelected(s)
    setQuery(name)
    setShowDropdown(false)
    setResults([])
    onLocationChange(newLat, newLng, name)
  }

  const handleResult = (r: NominatimResult) => {
    const name = r.display_name.split(',')[0].trim()
    pick(parseFloat(r.lat), parseFloat(r.lon), name)
  }

  const handleMapClick = useCallback(async (clickLat: number, clickLng: number) => {
    // Optimisticky nastav pozici okamžitě
    pick(clickLat, clickLng, 'Vybrané místo')

    // Pak zkus reverse geocoding
    try {
      const res = await fetch(`/api/reverse-geocode?lat=${clickLat}&lon=${clickLng}`)
      const data = await res.json()
      if (data?.address) {
        const addr = data.address
        const name =
          addr.road ||
          addr.hamlet ||
          addr.village ||
          addr.town ||
          addr.city ||
          data.display_name?.split(',')[0] ||
          'Vybrané místo'
        pick(clickLat, clickLng, name)
      }
    } catch {
      // ponech "Vybrané místo"
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  return (
    <div className="space-y-3">
      {/* Vyhledávací pole */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder="Hledat adresu nebo místo…"
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400"
          style={ringStyle}
        />
        {searching && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            Hledám…
          </span>
        )}

        {showDropdown && results.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {results.map(r => (
              <li key={r.place_id}>
                <button
                  type="button"
                  onMouseDown={() => handleResult(r)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 truncate"
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa — vždy zobrazena, výchozí střed Mohelnice */}
      <div
        className="rounded-xl overflow-hidden border border-gray-200"
        style={{ height: 220 }}
      >
        <LocationMap
          lat={selected?.lat ?? MOHELNICE.lat}
          lng={selected?.lng ?? MOHELNICE.lng}
          name={selected?.name ?? ''}
          onMapClick={handleMapClick}
        />
      </div>

      <p className="text-xs text-gray-400">
        Vyberte jedno z oblíbených míst, hledejte adresu nebo klikněte na mapu.
      </p>
    </div>
  )
}
