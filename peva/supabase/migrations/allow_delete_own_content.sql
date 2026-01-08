-- ============================================
-- Migration: Permettre suppression contenus propres (tous statuts)
-- Date: 2026-01-08
-- Description: Les créateurs peuvent supprimer leurs contenus même publiés
--              Les admins peuvent supprimer tout contenu
-- ============================================

-- ============================================
-- ÉVÉNEMENTS (pev_events)
-- ============================================

-- Supprimer anciennes policies restrictives
DROP POLICY IF EXISTS "Users can delete own events" ON pev_events;
DROP POLICY IF EXISTS "Users can delete own draft events" ON pev_events;
DROP POLICY IF EXISTS "Admins can delete any event" ON pev_events;

-- Créateurs peuvent supprimer leurs événements (TOUS statuts)
CREATE POLICY "Users can delete own events"
ON pev_events FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Admins peuvent supprimer tout événement
CREATE POLICY "Admins can delete any event"
ON pev_events FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'moderator')
  )
);

-- ============================================
-- OPPORTUNITÉS (pev_opportunities)
-- ============================================

-- Supprimer anciennes policies
DROP POLICY IF EXISTS "Users can delete own opportunities" ON pev_opportunities;
DROP POLICY IF EXISTS "Admins can delete any opportunity" ON pev_opportunities;

-- Créateurs peuvent supprimer leurs opportunités (TOUS statuts)
CREATE POLICY "Users can delete own opportunities"
ON pev_opportunities FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Admins peuvent supprimer toute opportunité
CREATE POLICY "Admins can delete any opportunity"
ON pev_opportunities FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'moderator')
  )
);

-- ============================================
-- RESSOURCES (pev_resources)
-- ============================================

-- Supprimer anciennes policies
DROP POLICY IF EXISTS "Users can delete own resources" ON pev_resources;
DROP POLICY IF EXISTS "Admins can delete any resource" ON pev_resources;

-- Créateurs peuvent supprimer leurs ressources (TOUS statuts)
CREATE POLICY "Users can delete own resources"
ON pev_resources FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Admins peuvent supprimer toute ressource
CREATE POLICY "Admins can delete any resource"
ON pev_resources FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'moderator')
  )
);

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT 'Policies DELETE créées pour pev_events, pev_opportunities, pev_resources' as message;
