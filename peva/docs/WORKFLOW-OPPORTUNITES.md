# Workflow Opportunités - Documentation Complète

> **Date de mise à jour** : 4 janvier 2026  
> **Commit** : `810bc7d`

---

## 📋 Vue d'ensemble

Le workflow opportunités gère le cycle de vie complet d'une opportunité sur la plateforme 2iE GreenHub, depuis sa création jusqu'à la gestion des candidatures.

---

## 🔄 Flux principal

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CRÉATION D'OPPORTUNITÉ                          │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  CreateOpportunityView.vue                                          │
│  - Formulaire en 3 étapes                                           │
│  - Types: Appels à projets, Stages, Thèses, Emplois, etc.          │
│  - Upload fichiers vers Supabase Storage                            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  opportunitiesService.createOpportunity()                           │
│  - status: 'pending' (IMPORTANT: modération obligatoire)            │
│  - created_by: ID de l'utilisateur                                  │
│  - Insertion dans pev_opportunities                                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        MODÉRATION (Admin)                           │
│  Route: /admin/moderation                                           │
│  Vue: AdminModerationView.vue                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  ✅ APPROUVÉ          │        │  ❌ REJETÉ            │
│  status: 'published'  │        │  status: 'rejected'   │
│  Email: opportunity_  │        │  Email: opportunity_  │
│         approved      │        │         rejected      │
└──────────────────────┘        └──────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     AFFICHAGE PUBLIC                                │
│  Route: /opportunities                                              │
│  Vue: OpportunitiesView.vue                                         │
│  - Filtre: status = 'published' uniquement                          │
│  - Filtres: type, secteur, localisation, montant                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CANDIDATURE                                  │
│  Fonction: applyToOpportunity()                                     │
│  - Vérifie authentification                                         │
│  - Bloque auto-candidature (créateur)                               │
│  - Vérifie si déjà postulé                                          │
│  - Insère dans pev_opportunity_applications                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  📧 Email candidat    │        │  📧 Email créateur    │
│  Template:            │        │  Template:            │
│  application_sent     │        │  application_received │
└──────────────────────┘        └──────────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  GESTION CANDIDATURES (Créateur)                    │
│  Route: /opportunities/:id/applications                             │
│  Vue: OpportunityApplicationsView.vue                               │
│  - Liste des candidatures avec filtres                              │
│  - Statistiques (total, en attente, acceptées, refusées)            │
│  - Actions: Accepter / Refuser                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  ✅ ACCEPTÉE          │        │  ❌ REFUSÉE           │
│  Email: application_  │        │  Email: application_  │
│         accepted      │        │         rejected      │
└──────────────────────┘        └──────────────────────┘
```

---

## 📁 Fichiers impliqués

### Frontend (Vue.js)

| Fichier | Rôle |
|---------|------|
| `src/views/CreateOpportunityView.vue` | Formulaire création en 3 étapes |
| `src/views/OpportunitiesView.vue` | Liste publique + candidature |
| `src/views/OpportunityApplicationsView.vue` | Gestion candidatures (créateur) |
| `src/views/admin/AdminModerationView.vue` | Modération admin |

### Services

| Fichier | Rôle |
|---------|------|
| `src/services/opportunitiesService.js` | CRUD opportunités + upload fichiers |
| `src/services/viewsService.js` | Requêtes lecture publique |
| `src/services/admin/moderationService.js` | Approbation/Rejet + envoi emails |
| `src/services/emailService.js` | Envoi emails via templates |

### Base de données (Supabase)

| Table | Rôle |
|-------|------|
| `pev_opportunities` | Données des opportunités |
| `pev_opportunity_applications` | Candidatures |
| `pev_email_templates` | Templates d'emails |

---

## 🗄️ Structure de la table `pev_opportunities`

```sql
id                  UUID PRIMARY KEY
title               VARCHAR(255) NOT NULL
description         TEXT
type                VARCHAR(50) -- appels_projets, stages, theses, emplois, etc.
category            VARCHAR(100)
status              VARCHAR(20) -- draft, pending, published, rejected
location            VARCHAR(255)
deadline            TIMESTAMPTZ
salary_min          DECIMAL
salary_max          DECIMAL
created_by          UUID REFERENCES auth.users(id) NOT NULL
company_id          UUID REFERENCES pev_companies(id)
created_at          TIMESTAMPTZ DEFAULT NOW()
updated_at          TIMESTAMPTZ DEFAULT NOW()
```

---

## 🗄️ Structure de la table `pev_opportunity_applications`

```sql
id                  UUID PRIMARY KEY
opportunity_id      UUID REFERENCES pev_opportunities(id) ON DELETE CASCADE
user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE
status              VARCHAR(20) -- pending, reviewed, accepted, rejected, withdrawn
cover_letter        TEXT
resume_url          VARCHAR(500)
portfolio_url       VARCHAR(500)
applicant_notes     TEXT
reviewer_notes      TEXT
rejection_reason    TEXT
reviewed_by         UUID REFERENCES auth.users(id)
reviewed_at         TIMESTAMPTZ
created_at          TIMESTAMPTZ DEFAULT NOW()
updated_at          TIMESTAMPTZ DEFAULT NOW()

UNIQUE(opportunity_id, user_id)  -- Un user ne peut postuler qu'une fois
```

### Politiques RLS (8 politiques)

1. Users can view own applications
2. Opportunity creators can view applications
3. Admins can view all applications
4. Users can create own applications
5. Users can update own applications
6. Opportunity creators can update application status
7. Admins can update all applications
8. Users can delete own applications

---

## 📧 Templates d'emails

### Modération

| Code | Sujet | Destinataire |
|------|-------|--------------|
| `opportunity_approved` | ✅ Votre opportunité a été approuvée | Créateur |
| `opportunity_rejected` | ❌ Modifications requises | Créateur (+ motif) |

### Candidatures

| Code | Sujet | Destinataire |
|------|-------|--------------|
| `application_sent` | ✅ Candidature envoyée | Candidat |
| `application_received` | 📩 Nouvelle candidature | Créateur |
| `application_accepted` | 🎉 Candidature acceptée | Candidat |
| `application_rejected` | Mise à jour candidature | Candidat |

---

## 🛣️ Routes

| Route | Composant | Accès |
|-------|-----------|-------|
| `/opportunities` | OpportunitiesView | Public |
| `/opportunities/create` | CreateOpportunityView | Authentifié |
| `/opportunities/:id/applications` | OpportunityApplicationsView | Créateur/Admin |
| `/admin/moderation` | AdminModerationView | Admin |

---

## 🔐 Contrôle d'accès

### Création d'opportunité
- ✅ Utilisateur authentifié

### Candidature
- ✅ Utilisateur authentifié
- ❌ Créateur de l'opportunité (bloqué)
- ❌ Déjà postulé (bloqué)

### Gestion candidatures
- ✅ Créateur de l'opportunité
- ✅ Admin / Super Admin / Modérateur

### Modération
- ✅ Admin / Super Admin / Modérateur

---

## 📝 Corrections apportées (Audit Janvier 2026)

### 1. Status de modération
**Fichier** : `opportunitiesService.js:127-128`
```javascript
// AVANT (bug: publication directe sans modération)
status: 'published'

// APRÈS (correction: modération obligatoire)
status: 'pending'
```

### 2. Envoi emails modération
**Fichier** : `moderationService.js`
- Ajout import `emailService`
- Ajout fonction `sendModerationEmail()`
- Intégration dans `approveContent()` et `rejectContent()`

### 3. Table candidatures
**Fichier** : `create_opportunity_applications_table.sql`
- Création table `pev_opportunity_applications`
- 8 politiques RLS
- Index de performance
- Templates email candidatures

### 4. Vue gestion candidatures
**Fichier** : `OpportunityApplicationsView.vue`
- Liste candidatures avec filtres
- Statistiques
- Actions Accepter/Refuser
- Envoi emails automatique

### 5. Route manquante
**Fichier** : `router/index.js`
- Ajout `/opportunities/:id/applications`

---

## 🧪 Tests recommandés

1. **Création opportunité** → Vérifier status = 'pending' en BDD
2. **Modération approuver** → Vérifier email reçu par créateur
3. **Modération rejeter** → Vérifier email avec motif
4. **Candidature** → Vérifier emails candidat + créateur
5. **Gestion candidatures** → Accès uniquement créateur/admin
6. **Accepter candidature** → Vérifier email au candidat
7. **Refuser candidature** → Vérifier email au candidat

---

## 📊 Migrations SQL à exécuter

```bash
# Dans Supabase SQL Editor, exécuter dans l'ordre:
1. create_opportunity_applications_table.sql
2. add_moderation_email_templates.sql (si pas déjà fait)
```

---

## ✅ Statut actuel

| Composant | Status |
|-----------|--------|
| Création opportunité | ✅ Fonctionnel |
| Modération admin | ✅ Fonctionnel |
| Emails modération | ✅ Intégrés |
| Candidature | ✅ Fonctionnel |
| Emails candidature | ✅ Intégrés |
| Gestion candidatures | ✅ Fonctionnel |
| Table pev_opportunity_applications | ✅ Créée |
| Politiques RLS | ✅ 8 actives |
