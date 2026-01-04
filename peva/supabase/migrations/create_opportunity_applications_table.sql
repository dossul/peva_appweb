-- =====================================================
-- Table des candidatures aux opportunités
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Table principale des candidatures
CREATE TABLE IF NOT EXISTS pev_opportunity_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES pev_opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Statut de la candidature
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected', 'withdrawn')),
  
  -- Informations de candidature
  cover_letter TEXT,
  resume_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  
  -- Notes et feedback
  applicant_notes TEXT,
  reviewer_notes TEXT,
  rejection_reason TEXT,
  
  -- Métadonnées
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contrainte d'unicité: un utilisateur ne peut postuler qu'une fois par opportunité
  UNIQUE(opportunity_id, user_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON pev_opportunity_applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON pev_opportunity_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON pev_opportunity_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON pev_opportunity_applications(created_at DESC);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_application_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-update
DROP TRIGGER IF EXISTS trigger_update_application_timestamp ON pev_opportunity_applications;
CREATE TRIGGER trigger_update_application_timestamp
  BEFORE UPDATE ON pev_opportunity_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_application_updated_at();

-- =====================================================
-- Politiques RLS (Row Level Security)
-- =====================================================

ALTER TABLE pev_opportunity_applications ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leurs propres candidatures
CREATE POLICY "Users can view own applications"
  ON pev_opportunity_applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique: Les créateurs d'opportunités peuvent voir les candidatures sur leurs opportunités
CREATE POLICY "Opportunity creators can view applications"
  ON pev_opportunity_applications
  FOR SELECT
  USING (
    opportunity_id IN (
      SELECT id FROM pev_opportunities WHERE created_by = auth.uid()
    )
  );

-- Politique: Les admins/modérateurs peuvent tout voir
CREATE POLICY "Admins can view all applications"
  ON pev_opportunity_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pev_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'moderator')
    )
  );

-- Politique: Les utilisateurs peuvent créer leurs propres candidatures
CREATE POLICY "Users can create own applications"
  ON pev_opportunity_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent modifier leurs candidatures (retirer)
CREATE POLICY "Users can update own applications"
  ON pev_opportunity_applications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique: Les créateurs d'opportunités peuvent mettre à jour le statut des candidatures
CREATE POLICY "Opportunity creators can update application status"
  ON pev_opportunity_applications
  FOR UPDATE
  USING (
    opportunity_id IN (
      SELECT id FROM pev_opportunities WHERE created_by = auth.uid()
    )
  );

-- Politique: Les admins peuvent tout modifier
CREATE POLICY "Admins can update all applications"
  ON pev_opportunity_applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pev_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'moderator')
    )
  );

-- Politique: Les utilisateurs peuvent supprimer leurs propres candidatures
CREATE POLICY "Users can delete own applications"
  ON pev_opportunity_applications
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- Vue pour compter les candidatures par opportunité
-- =====================================================

CREATE OR REPLACE VIEW pev_opportunity_applications_count AS
SELECT 
  opportunity_id,
  COUNT(*) as total_applications,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'accepted') as accepted_count,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count
FROM pev_opportunity_applications
GROUP BY opportunity_id;

-- =====================================================
-- Templates d'email pour les candidatures
-- =====================================================

-- Template: Candidature acceptée
INSERT INTO pev_email_templates (category_id, code, name, description, subject, html_content, text_content, variables, is_system) 
SELECT 
  (SELECT id FROM pev_email_categories WHERE slug = 'opportunities'),
  'application_accepted',
  'Candidature acceptée',
  'Email envoyé quand une candidature est acceptée',
  '🎉 Félicitations ! Votre candidature a été acceptée - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: Segoe UI, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 Candidature Acceptée !</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px;">Excellente nouvelle ! Votre candidature a été acceptée pour :</p>
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <h2 style="color: #2e7d32; margin: 0;">{{opportunity_title}}</h2>
          <p style="color: #666; margin: 10px 0 0 0;">{{company_name}}</p>
        </div>
        <p style="color: #333; font-size: 16px;">L''entreprise vous contactera prochainement pour les prochaines étapes.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir les détails</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Excellente nouvelle ! Votre candidature a été acceptée pour "{{opportunity_title}}" chez {{company_name}}.

L''entreprise vous contactera prochainement.

Voir les détails: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "opportunity_title", "company_name", "action_url"]',
  true
WHERE NOT EXISTS (SELECT 1 FROM pev_email_templates WHERE code = 'application_accepted');

-- Template: Candidature rejetée
INSERT INTO pev_email_templates (category_id, code, name, description, subject, html_content, text_content, variables, is_system) 
SELECT 
  (SELECT id FROM pev_email_categories WHERE slug = 'opportunities'),
  'application_rejected',
  'Candidature rejetée',
  'Email envoyé quand une candidature est rejetée',
  'Mise à jour sur votre candidature - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: Segoe UI, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #546e7a 0%, #78909c 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Mise à jour de candidature</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px;">Nous vous remercions pour l''intérêt porté à cette opportunité :</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #546e7a; margin: 0;">{{opportunity_title}}</h2>
        </div>
        <p style="color: #333; font-size: 16px;">Après examen attentif, l''entreprise a décidé de poursuivre avec d''autres candidats.</p>
        <p style="color: #333; font-size: 16px;">Ne vous découragez pas ! De nouvelles opportunités sont publiées régulièrement sur la plateforme.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="background-color: #1976d2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir d''autres opportunités</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Nous vous remercions pour votre candidature à "{{opportunity_title}}".

Après examen, l''entreprise a décidé de poursuivre avec d''autres candidats.

Ne vous découragez pas ! Voir d''autres opportunités: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "opportunity_title", "action_url"]',
  true
WHERE NOT EXISTS (SELECT 1 FROM pev_email_templates WHERE code = 'application_rejected');

-- =====================================================
-- Vérification
-- =====================================================
SELECT 'Table pev_opportunity_applications créée avec succès' as status;
SELECT COUNT(*) as policies_count FROM pg_policies WHERE tablename = 'pev_opportunity_applications';
