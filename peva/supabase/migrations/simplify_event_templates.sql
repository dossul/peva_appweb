-- Simplifier les templates email events pour éviter timeout Vercel
-- Date: 2026-01-06

-- Template event_approved simplifié
UPDATE pev_email_templates 
SET html_content = '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
    <div style="background: #7b1fa2; padding: 20px; text-align: center;">
      <h1 style="color: #fff; margin: 0;">✅ Événement Approuvé</h1>
    </div>
    <div style="padding: 30px;">
      <p>Bonjour <strong>{{recipient_name}}</strong>,</p>
      <p>Votre événement <strong>{{event_title}}</strong> a été approuvé !</p>
      <p>📆 Date: {{event_date}}<br>📍 Lieu: {{event_location}}</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{action_url}}" style="background: #7b1fa2; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Voir mon événement</a>
      </p>
    </div>
    <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666;">
      2iE GreenHub - Économie Verte Africaine
    </div>
  </div>
</body>
</html>',
text_content = 'Bonjour {{recipient_name}},

Votre événement "{{event_title}}" a été approuvé !

📆 Date: {{event_date}}
📍 Lieu: {{event_location}}

Voir: {{action_url}}

--
2iE GreenHub'
WHERE code = 'event_approved';

-- Template event_rejected simplifié
UPDATE pev_email_templates 
SET html_content = '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
    <div style="background: #d32f2f; padding: 20px; text-align: center;">
      <h1 style="color: #fff; margin: 0;">❌ Événement Non Approuvé</h1>
    </div>
    <div style="padding: 30px;">
      <p>Bonjour <strong>{{recipient_name}}</strong>,</p>
      <p>Votre événement <strong>{{event_title}}</strong> n''a pas été approuvé.</p>
      <p><strong>Raison:</strong> {{rejection_reason}}</p>
      <p>Vous pouvez modifier et resoumettre votre événement.</p>
    </div>
    <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666;">
      2iE GreenHub - Économie Verte Africaine
    </div>
  </div>
</body>
</html>',
text_content = 'Bonjour {{recipient_name}},

Votre événement "{{event_title}}" n''a pas été approuvé.

Raison: {{rejection_reason}}

--
2iE GreenHub'
WHERE code = 'event_rejected';

SELECT 'Templates events simplifiés !' as message;
