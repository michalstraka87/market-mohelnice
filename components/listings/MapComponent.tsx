'use client'

import { useEffect, useRef, useState } from 'react'

interface MapComponentProps {
  lat: number
  lng: number
  onLocationChange: (lat: number, lng: number) => void
}

export default function MapComponent({ lat, lng, onLocationChange }: MapComponentProps) {
  const mapRef = useRef<any>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)

  useEffect(() => {
    // Dynamicky načti Leaflet jen na klientu
    import('leaflet').then((L) => {
      // Opravit default ikony
      const DefaultIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
      L.Marker.prototype.options.icon = DefaultIcon

      if (!mapRef.current) return

      const newMap = L.map(mapRef.current).setView([lat, lng], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(newMap)

      const newMarker = L.marker([lat, lng]).addTo(newMap)
      newMarker.bindPopup(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`)

      newMap.on('click', (e: any) => {
        const { lat: newLat, lng: newLng } = e.latlng
        newMarker.setLatLng([newLat, newLng])
        newMarker.setPopupContent(`📍 ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`)
        onLocationChange(newLat, newLng)
      })

      setMap(newMap)
      setMarker(newMarker)

      return () => {
        newMap.remove()
      }
    })
  }, [lat, lng, onLocationChange])

  return (
    <div className="space-y-3">
      <div className="text-sm">
        <p className="font-medium text-gray-700 mb-2">
          Klikni na mapu a vyber místo předání 📍
        </p>
        <div
          ref={mapRef}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          style={{ height: '300px', width: '100%' }}
        />
      </div>

      {/* Souřadnice */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
        <p>
          <strong>Vybrané souřadnice:</strong> {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
      </div>
    </div>
  )
}
