/**
 * Supabase Edge Function - Envoi d'emails
 * 2iE GreenHub
 * 
 * Configuration requise dans les secrets Supabase:
 * - SMTP_HOST: Serveur SMTP (ex: mail.votredomaine.com)
 * - SMTP_PORT: Port SMTP (465 pour SSL, 587 pour TLS)
 * - SMTP_USER: Email utilisateur SMTP
 * - SMTP_PASS: Mot de passe SMTP
 * - SMTP_FROM: Email expéditeur
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, text, from } = await req.json() as EmailRequest

    // Validation
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Paramètres manquants: to, subject, html requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Configuration SMTP o2switch - 2iE GreenHub
    const smtpConfig = {
      hostname: Deno.env.get('SMTP_HOST') || '2iegreenhub.org',
      port: parseInt(Deno.env.get('SMTP_PORT') || '465'),
      username: Deno.env.get('SMTP_USER') || 'contact@2iegreenhub.org',
      password: Deno.env.get('SMTP_PASS') || '',
    }

    // Vérifier la configuration
    if (!smtpConfig.hostname || !smtpConfig.username || !smtpConfig.password) {
      console.error('Configuration SMTP incomplète')
      return new Response(
        JSON.stringify({ error: 'Configuration SMTP non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Créer le client SMTP
    const client = new SMTPClient({
      connection: {
        hostname: smtpConfig.hostname,
        port: smtpConfig.port,
        tls: true,
        auth: {
          username: smtpConfig.username,
          password: smtpConfig.password,
        },
      },
    })

    // Envoyer l'email
    const fromEmail = from || Deno.env.get('SMTP_FROM') || smtpConfig.username

    await client.send({
      from: fromEmail,
      to: to,
      subject: subject,
      content: text || '',
      html: html,
    })

    await client.close()

    console.log(`Email envoyé avec succès à: ${to}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Email envoyé avec succès' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur envoi email:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur lors de l\'envoi de l\'email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
