-- ============================================================
-- MIGRATION: Ajouter les foreign keys manquantes pour jointures
-- Date: 2026-01-04
-- Description: Corrige erreur 400 sur jointures pev_events
-- ============================================================

-- ============================================================
-- 1. Ajouter FK sur pev_events.created_by → pev_profiles.id
-- ============================================================

-- Vérifier et ajouter la contrainte FK si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'pev_events_created_by_fkey'
    AND table_name = 'pev_events'
  ) THEN
    ALTER TABLE pev_events 
    ADD CONSTRAINT pev_events_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES pev_profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
