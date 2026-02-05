# 📋 Rapport - Types de Profil

**Date:** 5 février 2026  
**Objet:** Vérification de l'implémentation des nouveaux types de profil demandés par le client

---

## 🎯 Demande Client

| Ancien Type | Nouveau Type Demandé |
|-------------|---------------------|
| Organisation | Partenaires techniques et financiers (PTF) |
| Recruteurs | Entreprises |
| Investisseur | Investisseur/banque |
| Entrepreneur | Apprenant |
| *(nouveau)* | Institution de recherche/Université |

---

## ❌ Statut: NON IMPLÉMENTÉ dans RegisterView

### Fichier: `src/views/auth/RegisterView.vue` (lignes 386-421)

**Types actuels (ANCIENS):**

| Value | Label Affiché | Demande Client |
|-------|---------------|----------------|
| `entrepreneur` | Entrepreneur | ❌ Doit devenir **Apprenant** |
| `investor` | Investisseur | ⚠️ Doit devenir **Investisseur/banque** |
| `expert` | Expert/Consultant | ✅ OK (à garder) |
| `organization` | Organisation | ❌ Doit devenir **PTF** |
| `recruiter` | Recruteur | ❌ Doit devenir **Entreprises** |
| *(manquant)* | - | ❌ Ajouter **Institution de recherche/Université** |

```javascript
// CODE ACTUEL (à modifier)
const profileTypes = [
  { value: 'entrepreneur', title: 'Entrepreneur', ... },      // ❌
  { value: 'investor', title: 'Investisseur', ... },          // ⚠️
  { value: 'expert', title: 'Expert/Consultant', ... },       // ✅
  { value: 'organization', title: 'Organisation', ... },      // ❌
  { value: 'recruiter', title: 'Recruteur', ... }             // ❌
]
```

---

## ⚠️ Incohérence Détectée

### DirectoryView.vue a les NOUVEAUX types (lignes 425-434)

```javascript
const typeLabels = {
  ptf: 'Partenaires techniques et financiers (PTF)',     // ✅ Nouveau
  company: 'Entreprises',                                 // ✅ Nouveau
  investor: 'Investisseur/banque',                        // ✅ Nouveau
  learner: 'Apprenant',                                   // ✅ Nouveau
  research: 'Institution de recherche/Université',        // ✅ Nouveau
  expert: 'Expert',
  user: 'Utilisateur',
  admin: 'Administrateur'
}
```

### OnboardingView.vue a d'AUTRES types (lignes 442-447)

```javascript
const userTypes = [
  { title: 'Entrepreneur', value: 'entrepreneur' },       // Ancien
  { title: 'Investisseur', value: 'investor' },           // Ancien
  { title: 'Chercheur/Académique', value: 'researcher' }, // Différent
  { title: 'ONG/Association', value: 'ngo' },             // Différent
  { title: 'Institution publique', value: 'public' },     // Différent
]
```

---

## 📊 Résumé des Incohérences

| Fichier | Types Utilisés | Cohérent avec demande client ? |
|---------|---------------|-------------------------------|
| `RegisterView.vue` | Anciens (entrepreneur, investor, organization, recruiter) | ❌ **NON** |
| `OnboardingView.vue` | Mixtes (entrepreneur, investor, researcher, ngo, public) | ❌ **NON** |
| `DirectoryView.vue` | Nouveaux (ptf, company, learner, research, investor) | ✅ **OUI** |

---

## 🔧 Actions Requises

### 1. Modifier `RegisterView.vue`

Remplacer les `profileTypes` par:

```javascript
const profileTypes = [
  {
    value: 'learner',
    title: 'Apprenant',
    description: 'Étudiant ou professionnel en formation',
    icon: 'mdi-school',
    color: 'orange'
  },
  {
    value: 'investor',
    title: 'Investisseur/banque',
    description: 'Financeur de projets verts et durables',
    icon: 'mdi-bank',
    color: 'green'
  },
  {
    value: 'expert',
    title: 'Expert/Consultant',
    description: 'Spécialiste en développement durable',
    icon: 'mdi-account-tie',
    color: 'blue'
  },
  {
    value: 'ptf',
    title: 'Partenaires techniques et financiers (PTF)',
    description: 'ONG, bailleurs, institutions de développement',
    icon: 'mdi-handshake',
    color: 'purple'
  },
  {
    value: 'company',
    title: 'Entreprises',
    description: 'Entreprise du secteur vert',
    icon: 'mdi-domain',
    color: 'teal'
  },
  {
    value: 'research',
    title: 'Institution de recherche/Université',
    description: 'Centre de recherche ou établissement académique',
    icon: 'mdi-flask',
    color: 'indigo'
  }
]
```

### 2. Modifier `OnboardingView.vue`

Aligner les `userTypes` avec les mêmes valeurs.

### 3. Vérifier Supabase

S'assurer que la colonne `user_type` dans `pev_profiles` accepte les nouvelles valeurs:
- `learner`
- `investor`
- `expert`
- `ptf`
- `company`
- `research`

---

## ⚠️ Impact Base de Données

Si des utilisateurs existent déjà avec les anciens types (`entrepreneur`, `organization`, `recruiter`), il faudra:

1. **Migrer les données existantes:**
```sql
UPDATE pev_profiles SET user_type = 'learner' WHERE user_type = 'entrepreneur';
UPDATE pev_profiles SET user_type = 'ptf' WHERE user_type = 'organization';
UPDATE pev_profiles SET user_type = 'company' WHERE user_type = 'recruiter';
```

2. **Ou créer un mapping** dans le code pour afficher correctement les anciens types.

---

## 📝 Conclusion

| Élément | Statut |
|---------|--------|
| Nouveaux types dans RegisterView | ✅ **Implémenté** |
| Nouveaux types dans OnboardingView | ✅ **Implémenté** |
| Nouveaux types dans DirectoryView | ✅ **Implémenté** |
| Cohérence globale | ✅ **Cohérent** |

---

## ✅ Modifications Effectuées (5 février 2026)

### 1. RegisterView.vue - Types mis à jour
```javascript
const profileTypes = [
  { value: 'learner', title: 'Apprenant' },
  { value: 'investor', title: 'Investisseur/banque' },
  { value: 'expert', title: 'Expert/Consultant' },
  { value: 'ptf', title: 'Partenaires techniques et financiers (PTF)' },
  { value: 'company', title: 'Entreprises' },
  { value: 'research', title: 'Institution de recherche/Université' }
]
```

### 2. OnboardingView.vue - Types mis à jour
```javascript
const userTypes = [
  { title: 'Apprenant', value: 'learner' },
  { title: 'Investisseur/banque', value: 'investor' },
  { title: 'Expert/Consultant', value: 'expert' },
  { title: 'Partenaires techniques et financiers (PTF)', value: 'ptf' },
  { title: 'Entreprises', value: 'company' },
  { title: 'Institution de recherche/Université', value: 'research' }
]
```

### 3. DirectoryView.vue - Déjà correct
Les typeLabels étaient déjà à jour.

---

## ⚠️ Note Base de Données

La colonne `user_type` dans `pev_profiles` doit accepter les nouvelles valeurs:
- `learner`
- `investor`
- `expert`
- `ptf`
- `company`
- `research`

Si la colonne utilise un type ENUM, une migration sera nécessaire.

---

**Document mis à jour le 5 février 2026**
