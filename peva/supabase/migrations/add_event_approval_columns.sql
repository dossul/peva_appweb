-- =====================================================
-- Ajout colonnes pour workflow approbation événements
-- Date: 2026-01-08
-- =====================================================

-- Ajouter require_approval et document_url à pev_events
ALTER TABLE pev_events 
ADD COLUMN IF NOT EXISTS require_approval BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS document_url TEXT;

-- Ajouter colonnes pour gestion approbation dans pev_event_participants
ALTER TABLE pev_event_participants
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Ajouter policy UPDATE pour permettre aux organisateurs de gérer les participants
DROP POLICY IF EXISTS "Organizers can update participants" ON pev_event_participants;
CREATE POLICY "Organizers can update participants" ON pev_event_participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pev_events 
      WHERE pev_events.id = pev_event_participants.event_id 
      AND pev_events.created_by = auth.uid()
    )
  );

-- Commentaires
COMMENT ON COLUMN pev_events.require_approval IS 'Si true, les inscriptions nécessitent approbation manuelle';
COMMENT ON COLUMN pev_events.document_url IS 'URL du document joint à l événement';
COMMENT ON COLUMN pev_event_participants.approved_at IS 'Date d approbation de l inscription';
COMMENT ON COLUMN pev_event_participants.rejection_reason IS 'Raison du rejet de l inscription';

SELECT 'Colonnes approbation événements ajoutées!' as message;
