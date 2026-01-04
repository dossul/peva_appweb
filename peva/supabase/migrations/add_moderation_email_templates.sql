-- =====================================================
-- Templates d'emails pour la modération de contenu
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Template: Opportunité approuvée par modérateur
INSERT INTO pev_email_templates (category_id, code, name, description, subject, html_content, text_content, variables, is_system) VALUES
(
  (SELECT id FROM pev_email_categories WHERE slug = 'opportunities'),
  'opportunity_approved',
  'Opportunité approuvée',
  'Email envoyé au créateur quand son opportunité est approuvée par un modérateur',
  '✅ Votre opportunité "{{opportunity_title}}" a été approuvée - 2iE GreenHub',
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
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Opportunité Approuvée !</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Excellente nouvelle ! Votre opportunité a été approuvée par notre équipe de modération et est maintenant visible sur la plateforme.</p>
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <h2 style="color: #2e7d32; margin: 0 0 10px 0; font-size: 20px;">{{opportunity_title}}</h2>
          <p style="color: #666; margin: 5px 0;"><strong>Type:</strong> {{opportunity_type}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Statut:</strong> <span style="color: #4caf50; font-weight: bold;">Publiée</span></p>
        </div>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Les membres de la plateforme peuvent désormais découvrir et postuler à votre opportunité.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir mon opportunité</a>
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

Excellente nouvelle ! Votre opportunité "{{opportunity_title}}" a été approuvée par notre équipe de modération.

Type: {{opportunity_type}}
Statut: Publiée

Les membres de la plateforme peuvent désormais découvrir et postuler à votre opportunité.

Voir mon opportunité: {{action_url}}

---
2iE GreenHub - Plateforme de l''Économie Verte Africaine',
  '["recipient_name", "opportunity_title", "opportunity_type", "action_url"]',
  true
),

-- Template: Opportunité rejetée par modérateur
(
  (SELECT id FROM pev_email_categories WHERE slug = 'opportunities'),
  'opportunity_rejected',
  'Opportunité rejetée',
  'Email envoyé au créateur quand son opportunité est rejetée avec motif',
  '❌ Votre opportunité "{{opportunity_title}}" nécessite des modifications - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #c62828 0%, #e53935 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">❌ Modifications Requises</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Malheureusement, votre opportunité n''a pas pu être approuvée en l''état actuel.</p>
        <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c62828;">
          <h2 style="color: #c62828; margin: 0 0 10px 0; font-size: 20px;">{{opportunity_title}}</h2>
          <p style="color: #666; margin: 5px 0;"><strong>Statut:</strong> <span style="color: #c62828; font-weight: bold;">Rejetée</span></p>
        </div>
        <div style="background-color: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f57c00; margin: 0 0 10px 0; font-size: 16px;">📝 Motif du rejet :</h3>
          <p style="color: #333; font-size: 14px; margin: 0; white-space: pre-line;">{{rejection_reason}}</p>
        </div>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Vous pouvez modifier votre opportunité et la soumettre à nouveau pour validation.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #ff9800; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Modifier mon opportunité</a>
            </td>
          </tr>
        </table>
        <p style="color: #666; font-size: 14px; text-align: center;">Si vous avez des questions, contactez-nous à support@2iegreenhub.org</p>
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

Malheureusement, votre opportunité "{{opportunity_title}}" n''a pas pu être approuvée en l''état actuel.

📝 Motif du rejet :
{{rejection_reason}}

Vous pouvez modifier votre opportunité et la soumettre à nouveau pour validation.

Modifier mon opportunité: {{action_url}}

Si vous avez des questions, contactez-nous à support@2iegreenhub.org

---
2iE GreenHub - Plateforme de l''Économie Verte Africaine',
  '["recipient_name", "opportunity_title", "rejection_reason", "action_url"]',
  true
),

-- Template: Événement approuvé par modérateur
(
  (SELECT id FROM pev_email_categories WHERE slug = 'events'),
  'event_approved',
  'Événement approuvé',
  'Email envoyé au créateur quand son événement est approuvé par un modérateur',
  '✅ Votre événement "{{event_title}}" a été approuvé - 2iE GreenHub',
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
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Événement Approuvé !</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Excellente nouvelle ! Votre événement a été approuvé et est maintenant visible sur la plateforme.</p>
        <div style="background-color: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7b1fa2;">
          <h2 style="color: #7b1fa2; margin: 0 0 10px 0; font-size: 20px;">{{event_title}}</h2>
          <p style="color: #666; margin: 5px 0;"><strong>📆 Date:</strong> {{event_date}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>📍 Lieu:</strong> {{event_location}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Statut:</strong> <span style="color: #4caf50; font-weight: bold;">Publié</span></p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #7b1fa2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir mon événement</a>
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

Votre événement "{{event_title}}" a été approuvé et est maintenant visible sur la plateforme.

📆 Date: {{event_date}}
📍 Lieu: {{event_location}}

Voir mon événement: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "event_title", "event_date", "event_location", "action_url"]',
  true
),

-- Template: Événement rejeté par modérateur
(
  (SELECT id FROM pev_email_categories WHERE slug = 'events'),
  'event_rejected',
  'Événement rejeté',
  'Email envoyé au créateur quand son événement est rejeté avec motif',
  '❌ Votre événement "{{event_title}}" nécessite des modifications - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #c62828 0%, #e53935 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">❌ Modifications Requises</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Votre événement n''a pas pu être approuvé en l''état actuel.</p>
        <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c62828;">
          <h2 style="color: #c62828; margin: 0 0 10px 0; font-size: 20px;">{{event_title}}</h2>
        </div>
        <div style="background-color: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f57c00; margin: 0 0 10px 0; font-size: 16px;">📝 Motif du rejet :</h3>
          <p style="color: #333; font-size: 14px; margin: 0; white-space: pre-line;">{{rejection_reason}}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #ff9800; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Modifier mon événement</a>
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

Votre événement "{{event_title}}" n''a pas pu être approuvé.

📝 Motif du rejet :
{{rejection_reason}}

Modifier mon événement: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "event_title", "rejection_reason", "action_url"]',
  true
),

-- Template: Ressource approuvée par modérateur
(
  (SELECT id FROM pev_email_categories WHERE slug = 'system'),
  'resource_approved',
  'Ressource approuvée',
  'Email envoyé au créateur quand sa ressource est approuvée',
  '✅ Votre ressource "{{resource_title}}" a été approuvée - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Ressource Approuvée !</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Votre ressource est maintenant disponible dans la bibliothèque de 2iE GreenHub.</p>
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2;">
          <h2 style="color: #1565c0; margin: 0 0 10px 0; font-size: 20px;">{{resource_title}}</h2>
          <p style="color: #666; margin: 5px 0;"><strong>Type:</strong> {{resource_type}}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #1976d2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Voir ma ressource</a>
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

Votre ressource "{{resource_title}}" a été approuvée et est disponible dans la bibliothèque.

Type: {{resource_type}}

Voir ma ressource: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "resource_title", "resource_type", "action_url"]',
  true
),

-- Template: Ressource rejetée par modérateur
(
  (SELECT id FROM pev_email_categories WHERE slug = 'system'),
  'resource_rejected',
  'Ressource rejetée',
  'Email envoyé au créateur quand sa ressource est rejetée',
  '❌ Votre ressource "{{resource_title}}" nécessite des modifications - 2iE GreenHub',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #c62828 0%, #e53935 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">❌ Modifications Requises</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bonjour <strong>{{recipient_name}}</strong>,</p>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Votre ressource n''a pas pu être approuvée.</p>
        <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c62828;">
          <h2 style="color: #c62828; margin: 0 0 10px 0; font-size: 20px;">{{resource_title}}</h2>
        </div>
        <div style="background-color: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f57c00; margin: 0 0 10px 0; font-size: 16px;">📝 Motif du rejet :</h3>
          <p style="color: #333; font-size: 14px; margin: 0; white-space: pre-line;">{{rejection_reason}}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 30px 0;">
              <a href="{{action_url}}" style="display: inline-block; background-color: #ff9800; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">Modifier ma ressource</a>
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

Votre ressource "{{resource_title}}" n''a pas pu être approuvée.

📝 Motif du rejet :
{{rejection_reason}}

Modifier ma ressource: {{action_url}}

---
2iE GreenHub',
  '["recipient_name", "resource_title", "rejection_reason", "action_url"]',
  true
);

-- Vérification
SELECT 'Templates de modération ajoutés' as status;
SELECT code, name FROM pev_email_templates WHERE code IN ('opportunity_approved', 'opportunity_rejected', 'event_approved', 'event_rejected', 'resource_approved', 'resource_rejected');
