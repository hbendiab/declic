'use client'

/**
 * DÉCLIC - Dashboard Principal
 * Hub central avec KLIC, tests, et recommandations
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { availableTests, freemium, klicPersonality } from '@/lib/design-system'
import {
  MessageCircle,
  Target,
  TrendingUp,
  Award,
  LogOut,
  Crown,
  Send,
  Sparkles,
  Lock,
  CheckCircle2
} from 'lucide-react'

interface User {
  name: string
  email: string
  isPremium: boolean
  testsCompleted: string[]
  messagesUsed: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isKlicTyping, setIsKlicTyping] = useState(false)

  // Charger l'utilisateur
  useEffect(() => {
    const userData = localStorage.getItem('declic_user')
    if (userData) {
      setUser(JSON.parse(userData))
      // Message de bienvenue KLIC
      const greeting = klicPersonality.greetings[Math.floor(Math.random() * klicPersonality.greetings.length)]
      setChatMessages([{
        type: 'klic',
        text: `${greeting}\n\nJe suis là pour t'aider à trouver ta vraie voie, sans prise de tête!\n\nOn commence par quoi? Tu veux faire les tests ou juste chatter? 😊`,
        timestamp: new Date()
      }])
    } else {
      router.push('/signup')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('declic_user')
    router.push('/')
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return

    // Vérifier limite gratuite
    if (!user.isPremium && user.messagesUsed >= freemium.free.chatMessages) {
      setChatMessages([...chatMessages, {
        type: 'system',
        text: '⚠️ Tu as utilisé tes 5 messages gratuits! Passe à Premium pour discuter sans limite avec KLIC.',
        timestamp: new Date()
      }])
      return
    }

    // Ajouter message utilisateur
    const newMessages = [...chatMessages, {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    }]
    setChatMessages(newMessages)
    setInputMessage('')

    // Mettre à jour compteur
    const updatedUser = { ...user, messagesUsed: user.messagesUsed + 1 }
    setUser(updatedUser)
    localStorage.setItem('declic_user', JSON.stringify(updatedUser))

    // Simuler KLIC qui tape
    setIsKlicTyping(true)

    // TODO: Intégrer vraie API Claude
    // Pour l'instant, réponses simulées
    await new Promise(resolve => setTimeout(resolve, 2000))

    const klicResponse = getKlicResponse(inputMessage)

    setChatMessages([...newMessages, {
      type: 'klic',
      text: klicResponse,
      timestamp: new Date()
    }])
    setIsKlicTyping(false)
  }

  // Réponses KLIC simulées (à remplacer par vraie API)
  const getKlicResponse = (message: string): string => {
    const msg = message.toLowerCase()

    if (msg.includes('test') || msg.includes('commencer')) {
      return "Cool! 🎯 On a 4 tests dispo:\n\n1. RIASEC - Tes intérêts pro\n2. MBTI - Ta personnalité\n3. Ennéagramme - Tes motivations\n4. VIA Strengths - Tes forces\n\nLequel t'attire le plus?"
    }

    if (msg.includes('riasec')) {
      return "Excellent choix! Le RIASEC c'est top pour comprendre ce qui te passionne vraiment.\n\n18 questions, 5-7 min max.\n\nTu veux qu'on le fasse maintenant? 🎯"
    }

    if (msg.includes('mbti')) {
      return "Le MBTI, un classique! 🧠 Ça va te donner ton type de personnalité parmi 16.\n\n16 questions rapides.\n\nC'est parti? 💪"
    }

    if (msg.includes('métier') || msg.includes('job')) {
      return "Ah ouais, on est là pour ça! 🚀\n\nPour te recommander des métiers qui te matchent vraiment, j'ai besoin que tu passes au moins 1-2 tests.\n\nÇa te va?"
    }

    if (msg.includes('premium') || msg.includes('payant')) {
      return `En version gratuite, t'as:\n✓ 1 test\n✓ 5 messages (celui-ci inclus)\n✓ 3-5 métiers\n\nEn Premium (€${freemium.premium.price}):\n✓ 4 tests complets\n✓ Chat illimité avec moi\n✓ 500+ métiers\n✓ Plans d'action PDF\n\nÇa vaut le coup si tu veux vraiment bosser ton orientation! 💪`
    }

    // Réponse générique
    const genericResponses = [
      "Intéressant! Dis-m'en plus 🤔",
      "Je vois ce que tu veux dire. Et qu'est-ce qui t'attire dans ça?",
      "Cool! Tu as des idées de métiers qui te branchent?",
      "Franchement, c'est une bonne question. Tu veux qu'on explore ça ensemble?"
    ]

    return genericResponses[Math.floor(Math.random() * genericResponses.length)]
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  const testsRemaining = user.isPremium ? freemium.premium.tests : freemium.free.tests - user.testsCompleted.length
  const messagesRemaining = user.isPremium ? '∞' : freemium.free.chatMessages - user.messagesUsed

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                DÉCLIC
              </h1>
              <Badge variant={user.isPremium ? 'premium' : 'primary'}>
                {user.isPremium ? <><Crown size={14} /> Premium</> : 'Gratuit'}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-body text-gray-600">
                Hey <strong>{user.name}</strong>! 👋
              </span>
              {!user.isPremium && (
                <Button
                  variant="premium"
                  size="sm"
                  onClick={() => router.push('/upgrade')}
                  icon={<Crown size={16} />}
                >
                  Passer Premium
                </Button>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* COLONNE PRINCIPALE */}
          <div className="lg:col-span-2 space-y-8">

            {/* Section Bienvenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-heading font-bold mb-2">
                Salut {user.name}! 🚀
              </h2>
              <p className="text-gray-600 font-body">
                Prêt à trouver ta voie? Commence par un test ou chatte avec KLIC!
              </p>
            </motion.div>

            {/* Tests disponibles */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-heading font-bold flex items-center gap-2">
                  <Target className="text-blue-600" size={28} />
                  Tes Tests
                </h3>
                <Badge variant="secondary">
                  {testsRemaining} {testsRemaining > 1 ? 'restants' : 'restant'}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {availableTests.map((test) => {
                  const isCompleted = user.testsCompleted.includes(test.id)
                  const isLocked = !user.isPremium && user.testsCompleted.length >= freemium.free.tests && !isCompleted

                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card
                        hover={!isLocked}
                        className={`relative ${isLocked ? 'opacity-60' : ''}`}
                        onClick={() => !isLocked && router.push(`/tests/${test.id}`)}
                      >
                        {isLocked && (
                          <div className="absolute top-4 right-4">
                            <Lock size={20} className="text-amber-500" />
                          </div>
                        )}

                        {isCompleted && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle2 size={20} className="text-green-500" />
                          </div>
                        )}

                        <div className="text-4xl mb-3">{test.icon}</div>
                        <h4 className="text-xl font-heading font-bold mb-1">{test.name}</h4>
                        <p className="text-sm text-gray-500 mb-2 font-body">{test.subtitle}</p>
                        <p className="text-gray-700 mb-4 font-body text-sm">{test.description}</p>

                        <div className="flex gap-2">
                          <Badge variant="primary" size="sm">{test.questions} Q</Badge>
                          <Badge variant="secondary" size="sm">{test.duration}</Badge>
                        </div>

                        {isLocked && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-amber-600 font-semibold font-body">
                              🔒 Premium requis
                            </p>
                          </div>
                        )}

                        {isCompleted && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-green-600 font-semibold font-body">
                              ✅ Terminé
                            </p>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Recommandations métiers */}
            {user.testsCompleted.length > 0 && (
              <div>
                <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="text-orange-500" size={28} />
                  Métiers pour toi
                </h3>

                <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200">
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎯</div>
                    <h4 className="text-xl font-heading font-bold mb-2">
                      Tes recommandations arrivent!
                    </h4>
                    <p className="text-gray-600 font-body mb-6">
                      Basées sur tes {user.testsCompleted.length} test{user.testsCompleted.length > 1 ? 's' : ''} complété{user.testsCompleted.length > 1 ? 's' : ''}
                    </p>
                    <Button
                      variant="premium"
                      onClick={() => router.push('/recommendations')}
                    >
                      Voir mes métiers
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* SIDEBAR - KLIC CHAT */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg">KLIC</h3>
                    <p className="text-sm opacity-90 font-body">Ton coach IA</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 mb-4">
                  <p className="text-sm font-body">
                    {!user.isPremium && (
                      <span className="block mb-2">
                        💬 Messages: <strong>{messagesRemaining} restants</strong>
                      </span>
                    )}
                    {user.isPremium && (
                      <span className="block mb-2">💬 Messages illimités ∞</span>
                    )}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowChat(!showChat)}
                  className="bg-white text-blue-600"
                >
                  {showChat ? 'Masquer le chat' : 'Chatter avec KLIC'}
                </Button>
              </Card>

              {/* Chat Interface */}
              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="h-[500px] flex flex-col">
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`${
                              msg.type === 'user' ? 'text-right' : 'text-left'
                            }`}
                          >
                            {msg.type === 'klic' && (
                              <div className="flex items-start gap-2 mb-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs">
                                  K
                                </div>
                                <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-none p-3">
                                  <p className="text-sm font-body whitespace-pre-line">{msg.text}</p>
                                </div>
                              </div>
                            )}

                            {msg.type === 'user' && (
                              <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl rounded-tr-none p-3">
                                <p className="text-sm font-body">{msg.text}</p>
                              </div>
                            )}

                            {msg.type === 'system' && (
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                <p className="text-sm font-body text-amber-800">{msg.text}</p>
                              </div>
                            )}
                          </div>
                        ))}

                        {isKlicTyping && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs">
                              K
                            </div>
                            <div className="bg-gray-100 rounded-2xl p-3">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Écris à KLIC..."
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none font-body text-sm"
                          disabled={!user.isPremium && user.messagesUsed >= freemium.free.chatMessages}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || (!user.isPremium && user.messagesUsed >= freemium.free.chatMessages)}
                          className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition disabled:opacity-50"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
