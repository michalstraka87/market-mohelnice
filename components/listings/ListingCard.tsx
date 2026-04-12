import Link from 'next/link'
import Image from 'next/image'
import type { ListingRow } from '@/lib/supabase/types'
import { PRICE_TYPE_LABELS } from '@/lib/constants'

interface ListingCardProps {
  listing: ListingRow & {
    users?: { full_name: string; city: string }
  }
}

function formatPrice(listing: ListingRow): string {
  switch (listing.price_type) {
    case 'free':       return 'Zdarma'
    case 'negotiable': return 'Dohodou'
    case 'symbolic':   return listing.price_text || 'Symbolická cena'
    case 'fixed':
      return listing.price_amount
        ? `${listing.price_amount.toLocaleString('cs-CZ')} Kč`
        : 'Cena neuvedena'
    default: return ''
  }
}

function priceColor(type: ListingRow['price_type']): string {
  switch (type) {
    case 'free':     return 'text-green-600'
    case 'symbolic': return 'text-blue-600'
    case 'fixed':    return 'text-gray-900'
    default:         return 'text-gray-600'
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  const photo = listing.photos?.[0]
  const price = formatPrice(listing)

  return (
    <Link
      href={`/inzerat/${listing.id}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 block"
    >
      {/* Fotka */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
            📷
          </div>
        )}
        {listing.is_sold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold text-sm px-3 py-1 rounded-full">
              PRODÁNO
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-xs text-gray-600 px-2 py-0.5 rounded-full">
            {listing.category}
          </span>
        </div>
      </div>

      {/* Obsah */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-snug mb-1">
          {listing.title}
        </h3>
        <p className={`font-bold text-base ${priceColor(listing.price_type)}`}>
          {price}
        </p>
        {listing.users && (
          <p className="text-xs text-gray-400 mt-1">
            {listing.users.city}
          </p>
        )}
      </div>
    </Link>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  )
}
