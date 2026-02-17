# 🚀 Guide de Démarrage Rapide - DÉCLIC

## ✅ Ce qui a été fait

### 1. **Design System Complet** ✨
- Nouvelles couleurs modernes (#2563EB bleu, #FF6B35 coral, etc.)
- 3 polices: Inter (titres), Poppins (corps), Outfit (accent)
- Composants réutilisables: Button, Card, Badge
- Configuration Tailwind personnalisée

### 2. **Structure complète du site** 🏗️

#### Pages créées:
- ✅ `/landing` - Landing page moderne avec animations
- ✅ `/signup` - Inscription légère
- ✅ `/dashboard` - Dashboard principal avec KLIC intégré
- ✅ `/tests/riasec` - Test RIASEC interactif (exemple)
- ✅ `/recommendations` - Recommandations métiers avec RAG
- ✅ `/upgrade` - Page Premium avec comparaison

#### Composants UI:
- ✅ `Button.tsx` - Boutons avec 5 variants
- ✅ `Card.tsx` - Cards avec animations Framer Motion
- ✅ `Badge.tsx` - Badges pour tags/statuts

#### Configuration:
- ✅ `design-system.ts` - Couleurs, constantes, config Freemium
- ✅ `personality-tests.ts` - 4 tests avec questions et calculs
- ✅ `tailwind.config.js` - Couleurs et polices personnalisées

### 3. **Fonctionnalités implémentées** 🎯

- ✅ Système Freemium (gratuit vs premium)
- ✅ Interface chatbot KLIC avec personnalité
- ✅ Test RIASEC interactif complet
- ✅ Intégration RAG (recherche sémantique métiers)
- ✅ Recommandations personnalisées
- ✅ Animations Framer Motion partout
- ✅ Design responsive mobile-first

---

## 🚀 Lancer le projet MAINTENANT

### 1. Vérifier que tout est installé

```bash
# Framer Motion (déjà installé)
npm list framer-motion

# Si manquant:
npm install framer-motion
```

### 2. Lancer le serveur

```bash
npm run dev
```

### 3. Ouvrir dans le navigateur

[http://localhost:3000](http://localhost:3000)

**Tu seras redirigé vers `/landing` automatiquement!**

---

## 📱 Parcours utilisateur complet

### Étape 1: Landing Page
- Accueillante, moderne, animations
- Présentation des tests
- CTA "Commencer gratuitement"
- Section pricing (clic sur "Voir les tarifs")

### Étape 2: Inscription
- Formulaire léger (prénom, email, mot de passe, âge)
- Validation simple
- Stockage en localStorage (démo)

### Étape 3: Dashboard
- Vue d'ensemble des 4 tests
- Interface chat KLIC sur le côté
- Compteurs (tests restants, messages KLIC)
- Badges Gratuit/Premium

### Étape 4: Faire un test
- Exemple: Clic sur "RIASEC"
- Interface interactive avec progress bar
- Échelle 1-5 avec emojis
- Résultats détaillés à la fin
- Redirection vers recommandations

### Étape 5: Recommandations métiers
- 5 métiers en gratuit (25 en premium)
- Cards avec salaire, secteur, description
- Liens vers fiches APEC
- Boutons "Plan d'action" (premium only)

### Étape 6: Upgrade Premium
- Comparaison Gratuit vs Premium
- Prix: €14.99 une fois
- Garantie 30 jours
- FAQ

---

## 🎨 Aperçu du Design

### Couleurs principales:
```
Bleu primaire: #2563EB
Coral: #FF6B35
Vert: #10B981
Amber: #F59E0B
```

### Animations:
- Fade in/out sur pages
- Hover effects sur cards
- Progress bars animées
- Chat messages slide in

### Typographie:
- **Titres**: Inter (bold, black)
- **Corps**: Poppins (regular, medium)
- **Accent**: Outfit (bold)

---

## 🔧 Personnaliser

### Changer le nom du site

Dans `lib/design-system.ts`:
```typescript
export const klicPersonality = {
  name: 'TON_NOM',  // Change ici
  // ...
}
```

Puis remplacer "DÉCLIC" dans:
- `app/landing/page.tsx`
- `app/dashboard/page.tsx`
- `app/layout.tsx`

### Changer les couleurs

Dans `tailwind.config.js`:
```js
colors: {
  'declic': {
    blue: '#TaCouleur',
    coral: '#TaCouleur',
    // ...
  },
}
```

### Modifier les tests

Dans `lib/personality-tests.ts`:
- Ajouter/supprimer questions
- Modifier calculs de résultats
- Changer descriptions

---

## 📋 TODO - Prochaines étapes

### Urgent (Priorité 1)

1. **Intégrer vraie API Claude**
   - Fichier: `app/dashboard/page.tsx`
   - Fonction: `getKlicResponse()`
   - Remplacer réponses simulées par appels API Anthropic

2. **Créer les 3 autres tests**
   - Copier `app/tests/riasec/page.tsx`
   - Créer: `/tests/mbti`, `/tests/enneagram`, `/tests/via`
   - Adapter aux questions de chaque test

3. **Authentification réelle**
   - Remplacer localStorage
   - Utiliser Supabase ou PostgreSQL
   - Intégrer NextAuth.js

### Important (Priorité 2)

4. **Page de login** (actuellement juste signup)
5. **Génération PDF plans d'action**
6. **Intégration paiement Stripe**
7. **Page de profil utilisateur**
8. **Système de favoris métiers**

### Nice to have (Priorité 3)

9. **Analytics** (Google Analytics)
10. **Email marketing** (onboarding, rappels)
11. **Améliorer RAG** (GPT-4 pour descriptions)
12. **A/B testing** landing page

---

## 🐛 Bugs connus / Limitations

### Actuellement:

1. **Authentification**: LocalStorage seulement (pas de vraie DB)
   - Solution: Intégrer Supabase/PostgreSQL

2. **KLIC**: Réponses simulées (pas d'IA réelle)
   - Solution: Intégrer API Claude (Anthropic)

3. **Paiement**: Bouton "Upgrade" simule juste changement de statut
   - Solution: Intégrer Stripe

4. **Tests**: Seul RIASEC est complet
   - Solution: Créer pages pour MBTI, Enneagram, VIA

5. **Plans d'action**: Bouton présent mais pas de génération PDF
   - Solution: Implémenter avec jsPDF

---

## 🎯 Tester le parcours complet

### Scénario de test:

1. **Landing**: Visite [http://localhost:3000](http://localhost:3000)
   - Vérifie animations, design
   - Clique "Voir les tarifs"

2. **Signup**: Crée un compte
   - Prénom: Lucas
   - Email: test@test.com
   - Mot de passe: 123456
   - Âge: 16

3. **Dashboard**: Tu arrives sur le dashboard
   - Vois les 4 tests
   - Chat KLIC sur le côté
   - Compteur "1 restant" (gratuit)

4. **Chat KLIC**: Teste le chat
   - Tape: "test riasec"
   - KLIC répond (simulé)
   - 5 messages max en gratuit

5. **Test RIASEC**: Clique sur la card RIASEC
   - Fais le test (18 questions)
   - Vois le résultat (code 3 lettres)
   - Clique "Voir recommandations"

6. **Recommandations**: Vois tes métiers
   - 5 métiers max (gratuit)
   - Banner "X métiers verrouillés"
   - Bouton "Débloquer Premium"

7. **Upgrade**: Clique sur Premium
   - Vois comparaison Gratuit/Premium
   - Prix €14.99
   - FAQ

8. **Simuler Premium**: Clique "Débloquer Premium"
   - Retour dashboard
   - Badge "Premium" activé
   - Tous tests débloqués
   - Chat illimité

---

## 💡 Conseils

### Pour le développement:

- **Design**: Tout est dans Tailwind, facile à modifier
- **Composants**: Réutilise Button/Card/Badge partout
- **Couleurs**: Définis dans `tailwind.config.js`
- **Tests**: Modèle dans `app/tests/riasec/page.tsx`
- **Animations**: Framer Motion déjà configuré

### Pour le lancement:

1. Configure d'abord l'API Claude (KLIC)
2. Crée les 3 autres tests
3. Intègre authentification réelle
4. Connecte Stripe pour paiement
5. Deploy sur Vercel (gratuit)

---

## 🆘 Problèmes courants

### Le serveur ne démarre pas
```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run dev
```

### Erreur Framer Motion
```bash
# Réinstaller
npm install framer-motion
```

### Erreur Tailwind (couleurs)
```bash
# Redémarrer serveur
npm run dev
```

### Tests ne marchent pas
- Vérifier `lib/personality-tests.ts`
- Vérifier import dans page du test

---

## 📞 Support

Si problème:
1. Vérifie ce guide
2. Lis `README_DECLIC.md`
3. Check la console navigateur (F12)
4. Check le terminal du serveur

---

**Prêt à lancer DÉCLIC! 🚀**

Commence par:
```bash
npm run dev
```

Puis visite: **http://localhost:3000**

Bon développement! 💪
