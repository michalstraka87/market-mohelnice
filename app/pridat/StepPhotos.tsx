'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import type { WizardData } from './page'

interface Props {
  data: WizardData
  update: (partial: Partial<WizardData>) => void
}

export default function StepPhotos({ data, update }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const MAX_PHOTOS = 8

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files)
    const allowed = arr.filter(f => {
      if (!f.type.startsWith('image/')) return false
      if (f.size > MAX_FILE_SIZE) {
        alert(`Soubor "${f.name}" je příliš velký. Maximální velikost je 10 MB.`)
        return false
      }
      return true
    })
    const remaining = MAX_PHOTOS - data.photoFiles.length
    const toAdd = allowed.slice(0, remaining)

    if (toAdd.length === 0) return

    const newUrls = toAdd.map(f => URL.createObjectURL(f))
    update({
      photoFiles: [...data.photoFiles, ...toAdd],
      photoUrls:  [...data.photoUrls, ...newUrls],
    })
  }, [data.photoFiles, data.photoUrls, update])

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(data.photoUrls[index])
    update({
      photoFiles: data.photoFiles.filter((_, i) => i !== index),
      photoUrls:  data.photoUrls.filter((_, i) => i !== index),
    })
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Fotografie</h2>
      <p className="text-sm text-gray-400 mb-5">
        Přidej až {MAX_PHOTOS} fotek. Přetáhni soubory nebo klikni pro výběr.
      </p>

      {/* Drop zóna */}
      {data.photoFiles.length < MAX_PHOTOS && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-150
            ${dragOver
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <div className="text-4xl mb-3">📸</div>
          <p className="text-sm font-medium text-gray-700">
            Přetáhni fotky sem nebo <span style={{ color: '#E84040' }}>klikni pro výběr</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, WEBP · max 10 MB na soubor · zbývá {MAX_PHOTOS - data.photoFiles.length} míst
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => e.target.files && addFiles(e.target.files)}
          />
        </div>
      )}

      {/* Náhled fotek */}
      {data.photoUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {data.photoUrls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
              <Image
                src={url}
                alt={`Foto ${i + 1}`}
                fill
                sizes="128px"
                className="object-cover"
              />
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  Hlavní
                </div>
              )}
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6
                           flex items-center justify-center text-xs opacity-0 group-hover:opacity-100
                           transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {data.photoFiles.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          ℹ️ Inzeráty s fotkami se prodávají 3× rychleji
        </p>
      )}
    </div>
  )
}
