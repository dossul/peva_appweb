# Tests E2E PEVA - Guide Complet

## 🎯 Vue d'ensemble

Cette suite de tests End-to-End (E2E) valide l'intégralité de la plateforme PEVA, incluant tous les formulaires, boutons, liens et fonctionnalités avec intégration Supabase complète.

## 📋 Structure des Tests

### 🔧 Configuration
- **Framework** : Playwright
- **Navigateurs** : Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari, Tablet
- **Environnements** : Développement, Staging, Production
- **Données** : Utilisateurs de test avec différents rôles

### 📁 Organisation des Fichiers

```
tests/e2e/
├── playwright.config.js          # Configuration Playwright
├── global-setup.js               # Configuration globale avant tests
├── global-teardown.js            # Nettoyage après tests
├── test-specifications.md        # Spécifications détaillées
├── auth.spec.js                  # Tests authentification & onboarding
├── navigation.spec.js            # Tests navigation & pages principales
├── opportunities.spec.js         # Tests opportunités & marketplace
├── admin.spec.js                 # Tests administration
├── messaging.spec.js             # Tests communication & social
├── events-resources.spec.js      # Tests événements & ressources
├── responsive.spec.js            # Tests responsive & performance
└── integration.spec.js           # Tests d'intégration complète
```

## 🚀 Commandes de Test

### Exécution des Tests

```bash
# Tous les tests
npm run test:e2e

# Interface graphique
npm run test:e2e:ui

# Mode debug
npm run test:e2e:debug

# Mode visible (avec navigateur)
npm run test:e2e:headed

# Rapport des résultats
npm run test:e2e:report
```

### Tests Spécifiques

```bash
# Tests d'authentification uniquement
npx playwright test auth.spec.js

# Tests admin uniquement
npx playwright test admin.spec.js

# Tests sur un navigateur spécifique
npx playwright test --project=chromium

# Tests mobile uniquement
npx playwright test --project="Mobile Chrome"
```

## 👥 Utilisateurs de Test

### Comptes Pré-configurés

| Email | Mot de passe | Rôle | Onboarding | Usage |
|-------|-------------|------|------------|-------|
| `admin@peva.test` | `AdminPassword123!` | admin | ❌ | Tests administration |
| `superadmin@peva.test` | `SuperAdminPassword123!` | super_admin | ❌ | Tests super admin |
| `user.completed@peva.test` | `UserPassword123!` | user | ✅ | Tests utilisateur standard |
| `user.new@peva.test` | `UserPassword123!` | user | ❌ | Tests onboarding |
| `company.owner@peva.test` | `CompanyPassword123!` | user | ✅ | Tests création contenu |

## 📊 Couverture des Tests

### 1. Authentification et Onboarding (auth.spec.js)
- ✅ Inscription avec validation
- ✅ Connexion et redirections
- ✅ Onboarding en 3 étapes
- ✅ Récupération mot de passe
- ✅ Déconnexion

### 2. Navigation et Pages (navigation.spec.js)
- ✅ Page d'accueil responsive
- ✅ Carte interactive Leaflet
- ✅ Annuaire avec filtres
- ✅ Navigation mobile/desktop
- ✅ Breadcrumbs et erreurs

### 3. Opportunités (opportunities.spec.js)
- ✅ Liste avec filtres avancés
- ✅ Création en 3 étapes
- ✅ Candidatures et favoris
- ✅ Gestion des opportunités
- ✅ Validation formulaires

### 4. Administration (admin.spec.js)
- ✅ Dashboard avec statistiques
- ✅ CRUD utilisateurs complet
- ✅ Gestion entreprises
- ✅ Modération contenu
- ✅ Paramètres système

### 5. Communication (messaging.spec.js)
- ✅ Messagerie temps réel
- ✅ Gestion connexions
- ✅ Forum et discussions
- ✅ Communautés/groupes
- ✅ Notifications

### 6. Événements et Ressources (events-resources.spec.js)
- ✅ Calendrier interactif
- ✅ Inscription événements
- ✅ Bibliothèque ressources
- ✅ Soumission contenu
- ✅ Téléchargements

### 7. Responsive Design (responsive.spec.js)
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)
- ✅ Performance
- ✅ Accessibilité

### 8. Intégration Complète (integration.spec.js)
- ✅ Workflows utilisateur complets
- ✅ Intégrations services (Supabase, OneSignal)
- ✅ Flux de données complexes
- ✅ Tests de régression

## 🔧 Intégrations Testées

### Supabase
- ✅ Authentification et sessions
- ✅ CRUD operations complètes
- ✅ RLS (Row Level Security)
- ✅ Storage et fichiers
- ✅ Notifications temps réel

### Services Externes
- ✅ OneSignal (notifications push)
- ✅ Leaflet (cartographie)
- ✅ Email SMTP
- ✅ Upload fichiers

## 📱 Tests Responsive

### Mobile (< 768px)
- Menu hamburger fonctionnel
- Boutons tactiles (min 40px)
- Cartes empilées verticalement
- Formulaires adaptés
- Navigation simplifiée

### Tablet (768px - 1024px)
- Navigation hybride
- Grilles 2-3 colonnes
- Formulaires optimisés
- Sidebars adaptatives

### Desktop (> 1024px)
- Navigation complète
- Grilles 3-4 colonnes
- Sidebars permanentes
- Tooltips et interactions avancées

## ⚡ Performance

### Métriques Testées
- ✅ Temps de chargement < 3s
- ✅ Lazy loading images
- ✅ Optimisation requêtes réseau
- ✅ Gestion erreurs gracieuse
- ✅ Pagination grandes listes
- ✅ Cache navigateur
- ✅ Polices optimisées

## 🛡️ Sécurité

### Tests de Sécurité
- ✅ Contrôle accès pages admin
- ✅ Permissions par rôle
- ✅ Validation formulaires
- ✅ Sanitisation données
- ✅ Sessions sécurisées
- ✅ Protection CSRF

## 📈 Rapports et Monitoring

### Formats de Rapport
- **HTML** : Rapport visuel détaillé
- **JSON** : Données structurées
- **JUnit** : Intégration CI/CD

### Métriques de Succès
- ✅ **100% des formulaires** validés
- ✅ **100% des boutons/liens** testés
- ✅ **Toutes les redirections** vérifiées
- ✅ **Intégration Supabase** complète
- ✅ **Responsive** tous devices
- ✅ **Performance** optimale

## 🚨 Gestion des Erreurs

### Types d'Erreurs Testées
- Erreurs réseau (timeout, 404, 500)
- Erreurs de validation formulaires
- Erreurs d'authentification
- Erreurs de permissions
- Erreurs de chargement données

### Stratégies de Récupération
- Messages d'erreur utilisateur
- Boutons de retry
- Fallbacks gracieux
- Logs détaillés
- Notifications appropriées

## 🔄 CI/CD Integration

### GitHub Actions (exemple)
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
```

## 📝 Maintenance des Tests

### Bonnes Pratiques
1. **Données de test** : Utiliser des données cohérentes
2. **Sélecteurs** : Privilégier `data-test` attributes
3. **Attentes** : Timeouts appropriés
4. **Nettoyage** : Supprimer données test après exécution
5. **Documentation** : Maintenir à jour les spécifications

### Mise à Jour
- Ajouter tests pour nouvelles fonctionnalités
- Mettre à jour sélecteurs si UI change
- Ajuster timeouts si performance évolue
- Documenter changements breaking

## 🎯 Objectifs Qualité

- **Couverture** : 100% des fonctionnalités critiques
- **Fiabilité** : < 1% de tests flaky
- **Performance** : Exécution < 30 minutes
- **Maintenance** : Documentation à jour
- **Intégration** : CI/CD automatisé

---

## 🚀 Pour Commencer

1. **Installation** :
   ```bash
   npm install
   npx playwright install
   ```

2. **Configuration** :
   - Vérifier `playwright.config.js`
   - Configurer variables d'environnement
   - Lancer l'application en développement

3. **Exécution** :
   ```bash
   npm run test:e2e:ui
   ```

4. **Analyse** :
   - Consulter les rapports HTML
   - Vérifier les captures d'écran
   - Analyser les traces d'exécution

Cette suite de tests garantit la qualité et la fiabilité de la plateforme PEVA à travers tous les parcours utilisateur critiques.
