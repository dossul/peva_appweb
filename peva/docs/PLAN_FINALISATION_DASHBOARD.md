# Plan de Finalisation Dashboard Admin 2iEGreenHub

**Date:** 2026-01-08  
**Objectif:** Finaliser les modules Gestion Contenu, Analytics et Signalements  
**Priorité:** Haute

---

## ✅ VÉRIFICATION WORKFLOW CANDIDATURE (Complété)

### Workflow Candidat (celui qui postule) - ✅ COMPLET

| Fonctionnalité | État | Fichier |
|----------------|------|---------|
| Dialog formulaire candidature | ✅ | `OpportunitiesView.vue:425-489` |
| Upload CV (PDF, DOC, DOCX) | ✅ | `opportunitiesService.js:218-230` |
| Upload Portfolio (PDF, DOC, DOCX, ZIP) | ✅ | `opportunitiesService.js:233-245` |
| Lettre de motivation | ✅ | `OpportunitiesView.vue:437-444` |
| Notes additionnelles | ✅ | `OpportunitiesView.vue:466-472` |
| Vérification anti-doublon | ✅ | `OpportunitiesView.vue:786-796` |
| Email confirmation candidat | ✅ | Template `application_sent` |
| Email notification créateur | ✅ | Template `application_received` |
| Bucket storage documents | ✅ | `create_all_storage_buckets.sql` |

### Workflow Créateur (celui qui a publié) - ⚠️ 1 LACUNE

| Fonctionnalité | État | Fichier |
|----------------|------|---------|
| Vue liste candidatures | ✅ | `OpportunityApplicationsView.vue` |
| Route `/opportunities/:id/applications` | ✅ | `router/index.js:321-326` |
| Filtres par statut | ✅ | `OpportunityApplicationsView.vue:70-75` |
| Affichage CV (bouton téléchargement) | ✅ | `OpportunityApplicationsView.vue:126-136` |
| Affichage Portfolio | ✅ | `OpportunityApplicationsView.vue:137-147` |
| Dialog lettre de motivation | ✅ | `OpportunityApplicationsView.vue:246-266` |
| Accepter candidature + email | ✅ | `OpportunityApplicationsView.vue:378-417` |
| Refuser candidature + email | ✅ | `OpportunityApplicationsView.vue:426-469` |
| Contacter candidat | ✅ | `OpportunityApplicationsView.vue:477-480` |
| Voir profil candidat | ✅ | `OpportunityApplicationsView.vue:471-474` |
| **Bouton accès candidatures dans MyOpportunitiesView** | ✅ | `MyOpportunitiesView.vue:177-186` (CORRIGÉ) |
| Affichage nombre candidatures | ✅ | `MyOpportunitiesView.vue:182` |

### ✅ LACUNE CORRIGÉE

**Fichier:** `src/views/MyOpportunitiesView.vue`  
**Correction appliquée:** Ajout d'un bouton "X candidature(s)" qui renvoie vers `/opportunities/:id/applications`

```vue
<!-- Ajouté lignes 177-186 -->
<v-btn
  v-if="opportunity.applications_count > 0"
  color="secondary"
  variant="text"
  size="small"
  :to="`/opportunities/${opportunity.id}/applications`"
>
  <v-icon start size="small">mdi-account-group</v-icon>
  {{ opportunity.applications_count }} candidature{{ opportunity.applications_count > 1 ? 's' : '' }}
</v-btn>
```

### Table pev_opportunity_applications - ✅ COMPLÈTE

```sql
-- Colonnes documents vérifiées:
cover_letter TEXT              -- ✅ Lettre de motivation
resume_url VARCHAR(500)        -- ✅ URL du CV
portfolio_url VARCHAR(500)     -- ✅ URL du portfolio
applicant_notes TEXT           -- ✅ Notes du candidat
```

### Buckets Storage - ✅ CONFIGURÉS

| Bucket | Public | Types acceptés |
|--------|--------|----------------|
| `documents` | ✅ Oui | PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT |

### Templates Email Candidature - ✅ COMPLETS

| Template | Description | État |
|----------|-------------|------|
| `application_sent` | Confirmation envoi au candidat | ✅ |
| `application_received` | Notification au créateur | ✅ |
| `application_accepted` | Candidature acceptée | ✅ |
| `application_rejected` | Candidature refusée | ✅ |

---

## 📊 État Actuel du Codebase (MISE À JOUR 2026-01-08)

### Routes Admin - TOUTES IMPLÉMENTÉES ✅
| Route | Vue | État |
|-------|-----|------|
| `/admin/dashboard` | `AdminDashboardView.vue` | ✅ Fonctionnel |
| `/admin/users` | `AdminUsersView.vue` | ✅ Fonctionnel |
| `/admin/moderation` | `AdminModerationView.vue` | ✅ Fonctionnel |
| `/admin/analytics` | `AdminAnalyticsView.vue` | ✅ **VÉRIFIÉ - Complet** |
| `/admin/content` | `AdminContentManagementView.vue` | ✅ **CRÉÉ** |
| `/admin/reports` | `AdminReportsView.vue` | ✅ **CRÉÉ** |
| `/admin/events` | `AdminEventsView.vue` | ✅ Fonctionnel |

### Services Admin - TOUS IMPLÉMENTÉS ✅
| Service | Fichier | État |
|---------|---------|------|
| Analytics | `analyticsService.js` | ✅ Complet (KPIs, métriques) |
| Modération | `moderationService.js` | ✅ Complet |
| Événements | `eventsService.js` | ✅ Complet |
| Utilisateurs | `userManagementService.js` | ✅ Complet |
| **Signalements** | `reportsService.js` | ✅ **CRÉÉ** |
| **Gestion Contenu** | `contentManagementService.js` | ✅ **CRÉÉ** |

### Tables Supabase Pertinentes
| Table | RLS | État |
|-------|-----|------|
| `pev_reports` | ✅ Configuré | Table existe, RLS OK |
| `pev_events` | ✅ | OK |
| `pev_opportunities` | ✅ | OK |
| `pev_resources` | ✅ | OK |
| `pev_email_templates` | ✅ | Templates existants |

### Composants Admin Existants
- `AdminDashboard.vue` - Dashboard général
- `AdminEventsManager.vue` - Gestion événements
- `AdminOpportunitiesManager.vue` - Gestion opportunités
- `AdminResourcesManager.vue` - Gestion ressources
- `AdminCompaniesManager.vue` - Gestion entreprises
- `ModerationTab.vue` - Onglet modération
- `ContentDetails.vue` - Détails contenu

---

## 🎯 MODULE 1: GESTION CONTENU

### 1.1 Problème Identifié
- Le bouton "Gestion Contenu" renvoie à `/admin/content` qui **n'existe pas**
- Aucune vue `AdminContentManagementView.vue` n'est créée

### 1.2 Actions à Réaliser

#### Étape 1.2.1: Créer la vue AdminContentManagementView.vue
**Fichier:** `src/views/admin/AdminContentManagementView.vue`

**Structure proposée:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Gestion de Contenu                              │
├─────────────────────────────────────────────────────────┤
│ Tabs: [Opportunités] [Ressources] [Événements] [Posts]  │
├─────────────────────────────────────────────────────────┤
│ Filtres: Statut | Auteur | Date | Recherche             │
├─────────────────────────────────────────────────────────┤
│ Table: Liste des contenus avec actions CRUD             │
│   - Voir | Modifier | Supprimer | Changer statut        │
├─────────────────────────────────────────────────────────┤
│ Pagination                                              │
└─────────────────────────────────────────────────────────┘
```

**Fonctionnalités requises:**
- [ ] Onglet Opportunités: Liste avec filtres, actions CRUD
- [ ] Onglet Ressources: Liste avec filtres, actions CRUD
- [ ] Onglet Événements: Liste avec filtres, actions CRUD
- [ ] Onglet Posts/Forum: Liste avec filtres, actions CRUD
- [ ] Recherche globale par titre/auteur
- [ ] Filtrage par statut (draft, pending, published, rejected)
- [ ] Actions en masse (approuver, rejeter, supprimer)
- [ ] Export CSV des données

#### Étape 1.2.2: Créer le service contentManagementService.js
**Fichier:** `src/services/admin/contentManagementService.js`

**Méthodes requises:**
```javascript
// Opportunités
getAllOpportunities(filters) // Toutes, pas juste pending
updateOpportunityStatus(id, status)
deleteOpportunity(id, reason)

// Ressources
getAllResources(filters)
updateResourceStatus(id, status)
deleteResource(id, reason)

// Événements
getAllEvents(filters)
updateEventStatus(id, status)
deleteEvent(id, reason)

// Posts Forum
getAllForumTopics(filters)
updateTopicStatus(id, status)
deleteForumTopic(id, reason)

// Statistiques
getContentStats()
```

#### Étape 1.2.3: Ajouter la route
**Fichier:** `src/router/index.js`

```javascript
{
  path: '/admin/content',
  name: 'AdminContent',
  component: AdminContentManagementView,
  meta: { 
    requiresAuth: true,
    requiresAdmin: true,
    title: 'Gestion de Contenu - 2iE GreenHub'
  }
}
```

#### Étape 1.2.4: Modifier le lien "Suggestions de contenu"
**Fichier:** `src/views/AdminDashboardView.vue` ou composant concerné
- Le clic sur "Suggestions de contenu" doit renvoyer à la page d'accueil (`/`)

---

## 📈 MODULE 2: ANALYTICS

### 2.1 État Actuel
- Vue `AdminAnalyticsView.vue` existe (729 lignes)
- Service `analyticsService.js` existe (560 lignes)
- KPIs principaux fonctionnels

### 2.2 Actions à Réaliser

#### Étape 2.2.1: Vérifier cohérence des données
**Fichier:** `src/services/admin/analyticsService.js`

**Vérifications:**
- [ ] `getDashboardKPIs()` - Données réelles de Supabase
- [ ] `getEngagementMetrics()` - Métriques d'engagement
- [ ] `getGrowthData()` - Données de croissance
- [ ] `getContentPerformance()` - Performance contenu

#### Étape 2.2.2: Ajouter graphiques manquants
**Fichier:** `src/views/admin/AdminAnalyticsView.vue`

**Graphiques à vérifier/ajouter:**
- [ ] Graphique croissance utilisateurs (ligne)
- [ ] Répartition par rôle (camembert)
- [ ] Activité par jour/semaine (barres)
- [ ] Top contenus les plus vus
- [ ] Taux de conversion candidatures

#### Étape 2.2.3: Export rapports
**Fonctionnalités:**
- [ ] Export PDF rapport mensuel
- [ ] Export CSV données brutes
- [ ] Sélection période personnalisée

---

## 🚨 MODULE 3: SIGNALEMENTS

### 3.1 État Actuel
- Table `pev_reports` existe avec RLS configuré
- Aucun service `reportsService.js`
- Aucune vue `AdminReportsView.vue`
- Templates email manquants pour signalements

### 3.2 Schéma de la Table pev_reports
```sql
id UUID PRIMARY KEY
content TEXT NOT NULL           -- Description du signalement
reporter_id UUID NOT NULL       -- Utilisateur signalant
target_type TEXT NOT NULL       -- 'user', 'opportunity', 'event', 'resource', 'forum_post', 'forum_topic', 'message', 'company'
target_id UUID NOT NULL         -- ID de l'élément signalé
priority TEXT DEFAULT 'medium'  -- 'low', 'medium', 'high', 'critical'
status TEXT DEFAULT 'pending'   -- 'pending', 'reviewed', 'resolved', 'dismissed'
admin_notes TEXT                -- Notes admin
reviewed_by UUID                -- Admin qui a traité
reviewed_at TIMESTAMPTZ         -- Date de traitement
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### 3.3 Actions à Réaliser

#### Étape 3.3.1: Créer le service reportsService.js
**Fichier:** `src/services/admin/reportsService.js`

```javascript
export const reportsService = {
  // Récupérer tous les signalements
  async getReports(filters = {}) { ... },
  
  // Récupérer un signalement par ID
  async getReportById(reportId) { ... },
  
  // Mettre à jour le statut d'un signalement
  async updateReportStatus(reportId, status, adminNotes) { ... },
  
  // Résoudre un signalement (avec action sur le contenu)
  async resolveReport(reportId, action, adminNotes) { ... },
  
  // Rejeter un signalement
  async dismissReport(reportId, adminNotes) { ... },
  
  // Récupérer les statistiques de signalements
  async getReportsStats() { ... },
  
  // Récupérer le contenu signalé
  async getReportedContent(targetType, targetId) { ... }
}
```

#### Étape 3.3.2: Créer la vue AdminReportsView.vue
**Fichier:** `src/views/admin/AdminReportsView.vue`

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Gestion des Signalements                        │
├─────────────────────────────────────────────────────────┤
│ Stats: [En attente: X] [Traités: Y] [Rejetés: Z]       │
├─────────────────────────────────────────────────────────┤
│ Filtres: Statut | Priorité | Type | Date                │
├─────────────────────────────────────────────────────────┤
│ Liste des signalements                                  │
│   - Priorité (badge couleur)                            │
│   - Contenu du signalement                              │
│   - Type de contenu signalé                             │
│   - Signalé par (utilisateur)                           │
│   - Date                                                │
│   - Actions: [Voir] [Traiter] [Rejeter]                │
├─────────────────────────────────────────────────────────┤
│ Dialog de traitement:                                   │
│   - Aperçu du contenu signalé                          │
│   - Actions: Supprimer | Modifier | Avertir auteur     │
│   - Notes admin                                         │
│   - Envoyer notifications (checkbox)                    │
└─────────────────────────────────────────────────────────┘
```

#### Étape 3.3.3: Ajouter la route
**Fichier:** `src/router/index.js`

```javascript
const AdminReportsView = () => import('@/views/admin/AdminReportsView.vue')

{
  path: '/admin/reports',
  name: 'AdminReports',
  component: AdminReportsView,
  meta: { 
    requiresAuth: true,
    requiresAdmin: true,
    title: 'Signalements - 2iE GreenHub'
  }
}
```

#### Étape 3.3.4: Créer composant de signalement utilisateur
**Fichier:** `src/components/ReportContentDialog.vue`

**Utilisation:** Intégré dans les vues de contenu (opportunités, événements, ressources)

**Structure:**
```vue
<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>Signaler ce contenu</v-card-title>
      <v-card-text>
        <v-select v-model="reason" :items="reasons" label="Raison" />
        <v-textarea v-model="description" label="Description" />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false">Annuler</v-btn>
        <v-btn color="error" @click="submitReport">Signaler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
```

**Raisons de signalement:**
- Contenu inapproprié
- Spam
- Information fausse/trompeuse
- Violation des droits d'auteur
- Harcèlement
- Autre

#### Étape 3.3.5: Ajouter bouton signalement dans les vues
**Fichiers à modifier:**
- `src/views/OpportunitiesView.vue` - Bouton signaler sur chaque opportunité
- `src/views/EventsView.vue` - Bouton signaler sur chaque événement
- `src/views/ResourcesView.vue` - Bouton signaler sur chaque ressource
- `src/views/ForumView.vue` - Bouton signaler sur chaque post

#### Étape 3.3.6: Créer templates email pour signalements
**Migration SQL:** `add_report_email_templates.sql`

**Templates à créer:**

1. **content_reported** - Email à l'auteur quand son contenu est signalé
```
Sujet: Votre contenu a été signalé
Variables: recipient_name, content_title, content_type, report_reason, platform_url
```

2. **report_action_taken** - Email à l'auteur quand une action est prise
```
Sujet: Action prise suite au signalement de votre contenu
Variables: recipient_name, content_title, content_type, action_taken, admin_notes, platform_url
```

3. **report_resolved** - Email au signaleur quand son signalement est traité
```
Sujet: Votre signalement a été traité
Variables: recipient_name, content_type, resolution_status, platform_url
```

#### Étape 3.3.7: Workflow de notification double
**Quand un admin traite un signalement:**

1. **Si action = suppression/modification:**
   - Email 1 à l'auteur: `content_reported` (notification du signalement)
   - Email 2 à l'auteur: `report_action_taken` (notification de l'action)
   - Email 3 au signaleur: `report_resolved`

2. **Si action = rejet du signalement:**
   - Email au signaleur: `report_resolved` (signalement rejeté)
   - Pas d'email à l'auteur

---

## 🔧 MODULE 4: CORRECTIONS ADDITIONNELLES

### 4.1 Lien "Suggestions de contenu"
**Action:** Modifier pour rediriger vers la page d'accueil

**Fichier à identifier:** Composant contenant ce lien
**Modification:** `@click="router.push('/')"` ou `href="/"`

### 4.2 Intégration signalements dans Dashboard
**Fichier:** `src/views/AdminDashboardView.vue`

**Modifications:**
- [ ] Lier le bouton "Voir tout →" des signalements à `/admin/reports`
- [ ] Charger les vrais signalements depuis `pev_reports`
- [ ] Afficher le nombre réel de signalements en attente

---

## 📋 CHECKLIST D'IMPLÉMENTATION

### Phase 1: Module Gestion Contenu
- [ ] 1.1 Créer `AdminContentManagementView.vue`
- [ ] 1.2 Créer `contentManagementService.js`
- [ ] 1.3 Ajouter route `/admin/content`
- [ ] 1.4 Implémenter onglet Opportunités
- [ ] 1.5 Implémenter onglet Ressources
- [ ] 1.6 Implémenter onglet Événements
- [ ] 1.7 Implémenter filtres et recherche
- [ ] 1.8 Implémenter actions CRUD
- [ ] 1.9 Tester cohérence avec données Supabase

### Phase 2: Module Analytics
- [ ] 2.1 Vérifier `analyticsService.js`
- [ ] 2.2 Vérifier `AdminAnalyticsView.vue`
- [ ] 2.3 Corriger requêtes Supabase si nécessaire
- [ ] 2.4 Ajouter graphiques manquants
- [ ] 2.5 Implémenter export rapports
- [ ] 2.6 Tester avec données réelles

### Phase 3: Module Signalements
- [ ] 3.1 Créer `reportsService.js`
- [ ] 3.2 Créer `AdminReportsView.vue`
- [ ] 3.3 Ajouter route `/admin/reports`
- [ ] 3.4 Créer `ReportContentDialog.vue`
- [ ] 3.5 Ajouter boutons signalement dans vues contenu
- [ ] 3.6 Créer migration templates email
- [ ] 3.7 Exécuter migration SQL
- [ ] 3.8 Implémenter workflow notifications
- [ ] 3.9 Lier dashboard aux vrais signalements
- [ ] 3.10 Tester workflow complet

### Phase 4: Corrections finales
- [ ] 4.1 Corriger lien "Suggestions de contenu"
- [ ] 4.2 Vérifier tous les liens du dashboard
- [ ] 4.3 Test intégration complète
- [ ] 4.4 Validation finale

---

## 📁 FICHIERS À CRÉER

| Fichier | Type | Module |
|---------|------|--------|
| `src/views/admin/AdminContentManagementView.vue` | Vue | Gestion Contenu |
| `src/services/admin/contentManagementService.js` | Service | Gestion Contenu |
| `src/views/admin/AdminReportsView.vue` | Vue | Signalements |
| `src/services/admin/reportsService.js` | Service | Signalements |
| `src/components/ReportContentDialog.vue` | Composant | Signalements |
| `supabase/migrations/add_report_email_templates.sql` | Migration | Signalements |

## 📁 FICHIERS À MODIFIER

| Fichier | Modification |
|---------|--------------|
| `src/router/index.js` | Ajouter routes content et reports |
| `src/views/AdminDashboardView.vue` | Lier signalements réels |
| `src/views/OpportunitiesView.vue` | Bouton signaler |
| `src/views/EventsView.vue` | Bouton signaler |
| `src/views/ResourcesView.vue` | Bouton signaler |
| `src/services/admin/index.js` | Exporter nouveaux services |

---

## ⚠️ POINTS D'ATTENTION

1. **Cohérence RLS:** Toutes les requêtes doivent respecter les policies existantes
2. **Buckets Storage:** Vérifier accès aux fichiers lors de la suppression
3. **Emails:** Utiliser `emailService.sendTemplateEmail()` existant
4. **Erreurs 400:** Éviter les jointures Supabase complexes (requêtes séparées)
5. **Performance:** Pagination sur toutes les listes
6. **UX:** Messages de confirmation pour actions destructives

---

## 🚀 ORDRE D'EXÉCUTION RECOMMANDÉ

1. **Module Signalements** (priorité haute - fonctionnalité manquante critique)
   - Service → Vue → Routes → Composant utilisateur → Templates email

2. **Module Gestion Contenu** (priorité moyenne)
   - Service → Vue → Routes

3. **Module Analytics** (priorité basse - déjà fonctionnel)
   - Vérifications → Corrections → Améliorations

4. **Corrections finales**
   - Liens → Tests → Validation

---

*Document généré automatiquement - À valider avant implémentation*
