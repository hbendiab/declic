'use client'

/**
 * Avatar Fallback Component
 * Composant de secours affiché si WebGL n'est pas supporté
 */

import { motion } from 'framer-motion'

export default function AvatarFallback() {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-400/30 to-cyan-300/30 rounded-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Emoji animé */}
        <motion.div
          className="text-7xl md:text-8xl mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut'
          }}
        >
          💬
        </motion.div>

        {/* Texte */}
        <p className="text-white font-body text-lg font-semibold px-6">
          Clique pour rencontrer KLIC!
        </p>

        <motion.p
          className="text-white/70 font-body text-sm mt-2 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Ton coach IA perso
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
