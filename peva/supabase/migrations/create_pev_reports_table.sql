-- ============================================================
-- MIGRATION: Créer table pev_reports pour signalements
-- Date: 2026-01-04
-- Description: Table pour gérer les signalements de contenu/utilisateurs
-- ============================================================

-- ============================================================
-- 1. Créer la table pev_reports
-- ============================================================

CREATE TABLE IF NOT EXISTS pev_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations du signalement
  content TEXT NOT NULL,
  reporter_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
  
  -- Cible du signalement
  target_type TEXT NOT NULL CHECK (target_type IN (
    'user', 
    'opportunity', 
    'event', 
    'resource', 
    'forum_post', 
    'forum_topic',
    'message',
    'company'
  )),
  target_id UUID NOT NULL,
  
  -- Priorité et statut
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  
  -- Gestion admin
  admin_notes TEXT,
  reviewed_by UUID REFERENCES pev_profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. Créer les index pour optimiser les requêtes
-- ============================================================

CREATE INDEX idx_pev_reports_status ON pev_reports(status);
CREATE INDEX idx_pev_reports_priority ON pev_reports(priority);
CREATE INDEX idx_pev_reports_created_at ON pev_reports(created_at DESC);
CREATE INDEX idx_pev_reports_reporter_id ON pev_reports(reporter_id);
CREATE INDEX idx_pev_reports_target ON pev_reports(target_type, target_id);

-- ============================================================
-- 3. Ajouter les commentaires
-- ============================================================

COMMENT ON TABLE pev_reports IS 'Signalements de contenu ou d''utilisateurs par la communauté';
COMMENT ON COLUMN pev_reports.content IS 'Description du problème signalé';
COMMENT ON COLUMN pev_reports.reporter_id IS 'Utilisateur qui a fait le signalement';
COMMENT ON COLUMN pev_reports.target_type IS 'Type d''élément signalé';
COMMENT ON COLUMN pev_reports.target_id IS 'ID de l''élément signalé';
COMMENT ON COLUMN pev_reports.priority IS 'Priorité du signalement';
COMMENT ON COLUMN pev_reports.status IS 'Statut du traitement';
COMMENT ON COLUMN pev_reports.admin_notes IS 'Notes internes des administrateurs';
COMMENT ON COLUMN pev_reports.reviewed_by IS 'Admin qui a traité le signalement';
COMMENT ON COLUMN pev_reports.reviewed_at IS 'Date de traitement du signalement';

-- ============================================================
-- 4. Activer RLS et créer les policies
-- ============================================================

ALTER TABLE pev_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent créer des signalements
CREATE POLICY "Users can create reports" 
ON pev_reports
FOR INSERT 
TO authenticated 
WITH CHECK (reporter_id = auth.uid());

-- Policy: Les utilisateurs peuvent voir leurs propres signalements
CREATE POLICY "Users can view own reports" 
ON pev_reports
FOR SELECT 
TO authenticated 
USING (reporter_id = auth.uid());

-- Policy: Les admins peuvent voir tous les signalements
CREATE POLICY "Admins can view all reports" 
ON pev_reports
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'moderator')
  )
);

-- Policy: Les admins peuvent mettre à jour les signalements
CREATE POLICY "Admins can update reports" 
ON pev_reports
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'moderator')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'moderator')
  )
);

-- Policy: Seuls les super_admins peuvent supprimer des signalements
CREATE POLICY "Super admins can delete reports" 
ON pev_reports
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- ============================================================
-- 5. Créer une fonction trigger pour updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_pev_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pev_reports_updated_at
BEFORE UPDATE ON pev_reports
FOR EACH ROW
EXECUTE FUNCTION update_pev_reports_updated_at();

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
