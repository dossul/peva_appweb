# 📋 CORRECTIONS SQL SCHEMA PEVA - Documentation Complète

**Date**: 1er Janvier 2026 - 21:42 UTC  
**Projet**: PEVA (Plateforme d'Économie Verte en Afrique)  
**Version**: v8  
**Auteur**: Session Cascade AI  

---

## 📑 Table des Matières

1. [Résumé Exécutif](#résumé-exécutif)
2. [Erreurs Corrigées](#erreurs-corrigées)
3. [Fichiers Modifiés](#fichiers-modifiés)
4. [Bonnes Pratiques Imposées](#bonnes-pratiques-imposées)
5. [Comment Éviter Ces Erreurs](#comment-éviter-ces-erreurs)
6. [Checklist de Développement](#checklist-de-développement)
7. [Commandes Utiles](#commandes-utiles)

---

## 📌 Résumé Exécutif

### Problème Initial
L'application PEVA présentait des erreurs SQL critiques dues à:
1. **Noms de tables incorrects** - Utilisation de `profiles` au lieu de `pev_profiles`
2. **Colonnes inexistantes** - Références à `countries`, `moderation_status` qui n'existent pas
3. **Configuration OneSignal invalide** - Position `top-right` non supportée

### Solution Appliquée
- Correction systématique de **15+ fichiers**
- Ajout du préfixe `pev_` à toutes les tables Supabase
- Alignement des colonnes avec le schéma PostgreSQL réel
- Correction de la configuration OneSignal

### Résultat
✅ Build réussi  
✅ Aucune erreur de compilation  
✅ Schéma SQL aligné avec la base de données  

---

## 🔧 Erreurs Corrigées

### 1. Erreur OneSignal - Position Invalide

**Erreur Console:**
```
Error: Invalid position top-right for notify button. Choose either 'bottom-left', or 'bottom-right'.
```

**Cause:** La configuration OneSignal utilisait `top-right` qui n'est pas une position valide.

**Correction:**
```diff
# Fichier: peva/index.html (ligne 81)
- position: 'top-right',
- offset: {
-   top: '80px',
-   right: '20px'
- }
+ position: 'bottom-right',
+ offset: {
+   bottom: '20px',
+   right: '20px'
+ }
```

---

### 2. Erreur 406 (Not Acceptable) - Table `profiles`

**Erreur Console:**
```
GET https://supabase.benga.live/rest/v1/profiles?select=*&id=eq.xxx 406 (Not Acceptable)
```

**Cause:** La table `profiles` n'existe pas dans le schéma Supabase. Le nom correct est `pev_profiles`.

**Correction:** Remplacement de `from('profiles')` par `from('pev_profiles')` dans tous les fichiers concernés.

---

### 3. Erreur 400 - Colonne `countries` Inexistante

**Erreur Console:**
```
column pev_opportunities.countries does not exist
hint: Perhaps you meant to reference the column "pev_opportunities.country"
```

**Cause:** Le schéma utilise `country` (singulier, TEXT) et non `countries` (pluriel).

**Correction:** Remplacement de `countries` par `country` dans les requêtes SELECT.

---

### 4. Erreur - Colonne `moderation_status` Inexistante

**Erreur Console:**
```
column pev_opportunities.moderation_status does not exist
```

**Cause:** Le schéma utilise simplement `status` pour le statut de modération.

**Correction:** Remplacement de `moderation_status` par `status` et adaptation des valeurs (`draft`, `published` au lieu de `pending`, `approved`).

---

## 📁 Fichiers Modifiés

### Services JavaScript

| Fichier | Corrections |
|---------|-------------|
| `src/stores/auth.js` | `profiles` → `pev_profiles` (2 occurrences) |
| `src/services/admin/analyticsService.js` | `profiles`, `companies`, `events`, `resources`, `connections`, `messages` → `pev_*` (8 corrections) |
| `src/services/admin/moderationService.js` | `resources`, `events`, `companies`, `forum_topics` → `pev_*` (4 corrections) |
| `src/services/admin/companyManagementService.js` | `companies`, `events` → `pev_*` (9 corrections) |
| `src/services/dataService.js` | `companies`, `profiles` → `pev_*` (2 corrections) |
| `src/services/opportunitiesService.js` | Suppression de `countries`, `moderation_status` |
| `src/services/adminService.js` | `moderation_status` → `status` |

### Composants Vue.js

| Fichier | Corrections |
|---------|-------------|
| `src/components/admin/AdminDashboard.vue` | `profiles`, `companies`, `opportunities`, `events` → `pev_*` |
| `src/components/admin/AdminUsersManager.vue` | `profiles` → `pev_profiles` (4 occurrences) |
| `src/components/admin/AdminNotificationsManager.vue` | `profiles`, `notifications` → `pev_*` (3 occurrences) |
| `src/components/admin/AdminEventsManager.vue` | `events`, `profiles` → `pev_*` (4 occurrences) |
| `src/components/admin/AdminResourcesManager.vue` | `resources`, `profiles` → `pev_*` (4 occurrences) |
| `src/components/admin/AdminCompaniesManager.vue` | `companies`, `profiles` → `pev_*` (2 occurrences) |
| `src/components/admin/AdminOpportunitiesManager.vue` | `opportunities`, `profiles` → `pev_*` |
| `src/views/CreateOpportunityView.vue` | `companies` → `pev_companies` |
| `src/views/admin/AdminAnalyticsView.vue` | `by_moderation_status` → `by_status` |

### Fichiers de Configuration

| Fichier | Corrections |
|---------|-------------|
| `peva/index.html` | Position OneSignal `top-right` → `bottom-right` |

---

## ✅ Bonnes Pratiques Imposées

### 1. Convention de Nommage des Tables

> **RÈGLE ABSOLUE**: Toutes les tables Supabase DOIVENT utiliser le préfixe `pev_`

```javascript
// ❌ INCORRECT
supabase.from('profiles')
supabase.from('companies')
supabase.from('opportunities')

// ✅ CORRECT
supabase.from('pev_profiles')
supabase.from('pev_companies')
supabase.from('pev_opportunities')
```

### 2. Référencement des Colonnes

> **RÈGLE**: Toujours vérifier le schéma PostgreSQL avant d'utiliser une colonne

```javascript
// ❌ INCORRECT - Colonnes qui n'existent pas
.select('countries, moderation_status, is_multi_country')

// ✅ CORRECT - Colonnes du schéma réel
.select('country, status')
```

### 3. Relations avec Jointures

> **RÈGLE**: Les relations dans les SELECT doivent aussi utiliser le préfixe `pev_`

```javascript
// ❌ INCORRECT
.select(`
  *,
  owner:profiles(first_name, last_name)
`)

// ✅ CORRECT
.select(`
  *,
  owner:pev_profiles(first_name, last_name)
`)
```

### 4. Valeurs de Statut

> **RÈGLE**: Utiliser les valeurs de statut correctes du schéma

| Usage | Valeurs Correctes |
|-------|-------------------|
| Opportunités | `draft`, `published`, `archived` |
| Entreprises | `draft`, `in_review`, `published`, `rejected` |
| Événements | `draft`, `published`, `cancelled` |
| Ressources | `draft`, `published` |

```javascript
// ❌ INCORRECT
.eq('moderation_status', 'approved')
.eq('moderation_status', 'pending')

// ✅ CORRECT
.eq('status', 'published')
.eq('status', 'draft')
```

### 5. Configuration OneSignal

> **RÈGLE**: Seules les positions `bottom-left` et `bottom-right` sont valides

```javascript
// ❌ INCORRECT
notifyButton: {
  position: 'top-right',  // NON SUPPORTÉ
  offset: { top: '80px', right: '20px' }
}

// ✅ CORRECT
notifyButton: {
  position: 'bottom-right',
  offset: { bottom: '20px', right: '20px' }
}
```

---

## 🛡️ Comment Éviter Ces Erreurs

### 1. Avant de Créer un Nouveau Fichier

```bash
# Consulter le schéma PostgreSQL officiel
cat docs/POSTGRESQL_SELF_HOSTED_DUMP.sql | grep "CREATE TABLE"
```

### 2. Avant d'Ajouter une Requête Supabase

1. **Vérifier le nom de la table** dans `POSTGRESQL_SELF_HOSTED_DUMP.sql`
2. **Vérifier les colonnes disponibles** pour cette table
3. **Utiliser le préfixe `pev_`** systématiquement

### 3. Recherche Globale Avant Commit

```bash
# Rechercher les tables sans préfixe pev_
grep -r "from(['\"]" src/ --include="*.js" --include="*.vue" | grep -v "pev_"

# Rechercher les colonnes problématiques
grep -r "countries\|moderation_status" src/ --include="*.js" --include="*.vue"
```

### 4. Validation avec ESLint (Recommandé)

Ajouter une règle ESLint personnalisée pour détecter les noms de tables incorrects.

---

## 📝 Checklist de Développement

### Avant Chaque Développement

- [ ] Consulter `docs/POSTGRESQL_SELF_HOSTED_DUMP.sql` pour le schéma actuel
- [ ] Vérifier que toutes les tables utilisent le préfixe `pev_`
- [ ] Vérifier que les colonnes existent dans le schéma

### Avant Chaque Commit

- [ ] Exécuter `npm run build` sans erreurs
- [ ] Tester dans le navigateur avec console ouverte
- [ ] Vérifier qu'aucune erreur 400/406 n'apparaît
- [ ] Vider le cache navigateur après modifications

### Avant Chaque Déploiement

- [ ] Exécuter tous les tests E2E
- [ ] Vérifier la cohérence schéma code/base de données
- [ ] Documenter les changements de schéma

---

## 🔨 Commandes Utiles

### Build et Développement

```bash
# Build de production
npm run build

# Serveur de développement
npm run dev

# Vérification des erreurs de lint
npm run lint
```

### Recherche de Problèmes

```bash
# Trouver les tables sans préfixe
grep -rn "\.from\(['\"]" src/ --include="*.js" --include="*.vue"

# Trouver les colonnes inexistantes
grep -rn "countries\|moderation_status\|is_multi_country" src/

# Vérifier les jointures
grep -rn "profiles(" src/ --include="*.js" --include="*.vue"
```

### Nettoyage Cache

```bash
# Nettoyer le cache npm
npm cache clean --force

# Réinstaller les dépendances
rm -rf node_modules && npm install

# Nettoyer le build
rm -rf dist && npm run build
```

### Vider Cache Navigateur

- **Chrome/Edge**: `Ctrl + Shift + Delete` → Cocher "Images et fichiers en cache"
- **Firefox**: `Ctrl + Shift + Delete` → Sélectionner "Cache"
- **Hard Refresh**: `Ctrl + Shift + R` ou `Ctrl + F5`

---

## 📊 Mapping des Tables PEVA

| Table Application | Table PostgreSQL |
|-------------------|------------------|
| profiles | `pev_profiles` |
| companies | `pev_companies` |
| opportunities | `pev_opportunities` |
| events | `pev_events` |
| resources | `pev_resources` |
| connections | `pev_connections` |
| messages | `pev_messages` |
| notifications | `pev_notifications` |
| forum_topics | `pev_forum_topics` |
| groups | `pev_groups` |
| favorites | `pev_favorites` |
| file_uploads | `pev_file_uploads` |
| platform_stats | `pev_platform_stats` |

---

## 📊 Mapping des Colonnes Critiques

### Table `pev_opportunities`

| ❌ N'existe PAS | ✅ Existe |
|-----------------|-----------|
| `countries` | `country` (TEXT) |
| `moderation_status` | `status` (TEXT) |
| `is_multi_country` | - |
| `visibility` | - |
| `promote_premium` | - |
| `send_notifications` | - |
| `auto_share_social` | - |
| `social_links` | - |
| `attachments` | `metadata` (JSONB) |
| `moderated_by` | - |
| `moderated_at` | - |
| `moderation_notes` | - |

### Table `pev_profiles`

| ❌ N'existe PAS | ✅ Existe |
|-----------------|-----------|
| `is_active` | `is_suspended` (BOOLEAN) |

### Table `pev_file_uploads`

| ❌ N'existe PAS | ✅ Existe |
|-----------------|-----------|
| `file_category` | `category` (TEXT) |
| `upload_status` | - |

---

## 🎯 Conclusion

Cette session de correction a permis d'aligner le code JavaScript/Vue.js avec le schéma PostgreSQL réel. Les erreurs venaient principalement de:

1. **Incohérence de nommage** - Tables sans préfixe `pev_`
2. **Colonnes fantômes** - Références à des colonnes qui n'ont jamais existé
3. **Configuration externe** - OneSignal mal configuré

En suivant les bonnes pratiques documentées ci-dessus, ces erreurs ne devraient plus se reproduire.

---

**Document généré le**: 1er Janvier 2026 à 21:42 UTC  
**Prochaine révision recommandée**: Après chaque modification de schéma  
