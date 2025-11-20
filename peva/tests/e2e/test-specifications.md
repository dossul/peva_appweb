# Tests E2E PEVA - Spécifications Complètes

## 🎯 Objectif
Tests End-to-End complets pour valider tous les formulaires, boutons, liens et fonctionnalités de la plateforme PEVA avec intégration Supabase.

## 📋 Structure des Tests

### 1. AUTHENTIFICATION ET ONBOARDING

#### 1.1 Inscription (SignUpView)
- [ ] **Formulaire d'inscription**
  - Validation des champs requis (nom, prénom, email, mot de passe)
  - Validation format email
  - Validation force du mot de passe
  - Vérification unicité email
  - Bouton "S'inscrire" fonctionnel
  - Lien "Déjà un compte ? Se connecter"

- [ ] **Après inscription**
  - Redirection vers page de vérification email
  - Email de confirmation envoyé
  - Profil créé dans Supabase

#### 1.2 Connexion (LoginView)
- [ ] **Formulaire de connexion**
  - Champs email et mot de passe
  - Bouton "Se connecter" fonctionnel
  - Lien "Mot de passe oublié ?"
  - Lien "Pas encore de compte ? S'inscrire"
  - Connexion OAuth (Google, LinkedIn)

- [ ] **Redirections après connexion**
  - Admin → `/admin/dashboard`
  - Utilisateur avec onboarding complété → `/`
  - Utilisateur sans onboarding → `/onboarding`

#### 1.3 Onboarding (OnboardingView)
- [ ] **Étapes d'onboarding**
  - Étape 1 : Informations personnelles
  - Étape 2 : Informations professionnelles
  - Étape 3 : Préférences et intérêts
  - Navigation entre étapes (Précédent/Suivant)
  - Bouton "Terminer" final

- [ ] **Validation et sauvegarde**
  - Sauvegarde progressive des données
  - Marquage onboarding_completed = true
  - Redirection vers page d'accueil

### 2. NAVIGATION ET PAGES PRINCIPALES

#### 2.1 Page d'accueil (LandingView)
- [ ] **Header et navigation**
  - Logo PEVA cliquable
  - Menu principal fonctionnel
  - Boutons connexion/inscription (non connecté)
  - Menu utilisateur (connecté)

- [ ] **Contenu principal**
  - Hero banner avec statistiques
  - Sections de présentation
  - Boutons d'action principaux
  - Footer avec liens

#### 2.2 Carte Interactive (MapView)
- [ ] **Carte Leaflet**
  - Affichage de la carte
  - Marqueurs d'entreprises
  - Popups interactives
  - Filtres par secteur/pays/taille

- [ ] **Actions dans les popups**
  - Bouton "Voir la fiche complète" → Dialog
  - Bouton "Contacter" → Redirection messages
  - Bouton "Se connecter" → Dialog connexion

- [ ] **Navigation entre vues**
  - Bouton GRILLE → `/directory`
  - Bouton LISTE → `/directory`
  - Bouton CARTE (actif)

#### 2.3 Annuaire (DirectoryView)
- [ ] **Modes d'affichage**
  - Mode grille fonctionnel
  - Mode liste fonctionnel
  - Basculement entre modes

- [ ] **Filtres et recherche**
  - Recherche par nom
  - Filtres par type, pays, secteur
  - Réinitialisation des filtres

- [ ] **Actions sur les profils**
  - Bouton "Connecter" → Dialog
  - Bouton "Message" → Redirection
  - Clic sur profil → Page détail

### 3. OPPORTUNITÉS ET MARKETPLACE

#### 3.1 Liste des opportunités (OpportunitiesView)
- [ ] **Affichage et filtres**
  - Liste des opportunités
  - Filtres par type, secteur, localisation
  - Recherche textuelle
  - Pagination

- [ ] **Actions sur opportunités**
  - Bouton "Voir détails" → Page détail
  - Bouton "Postuler" → Formulaire
  - Bouton "Favoris" → Sauvegarde

#### 3.2 Création d'opportunité (CreateOpportunityView)
- [ ] **Processus en 3 étapes**
  - Étape 1 : Informations de base
  - Étape 2 : Détails spécifiques
  - Étape 3 : Critères et publication

- [ ] **Validation et sauvegarde**
  - Validation de chaque étape
  - Sauvegarde brouillon
  - Publication finale
  - Redirection après création

### 4. ÉVÉNEMENTS

#### 4.1 Calendrier d'événements (EventsView)
- [ ] **Affichage calendrier**
  - Vue mensuelle
  - Navigation entre mois
  - Événements affichés

- [ ] **Filtres et actions**
  - Filtres par type, format
  - Bouton "Créer événement" → Dialog
  - Clic sur événement → Détails

#### 4.2 Création d'événement (CreateEventView)
- [ ] **Formulaire complet**
  - Informations de base
  - Date, heure, lieu
  - Type et format
  - Inscription et tarifs

- [ ] **Validation et publication**
  - Validation des champs
  - Sauvegarde en base
  - Notifications aux participants

### 5. RESSOURCES ET CONNAISSANCES

#### 5.1 Bibliothèque (ResourcesView)
- [ ] **Navigation et filtres**
  - Filtres par type, secteur, niveau
  - Recherche textuelle
  - Tri par popularité/date

- [ ] **Actions sur ressources**
  - Bouton "Télécharger" → Download
  - Bouton "Voir détails" → Page détail
  - Bouton "Proposer ressource" → Formulaire

#### 5.2 Soumission de ressource (SubmitResourceView)
- [ ] **Formulaire de soumission**
  - Informations de la ressource
  - Upload de fichier
  - Catégorisation
  - Validation et soumission

### 6. COMMUNICATION ET SOCIAL

#### 6.1 Messages (MessagesView)
- [ ] **Interface de chat**
  - Liste des conversations
  - Zone de chat principale
  - Envoi de messages
  - Statuts de lecture

- [ ] **Fonctionnalités**
  - Recherche dans conversations
  - Création nouvelle conversation
  - Pièces jointes

#### 6.2 Connexions (ConnectionsView)
- [ ] **Gestion des connexions**
  - Onglet "Mes connexions"
  - Onglet "Demandes reçues"
  - Onglet "Demandes envoyées"

- [ ] **Actions sur connexions**
  - Accepter/Refuser demandes
  - Envoyer message
  - Supprimer connexion

#### 6.3 Forum (ForumView)
- [ ] **Navigation forum**
  - Catégories de discussion
  - Sujets par catégorie
  - Recherche dans forum

- [ ] **Participation**
  - Création nouveau sujet
  - Réponse aux sujets
  - Modération contenu

### 7. PROFIL UTILISATEUR

#### 7.1 Profil personnel (ProfileView)
- [ ] **Affichage profil**
  - Informations personnelles
  - Activités récentes
  - Statistiques

- [ ] **Modification profil**
  - Édition informations
  - Upload avatar
  - Sauvegarde modifications

### 8. ADMINISTRATION

#### 8.1 Dashboard Admin (AdminDashboardView)
- [ ] **Accès sécurisé**
  - Vérification rôle admin
  - Redirection non-admin

- [ ] **Statistiques et actions**
  - Affichage statistiques
  - Actions rapides
  - Alertes et notifications

#### 8.2 Gestion Utilisateurs (AdminUsersManager)
- [ ] **CRUD Utilisateurs**
  - Liste des utilisateurs
  - Création nouvel utilisateur
  - Modification utilisateur
  - Suspension/Activation
  - Suppression utilisateur

- [ ] **Filtres et recherche**
  - Recherche par nom/email
  - Filtres par rôle, statut
  - Export des données

#### 8.3 Gestion Entreprises (AdminCompaniesManager)
- [ ] **CRUD Entreprises**
  - Liste des entreprises
  - Création entreprise
  - Modification entreprise
  - Publication/Suspension
  - Suppression entreprise

#### 8.4 Gestion Opportunités (AdminOpportunitiesManager)
- [ ] **CRUD Opportunités**
  - Liste des opportunités
  - Validation/Modération
  - Modification opportunité
  - Publication/Suspension

#### 8.5 Gestion Événements (AdminEventsManager)
- [ ] **CRUD Événements**
  - Liste des événements
  - Création événement
  - Gestion participants
  - Annulation événement

#### 8.6 Gestion Ressources (AdminResourcesManager)
- [ ] **CRUD Ressources**
  - Liste des ressources
  - Validation soumissions
  - Publication ressources
  - Statistiques téléchargements

#### 8.7 Notifications (AdminNotificationsManager)
- [ ] **Système notifications**
  - Création notification
  - Diffusion générale
  - Historique envois
  - Statistiques lecture

#### 8.8 Paramètres Système (AdminSystemSettings)
- [ ] **Configuration**
  - Paramètres généraux
  - Sécurité
  - Notifications
  - Maintenance

### 9. INTÉGRATIONS ET SERVICES

#### 9.1 Supabase Integration
- [ ] **Authentification**
  - Connexion/Déconnexion
  - Gestion sessions
  - Récupération mot de passe

- [ ] **Base de données**
  - CRUD operations
  - RLS policies
  - Relations entre tables

- [ ] **Storage**
  - Upload fichiers
  - Gestion quotas
  - Sécurité accès

#### 9.2 Notifications Temps Réel
- [ ] **OneSignal**
  - Initialisation service
  - Permissions navigateur
  - Envoi notifications push

- [ ] **Notifications in-app**
  - Réception temps réel
  - Marquage lu/non-lu
  - Compteur notifications

#### 9.3 Gestion Fichiers
- [ ] **Upload et stockage**
  - Validation types fichiers
  - Vérification tailles
  - Stockage sécurisé

- [ ] **Téléchargement**
  - URLs signées
  - Contrôle accès
  - Logs d'accès

### 10. RESPONSIVE ET PERFORMANCE

#### 10.1 Responsive Design
- [ ] **Mobile (< 768px)**
  - Navigation mobile
  - Formulaires adaptés
  - Boutons tactiles

- [ ] **Tablet (768px - 1024px)**
  - Layout adaptatif
  - Grilles responsives

- [ ] **Desktop (> 1024px)**
  - Pleine fonctionnalité
  - Optimisation espace

#### 10.2 Performance
- [ ] **Temps de chargement**
  - Pages < 3 secondes
  - Lazy loading images
  - Code splitting

- [ ] **Optimisations**
  - Cache navigateur
  - Compression assets
  - CDN utilisation

### 11. SÉCURITÉ ET VALIDATION

#### 11.1 Validation Formulaires
- [ ] **Validation côté client**
  - Champs requis
  - Formats (email, téléphone)
  - Longueurs min/max

- [ ] **Validation côté serveur**
  - Sanitisation données
  - Validation métier
  - Gestion erreurs

#### 11.2 Sécurité
- [ ] **Authentification**
  - Sessions sécurisées
  - Timeout automatique
  - Protection CSRF

- [ ] **Autorisation**
  - Contrôle accès pages
  - Permissions par rôle
  - RLS Supabase

### 12. TESTS DE RÉGRESSION

#### 12.1 Workflows Complets
- [ ] **Parcours utilisateur nouveau**
  - Inscription → Onboarding → Utilisation
  - Création profil complet
  - Première connexion

- [ ] **Parcours utilisateur existant**
  - Connexion → Dashboard → Actions
  - Mise à jour profil
  - Utilisation fonctionnalités

- [ ] **Parcours administrateur**
  - Connexion admin → Dashboard
  - Gestion utilisateurs
  - Configuration système

#### 12.2 Intégrations Critiques
- [ ] **Supabase**
  - Connexion base données
  - Authentification
  - Storage fichiers

- [ ] **Services externes**
  - OneSignal notifications
  - Email SMTP
  - APIs tierces

## 🔧 Configuration Tests

### Environnements
- **Développement** : localhost:5173
- **Staging** : staging.peva.africa
- **Production** : peva.africa

### Données de test
- Utilisateurs test avec différents rôles
- Entreprises et opportunités test
- Fichiers test pour uploads

### Outils
- **Playwright** : Framework E2E
- **Supabase Test** : Base de données test
- **CI/CD** : Intégration continue

## 📊 Métriques de Succès

- ✅ **100% des formulaires** validés et fonctionnels
- ✅ **100% des boutons et liens** testés
- ✅ **Toutes les redirections** vérifiées
- ✅ **Intégration Supabase** complète
- ✅ **Responsive** sur tous devices
- ✅ **Performance** optimale
- ✅ **Sécurité** renforcée
