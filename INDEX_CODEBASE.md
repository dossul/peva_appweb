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
