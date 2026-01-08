-- ============================================================
-- MIGRATION: Templates email pour les signalements
-- Date: 2026-01-08
-- Description: Ajoute les templates email pour le workflow signalements
-- ============================================================

-- Template 1: Notification à l'auteur que son contenu est signalé
INSERT INTO pev_email_templates (category_id, code, name, description, subject, html_content, text_content, variables, is_system) 
SELECT 
  (SELECT id FROM pev_email_categories WHERE slug = 'notifications' LIMIT 1),
  'content_reported',
  'Contenu signalé',
  'Email envoyé à l''auteur quand son contenu est signalé',
  '⚠️ Votre contenu a été signalé - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: Segoe UI, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">⚠️ Contenu Signalé</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px;">Nous vous informons que votre contenu a été signalé par un membre de la communauté :</p>
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
          <h3 style="color: #e65100; margin: 0 0 10px 0;">{{content_type}}</h3>
          <p style="color: #333; margin: 0; font-weight: bold;">{{content_title}}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; margin: 0;"><strong>Raison du signalement :</strong></p>
          <p style="color: #333; margin: 10px 0 0 0;">{{report_reason}}</p>
        </div>
        <p style="color: #333; font-size: 16px;">Notre équipe de modération examine actuellement ce signalement et vous informera des suites données.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{platform_url}}" style="background-color: #1976d2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Accéder à la plateforme</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Nous vous informons que votre contenu "{{content_title}}" ({{content_type}}) a été signalé.

Raison du signalement : {{report_reason}}

Notre équipe de modération examine actuellement ce signalement.

Accéder à la plateforme : {{platform_url}}

---
2iE GreenHub',
  '["recipient_name", "content_title", "content_type", "report_reason", "platform_url"]',
  true
WHERE NOT EXISTS (SELECT 1 FROM pev_email_templates WHERE code = 'content_reported');

-- Template 2: Notification à l'auteur de l'action prise
INSERT INTO pev_email_templates (category_id, code, name, description, subject, html_content, text_content, variables, is_system) 
SELECT 
  (SELECT id FROM pev_email_categories WHERE slug = 'notifications' LIMIT 1),
  'report_action_taken',
  'Action prise suite au signalement',
  'Email envoyé à l''auteur quand une action est prise sur son contenu signalé',
  '📋 Action prise sur votre contenu - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: Segoe UI, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #546e7a 0%, #78909c 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📋 Décision de modération</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px;">Suite au signalement de votre contenu, notre équipe de modération a pris la décision suivante :</p>
        <div style="background-color: #eceff1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #546e7a;">
          <p style="color: #333; margin: 0 0 10px 0;"><strong>Contenu concerné :</strong> {{content_title}} ({{content_type}})</p>
          <p style="color: #d32f2f; margin: 0; font-weight: bold; font-size: 18px;">Action : {{action_taken}}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; margin: 0;"><strong>Note de l''administrateur :</strong></p>
          <p style="color: #333; margin: 10px 0 0 0;">{{admin_notes}}</p>
        </div>
        <p style="color: #333; font-size: 16px;">Si vous avez des questions concernant cette décision, vous pouvez nous contacter via la plateforme.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{platform_url}}" style="background-color: #1976d2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Accéder à la plateforme</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Suite au signalement de votre contenu "{{content_title}}" ({{content_type}}), notre équipe de modération a pris la décision suivante :

Action : {{action_taken}}

Note de l''administrateur : {{admin_notes}}

Si vous avez des questions, contactez-nous via la plateforme : {{platform_url}}

---
2iE GreenHub',
  '["recipient_name", "content_title", "content_type", "action_taken", "admin_notes", "platform_url"]',
  true
WHERE NOT EXISTS (SELECT 1 FROM pev_email_templates WHERE code = 'report_action_taken');

-- Template 3: Notification au signaleur que son signalement a été traité
INSERT INTO pev_email_templates (category_id, code, name, description, subject, html_content, text_content, variables, is_system) 
SELECT 
  (SELECT id FROM pev_email_categories WHERE slug = 'notifications' LIMIT 1),
  'report_resolved',
  'Signalement traité',
  'Email envoyé au signaleur quand son signalement est traité',
  '✅ Votre signalement a été traité - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: Segoe UI, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Signalement Traité</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px;">Nous vous remercions d''avoir contribué à maintenir une communauté saine et respectueuse.</p>
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <p style="color: #333; margin: 0 0 10px 0;"><strong>Type de contenu signalé :</strong> {{content_type}}</p>
          <p style="color: #2e7d32; margin: 0; font-weight: bold;">Statut : {{resolution_status}}</p>
        </div>
        <p style="color: #333; font-size: 16px;">Votre signalement a été examiné par notre équipe de modération et les mesures appropriées ont été prises.</p>
        <p style="color: #333; font-size: 16px;">Merci de contribuer à rendre 2iE GreenHub un espace sûr et constructif pour tous.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{platform_url}}" style="background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Retour à la plateforme</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Bonjour {{recipient_name}},

Nous vous remercions d''avoir contribué à maintenir une communauté saine.

Type de contenu signalé : {{content_type}}
Statut : {{resolution_status}}

Votre signalement a été examiné et les mesures appropriées ont été prises.

Retour à la plateforme : {{platform_url}}

---
2iE GreenHub',
  '["recipient_name", "content_type", "resolution_status", "platform_url"]',
  true
WHERE NOT EXISTS (SELECT 1 FROM pev_email_templates WHERE code = 'report_resolved');

-- ============================================================
-- Vérification
-- ============================================================
SELECT code, name FROM pev_email_templates WHERE code IN ('content_reported', 'report_action_taken', 'report_resolved');
