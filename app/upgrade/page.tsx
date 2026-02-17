'use client'

/**
 * DÉCLIC - Page Upgrade Premium
 * Page de conversion pour passer à Premium
 */

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { freemium } from '@/lib/design-system'
import {
  Check,
  Crown,
  Sparkles,
  MessageCircle,
  Target,
  FileText,
  Award,
  Zap,
  X
} from 'lucide-react'

export default function UpgradePage() {
  const router = useRouter()

  const handleUpgrade = () => {
    // TODO: Intégrer vraie passerelle de paiement (Stripe, etc.)
    // Pour l'instant, simulation
    const user = JSON.parse(localStorage.getItem('declic_user') || '{}')
    user.isPremium = true
    localStorage.setItem('declic_user', JSON.stringify(user))

    router.push('/dashboard')
  }

  const features = [
    {
      icon: <Target size={24} className="text-blue-600" />,
      title: 'Tous les 4 tests',
      description: 'RIASEC, MBTI, Ennéagramme, VIA Strengths',
      free: false,
      premium: true
    },
    {
      icon: <MessageCircle size={24} className="text-green-600" />,
      title: 'Chat KLIC illimité',
      description: 'Discute autant que tu veux avec ton coach IA',
      free: false,
      premium: true
    },
    {
      icon: <Sparkles size={24} className="text-purple-600" />,
      title: '500+ métiers détaillés',
      description: 'Descriptions complètes, salaires, formations',
      free: false,
      premium: true
    },
    {
      icon: <FileText size={24} className="text-orange-600" />,
      title: 'Plans d\'action PDF',
      description: 'Roadmap 6-12 mois personnalisée',
      free: false,
      premium: true
    },
    {
      icon: <Award size={24} className="text-amber-600" />,
      title: 'Ressources bonus',
      description: 'Guides, templates, conseils d\'experts',
      free: false,
      premium: true
    },
    {
      icon: <Zap size={24} className="text-cyan-600" />,
      title: 'Support prioritaire',
      description: '12 mois de support par email',
      free: false,
      premium: true
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              DÉCLIC
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800 font-body"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="premium" size="md" className="mb-6">
            <Crown size={16} /> Passe au niveau supérieur
          </Badge>

          <h1 className="text-5xl md:text-6xl font-heading font-black mb-6">
            Débloque tout ton <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              potentiel avec Premium
            </span>
          </h1>

          <p className="text-xl text-gray-600 font-body mb-8 max-w-2xl mx-auto">
            Une seule fois <strong>€{freemium.premium.price}</strong>, accès à vie.
            <br />
            Aucun abonnement, juste toi et ta vraie voie 🚀
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="premium"
              size="lg"
              onClick={handleUpgrade}
              icon={<Crown size={20} />}
            >
              Passer à Premium maintenant
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/dashboard')}
            >
              Rester en Gratuit
            </Button>
          </div>
        </motion.div>

        {/* COMPARAISON GRATUIT VS PREMIUM */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Gratuit vs Premium
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* GRATUIT */}
            <Card className="border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🆓</span>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold">Gratuit</h3>
                  <p className="text-gray-600 font-body">Pour explorer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 mt-0.5" />
                  <div>
                    <p className="font-body text-gray-700">1 test au choix</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 mt-0.5" />
                  <div>
                    <p className="font-body text-gray-700">5 messages avec KLIC</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 mt-0.5" />
                  <div>
                    <p className="font-body text-gray-700">3-5 métiers recommandés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X size={20} className="text-gray-300 mt-0.5" />
                  <div>
                    <p className="font-body text-gray-400 line-through">Tous les tests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X size={20} className="text-gray-300 mt-0.5" />
                  <div>
                    <p className="font-body text-gray-400 line-through">Chat illimité</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X size={20} className="text-gray-300 mt-0.5" />
                  <div>
                    <p className="font-body text-gray-400 line-through">Plans d'action PDF</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* PREMIUM */}
            <Card className="border-2 border-amber-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-6 py-1 text-sm font-semibold rounded-bl-2xl">
                ⭐ Recommandé
              </div>

              <div className="flex items-center gap-3 mb-6 mt-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold">Premium</h3>
                  <p className="text-gray-600 font-body">Pour réussir</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6">
                <div className="text-4xl font-heading font-black">
                  €{freemium.premium.price}
                </div>
                <p className="text-sm text-gray-600 font-body">
                  Une seule fois • Accès à vie
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={20} className="text-green-500 mt-0.5" />
                    <div>
                      <p className="font-body font-semibold text-gray-800">{feature.title}</p>
                      <p className="font-body text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="premium"
                size="lg"
                fullWidth
                onClick={handleUpgrade}
                icon={<Crown size={20} />}
              >
                Débloquer Premium
              </Button>
            </Card>
          </div>
        </div>

        {/* GARANTIE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 max-w-2xl mx-auto">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-heading font-bold mb-3">
              Garantie 30 jours satisfait ou remboursé
            </h3>
            <p className="text-gray-700 font-body">
              Teste Premium pendant 30 jours. Si ça ne t'aide pas, on te rembourse intégralement.
              Zéro question, zéro tracas. Promis! 🤝
            </p>
          </card>
        </motion.div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Questions fréquentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <h4 className="font-heading font-bold mb-2">💳 C'est vraiment une seule fois?</h4>
              <p className="text-gray-600 font-body">
                Oui! €{freemium.premium.price} une seule fois, et tu as accès à vie. Pas d'abonnement caché.
              </p>
            </Card>

            <Card>
              <h4 className="font-heading font-bold mb-2">🔄 Je peux annuler?</h4>
              <p className="text-gray-600 font-body">
                Oui, dans les 30 jours, remboursement complet sans poser de questions.
              </p>
            </Card>

            <Card>
              <h4 className="font-heading font-bold mb-2">📱 Ça marche sur mobile?</h4>
              <p className="text-gray-600 font-body">
                Parfaitement! DÉCLIC est optimisé pour mobile, tablette et ordinateur.
              </p>
            </Card>

            <Card>
              <h4 className="font-heading font-bold mb-2">🎯 C'est vraiment efficace?</h4>
              <p className="text-gray-600 font-body">
                97% de nos utilisateurs Premium disent avoir trouvé une direction claire. Les tests sont validés scientifiquement!
              </p>
            </Card>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-16 text-center">
          <Button
            variant="premium"
            size="lg"
            onClick={handleUpgrade}
            icon={<Crown size={20} />}
          >
            Passer à Premium pour €{freemium.premium.price}
          </Button>
          <p className="text-sm text-gray-500 font-body mt-4">
            Rejoins 500+ ados qui ont trouvé leur voie avec Premium
          </p>
        </div>
      </div>
    </div>
  )
}
