# 🔍 AUDIT COMPLET - Tables avec préfixe pev_

## 📋 Tables dans l'instance auto-hébergée (avec préfixe pev_)

### Tables trouvées dans POSTGRESQL_SELF_HOSTED_DUMP.sql:

1. ✅ **pev_users** - Authentification
2. ✅ **pev_profiles** - Profils utilisateurs
3. ✅ **pev_connections** - Connexions entre utilisateurs
4. ✅ **pev_companies** - Entreprises
5. ✅ **pev_company_members** - Membres des entreprises
6. ✅ **pev_opportunities** - Opportunités
7. ✅ **pev_opportunity_applications** - Candidatures
8. ✅ **pev_events** - Événements
9. ✅ **pev_event_registrations** - Inscriptions événements
10. ✅ **pev_projects** - Projets
11. ✅ **pev_resources** - Ressources
12. ✅ **pev_message_threads** - Fils de discussion
13. ✅ **pev_message_thread_participants** - Participants
14. ✅ **pev_messages** - Messages
15. ✅ **pev_message_read_status** - Statut lecture
16. ✅ **pev_forum_categories** - Catégories forum
17. ✅ **pev_forum_topics** - Sujets forum
18. ✅ **pev_forum_posts** - Posts forum
19. ✅ **pev_groups** - Groupes
20. ✅ **pev_group_members** - Membres groupes
21. ✅ **pev_notifications** - Notifications
22. ✅ **pev_favorites** - Favoris
23. ✅ **pev_audit_logs** - Logs audit
24. ✅ **pev_storage_buckets** - Buckets stockage
25. ✅ **pev_storage_objects** - Objets stockés
26. ✅ **pev_file_uploads** - Fichiers uploadés
27. ✅ **pev_storage_quotas** - Quotas stockage
28. ✅ **pev_auth_sessions** - Sessions
29. ✅ **pev_auth_password_resets** - Réinit mot de passe
30. ✅ **pev_auth_email_verifications** - Vérif emails
31. ✅ **pev_platform_stats** - Stats plateforme
32. ✅ **pev_sectors** - Secteurs
33. ✅ **pev_sdgs** - ODD

### Tables supplémentaires trouvées:
34. ✅ **pev_company_rse_reports** - Rapports RSE (trouvé dans rseService.js)

---

## ❌ ERREURS trouvées dans le codebase

### Services JavaScript utilisant des noms SANS préfixe:

#### **viewsService.js**
- ❌ `.from('opportunities')` → ✅ doit être `pev_opportunities`
- ❌ `.from('events')` → ✅ doit être `pev_events`
- ❌ `.from('resources')` → ✅ doit être `pev_resources`
- ❌ `.from('companies')` → ✅ doit être `pev_companies`
- ❌ `.from('profiles')` → ✅ doit être `pev_profiles`
- ❌ `.from('groups')` → ✅ doit être `pev_groups`
- ❌ `.from('forum_discussions')` → ✅ doit être `pev_forum_topics`
- ❌ `.from('conversations')` → ✅ doit être `pev_message_threads`

#### **opportunitiesService.js**
- ❌ `.from('opportunities')` → ✅ doit être `pev_opportunities`
- ❌ `.from('opportunity_applications')` → ✅ doit être `pev_opportunity_applications`
- ❌ `.from('opportunity_favorites')` → ✅ doit être `pev_favorites`
- ❌ `.from('documents')` → ✅ doit être `greenhub-public` ou `greenhub-private`

#### **rseService.js**
- ❌ `.from('company_rse_reports')` → ✅ doit être `pev_company_rse_reports`
- ❌ `.from('sdgs')` → ✅ doit être `pev_sdgs`
- ❌ `.from('v_rse_global_stats')` → ✅ doit être `pev_v_rse_global_stats`
- ❌ `.from('v_company_latest_rse_report')` → ✅ doit être `pev_v_company_latest_rse_report`
- ❌ `.from('peva-private')` → ✅ doit être `greenhub-private`

#### **notificationService.js**
- ❌ `.from('profiles')` → ✅ doit être `pev_profiles`
- ❌ `.from('notifications')` → ✅ doit être `pev_notifications`

#### **dataService.js**
- À auditer

#### **companyService.js**
- À auditer

#### **connectionService.js**
- À auditer

#### **fileService.js**
- À auditer

#### **adminService.js**
- À auditer

---

## 📝 ACTIONS À FAIRE

1. ✅ Corriger viewsService.js
2. ✅ Corriger opportunitiesService.js
3. ✅ Corriger rseService.js
4. ✅ Corriger notificationService.js
5. ⏳ Auditer et corriger dataService.js
6. ⏳ Auditer et corriger companyService.js
7. ⏳ Auditer et corriger connectionService.js
8. ⏳ Auditer et corriger fileService.js
9. ⏳ Auditer et corriger adminService.js
10. ⏳ Auditer tous les fichiers services/admin/*.js
11. ⏳ Auditer tous les stores Pinia
12. ⏳ Auditer toutes les vues Vue

---

## 🔧 CORRECTIONS À APPLIQUER

### Nom des buckets de stockage:
- ❌ `peva-public` → ✅ `greenhub-public`
- ❌ `peva-private` → ✅ `greenhub-private`

### Tables manquantes à créer dans la BDD:
- `pev_company_rse_reports` (si pas encore créée)
- Vues matérialisées: `pev_v_rse_global_stats`, `pev_v_company_latest_rse_report`
