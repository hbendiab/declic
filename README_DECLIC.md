# 🚀 DÉCLIC - Trouve ta vraie voie

**Plateforme d'orientation professionnelle pour ados (14-19 ans)**

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Modèle Freemium](#modèle-freemium)
- [Personnalisation](#personnalisation)
- [Prochaines étapes](#prochaines-étapes)

---

## 🎯 Vue d'ensemble

**DÉCLIC** est une plateforme web moderne d'orientation professionnelle conçue spécifiquement pour les adolescents. Elle combine:

- ✅ **4 tests scientifiques** validés (RIASEC, MBTI, Ennéagramme, VIA Strengths)
- 💬 **KLIC**, un chatbot IA bienveillant et conversationnel
- 🎯 **500+ métiers** scrapés depuis APEC, Pôle Emploi, INSEE
- 📊 **Système RAG** pour recommandations personnalisées
- 💎 **Modèle Freemium** (gratuit + premium €14.99)

**Tagline**: "Trouve ta vraie voie"

---

## ✨ Fonctionnalités

### Version Gratuite
- ✓ 1 test au choix (4 disponibles)
- ✓ 5 messages avec KLIC
- ✓ 3-5 métiers recommandés
- ✓ Descriptions basiques

### Version Premium (€14.99 une fois)
- ✓ **Tous les 4 tests**
- ✓ **Chat KLIC illimité**
- ✓ **500+ métiers** avec descriptions complètes
- ✓ **Plans d'action PDF** personnalisés
- ✓ **Ressources bonus**
- ✓ **Support 12 mois**
- ✓ **Accès à vie**

### 4 Tests Disponibles

1. **RIASEC** (Holland Code)
   - 18 questions
   - 6 types d'intérêts: Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel
   - Résultat: Code 3 lettres (ex: SAI)

2. **MBTI** (Myers-Briggs)
   - 16 questions A/B
   - 16 types de personnalité
   - Résultat: 4 lettres (ex: ENFP)

3. **Ennéagramme**
   - 18 questions (échelle 1-5)
   - 9 types de motivations
   - Résultat: Type 1-9

4. **VIA Strengths**
   - 23 questions (échelle 1-5)
   - 24 forces réparties en 6 vertus
   - Résultat: Top 5 forces

---

## 🛠️ Stack technique

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS (couleurs personnalisées)
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes
- **RAG**: ChromaDB + Sentence Transformers (Python)
- **Chatbot**: Claude API (Anthropic) - à intégrer
- **Data**: 446 métiers scrapés (APEC)
- **Storage**: LocalStorage (demo) → remplacer par DB réelle

---

## 📥 Installation

### Prérequis

- Node.js 18+
- Python 3.8+
- npm ou pnpm

### 1. Installation des dépendances

```bash
# Frontend (Next.js)
npm install

# Backend Python (RAG)
pip install sentence-transformers chromadb
```

### 2. Configuration environnement

Créer `.env.local`:

```env
# API Claude (à configurer)
ANTHROPIC_API_KEY=votre_clé_api

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Setup de la base RAG

```bash
# Créer la base ChromaDB avec les métiers
python3 setup_rag.py
```

Cela va:
- Charger les 446 métiers depuis `data/jobs/apec-jobs.json`
- Créer les embeddings avec `paraphrase-multilingual-MiniLM-L12-v2`
- Stocker dans `data/chroma_db/`

### 4. Lancer le serveur

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
chatbot-app/
├── app/
│   ├── landing/          # Landing page
│   ├── signup/           # Inscription
│   ├── dashboard/        # Dashboard principal + KLIC
│   ├── tests/
│   │   ├── riasec/       # Test RIASEC interactif
│   │   ├── mbti/         # Test MBTI (à créer)
│   │   ├── enneagram/    # Test Ennéagramme (à créer)
│   │   └── via/          # Test VIA Strengths (à créer)
│   ├── recommendations/  # Page recommandations métiers
│   ├── upgrade/          # Page Premium
│   └── api/
│       └── search-jobs/  # API RAG (appelle Python)
│
├── components/
│   └── ui/
│       ├── Button.tsx    # Bouton réutilisable
│       ├── Card.tsx      # Card réutilisable
│       └── Badge.tsx     # Badge réutilisable
│
├── lib/
│   ├── design-system.ts  # Couleurs, constantes
│   └── personality-tests.ts # Tests (questions, calculs)
│
├── data/
│   ├── jobs/
│   │   └── apec-jobs.json  # 446 métiers scrapés
│   └── chroma_db/          # Base vectorielle ChromaDB
│
├── public/               # Assets statiques
├── tailwind.config.js    # Config Tailwind (couleurs custom)
├── setup_rag.py          # Script setup RAG
└── search_jobs.py        # Script recherche RAG
```

---

## 💎 Modèle Freemium

### Logique implémentée

Le système Freemium est géré dans `lib/design-system.ts`:

```typescript
export const freemium = {
  free: {
    tests: 1,
    jobs: 5,
    chatMessages: 5,
    hasActionPlan: false,
    hasResources: false,
  },
  premium: {
    price: 14.99,
    tests: 4,
    jobs: 500,
    chatMessages: -1,  // Illimité
    hasActionPlan: true,
    hasResources: true,
    support: 12,
  }
}
```

### Limitations appliquées

- **Dashboard** (`app/dashboard/page.tsx`): Verrouille tests et messages
- **Recommandations** (`app/recommendations/page.tsx`): Limite à 5 métiers
- **Tests**: Vérifie `user.testsCompleted.length` vs limite

### Upgrade Premium

Page dédiée: `/upgrade`
- Comparaison Gratuit vs Premium
- Bouton de paiement (à intégrer Stripe)
- Garantie 30 jours

---

## 🎨 Personnalisation

### Couleurs

Modifier dans `tailwind.config.js`:

```js
colors: {
  'declic': {
    blue: '#2563EB',      // Bleu primaire
    coral: '#FF6B35',     // Orange-Coral
    green: '#10B981',     // Vert secondaire
    amber: '#F59E0B',     // Amber
    dark: '#1F2937',      // Gris foncé
    light: '#F3F4F6',     // Gris clair
  },
}
```

### Polices

Modifier dans `tailwind.config.js`:

```js
fontFamily: {
  'heading': ['Inter', 'sans-serif'],
  'body': ['Poppins', 'sans-serif'],
  'accent': ['Outfit', 'sans-serif'],
}
```

### Personnalité KLIC

Modifier dans `lib/design-system.ts`:

```typescript
export const klicPersonality = {
  name: 'KLIC',
  tagline: 'Ton ami pour trouver ta voie',
  greetings: [
    "Hey! Moi c'est KLIC 👋",
    "Salut! KLIC dans la place!",
    // Ajouter plus...
  ],
  encouragements: [
    "Tu gères! 🔥",
    "Trop bien! Continue comme ça!",
    // Ajouter plus...
  ],
}
```

---

## 🚀 Prochaines étapes

### Priorité 1 - Essentiel

- [ ] **Intégrer vraie API Claude** pour KLIC (remplacer réponses simulées)
  - Fichier: `app/dashboard/page.tsx` → fonction `getKlicResponse()`
  - Utiliser API Anthropic Claude

- [ ] **Créer les 3 autres pages de tests**:
  - [ ] `/tests/mbti`
  - [ ] `/tests/enneagram`
  - [ ] `/tests/via`
  - Modèle: `app/tests/riasec/page.tsx`

- [ ] **Système d'authentification réel**
  - Remplacer localStorage par database (Supabase, PostgreSQL)
  - NextAuth.js ou Clerk

- [ ] **Génération PDF plans d'action**
  - Utiliser `jsPDF` ou `react-pdf`
  - Template personnalisé par métier

### Priorité 2 - Améliorations

- [ ] **Page de profil utilisateur**
  - Voir tous les tests complétés
  - Résultats détaillés
  - Historique

- [ ] **Système de favoris métiers**
  - Sauvegarder métiers intéressants
  - Comparer métiers

- [ ] **Page de login** (actuellement juste signup)

- [ ] **Améliorer RAG**
  - Utiliser GPT-4 pour descriptions enrichies
  - Scoring de pertinence plus fin
  - Filtres (secteur, salaire, etc.)

### Priorité 3 - Business

- [ ] **Intégration paiement Stripe**
  - Checkout Premium
  - Webhooks pour validation
  - Gestion abonnements (optionnel)

- [ ] **Analytics**
  - Google Analytics / Plausible
  - Tracking conversions
  - A/B testing

- [ ] **Email marketing**
  - Onboarding emails
  - Rappels tests incomplets
  - Newsletter

---

## 🎨 Design System

### Couleurs principales

```css
/* Primaires */
--declic-blue: #2563EB
--declic-coral: #FF6B35

/* Secondaires */
--declic-green: #10B981
--declic-amber: #F59E0B

/* Neutres */
--declic-dark: #1F2937
--declic-light: #F3F4F6
```

### Composants UI

Tous dans `components/ui/`:

- **Button**: 5 variants (primary, secondary, premium, outline, ghost)
- **Card**: Avec animations Framer Motion
- **Badge**: 5 variants pour tags/statuts

### Animations

Framer Motion utilisé pour:
- Transitions de page
- Cards hover
- Progress bars
- Chat messages

---

## 🤝 Contribution

### Pour ajouter un nouveau test

1. Créer le fichier de questions dans `lib/personality-tests.ts`:

```typescript
export const nouveauTestQuestions: NouveauTestQuestion[] = [
  { id: 'nt_1', question: '...', /* ... */ },
  // ...
]

export function calculateNouveauTest(answers: { [key: string]: number }): string {
  // Logique de calcul
}
```

2. Créer la page du test dans `app/tests/nouveau-test/page.tsx`
   - Copier la structure de `app/tests/riasec/page.tsx`
   - Adapter aux questions du nouveau test

3. Ajouter dans `lib/design-system.ts`:

```typescript
export const availableTests = [
  // ... tests existants
  {
    id: 'nouveau-test',
    name: 'Nouveau Test',
    subtitle: 'Sous-titre',
    description: 'Description...',
    duration: '5-7 min',
    questions: 15,
    icon: '🎯',
    color: 'blue',
  },
]
```

---

## 📞 Support

- **Email**: support@déclik.fr (à configurer)
- **Issues GitHub**: [Créer une issue](https://github.com/...)
- **Documentation**: Ce README

---

## 📜 Licence

MIT License - Utilisation libre pour projets personnels et commerciaux

---

## 🙏 Crédits

- **Tests scientifiques**: RIASEC (Holland), MBTI (Myers-Briggs), Ennéagramme, VIA Institute
- **Métiers**: APEC, Pôle Emploi, INSEE
- **Stack**: Next.js, Tailwind CSS, Framer Motion, Claude API
- **Développement**: [Votre nom]

---

**Fait avec ❤️ pour aider les ados à trouver leur voie**

🚀 **DÉCLIC** - Trouve ta vraie voie
