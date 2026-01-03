# 📧 Audit Complet - Système d'Emails 2iE GreenHub

## Date: Janvier 2026

---

## 🏗️ Architecture Email

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vue.js)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  emailService.js                                                │
│       │                                                         │
│       ├── sendTemplateEmail(code, email, variables)             │
│       │       │                                                 │
│       │       ▼                                                 │
│       │   pev_email_templates (Supabase)                        │
│       │       │                                                 │
│       │       ▼                                                 │
│       └── API Vercel ────────────────────────────────────────►  │
│                                                                 │
│  connectionService.js ──► emailService (demande connexion)      │
│  messagesService.js ────► emailService (nouveau message)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              API EMAIL VERCEL (Node.js + Nodemailer)            │
├─────────────────────────────────────────────────────────────────┤
│  URL: https://apiemail2iegreenhub.vercel.app/api/send-email     │
│  GitHub: dossul/api_email_2iegreenhub (privé)                   │
│  SMTP: contact@2iegreenhub.org via o2switch (port 465)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Templates Disponibles (10 total)

| Code | Catégorie | Description | Intégré |
|------|-----------|-------------|---------|
| `new_message` | Messages | Notification nouveau message | ✅ MessagesView.vue |
| `connection_request` | Connexions | Demande de connexion | ✅ connectionService.js |
| `connection_accepted` | Connexions | Connexion acceptée | ✅ connectionService.js |
| `event_reminder` | Événements | Rappel d'événement | ✅ notificationService.js |
| `event_registration` | Événements | Confirmation inscription | ✅ EventsView.vue |
| `welcome` | Authentification | Email de bienvenue | 🔄 Supabase Auth |
| `password_reset` | Authentification | Réinitialisation mot de passe | 🔄 Supabase Auth |
| `new_opportunity` | Opportunités | Nouvelle opportunité | ✅ notificationService.js |
| `application_received` | Opportunités | Candidature reçue | ✅ OpportunitiesView.vue |
| `application_sent` | Opportunités | Confirmation candidature | ✅ OpportunitiesView.vue |

---

## 📂 Fichiers du Système Email

### Services
| Fichier | Rôle |
|---------|------|
| `src/services/emailService.js` | Service principal d'envoi d'emails |
| `src/services/admin/emailTemplatesService.js` | CRUD templates admin |
| `src/services/connectionService.js` | Intégré - envoie emails connexion |
| `src/services/messagesService.js` | Via MessagesView - envoie emails messages |

### Vues Admin
| Fichier | Rôle |
|---------|------|
| `src/views/admin/AdminEmailTemplatesView.vue` | Gestion des templates |

### Base de données
| Table | Rôle |
|-------|------|
| `pev_email_categories` | Catégories de templates (6) |
| `pev_email_templates` | Templates d'emails (10) |
| `pev_email_template_variables` | Variables des templates |

### API Vercel
| Fichier | Rôle |
|---------|------|
| `api/email-api/api/send-email.js` | Fonction serverless |
| `api/email-api/server.js` | Serveur local de test |
| `api/email-api/vercel.json` | Config déploiement |

---

## 🔍 Workflows et Envoi d'Emails

### ✅ Implémentés

#### 1. Nouveau Message (MessagesView.vue)
```javascript
// Ligne 532-537
await emailService.sendNewMessageNotification(
  recipient.email,
  recipientName,
  senderName,
  preview,
  conversationUrl
)
```

#### 2. Demande de Connexion (connectionService.js)
```javascript
// Ligne 73-81
await emailService.sendConnectionRequestNotification(
  addresseeProfile.email,
  recipientName,
  senderName,
  organization,
  actionUrl
)
```

#### 3. Connexion Acceptée (connectionService.js)
```javascript
// Ligne 144-150
await emailService.sendTemplateEmail('connection_accepted', email, {
  recipient_name,
  accepter_name,
  action_url
})
```

### 🔄 Gérés par Supabase Auth

| Workflow | Méthode | Notes |
|----------|---------|-------|
| Inscription | `supabase.auth.signUp()` | Email confirmation Supabase |
| Réinitialisation MDP | `supabase.auth.resetPasswordForEmail()` | Email Supabase |
| Vérification email | `supabase.auth.resend()` | Email Supabase |

### ✅ Tous les workflows intégrés !

| Workflow | Fichier | Template utilisé |
|----------|---------|------------------|
| Inscription événement | EventsView.vue:533 | `event_registration` |
| Rappel événement | notificationService.js:540 | `event_reminder` |
| Candidature opportunité | OpportunitiesView.vue:704-730 | `application_sent` + `application_received` |
| Nouvelle opportunité | notificationService.js:575 | `new_opportunity` |

---

## 🛠️ Configuration

### Variables d'environnement Frontend (.env)
```env
VITE_EMAIL_API_URL=https://apiemail2iegreenhub.vercel.app/api/send-email
```

### Variables d'environnement Vercel
```
SMTP_HOST=2iegreenhub.org
SMTP_PORT=465
SMTP_USER=contact@2iegreenhub.org
SMTP_PASS=********
```

---

## 📊 Statistiques

- **Templates créés**: 10
- **Catégories**: 6
- **Workflows intégrés**: 10/10 ✅
- **API Email**: Fonctionnelle ✅
- **Admin Templates**: Disponible à `/admin/email-templates`

---

## 🚀 Statut Final

✅ **TOUS LES WORKFLOWS INTÉGRÉS** - Janvier 2026

### Intégrations réalisées:
1. ✅ **MessagesView.vue** - Envoi email nouveau message
2. ✅ **connectionService.js** - Envoi email demande/acceptation connexion
3. ✅ **EventsView.vue** - Envoi email confirmation inscription événement
4. ✅ **OpportunitiesView.vue** - Envoi email candidature (candidat + créateur)
5. ✅ **notificationService.js** - Envoi email rappel événement + nouvelle opportunité

### Prochaines améliorations possibles:
- Créer Edge Function CRON pour rappels automatiques
- Ajouter préférences email par utilisateur
- Tracking ouvertures/clics emails

---

## 📝 Notes Techniques

### Fallback Templates
Le `emailService.js` utilise un système de fallback:
1. Cherche le template dans `pev_email_templates` (BDD)
2. Si non trouvé, utilise le template hardcodé dans le code
3. Cache des templates (5 minutes) pour performance

### Gestion des erreurs
Les erreurs d'envoi d'email sont loguées mais ne bloquent pas les workflows principaux (try/catch avec warn).

### Test API
```bash
curl -X POST https://apiemail2iegreenhub.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
```
