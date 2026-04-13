'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/ToastProvider'
import type { UserRow, ListingRow } from '@/lib/supabase/types'

type Tab = 'profil' | 'inzeraty'

function formatPrice(listing: ListingRow): string {
  switch (listing.price_type) {
    case 'free':       return 'Zdarma 🎁'
    case 'negotiable': return 'Dohodou'
    case 'symbolic':   return listing.price_text || 'Symbolická cena'
    case 'fixed':      return listing.price_amount
      ? `${Number(listing.price_amount).toLocaleString('cs-CZ')} Kč`
      : 'Cena neuvedena'
    default: return ''
  }
}

export default function ProfilPage() {
  const router = useRouter()
  const supabase = createClient()
  const { showToast } = useToast()

  const [authUser, setAuthUser]   = useState<{ id: string; email: string } | null>(null)
  const [prof, setProf]           = useState<UserRow | null>(null)
  const [listings, setListings]   = useState<ListingRow[]>([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<Tab>('profil')

  // Edit stav
  const [editing, setEditing]       = useState(false)
  const [saving, setSaving]         = useState(false)
  const [form, setForm]             = useState({ full_name: '', city: '', phone: '', bio: '' })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !authUser) return

    if (file.size > 2 * 1024 * 1024) {
      showToast('Fotka musí být menší než 2 MB', 'error')
      return
    }

    setUploadingAvatar(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `${authUser.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '3600' })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      const avatarUrl = `${publicUrl}?t=${Date.now()}`

      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', authUser.id)

      if (updateError) throw updateError

      await loadData()
      showToast('Fotka profilu aktualizována', 'success')
    } catch {
      showToast('Nepodařilo se nahrát fotku', 'error')
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const loadData = useCallback(async () => {
    try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      await supabase.auth.signOut()
      router.push('/prihlaseni?redirect=/profil')
      return
    }

    setAuthUser({ id: user.id, email: user.email ?? '' })

    const [{ data: profile }, { data: myListings }] = await Promise.all([
      (supabase as any).from('users').select('*').eq('id', user.id).single(),
      (supabase as any)
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ])

    if (profile) {
      setProf(profile as UserRow)
      setForm({
        full_name: profile.full_name ?? '',
        city:      profile.city ?? '',
        phone:     profile.phone ?? '',
        bio:       profile.bio ?? '',
      })
    }
    if (myListings) setListings(myListings as ListingRow[])
    setLoading(false)
    } catch {
      await supabase.auth.signOut()
      router.push('/prihlaseni?redirect=/profil')
    }
  }, [router, supabase])

  useEffect(() => { loadData() }, [loadData])

  const handleSave = async () => {
    if (!authUser) return
    setSaving(true)
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({
          full_name: form.full_name.trim(),
          city:      form.city.trim(),
          phone:     form.phone.trim() || null,
          bio:       form.bio.trim() || null,
        })
        .eq('id', authUser.id)

      if (error) throw error
      await loadData()
      setEditing(false)
      showToast('Profil uložen', 'success')
    } catch {
      showToast('Nepodařilo se uložit profil', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat tento inzerát?')) return
    const { error } = await (supabase as any).from('listings').delete().eq('id', id)
    if (error) { showToast('Nepodařilo se smazat', 'error'); return }
    setListings(prev => prev.filter(l => l.id !== id))
    showToast('Inzerát smazán', 'success')
  }

  const handleToggleSold = async (listing: ListingRow) => {
    const { error } = await (supabase as any)
      .from('listings')
      .update({ is_sold: !listing.is_sold })
      .eq('id', listing.id)
    if (error) { showToast('Chyba', 'error'); return }
    setListings(prev => prev.map(l =>
      l.id === listing.id ? { ...l, is_sold: !l.is_sold } : l
    ))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Načítám...</div>
  }

  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
    focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400`
  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Můj profil</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Odhlásit
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {(['profil', 'inzeraty'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'profil' ? '👤 Profil' : `📦 Moje inzeráty (${listings.length})`}
          </button>
        ))}
      </div>

      {/* ── TAB: PROFIL ── */}
      {tab === 'profil' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {!editing ? (
            /* Zobrazení profilu */
            <>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar — kliknutím změníš fotku */}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 group"
                    title="Klikni pro změnu fotky"
                  >
                    {prof?.avatar_url ? (
                      <Image
                        src={prof.avatar_url}
                        alt={prof.full_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-2xl text-white">
                        👤
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                      {uploadingAvatar ? '…' : '📷 Změnit'}
                    </div>
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{prof?.full_name}</h2>
                    <p className="text-gray-500 text-sm">📍 {prof?.city || '—'}</p>
                    {prof?.phone && <p className="text-gray-500 text-sm">📞 {prof.phone}</p>}
                    <p className="text-xs text-gray-400 mt-1">Klikni na fotku pro změnu</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  ✏️ Upravit
                </button>
              </div>

              {prof?.bio && (
                <p className="text-sm text-gray-600 border-t pt-4">{prof.bio}</p>
              )}

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">⭐ {prof?.rating_avg?.toFixed(1) || '—'}</p>
                  <p className="text-xs text-gray-500 mt-1">{prof?.rating_count || 0} hodnocení</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">📦 {listings.length}</p>
                  <p className="text-xs text-gray-500 mt-1">inzerátů</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{prof?.is_verified ? '✓' : '○'}</p>
                  <p className="text-xs text-gray-500 mt-1">{prof?.is_verified ? 'Ověřený' : 'Neověřený'}</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 pt-4 border-t">Přihlášen jako: {authUser?.email}</p>
            </>
          ) : (
            /* Edit formulář */
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upravit profil</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jméno a příjmení</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  className={inputClass}
                  style={ringStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Město</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className={inputClass}
                  style={ringStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+420 123 456 789"
                  className={inputClass}
                  style={ringStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">O mně</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  placeholder="Pár slov o tobě..."
                  className={`${inputClass} resize-none`}
                  style={ringStyle}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.full_name.trim()}
                  className="px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50 transition-opacity"
                  style={{ backgroundColor: '#E84040' }}
                >
                  {saving ? 'Ukládám...' : 'Uložit'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Zrušit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: MOJE INZERÁTY ── */}
      {tab === 'inzeraty' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{listings.length} inzerátů celkem</p>
            <Link
              href="/pridat"
              className="px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: '#E84040' }}
            >
              + Přidat inzerát
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">Zatím žádné inzeráty</p>
              <Link
                href="/pridat"
                className="inline-block mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ backgroundColor: '#E84040' }}
              >
                Přidat první inzerát
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map(listing => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start"
                >
                  {/* Foto */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {listing.photos?.[0] ? (
                      <Image
                        src={listing.photos[0]}
                        alt={listing.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/inzerat/${listing.id}`}
                        className="font-medium text-gray-900 hover:text-red-500 transition-colors truncate"
                      >
                        {listing.title}
                      </Link>
                      <div className="flex gap-1 flex-shrink-0">
                        {listing.is_sold && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Prodáno</span>
                        )}
                        {!listing.is_active && !listing.is_sold && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Neaktivní</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">{formatPrice(listing)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(listing.created_at).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Akce */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleSold(listing)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                      {listing.is_sold ? '↩ Vrátit' : '✓ Prodáno'}
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
