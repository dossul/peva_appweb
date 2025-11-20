import { defineConfig, devices } from '@playwright/test'

/**
 * Configuration Playwright pour les tests E2E PEVA
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Répertoire des tests
  testDir: './tests/e2e',
  
  // Timeout global pour chaque test
  timeout: 30000,
  
  // Timeout pour les assertions expect
  expect: {
    timeout: 5000
  },
  
  // Nombre de tentatives en cas d'échec
  retries: process.env.CI ? 2 : 1,
  
  // Nombre de workers en parallèle
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter pour les résultats
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Configuration globale pour tous les tests
  use: {
    // URL de base de l'application
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    // Trace des actions pour le debug
    trace: 'on-first-retry',
    
    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',
    
    // Vidéos en cas d'échec
    video: 'retain-on-failure',
    
    // Timeout pour les actions
    actionTimeout: 10000,
    
    // Timeout pour la navigation
    navigationTimeout: 15000,
    
    // Ignorer les erreurs HTTPS en développement
    ignoreHTTPSErrors: true,
    
    // Headers par défaut
    extraHTTPHeaders: {
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
    }
  },

  // Configuration des projets (navigateurs)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    
    // Tests mobiles
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    },
    
    // Tests tablet
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] }
    }
  ],

  // Serveur de développement
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },

  // Répertoires de sortie
  outputDir: 'test-results/',
  
  // Configuration des fixtures globales
  globalSetup: require.resolve('./tests/e2e/global-setup.js'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown.js')
})
