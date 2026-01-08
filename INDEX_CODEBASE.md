# 🗺️ INDEX DU CODEBASE - 2iE GreenHub (PEVA)

> **Dernière mise à jour** : 4 janvier 2026
> **Objectif** : Carte centrale pour la navigation, le développement et la maintenance du projet.

---

## 🏗️ Structure Principale

| Répertoire | Description |
|------------|-------------|
| `peva/` | **Application Frontend (Vue.js + Vite)**. Le cœur du projet. |
| `docs/` | **Documentation & SQL**. Scripts de migration, rapports d'audit, guides techniques. |
| `script_tools/` | **Outils Node.js**. Scripts pour seeder la BDD, gérer les utilisateurs via API Supabase. |

---

## 💻 Application Frontend (`peva/`)

### 📂 `src/` - Code Source
L'architecture suit les standards Vue 3 + Pinia + Vuetify.

| Dossier/Fichier | Contenu & Responsabilité |
|-----------------|--------------------------|
| `views/` | **Pages de l'application**. Organisées par domaine (Admin, Public, Auth). |
| `services/` | **Logique métier & Appels API**. Interagit avec Supabase. |
| `stores/` | **Gestion d'état (Pinia)**. `auth.js` gère la session utilisateur. |
| `router/` | **Routing**. `index.js` définit les routes et les protections (Guards). |
| `components/` | **Composants réutilisables**. UI partagée. |
| `layouts/` | **Mises en page**. `DashboardLayout.vue`. |
| `composables/` | **Logique partagée**. `useSnackbar.js`, `usePerformance.js`. |
| `plugins/` | **Configuration**. `vuetify.js`. |
| `lib/supabase.js` | Client Supabase initialisé. |

### 🧩 Composants Clés (`peva/src/components/`)
- **Navigation** : `AppHeader.vue` (Menu principal), `DashboardNavigation.vue` (Sidebar).
- **Notifications** : `NotificationCenter.vue`, `NotificationManager.vue`.
- **Admin** : `admin/` (Composants spécifiques administration).
- **UI** : `ui/` (Éléments d'interface génériques).

### 🗺️ Cartographie des Vues (`peva/src/views/`)

#### 🔐 Authentification (`/auth/`)
- `LoginView.vue`, `RegisterView.vue` : Connexion/Inscription.
- `EmailVerificationView.vue`, `ResetPasswordView.vue` : Gestion de compte.

#### 👑 Administration (`/admin/`)
- **Dashboard** : `AdminDashboardView.vue` (Vue d'ensemble).
- **Gestion** : `AdminUsersView.vue`, `AdminGroupsView.vue`, `AdminEventsView.vue`.
- **Modération** : `AdminModerationView.vue` (Validation contenus).
- **Contenu** : `AdminForumView.vue`, `AdminEmailTemplatesView.vue`.
- **Config** : `AdminCountriesView.vue` (Pays/Villes), `AdminAnalyticsView.vue`.

#### 🌟 Fonctionnalités Principales
| Module | Vues Associées |
|--------|----------------|
| **Opportunités** | `OpportunitiesView` (Liste), `CreateOpportunityView` (Création), `OpportunityApplicationsView` (Candidatures). |
| **Événements** | `EventsView` (Calendrier), `CreateEventView` (Formulaire). |
| **Ressources** | `ResourcesView` (Bibliothèque), `SubmitResourceView` (Soumission). |
| **Communauté** | `GroupsView`, `CreateGroupView`, `ForumView`. |
| **Annuaire** | `DirectoryView` (Profils), `CompaniesView` (Entreprises), `MapView` (Carte interactive). |

#### 👤 Espace Utilisateur
- **Profil & Tableau de bord** : `UserDashboard.vue`, `ProfileView.vue`, `OnboardingView.vue`.
- **Réseau** : `ConnectionsView.vue` (Amis), `MessagesView.vue` (Chat).
- **Entreprise** : `CompanyManagementView.vue`, `RSEDashboard.vue` (Rapports RSE).

### 📧 Microservice Email (`peva/api/email-api/`)
Service Serverless (Node.js) pour l'envoi d'emails transactionnels (SMTP).
- **Code** : `api/send-email.js` (Endpoint Vercel)
- **Doc** : `README.md`
- **Déploiement** : Géré via `vercel.json` dans le sous-dossier.

### 🔑 Services Clés (`peva/src/services/`)

| Service | Fichier | Description |
|---------|---------|-------------|
| **Opportunités** | `opportunitiesService.js` | CRUD, Upload fichiers, Candidatures. |
| **Modération** | `admin/moderationService.js` | Approbation/Rejet de contenus. |
| **Email** | `emailService.js` | Envoi d'emails transactionnels (API). |
| **Auth/User** | `viewsService.js` | Récupération profils publics (Directory). |
| **Messagerie** | `messagesService.js` | Chat temps réel. |
| **RSE** | `rseService.js` | Gestion des rapports RSE. |

### 🛠️ Configuration & Déploiement

| Fichier | Usage | Règle Critique |
|---------|-------|----------------|
| `vercel.json` | Config déploiement Vercel. | **NE PAS TOUCHER**. Framework: `vite`. |
| `package.json` | Dépendances NPM. | Scripts: `dev`, `build`. |
| `.env` | Variables d'environnement. | URL Supabase, Clés API. |

### 🧪 Tests & Qualité (`peva/e2e/` & `peva/tests/`)
Tests E2E avec Playwright.
- **Specs** : `e2e/auth.spec.js`, `e2e/navigation.spec.js`.
- **Helpers** : `e2e/test-helpers.js`.
- **Config** : `playwright.config.js`.

### 📂 Autres Dossiers Importants
| Dossier | Contenu |
|---------|---------|
| `public/` | **Assets Statiques**. `favicon.ico`, `manifest.json`, `OneSignalSDKWorker.js`. |
| `scripts/` | **Maintenance**. `check-profiles-structure.js` (Audit données BDD). |

---

## 📚 Documentation & Base de Données (`docs/`)

Ce dossier contient la vérité terrain sur la structure de la base de données et les procédures.

### 🗄️ SQL & Migrations (Critique)

| Fichier | Description |
|---------|-------------|
| `create_opportunity_applications_table.sql` | **Workflow Candidatures**. Table + RLS + Templates Email. |
| `add_moderation_email_templates.sql` | **Templates Email**. Modération (Approuvé/Rejeté). |
| `SUPABASE_COMPLETE_SCHEMA.sql` | **Schéma Global**. Référence de base (peut être ancien, vérifier migrations récentes). |
| `POSTGRESQL_RLS_POLICIES.sql` | **Sécurité**. Politiques d'accès aux données. |

### 📖 Guides Techniques

| Fichier | Sujet |
|---------|-------|
| `WORKFLOW-OPPORTUNITES.md` | **Documentation Workflow**. Cycle de vie complet des opportunités. |
| `DEPLOIEMENT-VERCEL.md` | **Guide Déploiement**. Procédure officielle. |
| `EMAIL_SYSTEM.md` | **Système Email**. Architecture et templates. |
| `AUDIT_TABLES_PREFIXES.md` | **Conventions**. Règles de nommage (`pev_`). |

---

## ⚙️ Outils (`script_tools/`)

| Script | Usage |
|--------|-------|
| `create-users-via-api.js` | Création massive d'utilisateurs (Admin). |
| `seed-accounts.js` | Peuplement de la base avec des données de test. |
| `list-supabase-accounts.js` | Lister les comptes utilisateurs Supabase existants. |

---

## 🚀 Workflows Critiques

### 1. Déploiement Vercel
> **COMMANDE UNIQUE** : `vercel --prod` (depuis `peva/`)
> Ne jamais utiliser d'autres méthodes ou configurations complexes.

### 2. Migrations Base de Données
Toute modification de schéma DOIT :
1. Être écrite dans un fichier `.sql` dans `peva/supabase/migrations/`.
2. Utiliser le préfixe `pev_` pour les tables.
3. Inclure les politiques RLS.
4. Être testée dans l'éditeur SQL Supabase.

### 3. Workflow Opportunités
1. User crée (Status: `pending`).
2. Admin modère (`/admin/moderation`).
3. Si approuvé -> Public.
4. User postule -> Email sent.
5. Créateur gère (`/opportunities/:id/applications`).

---

## 📍 Indexation Rapide

- **Où modifier le menu ?** → `peva/src/App.vue` (Layout principal)
- **Où sont les routes ?** → `peva/src/router/index.js`
- **Où est la config Supabase ?** → `peva/src/lib/supabase.js`
- **Où sont les styles globaux ?** → `peva/src/assets/main.css` (ou Tailwind)

---

## ⚠️ Erreurs Courantes à Éviter

### 1. Erreur 400 - Colonne inexistante dans jointure Supabase
**Symptôme** : `column pev_profiles_1.XXXX does not exist`

**Cause** : Tentative de sélectionner une colonne qui n'existe pas dans la table jointe.

**Exemple d'erreur** :
```javascript
// ❌ MAUVAIS - 'organization' n'existe pas dans pev_profiles
user:user_id(id, first_name, last_name, email, avatar_url, organization)
```

**Solution** :
```javascript
// ✅ BON - Seulement les colonnes qui existent
user:user_id(id, first_name, last_name, email, avatar_url)
```

**Prévention** :
1. Faire un `grep_search` pour `from('pev_TABLE').select` avant d'écrire une jointure
2. Vérifier les colonnes utilisées dans les autres services
3. Ne JAMAIS supposer qu'une colonne existe

### 2. Variables réactives non définies
**Symptôme** : `ReferenceError: variableName is not defined`

**Cause** : Utilisation d'une variable dans une fonction sans l'avoir déclarée avec `ref()`.

**Solution** : Toujours déclarer les refs au début du `<script setup>` :
```javascript
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')
```

### 3. Colonnes connues de pev_profiles
| Colonne | Type |
|---------|------|
| `id` | UUID |
| `first_name`, `last_name` | text |
| `email` | text |
| `avatar_url` | text |
| `phone` | text |
| `role` | user_role_global |
| `onboarding_completed` | boolean |
| `country` | text |

> ⚠️ **PAS de colonne `organization`** - Cette info est dans `pev_companies`

---

## 📝 Journal des Modifications

### 08/01/2026 - 22:58 UTC - Refonte EventsView.vue

**Fichier modifié** : `src/views/EventsView.vue`

#### ✅ Modifications effectuées :

| Action | Détail |
|--------|--------|
| **Onglet CARTE supprimé** | Décision : pas pertinent sans colonnes `latitude`/`longitude` |
| **Onglet HISTORIQUE supprimé** | Décision : fonctionnalité non prioritaire |
| **Onglet LISTE implémenté** | Vue liste avec filtres et grille de cartes |
| **Onglet MES ÉVÉNEMENTS** | Redirection vers `/my-events` avec vérification auth |

#### 📋 Détails de l'onglet LISTE :

**Filtres ajoutés** (lignes 753-760) :
```javascript
const listFilters = ref({
  category: null,
  type: null,
  isFree: null,
  search: ''
})
const listSort = ref('date_asc')
```

**Fonctionnalités** :
- Filtre par catégorie (dropdown)
- Filtre par type d'événement (Conférence, Formation, etc.)
- Filtre Gratuit/Payant
- Recherche textuelle (titre, description, lieu)
- Tri par date ascendant/descendant
- Grille responsive avec cartes événements
- Bouton "S'inscrire" sur chaque carte

**Computed `filteredListEvents`** (lignes 762-802) :
- Filtre uniquement les événements à venir
- Applique les filtres utilisateur
- Trie selon la préférence

#### 📋 Détails de MES ÉVÉNEMENTS :

**Fonction `goToMyEvents`** (lignes 804-812) :
```javascript
const goToMyEvents = () => {
  if (!authStore.isAuthenticated) {
    snackbar.value = { show: true, message: 'Connectez-vous...', color: 'warning' }
    activeTab.value = 'calendar'
    return
  }
  router.push('/my-events')
}
```

#### 🗑️ Lignes supprimées :
- Onglets CARTE et HISTORIQUE dans le template (anciennes lignes 72-83)

---

### 08/01/2026 - 23:30 UTC - Implémentation Actions Profil Utilisateur

**Fichiers créés/modifiés** :

| Fichier | Action |
|---------|--------|
| `src/views/UserProfileView.vue` | ✅ CRÉÉ - Vue profil autre utilisateur |
| `src/router/index.js` | Ajout route `/user/:id` |
| `src/services/connectionService.js` | Ajout fonctions favoris utilisateurs |
| `src/views/ProfileView.vue` | Nettoyage boutons incohérents |

**Fonctionnalités implémentées** :
- **Ajouter à mon réseau** : Dialog avec message personnalisé, utilise `connectionService.sendRequest()`
- **Envoyer un message** : Utilise `messagesService.getOrCreateDirectConversation()`, redirige vers `/messages`
- **Ajouter aux favoris** : Utilise `entity_type: 'user'` dans `pev_favorites`

**Fonctions ajoutées dans connectionService.js** :
```javascript
addUserToFavorites(targetUserId)
removeUserFromFavorites(targetUserId)
isUserFavorite(targetUserId)
```

**Route ajoutée** : `/user/:id` → `UserProfileView.vue`

---

### 08/01/2026 - 22:00 UTC - Fix OpportunityApplicationsView.vue

**Fichier modifié** : `src/views/OpportunityApplicationsView.vue`

| Erreur | Solution |
|--------|----------|
| `column pev_profiles_1.organization does not exist` | Retiré `organization` de la jointure Supabase |
| `ReferenceError: snackbarMessage is not defined` | Ajouté déclarations `ref()` manquantes |

**Lignes modifiées** : 298-301, 365
