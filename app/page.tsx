export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import ListingCard, { ListingCardSkeleton } from '@/components/listings/ListingCard'
import CategoryFilter from '@/components/listings/CategoryFilter'
import SearchBar from '@/components/listings/SearchBar'
import { Suspense } from 'react'
import type { ListingRow } from '@/lib/supabase/types'

interface PageProps {
  searchParams: Promise<{ kategorie?: string; q?: string }>
}

async function ListingsGrid({
  category,
  query,
}: {
  category?: string
  query?: string
}) {
  const supabase = await createClient()

  let req = supabase
    .from('listings')
    .select('*, users(full_name, city)')
    .eq('is_active', true)
    .eq('is_sold', false)
    .order('created_at', { ascending: false })
    .limit(48)

  if (category) req = req.eq('category', category)
  if (query)    req = req.ilike('title', `%${query}%`)

  const { data: listings, error } = await req

  if (error) {
    return (
      <p className="text-center text-red-500 py-12">
        Chyba při načítání inzerátů. Zkuste to znovu.
      </p>
    )
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-gray-500 text-lg">Žádné inzeráty nenalezeny.</p>
        <p className="text-gray-400 text-sm mt-1">Zkuste jiný filtr nebo přidejte první inzerát!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(listings as (ListingRow & { users?: { full_name: string; city: string } })[]).map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

function ListingsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const category = params.kategorie
  const query    = params.q

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Místní market Mohelnice a okolí
        </h1>
        <p className="text-gray-500">
          Nakupuj a prodávej od sousedů — bez poplatků, bez prostředníků
        </p>
      </div>

      {/* Vyhledávání */}
      <SearchBar defaultValue={query} />

      {/* Filtry kategorií */}
      <CategoryFilter activeCategory={category} />

      {/* Grid inzerátů */}
      <Suspense key={`${category}-${query}`} fallback={<ListingsSkeletonGrid />}>
        <ListingsGrid category={category} query={query} />
      </Suspense>
    </div>
  )
}
