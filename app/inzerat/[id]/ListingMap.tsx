'use client'

import dynamic from 'next/dynamic'

const LocationMap = dynamic(() => import('@/components/listings/LocationMap'), { ssr: false })

interface Props {
  lat: number
  lng: number
  name: string
}

export default function ListingMap({ lat, lng, name }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 240 }}>
      <LocationMap lat={lat} lng={lng} name={name} />
    </div>
  )
}
