/**
 * Composant Badge - Badges pour tags, statuts, etc.
 */

import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'premium' | 'success' | 'warning'
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) {

  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-green-100 text-green-800',
    premium: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-orange-100 text-orange-800',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  const baseClasses = 'rounded-full font-semibold inline-flex items-center gap-1'
  const allClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <span className={allClasses}>
      {children}
    </span>
  )
}
