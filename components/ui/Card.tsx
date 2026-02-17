/**
 * Composant Card - Cartes réutilisables pour DÉCLIC
 */

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  hover?: boolean
  gradient?: boolean
  className?: string
  onClick?: () => void
}

export default function Card({
  children,
  hover = false,
  gradient = false,
  className = '',
  onClick,
}: CardProps) {

  const baseClasses = 'rounded-2xl p-6 transition-all duration-300'
  const hoverClasses = hover ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' : ''
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-blue-50' : 'bg-white'
  const shadowClasses = 'shadow-lg'

  const allClasses = `${baseClasses} ${hoverClasses} ${gradientClasses} ${shadowClasses} ${className}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={allClasses}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
