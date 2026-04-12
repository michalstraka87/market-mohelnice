'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/ToastProvider'
import type { UserRow, ListingRow, PostRow } from '@/lib/supabase/types'

type Tab = 'inzeraty' | 'uzivatele' | 'diskuze'

type AdminListing = ListingRow & { users: Pick<UserRow, 'full_name'> }
type AdminPost    = PostRow    & { users: Pick<UserRow, 'full_name'>; replies: { count: number }[] }

export default function AdminPage() {
  const supabase = createClient()
  const { showToast } = useToast()

  const [tab, setTab]           = useState<Tab>('inzeraty')
  const [listings, setListings] = useState<AdminListing[]>([])
  const [users, setUsers]       = useState<UserRow[]>([])
  const [posts, setPosts]       = useState<AdminPost[]>([])
  const [loading, setLoading]   = useState(true)

  const loadAll = useCallback(async () => {
    setLoading(true)
    const [{ data: l }, { data: u }, { data: p }] = await Promise.all([
      (supabase as any)
        .from('listings')
        .select('*, users(full_name)')
        .order('created_at', { ascending: false })
        .limit(200),
      (supabase as any)
        .from('users')
        .select('*')
        .order('created_at', { ascending: false }),
      (supabase as any)
        .from('posts')
        .select('*, users(full_name), replies(count)')
        .order('created_at', { ascending: false }),
    ])
    setListings(l ?? [])
    setUsers(u ?? [])
    setPosts(p ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadAll() }, [loadAll])

  const deleteListing = async (id: string) => {
    if (!confirm('Smazat inzerát?')) return
    const { error } = await (supabase as any).from('listings').delete().eq('id', id)
    if (error) { showToast('Chyba při mazání', 'error'); return }
    setListings(prev => prev.filter(l => l.id !== id))
    showToast('Inzerát smazán', 'success')
  }

  const toggleListingActive = async (listing: AdminListing) => {
    const akce = listing.is_active ? 'deaktivovat' : 'aktivovat'
    if (!confirm(`Opravdu chceš inzerát "${listing.title}" ${akce}?`)) return
    const { error } = await (supabase as any)
      .from('listings')
      .update({ is_active: !listing.is_active })
      .eq('id', listing.id)
    if (error) { showToast('Chyba', 'error'); return }
    setListings(prev => prev.map(l => l.id === listing.id ? { ...l, is_active: !l.is_active } : l))
  }

  const deletePost = async (id: string) => {
    if (!confirm('Smazat příspěvek i s odpověďmi?')) return
    const { error } = await (supabase as any).from('posts').delete().eq('id', id)
    if (error) { showToast('Chyba při mazání', 'error'); return }
    setPosts(prev => prev.filter(p => p.id !== id))
    showToast('Příspěvek smazán', 'success')
  }

  const toggleAdmin = async (user: UserRow) => {
    if (user.is_admin && !confirm('Odebrat adminovi práva?')) return
    const { error } = await (supabase as any)
      .from('users')
      .update({ is_admin: !user.is_admin })
      .eq('id', user.id)
    if (error) { showToast('Chyba', 'error'); return }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_admin: !u.is_admin } : u))
  }

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'inzeraty',  label: 'Inzeráty',  count: listings.length },
    { key: 'uzivatele', label: 'Uživatelé', count: users.length },
    { key: 'diskuze',   label: 'Diskuze',   count: posts.length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🛡️</span>
        <h1 className="text-2xl font-bold text-gray-900">Administrace</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label} <span className="text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Načítám...</div>
      ) : (
        <>
          {/* ── INZERÁTY ── */}
          {tab === 'inzeraty' && (
            <div className="space-y-2">
              {listings.map(l => (
                <div key={l.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {l.photos?.[0] ? (
                      <Image src={l.photos[0]} alt={l.title} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/inzerat/${l.id}`} className="font-medium text-gray-900 hover:text-red-500 transition-colors truncate block">
                      {l.title}
                    </Link>
                    <p className="text-xs text-gray-400">
                      {l.users?.full_name} · {new Date(l.created_at).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {l.is_sold && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Prodáno</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${l.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {l.is_active ? 'Aktivní' : 'Neaktivní'}
                    </span>
                    <button
                      onClick={() => toggleListingActive(l)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {l.is_active ? 'Deaktivovat' : 'Aktivovat'}
                    </button>
                    <button
                      onClick={() => deleteListing(l.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              ))}
              {listings.length === 0 && <p className="text-center text-gray-400 py-12">Žádné inzeráty</p>}
            </div>
          )}

          {/* ── UŽIVATELÉ ── */}
          {tab === 'uzivatele' && (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                    {u.avatar_url ? (
                      <Image src={u.avatar_url} alt={u.full_name} width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{u.full_name}</p>
                      {u.is_admin && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Admin</span>}
                      {u.is_verified && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Ověřený</span>}
                    </div>
                    <p className="text-xs text-gray-400">
                      📍 {u.city} · registrován {new Date(u.created_at).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleAdmin(u)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        u.is_admin
                          ? 'border-red-100 text-red-500 hover:bg-red-50'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {u.is_admin ? 'Odebrat admina' : 'Udělat admina'}
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p className="text-center text-gray-400 py-12">Žádní uživatelé</p>}
            </div>
          )}

          {/* ── DISKUZE ── */}
          {tab === 'diskuze' && (
            <div className="space-y-2">
              {posts.map(p => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start">
                  <div className="flex-1 min-w-0">
                    <Link href={`/diskuze/${p.id}`} className="font-medium text-gray-900 hover:text-red-500 transition-colors block truncate">
                      {p.title}
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{p.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {p.users?.full_name} · {new Date(p.created_at).toLocaleDateString('cs-CZ')} · 💬 {p.replies?.[0]?.count ?? 0} odpovědí
                    </p>
                  </div>
                  <button
                    onClick={() => deletePost(p.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                  >
                    Smazat
                  </button>
                </div>
              ))}
              {posts.length === 0 && <p className="text-center text-gray-400 py-12">Žádné příspěvky</p>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
