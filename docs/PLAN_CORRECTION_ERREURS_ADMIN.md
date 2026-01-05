# 📋 PLAN DE RÉSOLUTION DES ERREURS ADMIN DASHBOARD
**Date d'investigation**: 2026-01-04 21:18 UTC  
**Statut**: EN ATTENTE DE VALIDATION

---

## 🔍 RÉSUMÉ DES ERREURS DÉTECTÉES

| Table | Type d'erreur | Problème |
|-------|---------------|----------|
| `pev_reports` | 400 Bad Request | **Table n'existe pas** |
| `pev_forum_topics` | 400 Bad Request | Colonne `status` manquante |
| `pev_messages` | 500 Internal Error | **Policy RLS récursive** |
| `pev_profiles` | 400 Bad Request | Colonne `last_activity` manquante |
| `pev_connections` | 400 Bad Request | Colonne `created_at` manquante |
| `pev_events` | 400 Bad Request | ✅ OK (jointure peut-être mal configurée) |

---

## 📊 DIAGNOSTIC DÉTAILLÉ

### 1. ❌ Table `pev_reports` - N'EXISTE PAS

**Erreur console:**
```
GET /rest/v1/pev_reports?select=id,content,reporter_id,priority,created_at,pev_profiles:reporter_id(first_name,last_name) 400
```

**Colonnes requises:**
- `id` (UUID, PK)
- `content` (TEXT)
- `reporter_id` (UUID, FK → pev_profiles.id)
- `priority` (TEXT: 'low', 'medium', 'high')
- `created_at` (TIMESTAMPTZ)
- `status` (TEXT: 'pending', 'reviewed', 'resolved')
- `target_type` (TEXT: 'user', 'opportunity', 'event', 'resource')
- `target_id` (UUID)

**Action requise:** Créer la table complète

---

### 2. ⚠️ Table `pev_forum_topics` - Colonne `status` manquante

**Erreur console:**
```
GET /rest/v1/pev_forum_topics?select=status 400
```

**Action requise:** Ajouter colonne `status`

---

### 3. ❌ Table `pev_messages` - Policy RLS récursive

**Erreur console:**
```
GET /rest/v1/pev_messages?... 500 Internal Server Error
```

**Diagnostic:**
```
infinite recursion detected in policy for relation "pev_conversation_participants"
```

**Action requise:** Corriger les policies RLS de `pev_conversation_participants`

---

### 4. ⚠️ Table `pev_profiles` - Colonne `last_activity` manquante

**Erreur console:**
```
GET /rest/v1/pev_profiles?select=last_activity&last_activity=gte.2025-12-05 400
```

**Action requise:** Ajouter colonne `last_activity`

---

### 5. ⚠️ Table `pev_connections` - Colonne `created_at` manquante

**Erreur console:**
```
GET /rest/v1/pev_connections?select=id,status,created_at&order=created_at.desc 400
```

**Action requise:** Ajouter colonne `created_at`

---

## 🛠️ MIGRATIONS SQL REQUISES

### Migration 1: Créer table `pev_reports`

```sql
-- Migration: create_pev_reports_table.sql

CREATE TABLE IF NOT EXISTS pev_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  reporter_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'opportunity', 'event', 'resource', 'forum_post', 'message')),
  target_id UUID NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES pev_profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_pev_reports_status ON pev_reports(status);
CREATE INDEX idx_pev_reports_priority ON pev_reports(priority);
CREATE INDEX idx_pev_reports_created_at ON pev_reports(created_at DESC);

-- RLS
ALTER TABLE pev_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON pev_reports
FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports" ON pev_reports
FOR SELECT TO authenticated USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports" ON pev_reports
FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM pev_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins can update reports" ON pev_reports
FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM pev_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
```

---

### Migration 2: Ajouter colonnes manquantes

```sql
-- Migration: add_missing_columns_admin.sql

-- Ajouter status à pev_forum_topics
ALTER TABLE pev_forum_topics 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
CHECK (status IN ('active', 'closed', 'archived', 'flagged'));

-- Ajouter last_activity à pev_profiles
ALTER TABLE pev_profiles 
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ DEFAULT NOW();

-- Ajouter created_at à pev_connections
ALTER TABLE pev_connections 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Index pour les requêtes
CREATE INDEX IF NOT EXISTS idx_pev_profiles_last_activity ON pev_profiles(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_pev_connections_created_at ON pev_connections(created_at DESC);
```

---

### Migration 3: Corriger policy RLS récursive sur pev_messages

```sql
-- Migration: fix_messages_rls_recursion.sql

-- Supprimer les policies problématiques
DROP POLICY IF EXISTS "Users can view their conversations" ON pev_conversation_participants;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON pev_messages;

-- Recréer avec des policies simples sans récursion
CREATE POLICY "conversation_participants_select" ON pev_conversation_participants
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "conversation_participants_insert" ON pev_conversation_participants
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Policy pour pev_messages sans jointure récursive
CREATE POLICY "messages_select" ON pev_messages
FOR SELECT TO authenticated USING (
  sender_id = auth.uid() OR 
  conversation_id IN (
    SELECT conversation_id FROM pev_conversation_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "messages_insert" ON pev_messages
FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
```

---

## 📝 ORDRE D'EXÉCUTION RECOMMANDÉ

| Étape | Migration | Priorité | Impact |
|-------|-----------|----------|--------|
| 1 | `add_missing_columns_admin.sql` | HAUTE | Corrige 3 erreurs 400 |
| 2 | `fix_messages_rls_recursion.sql` | HAUTE | Corrige erreur 500 |
| 3 | `create_pev_reports_table.sql` | MOYENNE | Nouvelle fonctionnalité |

---

## ⚠️ ACTIONS CODE REQUISES APRÈS MIGRATIONS

### Si migrations impossibles, adapter le code:

1. **Supprimer/commenter les requêtes vers `pev_reports`** si table non créée
2. **Supprimer la colonne `status`** des requêtes `pev_forum_topics`
3. **Supprimer la colonne `last_activity`** des requêtes `pev_profiles`
4. **Supprimer la colonne `created_at`** des requêtes `pev_connections`

---

## ✅ VALIDATION REQUISE

**AVANT d'appliquer ces migrations, confirmez:**

- [ ] Migration 1: Créer table `pev_reports`
- [ ] Migration 2: Ajouter colonnes manquantes
- [ ] Migration 3: Corriger RLS pev_messages

**OU**

- [ ] Adapter le code pour ne pas utiliser ces colonnes/tables

---

## 📁 FICHIERS DE MIGRATION À CRÉER

```
peva/supabase/migrations/
├── create_pev_reports_table.sql
├── add_missing_columns_admin.sql
└── fix_messages_rls_recursion.sql
```

---

**Investigation réalisée avec:** `script_tools/verify-admin-tables.js`
