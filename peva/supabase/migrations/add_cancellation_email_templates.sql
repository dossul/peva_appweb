-- ============================================
-- Migration: Templates email pour annulation/suppression
-- Date: 2026-01-08
-- Description: Emails envoyés lors de suppression d'événements ou opportunités
-- ============================================

-- Template: Événement annulé/supprimé
INSERT INTO pev_email_templates (
  category_id, 
  code, 
  name, 
  description, 
  subject, 
  html_content, 
  text_content, 
  variables, 
  is_active, 
  is_system
) VALUES (
  (SELECT id FROM pev_email_categories WHERE slug = 'events' LIMIT 1),
  'event_cancelled',
  'Événement annulé',
  'Email envoyé aux participants lorsqu''un événement est annulé ou supprimé',
  'Événement annulé : {{event_title}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Événement Annulé</h1>
    </div>
    <div class="content">
      <h2>Bonjour {{recipient_name}},</h2>
      <p>Nous vous informons que l''événement suivant a été <strong>annulé</strong> :</p>
      <div class="alert">
        <strong>{{event_title}}</strong><br>
        📅 Date prévue : {{event_date}}
      </div>
      <p><strong>Raison :</strong> {{cancellation_reason}}</p>
      <p>Nous vous prions de nous excuser pour ce désagrément.</p>
      <p>N''hésitez pas à consulter d''autres événements disponibles sur notre plateforme.</p>
    </div>
    <div class="footer">
      <p>Cordialement,<br>L''équipe 2iE GreenHub</p>
    </div>
  </div>
</body>
</html>',
  'Bonjour {{recipient_name}},

Nous vous informons que l''événement "{{event_title}}" prévu le {{event_date}} a été annulé.

Raison : {{cancellation_reason}}

Nous vous prions de nous excuser pour ce désagrément.

Cordialement,
L''équipe 2iE GreenHub',
  '["recipient_name", "event_title", "event_date", "cancellation_reason"]',
  true,
  true
)
ON CONFLICT (code) DO UPDATE SET 
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  text_content = EXCLUDED.text_content,
  variables = EXCLUDED.variables,
  updated_at = NOW();

-- Template: Opportunité retirée/supprimée
INSERT INTO pev_email_templates (
  category_id, 
  code, 
  name, 
  description, 
  subject, 
  html_content, 
  text_content, 
  variables, 
  is_active, 
  is_system
) VALUES (
  (SELECT id FROM pev_email_categories WHERE slug = 'opportunities' LIMIT 1),
  'opportunity_cancelled',
  'Opportunité retirée',
  'Email envoyé aux candidats lorsqu''une opportunité est supprimée',
  'Opportunité retirée : {{opportunity_title}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #fd7e14; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
    .btn { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Opportunité Retirée</h1>
    </div>
    <div class="content">
      <h2>Bonjour {{recipient_name}},</h2>
      <p>Nous vous informons que l''opportunité pour laquelle vous aviez candidaté n''est plus disponible :</p>
      <div class="alert">
        <strong>{{opportunity_title}}</strong>
      </div>
      <p><strong>Raison :</strong> {{cancellation_reason}}</p>
      <p>Nous vous invitons à consulter d''autres opportunités disponibles sur notre plateforme.</p>
      <a href="{{platform_url}}/opportunities" class="btn">Voir les opportunités</a>
    </div>
    <div class="footer">
      <p>Cordialement,<br>L''équipe 2iE GreenHub</p>
    </div>
  </div>
</body>
</html>',
  'Bonjour {{recipient_name}},

Nous vous informons que l''opportunité "{{opportunity_title}}" pour laquelle vous aviez candidaté n''est plus disponible.

Raison : {{cancellation_reason}}

Nous vous invitons à consulter d''autres opportunités sur notre plateforme.

Cordialement,
L''équipe 2iE GreenHub',
  '["recipient_name", "opportunity_title", "cancellation_reason", "platform_url"]',
  true,
  true
)
ON CONFLICT (code) DO UPDATE SET 
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  text_content = EXCLUDED.text_content,
  variables = EXCLUDED.variables,
  updated_at = NOW();

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT 'Templates email annulation créés: event_cancelled, opportunity_cancelled' as message;
SELECT code, name FROM pev_email_templates WHERE code IN ('event_cancelled', 'opportunity_cancelled');
