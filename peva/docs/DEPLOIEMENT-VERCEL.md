# 🚀 Guide de Déploiement Vercel - 2iEGreenHub

## 📋 Prérequis

1. **Vercel CLI installé** :
   ```bash
   npm install -g vercel
   ```

2. **Être connecté à Vercel** :
   ```bash
   vercel login
   ```

## 🔧 Configuration du Projet

### Fichier `vercel.json` (à la racine du projet)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!assets/).*)", "destination": "/index.html" }
  ]
}
```

### Explications :
- **framework**: `vite` - Vercel détecte automatiquement Vue + Vite
- **buildCommand**: Commande de build (utilise `npm run build`)
- **outputDirectory**: Dossier de sortie après build (`dist` pour Vite)
- **rewrites**: Gère le routage SPA - redirige tout vers `index.html` SAUF les assets

## 🚀 Commandes de Déploiement

### Déploiement en Production
```bash
cd c:\wamp64\www\peva_appweb\peva
vercel --prod
```

### Déploiement de Preview (test)
```bash
vercel
```

### Voir les déploiements
```bash
vercel ls
```

## ⚠️ Erreurs Courantes et Solutions

### 1. Erreur MIME Type
```
Failed to load module script: Expected a JavaScript module but server responded with MIME type "text/html"
```

**Cause** : Mauvaise configuration des rewrites - les fichiers JS/CSS sont redirigés vers index.html

**Solution** : Utiliser cette configuration dans `vercel.json` :
```json
{
  "rewrites": [
    { "source": "/((?!assets/).*)", "destination": "/index.html" }
  ]
}
```

### 2. Erreur "builds" deprecated
```
Due to `builds` existing in your configuration file...
```

**Solution** : Ne PAS utiliser `builds`, utiliser uniquement :
- `framework`
- `buildCommand`
- `outputDirectory`
- `rewrites`

### 3. Erreur 404 sur les routes
**Cause** : Les rewrites ne sont pas configurés pour le SPA

**Solution** : Ajouter les rewrites dans `vercel.json`

## 📁 Structure Importante

```
peva/
├── vercel.json          # Configuration Vercel
├── vite.config.js       # Configuration Vite
├── package.json         # Scripts npm
├── dist/                # Dossier généré après build
└── src/                 # Code source
```

## 🔄 Workflow de Déploiement

1. **Faire les modifications** dans le code
2. **Tester localement** : `npm run dev`
3. **Déployer** : `vercel --prod`
4. **Vérifier** l'URL de production

## 📌 URLs du Projet

- **Projet Vercel** : https://vercel.com/dossulrich-gmailcoms-projects/peva
- **Production** : https://peva.vercel.app (ou URL personnalisée)

## 💡 Bonnes Pratiques

1. **Toujours tester localement** avant de déployer
2. **Utiliser `vercel`** (sans --prod) pour un preview d'abord
3. **Ne pas modifier** la configuration `vercel.json` sauf si nécessaire
4. **Vérifier les variables d'environnement** sur le dashboard Vercel

## 🔐 Variables d'Environnement

Configurer sur Vercel Dashboard → Project → Settings → Environment Variables :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ONESIGNAL_APP_ID`

---

*Documentation créée le 03/01/2026 - 2iEGreenHub*
