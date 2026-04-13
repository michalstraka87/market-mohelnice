'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname              = usePathname()
  const [user, setUser]       = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const { data: profile } = await (supabase as any)
          .from('users').select('is_admin').eq('id', u.id).single()
        setIsAdmin(profile?.is_admin ?? false)
      } else {
        setIsAdmin(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // Zavři menu při změně stránky
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl font-bold" style={{ color: '#E84040' }}>Market</span>
            <span className="text-xl font-light text-gray-600 hidden sm:inline">Mohelnice</span>
          </Link>

          {/* Střed: navigace — pouze desktop */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/o-nas" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              O nás
            </Link>
            <Link href="/diskuze" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Diskuze
            </Link>
          </div>

          {/* Akce — desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/pridat"
              className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-full transition-colors"
              style={{ backgroundColor: '#E84040' }}
            >
              <span className="text-base">+</span>
              <span>Přidat inzerát</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-medium px-3 py-2 rounded-full transition-colors" style={{ color: '#E84040' }}>
                    🛡️ Admin
                  </Link>
                )}
                <Link href="/profil" className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors">
                  Můj profil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-white px-4 py-2 rounded-full transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#E84040' }}
                >
                  Odhlásit
                </button>
              </div>
            ) : (
              <Link href="/prihlaseni" className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors">
                Přihlásit
              </Link>
            )}
          </div>

          {/* Mobilní — tlačítko + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/pridat"
              className="flex items-center gap-1 text-sm font-medium text-white px-3 py-2 rounded-full"
              style={{ backgroundColor: '#E84040' }}
            >
              <span>+</span>
              <span className="hidden xs:inline">Přidat</span>
            </Link>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Otevřít menu"
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`block h-0.5 bg-gray-600 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 bg-gray-600 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-gray-600 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobilní menu — dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-md">
          <Link href="/" className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            🏠 Mohelnice
          </Link>
          <Link href="/o-nas" className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            ℹ️ O nás
          </Link>
          <Link href="/diskuze" className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            💬 Diskuze
          </Link>

          <div className="border-t border-gray-100 my-2" />

          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="block px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors" style={{ color: '#E84040' }}>
                  🛡️ Administrace
                </Link>
              )}
              <Link href="/profil" className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                👤 Můj profil
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-center px-3 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#E84040' }}
              >
                Odhlásit se
              </button>
            </>
          ) : (
            <>
              <Link href="/prihlaseni" className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Přihlásit se
              </Link>
              <Link href="/registrace" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-white text-center" style={{ backgroundColor: '#E84040' }}>
                Zaregistrovat se
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
