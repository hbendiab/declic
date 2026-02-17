'use client'

/**
 * Avatar Canvas Component
 * Wrapper principal du Canvas 3D avec optimisations et fallbacks
 */

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { isWebGLAvailable } from '@/lib/webgl'
import AvatarScene from './AvatarScene'
import AvatarFallback from './AvatarFallback'
import { getRandomAnimation, AnimationState } from './animations/avatarAnimations'

interface AvatarCanvasProps {
  className?: string
}

// Composant de chargement
function LoadingAvatar() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-6xl animate-bounce">💬</div>
    </div>
  )
}

export default function AvatarCanvas({ className = '' }: AvatarCanvasProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const [animationState, setAnimationState] = useState<AnimationState>('idle')
  const [isMobile, setIsMobile] = useState(false)

  // Détection WebGL côté client
  useEffect(() => {
    setWebglSupported(isWebGLAvailable())

    // Détection mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handler de clic sur l'avatar
  const handleAvatarClick = () => {
    const randomAnimation = getRandomAnimation()
    setAnimationState(randomAnimation)
  }

  // Retour à idle après animation
  const handleAnimationComplete = () => {
    setAnimationState('idle')
  }

  // Afficher le loading pendant la détection WebGL
  if (webglSupported === null) {
    return <LoadingAvatar />
  }

  // Fallback si WebGL non supporté
  if (!webglSupported) {
    return <AvatarFallback />
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={isMobile ? 1 : [1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        {/* Couleur de fond transparente */}
        <color attach="background" args={['transparent']} />

        {/* Suspense pour le chargement asynchrone */}
        <Suspense fallback={null}>
          <AvatarScene
            simplified={isMobile}
            animationState={animationState}
            onAnimationComplete={handleAnimationComplete}
            onClick={handleAvatarClick}
          />
        </Suspense>
      </Canvas>

      {/* Annonce pour les screen readers */}
      <div
        aria-live="polite"
        className="sr-only"
      >
        {animationState === 'greeting' && 'KLIC vous salue!'}
        {animationState === 'celebrating' && 'KLIC célèbre avec vous!'}
        {animationState === 'thinking' && 'KLIC réfléchit...'}
        {animationState === 'nodding' && 'KLIC acquiesce!'}
      </div>

      {/* Support navigation clavier */}
      <div
        tabIndex={0}
        role="button"
        aria-label="Interagir avec KLIC, votre avatar de coach IA"
        className="absolute inset-0 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-lg"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleAvatarClick()
          }
        }}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}
