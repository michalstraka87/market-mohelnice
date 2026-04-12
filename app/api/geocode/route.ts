import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q || q.length < 2) {
    return NextResponse.json([], { status: 200 })
  }

  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=cz`

  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'cs',
      'User-Agent': 'MarketMohelnice/1.0 (community marketplace)',
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return NextResponse.json([], { status: 200 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
