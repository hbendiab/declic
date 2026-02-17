'use client'

/**
 * DÉCLIC - Page d'inscription
 * Inscription légère et moderne
 */

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Authentification réelle
    // Pour l'instant, simulation
    localStorage.setItem('declic_user', JSON.stringify({
      name: formData.name,
      email: formData.email,
      isPremium: false,
      testsCompleted: [],
      messagesUsed: 0,
    }))

    router.push('/dashboard')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-5xl font-heading font-black mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
          >
            DÉCLIC
          </motion.h1>
          <p className="text-gray-600 font-body">Trouve ta vraie voie 🚀</p>
        </div>

        <Card>
          <h2 className="text-2xl font-heading font-bold mb-2">Créer ton compte</h2>
          <p className="text-gray-600 font-body mb-6">
            Commence gratuitement, aucune carte requise
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-body">
                Ton prénom
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Lucas"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-body"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-body">
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ton.email@exemple.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-body"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-body">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-body"
                  required
                />
              </div>
            </div>

            {/* Âge */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-body">
                Ton âge
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Ex: 16"
                min="14"
                max="19"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-body"
                required
              />
            </div>

            {/* Submit */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={<ArrowRight size={20} />}
            >
              Commencer gratuitement
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-body">
              Déjà un compte?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 text-center text-sm text-gray-500 font-body space-y-2">
          <p>✅ Gratuit pour commencer</p>
          <p>🔒 Tes données sont sécurisées</p>
          <p>💬 Support par email</p>
        </div>
      </motion.div>
    </div>
  )
}
