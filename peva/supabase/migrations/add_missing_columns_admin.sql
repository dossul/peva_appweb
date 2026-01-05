-- ============================================================
-- MIGRATION: Ajouter colonnes manquantes pour Admin Dashboard
-- Date: 2026-01-04
-- Description: Corrige les erreurs 400 Bad Request
-- ============================================================

-- ============================================================
-- 1. Ajouter status à pev_forum_topics
-- ============================================================

ALTER TABLE pev_forum_topics 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Ajouter contrainte CHECK
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'pev_forum_topics_status_check'
  ) THEN
    ALTER TABLE pev_forum_topics 
    ADD CONSTRAINT pev_forum_topics_status_check 
    CHECK (status IN ('active', 'closed', 'archived', 'flagged'));
  END IF;
END $$;

COMMENT ON COLUMN pev_forum_topics.status IS 'Statut du topic: active, closed, archived, flagged';

-- ============================================================
-- 2. Ajouter last_activity à pev_profiles
-- ============================================================

ALTER TABLE pev_profiles 
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ DEFAULT NOW();

COMMENT ON COLUMN pev_profiles.last_activity IS 'Dernière activité de l''utilisateur sur la plateforme';

-- Index pour les requêtes de tri par activité récente
CREATE INDEX IF NOT EXISTS idx_pev_profiles_last_activity 
ON pev_profiles(last_activity DESC);

-- ============================================================
-- 3. Ajouter created_at à pev_connections
-- ============================================================

ALTER TABLE pev_connections 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

COMMENT ON COLUMN pev_connections.created_at IS 'Date de création de la demande de connexion';

-- Index pour les requêtes de tri chronologique
CREATE INDEX IF NOT EXISTS idx_pev_connections_created_at 
ON pev_connections(created_at DESC);

-- ============================================================
-- 4. Mettre à jour les valeurs existantes si NULL
-- ============================================================

-- Mettre à jour last_activity pour les profils existants
UPDATE pev_profiles 
SET last_activity = COALESCE(updated_at, created_at, NOW())
WHERE last_activity IS NULL;

-- Mettre à jour created_at pour les connexions existantes
UPDATE pev_connections 
SET created_at = NOW()
WHERE created_at IS NULL;

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
