import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat')
  const lon = request.nextUrl.searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing lat/lon' }, { status: 400 })
  }

  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json`

  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'cs',
      'User-Agent': 'MarketMohelnice/1.0 (community marketplace)',
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 502 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
