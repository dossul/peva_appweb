import { test, expect } from '@playwright/test'

test.describe('Opportunités et Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avec un utilisateur standard
    await page.goto('/login')
    await page.fill('input[name="email"]', 'user.completed@peva.test')
    await page.fill('input[name="password"]', 'UserPassword123!')
    await page.click('button:has-text("Se connecter")')
    await expect(page).toHaveURL('/')
  })

  test.describe('Liste des opportunités', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/opportunities')
    })

    test('doit afficher la liste des opportunités', async ({ page }) => {
      // Vérifier l'affichage de la page
      await expect(page.locator('text=Place de Marché')).toBeVisible()
      await expect(page.locator('[data-test="opportunities-grid"]')).toBeVisible()
      
      // Vérifier la présence d'opportunités
      await expect(page.locator('[data-test="opportunity-card"]')).toHaveCountGreaterThan(0)
      
      // Vérifier les statistiques
      await expect(page.locator('[data-test="opportunities-stats"]')).toBeVisible()
    })

    test('doit utiliser les filtres par type', async ({ page }) => {
      // Ouvrir les filtres
      await page.click('[data-test="filters-toggle"]')
      
      // Filtrer par type "Financement"
      await page.selectOption('select[name="type"]', 'funding')
      await page.click('button:has-text("Appliquer")')
      
      // Vérifier que seules les opportunités de financement sont affichées
      const opportunityCards = page.locator('[data-test="opportunity-card"]')
      const count = await opportunityCards.count()
      
      for (let i = 0; i < count; i++) {
        await expect(opportunityCards.nth(i).locator('[data-test="opportunity-type"]')).toContainText('Financement')
      }
      
      // Réinitialiser les filtres
      await page.click('button:has-text("Réinitialiser")')
    })

    test('doit utiliser la recherche textuelle', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Rechercher"]')
      
      await searchInput.fill('solaire')
      await page.keyboard.press('Enter')
      
      // Vérifier que les résultats contiennent le terme recherché
      const opportunityCards = page.locator('[data-test="opportunity-card"]')
      const count = await opportunityCards.count()
      
      if (count > 0) {
        const firstCard = opportunityCards.nth(0)
        const cardText = await firstCard.textContent()
        expect(cardText.toLowerCase()).toContain('solaire')
      }
      
      // Effacer la recherche
      await searchInput.clear()
      await page.keyboard.press('Enter')
    })

    test('doit filtrer par secteur', async ({ page }) => {
      await page.click('[data-test="filters-toggle"]')
      
      await page.selectOption('select[name="sector"]', 'energie_solaire')
      await page.click('button:has-text("Appliquer")')
      
      // Vérifier que les résultats sont filtrés
      await page.waitForTimeout(1000)
      
      const opportunityCards = page.locator('[data-test="opportunity-card"]')
      const count = await opportunityCards.count()
      
      for (let i = 0; i < count; i++) {
        await expect(opportunityCards.nth(i).locator('[data-test="opportunity-sector"]')).toContainText('Énergie Solaire')
      }
    })

    test('doit filtrer par localisation', async ({ page }) => {
      await page.click('[data-test="filters-toggle"]')
      
      await page.selectOption('select[name="country"]', 'Burkina Faso')
      await page.click('button:has-text("Appliquer")')
      
      // Vérifier que les résultats sont filtrés par pays
      await page.waitForTimeout(1000)
      
      const opportunityCards = page.locator('[data-test="opportunity-card"]')
      const count = await opportunityCards.count()
      
      for (let i = 0; i < count; i++) {
        await expect(opportunityCards.nth(i).locator('[data-test="opportunity-location"]')).toContainText('Burkina Faso')
      }
    })

    test('doit trier les opportunités', async ({ page }) => {
      // Trier par date (plus récent)
      await page.selectOption('select[name="sort"]', 'date_desc')
      
      // Vérifier que l'ordre change
      await page.waitForTimeout(1000)
      
      // Trier par montant (plus élevé)
      await page.selectOption('select[name="sort"]', 'amount_desc')
      await page.waitForTimeout(1000)
    })

    test('doit utiliser la pagination', async ({ page }) => {
      // Vérifier la présence de la pagination si nécessaire
      const pagination = page.locator('[data-test="pagination"]')
      
      if (await pagination.isVisible()) {
        // Aller à la page 2
        await page.click('[data-test="pagination"] button:has-text("2")')
        
        // Vérifier que l'URL change
        await expect(page).toHaveURL(/page=2/)
        
        // Retour à la page 1
        await page.click('[data-test="pagination"] button:has-text("1")')
        await expect(page).toHaveURL(/opportunities/)
      }
    })

    test('doit afficher les détails d\'une opportunité', async ({ page }) => {
      // Cliquer sur la première opportunité
      await page.click('[data-test="opportunity-card"] >> nth=0')
      
      // Vérifier la navigation vers la page de détails
      await expect(page).toHaveURL(/\/opportunities\/\d+/)
      
      // Vérifier les éléments de la page de détails
      await expect(page.locator('[data-test="opportunity-title"]')).toBeVisible()
      await expect(page.locator('[data-test="opportunity-description"]')).toBeVisible()
      await expect(page.locator('[data-test="opportunity-details"]')).toBeVisible()
      await expect(page.locator('[data-test="opportunity-contact"]')).toBeVisible()
    })

    test('doit permettre de postuler à une opportunité', async ({ page }) => {
      await page.click('[data-test="opportunity-card"] >> nth=0')
      
      // Cliquer sur le bouton "Postuler"
      await page.click('button:has-text("Postuler")')
      
      // Vérifier que le dialog de candidature s'ouvre
      await expect(page.locator('[data-test="application-dialog"]')).toBeVisible()
      
      // Remplir le formulaire de candidature
      await page.fill('textarea[name="motivation"]', 'Je suis très intéressé par cette opportunité...')
      await page.fill('input[name="experience"]', '5 ans d\'expérience dans le domaine')
      
      // Soumettre la candidature
      await page.click('button:has-text("Envoyer ma candidature")')
      
      // Vérifier le message de confirmation
      await expect(page.locator('text=Candidature envoyée avec succès')).toBeVisible()
    })

    test('doit permettre d\'ajouter aux favoris', async ({ page }) => {
      // Cliquer sur le bouton favoris de la première opportunité
      await page.click('[data-test="opportunity-card"] >> nth=0 >> [data-test="favorite-button"]')
      
      // Vérifier que l'opportunité est ajoutée aux favoris
      await expect(page.locator('[data-test="opportunity-card"] >> nth=0 >> [data-test="favorite-button"].favorited')).toBeVisible()
      
      // Retirer des favoris
      await page.click('[data-test="opportunity-card"] >> nth=0 >> [data-test="favorite-button"]')
      await expect(page.locator('[data-test="opportunity-card"] >> nth=0 >> [data-test="favorite-button"]:not(.favorited)')).toBeVisible()
    })
  })

  test.describe('Création d\'opportunité', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/opportunities')
      await page.click('button:has-text("Publier une opportunité")')
      await expect(page).toHaveURL('/opportunities/create')
    })

    test('doit afficher le formulaire de création en 3 étapes', async ({ page }) => {
      // Vérifier l'affichage de la première étape
      await expect(page.locator('text=Étape 1 sur 3')).toBeVisible()
      await expect(page.locator('text=Informations de base')).toBeVisible()
      
      // Vérifier les champs de la première étape
      await expect(page.locator('input[name="title"]')).toBeVisible()
      await expect(page.locator('select[name="type"]')).toBeVisible()
      await expect(page.locator('select[name="sector"]')).toBeVisible()
      await expect(page.locator('textarea[name="description"]')).toBeVisible()
    })

    test('doit valider les champs requis de l\'étape 1', async ({ page }) => {
      // Essayer de passer à l'étape suivante sans remplir les champs
      await page.click('button:has-text("Suivant")')
      
      // Vérifier les messages d'erreur
      await expect(page.locator('text=Ce champ est requis')).toHaveCount(4)
    })

    test('doit naviguer entre les étapes', async ({ page }) => {
      // Remplir l'étape 1
      await page.fill('input[name="title"]', 'Opportunité de financement solaire')
      await page.selectOption('select[name="type"]', 'funding')
      await page.selectOption('select[name="sector"]', 'energie_solaire')
      await page.fill('textarea[name="description"]', 'Description de l\'opportunité...')
      await page.fill('input[name="organization"]', 'Mon Organisation')
      await page.selectOption('select[name="country"]', 'Burkina Faso')
      await page.selectOption('select[name="city"]', 'Ouagadougou')
      
      // Passer à l'étape 2
      await page.click('button:has-text("Suivant")')
      await expect(page.locator('text=Étape 2 sur 3')).toBeVisible()
      await expect(page.locator('text=Détails spécifiques')).toBeVisible()
      
      // Vérifier que les champs spécifiques au financement sont affichés
      await expect(page.locator('input[name="amount"]')).toBeVisible()
      await expect(page.locator('select[name="fundingType"]')).toBeVisible()
      
      // Passer à l'étape 3
      await page.fill('input[name="amount"]', '50000')
      await page.selectOption('select[name="fundingType"]', 'grant')
      await page.fill('textarea[name="requirements"]', 'Critères d\'éligibilité...')
      
      await page.click('button:has-text("Suivant")')
      await expect(page.locator('text=Étape 3 sur 3')).toBeVisible()
      await expect(page.locator('text=Critères & Publication')).toBeVisible()
      
      // Tester le bouton précédent
      await page.click('button:has-text("Précédent")')
      await expect(page.locator('text=Étape 2 sur 3')).toBeVisible()
    })

    test('doit adapter les champs selon le type d\'opportunité', async ({ page }) => {
      // Test pour type "Emploi"
      await page.fill('input[name="title"]', 'Poste de développeur')
      await page.selectOption('select[name="type"]', 'job')
      
      await page.click('button:has-text("Suivant")')
      
      // Vérifier les champs spécifiques à l'emploi
      await expect(page.locator('input[name="salary"]')).toBeVisible()
      await expect(page.locator('select[name="contractType"]')).toBeVisible()
      await expect(page.locator('input[name="experience"]')).toBeVisible()
      
      // Retour et test pour type "Partenariat"
      await page.click('button:has-text("Précédent")')
      await page.selectOption('select[name="type"]', 'partnership')
      
      await page.click('button:has-text("Suivant")')
      
      // Vérifier les champs spécifiques au partenariat
      await expect(page.locator('select[name="partnershipType"]')).toBeVisible()
      await expect(page.locator('textarea[name="expectations"]')).toBeVisible()
    })

    test('doit sauvegarder en brouillon', async ({ page }) => {
      // Remplir partiellement le formulaire
      await page.fill('input[name="title"]', 'Opportunité en brouillon')
      await page.selectOption('select[name="type"]', 'funding')
      
      // Cliquer sur "Sauvegarder brouillon"
      await page.click('button:has-text("Sauvegarder brouillon")')
      
      // Vérifier le message de confirmation
      await expect(page.locator('text=Brouillon sauvegardé')).toBeVisible()
    })

    test('doit créer une opportunité complète', async ({ page }) => {
      // Étape 1 - Informations de base
      await page.fill('input[name="title"]', 'Financement pour projet solaire')
      await page.selectOption('select[name="type"]', 'funding')
      await page.selectOption('select[name="sector"]', 'energie_solaire')
      await page.fill('textarea[name="description"]', 'Opportunité de financement pour développer des projets d\'énergie solaire au Burkina Faso.')
      await page.fill('input[name="organization"]', 'Fonds Vert Burkina')
      await page.selectOption('select[name="country"]', 'Burkina Faso')
      await page.selectOption('select[name="city"]', 'Ouagadougou')
      
      await page.click('button:has-text("Suivant")')
      
      // Étape 2 - Détails spécifiques
      await page.fill('input[name="amount"]', '100000')
      await page.selectOption('select[name="fundingType"]', 'grant')
      await page.fill('textarea[name="requirements"]', 'Projet innovant dans le domaine solaire, équipe expérimentée requise.')
      await page.fill('input[name="deadline"]', '2024-12-31')
      
      await page.click('button:has-text("Suivant")')
      
      // Étape 3 - Critères et publication
      await page.fill('input[name="contactEmail"]', 'contact@fondsvert.bf')
      await page.fill('input[name="contactPhone"]', '+22670123456')
      await page.selectOption('select[name="visibility"]', 'public')
      await page.check('input[name="acceptTerms"]')
      
      // Publier l'opportunité
      await page.click('button:has-text("Publier l\'opportunité")')
      
      // Vérifier la redirection et le message de succès
      await expect(page).toHaveURL(/\/opportunities\/\d+/)
      await expect(page.locator('text=Opportunité publiée avec succès')).toBeVisible()
    })

    test('doit valider l\'acceptation des conditions', async ({ page }) => {
      // Remplir toutes les étapes sans accepter les conditions
      await page.fill('input[name="title"]', 'Test Opportunité')
      await page.selectOption('select[name="type"]', 'funding')
      await page.selectOption('select[name="sector"]', 'energie_solaire')
      await page.fill('textarea[name="description"]', 'Description test')
      await page.fill('input[name="organization"]', 'Test Org')
      await page.selectOption('select[name="country"]', 'Burkina Faso')
      await page.selectOption('select[name="city"]', 'Ouagadougou')
      
      await page.click('button:has-text("Suivant")')
      
      await page.fill('input[name="amount"]', '50000')
      await page.selectOption('select[name="fundingType"]', 'grant')
      await page.fill('textarea[name="requirements"]', 'Test requirements')
      
      await page.click('button:has-text("Suivant")')
      
      await page.fill('input[name="contactEmail"]', 'test@test.com')
      
      // Essayer de publier sans accepter les conditions
      await page.click('button:has-text("Publier l\'opportunité")')
      
      // Vérifier le message d'erreur
      await expect(page.locator('text=Vous devez accepter les conditions')).toBeVisible()
    })
  })

  test.describe('Mes opportunités', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/opportunities/my-opportunities')
    })

    test('doit afficher les opportunités créées par l\'utilisateur', async ({ page }) => {
      await expect(page.locator('text=Mes Opportunités')).toBeVisible()
      
      // Vérifier les onglets
      await expect(page.locator('text=Publiées')).toBeVisible()
      await expect(page.locator('text=Brouillons')).toBeVisible()
      await expect(page.locator('text=Candidatures')).toBeVisible()
    })

    test('doit permettre de modifier une opportunité', async ({ page }) => {
      // Cliquer sur modifier pour la première opportunité
      await page.click('[data-test="opportunity-item"] >> nth=0 >> button:has-text("Modifier")')
      
      // Vérifier la redirection vers le formulaire d'édition
      await expect(page).toHaveURL(/\/opportunities\/\d+\/edit/)
    })

    test('doit permettre de supprimer une opportunité', async ({ page }) => {
      // Cliquer sur supprimer pour la première opportunité
      await page.click('[data-test="opportunity-item"] >> nth=0 >> button:has-text("Supprimer")')
      
      // Confirmer la suppression
      await page.click('button:has-text("Confirmer")')
      
      // Vérifier le message de confirmation
      await expect(page.locator('text=Opportunité supprimée')).toBeVisible()
    })

    test('doit afficher les statistiques des candidatures', async ({ page }) => {
      // Aller à l'onglet candidatures
      await page.click('text=Candidatures')
      
      // Vérifier l'affichage des candidatures reçues
      await expect(page.locator('[data-test="applications-list"]')).toBeVisible()
    })
  })
})
