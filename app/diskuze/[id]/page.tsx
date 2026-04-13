'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { PostWithUser, ReplyWithUser } from '@/lib/supabase/types'

export default function PostDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const supabase = createClient()
  const router   = useRouter()

  const [post, setPost]       = useState<PostWithUser | null>(null)
  const [replies, setReplies] = useState<ReplyWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser]       = useState<{ id: string } | null>(null)
  const [text, setText]       = useState('')
  const [posting, setPosting] = useState(false)

  const loadData = useCallback(async () => {
    const [{ data: postData }, { data: repliesData }] = await Promise.all([
      (supabase as any)
        .from('posts')
        .select('*, users(full_name, avatar_url), replies(count)')
        .eq('id', id)
        .single(),
      (supabase as any)
        .from('replies')
        .select('*, users(full_name, avatar_url)')
        .eq('post_id', id)
        .order('created_at', { ascending: true }),
    ])
    setPost(postData ?? null)
    setReplies(repliesData ?? [])
    setLoading(false)
  }, [id, supabase])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id } : null)
    })
    loadData()
    return () => subscription.unsubscribe()
  }, [loadData, supabase])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push(`/prihlaseni?redirect=/diskuze/${id}`); return }
    setPosting(true)
    const { error } = await (supabase as any)
      .from('replies')
      .insert({ post_id: id, user_id: user.id, text: text.trim() })
    if (!error) {
      setText('')
      await loadData()
    }
    setPosting(false)
  }

  const handleDeletePost = async () => {
    if (!confirm('Smazat příspěvek?')) return
    await (supabase as any).from('posts').delete().eq('id', id)
    router.push('/diskuze')
  }

  const handleDeleteReply = async (replyId: string) => {
    await (supabase as any).from('replies').delete().eq('id', replyId)
    setReplies(prev => prev.filter(r => r.id !== replyId))
  }

  const ringStyle = { '--tw-ring-color': '#E84040' } as React.CSSProperties

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Načítám…</div>
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Příspěvek nenalezen.</p>
        <Link href="/diskuze" className="text-sm mt-4 inline-block" style={{ color: '#E84040' }}>← Zpět na diskuzi</Link>
      </div>
    )
  }

  const postDate = new Date(post.created_at).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/diskuze" className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6 inline-block">
        ← Zpět na diskuzi
      </Link>

      {/* Příspěvek */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{post.title}</h1>
          {user?.id === post.user_id && (
            <button
              onClick={handleDeletePost}
              className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 transition-colors"
            >
              Smazat
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap mb-4">{post.text}</p>
        <div className="text-xs text-gray-400 border-t pt-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm">👤</div>
          <span>{post.users?.full_name}</span>
          <span>·</span>
          <span>{postDate}</span>
        </div>
      </div>

      {/* Odpovědi */}
      <h2 className="font-semibold text-gray-900 mb-3">
        Odpovědi ({replies.length})
      </h2>

      {replies.length > 0 && (
        <div className="space-y-3 mb-6">
          {replies.map(reply => {
            const replyDate = new Date(reply.created_at).toLocaleDateString('cs-CZ', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })
            return (
              <div key={reply.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">{reply.text}</p>
                <div className="text-xs text-gray-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">👤</div>
                    <span>{reply.users?.full_name}</span>
                    <span>·</span>
                    <span>{replyDate}</span>
                  </div>
                  {user?.id === reply.user_id && (
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      Smazat
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Formulář odpovědi */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-medium text-gray-900 mb-3">Přidat odpověď</h3>
        {user ? (
          <form onSubmit={handleReply} className="space-y-3">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              required
              maxLength={1000}
              rows={3}
              placeholder="Napiš odpověď…"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
              style={ringStyle}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{text.length}/1000</span>
              <button
                type="submit"
                disabled={posting || !text.trim()}
                className="px-5 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: '#E84040' }}
              >
                {posting ? 'Odesílám…' : 'Odpovědět'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-500">
            Pro přidání odpovědi se{' '}
            <Link href={`/prihlaseni?redirect=/diskuze/${id}`} className="font-medium" style={{ color: '#E84040' }}>
              přihlaš
            </Link>.
          </p>
        )}
      </div>
    </div>
  )
}
