# 📧 Système d'Emails - PEVA / 2iE GreenHub

Documentation complète sur l'envoi d'emails dans le projet.

---

## 🎯 Vue d'Ensemble

**Actuellement**, le projet utilise **exclusivement Supabase Auth** pour l'envoi d'emails.

**Aucun service email externe** (Sendgrid, Mailgun, Nodemailer, etc.) n'est configuré.

---

## 📨 Types d'Emails Envoyés

### 1. **Inscription / Confirmation Email**

**Déclencheur**: Inscription d'un nouvel utilisateur

**Code**: `peva/src/stores/auth.js` (méthode `signUp`)

```javascript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/email-confirmation`,
    data: {
      first_name: firstName,
      last_name: lastName,
      user_type: userType
    }
  }
})
```

**Email envoyé par**: Supabase Auth (automatique)

**Template**: Template par défaut Supabase

**Lien dans l'email**: Redirige vers `/auth/email-confirmation`

---

### 2. **Réinitialisation Mot de Passe**

**Déclencheur**: Utilisateur clique "Mot de passe oublié"

**Code**: `peva/src/stores/auth.js` (ligne 186)

```javascript
const resetPassword = async (email) => {
  loading.value = true
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password/confirm`
    })
    
    if (error) throw error
  } catch (error) {
    console.error('Erreur réinitialisation:', error)
    throw error
  } finally {
    loading.value = false
  }
}
```

**Email envoyé par**: Supabase Auth (automatique)

**Template**: Template par défaut Supabase

**Lien dans l'email**: Redirige vers `/auth/reset-password/confirm`

---

### 3. **Changement d'Email**

**Déclencheur**: Utilisateur modifie son email dans son profil

**Code**: Via `supabase.auth.updateUser()`

**Email envoyé par**: Supabase Auth (automatique)

**Validation**: Supabase envoie un email à la nouvelle adresse

---

### 4. **Invitation Utilisateur** (Admin)

**Déclencheur**: Admin invite un utilisateur

**Code**: `supabase.auth.admin.inviteUserByEmail()`

**Email envoyé par**: Supabase Auth (automatique)

**Template**: Template invitation Supabase

---

## ⚙️ Configuration Actuelle

### Variables d'Environnement

Fichier: `peva/.env`

```env
VITE_SUPABASE_URL=https://supabase.benga.live
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
VITE_EMAIL_CONFIRMATION_EXPIRY_HOURS=1
```

### Fournisseur d'Email

**Supabase** gère les emails via son service Auth intégré.

Le fournisseur SMTP par défaut de Supabase est utilisé (probablement AWS SES ou similaire).

---

## 📂 Fichiers Concernés

### 1. Store Auth
**Fichier**: `peva/src/stores/auth.js`

**Méthodes email**:
- `signUp()` - Inscription (+ email confirmation)
- `resetPassword(email)` - Réinitialisation mot de passe
- `resendConfirmation()` - Renvoyer email confirmation

### 2. Vues Auth
**Fichiers**:
- `peva/src/views/auth/RegisterView.vue` - Formulaire inscription
- `peva/src/views/auth/ResetPasswordView.vue` - Demande reset password
- `peva/src/views/auth/ResetPasswordConfirmView.vue` - Nouveau mot de passe
- `peva/src/views/auth/EmailConfirmationView.vue` - Page après email confirmation
- `peva/src/views/auth/EmailVerificationView.vue` - Vérification email

### 3. Routes
**Fichier**: `peva/src/router/index.js`

**Routes email**:
```javascript
{
  path: '/auth/reset-password',
  name: 'ResetPassword',
  component: ResetPasswordView
},
{
  path: '/auth/reset-password/confirm',
  name: 'ResetPasswordConfirm',
  component: ResetPasswordConfirmView
},
{
  path: '/auth/email-confirmation',
  name: 'EmailConfirmation',
  component: EmailConfirmationView
}
```

---

## 🔧 Personnalisation des Emails Supabase

### Option 1: Via Dashboard Supabase

1. Se connecter au dashboard Supabase
2. **Authentication** → **Email Templates**
3. Personnaliser les templates:
   - Confirmation d'email
   - Réinitialisation mot de passe
   - Invitation utilisateur
   - Changement d'email

### Option 2: Via Supabase CLI

```bash
# Télécharger les templates actuels
supabase db pull

# Modifier les templates dans:
# supabase/templates/email/

# Appliquer les changements
supabase db push
```

---

## 🚀 Migration vers Service Email Personnalisé

### Pourquoi Migrer?

- ✅ **Personnalisation complète** des templates
- ✅ **Analytics** avancées (taux ouverture, clics)
- ✅ **Branding** complet (logo, couleurs, footer)
- ✅ **Types d'emails additionnels** (newsletters, notifications)
- ✅ **Contrôle SMTP** (domaine personnalisé)

### Services Recommandés

1. **Resend** (recommandé)
   - API simple
   - Templates React
   - Gratuit jusqu'à 3000 emails/mois

2. **SendGrid**
   - Robuste et scalable
   - 100 emails/jour gratuit

3. **Mailgun**
   - Bon pour production
   - 5000 emails/mois gratuit (3 mois)

4. **AWS SES**
   - Le moins cher
   - Complexe à configurer

---

## 📝 Implémentation Service Email Personnalisé

### Étape 1: Installer Dépendances

```bash
npm install resend
# ou
npm install @sendgrid/mail
```

### Étape 2: Créer Service Email

**Fichier**: `peva/src/services/emailService.js`

```javascript
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

class EmailService {
  async sendPasswordResetEmail(email, resetLink) {
    return await resend.emails.send({
      from: '2iE GreenHub <noreply@2ie-greenhub.org>',
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: this.getPasswordResetTemplate(resetLink)
    })
  }
  
  async sendWelcomeEmail(email, firstName) {
    return await resend.emails.send({
      from: '2iE GreenHub <welcome@2ie-greenhub.org>',
      to: email,
      subject: 'Bienvenue sur 2iE GreenHub',
      html: this.getWelcomeTemplate(firstName)
    })
  }
  
  getPasswordResetTemplate(resetLink) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .button { 
              background: #2E7D32; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <h1>Réinitialisation de votre mot de passe</h1>
          <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe:</p>
          <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
          <p>Ce lien expirera dans 1 heure.</p>
        </body>
      </html>
    `
  }
  
  getWelcomeTemplate(firstName) {
    // ... template bienvenue
  }
}

export default new EmailService()
```

### Étape 3: Modifier le Store Auth

```javascript
// Dans auth.js
import emailService from '@/services/emailService'

const resetPassword = async (email) => {
  loading.value = true
  try {
    // Générer token reset
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password/confirm`
    })
    
    // Envoyer email personnalisé (optionnel si Supabase géré)
    // await emailService.sendPasswordResetEmail(email, resetLink)
    
    if (error) throw error
  } catch (error) {
    // ...
  }
}
```

---

## 📊 Emails Futurs à Implémenter

### Notifications Métier

- ✉️ **Nouvelle demande de connexion** reçue
- ✉️ **Candidature opportunité** reçue/acceptée
- ✉️ **Invitation événement**
- ✉️ **Message privé** reçu
- ✉️ **Nouveau post** dans un groupe suivi

### Emails Marketing

- 📰 **Newsletter** hebdomadaire
- 🎉 **Nouveautés plateforme**
- 📈 **Statistiques mensuelles** (pour entreprises)

### Emails Administratifs

- 🔔 **Modération** de contenu
- 📊 **Rapports** automatiques
- ⚠️ **Alertes système**

---

## 🔒 Sécurité & Conformité

### RGPD & Vie Privée

- ✅ Opt-out facile (lien désabonnement)
- ✅ Consentement explicite pour newsletters
- ✅ Données personnelles chiffrées
- ✅ Logs de tous les emails envoyés

### Anti-Spam

- ✅ SPF, DKIM, DMARC configurés
- ✅ Rate limiting (max emails/jour)
- ✅ Double opt-in pour newsletters
- ✅ Validation email avant envoi

---

## 🧪 Tests Email

### En Développement

Utiliser **Mailhog** ou **MailCatcher**:

```bash
# Docker avec Mailhog
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Interface web: http://localhost:8025
```

### Tests Automatisés

```javascript
// test-email.spec.js
test('doit envoyer email réinitialisation', async () => {
  const mockEmail = 'test@example.com'
  await emailService.sendPasswordResetEmail(mockEmail, 'http://...')
  
  // Vérifier dans Mailhog ou mock
  expect(emailSent).toBe(true)
})
```

---

## 📈 Monitoring & Analytics

### Métriques à Suivre

- 📊 **Taux d'ouverture** (open rate)
- 📊 **Taux de clic** (click rate)
- 📊 **Taux de bounce** (emails non délivrés)
- 📊 **Désabonnements**

### Outils

- **Resend Analytics** (intégré)
- **SendGrid Statistics**
- **Custom Dashboard** avec logs

---

## 💡 Bonnes Pratiques

### 1. Templates HTML Responsive

Utiliser des frameworks:
- **MJML** (recommandé)
- **React Email**
- **Foundation for Emails**

### 2. Prévisualisation Emails

Tester sur:
- Gmail
- Outlook
- Apple Mail
- Yahoo Mail
- Mobile (iOS/Android)

### 3. Fallback Text

Toujours fournir version texte brut:

```javascript
{
  html: '...',
  text: 'Version texte sans HTML'
}
```

### 4. Liens Sécurisés

- HTTPS uniquement
- Tokens expirables
- Liens à usage unique

---

## 🚨 Dépannage

### Email Non Reçu

1. **Vérifier spam/courrier indésirable**
2. **Vérifier logs Supabase**: Dashboard → Logs
3. **Tester avec autre email**: Gmail, Outlook, etc.
4. **Vérifier configuration SMTP**

### Email Mal Formaté

1. **Tester template**: [HTML Email Check](https://www.htmlemailcheck.com/)
2. **Valider HTML**: W3C Validator
3. **Tester responsive**: [Litmus](https://litmus.com/) ou Email on Acid

### Rate Limiting

Supabase a des limites d'envoi:
- **Gratuit**: 3 emails/heure par utilisateur
- **Pro**: Limites plus élevées

Solution: Migrer vers service externe (Resend, SendGrid).

---

## 📞 Support

**Documentation Supabase Auth**:
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

**Services Email**:
- [Resend Docs](https://resend.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com/)

---

## 📅 Roadmap Email

### Phase 1 (Actuel) ✅
- Supabase Auth emails de base

### Phase 2 (Court terme)
- [ ] Personnaliser templates Supabase
- [ ] Ajouter logo et branding
- [ ] Configurer domaine custom (@2ie-greenhub.org)

### Phase 3 (Moyen terme)
- [ ] Migrer vers Resend
- [ ] Implémenter notifications métier
- [ ] Analytics avancées

### Phase 4 (Long terme)
- [ ] Newsletter automatisée
- [ ] Emails marketing segmentés
- [ ] A/B testing templates

---

**Date de création**: 2026-01-01  
**Dernière mise à jour**: 2026-01-01  
**Version**: 1.0.0
