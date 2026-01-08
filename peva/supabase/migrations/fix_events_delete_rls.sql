-- Migration: Corriger RLS pour suppression événements
-- Date: 2026-01-08

-- Permettre aux utilisateurs de supprimer leurs propres événements (brouillons et rejetés)
DROP POLICY IF EXISTS "Users can delete own events" ON pev_events;

CREATE POLICY "Users can delete own events"
ON pev_events FOR DELETE
TO authenticated
USING (
  created_by = auth.uid() 
  AND status IN ('draft', 'rejected')
);

-- Permettre la suppression de tous les événements pour les admins
DROP POLICY IF EXISTS "Admins can delete any event" ON pev_events;

CREATE POLICY "Admins can delete any event"
ON pev_events FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pev_users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

SELECT 'Politiques RLS de suppression événements créées' as message;
