'use client'

/**
 * DÉCLIC - Page principale
 * Redirige vers la landing page
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/landing')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-black mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent animate-pulse">
          DÉCLIC
        </h1>
        <p className="text-gray-600 font-body">Chargement...</p>
      </div>
    </div>
  )
}
