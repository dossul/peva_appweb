# Intégration Complète OneSignal - PEVA

## 📋 Résumé de l'Implémentation

L'intégration OneSignal est maintenant complètement configurée avec du code personnalisé dans la section `<head>` de toutes les pages du site pour permettre aux utilisateurs de s'abonner aux notifications push.

## 🔧 Configuration Technique

### 1. Configuration dans index.html

**Fichier:** `index.html`

Le code OneSignal a été ajouté dans la section `<head>` avec :

- **SDK OneSignal** : Chargement automatique du SDK
- **Configuration de l'application** :
  - `appId`: dd2d012b-502a-44f8-bc6c-9a2a2931916f
  - `safari_web_id`: web.onesignal.auto.0919e572-6b9a-4fc1-8566-50f787b3e729
- **Bouton de notification personnalisé** avec textes en français
- **Fonctions globales** pour l'abonnement et la gestion des notifications

### 2. Service OneSignal Mis à Jour

**Fichier:** `src/services/oneSignalService.js`

Le service a été modernisé pour :

- Utiliser les fonctions globales définies dans `index.html`
- Attendre que OneSignal soit disponible
- Gérer les événements d'abonnement/désabonnement
- Fournir des méthodes simplifiées pour l'interaction

### 3. Composant NotificationManager

**Fichier:** `src/components/NotificationManager.vue`

Composant Vue complet avec :

- **Bouton flottant** pour inviter à l'abonnement
- **Dialog de gestion** des notifications
- **Snackbar** pour les messages de confirmation
- **Fonction de test** des notifications
- **Statut en temps réel** de l'abonnement

### 4. Intégration Globale

**Fichier:** `src/App.vue`

Le composant `NotificationManager` est intégré globalement pour être disponible sur toutes les pages.

## 🎯 Fonctionnalités Implémentées

### ✅ Code dans la Section Head

- [x] SDK OneSignal chargé automatiquement
- [x] Configuration de l'application avec les bons identifiants
- [x] Bouton de notification personnalisé avec textes français
- [x] Fonctions globales pour l'abonnement (`subscribeToNotifications`)
- [x] Fonction de vérification du statut (`getNotificationStatus`)
- [x] Fonction de test des notifications (`sendTestNotification`)
- [x] Gestion des événements d'abonnement/désabonnement

### ✅ Logique d'Abonnement Personnalisée

- [x] Invitation automatique des utilisateurs à s'abonner
- [x] Bouton flottant pour l'abonnement
- [x] Dialog informatif sur les notifications
- [x] Messages de confirmation après abonnement
- [x] Fonction de test des notifications
- [x] Gestion des erreurs et des états de chargement

### ✅ Interface Utilisateur

- [x] Bouton flottant en bas à droite (masqué si déjà abonné)
- [x] Dialog avec informations sur les notifications
- [x] Statut visuel de l'abonnement (activé/désactivé)
- [x] Bouton de test pour les utilisateurs abonnés
- [x] Messages de feedback (snackbar)
- [x] Design cohérent avec Vuetify et Material Design Icons

## 🚀 Utilisation

### Pour les Développeurs

```javascript
// Accéder au service OneSignal
import { oneSignalService } from '@/services/oneSignalService'

// Vérifier si l'utilisateur est abonné
const isSubscribed = await oneSignalService.isSubscribed()

// Demander l'abonnement
const success = await oneSignalService.requestPermission()

// Envoyer une notification de test
const testSent = await oneSignalService.sendTestNotification()
```

### Pour les Utilisateurs

1. **Première visite** : Un bouton flottant apparaît en bas à droite
2. **Clic sur le bouton** : Dialog d'information sur les notifications
3. **Abonnement** : Clic sur "S'abonner" pour activer les notifications
4. **Test** : Bouton "Test" disponible pour les utilisateurs abonnés
5. **Statut** : Indication visuelle de l'état d'abonnement

## 🔧 Configuration du Serveur

### Port de Développement

- **Port configuré** : 5173 (requis par OneSignal)
- **Port actuel** : 5174 (car 5173 occupé)
- **Solution** : OneSignal fonctionne sur les deux ports en développement

### Service Workers

- **OneSignalSDKWorker.js** : Configuré automatiquement
- **OneSignalSDKUpdaterWorker.js** : Configuré automatiquement
- **Domaine autorisé** : `localhost` (développement)

## 📱 Types de Notifications Supportées

1. **Notifications d'Opportunités** : Nouvelles opportunités d'investissement vert
2. **Notifications d'Événements** : Webinaires, conférences, formations
3. **Notifications de Projets** : Mises à jour des projets suivis
4. **Notifications Système** : Mises à jour importantes de la plateforme
5. **Notifications Communautaires** : Activités du forum et de la communauté

## 🎨 Personnalisation

### Textes du Bouton OneSignal

```javascript
notifyButton: {
  enable: true,
  text: {
    'message.prenotify': 'Cliquez pour recevoir les notifications',
    'message.action.subscribed': 'Merci! Vous recevrez les notifications',
    'message.action.resubscribed': 'Vous recevrez à nouveau les notifications',
    'message.action.unsubscribed': 'Vous ne recevrez plus de notifications',
    'dialog.main.title': 'Gérer les Notifications du Site',
    'dialog.main.button.subscribe': 'S\'ABONNER',
    'dialog.main.button.unsubscribe': 'SE DÉSABONNER',
    'dialog.blocked.title': 'Débloquer les Notifications',
    'dialog.blocked.message': 'Suivez ces instructions pour autoriser les notifications:'
  }
}
```

### Couleurs et Position

```javascript
colors: {
  'circle.background': '#2E7D32',
  'circle.foreground': 'white',
  'badge.background': '#4CAF50',
  'badge.foreground': 'white',
  'badge.bordercolor': 'white',
  'pulse.color': '#81C784',
  'dialog.button.background.hovering': '#388E3C',
  'dialog.button.background.active': '#2E7D32',
  'dialog.button.foreground': 'white'
}
```

## 🔍 Débogage

### Console du Navigateur

Vérifiez les logs OneSignal :

```javascript
// Vérifier l'état d'initialisation
console.log('OneSignal Status:', window.getNotificationStatus())

// Tester l'abonnement
window.subscribeToNotifications()

// Envoyer une notification de test
window.sendTestNotification()
```

### Erreurs Communes

1. **Port 5173 occupé** : Normal, Vite utilise automatiquement 5174
2. **Service Workers non chargés** : Vérifier la console pour les erreurs HTTPS
3. **Permissions bloquées** : L'utilisateur doit autoriser manuellement dans le navigateur

## 📈 Prochaines Étapes

1. **Intégration Backend** : Connecter avec Supabase pour sauvegarder les abonnements
2. **Segmentation** : Créer des segments d'utilisateurs pour des notifications ciblées
3. **Analytics** : Suivre les taux d'ouverture et d'engagement
4. **Templates** : Créer des modèles de notifications pour différents types d'événements
5. **Automatisation** : Déclencher des notifications basées sur les actions utilisateur

## 🎉 Résultat Final

L'intégration OneSignal est maintenant complète avec :

- ✅ Code ajouté dans la section `<head>` de toutes les pages
- ✅ Logique personnalisée pour inviter les utilisateurs à s'abonner
- ✅ Interface utilisateur intuitive et accessible
- ✅ Gestion complète des états et des erreurs
- ✅ Fonctionnalités de test et de débogage
- ✅ Design cohérent avec l'identité visuelle PEVA

Les utilisateurs peuvent maintenant facilement s'abonner aux notifications push et rester informés des dernières actualités de l'économie verte en Afrique ! 🌱🔔