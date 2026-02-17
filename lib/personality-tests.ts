/**
 * Tests de personnalité MBTI et RIASEC
 */

// ============================================================================
// TEST MBTI (Myers-Briggs Type Indicator)
// ============================================================================

export interface MBTIQuestion {
  id: string
  question: string
  options: {
    text: string
    dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
    score: number
  }[]
}

export const mbtiQuestions: MBTIQuestion[] = [
  // E/I (Extraversion vs Introversion)
  {
    id: 'mbti_1',
    question: 'Vous préférez passer votre temps libre:',
    options: [
      { text: 'Avec des amis, en groupe', dimension: 'E', score: 2 },
      { text: 'Seul ou avec une personne proche', dimension: 'I', score: 2 }
    ]
  },
  {
    id: 'mbti_2',
    question: 'Dans une réunion, vous avez tendance à:',
    options: [
      { text: 'Parler et partager vos idées spontanément', dimension: 'E', score: 2 },
      { text: 'Écouter et réfléchir avant de parler', dimension: 'I', score: 2 }
    ]
  },
  {
    id: 'mbti_3',
    question: 'Après une journée sociale intensive:',
    options: [
      { text: 'Vous vous sentez énergisé', dimension: 'E', score: 2 },
      { text: 'Vous avez besoin de temps seul pour recharger', dimension: 'I', score: 2 }
    ]
  },
  {
    id: 'mbti_4',
    question: 'Vous préférez:',
    options: [
      { text: 'Avoir beaucoup de connaissances', dimension: 'E', score: 2 },
      { text: 'Avoir quelques amis proches', dimension: 'I', score: 2 }
    ]
  },

  // S/N (Sensation vs Intuition)
  {
    id: 'mbti_5',
    question: 'Vous préférez vous concentrer sur:',
    options: [
      { text: 'Les faits concrets et les détails', dimension: 'S', score: 2 },
      { text: 'Les idées et les possibilités', dimension: 'N', score: 2 }
    ]
  },
  {
    id: 'mbti_6',
    question: 'Vous faites plus confiance à:',
    options: [
      { text: 'Votre expérience pratique', dimension: 'S', score: 2 },
      { text: 'Votre intuition', dimension: 'N', score: 2 }
    ]
  },
  {
    id: 'mbti_7',
    question: 'Vous apprenez mieux:',
    options: [
      { text: 'Avec des exemples concrets et des exercices', dimension: 'S', score: 2 },
      { text: 'Avec des concepts théoriques', dimension: 'N', score: 2 }
    ]
  },
  {
    id: 'mbti_8',
    question: 'Vous êtes plus intéressé par:',
    options: [
      { text: 'Ce qui est réel et actuel', dimension: 'S', score: 2 },
      { text: 'Ce qui pourrait être possible', dimension: 'N', score: 2 }
    ]
  },

  // T/F (Thinking vs Feeling)
  {
    id: 'mbti_9',
    question: 'Quand vous prenez une décision, vous privilégiez:',
    options: [
      { text: 'La logique et l\'analyse objective', dimension: 'T', score: 2 },
      { text: 'Les valeurs personnelles et l\'impact sur les gens', dimension: 'F', score: 2 }
    ]
  },
  {
    id: 'mbti_10',
    question: 'Vous valorisez plus:',
    options: [
      { text: 'La justice et l\'équité', dimension: 'T', score: 2 },
      { text: 'La compassion et l\'harmonie', dimension: 'F', score: 2 }
    ]
  },
  {
    id: 'mbti_11',
    question: 'Dans un conflit, vous avez tendance à:',
    options: [
      { text: 'Analyser le problème objectivement', dimension: 'T', score: 2 },
      { text: 'Considérer les sentiments des personnes impliquées', dimension: 'F', score: 2 }
    ]
  },
  {
    id: 'mbti_12',
    question: 'Les autres vous voient comme:',
    options: [
      { text: 'Logique et rationnel', dimension: 'T', score: 2 },
      { text: 'Empathique et chaleureux', dimension: 'F', score: 2 }
    ]
  },

  // J/P (Judging vs Perceiving)
  {
    id: 'mbti_13',
    question: 'Vous préférez:',
    options: [
      { text: 'Planifier à l\'avance et suivre un plan', dimension: 'J', score: 2 },
      { text: 'Rester flexible et improviser', dimension: 'P', score: 2 }
    ]
  },
  {
    id: 'mbti_14',
    question: 'Votre espace de travail est généralement:',
    options: [
      { text: 'Organisé et bien rangé', dimension: 'J', score: 2 },
      { text: 'Un peu en désordre mais fonctionnel', dimension: 'P', score: 2 }
    ]
  },
  {
    id: 'mbti_15',
    question: 'Vous vous sentez mieux quand:',
    options: [
      { text: 'Les choses sont décidées et réglées', dimension: 'J', score: 2 },
      { text: 'Vous gardez vos options ouvertes', dimension: 'P', score: 2 }
    ]
  },
  {
    id: 'mbti_16',
    question: 'Vous gérez les deadlines:',
    options: [
      { text: 'En finissant bien avant la date limite', dimension: 'J', score: 2 },
      { text: 'En travaillant mieux sous pression', dimension: 'P', score: 2 }
    ]
  }
]

export function calculateMBTI(answers: { [key: string]: number }): string {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  }

  // Calculer les scores
  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const question = mbtiQuestions.find(q => q.id === questionId)
    if (question && question.options[optionIndex]) {
      const option = question.options[optionIndex]
      scores[option.dimension] += option.score
    }
  })

  // Déterminer le type
  const type = [
    scores.E > scores.I ? 'E' : 'I',
    scores.S > scores.N ? 'S' : 'N',
    scores.T > scores.F ? 'T' : 'F',
    scores.J > scores.P ? 'J' : 'P'
  ].join('')

  return type
}

// ============================================================================
// TEST RIASEC (Holland Codes)
// ============================================================================

export interface RIASECQuestion {
  id: string
  question: string
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
}

export const riasecQuestions: RIASECQuestion[] = [
  // Réaliste (R) - Pratique, technique, physique
  { id: 'riasec_1', question: 'Travailler avec des outils ou des machines', type: 'R' },
  { id: 'riasec_2', question: 'Réparer des objets ou des équipements', type: 'R' },
  { id: 'riasec_3', question: 'Travailler à l\'extérieur', type: 'R' },

  // Investigateur (I) - Analytique, scientifique, curieux
  { id: 'riasec_4', question: 'Résoudre des problèmes complexes', type: 'I' },
  { id: 'riasec_5', question: 'Mener des recherches scientifiques', type: 'I' },
  { id: 'riasec_6', question: 'Analyser des données', type: 'I' },

  // Artistique (A) - Créatif, expressif, original
  { id: 'riasec_7', question: 'Créer des œuvres d\'art ou de design', type: 'A' },
  { id: 'riasec_8', question: 'Exprimer votre créativité', type: 'A' },
  { id: 'riasec_9', question: 'Travailler de manière non structurée', type: 'A' },

  // Social (S) - Aidant, enseignant, empathique
  { id: 'riasec_10', question: 'Aider les autres à résoudre leurs problèmes', type: 'S' },
  { id: 'riasec_11', question: 'Enseigner ou former des personnes', type: 'S' },
  { id: 'riasec_12', question: 'Travailler en équipe', type: 'S' },

  // Entreprenant (E) - Leadership, persuasif, ambitieux
  { id: 'riasec_13', question: 'Diriger et gérer des projets', type: 'E' },
  { id: 'riasec_14', question: 'Persuader ou influencer les autres', type: 'E' },
  { id: 'riasec_15', question: 'Vendre des produits ou services', type: 'E' },

  // Conventionnel (C) - Organisé, méthodique, structuré
  { id: 'riasec_16', question: 'Organiser et gérer des informations', type: 'C' },
  { id: 'riasec_17', question: 'Suivre des procédures établies', type: 'C' },
  { id: 'riasec_18', question: 'Travailler avec des chiffres et des données', type: 'C' }
]

export function calculateRIASEC(answers: { [key: string]: number }): string {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  // Calculer les scores (1-5 pour chaque question)
  Object.entries(answers).forEach(([questionId, rating]) => {
    const question = riasecQuestions.find(q => q.id === questionId)
    if (question) {
      scores[question.type] += rating
    }
  })

  // Trier par score décroissant et prendre les 3 premiers
  const sortedTypes = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type)
    .join('')

  return sortedTypes
}

// ============================================================================
// DESCRIPTIONS DES TYPES
// ============================================================================

export const mbtiDescriptions: { [key: string]: string } = {
  'INTJ': 'Architecte - Penseur stratégique avec soif de connaissances',
  'INTP': 'Logicien - Innovateur avec une soif de connaissances',
  'ENTJ': 'Commandant - Leader audacieux, imaginatif et volontaire',
  'ENTP': 'Innovateur - Penseur intelligent et curieux',
  'INFJ': 'Avocat - Idéaliste silencieux et mystique',
  'INFP': 'Médiateur - Poétique, gentil et altruiste',
  'ENFJ': 'Protagoniste - Leader charismatique et inspirant',
  'ENFP': 'Inspirateur - Enthousiaste, créatif et sociable',
  'ISTJ': 'Logisticien - Pratique et factuel',
  'ISFJ': 'Défenseur - Protecteur dévoué et chaleureux',
  'ESTJ': 'Directeur - Excellent administrateur',
  'ESFJ': 'Consul - Extraverti, attentionné et populaire',
  'ISTP': 'Virtuose - Expérimentateur audacieux et pratique',
  'ISFP': 'Aventurier - Artiste flexible et charmant',
  'ESTP': 'Entrepreneur - Intelligent, énergique et perceptif',
  'ESFP': 'Amuseur - Spontané, énergique et enthousiaste'
}

export const riasecDescriptions: { [key: string]: string } = {
  'R': 'Réaliste - Pratique, technique, aime travailler avec ses mains',
  'I': 'Investigateur - Analytique, curieux, aime résoudre des problèmes',
  'A': 'Artistique - Créatif, expressif, aime l\'innovation',
  'S': 'Social - Empathique, aidant, aime travailler avec les gens',
  'E': 'Entreprenant - Leader, persuasif, aime relever des défis',
  'C': 'Conventionnel - Organisé, méthodique, aime la structure'
}

// ============================================================================
// TEST BIG FIVE (OCEAN)
// ============================================================================

export interface BigFiveQuestion {
  id: string
  question: string
  dimension: 'O' | 'C' | 'E' | 'A' | 'N'
  reverse?: boolean // Pour les questions inversées
}

export const bigFiveQuestions: BigFiveQuestion[] = [
  // Ouverture (Openness)
  { id: 'bf_1', question: 'J\'aime essayer de nouvelles choses', dimension: 'O' },
  { id: 'bf_2', question: 'J\'ai une imagination vive', dimension: 'O' },
  { id: 'bf_3', question: 'Je préfère la routine', dimension: 'O', reverse: true },

  // Conscience (Conscientiousness)
  { id: 'bf_4', question: 'Je suis toujours préparé(e)', dimension: 'C' },
  { id: 'bf_5', question: 'J\'accorde de l\'attention aux détails', dimension: 'C' },
  { id: 'bf_6', question: 'Je laisse souvent mes affaires traîner', dimension: 'C', reverse: true },

  // Extraversion
  { id: 'bf_7', question: 'Je suis l\'âme de la fête', dimension: 'E' },
  { id: 'bf_8', question: 'Je me sens à l\'aise avec les gens', dimension: 'E' },
  { id: 'bf_9', question: 'Je garde mes pensées pour moi', dimension: 'E', reverse: true },

  // Agréabilité (Agreeableness)
  { id: 'bf_10', question: 'Je m\'intéresse aux autres', dimension: 'A' },
  { id: 'bf_11', question: 'Je prends du temps pour les autres', dimension: 'A' },
  { id: 'bf_12', question: 'Je pense d\'abord à moi', dimension: 'A', reverse: true },

  // Névrosisme (Neuroticism)
  { id: 'bf_13', question: 'Je stresse facilement', dimension: 'N' },
  { id: 'bf_14', question: 'Je m\'inquiète souvent', dimension: 'N' },
  { id: 'bf_15', question: 'Je suis généralement calme', dimension: 'N', reverse: true }
]

export function calculateBigFive(answers: { [key: string]: number }): { [key: string]: number } {
  const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }
  const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 }

  Object.entries(answers).forEach(([questionId, rating]) => {
    const question = bigFiveQuestions.find(q => q.id === questionId)
    if (question) {
      const score = question.reverse ? (6 - rating) : rating
      scores[question.dimension] += score
      counts[question.dimension]++
    }
  })

  // Normaliser (moyenne sur 5)
  return {
    O: Math.round((scores.O / counts.O) * 10) / 10,
    C: Math.round((scores.C / counts.C) * 10) / 10,
    E: Math.round((scores.E / counts.E) * 10) / 10,
    A: Math.round((scores.A / counts.A) * 10) / 10,
    N: Math.round((scores.N / counts.N) * 10) / 10
  }
}

export const bigFiveDescriptions = {
  'O': 'Ouverture - Imagination, curiosité, ouverture aux nouvelles expériences',
  'C': 'Conscience - Organisation, fiabilité, discipline',
  'E': 'Extraversion - Sociabilité, assertivité, énergie',
  'A': 'Agréabilité - Compassion, coopération, confiance',
  'N': 'Névrosisme - Sensibilité émotionnelle, tendance à l\'anxiété'
}

// ============================================================================
// TEST ENNÉAGRAMME
// ============================================================================

export interface EnneagramQuestion {
  id: string
  question: string
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

export const enneagramQuestions: EnneagramQuestion[] = [
  // Type 1: Le Perfectionniste
  { id: 'enn_1', question: 'Je m\'efforce d\'être parfait et sans erreur', type: 1 },
  { id: 'enn_2', question: 'J\'ai des standards élevés pour moi et les autres', type: 1 },

  // Type 2: L'Altruiste
  { id: 'enn_3', question: 'J\'aime aider les autres et être utile', type: 2 },
  { id: 'enn_4', question: 'Je ressens les besoins des autres', type: 2 },

  // Type 3: Le Battant
  { id: 'enn_5', question: 'Je suis motivé(e) par la réussite et le succès', type: 3 },
  { id: 'enn_6', question: 'J\'aime fixer et atteindre des objectifs', type: 3 },

  // Type 4: L'Individualiste
  { id: 'enn_7', question: 'Je me sens différent(e) des autres', type: 4 },
  { id: 'enn_8', question: 'J\'exprime ma créativité et mon authenticité', type: 4 },

  // Type 5: L'Observateur
  { id: 'enn_9', question: 'J\'aime observer et comprendre', type: 5 },
  { id: 'enn_10', question: 'J\'ai besoin de temps seul pour me ressourcer', type: 5 },

  // Type 6: Le Loyaliste
  { id: 'enn_11', question: 'Je suis loyal(e) et fiable', type: 6 },
  { id: 'enn_12', question: 'Je pense aux risques et me prépare', type: 6 },

  // Type 7: L'Épicurien
  { id: 'enn_13', question: 'J\'aime l\'aventure et la nouveauté', type: 7 },
  { id: 'enn_14', question: 'Je préfère rester optimiste et positif', type: 7 },

  // Type 8: Le Chef
  { id: 'enn_15', question: 'Je prends naturellement le contrôle', type: 8 },
  { id: 'enn_16', question: 'Je protège les plus faibles', type: 8 },

  // Type 9: Le Médiateur
  { id: 'enn_17', question: 'J\'évite les conflits et cherche l\'harmonie', type: 9 },
  { id: 'enn_18', question: 'Je vois tous les points de vue', type: 9 }
]

export function calculateEnneagram(answers: { [key: string]: number }): number {
  const scores: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }

  Object.entries(answers).forEach(([questionId, rating]) => {
    const question = enneagramQuestions.find(q => q.id === questionId)
    if (question) {
      scores[question.type] += rating
    }
  })

  // Retourner le type avec le score le plus élevé
  return parseInt(Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0])
}

export const enneagramDescriptions: { [key: number]: string } = {
  1: 'Le Perfectionniste - Principled, purposeful, self-controlled',
  2: 'L\'Altruiste - Généreux, démonstratif, people-pleasing',
  3: 'Le Battant - Success-oriented, pragmatique, adaptatif',
  4: 'L\'Individualiste - Créatif, sensible, introspectif',
  5: 'L\'Observateur - Perceptif, innovant, secret',
  6: 'Le Loyaliste - Engagé, responsable, anxieux',
  7: 'L\'Épicurien - Spontané, polyvalent, dispersé',
  8: 'Le Chef - Puissant, dominant, confrontant',
  9: 'Le Médiateur - Réceptif, rassurant, accommodant'
}

// ============================================================================
// TEST VIA STRENGTHS (Forces de Caractère)
// ============================================================================

export interface VIAStrength {
  id: string
  name: string
  question: string
  virtue: 'wisdom' | 'courage' | 'humanity' | 'justice' | 'temperance' | 'transcendence'
}

export const viaStrengths: VIAStrength[] = [
  // Sagesse (Wisdom)
  { id: 'via_1', name: 'Créativité', question: 'Je trouve des façons nouvelles et productives de faire les choses', virtue: 'wisdom' },
  { id: 'via_2', name: 'Curiosité', question: 'Je pose des questions et explore activement', virtue: 'wisdom' },
  { id: 'via_3', name: 'Jugement', question: 'Je pense aux choses sous tous les angles', virtue: 'wisdom' },
  { id: 'via_4', name: 'Apprentissage', question: 'J\'aime apprendre de nouvelles choses', virtue: 'wisdom' },

  // Courage
  { id: 'via_5', name: 'Bravoure', question: 'Je ne recule pas devant les défis', virtue: 'courage' },
  { id: 'via_6', name: 'Persévérance', question: 'Je finis ce que je commence', virtue: 'courage' },
  { id: 'via_7', name: 'Honnêteté', question: 'Je vis selon mes valeurs', virtue: 'courage' },
  { id: 'via_8', name: 'Vitalité', question: 'J\'aborde la vie avec énergie', virtue: 'courage' },

  // Humanité
  { id: 'via_9', name: 'Amour', question: 'Je valorise les relations proches', virtue: 'humanity' },
  { id: 'via_10', name: 'Gentillesse', question: 'J\'aime faire des choses pour les autres', virtue: 'humanity' },
  { id: 'via_11', name: 'Intelligence sociale', question: 'Je comprends bien les gens', virtue: 'humanity' },

  // Justice
  { id: 'via_12', name: 'Équité', question: 'Je traite tout le monde équitablement', virtue: 'justice' },
  { id: 'via_13', name: 'Leadership', question: 'Je suis bon(ne) pour organiser les groupes', virtue: 'justice' },
  { id: 'via_14', name: 'Citoyenneté', question: 'Je contribue au bien commun', virtue: 'justice' },

  // Tempérance
  { id: 'via_15', name: 'Pardon', question: 'Je pardonne facilement', virtue: 'temperance' },
  { id: 'via_16', name: 'Humilité', question: 'Je laisse les autres briller', virtue: 'temperance' },
  { id: 'via_17', name: 'Prudence', question: 'Je réfléchis avant d\'agir', virtue: 'temperance' },
  { id: 'via_18', name: 'Autorégulation', question: 'Je contrôle mes impulsions', virtue: 'temperance' },

  // Transcendance
  { id: 'via_19', name: 'Appréciation de la beauté', question: 'Je remarque et apprécie la beauté', virtue: 'transcendence' },
  { id: 'via_20', name: 'Gratitude', question: 'Je suis reconnaissant(e)', virtue: 'transcendence' },
  { id: 'via_21', name: 'Espoir', question: 'Je reste optimiste', virtue: 'transcendence' },
  { id: 'via_22', name: 'Humour', question: 'J\'aime rire et faire rire', virtue: 'transcendence' },
  { id: 'via_23', name: 'Spiritualité', question: 'Je cherche un sens à la vie', virtue: 'transcendence' }
]

export function calculateVIAStrengths(answers: { [key: string]: number }): string[] {
  const scores: { name: string, score: number }[] = viaStrengths.map(strength => ({
    name: strength.name,
    score: answers[strength.id] || 0
  }))

  // Retourner les 5 forces principales
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.name)
}

export const viaVirtues = {
  'wisdom': 'Sagesse - Acquisition et utilisation de la connaissance',
  'courage': 'Courage - Volonté d\'accomplir ses objectifs',
  'humanity': 'Humanité - Prendre soin et se lier d\'amitié avec les autres',
  'justice': 'Justice - Vie communautaire saine',
  'temperance': 'Tempérance - Protection contre les excès',
  'transcendence': 'Transcendance - Connexion à quelque chose de plus grand'
}
