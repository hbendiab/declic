'use client'

/**
 * DÉCLIC - Page Recommandations Métiers
 * Recommandations basées sur les tests et RAG
 */

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { freemium } from '@/lib/design-system'
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  GraduationCap,
  ArrowRight,
  Lock,
  Crown,
  ExternalLink,
  Heart,
  Bookmark
} from 'lucide-react'

interface Job {
  title: string
  sector: string
  salary_min: number
  salary_max: number
  document: string
  url: string
  distance?: number
}

export default function RecommendationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Charger utilisateur
    const userData = localStorage.getItem('declic_user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Charger recommandations
      loadRecommendations(parsedUser)
    } else {
      router.push('/signup')
    }
  }, [router])

  const loadRecommendations = async (userData: any) => {
    try {
      setLoading(true)

      // Construire query basée sur les tests
      let query = ''

      if (userData.riasec_result) {
        const riasecMap: any = {
          'R': 'réaliste pratique technique',
          'I': 'investigateur analytique scientifique',
          'A': 'artistique créatif',
          'S': 'social empathique aide',
          'E': 'entreprenant leader commercial',
          'C': 'conventionnel organisé méthodique'
        }

        const codes = userData.riasec_result.split('')
        query = codes.map((c: string) => riasecMap[c] || '').join(' ')
      }

      if (userData.mbti_type) {
        query += ` ${userData.mbti_type}`
      }

      // Fallback query
      if (!query) {
        query = 'métiers variés intéressants'
      }

      // Limiter selon plan
      const nResults = userData.isPremium ? 25 : freemium.free.jobs

      // Appeler API de recherche
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, n_results: nResults })
      })

      const data = await response.json()

      if (data.success && data.results) {
        setJobs(data.results)
      } else {
        setError('Aucun métier trouvé')
      }
    } catch (err) {
      console.error('Error loading recommendations:', err)
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  const canViewAll = user.isPremium || jobs.length <= freemium.free.jobs
  const displayedJobs = canViewAll ? jobs : jobs.slice(0, freemium.free.jobs)
  const lockedJobsCount = jobs.length - displayedJobs.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              DÉCLIC
            </h1>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Métiers faits pour toi, {user.name}!
          </h1>
          <p className="text-xl text-gray-600 font-body">
            Basés sur tes {user.testsCompleted?.length || 0} test{(user.testsCompleted?.length || 0) > 1 ? 's' : ''} complété{(user.testsCompleted?.length || 0) > 1 ? 's' : ''}
          </p>

          {user.riasec_result && (
            <div className="mt-6 flex justify-center gap-2">
              <Badge variant="primary">RIASEC: {user.riasec_result}</Badge>
              {user.mbti_type && <Badge variant="secondary">MBTI: {user.mbti_type}</Badge>}
            </div>
          )}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-bounce">🔍</div>
            <p className="text-gray-600 font-body">Recherche des métiers parfaits pour toi...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="text-center bg-red-50 border-2 border-red-200">
            <p className="text-red-600 font-body">{error}</p>
            <Button variant="primary" onClick={() => loadRecommendations(user)} className="mt-4">
              Réessayer
            </Button>
          </Card>
        )}

        {/* Jobs */}
        {!loading && !error && displayedJobs.length > 0 && (
          <div className="space-y-8">

            {/* Stats */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg">
                      {displayedJobs.length} métiers recommandés
                    </h3>
                    <p className="text-sm text-gray-600 font-body">
                      Matchés avec ton profil unique
                    </p>
                  </div>
                </div>

                {!user.isPremium && lockedJobsCount > 0 && (
                  <Button
                    variant="premium"
                    size="sm"
                    onClick={() => router.push('/upgrade')}
                    icon={<Crown size={16} />}
                  >
                    Débloquer {lockedJobsCount} métiers
                  </Button>
                )}
              </div>
            </Card>

            {/* Jobs List */}
            <div className="grid gap-6">
              {displayedJobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="group">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Icon & Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-2xl font-heading font-bold mb-1 group-hover:text-blue-600 transition">
                              {job.title}
                            </h3>
                            <Badge variant="secondary">{job.sector}</Badge>
                          </div>
                          <button className="text-gray-400 hover:text-red-500 transition">
                            <Heart size={24} />
                          </button>
                        </div>

                        {/* Salary */}
                        <div className="flex items-center gap-2 text-green-600 mb-4">
                          <DollarSign size={20} />
                          <span className="font-semibold font-body">
                            {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} € /an
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 font-body mb-4 line-clamp-3">
                          {job.document.split('\n').find(line => line.startsWith('Description:'))?.replace('Description: ', '') || 'Description non disponible'}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="primary" size="sm">
                            #{index + 1} Match
                          </Badge>
                          {job.distance !== undefined && (
                            <Badge variant="success" size="sm">
                              {Math.round((1 - job.distance) * 100)}% compatible
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="md:w-48 flex flex-col gap-2">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button variant="primary" size="sm" fullWidth icon={<ExternalLink size={16} />}>
                            Fiche APEC
                          </Button>
                        </a>

                        {user.isPremium ? (
                          <Button variant="secondary" size="sm" fullWidth icon={<TrendingUp size={16} />}>
                            Plan d'action
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" fullWidth icon={<Lock size={16} />}>
                            Plan (Premium)
                          </Button>
                        )}

                        <Button variant="ghost" size="sm" fullWidth icon={<Bookmark size={16} />}>
                          Sauvegarder
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Locked Jobs Banner */}
            {!user.isPremium && lockedJobsCount > 0 && (
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-2xl font-heading font-bold mb-2">
                    {lockedJobsCount} autres métiers verrouillés
                  </h3>
                  <p className="text-gray-700 font-body mb-6">
                    Passe à Premium pour découvrir tous les métiers qui te correspondent!
                  </p>
                  <Button
                    variant="premium"
                    size="lg"
                    onClick={() => router.push('/upgrade')}
                    icon={<Crown size={20} />}
                  >
                    Débloquer pour €{freemium.premium.price}
                  </Button>
                </div>
              </Card>
            )}

            {/* CTA Next Steps */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <h3 className="text-2xl font-heading font-bold mb-4">
                Prochaines étapes 🚀
              </h3>
              <div className="space-y-3">
                {user.testsCompleted.length < 4 && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-semibold">Passe d'autres tests</p>
                      <p className="text-sm text-gray-600 font-body">Plus de tests = recommandations plus précises</p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => router.push('/dashboard')}>
                      Faire
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-body font-semibold">Chatte avec KLIC</p>
                    <p className="text-sm text-gray-600 font-body">Pose tes questions sur ces métiers</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>
                    Chatter
                  </Button>
                </div>

                {user.isPremium && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-semibold">Télécharge ton plan d'action</p>
                      <p className="text-sm text-gray-600 font-body">Roadmap 6-12 mois pour chaque métier</p>
                    </div>
                    <Button variant="premium" size="sm">
                      PDF
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {!loading && !error && displayedJobs.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-heading font-bold mb-2">
              Aucun métier trouvé
            </h3>
            <p className="text-gray-600 font-body mb-6">
              Complète au moins un test pour avoir des recommandations!
            </p>
            <Button variant="primary" onClick={() => router.push('/dashboard')}>
              Faire un test
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
