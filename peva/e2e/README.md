# Tests E2E PEVA avec Playwright

Ce dossier contient les tests end-to-end (E2E) pour la plateforme PEVA utilisant Playwright.

## 🚀 Installation et Configuration

### Prérequis
- Node.js 20.19.0 ou supérieur
- npm ou yarn

### Installation des navigateurs
```bash
npx playwright install
```

## 🧪 Exécution des Tests

### Lancer tous les tests
```bash
npx playwright test
```

### Lancer les tests en mode UI (interactif)
```bash
npx playwright test --ui
```

### Lancer les tests en mode headed (voir le navigateur)
```bash
npx playwright test --headed
```

### Lancer un fichier de test spécifique
```bash
npx playwright test landing.spec.js
```

### Lancer les tests sur un navigateur spécifique
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📁 Structure des Tests

```
e2e/
├── README.md              # Ce fichier
├── landing.spec.js        # Tests de la page d'accueil
├── auth.spec.js          # Tests d'authentification
├── navigation.spec.js    # Tests de navigation
└── map.spec.js          # Tests de la carte interactive
```

## 🔧 Configuration

La configuration Playwright se trouve dans `playwright.config.js` à la racine du projet.

### Points clés de la configuration :
- **Base URL** : `http://localhost:5173` (serveur de développement Vite)
- **Navigateurs** : Chromium, Firefox, WebKit
- **Serveur automatique** : Lance `npm run dev` avant les tests
- **Screenshots** : Capturés en cas d'échec
- **Vidéos** : Enregistrées en cas d'échec
- **Traces** : Collectées lors des reprises

## 📋 Tests Implémentés

### 1. Landing Page (`landing.spec.js`)
- ✅ Chargement de la page d'accueil
- ✅ Navigation vers l'inscription
- ✅ Affichage des statistiques
- ✅ Navigation responsive
- ✅ Scroll vers les fonctionnalités

### 2. Authentication (`auth.spec.js`)
- ✅ Chargement de la page de connexion
- ✅ Chargement de la page d'inscription
- ✅ Validation des formulaires
- ✅ Navigation vers la réinitialisation de mot de passe
- ✅ Navigation entre les pages d'auth

### 3. Navigation (`navigation.spec.js`)
- ✅ Navigation vers l'annuaire
- ✅ Navigation vers les opportunités
- ✅ Navigation vers les événements
- ✅ Navigation vers la carte
- ✅ Navigation vers les ressources
- ✅ Redirection /companies → /directory
- ✅ Navigation breadcrumb
- ✅ Gestion des pages 404

### 4. Interactive Map (`map.spec.js`)
- ✅ Chargement de la carte
- ✅ Affichage des filtres
- ✅ Boutons de navigation
- ✅ Compteur d'entreprises
- ✅ Fonctionnalité plein écran
- ✅ Réinitialisation des filtres
- ✅ Design responsive
- ✅ Conteneur de carte

## 🎯 Bonnes Pratiques

### Sélecteurs
- Privilégier les `data-testid` pour les éléments critiques
- Utiliser le texte visible pour les éléments d'interface
- Éviter les sélecteurs CSS fragiles

### Attentes
- Utiliser `toBeVisible()` pour vérifier la présence d'éléments
- Utiliser `toHaveURL()` pour vérifier les redirections
- Utiliser `toContainText()` pour vérifier le contenu

### Performance
- Utiliser `waitForTimeout()` avec parcimonie
- Privilégier les attentes automatiques de Playwright
- Éviter les tests trop longs

## 🐛 Débogage

### Mode Debug
```bash
npx playwright test --debug
```

### Trace Viewer (après échec)
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Screenshots et Vidéos
Les captures d'écran et vidéos sont automatiquement sauvegardées dans `test-results/` en cas d'échec.

## 🚀 CI/CD

### GitHub Actions
Pour intégrer les tests dans GitHub Actions, ajouter dans `.github/workflows/playwright.yml` :

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## 📝 Ajout de Nouveaux Tests

### Template de base
```javascript
import { test, expect } from '@playwright/test';

test.describe('Nom de la fonctionnalité', () => {
  test('devrait faire quelque chose', async ({ page }) => {
    await page.goto('/url');
    
    // Actions et vérifications
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Tests avec authentification
Pour les tests nécessitant une authentification, créer un setup global ou utiliser des fixtures.

## 🔗 Ressources

- [Documentation Playwright](https://playwright.dev/)
- [API Reference](https://playwright.dev/docs/api/class-test)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
