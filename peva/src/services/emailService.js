/**
 * Service d'envoi d'emails - 2iE GreenHub
 * 
 * ARCHITECTURE:
 * - API Email: https://apiemail2iegreenhub.vercel.app/api/send-email
 * - Templates: Stockés dans pev_email_templates (Supabase)
 * - Admin: /admin/email-templates pour éditer les templates
 * 
 * CONFIGURATION (.env):
 * VITE_EMAIL_API_URL=https://apiemail2iegreenhub.vercel.app/api/send-email
 */

import { supabase } from '@/lib/supabase'

class EmailService {
  constructor() {
    // Configuration API Email Vercel
    this.config = {
      apiUrl: import.meta.env.VITE_EMAIL_API_URL || 'https://apiemail2iegreenhub.vercel.app/api/send-email',
      fromEmail: import.meta.env.VITE_EMAIL_FROM || 'contact@2iegreenhub.org',
      fromName: '2iE GreenHub'
    }
    
    // Cache des templates
    this.templatesCache = new Map()
    this.cacheExpiry = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Récupérer un template depuis la BDD (avec cache)
   */
  async getTemplate(code) {
    // Vérifier le cache
    const cached = this.templatesCache.get(code)
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.template
    }

    try {
      const { data, error } = await supabase
        .from('pev_email_templates')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        console.warn(`Template "${code}" non trouvé, utilisation du fallback`)
        return null
      }

      // Mettre en cache
      this.templatesCache.set(code, { template: data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error('Erreur getTemplate:', error)
      return null
    }
  }

  /**
   * Remplacer les variables {{variable}} dans un texte
   */
  renderVariables(text, variables = {}) {
    if (!text) return ''
    let result = text
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, variables[key] || '')
    })
    // Nettoyer les variables non remplacées
    return result.replace(/{{[^}]+}}/g, '')
  }

  /**
   * Envoyer un email via API backend Node.js
   */
  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to,
          subject,
          html: htmlContent,
          text: textContent || this.stripHtml(htmlContent),
          from: `${this.config.fromName} <${this.config.fromEmail}>`
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Email envoyé avec succès à:', to)
        return { success: true, data }
      } else {
        throw new Error(data.error || 'Erreur inconnue')
      }
    } catch (error) {
      // Erreur silencieuse - les emails sont non-bloquants
      console.warn('⚠️ Email non envoyé (service indisponible)')
      return { success: false, error: error.message }
    }
  }

  /**
   * Envoyer un email basé sur un template BDD
   */
  async sendTemplateEmail(templateCode, recipientEmail, variables = {}) {
    try {
      const template = await this.getTemplate(templateCode)
      
      if (template) {
        // Utiliser le template de la BDD
        const subject = this.renderVariables(template.subject, variables)
        const htmlContent = this.renderVariables(template.html_content, variables)
        const textContent = this.renderVariables(template.text_content, variables)
        
        return this.sendEmail(recipientEmail, subject, htmlContent, textContent)
      }
      
      // Fallback: utiliser la méthode hardcodée correspondante
      console.warn(`Fallback pour template "${templateCode}"`)
      return { success: false, error: `Template "${templateCode}" non trouvé` }
    } catch (error) {
      console.error('Erreur sendTemplateEmail:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Notification de nouveau message
   */
  async sendNewMessageNotification(recipientEmail, recipientName, senderName, messagePreview, conversationUrl) {
    // Essayer d'abord le template BDD
    const result = await this.sendTemplateEmail('new_message', recipientEmail, {
      recipient_name: recipientName,
      sender_name: senderName,
      message_preview: messagePreview,
      action_url: conversationUrl
    })
    
    if (result.success) return result
    
    // Fallback: template hardcodé
    const subject = `💬 Nouveau message de ${senderName} - 2iE GreenHub`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau message</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                💬 Nouveau Message
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Bonjour <strong>${recipientName}</strong>,
              </p>
              
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Vous avez reçu un nouveau message de <strong>${senderName}</strong> sur 2iE GreenHub.
              </p>
              
              <!-- Message Preview Box -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #1976d2; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #666; font-size: 14px; margin: 0; font-style: italic;">
                  "${messagePreview}"
                </p>
              </div>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 30px 0;">
                    <a href="${conversationUrl}" 
                       style="display: inline-block; background-color: #1976d2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">
                      Voir le message
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Si vous ne souhaitez plus recevoir ces notifications, vous pouvez les désactiver dans vos 
                <a href="${conversationUrl.replace('/messages', '/settings/notifications')}" style="color: #1976d2;">paramètres de notification</a>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                © 2024 2iE GreenHub - Plateforme de l'Économie Verte Africaine
              </p>
              <p style="color: #999; font-size: 11px; margin-top: 10px;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    return this.sendEmail(recipientEmail, subject, htmlContent)
  }

  /**
   * Notification de demande de connexion
   */
  async sendConnectionRequestNotification(recipientEmail, recipientName, senderName, senderOrganization, profileUrl) {
    const subject = `🤝 ${senderName} souhaite se connecter avec vous - 2iE GreenHub`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                🤝 Nouvelle Demande de Connexion
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Bonjour <strong>${recipientName}</strong>,
              </p>
              
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                <strong>${senderName}</strong>${senderOrganization ? ` de <em>${senderOrganization}</em>` : ''} souhaite se connecter avec vous sur 2iE GreenHub.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 30px 0;">
                    <a href="${profileUrl}" 
                       style="display: inline-block; background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">
                      Voir le profil
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                © 2024 2iE GreenHub - Plateforme de l'Économie Verte Africaine
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    return this.sendEmail(recipientEmail, subject, htmlContent)
  }

  /**
   * Notification d'événement à venir
   */
  async sendEventReminderNotification(recipientEmail, recipientName, eventTitle, eventDate, eventLocation, eventUrl) {
    const subject = `📅 Rappel: ${eventTitle} - 2iE GreenHub`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                📅 Rappel d'Événement
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Bonjour <strong>${recipientName}</strong>,
              </p>
              
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Nous vous rappelons que vous êtes inscrit(e) à l'événement suivant :
              </p>
              
              <div style="background-color: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #7b1fa2; margin: 0 0 10px 0; font-size: 20px;">${eventTitle}</h2>
                <p style="color: #666; margin: 5px 0;"><strong>📆 Date:</strong> ${eventDate}</p>
                <p style="color: #666; margin: 5px 0;"><strong>📍 Lieu:</strong> ${eventLocation}</p>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 30px 0;">
                    <a href="${eventUrl}" 
                       style="display: inline-block; background-color: #7b1fa2; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">
                      Voir les détails
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                © 2024 2iE GreenHub - Plateforme de l'Économie Verte Africaine
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    return this.sendEmail(recipientEmail, subject, htmlContent)
  }

  /**
   * Email de bienvenue après inscription
   */
  async sendWelcomeEmail(recipientEmail, recipientName, confirmationUrl) {
    const subject = `🌱 Bienvenue sur 2iE GreenHub !`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                🌱 Bienvenue sur 2iE GreenHub
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Bonjour <strong>${recipientName}</strong>,
              </p>
              
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Merci de vous être inscrit(e) sur 2iE GreenHub, la plateforme de l'économie verte en Afrique !
              </p>
              
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Pour finaliser votre inscription et accéder à toutes les fonctionnalités, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 30px 0;">
                    <a href="${confirmationUrl}" 
                       style="display: inline-block; background-color: #2e7d32; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">
                      Confirmer mon email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Si vous n'avez pas créé de compte sur 2iE GreenHub, vous pouvez ignorer cet email.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                © 2024 2iE GreenHub - Plateforme de l'Économie Verte Africaine
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    return this.sendEmail(recipientEmail, subject, htmlContent)
  }

  /**
   * Enlever les balises HTML
   */
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }
}

// Instance singleton
export const emailService = new EmailService()
export default emailService
