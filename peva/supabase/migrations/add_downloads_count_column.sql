-- ============================================================
-- MIGRATION: Ajouter colonne downloads_count à pev_resources
-- Date: 2026-01-06
-- ============================================================

-- Ajouter la colonne downloads_count si elle n'existe pas
ALTER TABLE pev_resources 
ADD COLUMN IF NOT EXISTS downloads_count INTEGER DEFAULT 0;

-- Mettre à jour les valeurs NULL existantes
UPDATE pev_resources SET downloads_count = 0 WHERE downloads_count IS NULL;
