# 🔐 Guide d'Activation OAuth - Google & LinkedIn

**Projet:** 2iE Green HUB  
**Supabase URL:** https://supabase.benga.live  
**Type:** Instance Auto-Hébergée (Self-Hosted)

---

## 🏠 Configuration pour Instance Auto-Hébergée

Avec une instance Supabase self-hosted, la configuration OAuth se fait via les **variables d'environnement** du serveur.

### Localiser votre fichier de configuration

Selon votre installation, le fichier est généralement:
- **Docker Compose:** `docker-compose.yml` ou `.env`
- **Kubernetes:** ConfigMap ou Secret
- **Manuel:** `.env` dans le dossier Supabase

---

## 🔧 Variables d'environnement à ajouter

### Pour Google OAuth:

```env
# Google OAuth
GOTRUE_EXTERNAL_GOOGLE_ENABLED=true
GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOTRUE_EXTERNAL_GOOGLE_SECRET=votre-client-secret
GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI=https://supabase.benga.live/auth/v1/callback
```

### Pour LinkedIn OAuth (OIDC):

```env
# LinkedIn OIDC
GOTRUE_EXTERNAL_LINKEDIN_OIDC_ENABLED=true
GOTRUE_EXTERNAL_LINKEDIN_OIDC_CLIENT_ID=votre-linkedin-client-id
GOTRUE_EXTERNAL_LINKEDIN_OIDC_SECRET=votre-linkedin-client-secret
GOTRUE_EXTERNAL_LINKEDIN_OIDC_REDIRECT_URI=https://supabase.benga.live/auth/v1/callback
```

### Configuration générale Auth:

```env
# URLs de redirection autorisées
GOTRUE_URI_ALLOW_LIST=http://localhost:5173,http://localhost:5173/**,https://2iegreenhub.vercel.app,https://2iegreenhub.vercel.app/**
GOTRUE_SITE_URL=https://2iegreenhub.vercel.app
```

---

## 📁 Exemple complet dans docker-compose.yml

Si vous utilisez Docker, ajoutez dans la section `auth` (gotrue):

```yaml
services:
  auth:
    image: supabase/gotrue:latest
    environment:
      # ... autres variables existantes ...
      
      # Google OAuth
      GOTRUE_EXTERNAL_GOOGLE_ENABLED: "true"
      GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID: "xxxxx.apps.googleusercontent.com"
      GOTRUE_EXTERNAL_GOOGLE_SECRET: "GOCSPX-xxxxx"
      GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI: "https://supabase.benga.live/auth/v1/callback"
      
      # LinkedIn OIDC
      GOTRUE_EXTERNAL_LINKEDIN_OIDC_ENABLED: "true"
      GOTRUE_EXTERNAL_LINKEDIN_OIDC_CLIENT_ID: "xxxxx"
      GOTRUE_EXTERNAL_LINKEDIN_OIDC_SECRET: "xxxxx"
      GOTRUE_EXTERNAL_LINKEDIN_OIDC_REDIRECT_URI: "https://supabase.benga.live/auth/v1/callback"
      
      # URLs autorisées
      GOTRUE_URI_ALLOW_LIST: "http://localhost:5173,http://localhost:5173/**,https://2iegreenhub.vercel.app,https://2iegreenhub.vercel.app/**"
```

---

## 🔄 Après modification

1. **Redémarrer les services Supabase:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```
   
   Ou si vous utilisez un script:
   ```bash
   ./restart-supabase.sh
   ```

2. **Vérifier que le service auth est bien redémarré:**
   ```bash
   docker-compose logs auth
   ```

---

## ⚠️ Erreur Actuelle

```json
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

**Cause:** Les providers OAuth (Google, LinkedIn) ne sont pas activés dans la configuration Supabase.

---

## 🔧 ÉTAPE 1 : Activer Google OAuth

### 1.1 Créer les credentials Google

1. **Aller sur Google Cloud Console:**
   - URL: https://console.cloud.google.com/

2. **Créer un nouveau projet** (ou utiliser un existant)

3. **Activer l'API Google+ API:**
   - Menu → APIs & Services → Library
   - Chercher "Google+ API" → Enable

4. **Créer les OAuth Credentials:**
   - Menu → APIs & Services → Credentials
   - Cliquer "Create Credentials" → "OAuth client ID"
   - Type: **Web application**
   - Nom: `2iE GreenHub`
   
5. **Configurer les URLs autorisées:**

   **Authorized JavaScript origins:**
   ```
   https://supabase.benga.live
   http://localhost:5173
   https://2iegreenhub.vercel.app
   ```

   **Authorized redirect URIs:**
   ```
   https://supabase.benga.live/auth/v1/callback
   ```

6. **Copier les credentials:**
   - **Client ID:** `xxxxxx.apps.googleusercontent.com`
   - **Client Secret:** `GOCSPX-xxxxxx`

### 1.2 Configurer dans Supabase

1. **Accéder au dashboard Supabase:**
   - URL: https://supabase.benga.live (ou votre panel admin)
   
2. **Aller dans Authentication → Providers**

3. **Activer Google:**
   - Trouver "Google" dans la liste
   - Toggle **Enable** → ON
   - Coller **Client ID**
   - Coller **Client Secret**
   - **Save**

---

## 🔧 ÉTAPE 2 : Activer LinkedIn OAuth

### 2.1 Créer l'application LinkedIn

1. **Aller sur LinkedIn Developers:**
   - URL: https://www.linkedin.com/developers/apps

2. **Créer une nouvelle app:**
   - Cliquer "Create app"
   - **App name:** `2iE GreenHub`
   - **LinkedIn Page:** Sélectionner votre page entreprise
   - **Logo:** Uploader le logo
   - Accepter les conditions → Create app

3. **Configurer l'application:**
   - Aller dans l'onglet **Auth**
   
4. **Ajouter les redirect URLs:**
   ```
   https://supabase.benga.live/auth/v1/callback
   ```

5. **Demander les produits nécessaires:**
   - Aller dans l'onglet **Products**
   - Demander l'accès à **"Sign In with LinkedIn using OpenID Connect"**
   - ⚠️ **Important:** Utiliser OpenID Connect (OIDC), pas l'ancien OAuth2

6. **Copier les credentials:**
   - **Client ID:** Visible dans l'onglet Auth
   - **Client Secret:** Cliquer "Generate" si pas encore fait

### 2.2 Configurer dans Supabase

1. **Aller dans Authentication → Providers**

2. **Activer LinkedIn (OIDC):**
   - Trouver "LinkedIn (OIDC)" dans la liste (pas l'ancien "LinkedIn")
   - Toggle **Enable** → ON
   - Coller **Client ID**
   - Coller **Client Secret**
   - **Save**

---

## 🔧 ÉTAPE 3 : Configurer les URLs de redirection

### Dans Supabase Authentication → URL Configuration:

| Paramètre | Valeur (Développement) | Valeur (Production) |
|-----------|------------------------|---------------------|
| **Site URL** | `http://localhost:5173` | `https://2iegreenhub.vercel.app` |
| **Redirect URLs** | `http://localhost:5173/**` | `https://2iegreenhub.vercel.app/**` |

### Ajouter ces redirect URLs:
```
http://localhost:5173
http://localhost:5173/auth/callback
http://localhost:5173/**
https://2iegreenhub.vercel.app
https://2iegreenhub.vercel.app/auth/callback
https://2iegreenhub.vercel.app/**
```

---

## 📝 Vérification du Code Frontend

Le code dans `RegisterView.vue` utilise déjà les bonnes méthodes:

```javascript
// Google OAuth
const signUpWithGoogle = async () => {
  await authStore.signInWithOAuth('google')
}

// LinkedIn OAuth (OIDC)
const signUpWithLinkedIn = async () => {
  await authStore.signInWithOAuth('linkedin_oidc')  // ← Utilise 'linkedin_oidc' pas 'linkedin'
}
```

**✅ Le code est correct.** L'erreur vient uniquement de la configuration Supabase.

---

## 🧪 Test Après Configuration

1. **Redémarrer le serveur de dev:**
   ```bash
   cd c:\wamp64\www\peva_appweb\peva
   npm run dev
   ```

2. **Tester l'inscription:**
   - Aller sur http://localhost:5173/auth/register
   - Cliquer "S'inscrire avec Google"
   - Cliquer "S'inscrire avec LinkedIn"

3. **Vérifier les logs Supabase:**
   - Dashboard → Logs → Auth

---

## 🚀 Pour la Production (Client)

Le client devra:

1. **Créer ses propres apps OAuth:**
   - Google Cloud Console avec son compte
   - LinkedIn Developers avec son compte

2. **Mettre à jour les credentials dans Supabase:**
   - Remplacer Client ID et Client Secret

3. **Mettre à jour les URLs autorisées:**
   - Ajouter le domaine de production final

---

## 📋 Checklist

### Google OAuth:
- [ ] Projet créé sur Google Cloud Console
- [ ] API Google+ activée
- [ ] OAuth credentials créées
- [ ] Redirect URI configurée
- [ ] Provider activé dans Supabase

### LinkedIn OAuth:
- [ ] App créée sur LinkedIn Developers
- [ ] Produit "Sign In with LinkedIn using OpenID Connect" demandé
- [ ] Redirect URI configurée
- [ ] Provider activé dans Supabase (LinkedIn OIDC)

### Supabase:
- [ ] Site URL configurée
- [ ] Redirect URLs ajoutées
- [ ] Providers Google et LinkedIn (OIDC) activés

---

## ⚠️ Problèmes Courants

### "provider is not enabled"
→ Le provider n'est pas activé dans Supabase → Activer dans Authentication → Providers

### "redirect_uri_mismatch" (Google)
→ L'URL de callback ne correspond pas → Ajouter `https://supabase.benga.live/auth/v1/callback` dans Google Console

### "invalid_client" (LinkedIn)
→ Client ID/Secret incorrect → Vérifier dans LinkedIn Developers

### "access_denied"
→ L'utilisateur a refusé l'autorisation → Normal, pas d'action requise

---

**Document créé le 5 février 2026**
