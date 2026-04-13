'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/ToastProvider'
import StepPhotos from './StepPhotos'
import StepDetails from './StepDetails'
import StepPrice from './StepPrice'
import type { PriceType } from '@/lib/supabase/types'

export interface WizardData {
  // Krok 1
  photoFiles: File[]
  photoUrls: string[]  // preview URLs
  // Krok 2
  title: string
  description: string
  category: string
  // Krok 3
  priceType: PriceType
  priceAmount: string
  priceText: string
  transferLocation: string  // Město/místo
  locationLat: number  // GPS
  locationLng: number  // GPS
}

const INITIAL_DATA: WizardData = {
  photoFiles: [],
  photoUrls: [],
  title: '',
  description: '',
  category: '',
  priceType: 'free',
  priceAmount: '',
  priceText: '',
  transferLocation: '',
  locationLat: 49.7748,
  locationLng: 16.9198,
}

const STEPS = ['Fotografie', 'Popis', 'Cena']

export default function PridatPage() {
  const [step, setStep]       = useState(0)
  const [data, setData]       = useState<WizardData>(INITIAL_DATA)
  const [loading, setLoading] = useState(false)
  const router  = useRouter()
  const { showToast } = useToast()
  const supabase = createClient()

  const update = (partial: Partial<WizardData>) =>
    setData(prev => ({ ...prev, ...partial }))

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user ?? null
      if (!user) {
        router.push('/prihlaseni?redirect=/pridat')
        return
      }

      // Upload fotek do Storage
      const uploadedUrls: string[] = []
      for (const file of data.photoFiles) {
        const ext  = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('listings-photos')
          .upload(path, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('listings-photos')
          .getPublicUrl(path)

        uploadedUrls.push(publicUrl)
      }

      // Vytvoř inzerát
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: listing, error } = await (supabase as any)
        .from('listings')
        .insert({
          user_id:      user.id,
          title:        data.title,
          description:  data.description,
          category:     data.category,
          price_type:   data.priceType,
          price_amount: data.priceType === 'fixed' && data.priceAmount ? parseFloat(data.priceAmount) : null,
          price_text:   ['symbolic', 'negotiable'].includes(data.priceType) ? data.priceText || null : null,
          photos:       uploadedUrls,
          location_lat: data.locationLat,
          location_lng: data.locationLng,
          is_active:    true,
          is_sold:      false,
        })
        .select()
        .single() as { data: { id: string } | null; error: Error | null }

      if (error) throw error

      showToast('Inzerát byl úspěšně přidán! 🎉', 'success')
      router.push(`/inzerat/${listing!.id}`)

    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : JSON.stringify(err)
      showToast(`Chyba: ${msg}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Přidat inzerát</h1>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1
                  transition-all duration-300
                  ${i < step ? 'text-white' : i === step ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                style={i <= step ? { backgroundColor: '#E84040' } : {}}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${i === step ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%`, backgroundColor: '#E84040' }}
          />
        </div>
      </div>

      {/* Obsah kroku */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {step === 0 && <StepPhotos data={data} update={update} />}
        {step === 1 && <StepDetails data={data} update={update} />}
        {step === 2 && <StepPrice data={data} update={update} />}
      </div>

      {/* Navigace */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600
                     hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Zpět
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={
              (step === 0 && data.photoFiles.length === 0) ||
              (step === 1 && (!data.title || !data.description || !data.category))
            }
            className="px-6 py-2.5 rounded-xl text-white text-sm font-medium
                       disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: '#E84040' }}
          >
            Pokračovat →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-medium
                       disabled:opacity-60 transition-opacity"
            style={{ backgroundColor: '#E84040' }}
          >
            {loading ? 'Nahrávám...' : '✓ Zveřejnit inzerát'}
          </button>
        )}
      </div>
    </div>
  )
}
