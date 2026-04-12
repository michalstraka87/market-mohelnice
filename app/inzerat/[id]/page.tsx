import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PRICE_TYPE_LABELS } from '@/lib/constants'
import ContactButton from './ContactButton'
import PhotoGallery from './PhotoGallery'
import ListingMap from './ListingMap'
import type { ListingWithUser } from '@/lib/supabase/types'

interface PageProps {
  params: Promise<{ id: string }>
}

function StarRating({ avg, count }: { avg: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${star <= Math.round(avg) ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-1">
        {count > 0 ? `${avg.toFixed(1)} (${count} hodnocení)` : 'Zatím nehodnoceno'}
      </span>
    </div>
  )
}

function formatPrice(listing: ListingWithUser): { label: string; color: string } {
  switch (listing.price_type) {
    case 'free':
      return { label: 'Zdarma 🎁', color: 'text-green-600' }
    case 'negotiable':
      return { label: 'Dohodou', color: 'text-gray-700' }
    case 'symbolic':
      return { label: listing.price_text || 'Symbolická cena', color: 'text-blue-600' }
    case 'fixed':
      return {
        label: listing.price_amount
          ? `${listing.price_amount.toLocaleString('cs-CZ')} Kč`
          : 'Cena neuvedena',
        color: 'text-gray-900',
      }
    default:
      return { label: '', color: '' }
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('*, users(*)')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  const l = listing as ListingWithUser
  const price = formatPrice(l)
  const seller = l.users

  const createdDate = new Date(l.created_at).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-gray-600">Marketplace</Link>
        <span>/</span>
        <span className="text-gray-600">{l.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{l.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Levý sloupec: fotky + popis */}
        <div className="lg:col-span-2 space-y-4">
          {/* Galerie fotek */}
          <PhotoGallery photos={l.photos} title={l.title} />

          {/* Název a cena */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{l.title}</h1>
              {l.is_sold && (
                <span className="flex-shrink-0 bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                  Prodáno
                </span>
              )}
            </div>

            <p className={`text-3xl font-bold mb-4 ${price.color}`}>{price.label}</p>

            <div className="flex items-center gap-4 text-sm text-gray-400 border-t pt-3">
              <span>📅 {createdDate}</span>
              <span>📍 {l.transfer_location || l.users?.city || 'Mohelnice'}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {l.category}
              </span>
            </div>

            {/* Poznámka o místu předání */}
            {l.transfer_location && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <strong>Místo předání:</strong> {l.transfer_location}
                </p>
              </div>
            )}
          </div>

          {/* Popis */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">Popis</h2>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-sm">
              {l.description}
            </p>
          </div>

          {/* Místo předání — mapa */}
          {l.location_lat && l.location_lng && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-3">
                📍 Místo předání
              </h2>
              <ListingMap
                lat={Number(l.location_lat)}
                lng={Number(l.location_lng)}
                name={l.transfer_location || l.users?.city || 'Místo předání'}
              />
            </div>
          )}
        </div>

        {/* Pravý sloupec: prodávající + kontakt */}
        <div className="space-y-4">
          {/* Karta prodávajícího */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Prodávající</h2>
            <div className="flex items-center gap-3 mb-4">
              {seller?.avatar_url ? (
                <Image
                  src={seller.avatar_url}
                  alt={seller.full_name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                  👤
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{seller?.full_name}</p>
                <p className="text-sm text-gray-400">{seller?.city}</p>
              </div>
            </div>

            <StarRating
              avg={seller?.rating_avg || 0}
              count={seller?.rating_count || 0}
            />

            {seller?.is_verified && (
              <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                <span>✓</span>
                <span>Ověřený uživatel</span>
              </div>
            )}
          </div>

          {/* Kontaktní tlačítko */}
          <ContactButton
            phone={seller?.phone || null}
            listingTitle={l.title}
            listingId={l.id}
          />

          {/* Varování bezpečnost */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Bezpečný obchod:</strong> Vždy se setkejte osobně na veřejném místě.
              Nikdy neposílejte peníze předem neznámým osobám.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
