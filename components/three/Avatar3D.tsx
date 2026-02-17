'use client'

/**
 * Avatar 3D Component
 * Charge et anime le modèle GLB de l'avatar KLIC
 */

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { animations, AnimationState, easing } from './animations/avatarAnimations'

interface Avatar3DProps {
  animationState?: AnimationState
  onAnimationComplete?: () => void
  onClick?: () => void
}

export default function Avatar3D({
  animationState = 'idle',
  onAnimationComplete,
  onClick
}: Avatar3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Charger le modèle GLTF/GLB
  const { scene } = useGLTF('/models/klic-avatar.gltf')

  // Cloner le modèle pour éviter les problèmes de réutilisation
  const clonedScene = scene.clone()

  // Gérer les effets hover
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  // Démarrer une nouvelle animation quand l'état change
  useEffect(() => {
    if (animationState !== 'idle') {
      setIsAnimating(true)
      setAnimationProgress(0)
    }
  }, [animationState])

  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    if (animationState === 'idle') {
      // Animation de respiration douce
      const breathingScale = 1 + Math.sin(time * animations.idle.speed) * 0.02
      groupRef.current.scale.y = breathingScale

      // Léger balancement de tête
      const headSway = Math.sin(time * 0.5) * 0.05
      groupRef.current.rotation.y = headSway

      // Effet hover
      if (hovered) {
        groupRef.current.scale.x = THREE.MathUtils.lerp(
          groupRef.current.scale.x,
          1.05,
          0.1
        )
        groupRef.current.scale.z = THREE.MathUtils.lerp(
          groupRef.current.scale.z,
          1.05,
          0.1
        )
      } else {
        groupRef.current.scale.x = THREE.MathUtils.lerp(
          groupRef.current.scale.x,
          1,
          0.1
        )
        groupRef.current.scale.z = THREE.MathUtils.lerp(
          groupRef.current.scale.z,
          1,
          0.1
        )
      }
    } else if (isAnimating) {
      // Animer selon l'état actuel
      const config = animations[animationState]
      const duration = config.duration / 1000 // Convertir en secondes

      // Incrémenter le progrès
      const newProgress = Math.min(animationProgress + state.clock.getDelta() / duration, 1)
      setAnimationProgress(newProgress)

      // Appliquer l'animation selon le type
      switch (animationState) {
        case 'greeting':
          // Salut avec rotation du corps
          const greetingEase = easing.easeOutElastic(newProgress)
          groupRef.current.rotation.y = Math.sin(greetingEase * Math.PI) * 0.3
          groupRef.current.position.y = Math.sin(greetingEase * Math.PI * 2) * 0.1
          break

        case 'celebrating':
          // Saut avec rotation
          const celebrateEase = easing.easeOutBounce(newProgress)
          groupRef.current.scale.setScalar(
            1 + Math.sin(celebrateEase * Math.PI) * 0.15
          )
          groupRef.current.rotation.y = newProgress * Math.PI * 2
          groupRef.current.position.y = Math.sin(celebrateEase * Math.PI) * 0.3
          break

        case 'thinking':
          // Tête penchée
          const thinkingEase = easing.easeInOutSine(newProgress)
          groupRef.current.rotation.x = Math.sin(thinkingEase * Math.PI) * 0.2
          groupRef.current.rotation.z = Math.sin(thinkingEase * Math.PI) * -0.15
          break

        case 'nodding':
          // Hochement de tête
          const noddingPhase = Math.sin(newProgress * Math.PI * 4)
          groupRef.current.rotation.x = noddingPhase * 0.3
          break
      }

      // Animation terminée
      if (newProgress >= 1) {
        setIsAnimating(false)
        setAnimationProgress(0)

        // Reset à la position initiale
        groupRef.current.rotation.set(0, 0, 0)
        groupRef.current.position.y = 0
        groupRef.current.scale.set(1, 1, 1)

        // Callback
        onAnimationComplete?.()
      }
    }
  })

  // Cleanup
  useEffect(() => {
    return () => {
      // Disposer des ressources Three.js
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose())
          } else {
            child.material?.dispose()
          }
        }
      })
    }
  }, [clonedScene])

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
      }}
      position={[0, -1, 0]}
    >
      <primitive object={clonedScene} />

      {/* Effet glow au hover */}
      {hovered && (
        <pointLight
          position={[0, 1, 0]}
          intensity={0.5}
          color="#2563EB"
          distance={3}
        />
      )}
    </group>
  )
}

// Précharger le modèle GLTF/GLB
useGLTF.preload('/models/klic-avatar.gltf')
