/**
 * DÉCLIC - Design System
 * Couleurs, typographie et constantes de design
 */

// ============================================================================
// COULEURS
// ============================================================================

export const colors = {
  // Primaires
  primary: {
    blue: '#2563EB',      // Bleu moderne
    coral: '#FF6B35',     // Orange-Coral chaud
  },

  // Secondaires
  secondary: {
    green: '#10B981',     // Vert naturel
    amber: '#F59E0B',     // Amber/Or
  },

  // Neutres
  neutral: {
    dark: '#1F2937',      // Gris très foncé
    light: '#F3F4F6',     // Gris clair
    white: '#FFFFFF',
  },

  // Dégradés
  gradients: {
    primary: 'from-blue-600 to-cyan-500',
    warm: 'from-orange-500 to-pink-500',
    success: 'from-green-500 to-emerald-600',
    premium: 'from-amber-500 to-orange-600',
  }
}

// ============================================================================
// TYPOGRAPHIE
// ============================================================================

export const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Poppins, sans-serif',
  accent: 'Outfit, sans-serif',
}

// ============================================================================
// CONSTANTES FREEMIUM
// ============================================================================

export const freemium = {
  free: {
    tests: 1,              // 1 test au choix
    jobs: 5,               // 3-5 métiers
    chatMessages: 5,       // 5 messages max
    hasActionPlan: false,  // Pas de plan d'action
    hasResources: false,   // Pas de ressources bonus
  },

  premium: {
    price: 14.99,          // €14.99 une fois
    tests: 4,              // Tous les 4 tests
    jobs: 500,             // 500+ métiers
    chatMessages: -1,      // Illimité (-1)
    hasActionPlan: true,   // Plans d'action PDF
    hasResources: true,    // Ressources bonus
    support: 12,           // 12 mois
  }
}

// ============================================================================
// TESTS DISPONIBLES
// ============================================================================

export const availableTests = [
  {
    id: 'riasec',
    name: 'RIASEC',
    subtitle: 'Holland Code',
    description: 'DECOUVRES tes intérêts professionnels',
    duration: '5-7 min',
    questions: 18,
    icon: '🎯',
    color: 'blue',
  },
  {
    id: 'mbti',
    name: 'MBTI',
    subtitle: 'Myers-Briggs',
    description: 'Comprends ton type de personnalité',
    duration: '7-10 min',
    questions: 16,
    icon: '🧠',
    color: 'purple',
  },
  {
    id: 'enneagram',
    name: 'Ennéagramme',
    subtitle: '9 Types',
    description: 'Explore tes motivations profondes',
    duration: '6-8 min',
    questions: 18,
    icon: '💎',
    color: 'pink',
  },
  {
    id: 'via',
    name: 'VIA Strengths',
    subtitle: 'Forces de caractère',
    description: 'Identifie tes forces principales',
    duration: '8-10 min',
    questions: 23,
    icon: '✨',
    color: 'green',
  },
]

// ============================================================================
// PERSONNALITÉ KLIC
// ============================================================================

export const klicPersonality = {
  name: 'KLIC',
  tagline: 'Ton ami pour trouver ta voie',

  greetings: [
    "Hey! Moi c'est KLIC 👋",
    "Salut! KLIC dans la place!",
    "Yo! KLIC ici 🎉",
  ],

  encouragements: [
    "Tu gères! 🔥",
    "Trop bien! Continue comme ça!",
    "Excellent! T'es sur la bonne voie!",
    "Franchement, respect! 💪",
  ],

  style: {
    tone: 'Authentique et bienveillant comme un ami',
    vocabulary: 'Langage jeune et naturel',
    emoji: true,
    examples: true, // Utilise exemples concrets (TikTok, Instagram, etc.)
  }
}
