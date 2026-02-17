'use client'

/**
 * DÉCLIC - Test RIASEC Interactif
 * Test d'intérêts professionnels (Holland Code)
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { riasecQuestions, calculateRIASEC, riasecDescriptions } from '@/lib/personality-tests'
import { ArrowLeft, ArrowRight, CheckCircle2, Target } from 'lucide-react'

export default function RiasecTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const totalQuestions = riasecQuestions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const handleAnswer = (rating: number) => {
    const newAnswers = {
      ...answers,
      [riasecQuestions[currentQuestion].id]: rating
    }
    setAnswers(newAnswers)

    // Si dernière question, calculer résultat
    if (currentQuestion === totalQuestions - 1) {
      const riasecCode = calculateRIASEC(newAnswers)
      setResult(riasecCode)
      setIsComplete(true)

      // Sauvegarder dans user
      const user = JSON.parse(localStorage.getItem('declic_user') || '{}')
      if (!user.testsCompleted) user.testsCompleted = []
      if (!user.testsCompleted.includes('riasec')) {
        user.testsCompleted.push('riasec')
      }
      user.riasec_result = riasecCode
      localStorage.setItem('declic_user', JSON.stringify(user))
    } else {
      // Question suivante
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const currentQ = riasecQuestions[currentQuestion]

  if (isComplete && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center">
              <div className="text-7xl mb-6">🎉</div>
              <h1 className="text-4xl font-heading font-bold mb-4">
                Test RIASEC terminé!
              </h1>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-6">
                <h2 className="text-3xl font-heading font-black mb-4">
                  Ton code: <span className="text-blue-600">{result}</span>
                </h2>

                <div className="space-y-3 text-left">
                  {result.split('').map((letter, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4">
                      <div className="text-3xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                      <div>
                        <h3 className="font-heading font-bold text-lg">
                          {letter} - {riasecDescriptions[letter]?.split(' - ')[0]}
                        </h3>
                        <p className="text-gray-600 font-body text-sm">
                          {riasecDescriptions[letter]?.split(' - ')[1]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/recommendations')}
                  icon={<Target size={20} />}
                >
                  Voir mes recommandations métiers
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/dashboard')}
                >
                  Retour au dashboard
                </Button>
              </div>
            </Card>

            {/* Explication RIASEC */}
            <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <h3 className="text-2xl font-heading font-bold mb-4">
                C'est quoi le code RIASEC?
              </h3>
              <div className="space-y-3 font-body text-gray-700">
                <p>
                  Le <strong>code RIASEC</strong> (aussi appelé Holland Code) est un modèle de 6 types d'intérêts professionnels:
                </p>
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-bold">R - Réaliste</h4>
                    <p className="text-sm text-gray-600">Pratique, technique, manuel</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-bold">I - Investigateur</h4>
                    <p className="text-sm text-gray-600">Analytique, scientifique</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-bold">A - Artistique</h4>
                    <p className="text-sm text-gray-600">Créatif, expressif</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-bold">S - Social</h4>
                    <p className="text-sm text-gray-600">Empathique, aidant</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-bold">E - Entreprenant</h4>
                    <p className="text-sm text-gray-600">Leader, persuasif</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-bold">C - Conventionnel</h4>
                    <p className="text-sm text-gray-600">Organisé, méthodique</p>
                  </div>
                </div>
                <p className="mt-4">
                  Ton code <strong>{result}</strong> indique que tu as une forte affinité pour ces 3 types, dans cet ordre.
                  On va utiliser ça pour te recommander des métiers qui te matchent! 🎯
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-body mb-6"
          >
            <ArrowLeft size={20} />
            Retour
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-1">
                Test RIASEC 🎯
              </h1>
              <p className="text-gray-600 font-body">
                Découvre tes intérêts professionnels
              </p>
            </div>
            <Badge variant="primary">
              {currentQuestion + 1} / {totalQuestions}
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <h2 className="text-2xl font-heading font-bold mb-6">
                {currentQ.question}
              </h2>

              <p className="text-gray-600 font-body mb-6">
                Sur une échelle de 1 à 5, à quel point cette activité t'intéresse?
              </p>

              {/* Rating buttons */}
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(rating)}
                    className={`
                      p-4 rounded-xl border-2 font-heading font-bold text-lg
                      transition-all duration-200
                      ${answers[currentQ.id] === rating
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">
                      {rating === 1 ? '😐' : rating === 2 ? '🙂' : rating === 3 ? '😊' : rating === 4 ? '😄' : '🤩'}
                    </div>
                    {rating}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-500 font-body mt-3">
                <span>Pas du tout</span>
                <span>Très intéressé</span>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            icon={<ArrowLeft size={20} />}
          >
            Précédent
          </Button>

          <div className="flex-1" />

          {answers[currentQ.id] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                variant="primary"
                onClick={() => handleAnswer(answers[currentQ.id])}
                icon={currentQuestion === totalQuestions - 1 ? <CheckCircle2 size={20} /> : <ArrowRight size={20} />}
              >
                {currentQuestion === totalQuestions - 1 ? 'Terminer' : 'Suivant'}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div>
              <h4 className="font-heading font-bold mb-1">Astuce</h4>
              <p className="text-sm font-body text-gray-700">
                Réponds selon ce qui t'attire vraiment, pas ce que tu penses être "bien" ou ce que les autres attendent de toi.
                Sois honnête! 😊
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
