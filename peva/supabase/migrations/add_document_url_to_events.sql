-- Migration: Ajouter colonne document_url à pev_events
-- Date: 2026-01-08

-- Ajouter la colonne document_url pour stocker les documents joints aux événements
ALTER TABLE pev_events 
ADD COLUMN IF NOT EXISTS document_url TEXT;

-- Ajouter un commentaire pour documentation
COMMENT ON COLUMN pev_events.document_url IS 'URL du document joint à l événement (PDF, DOC, etc.)';

SELECT 'Colonne document_url ajoutée à pev_events' as message;
