'use client'

/**
 * Avatar Scene Component
 * Configure la scène 3D: lumières, caméra, environnement
 */

import { PerspectiveCamera } from '@react-three/drei'
import Avatar3D from './Avatar3D'

interface AvatarSceneProps {
  simplified?: boolean // Mode simplifié pour mobile
  animationState?: 'idle' | 'greeting' | 'celebrating' | 'thinking' | 'nodding'
  onAnimationComplete?: () => void
  onClick?: () => void
}

export default function AvatarScene({
  simplified = false,
  animationState = 'idle',
  onAnimationComplete,
  onClick
}: AvatarSceneProps) {
  return (
    <>
      {/* Caméra positionnée pour vue portrait */}
      <PerspectiveCamera
        makeDefault
        position={[0, 0.5, 3]}
        fov={50}
      />

      {/* Lumière ambiante (éclairage global doux) */}
      <ambientLight
        intensity={0.6}
        color="#FFFFFF"
      />

      {/* Lumière directionnelle principale (couleur DÉCLIC bleu) */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={simplified ? 0.6 : 0.8}
        color="#2563EB"
        castShadow={!simplified}
      />

      {/* Lumière d'accentuation (couleur DÉCLIC orange) */}
      {!simplified && (
        <spotLight
          position={[-5, 5, 0]}
          intensity={0.5}
          color="#FF6B35"
          angle={0.6}
          penumbra={1}
        />
      )}

      {/* Lumière de remplissage (depuis le bas) */}
      {!simplified && (
        <pointLight
          position={[0, -2, 2]}
          intensity={0.3}
          color="#10B981"
        />
      )}

      {/* Avatar 3D */}
      <Avatar3D
        animationState={animationState}
        onAnimationComplete={onAnimationComplete}
        onClick={onClick}
      />
    </>
  )
}
