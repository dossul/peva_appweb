-- =====================================================
-- Policy RLS INSERT pour pev_events
-- Permet aux utilisateurs authentifiés de créer des événements
-- =====================================================

-- Policy pour créer des événements (authenticated users)
DROP POLICY IF EXISTS "Authenticated users can create events" ON pev_events;
CREATE POLICY "Authenticated users can create events" ON pev_events
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

-- Policy pour voir ses propres événements (même non publiés)
DROP POLICY IF EXISTS "Users can view own events" ON pev_events;
CREATE POLICY "Users can view own events" ON pev_events
  FOR SELECT 
  USING (auth.uid() = created_by OR status = 'published');

-- Policy pour modifier ses propres événements
DROP POLICY IF EXISTS "Users can update own events" ON pev_events;
CREATE POLICY "Users can update own events" ON pev_events
  FOR UPDATE 
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Policy pour supprimer ses propres événements (brouillons uniquement)
DROP POLICY IF EXISTS "Users can delete own draft events" ON pev_events;
CREATE POLICY "Users can delete own draft events" ON pev_events
  FOR DELETE 
  USING (auth.uid() = created_by AND status = 'draft');

-- Vérification
SELECT 'Policies INSERT/UPDATE/DELETE pour pev_events créées!' as message;
