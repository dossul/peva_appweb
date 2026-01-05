# 📋 ANALYSE COMPLÈTE DES ERREURS ADMIN DASHBOARD
**Date**: 2026-01-04 21:35 UTC  
**Statut**: DOCUMENTÉ

---

## 🔴 CONTEXTE

Le dashboard administrateur PEVA présentait **6 erreurs HTTP** lors du chargement :
- 5 erreurs **400 Bad Request**
- 1 erreur **500 Internal Server Error**

Ces erreurs empêchaient le fonctionnement correct de l'interface d'administration.

---

## 📊 TABLEAU RÉCAPITULATIF DES ERREURS

| # | Table | Erreur | Cause Racine | Migration Corrective |
|---|-------|--------|--------------|---------------------|
| 1 | `pev_reports` | 400 | Table inexistante | `create_pev_reports_table.sql` |
| 2 | `pev_forum_topics` | 400 | Colonne `status` absente | `add_missing_columns_admin.sql` |
| 3 | `pev_profiles` | 400 | Colonne `last_activity` absente | `add_missing_columns_admin.sql` |
| 4 | `pev_connections` | 400 | Colonne `created_at` absente | `add_missing_columns_admin.sql` |
| 5 | `pev_events` | 400 | Foreign Key manquante | `add_missing_foreign_keys.sql` |
| 6 | `pev_messages` | 500 | Policies RLS récursives | `fix_messages_rls_recursion.sql` |

---

## 🔍 ANALYSE DÉTAILLÉE DE CHAQUE ERREUR

### Erreur 1 : Table `pev_reports` inexistante

**Requête échouée:**
```
GET /rest/v1/pev_reports?select=id,content,reporter_id,priority,created_at
```

**Cause:**
- Le code frontend référençait une table `pev_reports` qui n'avait jamais été créée
- Le service admin tentait de charger les signalements sans que la table existe

**Leçon apprise:**
> ⚠️ **TOUJOURS** vérifier l'existence d'une table avant de coder des requêtes vers celle-ci

---

### Erreur 2 : Colonne `status` absente sur `pev_forum_topics`

**Requête échouée:**
```
GET /rest/v1/pev_forum_topics?select=status
```

**Cause:**
- Le code utilisait une colonne `status` qui n'existait pas dans le schéma
- Développement frontend réalisé sans vérification du schéma BDD

**Leçon apprise:**
> ⚠️ Vérifier les colonnes avec `node test-columns.js pev_forum_topics` avant d'ajouter des requêtes

---

### Erreur 3 : Colonne `last_activity` absente sur `pev_profiles`

**Requête échouée:**
```
GET /rest/v1/pev_profiles?select=last_activity&last_activity=gte.2025-12-05
```

**Cause:**
- Fonctionnalité "utilisateurs actifs récemment" codée sans colonne correspondante
- Hypothèse incorrecte sur le schéma existant

**Leçon apprise:**
> ⚠️ Les fonctionnalités analytics nécessitent des colonnes de tracking dédiées

---

### Erreur 4 : Colonne `created_at` absente sur `pev_connections`

**Requête échouée:**
```
GET /rest/v1/pev_connections?select=id,status,created_at&order=created_at.desc
```

**Cause:**
- Table créée sans timestamp de création
- Tri chronologique impossible

**Leçon apprise:**
> ⚠️ **TOUJOURS** inclure `created_at` et `updated_at` dans toute nouvelle table

---

### Erreur 5 : Foreign Key manquante sur `pev_events`

**Requête échouée:**
```
GET /rest/v1/pev_events?select=id,title,pev_profiles:created_by(first_name,last_name)
```

**Cause:**
- La syntaxe PostgREST pour les jointures nécessite une FK déclarée
- La colonne `created_by` existait mais sans contrainte FK vers `pev_profiles`

**Leçon apprise:**
> ⚠️ Les jointures PostgREST/Supabase nécessitent des **foreign keys explicites**

---

### Erreur 6 : Policies RLS récursives sur messagerie (CRITIQUE)

**Requête échouée:**
```
GET /rest/v1/pev_messages?select=id&created_at=gte.2025-12-05
```

**Erreur retournée:**
```
infinite recursion detected in policy for relation "pev_conversation_participants"
```

**Cause:**
- Les policies RLS sur `pev_messages`, `pev_conversations`, et `pev_conversation_participants` se référençaient mutuellement
- Exemple de récursion :
  ```sql
  -- Policy sur pev_messages qui référence pev_conversation_participants
  USING (conversation_id IN (SELECT conversation_id FROM pev_conversation_participants WHERE ...))
  
  -- Policy sur pev_conversation_participants qui référence pev_conversations
  USING (conversation_id IN (SELECT id FROM pev_conversations WHERE ...))
  
  -- Policy sur pev_conversations qui référence pev_conversation_participants
  USING (id IN (SELECT conversation_id FROM pev_conversation_participants WHERE ...))
  ```

**Leçon apprise:**
> ⚠️ **JAMAIS** créer de policies RLS qui se référencent circulairement entre tables

---

## 🛠️ MIGRATIONS APPLIQUÉES

### Migration 1 : `add_missing_columns_admin.sql`
- Ajout de `pev_forum_topics.status`
- Ajout de `pev_profiles.last_activity`
- Ajout de `pev_connections.created_at`

### Migration 2 : `fix_messages_rls_recursion.sql`
- Désactivation RLS temporaire sur 3 tables
- Suppression de TOUTES les policies existantes
- Recréation de policies SIMPLES sans références croisées

### Migration 3 : `create_pev_reports_table.sql`
- Création complète de la table `pev_reports`
- Indexes et policies RLS inclus

### Migration 4 : `add_missing_foreign_keys.sql`
- Ajout FK `pev_events.created_by → pev_profiles.id`

---

## ✅ RÈGLES POUR ÉVITER CES ERREURS

### Règle 1 : Vérification Systématique du Schéma

**AVANT tout développement impliquant une table :**
```bash
cd script_tools
node test-columns.js <nom_table>
```

### Règle 2 : Colonnes Obligatoires sur Toute Nouvelle Table

```sql
CREATE TABLE nouvelle_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ... colonnes métier ...
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Règle 3 : Foreign Keys Explicites pour Jointures

```sql
-- CORRECT : FK déclarée
ALTER TABLE pev_events 
ADD CONSTRAINT pev_events_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES pev_profiles(id);

-- APRÈS : Jointure fonctionne
.select('id, pev_profiles:created_by(first_name)')
```

### Règle 4 : Policies RLS Sans Récursion

**❌ INTERDIT :**
```sql
-- Table A référence B
CREATE POLICY ON table_a USING (x IN (SELECT y FROM table_b WHERE ...))
-- Table B référence A
CREATE POLICY ON table_b USING (y IN (SELECT x FROM table_a WHERE ...))
```

**✅ CORRECT :**
```sql
-- Policies simples basées sur auth.uid() uniquement
CREATE POLICY ON table_a USING (user_id = auth.uid());
CREATE POLICY ON table_b USING (owner_id = auth.uid());
```

### Règle 5 : Script de Vérification Avant Déploiement

```bash
# Exécuter avant chaque mise en production
node script_tools/verify-admin-tables.js
```

---

## 📁 FICHIERS DE RÉFÉRENCE

| Fichier | Description |
|---------|-------------|
| `script_tools/verify-admin-tables.js` | Vérifie tables/colonnes admin |
| `script_tools/test-columns.js` | Vérifie colonnes d'une table |
| `script_tools/verify-buckets.js` | Vérifie buckets Storage |
| `script_tools/check-rls-policies.js` | Teste les policies RLS |

---

## 📝 CHECKLIST PRÉ-DÉPLOIEMENT

- [ ] Toutes les tables référencées existent
- [ ] Toutes les colonnes utilisées existent
- [ ] Toutes les FK nécessaires aux jointures sont déclarées
- [ ] Les policies RLS ne créent pas de récursion
- [ ] Les buckets Storage existent
- [ ] `verify-admin-tables.js` passe sans erreur

---

**Document créé le 2026-01-04 pour référence future.**
