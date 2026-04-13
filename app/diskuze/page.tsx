'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { PostWithUser } from '@/lib/supabase/types'

export default function DiskuzePage() {
  const supabase = createClient()
  const router   = useRouter()

  const [posts, setPosts]     = useState<PostWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser]       = useState<{ id: string } | null>(null)

  // Nový příspěvek
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle]       = useState('')
  const [text, setText]         = useState('')
  const [posting, setPosting]   = useState(false)

  const loadPosts = useCallback(async () => {
    const { data } = await (supabase as any)
      .from('posts')
      .select('*, users(full_name, avatar_url), replies(count)')
      .order('created_at', { ascending: false })
      .limit(50)
    setPosts(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ? { id: data.user.id } : null))
    loadPosts()
  }, [loadPosts, supabase])

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/prihlaseni?redirect=/diskuze'); return }
    setPosting(true)
    const { error } = await (supabase as any)
      .from('posts')
      .insert({ user_id: user.id, title: title.trim(), text: text.trim() })
    if (!error) {
      setTitle('')
      setText('')
      setShowForm(false)
      await loadPosts()
    }
    setPosting(false)
  }

  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diskuze</h1>
          <p className="text-sm text-gray-400 mt-0.5">Komunitní nástěnka pro Mohelnici a okolí</p>
        </div>
        <button
          onClick={() => user ? setShowForm(v => !v) : router.push('/prihlaseni?redirect=/diskuze')}
          className="px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#E84040' }}
        >
          + Nový příspěvek
        </button>
      </div>

      {/* Formulář nového příspěvku */}
      {showForm && (
        <form onSubmit={handlePost} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 space-y-3">
          <h2 className="font-semibold text-gray-900">Nový příspěvek</h2>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="Nadpis příspěvku…"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            style={ringStyle}
          />
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            required
            maxLength={2000}
            rows={4}
            placeholder="Co chceš sdělit komunitě?"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
            style={ringStyle}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={posting || !title.trim() || !text.trim()}
              className="px-5 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: '#E84040' }}
            >
              {posting ? 'Odesílám…' : 'Zveřejnit'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              Zrušit
            </button>
          </div>
        </form>
      )}

      {/* Seznam příspěvků */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-3">💬</p>
          <p className="text-gray-500">Zatím žádné příspěvky.</p>
          <p className="text-gray-400 text-sm mt-1">Buď první, kdo zahájí diskuzi!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const replyCount = post.replies?.[0]?.count ?? 0
            const date = new Date(post.created_at).toLocaleDateString('cs-CZ', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
            return (
              <Link
                key={post.id}
                href={`/diskuze/${post.id}`}
                className="block bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <h2 className="font-semibold text-gray-900 mb-1">{post.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.text}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>👤 {post.users?.full_name} · {date}</span>
                  <span>💬 {replyCount} {replyCount === 1 ? 'odpověď' : replyCount < 5 ? 'odpovědi' : 'odpovědí'}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
