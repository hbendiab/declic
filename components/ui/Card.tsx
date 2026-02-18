/**
 * Composant Card - Cartes réutilisables pour DÉCLIC
 * Inclut les exports shadcn (Card, CardHeader, CardContent, etc.)
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ── Composant Card original DÉCLIC ──────────────────────────

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

// ── Exports shadcn Card ──────────────────────────────────────

const ShadcnCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
))
ShadcnCard.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  ShadcnCard as Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
