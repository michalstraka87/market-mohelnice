'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PhotoGalleryProps {
  photos: string[]
  title: string
}

export default function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-6xl text-gray-300">📷</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Hlavní foto */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={photos[activeIndex]}
          alt={`${title} — foto ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-contain"
          priority
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(i => (i - 1 + photos.length) % photos.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm
                         rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setActiveIndex(i => (i + 1) % photos.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm
                         rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              ›
            </button>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {activeIndex + 1}/{photos.length}
            </div>
          </>
        )}
      </div>

      {/* Miniatury */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${i === activeIndex ? 'border-red-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-80'}`}
            >
              <Image
                src={photo}
                alt={`Miniatura ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
