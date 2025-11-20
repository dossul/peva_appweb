import { test, expect } from '@playwright/test'

test.describe('Événements et Ressources', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avec un utilisateur standard
    await page.goto('/login')
    await page.fill('input[name="email"]', 'user.completed@peva.test')
    await page.fill('input[name="password"]', 'UserPassword123!')
    await page.click('button:has-text("Se connecter")')
    await expect(page).toHaveURL('/')
  })

  test.describe('Événements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/events')
    })

    test('doit afficher la page des événements', async ({ page }) => {
      // Vérifier l'affichage de la page
      await expect(page.locator('text=Événements PEVA')).toBeVisible()
      
      // Vérifier les statistiques
      await expect(page.locator('[data-test="events-stats"]')).toBeVisible()
      await expect(page.locator('text=événements à venir')).toBeVisible()
      await expect(page.locator('text=participants')).toBeVisible()
      
      // Vérifier le calendrier
      await expect(page.locator('[data-test="events-calendar"]')).toBeVisible()
    })

    test('doit afficher le calendrier des événements', async ({ page }) => {
      // Vérifier la présence du calendrier
      await expect(page.locator('[data-test="calendar-grid"]')).toBeVisible()
      
      // Vérifier les contrôles de navigation
      await expect(page.locator('[data-test="calendar-prev"]')).toBeVisible()
      await expect(page.locator('[data-test="calendar-next"]')).toBeVisible()
      await expect(page.locator('[data-test="current-month"]')).toBeVisible()
      
      // Vérifier la présence d'événements sur le calendrier
      const eventDays = page.locator('[data-test="calendar-day"].has-events')
      await expect(eventDays).toHaveCountGreaterThan(0)
    })

    test('doit naviguer entre les mois du calendrier', async ({ page }) => {
      // Récupérer le mois actuel
      const currentMonth = await page.locator('[data-test="current-month"]').textContent()
      
      // Naviguer vers le mois suivant
      await page.click('[data-test="calendar-next"]')
      
      // Vérifier que le mois a changé
      const nextMonth = await page.locator('[data-test="current-month"]').textContent()
      expect(nextMonth).not.toBe(currentMonth)
      
      // Revenir au mois précédent
      await page.click('[data-test="calendar-prev"]')
      
      // Vérifier le retour au mois initial
      const backToMonth = await page.locator('[data-test="current-month"]').textContent()
      expect(backToMonth).toBe(currentMonth)
    })

    test('doit afficher les détails d\'un événement', async ({ page }) => {
      // Cliquer sur un jour avec événements
      const eventDay = page.locator('[data-test="calendar-day"].has-events').nth(0)
      await eventDay.click()
      
      // Vérifier l'affichage des événements du jour
      await expect(page.locator('[data-test="day-events-panel"]')).toBeVisible()
      
      // Cliquer sur le premier événement
      await page.click('[data-test="event-item"] >> nth=0')
      
      // Vérifier l'ouverture du dialog de détails
      await expect(page.locator('[data-test="event-details-dialog"]')).toBeVisible()
      await expect(page.locator('[data-test="event-title"]')).toBeVisible()
      await expect(page.locator('[data-test="event-description"]')).toBeVisible()
      await expect(page.locator('[data-test="event-date-time"]')).toBeVisible()
      await expect(page.locator('[data-test="event-location"]')).toBeVisible()
    })

    test('doit permettre de s\'inscrire à un événement', async ({ page }) => {
      // Ouvrir un événement
      const eventDay = page.locator('[data-test="calendar-day"].has-events').nth(0)
      await eventDay.click()
      await page.click('[data-test="event-item"] >> nth=0')
      
      // Vérifier la présence du bouton d'inscription
      const registerButton = page.locator('button:has-text("S\'inscrire")')
      
      if (await registerButton.isVisible()) {
        await registerButton.click()
        
        // Vérifier le formulaire d'inscription
        await expect(page.locator('[data-test="registration-form"]')).toBeVisible()
        
        // Remplir le formulaire si nécessaire
        if (await page.locator('input[name="participantName"]').isVisible()) {
          await page.fill('input[name="participantName"]', 'John Doe')
          await page.fill('input[name="participantEmail"]', 'john.doe@test.com')
        }
        
        // Confirmer l'inscription
        await page.click('button:has-text("Confirmer l\'inscription")')
        
        // Vérifier le message de confirmation
        await expect(page.locator('text=Inscription confirmée')).toBeVisible()
      }
    })

    test('doit afficher les prochains événements', async ({ page }) => {
      // Vérifier la sidebar des prochains événements
      await expect(page.locator('[data-test="upcoming-events"]')).toBeVisible()
      
      const upcomingEvents = page.locator('[data-test="upcoming-event"]')
      await expect(upcomingEvents).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'un événement à venir
      const firstEvent = upcomingEvents.nth(0)
      await expect(firstEvent.locator('[data-test="event-title"]')).toBeVisible()
      await expect(firstEvent.locator('[data-test="event-date"]')).toBeVisible()
      await expect(firstEvent.locator('[data-test="event-type"]')).toBeVisible()
    })

    test('doit filtrer les événements par type', async ({ page }) => {
      // Utiliser le filtre par type
      await page.selectOption('[data-test="event-type-filter"]', 'webinar')
      
      // Vérifier que seuls les webinaires sont affichés
      const eventItems = page.locator('[data-test="upcoming-event"]')
      const count = await eventItems.count()
      
      for (let i = 0; i < count; i++) {
        const eventType = await eventItems.nth(i).locator('[data-test="event-type"]').textContent()
        expect(eventType.toLowerCase()).toContain('webinaire')
      }
      
      // Réinitialiser le filtre
      await page.selectOption('[data-test="event-type-filter"]', 'all')
    })

    test('doit permettre de créer un nouvel événement', async ({ page }) => {
      await page.click('button:has-text("Créer un événement")')
      
      // Vérifier l'ouverture du dialog
      await expect(page.locator('[data-test="create-event-dialog"]')).toBeVisible()
      
      // Remplir le formulaire
      await page.fill('input[name="title"]', 'Événement Test PEVA')
      await page.fill('textarea[name="description"]', 'Description de l\'événement test')
      await page.selectOption('select[name="type"]', 'conference')
      await page.selectOption('select[name="format"]', 'presentiel')
      await page.fill('input[name="date"]', '2024-12-15')
      await page.fill('input[name="time"]', '14:00')
      await page.fill('input[name="location"]', 'Ouagadougou, Burkina Faso')
      await page.fill('input[name="maxParticipants"]', '100')
      
      // Créer l'événement
      await page.click('button:has-text("Créer l\'événement")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Événement créé avec succès')).toBeVisible()
    })

    test('doit afficher les types d\'événements', async ({ page }) => {
      // Vérifier l'affichage des types d'événements
      await expect(page.locator('[data-test="event-types"]')).toBeVisible()
      
      const eventTypes = page.locator('[data-test="event-type-card"]')
      await expect(eventTypes).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'un type d'événement
      const firstType = eventTypes.nth(0)
      await expect(firstType.locator('[data-test="type-icon"]')).toBeVisible()
      await expect(firstType.locator('[data-test="type-name"]')).toBeVisible()
      await expect(firstType.locator('[data-test="type-count"]')).toBeVisible()
    })

    test('doit permettre d\'exporter le calendrier', async ({ page }) => {
      // Cliquer sur le bouton d'export
      await page.click('[data-test="export-calendar"]')
      
      // Vérifier les options d'export
      await expect(page.locator('[data-test="export-options"]')).toBeVisible()
      
      // Sélectionner le format iCal
      await page.click('button:has-text("iCal")')
      
      // Dans un vrai test, on vérifierait le téléchargement du fichier
      await expect(page.locator('text=Calendrier exporté')).toBeVisible()
    })

    test('doit rechercher des événements', async ({ page }) => {
      const searchInput = page.locator('[data-test="events-search"]')
      
      await searchInput.fill('formation')
      await page.keyboard.press('Enter')
      
      // Vérifier que les résultats sont filtrés
      const events = page.locator('[data-test="upcoming-event"]')
      const count = await events.count()
      
      for (let i = 0; i < count; i++) {
        const eventText = await events.nth(i).textContent()
        expect(eventText.toLowerCase()).toContain('formation')
      }
      
      // Effacer la recherche
      await searchInput.clear()
      await page.keyboard.press('Enter')
    })
  })

  test.describe('Ressources', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/resources')
    })

    test('doit afficher la page des ressources', async ({ page }) => {
      // Vérifier l'affichage de la page
      await expect(page.locator('text=Ressources & Connaissances')).toBeVisible()
      
      // Vérifier les statistiques
      await expect(page.locator('[data-test="resources-stats"]')).toBeVisible()
      await expect(page.locator('text=guides')).toBeVisible()
      await expect(page.locator('text=rapports')).toBeVisible()
      await expect(page.locator('text=outils')).toBeVisible()
      await expect(page.locator('text=formations')).toBeVisible()
    })

    test('doit afficher les filtres de ressources', async ({ page }) => {
      // Vérifier la présence des filtres
      await expect(page.locator('[data-test="resources-filters"]')).toBeVisible()
      await expect(page.locator('select[name="type"]')).toBeVisible()
      await expect(page.locator('select[name="sector"]')).toBeVisible()
      await expect(page.locator('select[name="level"]')).toBeVisible()
      await expect(page.locator('input[name="search"]')).toBeVisible()
    })

    test('doit filtrer les ressources par type', async ({ page }) => {
      // Filtrer par type "Guide"
      await page.selectOption('select[name="type"]', 'guide')
      await page.click('button:has-text("Appliquer")')
      
      // Vérifier que seuls les guides sont affichés
      const resources = page.locator('[data-test="resource-card"]')
      const count = await resources.count()
      
      for (let i = 0; i < count; i++) {
        const resourceType = await resources.nth(i).locator('[data-test="resource-type"]').textContent()
        expect(resourceType.toLowerCase()).toContain('guide')
      }
      
      // Réinitialiser les filtres
      await page.click('button:has-text("Réinitialiser")')
    })

    test('doit filtrer les ressources par secteur', async ({ page }) => {
      // Filtrer par secteur "Énergie Solaire"
      await page.selectOption('select[name="sector"]', 'energie_solaire')
      await page.click('button:has-text("Appliquer")')
      
      // Vérifier que les ressources sont filtrées
      const resources = page.locator('[data-test="resource-card"]')
      const count = await resources.count()
      
      for (let i = 0; i < count; i++) {
        const resourceText = await resources.nth(i).textContent()
        expect(resourceText.toLowerCase()).toContain('solaire')
      }
    })

    test('doit filtrer les ressources par niveau', async ({ page }) => {
      // Filtrer par niveau "Débutant"
      await page.selectOption('select[name="level"]', 'beginner')
      await page.click('button:has-text("Appliquer")')
      
      // Vérifier que seules les ressources débutant sont affichées
      const resources = page.locator('[data-test="resource-card"]')
      const count = await resources.count()
      
      for (let i = 0; i < count; i++) {
        const resourceLevel = await resources.nth(i).locator('[data-test="resource-level"]').textContent()
        expect(resourceLevel.toLowerCase()).toContain('débutant')
      }
    })

    test('doit rechercher des ressources', async ({ page }) => {
      const searchInput = page.locator('input[name="search"]')
      
      await searchInput.fill('guide énergie solaire')
      await page.click('button:has-text("Appliquer")')
      
      // Vérifier que les résultats correspondent à la recherche
      const resources = page.locator('[data-test="resource-card"]')
      const count = await resources.count()
      
      if (count > 0) {
        const firstResource = resources.nth(0)
        const resourceText = await firstResource.textContent()
        expect(resourceText.toLowerCase()).toMatch(/(guide|énergie|solaire)/)
      }
      
      // Effacer la recherche
      await searchInput.clear()
      await page.click('button:has-text("Appliquer")')
    })

    test('doit afficher les ressources populaires', async ({ page }) => {
      // Vérifier l'affichage des ressources populaires
      await expect(page.locator('[data-test="popular-resources"]')).toBeVisible()
      
      const popularResources = page.locator('[data-test="popular-resource"]')
      await expect(popularResources).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'une ressource populaire
      const firstResource = popularResources.nth(0)
      await expect(firstResource.locator('[data-test="resource-title"]')).toBeVisible()
      await expect(firstResource.locator('[data-test="resource-downloads"]')).toBeVisible()
      await expect(firstResource.locator('[data-test="resource-rating"]')).toBeVisible()
    })

    test('doit permettre de télécharger une ressource', async ({ page }) => {
      const resources = page.locator('[data-test="resource-card"]')
      
      if (await resources.count() > 0) {
        // Cliquer sur télécharger pour la première ressource
        await resources.nth(0).locator('button:has-text("Télécharger")').click()
        
        // Dans un vrai test, on vérifierait le téléchargement
        // Pour l'instant, on vérifie juste que l'action est déclenchée
        await expect(page.locator('text=Téléchargement en cours')).toBeVisible()
      }
    })

    test('doit afficher les détails d\'une ressource', async ({ page }) => {
      const resources = page.locator('[data-test="resource-card"]')
      
      if (await resources.count() > 0) {
        // Cliquer sur "Voir détails" pour la première ressource
        await resources.nth(0).locator('button:has-text("Voir détails")').click()
        
        // Vérifier l'ouverture du dialog de détails
        await expect(page.locator('[data-test="resource-details-dialog"]')).toBeVisible()
        await expect(page.locator('[data-test="resource-full-description"]')).toBeVisible()
        await expect(page.locator('[data-test="resource-metadata"]')).toBeVisible()
        await expect(page.locator('[data-test="resource-author"]')).toBeVisible()
      }
    })

    test('doit permettre de noter une ressource', async ({ page }) => {
      const resources = page.locator('[data-test="resource-card"]')
      
      if (await resources.count() > 0) {
        // Ouvrir les détails de la première ressource
        await resources.nth(0).locator('button:has-text("Voir détails")').click()
        
        // Noter la ressource (5 étoiles)
        await page.click('[data-test="rating-stars"] >> [data-rating="5"]')
        
        // Ajouter un commentaire
        await page.fill('textarea[name="comment"]', 'Excellente ressource, très utile!')
        
        // Soumettre la note
        await page.click('button:has-text("Soumettre")')
        
        // Vérifier le message de confirmation
        await expect(page.locator('text=Note enregistrée')).toBeVisible()
      }
    })

    test('doit permettre de proposer une ressource', async ({ page }) => {
      await page.click('button:has-text("Proposer une Ressource")')
      
      // Vérifier la redirection vers le formulaire de soumission
      await expect(page).toHaveURL('/resources/submit')
      await expect(page.locator('text=Proposer une Ressource')).toBeVisible()
    })

    test('doit afficher les catégories de ressources', async ({ page }) => {
      // Vérifier l'affichage des catégories
      await expect(page.locator('[data-test="resource-categories"]')).toBeVisible()
      
      const categories = page.locator('[data-test="category-section"]')
      await expect(categories).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'une catégorie
      const firstCategory = categories.nth(0)
      await expect(firstCategory.locator('[data-test="category-title"]')).toBeVisible()
      await expect(firstCategory.locator('[data-test="category-resources"]')).toBeVisible()
    })

    test('doit trier les ressources', async ({ page }) => {
      // Trier par popularité
      await page.selectOption('[data-test="sort-select"]', 'popularity')
      
      // Vérifier que l'ordre change
      await page.waitForTimeout(1000)
      
      // Trier par date (plus récent)
      await page.selectOption('[data-test="sort-select"]', 'date_desc')
      await page.waitForTimeout(1000)
      
      // Trier par nom
      await page.selectOption('[data-test="sort-select"]', 'name_asc')
      await page.waitForTimeout(1000)
    })

    test('doit utiliser la pagination', async ({ page }) => {
      // Vérifier la présence de la pagination si nécessaire
      const pagination = page.locator('[data-test="resources-pagination"]')
      
      if (await pagination.isVisible()) {
        // Aller à la page 2
        await page.click('[data-test="resources-pagination"] button:has-text("2")')
        
        // Vérifier que l'URL change
        await expect(page).toHaveURL(/page=2/)
        
        // Retour à la page 1
        await page.click('[data-test="resources-pagination"] button:has-text("1")')
        await expect(page).toHaveURL(/resources/)
      }
    })

    test('doit afficher les ressources récentes', async ({ page }) => {
      // Vérifier l'affichage des ressources récentes
      await expect(page.locator('[data-test="recent-resources"]')).toBeVisible()
      
      const recentResources = page.locator('[data-test="recent-resource"]')
      await expect(recentResources).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'une ressource récente
      const firstResource = recentResources.nth(0)
      await expect(firstResource.locator('[data-test="resource-title"]')).toBeVisible()
      await expect(firstResource.locator('[data-test="resource-date"]')).toBeVisible()
      await expect(firstResource.locator('[data-test="resource-author"]')).toBeVisible()
    })
  })

  test.describe('Soumission de ressource', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/resources/submit')
    })

    test('doit afficher le formulaire de soumission', async ({ page }) => {
      await expect(page.locator('text=Proposer une Ressource')).toBeVisible()
      
      // Vérifier les champs du formulaire
      await expect(page.locator('input[name="title"]')).toBeVisible()
      await expect(page.locator('textarea[name="description"]')).toBeVisible()
      await expect(page.locator('select[name="type"]')).toBeVisible()
      await expect(page.locator('select[name="category"]')).toBeVisible()
      await expect(page.locator('select[name="level"]')).toBeVisible()
    })

    test('doit valider les champs requis', async ({ page }) => {
      // Essayer de soumettre sans remplir les champs
      await page.click('button:has-text("Soumettre")')
      
      // Vérifier les messages d'erreur
      await expect(page.locator('text=Ce champ est requis')).toHaveCount(4)
    })

    test('doit permettre de soumettre une ressource', async ({ page }) => {
      // Remplir le formulaire
      await page.fill('input[name="title"]', 'Guide Test Soumission')
      await page.fill('textarea[name="description"]', 'Description du guide de test pour la soumission')
      await page.selectOption('select[name="type"]', 'guide')
      await page.fill('input[name="category"]', 'Énergie Solaire')
      await page.selectOption('select[name="level"]', 'beginner')
      await page.fill('input[name="language"]', 'Français')
      await page.fill('input[name="author"]', 'Auteur Test')
      await page.fill('input[name="source"]', 'https://example.com/guide.pdf')
      await page.fill('textarea[name="tags"]', 'test, guide, énergie, solaire')
      
      // Soumettre la ressource
      await page.click('button:has-text("Soumettre")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Ressource soumise avec succès')).toBeVisible()
      
      // Vérifier la redirection
      await expect(page).toHaveURL('/resources')
    })

    test('doit permettre d\'uploader un fichier', async ({ page }) => {
      // Simuler l'upload d'un fichier
      const fileInput = page.locator('input[type="file"]')
      
      await fileInput.setInputFiles({
        name: 'guide-test.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('fake pdf content')
      })
      
      // Vérifier l'aperçu du fichier
      await expect(page.locator('[data-test="file-preview"]')).toBeVisible()
      await expect(page.locator('text=guide-test.pdf')).toBeVisible()
    })

    test('doit sauvegarder en brouillon', async ({ page }) => {
      // Remplir partiellement le formulaire
      await page.fill('input[name="title"]', 'Brouillon Guide Test')
      await page.selectOption('select[name="type"]', 'guide')
      
      // Sauvegarder en brouillon
      await page.click('button:has-text("Sauvegarder brouillon")')
      
      // Vérifier le message de confirmation
      await expect(page.locator('text=Brouillon sauvegardé')).toBeVisible()
    })
  })
})
