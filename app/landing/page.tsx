'use client'

/**
 * DÉCLIC - Landing Page
 * Page d'accueil moderne pour ados (14-19 ans)
 */

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { availableTests, freemium } from '@/lib/design-system'
import {
  Sparkles,
  Target,
  MessageCircle,
  TrendingUp,
  Check,
  Star,
  Zap,
  Users,
  Award,
  Heart
} from 'lucide-react'

// Lazy loading du Canvas 3D (client-side only)
const AvatarCanvas = dynamic(
  () => import('@/components/three/AvatarCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-6xl animate-bounce">💬</div>
      </div>
    )
  }
)

export default function LandingPage() {
  const router = useRouter()
  const [showPricing, setShowPricing] = useState(false)

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            {/* Badge "Nouveau" */}
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Badge variant="premium" size="md">
                <Sparkles size={14} /> Nouveau • Gratuit pour commencer
              </Badge>
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-7xl font-heading font-black mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
            >
              DÉCLIC
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-body font-bold text-gray-800 mb-4"
            >
              Trouve ta <span className="text-orange-500">vraie voie</span>
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-body"
            >
              4 tests scientifiques + 500 métiers + KLIC ton coach IA perso.<br />
              <span className="font-semibold text-blue-600">15-60 min pour clarifier ton avenir 🚀</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/signup')}
                icon={<Zap size={20} />}
              >
                Commencer gratuitement
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowPricing(!showPricing)}
              >
                Voir les tarifs
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 flex items-center justify-center gap-6 text-gray-600"
            >
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="text-sm">500+ ados</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm">4.9/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={20} className="fill-red-400 text-red-400" />
                <span className="text-sm">97% satisfaits</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-heading font-bold text-center mb-4"
            >
              Comment ça marche?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-center text-gray-600 mb-16 font-body"
            >
              3 étapes simples pour trouver ta voie
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div variants={fadeInUp}>
                <Card hover gradient>
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-2xl font-heading font-bold mb-3">1. Passe les tests</h3>
                  <p className="text-gray-600 font-body">
                    4 tests validés scientifiquement (RIASEC, MBTI, Ennéagramme, VIA).
                    Gratuit: 1 test. Premium: tous les tests.
                  </p>
                </Card>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={fadeInUp}>
                <Card hover gradient>
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-2xl font-heading font-bold mb-3">2. Chatte avec KLIC</h3>
                  <p className="text-gray-600 font-body">
                    Ton coach IA perso qui te comprend vraiment.
                    Gratuit: 5 messages. Premium: illimité.
                  </p>
                </Card>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={fadeInUp}>
                <Card hover gradient>
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="text-2xl font-heading font-bold mb-3">3. Explore & Agis</h3>
                  <p className="text-gray-600 font-body">
                    Découvre des métiers qui te matchent + plans d'action personnalisés (Premium).
                  </p>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTS SECTION */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-heading font-bold text-center mb-4"
            >
              4 Tests pour te comprendre
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-center text-gray-600 mb-16 font-body"
            >
              Des tests validés scientifiquement, pas des quiz TikTok 😉
            </motion.p>

            <div className="grid md:grid-cols-2 gap-6">
              {availableTests.map((test, index) => (
                <motion.div key={test.id} variants={fadeInUp}>
                  <Card hover className="border-2 border-transparent hover:border-blue-400">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{test.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-heading font-bold mb-1">{test.name}</h3>
                        <p className="text-sm text-gray-500 mb-2 font-body">{test.subtitle}</p>
                        <p className="text-gray-700 mb-4 font-body">{test.description}</p>
                        <div className="flex gap-3">
                          <Badge variant="primary" size="sm">
                            {test.questions} questions
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            {test.duration}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING SECTION */}
      {showPricing && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 px-6 bg-white"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-heading font-bold text-center mb-4">
              Choisis ton plan
            </h2>
            <p className="text-center text-gray-600 mb-16 font-body">
              Commence gratuitement, passe à Premium quand tu veux
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Plan Gratuit */}
              <Card className="border-2 border-gray-200">
                <h3 className="text-2xl font-heading font-bold mb-2">Gratuit</h3>
                <div className="text-4xl font-bold mb-6">
                  €0<span className="text-lg text-gray-500">/toujours</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    1 test au choix
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    5 messages avec KLIC
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    3-5 métiers recommandés
                  </li>
                </ul>
                <Button variant="outline" fullWidth onClick={() => router.push('/signup')}>
                  Commencer gratuitement
                </Button>
              </Card>

              {/* Plan Premium */}
              <Card className="border-2 border-orange-500 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="premium">⭐ Populaire</Badge>
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-6">
                  €{freemium.premium.price}<span className="text-lg text-gray-500">/une fois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    <strong>Tous les 4 tests</strong>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    <strong>Chat KLIC illimité</strong>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    500+ métiers détaillés
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    Plans d'action PDF
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    Ressources bonus
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-body">
                    <Check size={20} className="text-green-500" />
                    Support 12 mois
                  </li>
                </ul>
                <Button variant="premium" fullWidth onClick={() => router.push('/signup')}>
                  Passer à Premium
                </Button>
              </Card>
            </div>
          </div>
        </motion.section>
      )}

      {/* KLIC SECTION */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <motion.div variants={fadeInUp} className="flex-1">
              <Badge variant="premium" size="md" className="mb-4">
                <MessageCircle size={14} /> Ton coach IA
              </Badge>
              <h2 className="text-5xl font-heading font-bold mb-6">
                Rencontre KLIC 👋
              </h2>
              <p className="text-xl text-gray-700 mb-6 font-body leading-relaxed">
                KLIC c'est pas un bot lambda. C'est ton <strong>pote virtuel</strong> qui te comprend,
                te pose les bonnes questions et t'aide à y voir plus clair.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Heart size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">Bienveillant</h4>
                    <p className="text-gray-600 font-body">Zéro jugement, 100% support</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Sparkles size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">Intelligent</h4>
                    <p className="text-gray-600 font-body">Comprend tes réponses et s'adapte</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">Actionnable</h4>
                    <p className="text-gray-600 font-body">Te donne des vrais plans concrets</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex-1">
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white p-4 md:p-8 relative overflow-hidden">
                {/* 3D Avatar Container */}
                <div className="relative h-72 md:h-96 -mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-4">
                  <AvatarCanvas />

                  {/* Click hint overlay */}
                  <motion.div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Clique sur moi! 👋
                  </motion.div>
                </div>

                {/* Texte KLIC conservé */}
                <p className="text-lg mb-4 font-body italic">
                  "Hey! Moi c'est KLIC 👋<br /><br />
                  Je suis là pour t'aider à trouver ta vraie voie, sans prise de tête!<br /><br />
                  On commence par quoi? Tu veux faire les tests ou juste chatter?"
                </p>
                <div className="flex items-center gap-3 text-sm opacity-90">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    K
                  </div>
                  <span className="font-body">KLIC • Ton coach IA</span>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-heading font-bold mb-6">
              Prêt à trouver ta voie? 🚀
            </h2>
            <p className="text-xl mb-8 font-body opacity-90">
              Rejoins 500+ ados qui ont déjà trouvé leur DÉCLIC
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/signup')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Commencer maintenant
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowPricing(!showPricing)}
                className="border-white text-white hover:bg-white/10"
              >
                Voir les options
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-heading font-bold text-xl mb-4">DÉCLIC</h3>
              <p className="text-sm font-body">Trouve ta vraie voie</p>
            </div>
            <div>
              <h4 className="text-white font-heading font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm font-body">
                <li><a href="#" className="hover:text-white">Tests</a></li>
                <li><a href="#" className="hover:text-white">KLIC</a></li>
                <li><a href="#" className="hover:text-white">Métiers</a></li>
                <li><a href="#" className="hover:text-white">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-heading font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm font-body">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-heading font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm font-body">
                <li><a href="#" className="hover:text-white">CGU</a></li>
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm font-body">
            <p>© 2024 DÉCLIC. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
