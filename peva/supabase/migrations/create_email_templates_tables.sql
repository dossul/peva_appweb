-- =====================================================
-- Tables pour les Templates d'Emails - 2iEGreenHub
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS pev_email_template_variables CASCADE;
DROP TABLE IF EXISTS pev_email_templates CASCADE;
DROP TABLE IF EXISTS pev_email_categories CASCADE;

-- =====================================================
-- Table des catégories de templates
-- =====================================================
CREATE TABLE pev_email_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'mdi-email',
  color VARCHAR(50) DEFAULT 'blue',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table des templates d'emails
-- =====================================================
CREATE TABLE pev_email_templates (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES pev_email_categories(id) ON DELETE SET NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table des variables disponibles pour les templates
-- =====================================================
CREATE TABLE pev_email_template_variables (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT NOT NULL REFERENCES pev_email_templates(id) ON DELETE CASCADE,
  variable_name VARCHAR(100) NOT NULL,
  variable_type VARCHAR(50) DEFAULT 'string',
  description TEXT,
  default_value TEXT,
  is_required BOOLEAN DEFAULT false,
  UNIQUE(template_id, variable_name)
);

-- =====================================================
-- Index pour performances
-- =====================================================
CREATE INDEX idx_pev_email_templates_code ON pev_email_templates(code);
CREATE INDEX idx_pev_email_templates_category ON pev_email_templates(category_id);
CREATE INDEX idx_pev_email_templates_active ON pev_email_templates(is_active);

-- =====================================================
-- Activer RLS
-- =====================================================
ALTER TABLE pev_email_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_email_template_variables ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Policies RLS - Admin seulement
-- =====================================================
CREATE POLICY "Admin read email categories" ON pev_email_categories 
  FOR SELECT USING (true);

CREATE POLICY "Admin manage email categories" ON pev_email_categories 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pev_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin read email templates" ON pev_email_templates 
  FOR SELECT USING (true);

CREATE POLICY "Admin manage email templates" ON pev_email_templates 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pev_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin read template variables" ON pev_email_template_variables 
  FOR SELECT USING (true);

CREATE POLICY "Admin manage template variables" ON pev_email_template_variables 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pev_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- Catégories par défaut
-- =====================================================
INSERT INTO pev_email_categories (name, slug, description, icon, color, display_order) VALUES
  ('Authentification', 'auth', 'Emails liés à l''authentification et la sécurité', 'mdi-lock', 'red', 1),
  ('Messages', 'messages', 'Notifications de messagerie', 'mdi-message', 'blue', 2),
  ('Connexions', 'connections', 'Demandes de connexion et réseau', 'mdi-account-group', 'green', 3),
  ('Événements', 'events', 'Notifications d''événements', 'mdi-calendar', 'purple', 4),
  ('Opportunités', 'opportunities', 'Notifications d''opportunités', 'mdi-briefcase', 'orange', 5),
  ('Système', 'system', 'Notifications système', 'mdi-cog', 'grey', 6);

-- =====================================================
-- Templates par défaut
-- =====================================================

-- Template: Nouveau message
INSERT INTO pev_email_templates (category_id, code, name, description, subject, html_content, text_content, variables, is_system) VALUES
(
  (SELECT id FROM pev_email_categories WHERE slug = 'messages'),
  'new_message',
  'Notification de nouveau message',
  'Email envoyé quand un utilisateur reçoit un nouveau message',
  '💬 Nouveau message de {{sender_name}} - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau message</title>
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">💬 Nouveau Message</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Vous avez reçu un nouveau message de <strong>{{sender_name}}</strong> sur 2iE GreenHub.</p>
        <div style="background-color: #f8f9fa; border-left: 4px solid #1976d2; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #666; font-size: 14px; margin: 0; font-style: italic;">"{{message_preview}}"</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #1976d2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir le message</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Vous avez reçu un nouveau message de {{sender_name}} sur 2iE GreenHub.

"{{message_preview}}"

Voir le message: {{action_url}}

---
2iE GreenHub - Plateforme de l''Économie Verte Africaine',
  '["recipient_name", "sender_name", "message_preview", "action_url"]',
  true
),

-- Template: Demande de connexion
(
  (SELECT id FROM pev_email_categories WHERE slug = 'connections'),
  'connection_request',
  'Demande de connexion',
  'Email envoyé quand quelqu''un souhaite se connecter',
  '🤝 {{sender_name}} souhaite se connecter avec vous - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🤝 Nouvelle Demande de Connexion</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;"><strong>{{sender_name}}</strong>{{#sender_organization}} de <em>{{sender_organization}}</em>{{/sender_organization}} souhaite se connecter avec vous sur 2iE GreenHub.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir le profil</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

{{sender_name}} souhaite se connecter avec vous sur 2iE GreenHub.

Voir le profil: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "sender_name", "sender_organization", "action_url"]',
  true
),

-- Template: Rappel d'événement
(
  (SELECT id FROM pev_email_categories WHERE slug = 'events'),
  'event_reminder',
  'Rappel d''événement',
  'Email de rappel avant un événement',
  '📅 Rappel: {{event_title}} - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📅 Rappel d''Événement</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Nous vous rappelons que vous êtes inscrit(e) à l''événement suivant :</p>
        <div style="background-color: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #7b1fa2; margin: 0 0 10px 0; font-size: 20px;">{{event_title}}</h2>
          <p style="color: #666; margin: 5px 0;"><strong>📆 Date:</strong> {{event_date}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>📍 Lieu:</strong> {{event_location}}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #7b1fa2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir les détails</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Rappel: Vous êtes inscrit(e) à l''événement "{{event_title}}"

📆 Date: {{event_date}}
📍 Lieu: {{event_location}}

Voir les détails: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "event_title", "event_date", "event_location", "action_url"]',
  true
),

-- Template: Bienvenue
(
  (SELECT id FROM pev_email_categories WHERE slug = 'auth'),
  'welcome',
  'Email de bienvenue',
  'Email envoyé après l''inscription',
  '🎉 Bienvenue sur 2iE GreenHub, {{user_name}} !',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 Bienvenue sur 2iE GreenHub !</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{user_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bienvenue sur 2iE GreenHub, la plateforme de l''économie verte africaine !</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
        <ul style="color: #333; font-size: 16px;">
          <li>Compléter votre profil</li>
          <li>Découvrir les opportunités</li>
          <li>Vous connecter avec d''autres membres</li>
          <li>Participer aux événements</li>
        </ul>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Compléter mon profil</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bienvenue sur 2iE GreenHub, {{user_name}} !

Votre compte a été créé avec succès.

Compléter votre profil: {{action_url}}

---
2iE GreenHub',
  '["user_name", "action_url"]',
  true
),

-- Template: Réinitialisation mot de passe
(
  (SELECT id FROM pev_email_categories WHERE slug = 'auth'),
  'password_reset',
  'Réinitialisation du mot de passe',
  'Email pour réinitialiser le mot de passe',
  '🔐 Réinitialisation de votre mot de passe - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔐 Réinitialisation du mot de passe</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{user_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Vous avez demandé la réinitialisation de votre mot de passe sur 2iE GreenHub.</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #d32f2f; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Réinitialiser mon mot de passe</a>
            </td>
          </tr>
        </table>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">Ce lien expire dans 1 heure. Si vous n''avez pas demandé cette réinitialisation, ignorez cet email.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Réinitialisation de votre mot de passe - 2iE GreenHub

Bonjour {{user_name}},

Cliquez sur ce lien pour réinitialiser votre mot de passe:
{{action_url}}

Ce lien expire dans 1 heure.

---
2iE GreenHub',
  '["user_name", "action_url"]',
  true
),

-- Template: Nouvelle opportunité
(
  (SELECT id FROM pev_email_categories WHERE slug = 'opportunities'),
  'new_opportunity',
  'Nouvelle opportunité',
  'Notification pour une nouvelle opportunité correspondant aux critères',
  '💼 Nouvelle opportunité: {{opportunity_title}} - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #ef6c00 0%, #ff9800 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">💼 Nouvelle Opportunité</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Une nouvelle opportunité correspondant à vos critères vient d''être publiée :</p>
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef6c00;">
          <h2 style="color: #ef6c00; margin: 0 0 10px 0; font-size: 20px;">{{opportunity_title}}</h2>
          <p style="color: #666; margin: 5px 0;"><strong>Type:</strong> {{opportunity_type}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Secteur:</strong> {{opportunity_sector}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Date limite:</strong> {{deadline}}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #ef6c00; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir l''opportunité</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Nouvelle opportunité - 2iE GreenHub

Bonjour {{recipient_name}},

Nouvelle opportunité: {{opportunity_title}}
Type: {{opportunity_type}}
Secteur: {{opportunity_sector}}
Date limite: {{deadline}}

Voir l''opportunité: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "opportunity_title", "opportunity_type", "opportunity_sector", "deadline", "action_url"]',
  true
);

-- Template: Connexion acceptée
INSERT INTO pev_email_templates (category_id, code, name, description, subject, html_content, text_content, variables, is_system) VALUES
(
  (SELECT id FROM pev_email_categories WHERE slug = 'connections'),
  'connection_accepted',
  'Connexion acceptée',
  'Email envoyé quand une demande de connexion est acceptée',
  '✅ {{accepter_name}} a accepté votre demande - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Connexion Acceptée !</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonne nouvelle ! <strong>{{accepter_name}}</strong> a accepté votre demande de connexion sur 2iE GreenHub.</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Vous pouvez maintenant échanger des messages et collaborer ensemble.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir mes connexions</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

{{accepter_name}} a accepté votre demande de connexion sur 2iE GreenHub.

Voir mes connexions: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "accepter_name", "action_url"]',
  true
),

-- Template: Inscription événement confirmée
(
  (SELECT id FROM pev_email_categories WHERE slug = 'events'),
  'event_registration',
  'Confirmation d''inscription événement',
  'Email envoyé après inscription à un événement',
  '🎟️ Inscription confirmée: {{event_title}} - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎟️ Inscription Confirmée</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Votre inscription à l''événement suivant est confirmée :</p>
        <div style="background-color: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #7b1fa2; margin: 0 0 10px 0; font-size: 20px;">{{event_title}}</h2>
          <p style="color: #666; margin: 5px 0;"><strong>📆 Date:</strong> {{event_date}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>📍 Lieu:</strong> {{event_location}}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #7b1fa2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir l''événement</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Votre inscription à "{{event_title}}" est confirmée.

📆 Date: {{event_date}}
📍 Lieu: {{event_location}}

Voir l''événement: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "event_title", "event_date", "event_location", "action_url"]',
  true
),

-- Template: Candidature reçue
(
  (SELECT id FROM pev_email_categories WHERE slug = 'opportunities'),
  'application_received',
  'Candidature reçue',
  'Email envoyé au créateur d''opportunité quand quelqu''un postule',
  '📩 Nouvelle candidature pour {{opportunity_title}} - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #ef6c00 0%, #ff9800 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📩 Nouvelle Candidature</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;"><strong>{{applicant_name}}</strong> a postulé pour votre opportunité :</p>
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef6c00;">
          <h2 style="color: #ef6c00; margin: 0 0 10px 0; font-size: 20px;">{{opportunity_title}}</h2>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #ef6c00; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir la candidature</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

{{applicant_name}} a postulé pour votre opportunité "{{opportunity_title}}".

Voir la candidature: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "applicant_name", "opportunity_title", "action_url"]',
  true
),

-- Template: Candidature envoyée (confirmation)
(
  (SELECT id FROM pev_email_categories WHERE slug = 'opportunities'),
  'application_sent',
  'Candidature envoyée',
  'Email de confirmation envoyé au candidat',
  '✅ Candidature envoyée: {{opportunity_title}} - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Candidature Envoyée</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Votre candidature a bien été envoyée pour l''opportunité suivante :</p>
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <h2 style="color: #1976d2; margin: 0 0 10px 0; font-size: 20px;">{{opportunity_title}}</h2>
          <p style="color: #666; margin: 5px 0;"><strong>Entreprise:</strong> {{company_name}}</p>
        </div>
        <p style="color: #666; font-size: 14px;">Vous serez notifié(e) dès que l''entreprise aura examiné votre candidature.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #2196f3; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Mes candidatures</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px; margin: 0;">© 2024 2iE GreenHub - Plateforme de l''Économie Verte Africaine</p>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Votre candidature pour "{{opportunity_title}}" chez {{company_name}} a bien été envoyée.

Vous serez notifié(e) dès que l''entreprise aura examiné votre candidature.

Mes candidatures: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "opportunity_title", "company_name", "action_url"]',
  true
);

-- =====================================================
-- Ajouter les variables pour chaque template
-- =====================================================
INSERT INTO pev_email_template_variables (template_id, variable_name, variable_type, description, is_required) 
SELECT t.id, v.variable_name, 'string', v.description, true
FROM pev_email_templates t
CROSS JOIN LATERAL (
  VALUES 
    ('recipient_name', 'Nom du destinataire'),
    ('sender_name', 'Nom de l''expéditeur'),
    ('action_url', 'URL du bouton d''action')
) AS v(variable_name, description)
WHERE t.code = 'new_message';

-- =====================================================
-- Vérification
-- =====================================================
SELECT 'Tables email templates créées avec succès' as status;
SELECT COUNT(*) as nb_templates FROM pev_email_templates;
SELECT COUNT(*) as nb_categories FROM pev_email_categories;
