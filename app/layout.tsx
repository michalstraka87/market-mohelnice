export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/ToastProvider'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Market Mohelnice — Místní market Mohelnice a okolí',
  description: 'Komunitní marketplace pro Mohelnici a okolí. Nabídni nebo najdi věci, služby a zboží od sousedů.',
  keywords: 'mohelnice, bazar, marketplace, prodej, koupě, výměna',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 py-6 mt-12">
            <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500 space-y-2">
              <div className="flex justify-center gap-6">
                <a href="/" className="hover:text-gray-700 transition-colors">Marketplace</a>
                <a href="/o-nas" className="hover:text-gray-700 transition-colors">O nás</a>
              </div>
              <p>© 2025 Market Mohelnice — <a href="/o-nas" className="hover:text-gray-700 transition-colors">Komunitní</a> bazar pro Mohelnici a okolí</p>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  )
}
