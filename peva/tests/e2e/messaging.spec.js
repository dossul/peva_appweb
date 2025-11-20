import { test, expect } from '@playwright/test'

test.describe('Communication et Social', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avec un utilisateur standard
    await page.goto('/login')
    await page.fill('input[name="email"]', 'user.completed@peva.test')
    await page.fill('input[name="password"]', 'UserPassword123!')
    await page.click('button:has-text("Se connecter")')
    await expect(page).toHaveURL('/')
  })

  test.describe('Messages', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/messages')
    })

    test('doit afficher l\'interface de messagerie', async ({ page }) => {
      // Vérifier l'affichage de la page
      await expect(page.locator('text=Messages')).toBeVisible()
      
      // Vérifier la sidebar des conversations
      await expect(page.locator('[data-test="conversations-sidebar"]')).toBeVisible()
      await expect(page.locator('[data-test="conversations-list"]')).toBeVisible()
      
      // Vérifier la zone de chat principale
      await expect(page.locator('[data-test="chat-area"]')).toBeVisible()
    })

    test('doit afficher la liste des conversations', async ({ page }) => {
      // Vérifier la présence de conversations
      const conversations = page.locator('[data-test="conversation-item"]')
      await expect(conversations).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'une conversation
      const firstConversation = conversations.nth(0)
      await expect(firstConversation.locator('[data-test="contact-avatar"]')).toBeVisible()
      await expect(firstConversation.locator('[data-test="contact-name"]')).toBeVisible()
      await expect(firstConversation.locator('[data-test="last-message"]')).toBeVisible()
      await expect(firstConversation.locator('[data-test="message-time"]')).toBeVisible()
    })

    test('doit permettre de rechercher dans les conversations', async ({ page }) => {
      const searchInput = page.locator('[data-test="conversations-search"]')
      
      await searchInput.fill('SolarTech')
      
      // Vérifier que les résultats sont filtrés
      const conversations = page.locator('[data-test="conversation-item"]')
      const count = await conversations.count()
      
      if (count > 0) {
        const firstConversation = conversations.nth(0)
        const contactName = await firstConversation.locator('[data-test="contact-name"]').textContent()
        expect(contactName.toLowerCase()).toContain('solartech')
      }
      
      // Effacer la recherche
      await searchInput.clear()
    })

    test('doit ouvrir une conversation et afficher les messages', async ({ page }) => {
      // Cliquer sur la première conversation
      await page.click('[data-test="conversation-item"] >> nth=0')
      
      // Vérifier que la conversation s'ouvre
      await expect(page.locator('[data-test="chat-header"]')).toBeVisible()
      await expect(page.locator('[data-test="messages-container"]')).toBeVisible()
      await expect(page.locator('[data-test="message-input"]')).toBeVisible()
      
      // Vérifier la présence de messages
      const messages = page.locator('[data-test="message-bubble"]')
      await expect(messages).toHaveCountGreaterThan(0)
    })

    test('doit permettre d\'envoyer un message', async ({ page }) => {
      // Ouvrir une conversation
      await page.click('[data-test="conversation-item"] >> nth=0')
      
      const messageInput = page.locator('[data-test="message-input"]')
      const sendButton = page.locator('[data-test="send-button"]')
      
      // Taper un message
      await messageInput.fill('Bonjour, j\'aimerais en savoir plus sur vos services.')
      
      // Envoyer le message
      await sendButton.click()
      
      // Vérifier que le message apparaît dans la conversation
      await expect(page.locator('[data-test="message-bubble"]:last-child')).toContainText('j\'aimerais en savoir plus')
      
      // Vérifier que l'input est vidé
      await expect(messageInput).toHaveValue('')
    })

    test('doit permettre d\'envoyer un message avec Entrée', async ({ page }) => {
      await page.click('[data-test="conversation-item"] >> nth=0')
      
      const messageInput = page.locator('[data-test="message-input"]')
      
      await messageInput.fill('Message envoyé avec Entrée')
      await messageInput.press('Enter')
      
      // Vérifier que le message est envoyé
      await expect(page.locator('[data-test="message-bubble"]:last-child')).toContainText('Message envoyé avec Entrée')
    })

    test('doit afficher les statuts de lecture des messages', async ({ page }) => {
      await page.click('[data-test="conversation-item"] >> nth=0')
      
      // Vérifier les indicateurs de statut
      const messages = page.locator('[data-test="message-bubble"]')
      const lastMessage = messages.last()
      
      // Vérifier la présence d'un indicateur de statut (lu/non lu)
      await expect(lastMessage.locator('[data-test="message-status"]')).toBeVisible()
    })

    test('doit permettre de créer une nouvelle conversation', async ({ page }) => {
      await page.click('[data-test="new-conversation-button"]')
      
      // Vérifier l'ouverture du dialog
      await expect(page.locator('[data-test="new-conversation-dialog"]')).toBeVisible()
      
      // Rechercher un contact
      await page.fill('[data-test="contact-search"]', 'Green Farm')
      
      // Sélectionner un contact
      await page.click('[data-test="contact-result"] >> nth=0')
      
      // Écrire un message initial
      await page.fill('[data-test="initial-message"]', 'Bonjour, je souhaiterais discuter d\'une collaboration.')
      
      // Créer la conversation
      await page.click('button:has-text("Démarrer la conversation")')
      
      // Vérifier que la nouvelle conversation s'ouvre
      await expect(page.locator('[data-test="chat-header"]')).toBeVisible()
    })

    test('doit afficher les informations du contact', async ({ page }) => {
      await page.click('[data-test="conversation-item"] >> nth=0')
      
      // Cliquer sur les informations du contact
      await page.click('[data-test="contact-info-button"]')
      
      // Vérifier l'affichage des informations
      await expect(page.locator('[data-test="contact-info-panel"]')).toBeVisible()
      await expect(page.locator('[data-test="contact-profile"]')).toBeVisible()
      await expect(page.locator('[data-test="contact-actions"]')).toBeVisible()
    })

    test('doit permettre de joindre des fichiers', async ({ page }) => {
      await page.click('[data-test="conversation-item"] >> nth=0')
      
      // Cliquer sur le bouton de pièce jointe
      await page.click('[data-test="attachment-button"]')
      
      // Simuler la sélection d'un fichier
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'document.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('fake pdf content')
      })
      
      // Vérifier l'aperçu du fichier
      await expect(page.locator('[data-test="file-preview"]')).toBeVisible()
      
      // Envoyer le fichier
      await page.click('[data-test="send-file-button"]')
      
      // Vérifier que le fichier apparaît dans la conversation
      await expect(page.locator('[data-test="message-attachment"]')).toBeVisible()
    })

    test('doit marquer les messages comme lus', async ({ page }) => {
      // Vérifier les conversations non lues
      const unreadConversations = page.locator('[data-test="conversation-item"].unread')
      const unreadCount = await unreadConversations.count()
      
      if (unreadCount > 0) {
        // Ouvrir une conversation non lue
        await unreadConversations.nth(0).click()
        
        // Attendre un moment pour que les messages soient marqués comme lus
        await page.waitForTimeout(1000)
        
        // Vérifier que la conversation n'est plus marquée comme non lue
        await expect(unreadConversations.nth(0)).not.toHaveClass(/unread/)
      }
    })
  })

  test.describe('Connexions', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/connections')
    })

    test('doit afficher la page de gestion des connexions', async ({ page }) => {
      await expect(page.locator('text=Mes Connexions')).toBeVisible()
      
      // Vérifier les onglets
      await expect(page.locator('text=Mes Connexions')).toBeVisible()
      await expect(page.locator('text=Demandes reçues')).toBeVisible()
      await expect(page.locator('text=Demandes envoyées')).toBeVisible()
      
      // Vérifier les statistiques
      await expect(page.locator('[data-test="connections-stats"]')).toBeVisible()
    })

    test('doit afficher les connexions actives', async ({ page }) => {
      // Vérifier l'affichage des connexions
      const connections = page.locator('[data-test="connection-item"]')
      await expect(connections).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'une connexion
      const firstConnection = connections.nth(0)
      await expect(firstConnection.locator('[data-test="connection-avatar"]')).toBeVisible()
      await expect(firstConnection.locator('[data-test="connection-name"]')).toBeVisible()
      await expect(firstConnection.locator('[data-test="connection-sector"]')).toBeVisible()
      await expect(firstConnection.locator('[data-test="connection-actions"]')).toBeVisible()
    })

    test('doit permettre d\'envoyer un message depuis les connexions', async ({ page }) => {
      const connections = page.locator('[data-test="connection-item"]')
      
      if (await connections.count() > 0) {
        // Cliquer sur "Message" pour la première connexion
        await connections.nth(0).locator('button:has-text("Message")').click()
        
        // Vérifier la redirection vers la messagerie
        await expect(page).toHaveURL('/messages')
        await expect(page.locator('[data-test="chat-area"]')).toBeVisible()
      }
    })

    test('doit afficher les demandes reçues', async ({ page }) => {
      await page.click('text=Demandes reçues')
      
      // Vérifier l'affichage des demandes reçues
      const receivedRequests = page.locator('[data-test="received-request"]')
      
      if (await receivedRequests.count() > 0) {
        const firstRequest = receivedRequests.nth(0)
        
        // Vérifier les éléments d'une demande
        await expect(firstRequest.locator('[data-test="requester-info"]')).toBeVisible()
        await expect(firstRequest.locator('[data-test="request-message"]')).toBeVisible()
        await expect(firstRequest.locator('[data-test="request-actions"]')).toBeVisible()
      }
    })

    test('doit permettre d\'accepter une demande de connexion', async ({ page }) => {
      await page.click('text=Demandes reçues')
      
      const receivedRequests = page.locator('[data-test="received-request"]')
      
      if (await receivedRequests.count() > 0) {
        // Accepter la première demande
        await receivedRequests.nth(0).locator('button:has-text("Accepter")').click()
        
        // Vérifier le message de confirmation
        await expect(page.locator('text=Demande acceptée')).toBeVisible()
        
        // Vérifier que la demande disparaît de la liste
        const newCount = await receivedRequests.count()
        expect(newCount).toBeLessThan(1)
      }
    })

    test('doit permettre de refuser une demande de connexion', async ({ page }) => {
      await page.click('text=Demandes reçues')
      
      const receivedRequests = page.locator('[data-test="received-request"]')
      
      if (await receivedRequests.count() > 0) {
        // Refuser la première demande
        await receivedRequests.nth(0).locator('button:has-text("Refuser")').click()
        
        // Confirmer le refus
        await page.click('button:has-text("Confirmer")')
        
        // Vérifier le message de confirmation
        await expect(page.locator('text=Demande refusée')).toBeVisible()
      }
    })

    test('doit afficher les demandes envoyées', async ({ page }) => {
      await page.click('text=Demandes envoyées')
      
      // Vérifier l'affichage des demandes envoyées
      const sentRequests = page.locator('[data-test="sent-request"]')
      
      if (await sentRequests.count() > 0) {
        const firstRequest = sentRequests.nth(0)
        
        // Vérifier les éléments d'une demande envoyée
        await expect(firstRequest.locator('[data-test="recipient-info"]')).toBeVisible()
        await expect(firstRequest.locator('[data-test="request-status"]')).toBeVisible()
        await expect(firstRequest.locator('[data-test="request-date"]')).toBeVisible()
      }
    })

    test('doit permettre d\'annuler une demande envoyée', async ({ page }) => {
      await page.click('text=Demandes envoyées')
      
      const sentRequests = page.locator('[data-test="sent-request"]')
      
      if (await sentRequests.count() > 0) {
        // Chercher une demande en attente
        const pendingRequest = sentRequests.filter({ hasText: 'En attente' }).nth(0)
        
        if (await pendingRequest.count() > 0) {
          // Annuler la demande
          await pendingRequest.locator('button:has-text("Annuler")').click()
          
          // Confirmer l'annulation
          await page.click('button:has-text("Confirmer")')
          
          // Vérifier le message de confirmation
          await expect(page.locator('text=Demande annulée')).toBeVisible()
        }
      }
    })

    test('doit permettre de supprimer une connexion', async ({ page }) => {
      const connections = page.locator('[data-test="connection-item"]')
      
      if (await connections.count() > 0) {
        // Supprimer la première connexion
        await connections.nth(0).locator('button:has-text("Supprimer")').click()
        
        // Confirmer la suppression
        await page.click('button:has-text("Confirmer")')
        
        // Vérifier le message de confirmation
        await expect(page.locator('text=Connexion supprimée')).toBeVisible()
      }
    })

    test('doit filtrer les connexions par secteur', async ({ page }) => {
      // Utiliser le filtre par secteur
      await page.selectOption('[data-test="sector-filter"]', 'energie_solaire')
      
      // Vérifier que les connexions sont filtrées
      const connections = page.locator('[data-test="connection-item"]')
      const count = await connections.count()
      
      for (let i = 0; i < count; i++) {
        const sectorText = await connections.nth(i).locator('[data-test="connection-sector"]').textContent()
        expect(sectorText.toLowerCase()).toContain('solaire')
      }
      
      // Réinitialiser le filtre
      await page.selectOption('[data-test="sector-filter"]', 'all')
    })
  })

  test.describe('Forum', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forum')
    })

    test('doit afficher la page du forum', async ({ page }) => {
      await expect(page.locator('text=Forum PEVA')).toBeVisible()
      
      // Vérifier les statistiques du forum
      await expect(page.locator('[data-test="forum-stats"]')).toBeVisible()
      await expect(page.locator('text=Discussions actives')).toBeVisible()
      await expect(page.locator('text=Membres')).toBeVisible()
      
      // Vérifier les catégories
      await expect(page.locator('[data-test="forum-categories"]')).toBeVisible()
    })

    test('doit afficher les catégories de discussion', async ({ page }) => {
      const categories = page.locator('[data-test="category-card"]')
      await expect(categories).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'une catégorie
      const firstCategory = categories.nth(0)
      await expect(firstCategory.locator('[data-test="category-title"]')).toBeVisible()
      await expect(firstCategory.locator('[data-test="category-description"]')).toBeVisible()
      await expect(firstCategory.locator('[data-test="category-stats"]')).toBeVisible()
    })

    test('doit permettre de naviguer vers une catégorie', async ({ page }) => {
      // Cliquer sur la première catégorie
      await page.click('[data-test="category-card"] >> nth=0')
      
      // Vérifier la navigation vers la catégorie
      await expect(page).toHaveURL(/\/forum\/category\//)
      await expect(page.locator('[data-test="category-discussions"]')).toBeVisible()
    })

    test('doit afficher les discussions populaires', async ({ page }) => {
      const popularDiscussions = page.locator('[data-test="popular-discussion"]')
      await expect(popularDiscussions).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'une discussion
      const firstDiscussion = popularDiscussions.nth(0)
      await expect(firstDiscussion.locator('[data-test="discussion-title"]')).toBeVisible()
      await expect(firstDiscussion.locator('[data-test="discussion-author"]')).toBeVisible()
      await expect(firstDiscussion.locator('[data-test="discussion-stats"]')).toBeVisible()
    })

    test('doit permettre de créer un nouveau sujet', async ({ page }) => {
      await page.click('button:has-text("Nouveau sujet")')
      
      // Vérifier l'ouverture du dialog
      await expect(page.locator('[data-test="new-topic-dialog"]')).toBeVisible()
      
      // Remplir le formulaire
      await page.fill('input[name="title"]', 'Nouveau sujet de test')
      await page.selectOption('select[name="category"]', 'energie_solaire')
      await page.fill('textarea[name="content"]', 'Contenu du nouveau sujet de discussion...')
      await page.fill('input[name="tags"]', 'test, énergie, solaire')
      
      // Créer le sujet
      await page.click('button:has-text("Créer le sujet")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Sujet créé avec succès')).toBeVisible()
    })

    test('doit permettre de rechercher dans le forum', async ({ page }) => {
      const searchInput = page.locator('[data-test="forum-search"]')
      
      await searchInput.fill('énergie solaire')
      await page.keyboard.press('Enter')
      
      // Vérifier les résultats de recherche
      await expect(page.locator('[data-test="search-results"]')).toBeVisible()
    })

    test('doit afficher les membres actifs', async ({ page }) => {
      const activeMembers = page.locator('[data-test="active-member"]')
      await expect(activeMembers).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'un membre actif
      const firstMember = activeMembers.nth(0)
      await expect(firstMember.locator('[data-test="member-avatar"]')).toBeVisible()
      await expect(firstMember.locator('[data-test="member-name"]')).toBeVisible()
      await expect(firstMember.locator('[data-test="member-stats"]')).toBeVisible()
    })
  })

  test.describe('Groupes', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/groups')
    })

    test('doit afficher la page des groupes', async ({ page }) => {
      await expect(page.locator('text=Communautés PEVA')).toBeVisible()
      
      // Vérifier les statistiques
      await expect(page.locator('[data-test="groups-stats"]')).toBeVisible()
      
      // Vérifier les sections
      await expect(page.locator('text=Groupes recommandés')).toBeVisible()
      await expect(page.locator('text=Groupes par pays')).toBeVisible()
    })

    test('doit afficher les groupes recommandés', async ({ page }) => {
      const recommendedGroups = page.locator('[data-test="recommended-group"]')
      await expect(recommendedGroups).toHaveCountGreaterThan(0)
      
      // Vérifier les éléments d'un groupe
      const firstGroup = recommendedGroups.nth(0)
      await expect(firstGroup.locator('[data-test="group-avatar"]')).toBeVisible()
      await expect(firstGroup.locator('[data-test="group-name"]')).toBeVisible()
      await expect(firstGroup.locator('[data-test="group-description"]')).toBeVisible()
      await expect(firstGroup.locator('[data-test="group-stats"]')).toBeVisible()
    })

    test('doit permettre de rejoindre un groupe', async ({ page }) => {
      const recommendedGroups = page.locator('[data-test="recommended-group"]')
      
      if (await recommendedGroups.count() > 0) {
        // Rejoindre le premier groupe
        await recommendedGroups.nth(0).locator('button:has-text("Rejoindre")').click()
        
        // Vérifier le message de confirmation
        await expect(page.locator('text=Vous avez rejoint le groupe')).toBeVisible()
        
        // Vérifier que le bouton change
        await expect(recommendedGroups.nth(0).locator('button:has-text("Membre")')).toBeVisible()
      }
    })

    test('doit filtrer les groupes par pays', async ({ page }) => {
      // Utiliser le filtre par pays
      await page.selectOption('[data-test="country-filter"]', 'Burkina Faso')
      
      // Vérifier que les groupes sont filtrés
      const groups = page.locator('[data-test="group-card"]')
      const count = await groups.count()
      
      for (let i = 0; i < count; i++) {
        const locationText = await groups.nth(i).locator('[data-test="group-location"]').textContent()
        expect(locationText).toContain('Burkina Faso')
      }
      
      // Réinitialiser le filtre
      await page.selectOption('[data-test="country-filter"]', 'all')
    })

    test('doit permettre de créer un nouveau groupe', async ({ page }) => {
      await page.click('button:has-text("Créer un groupe")')
      
      // Vérifier l'ouverture du dialog
      await expect(page.locator('[data-test="new-group-dialog"]')).toBeVisible()
      
      // Remplir le formulaire
      await page.fill('input[name="name"]', 'Groupe Test PEVA')
      await page.fill('textarea[name="description"]', 'Description du groupe de test')
      await page.selectOption('select[name="category"]', 'energie_solaire')
      await page.selectOption('select[name="country"]', 'Burkina Faso')
      await page.selectOption('select[name="privacy"]', 'public')
      
      // Créer le groupe
      await page.click('button:has-text("Créer le groupe")')
      
      // Vérifier le message de succès
      await expect(page.locator('text=Groupe créé avec succès')).toBeVisible()
    })

    test('doit permettre de rechercher des groupes', async ({ page }) => {
      const searchInput = page.locator('[data-test="groups-search"]')
      
      await searchInput.fill('énergie')
      await page.keyboard.press('Enter')
      
      // Vérifier que les résultats sont filtrés
      const groups = page.locator('[data-test="group-card"]')
      const count = await groups.count()
      
      for (let i = 0; i < count; i++) {
        const groupText = await groups.nth(i).textContent()
        expect(groupText.toLowerCase()).toContain('énergie')
      }
      
      // Effacer la recherche
      await searchInput.clear()
      await page.keyboard.press('Enter')
    })
  })
})
