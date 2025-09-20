# Checklist Mise en Production – PEVA WebApp

Dernière mise à jour: 2025-09-19

## Pré-requis
- [ ] Compte Cloudflare avec projet Pages créé (nom projet: `peva-webapp` ou autre)
- [ ] Base D1 créée (production) et migrations prêtes
- [ ] Wrangler CLI installé et authentifié (`wrangler login`)
- [ ] Node.js 18+ et npm

## Configuration Cloudflare
- [ ] Renseigner l’ID réel D1 dans `wrangler.jsonc` (`d1_databases[].database_id`).
- [ ] Configurer les variables d’environnement Pages (Project > Settings > Environment Variables):
  - [ ] `JWT_SECRET` (secret fort)
  - [ ] `JWT_REFRESH_SECRET` (si utilisé)
  - [ ] Autres variables nécessaires (SMTP, endpoints externes si présents)
- [ ] Configurer les Secrets Workers/Pages (via `wrangler secret put ...`) si préférés aux vars visibles.
- [ ] Définir un domaine et environnement `production` (Pages)

## Sécurité
- [ ] Unifier l’implémentation JWT (choisir `@tsndr/cloudflare-worker-jwt`) et supprimer l’autre
- [ ] Retirer secrets hardcodés dans `src/index.tsx` et `src/lib/auth.ts` (utiliser `c.env.*`)
- [ ] Durcir CORS: limiter `origin` aux domaines prod (ex: `https://peva.domain.tld`)
- [ ] Implémenter un `rateLimiter()` effectif (clé: IP + path, TTL)
- [ ] Ajouter `Content-Security-Policy` adaptée (CDN Tailwind/FontAwesome/axios ou bundling local)
- [ ] Ajouter `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` (Pages sert en HTTPS)

## Statics / Assets
- [ ] Créer le répertoire `public/` à la racine
- [ ] Ajouter `/public/static/styles.css`
- [ ] Ajouter les scripts référencés dans `src/renderer.tsx`:
  - [ ] `/public/static/app.js`
  - [ ] `/public/static/directory.js`
  - [ ] `/public/static/directory-workflow.js`
  - [ ] `/public/static/social-share-workflow.js`
  - [ ] `/public/static/company-management-workflow.js`
  - [ ] `/public/static/dashboard-metrics-workflow.js`
  - [ ] `/public/static/messaging-workflow.js`
  - [ ] `/public/static/interactive-map-workflow.js`
  - [ ] `/public/static/forum.js`
  - [ ] `/public/static/messaging.js`
  - [ ] `/public/static/notifications.js`
- [ ] Ajouter favicons: `/public/static/favicon.svg`, `/public/static/favicon.png`, `/public/favicon.ico`

## Base de données D1
- [ ] Appliquer les migrations en production:
  - [ ] `wrangler d1 migrations apply <db_name>`
- [ ] (Optionnel) Seeder des données non sensibles (`seed.sql`) en dev uniquement
- [ ] Vérifier les index pour les recherches fréquentes

## Authentification & Mots de passe
- [ ] Remplacer le hachage maison par `bcryptjs` (ou équivalent) avec salt par utilisateur
- [ ] Vérifier la route refresh token (`/api/auth/refresh`) et la table `refresh_tokens`
- [ ] Configurer expiration tokens et rotation

## Qualité & Logs
- [ ] Supprimer logs verbeux/sensibles en production
- [ ] Ajouter `try/catch` et réponses JSON cohérentes sur toutes les routes API
- [ ] Mettre en place des métriques simples (compteurs, timings) si nécessaire

## Build & Déploiement
- [ ] `npm ci`
- [ ] `npm run build`
- [ ] `wrangler pages deploy dist --project-name <nom-projet>`
- [ ] Tester l’aperçu Pages (preview) avant bascule DNS

## Tests de Recette (post-déploiement)
- [ ] Ping `/` et parcours UI principal (Home → Auth → Dashboard)
- [ ] Authentification JWT et pages protégées (`/dashboard`, `/admin`, `/messages`)
- [ ] API clés: `/api/companies`, `/api/opportunities`, `/api/messages`, `/api/notifications`
- [ ] Vérifier téléchargement d’assets `/static/*`
- [ ] Vérifier CORS depuis domaine autorisé
- [ ] Vérifier CSP (aucune violation en console)

## Rollback
- [ ] Conserver tag/commit déployé
- [ ] Documenter procédure de retour à N-1 (Pages versioning + migrations réversibles si possible)
