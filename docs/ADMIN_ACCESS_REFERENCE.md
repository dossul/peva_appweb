# 🛡️ Référence des Accès Administrateur - PEVA

## 📋 Vue d'ensemble

Ce document recense tous les accès, routes et fonctionnalités réservés aux administrateurs de la plateforme PEVA.

---

## 🔐 Routes Admin (requiresAdmin: true)

### 1. **Dashboard Administrateur**
- **Route**: `/admin/dashboard`
- **Composant**: `AdminDashboardView.vue`
- **Description**: Tableau de bord principal avec statistiques, actions requises, gestion globale
- **Fonctionnalités**:
  - Vue d'ensemble des statistiques plateforme
  - Actions en attente de modération
  - Alertes et notifications admin
  - Raccourcis vers modules de gestion

### 2. **Gestion des Utilisateurs**
- **Route**: `/admin/users`
- **Composant**: `admin/AdminUsersView.vue`
- **Description**: CRUD complet des utilisateurs
- **Fonctionnalités**:
  - Liste tous les utilisateurs
  - Filtres et recherche
  - Modifier profils utilisateurs
  - Changer rôles (user, admin, superadmin)
  - Suspendre/activer comptes
  - Supprimer utilisateurs

### 3. **Modération de Contenu**
- **Route**: `/admin/moderation`
- **Composant**: `admin/AdminModerationView.vue`
- **Description**: Modération des contenus soumis
- **Fonctionnalités**:
  - Approuver/rejeter opportunités
  - Modérer événements
  - Valider ressources
  - Modérer témoignages
  - Gérer signalements
  - Historique des modérations

### 4. **Analytics & Rapports**
- **Route**: `/admin/analytics`
- **Composant**: `admin/AdminAnalyticsView.vue`
- **Description**: Statistiques avancées et rapports
- **Fonctionnalités**:
  - Graphiques d'utilisation
  - Rapports détaillés
  - Export de données
  - Métriques clés (KPIs)
  - Analyse des tendances

### 5. **Gestion des Pays**
- **Route**: `/admin/countries`
- **Composant**: `admin/AdminCountriesView.vue`
- **Description**: CRUD des pays disponibles
- **Fonctionnalités**:
  - Ajouter nouveaux pays
  - Modifier informations pays (nom, code ISO, drapeau)
  - Activer/désactiver pays
  - Gérer continents
  - Ordre d'affichage personnalisé

### 6. **Analytics Globales**
- **Route**: `/analytics`
- **Composant**: `AnalyticsView.vue`
- **Description**: Vue analytics avancée (admin uniquement)
- **Fonctionnalités**:
  - Dashboard analytics complet
  - Statistiques temps réel
  - Visualisations graphiques

---

## 🎯 Fonctionnalités Admin dans Composants

### **AppHeader.vue**
- Menu "Dashboard Admin" au lieu de "Mon Dashboard"
- Accès rapide à `/analytics` pour admins
- Badge/icône distinctif pour administrateurs

### **DashboardNavigation.vue**
- Item de navigation "Dashboard Admin" visible uniquement pour admins
- Lien direct vers `/admin/dashboard`

### **LandingView.vue**
- Modules marqués `adminOnly` cachés pour non-admins
- Vérification `authStore.isAdmin` avant navigation vers modules admin
- Section "Analytics" réservée aux admins

### **DashboardView.vue**
- Bouton "Dashboard Admin" affiché si `authStore.isAdmin`
- Redirection vers `/admin/dashboard`

---

## 🔄 Redirections Intelligentes

### **Après Connexion (LoginView.vue)**
```javascript
if (authStore.isAdmin) {
  router.push('/admin/dashboard')
} else if (authStore.hasCompletedOnboarding) {
  router.push('/')
} else {
  router.push('/onboarding')
}
```

### **Après Vérification Email**
```javascript
if (authStore.isAdmin) {
  router.push('/admin/dashboard')
} else if (authStore.hasCompletedOnboarding) {
  router.push('/')
} else {
  router.push('/onboarding')
}
```

### **Onboarding**
- Les admins **ne font pas l'onboarding**
- Redirection automatique vers `/admin/dashboard`

---

## 🛡️ Protection des Routes

### **Router Guard (router/index.js)**

```javascript
// Vérification authentification
if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  return next('/auth/login')
}

// Vérification droits admin
if (to.meta.requiresAdmin && !authStore.isAdmin) {
  return next('/') // Redirection vers accueil
}
```

### **Propriété `meta.requiresAdmin`**
Toutes les routes admin ont cette propriété:
```javascript
meta: { 
  requiresAuth: true,
  requiresAdmin: true,
  title: '...'
}
```

---

## 👤 Détection du Rôle Admin

### **Store Auth (stores/auth.js)**

```javascript
const isAdmin = computed(() => {
  const profileRole = user.value?.profile?.role
  const metadataRole = user.value?.user_metadata?.role
  
  return profileRole === 'admin' || 
         profileRole === 'superadmin' || 
         metadataRole === 'admin' || 
         metadataRole === 'superadmin'
})
```

### **Rôles Reconnus**
- `admin` - Administrateur standard
- `superadmin` - Super administrateur (tous les droits)

---

## 📊 Modules Plateforme avec Restriction Admin

### **LandingView - `platformModules`**

```javascript
{
  name: 'Analytics',
  description: 'Statistiques, KPIs et tableaux de bord avancés',
  icon: 'mdi-chart-line',
  color: 'red',
  route: '/analytics',
  requiresAuth: true,
  adminOnly: true  // ⚠️ ADMIN UNIQUEMENT
}
```

---

## 🔧 Services Admin

### **services/admin/index.js**

```javascript
// Vérifier si un utilisateur est admin
isAdmin(user) {
  return user && adminConfig.adminRoles.includes(user.role)
}
```

### **Configuration Admin**
```javascript
adminConfig = {
  adminRoles: ['admin', 'superadmin']
}
```

---

## 📝 Checklist Accès Admin

### ✅ **Routes Protégées**
- [x] `/admin/dashboard` - Dashboard principal
- [x] `/admin/users` - Gestion utilisateurs
- [x] `/admin/moderation` - Modération contenu
- [x] `/admin/analytics` - Analytics admin
- [x] `/admin/countries` - Gestion pays
- [x] `/analytics` - Analytics globales

### ✅ **Composants Admin**
- [x] `AdminDashboardView.vue`
- [x] `admin/AdminUsersView.vue`
- [x] `admin/AdminModerationView.vue`
- [x] `admin/AdminAnalyticsView.vue`
- [x] `admin/AdminCountriesView.vue`

### ✅ **Protections Actives**
- [x] Router guards vérifient `requiresAdmin`
- [x] Redirections automatiques si non-admin
- [x] Détection rôle multi-sources (profile + metadata)
- [x] Navigation adaptative selon rôle

---

## 🚀 Recommandations

### **Sécurité**
1. ✅ Routes protégées au niveau router
2. ✅ Vérifications supplémentaires dans composants
3. ⚠️ **TODO**: Ajouter politiques RLS Supabase pour chaque table
4. ⚠️ **TODO**: Vérifier permissions côté serveur pour actions critiques

### **UX Admin**
1. ✅ Dashboard centralisé
2. ✅ Navigation dédiée
3. ⚠️ **TODO**: Breadcrumbs dans vues admin
4. ⚠️ **TODO**: Logs d'actions admin

### **Fonctionnalités Manquantes**
1. 📌 Gestion des entreprises (Companies)
2. 📌 Gestion des secteurs d'activité
3. 📌 Gestion des ODD (SDGs)
4. 📌 Paramètres système globaux
5. 📌 Backup/Export base de données
6. 📌 Gestion des notifications push
7. 📌 Logs d'activité admin

---

## 📍 Accès Rapide Routes

| Route | Composant | Description |
|-------|-----------|-------------|
| `/admin/dashboard` | AdminDashboardView | Dashboard principal |
| `/admin/users` | AdminUsersView | Gestion utilisateurs |
| `/admin/moderation` | AdminModerationView | Modération contenu |
| `/admin/analytics` | AdminAnalyticsView | Analytics détaillées |
| `/admin/countries` | AdminCountriesView | Gestion pays |
| `/analytics` | AnalyticsView | Analytics globales |

---

## 🔑 Comment Devenir Admin

### **Base de données (pev_profiles)**
```sql
UPDATE pev_profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### **OU via Supabase Auth Metadata**
```javascript
await supabase.auth.admin.updateUserById(userId, {
  user_metadata: { role: 'admin' }
})
```

---

**Dernière mise à jour**: 2 janvier 2026
**Version**: 1.0
