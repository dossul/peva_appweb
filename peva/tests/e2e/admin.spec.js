import { test, expect } from '@playwright/test'

test.describe('Administration', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avec un compte administrateur
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@peva.test')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button:has-text("Se connecter")')
    await expect(page).toHaveURL('/admin/dashboard')
  })

  test.describe('Dashboard Admin', () => {
    test('doit afficher le dashboard admin avec toutes les statistiques', async ({ page }) => {
      // Vérifier l'en-tête admin
      await expect(page.locator('text=Panneau d\'Administration PEVA')).toBeVisible()
      await expect(page.locator('text=Gestion complète de la plateforme')).toBeVisible()
      
      // Vérifier les onglets de navigation
      await expect(page.locator('text=Tableau de bord')).toBeVisible()
      await expect(page.locator('text=Utilisateurs')).toBeVisible()
      await expect(page.locator('text=Entreprises')).toBeVisible()
      await expect(page.locator('text=Opportunités')).toBeVisible()
      await expect(page.locator('text=Événements')).toBeVisible()
      await expect(page.locator('text=Ressources')).toBeVisible()
      await expect(page.locator('text=Notifications')).toBeVisible()
      await expect(page.locator('text=Paramètres')).toBeVisible()
      
      // Vérifier les statistiques principales
      await expect(page.locator('[data-test="total-users"]')).toBeVisible()
      await expect(page.locator('[data-test="total-companies"]')).toBeVisible()
      await expect(page.locator('[data-test="total-opportunities"]')).toBeVisible()
      await expect(page.locator('[data-test="total-events"]')).toBeVisible()
    })

    test('doit afficher les graphiques et métriques', async ({ page }) => {
      // Vérifier la présence des graphiques
      await expect(page.locator('[data-test="users-chart"]')).toBeVisible()
      await expect(page.locator('[data-test="activity-chart"]')).toBeVisible()
      
      // Vérifier les métriques de croissance
      await expect(page.locator('[data-test="growth-metrics"]')).toBeVisible()
    })

    test('doit permettre les actions rapides', async ({ page }) => {
      // Vérifier les boutons d'actions rapides
      await expect(page.locator('button:has-text("Nouvel utilisateur")')).toBeVisible()
      await expect(page.locator('button:has-text("Nouvelle entreprise")')).toBeVisible()
      await expect(page.locator('button:has-text("Modérer contenu")')).toBeVisible()
      
      // Tester une action rapide
      await page.click('button:has-text("Modérer contenu")')
      await expect(page.locator('[data-test="moderation-panel"]')).toBeVisible()
    })
  })

  test.describe('Gestion des Utilisateurs', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Utilisateurs')
    })

    test('doit afficher la liste des utilisateurs', async ({ page }) => {
      await expect(page.locator('text=Gestion des Utilisateurs')).toBeVisible()
      
      // Vérifier le tableau des utilisateurs
      await expect(page.locator('[data-test="users-table"]')).toBeVisible()
      await expect(page.locator('th:has-text("Utilisateur")')).toBeVisible()
      await expect(page.locator('th:has-text("Email")')).toBeVisible()
      await expect(page.locator('th:has-text("Rôle")')).toBeVisible()
      await expect(page.locator('th:has-text("Statut")')).toBeVisible()
      await expect(page.locator('th:has-text("Actions")')).toBeVisible()
    })

    test('doit permettre de filtrer les utilisateurs', async ({ page }) => {
      // Utiliser le filtre par rôle
      await page.selectOption('select[name="roleFilter"]', 'admin')
      
      // Vérifier que seuls les admins sont affichés
      const roleChips = page.locator('[data-test="user-role-chip"]')
      const count = await roleChips.count()
      
      for (let i = 0; i < count; i++) {
        await expect(roleChips.nth(i)).toContainText('Admin')
      }
      
      // Réinitialiser le filtre
      await page.selectOption('select[name="roleFilter"]', 'all')
    })

    test('doit permettre de rechercher un utilisateur', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Rechercher"]')
      
      await searchInput.fill('admin@peva.test')
      await page.keyboard.press('Enter')
      
      // Vérifier que les résultats sont filtrés
      await expect(page.locator('text=admin@peva.test')).toBeVisible()
      
      // Effacer la recherche
      await searchInput.clear()
      await page.keyboard.press('Enter')
    })

    test('doit permettre de créer un nouvel utilisateur', async ({ page }) => {
      await page.click('button:has-text("Nouvel utilisateur")')
      
      // Vérifier l'ouverture du dialog
      await expect(page.locator('[data-test="user-dialog"]')).toBeVisible()
      
      // Remplir le formulaire
      await page.fill('input[name="firstName"]', 'Nouveau')
      await page.fill('input[name="lastName"]', 'Utilisateur')
      await page.fill('input[name="email"]', 'nouveau.utilisateur@peva.test')
      await page.selectOption('select[name="role"]', 'user')
      await page.fill('input[name="password"]', 'MotDePasse123!')
      
      // Créer l'utilisateur
      await page.click('button:has-text("Créer")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Utilisateur créé avec succès')).toBeVisible()
    })

    test('doit permettre de modifier un utilisateur', async ({ page }) => {
      // Cliquer sur modifier pour le premier utilisateur
      await page.click('[data-test="user-row"] >> nth=0 >> button[title="Modifier"]')
      
      // Vérifier l'ouverture du dialog de modification
      await expect(page.locator('[data-test="user-dialog"]')).toBeVisible()
      await expect(page.locator('text=Modifier l\'utilisateur')).toBeVisible()
      
      // Modifier le rôle
      await page.selectOption('select[name="role"]', 'moderator')
      
      // Sauvegarder
      await page.click('button:has-text("Modifier")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Utilisateur modifié avec succès')).toBeVisible()
    })

    test('doit permettre de suspendre/activer un utilisateur', async ({ page }) => {
      // Cliquer sur suspendre pour le premier utilisateur
      await page.click('[data-test="user-row"] >> nth=0 >> button[title="Suspendre"]')
      
      // Confirmer la suspension
      await page.click('button:has-text("Confirmer")')
      
      // Vérifier le changement de statut
      await expect(page.locator('[data-test="user-row"] >> nth=0 >> text=Suspendu')).toBeVisible()
      
      // Réactiver l'utilisateur
      await page.click('[data-test="user-row"] >> nth=0 >> button[title="Activer"]')
      await page.click('button:has-text("Confirmer")')
      
      // Vérifier le changement de statut
      await expect(page.locator('[data-test="user-row"] >> nth=0 >> text=Actif')).toBeVisible()
    })

    test('doit permettre de supprimer un utilisateur', async ({ page }) => {
      // Cliquer sur supprimer pour le dernier utilisateur
      const userRows = page.locator('[data-test="user-row"]')
      const lastIndex = await userRows.count() - 1
      
      await userRows.nth(lastIndex).locator('button[title="Supprimer"]').click()
      
      // Confirmer la suppression
      await page.click('button:has-text("Supprimer")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Utilisateur supprimé avec succès')).toBeVisible()
    })

    test('doit permettre d\'exporter les données utilisateurs', async ({ page }) => {
      // Cliquer sur exporter
      await page.click('button:has-text("Exporter")')
      
      // Vérifier le téléchargement (simulation)
      // Dans un vrai test, on vérifierait le téléchargement du fichier CSV
      await expect(page.locator('text=Export en cours')).toBeVisible()
    })
  })

  test.describe('Gestion des Entreprises', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Entreprises')
    })

    test('doit afficher la liste des entreprises', async ({ page }) => {
      await expect(page.locator('text=Gestion des Entreprises')).toBeVisible()
      
      // Vérifier le tableau des entreprises
      await expect(page.locator('[data-test="companies-table"]')).toBeVisible()
      await expect(page.locator('th:has-text("Entreprise")')).toBeVisible()
      await expect(page.locator('th:has-text("Secteur")')).toBeVisible()
      await expect(page.locator('th:has-text("Pays")')).toBeVisible()
      await expect(page.locator('th:has-text("Statut")')).toBeVisible()
    })

    test('doit permettre de créer une nouvelle entreprise', async ({ page }) => {
      await page.click('button:has-text("Nouvelle entreprise")')
      
      // Remplir le formulaire
      await page.fill('input[name="name"]', 'Nouvelle Entreprise Test')
      await page.fill('textarea[name="description"]', 'Description de l\'entreprise test')
      await page.selectOption('select[name="sector"]', 'energie_solaire')
      await page.selectOption('select[name="country"]', 'Burkina Faso')
      await page.selectOption('select[name="city"]', 'Ouagadougou')
      await page.fill('input[name="website"]', 'https://nouvelle-entreprise.bf')
      
      // Créer l'entreprise
      await page.click('button:has-text("Créer")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Entreprise créée avec succès')).toBeVisible()
    })

    test('doit permettre de valider/rejeter une entreprise', async ({ page }) => {
      // Filtrer par statut "En attente"
      await page.selectOption('select[name="statusFilter"]', 'pending')
      
      if (await page.locator('[data-test="company-row"]').count() > 0) {
        // Valider la première entreprise en attente
        await page.click('[data-test="company-row"] >> nth=0 >> button[title="Valider"]')
        await page.click('button:has-text("Valider")')
        
        // Vérifier le message de succès
        await expect(page.locator('text=Entreprise validée')).toBeVisible()
      }
    })
  })

  test.describe('Gestion des Opportunités', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Opportunités')
    })

    test('doit afficher la liste des opportunités', async ({ page }) => {
      await expect(page.locator('text=Gestion des Opportunités')).toBeVisible()
      
      // Vérifier les statistiques
      await expect(page.locator('[data-test="opportunities-stats"]')).toBeVisible()
      
      // Vérifier le tableau
      await expect(page.locator('[data-test="opportunities-table"]')).toBeVisible()
    })

    test('doit permettre de modérer les opportunités', async ({ page }) => {
      // Filtrer par statut "En révision"
      await page.selectOption('select[name="statusFilter"]', 'review')
      
      if (await page.locator('[data-test="opportunity-row"]').count() > 0) {
        // Approuver la première opportunité
        await page.click('[data-test="opportunity-row"] >> nth=0 >> button[title="Approuver"]')
        await page.click('button:has-text("Approuver")')
        
        // Vérifier le message de succès
        await expect(page.locator('text=Opportunité approuvée')).toBeVisible()
      }
    })
  })

  test.describe('Gestion des Ressources', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Ressources')
    })

    test('doit afficher la liste des ressources', async ({ page }) => {
      await expect(page.locator('text=Gestion des Ressources')).toBeVisible()
      
      // Vérifier les filtres
      await expect(page.locator('select[name="typeFilter"]')).toBeVisible()
      await expect(page.locator('select[name="categoryFilter"]')).toBeVisible()
      
      // Vérifier le tableau
      await expect(page.locator('[data-test="resources-table"]')).toBeVisible()
    })

    test('doit permettre de créer une nouvelle ressource', async ({ page }) => {
      await page.click('button:has-text("Nouvelle ressource")')
      
      // Remplir le formulaire
      await page.fill('input[name="title"]', 'Guide Test Admin')
      await page.selectOption('select[name="type"]', 'guide')
      await page.fill('textarea[name="description"]', 'Description du guide test')
      await page.fill('input[name="category"]', 'Énergie Solaire')
      await page.selectOption('select[name="level"]', 'beginner')
      await page.selectOption('select[name="format"]', 'pdf')
      await page.fill('input[name="file_url"]', 'https://example.com/guide.pdf')
      
      // Créer la ressource
      await page.click('button:has-text("Créer")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Ressource créée avec succès')).toBeVisible()
    })

    test('doit permettre de publier/dépublier une ressource', async ({ page }) => {
      // Publier la première ressource si elle est en brouillon
      const firstRow = page.locator('[data-test="resource-row"]').nth(0)
      const statusChip = firstRow.locator('[data-test="resource-status"]')
      
      if (await statusChip.textContent() === 'Brouillon') {
        await firstRow.locator('button[title="Publier"]').click()
        
        // Vérifier le changement de statut
        await expect(statusChip).toContainText('Publié')
      }
    })
  })

  test.describe('Gestion des Notifications', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Notifications')
    })

    test('doit afficher l\'interface de gestion des notifications', async ({ page }) => {
      await expect(page.locator('text=Gestion des Notifications')).toBeVisible()
      
      // Vérifier les onglets
      await expect(page.locator('text=Diffusion')).toBeVisible()
      await expect(page.locator('text=Historique')).toBeVisible()
      await expect(page.locator('text=Modèles')).toBeVisible()
    })

    test('doit permettre de créer une notification générale', async ({ page }) => {
      await page.click('button:has-text("Nouvelle notification")')
      
      // Remplir le formulaire
      await page.fill('input[name="title"]', 'Notification Test Admin')
      await page.fill('textarea[name="message"]', 'Message de test depuis l\'admin')
      await page.selectOption('select[name="type"]', 'info')
      await page.selectOption('select[name="audience"]', 'all')
      
      // Envoyer la notification
      await page.click('button:has-text("Envoyer")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Notification envoyée')).toBeVisible()
    })

    test('doit afficher l\'historique des notifications', async ({ page }) => {
      await page.click('text=Historique')
      
      // Vérifier l'affichage de l'historique
      await expect(page.locator('[data-test="notifications-history"]')).toBeVisible()
    })
  })

  test.describe('Paramètres Système', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Paramètres')
    })

    test('doit afficher tous les paramètres système', async ({ page }) => {
      await expect(page.locator('text=Paramètres Système')).toBeVisible()
      
      // Vérifier les sections de paramètres
      await expect(page.locator('text=Configuration Générale')).toBeVisible()
      await expect(page.locator('text=Sécurité')).toBeVisible()
      await expect(page.locator('text=Notifications')).toBeVisible()
      await expect(page.locator('text=Stockage et Fichiers')).toBeVisible()
      await expect(page.locator('text=Statistiques Système')).toBeVisible()
      await expect(page.locator('text=Maintenance')).toBeVisible()
      await expect(page.locator('text=Logs Système')).toBeVisible()
    })

    test('doit permettre de modifier les paramètres généraux', async ({ page }) => {
      // Modifier le nom du site
      await page.fill('input[name="site_name"]', 'PEVA - Test Admin')
      
      // Sauvegarder
      await page.click('button:has-text("Sauvegarder") >> nth=0')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Paramètres généraux sauvegardés')).toBeVisible()
    })

    test('doit permettre de modifier les paramètres de sécurité', async ({ page }) => {
      // Activer l'authentification à deux facteurs
      await page.check('input[name="enable_two_factor"]')
      
      // Modifier la longueur minimale du mot de passe
      await page.fill('input[name="password_min_length"]', '10')
      
      // Sauvegarder
      await page.click('button:has-text("Sauvegarder") >> nth=1')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Paramètres de sécurité sauvegardés')).toBeVisible()
    })

    test('doit afficher les statistiques système', async ({ page }) => {
      // Vérifier l'affichage des statistiques
      await expect(page.locator('text=Taille base de données')).toBeVisible()
      await expect(page.locator('text=Stockage utilisé')).toBeVisible()
      await expect(page.locator('text=Utilisateurs actifs')).toBeVisible()
      await expect(page.locator('text=Temps de fonctionnement')).toBeVisible()
    })

    test('doit permettre les actions de maintenance', async ({ page }) => {
      // Vider le cache
      await page.click('button:has-text("Vider le cache")')
      await expect(page.locator('text=Cache vidé avec succès')).toBeVisible()
      
      // Optimiser la base de données
      await page.click('button:has-text("Optimiser la base de données")')
      await expect(page.locator('text=Base de données optimisée')).toBeVisible()
      
      // Créer une sauvegarde
      await page.click('button:has-text("Créer une sauvegarde")')
      await expect(page.locator('text=Sauvegarde créée avec succès')).toBeVisible()
    })

    test('doit afficher et permettre de télécharger les logs', async ({ page }) => {
      // Vérifier l'affichage des logs
      await expect(page.locator('textarea[label="Logs récents"]')).toBeVisible()
      
      // Actualiser les logs
      await page.click('button:has-text("Actualiser les logs")')
      
      // Télécharger les logs
      await page.click('button:has-text("Télécharger les logs")')
      
      // Dans un vrai test, on vérifierait le téléchargement
    })

    test('doit permettre d\'activer le mode maintenance', async ({ page }) => {
      // Activer le mode maintenance
      await page.check('input[name="maintenance_mode"]')
      
      // Modifier le message de maintenance
      await page.fill('textarea[name="maintenance_message"]', 'Site en maintenance pour mise à jour')
      
      // Note: Dans un vrai test, on ne sauvegarderait pas vraiment le mode maintenance
      // car cela rendrait le site inaccessible
    })
  })

  test.describe('Sécurité et permissions admin', () => {
    test('doit empêcher l\'accès aux non-admins', async ({ page }) => {
      // Se déconnecter
      await page.click('[data-test="user-menu"]')
      await page.click('text=Se déconnecter')
      
      // Se connecter avec un utilisateur normal
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      // Essayer d'accéder à l'admin
      await page.goto('/admin/dashboard')
      
      // Vérifier la redirection
      await expect(page).not.toHaveURL('/admin/dashboard')
      await expect(page).toHaveURL('/')
    })

    test('doit permettre l\'accès aux super admins', async ({ page }) => {
      // Se déconnecter
      await page.click('[data-test="user-menu"]')
      await page.click('text=Se déconnecter')
      
      // Se connecter avec un super admin
      await page.goto('/login')
      await page.fill('input[name="email"]', 'superadmin@peva.test')
      await page.fill('input[name="password"]', 'SuperAdminPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      // Vérifier l'accès au dashboard admin
      await expect(page).toHaveURL('/admin/dashboard')
      await expect(page.locator('text=Panneau d\'Administration PEVA')).toBeVisible()
    })
  })
})
