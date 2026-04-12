'use client'

import { useEffect, useRef } from 'react'
import type { Map, Marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  lat: number
  lng: number
  name: string
  onMapClick?: (lat: number, lng: number) => void
}

export default function LocationMap({ lat, lng, name, onMapClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef    = useRef<Map | null>(null)
  const markerRef = useRef<Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    import('leaflet').then((L) => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }

      const icon = L.icon({
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        shadowSize:  [41, 41],
      })

      const map = L.map(containerRef.current!).setView([lat, lng], 16)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      if (name) {
        markerRef.current = L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`📍 ${name}`)
          .openPopup()
      }
      mapRef.current    = map

      if (onMapClick) {
        map.on('click', (e) => {
          onMapClick(e.latlng.lat, e.latlng.lng)
        })
        map.getContainer().style.cursor = 'crosshair'
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current    = null
        markerRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, name])

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
}
