# Guide Authentification & Onboarding - 2iE GreenHub

**Date de création:** 5 février 2026  
**Dernière mise à jour:** 5 février 2026  
**Statut:** ✅ Fonctionnel

---

## 📋 Résumé

Ce document décrit l'architecture complète du système d'authentification et d'onboarding de la plateforme 2iE GreenHub (PEVA), les corrections apportées le 5 février 2026, et les règles à suivre pour éviter les erreurs récurrentes.

---

## 🏗️ Architecture du Flux d'Inscription

### Chaîne de données complète

```
┌─────────────────────┐
│   RegisterView.vue  │  Formulaire d'inscription
│   - firstName       │  (Prénom)
│   - lastName        │  (Nom de famille)
│   - email           │
│   - password        │
│   - profileType     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     auth.js         │  Store Pinia
│  createUserViaAPI() │  Appelle l'API Vercel
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ send-confirmation.js│  API Vercel (serverless)
│  - Crée user auth   │  via Supabase Admin API
│  - Crée pev_profiles│  avec first_name, last_name
│  - Envoie email     │  de confirmation
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Supabase          │
│  - auth.users       │  user_metadata contient first_name, last_name
│  - pev_profiles     │  Profil avec toutes les infos
└─────────────────────┘
```

---

## 📁 Fichiers Impliqués

| Fichier | Rôle |
|---------|------|
| `src/views/auth/RegisterView.vue` | Formulaire d'inscription (collecte firstName, lastName) |
| `src/stores/auth.js` | Store Pinia - gestion authentification |
| `api/email-api/api/send-confirmation.js` | API Vercel - création user + profil + email |
| `src/views/OnboardingView.vue` | Formulaire d'onboarding (étapes 1-4) |
| `src/views/auth/VerifyEmailView.vue` | Page de vérification email |

---

## 🔧 Corrections du 5 février 2026

### Problème initial
- Erreur `null value in column "last_name" of relation "pev_profiles" violates not-null constraint`
- Le `lastName` était collecté dans le formulaire mais jamais transmis à l'API

### Corrections apportées

#### 1. `api/email-api/api/send-confirmation.js`

**Avant:**
```javascript
const { email, firstName, redirectTo, password } = req.body;
```

**Après:**
```javascript
const { email, firstName, lastName, redirectTo, password, userData } = req.body;
```

**Création user avec lastName:**
```javascript
const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
  email: email,
  password: password,
  email_confirm: false,
  user_metadata: {
    first_name: firstName,
    last_name: lastName  // ← AJOUTÉ
  }
});
```

**Création profil avec lastName:**
```javascript
const { error: profileError } = await supabaseAdmin
  .from('pev_profiles')
  .insert({
    id: user.id,
    email: email,
    first_name: firstName,
    last_name: lastName,  // ← CORRIGÉ (était userData?.lastName)
    role: 'user',
    user_type: 'user',
    onboarding_completed: false
  });
```

#### 2. `src/stores/auth.js`

**createUserViaAPI - passe lastName:**
```javascript
body: JSON.stringify({
  email,
  firstName: userData.firstName,
  lastName: userData.lastName,  // ← Pas de valeur par défaut
  redirectTo: `${window.location.origin}/auth/verify`,
  password,
  userData
})
```

**updateProfile - utilise user_metadata:**
```javascript
const firstName = user.value.user_metadata?.first_name
const lastName = user.value.user_metadata?.last_name
```

---

## ⚠️ RÈGLES CRITIQUES

### ❌ NE JAMAIS FAIRE

1. **Ne jamais mettre de valeurs par défaut pour les champs du formulaire**
   ```javascript
   // ❌ MAUVAIS
   firstName: userData.firstName || 'Utilisateur'
   lastName: userData.lastName || 'Non défini'
   
   // ✅ BON
   firstName: userData.firstName
   lastName: userData.lastName
   ```

2. **Ne jamais supposer qu'un champ existe sans le récupérer**
   ```javascript
   // ❌ MAUVAIS - lastName non récupéré du body
   const { email, firstName } = req.body;
   last_name: userData?.lastName  // userData peut ne pas contenir lastName
   
   // ✅ BON - récupérer explicitement
   const { email, firstName, lastName } = req.body;
   last_name: lastName
   ```

3. **Ne jamais ignorer les champs requis de la BDD**
   - Vérifier les contraintes `NOT NULL` avant de coder
   - Si un champ est requis en BDD, il DOIT être collecté dans le formulaire

### ✅ TOUJOURS FAIRE

1. **Tracer le flux complet des données**
   - Formulaire → Store → API → BDD
   - Vérifier que chaque champ passe à travers toute la chaîne

2. **Vérifier la structure de la table avant de coder**
   ```sql
   SELECT column_name, is_nullable, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'pev_profiles';
   ```

3. **Logger les données à chaque étape**
   ```javascript
   console.log('Données reçues:', req.body)
   console.log('Données à insérer:', profileData)
   ```

4. **Utiliser optional chaining pour éviter les erreurs**
   ```javascript
   const firstName = user.value.user_metadata?.first_name
   ```

---

## 📊 Structure de la table `pev_profiles`

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | uuid | NON | FK vers auth.users |
| email | text | NON | Email de l'utilisateur |
| first_name | text | OUI* | Prénom |
| last_name | text | OUI* | Nom de famille |
| display_name | text | OUI | Nom affiché |
| role | text | NON | 'user', 'admin', 'super_admin' |
| user_type | text | NON | Type d'utilisateur |
| phone | text | OUI | Téléphone |
| country | text | OUI | Pays |
| city | text | OUI | Ville |
| onboarding_completed | boolean | NON | État onboarding |
| experience_level | text | OUI | Niveau d'expérience |
| goals | jsonb | OUI | Objectifs |
| sdg_priorities | jsonb | OUI | Priorités ODD |

*\* Rendus nullable le 5 février 2026 pour éviter les erreurs*

---

## 🔄 Flux d'Onboarding

### Étapes

1. **Informations personnelles** - phone, country, city, location
2. **Profil professionnel** - userType, organization, position, sectors, bio
3. **Objectifs** - goals, sdgPriorities, experienceLevel
4. **Préférences** - notifications, language, privacy

### Données sauvegardées

```javascript
// OnboardingView.vue → authStore.updateProfile()
const profileData = {
  phone: onboardingData.phone,
  country: onboardingData.country,
  city: onboardingData.city,
  location: onboardingData.location,
  user_type: onboardingData.userType,
  organization: onboardingData.organization,
  position: onboardingData.position,
  sectors: onboardingData.sectors,
  bio: onboardingData.bio,
  goals: onboardingData.goals,
  sdg_priorities: onboardingData.sdgPriorities,
  experience_level: onboardingData.experienceLevel,
  language: onboardingData.language,
  notification_preferences: onboardingData.notifications,
  privacy_settings: onboardingData.privacy,
  onboarding_completed: true
}
```

---

## 🚀 Déploiement

### API Email (Vercel)
```bash
cd c:\wamp64\www\peva_appweb\peva\api\email-api
vercel --prod
```

### Application Frontend (Vercel)
```bash
cd c:\wamp64\www\peva_appweb\peva
vercel --prod
```

---

## 🧪 Test du Flux Complet

### Script de diagnostic
```bash
cd c:\wamp64\www\peva_appweb\peva\script_tools
node diagnose-profiles.cjs
```

### Supprimer un utilisateur de test
```bash
node list-users.cjs "email@test.com"
# Puis supprimer via le panel Supabase ou script
```

### Vérifier un profil
```javascript
const { data } = await supabase
  .from('pev_profiles')
  .select('*')
  .eq('email', 'user@example.com')
  .single()
console.log(data)
```

---

## 📝 Checklist Avant Déploiement

- [ ] Tous les champs du formulaire sont passés à l'API
- [ ] L'API récupère tous les champs du body
- [ ] Les champs sont stockés dans user_metadata ET pev_profiles
- [ ] Pas de valeurs par défaut pour les champs utilisateur
- [ ] Les contraintes NOT NULL sont respectées
- [ ] L'email de confirmation contient le bon lien
- [ ] Le profil est créé avec toutes les données

---

## 🔗 Ressources

- **Supabase Dashboard:** https://supabase.benga.live
- **API Email:** https://apiemail2iegreenhub.vercel.app
- **Application:** https://app.2iegreenhub.org
- **Documentation Supabase Auth:** https://supabase.com/docs/guides/auth

---

*Document généré automatiquement - 2iE GreenHub Platform*
