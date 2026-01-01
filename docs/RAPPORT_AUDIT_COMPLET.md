# 🔍 RAPPORT D'AUDIT COMPLET - Structure pev_

## 📊 Tables existantes dans POSTGRESQL_SELF_HOSTED_DUMP.sql

### ✅ 34 Tables avec préfixe `pev_`

| # | Table | Description |
|---|-------|-------------|
| 1 | `pev_users` | Authentification utilisateurs |
| 2 | `pev_profiles` | Profils utilisateurs étendus |
| 3 | `pev_connections` | Connexions entre utilisateurs |
| 4 | `pev_companies` | Entreprises |
| 5 | `pev_company_members` | Membres entreprises |
| 6 | `pev_opportunities` | Opportunités |
| 7 | `pev_opportunity_applications` | Candidatures |
| 8 | `pev_events` | Événements |
| 9 | `pev_event_registrations` | Inscriptions événements |
| 10 | `pev_projects` | Projets |
| 11 | `pev_resources` | Ressources |
| 12 | `pev_message_threads` | Fils discussion |
| 13 | `pev_message_thread_participants` | Participants messages |
| 14 | `pev_messages` | Messages |
| 15 | `pev_message_read_status` | Statut lecture |
| 16 | `pev_forum_categories` | Catégories forum |
| 17 | `pev_forum_topics` | Sujets forum |
| 18 | `pev_forum_posts` | Posts forum |
| 19 | `pev_groups` | Groupes |
| 20 | `pev_group_members` | Membres groupes |
| 21 | `pev_notifications` | Notifications |
| 22 | `pev_favorites` | Favoris |
| 23 | `pev_audit_logs` | Logs audit |
| 24 | `pev_storage_buckets` | Buckets stockage |
| 25 | `pev_storage_objects` | Objets stockés |
| 26 | `pev_file_uploads` | Fichiers uploadés |
| 27 | `pev_storage_quotas` | Quotas stockage |
| 28 | `pev_auth_sessions` | Sessions auth |
| 29 | `pev_auth_password_resets` | Réinit mdp |
| 30 | `pev_auth_email_verifications` | Vérif emails |
| 31 | `pev_platform_stats` | Stats plateforme |
| 32 | `pev_sectors` | Secteurs |
| 33 | `pev_sdgs` | ODD |
| 34 | `pev_company_rse_reports` | Rapports RSE |

### ✅ Buckets de stockage
- `greenhub-public`
- `greenhub-private`

---

## ❌ ERREURS dans le codebase

### 1. **viewsService.js** - 8 erreurs
| Ligne | Actuel | Correct |
|-------|--------|---------|
| 16 | `opportunities` | `pev_opportunities` |
| 78 | `events` | `pev_events` |
| 133 | `resources` | `pev_resources` |
| 176 | `companies` | `pev_companies` |
| 223 | `profiles` | `pev_profiles` |
| 270 | `groups` | `pev_groups` |
| 310 | `forum_discussions` | `pev_forum_topics` |
| 348 | `conversations` | `pev_message_threads` |

### 2. **opportunitiesService.js** - 5 erreurs
| Ligne | Actuel | Correct |
|-------|--------|---------|
| 8 | `opportunities` | `pev_opportunities` |
| 71 | `opportunities` | `pev_opportunities` |
| 156 | `opportunities` | `pev_opportunities` |
| 180 | `opportunity_applications` | `pev_opportunity_applications` |
| 207 | `opportunity_favorites` | `pev_favorites` |

### 3. **dataService.js** - 20+ erreurs
| Ligne | Actuel | Correct |
|-------|--------|---------|
| 16 | `platform_stats` | `pev_platform_stats` |
| 59 | `sectors` | `pev_sectors` |
| 78 | `sdgs` | `pev_sdgs` |
| 97 | `companies` | `pev_companies` |
| 120 | `opportunities` | `pev_opportunities` |
| 144 | `events` | `pev_events` |
| 168 | `projects` | `pev_projects` |
| 192 | `testimonials` | `pev_testimonials` |
| 217 | `companies` | `pev_companies` |
| 262 | `opportunities` | `pev_opportunities` |
| 307 | `burkina_regions` | `pev_burkina_regions` |
| 325 | `burkina_cities` | `pev_burkina_cities` |
| 346 | `companies` | `pev_companies` |
| 365 | `companies` | `pev_companies` |
| 385 | `companies` | `pev_companies` |
| 403 | `opportunities` | `pev_opportunities` |
| 422 | `events` | `pev_events` |
| 441 | `resources` | `pev_resources` |
| 460 | `user_notifications_with_actor` | Vue à créer |

### 4. **rseService.js** - 8 erreurs
| Ligne | Actuel | Correct |
|-------|--------|---------|
| 31 | `company_rse_reports` | `pev_company_rse_reports` |
| 70 | `company_rse_reports` | `pev_company_rse_reports` |
| 125 | `company_rse_reports` | `pev_company_rse_reports` |
| 178 | `company_rse_reports` | `pev_company_rse_reports` |
| 228 | `company_rse_reports` | `pev_company_rse_reports` |
| 251 | `sdgs` | `pev_sdgs` |
| 274 | `sdgs` | `pev_sdgs` |
| 356/366 | `peva-private` | `greenhub-private` |

### 5. **connectionService.js** - 5 erreurs
| Ligne | Actuel | Correct |
|-------|--------|---------|
| 26 | `connections` | `pev_connections` |
| 37 | `connections` | `pev_connections` |
| 83 | `connections` | `pev_connections` |
| 133 | `connections` | `pev_connections` |
| 186 | `connections` | `pev_connections` |

### 6. **fileService.js** - 8 erreurs
| Ligne | Actuel | Correct |
|-------|--------|---------|
| 137 | `file_uploads` | `pev_file_uploads` |
| 171 | `file_uploads` | `pev_file_uploads` |
| 179 | `file_uploads` | `pev_file_uploads` |
| 214 | `storage_quotas` | `pev_storage_quotas` |
| 237 | `file_uploads` | `pev_file_uploads` |
| 271 | `file_uploads` | `pev_file_uploads` |
| 292 | `file_uploads` | `pev_file_uploads` |
| 311 | `file_uploads` | `pev_file_uploads` |
| 338 | `storage_quotas` | `pev_storage_quotas` |
| 368 | `file_access_logs` | `pev_file_access_logs` |

### 7. **notificationService.js** - 2 erreurs
| Ligne | Actuel | Correct |
|-------|--------|---------|
| 141 | `profiles` | `pev_profiles` |
| ? | `notifications` | `pev_notifications` |

---

## 📝 TABLES MANQUANTES À CRÉER

### Tables référencées dans le code mais absentes du dump:
1. `pev_testimonials` (dataService.js:192)
2. `pev_burkina_regions` (dataService.js:307)
3. `pev_burkina_cities` (dataService.js:325)
4. `pev_file_access_logs` (fileService.js:368)
5. `pev_company_rse_reports` (si pas dans le dump)

### Vues à créer:
1. `pev_user_notifications_with_actor` (dataService.js:460)
2. `pev_v_rse_global_stats` (rseService.js:295)
3. `pev_v_company_latest_rse_report` (rseService.js:322)

---

## 🎯 PLAN DE CORRECTION

### Phase 1: Services (10 fichiers)
1. viewsService.js
2. opportunitiesService.js
3. dataService.js
4. rseService.js
5. connectionService.js
6. fileService.js
7. notificationService.js
8. companyService.js
9. adminService.js
10. services/admin/*.js

### Phase 2: Stores Pinia
- À auditer

### Phase 3: Vues Vue
- À auditer

### Phase 4: Script SQL tables manquantes
- Créer les tables manquantes
- Créer les vues nécessaires
