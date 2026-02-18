/**
 * Composant Button - Boutons réutilisables pour DÉCLIC
 * Inclut les exports shadcn (Button, buttonVariants)
 */

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'premium' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  icon?: ReactNode
  className?: string
}

// ── Exports shadcn Button ──────────────────────────────────────

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ShadcnButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const ShadcnButton = React.forwardRef<HTMLButtonElement, ShadcnButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
ShadcnButton.displayName = "Button"

export { ShadcnButton as Button, buttonVariants }

// ── Composant Button original DÉCLIC ──────────────────────────

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
}: ButtonProps) {

  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2'

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105',
    premium: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:scale-105',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const widthClass = fullWidth ? 'w-full' : ''
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  const allClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={allClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  )
}
