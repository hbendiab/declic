/**
 * Avatar Animation Configurations
 * Configurations centralisées pour toutes les animations de l'avatar KLIC
 */

export type AnimationState = 'idle' | 'greeting' | 'celebrating' | 'thinking' | 'nodding'

/**
 * Configuration pour chaque type d'animation
 */
export const animations = {
  idle: {
    breathingScale: { min: 1, max: 1.02 },
    headRotation: { min: -0.05, max: 0.05 },
    speed: 0.8, // Vitesse de l'animation de respiration
    duration: 3000
  },
  greeting: {
    waveArmRotation: -45, // Rotation du bras pour le salut
    bodyRotation: { x: 0, y: 5, z: -5 },
    duration: 1200,
    bounceIntensity: 0.1
  },
  celebrating: {
    jumpScale: { min: 1, max: 1.15 },
    rotationY: 360, // Rotation complète
    duration: 1500,
    bounceCount: 2
  },
  thinking: {
    headTilt: { x: 15, y: -10 }, // Tête penchée
    duration: 1800,
    pauseAtPeak: 600 // Pause en position pensif
  },
  nodding: {
    headRotation: { x: 20, y: 0 }, // Hochement vertical
    duration: 1000,
    repeatCount: 2
  }
}

/**
 * Pool d'animations aléatoires déclenchées au clic
 */
export const clickAnimations: AnimationState[] = [
  'greeting',
  'celebrating',
  'thinking',
  'nodding'
]

/**
 * Fonction pour obtenir une animation aléatoire
 */
export function getRandomAnimation(): AnimationState {
  const randomIndex = Math.floor(Math.random() * clickAnimations.length)
  return clickAnimations[randomIndex]
}

/**
 * Easing functions pour des animations fluides
 */
export const easing = {
  // Easing doux pour les animations idle
  easeInOutSine: (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2
  },
  // Easing avec rebond pour les célébrations
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625
    const d1 = 2.75

    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  },
  // Easing élastique pour les salutations
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }
}

/**
 * Configuration des lumières colorées selon les animations
 */
export const animationLighting = {
  idle: {
    intensity: 0.8,
    color: '#FFFFFF'
  },
  greeting: {
    intensity: 1.0,
    color: '#2563EB' // Bleu DÉCLIC
  },
  celebrating: {
    intensity: 1.2,
    color: '#FF6B35' // Orange DÉCLIC
  },
  thinking: {
    intensity: 0.7,
    color: '#10B981' // Vert DÉCLIC
  },
  nodding: {
    intensity: 0.9,
    color: '#F59E0B' // Amber DÉCLIC
  }
}
