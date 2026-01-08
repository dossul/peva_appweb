-- Fix RLS policies pour pev_event_participants
-- Date: 2026-01-06

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Authenticated users can register for events" ON pev_event_participants;
DROP POLICY IF EXISTS "Users can view event participants" ON pev_event_participants;
DROP POLICY IF EXISTS "Users can delete own registration" ON pev_event_participants;

-- Policy SELECT: tout le monde peut voir les participants
CREATE POLICY "Anyone can view event participants" ON pev_event_participants
  FOR SELECT USING (true);

-- Policy INSERT: utilisateurs authentifiés peuvent s'inscrire (seulement eux-mêmes)
CREATE POLICY "Users can register for events" ON pev_event_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy DELETE: utilisateurs peuvent annuler leur propre inscription
CREATE POLICY "Users can cancel own registration" ON pev_event_participants
  FOR DELETE USING (auth.uid() = user_id);

SELECT 'RLS policies pev_event_participants créées!' as message;
