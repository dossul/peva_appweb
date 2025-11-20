# Intégration OneSignal - PEVA

## Configuration Actuelle

### Scripts Intégrés
Les scripts OneSignal ont été ajoutés dans `index.html` :
- SDK OneSignal v16
- Configuration avec App ID: `dd2d012b-502a-44f8-bc6c-9a2a2931916f`
- Safari Web ID: `web.onesignal.auto.0919e572-6b9a-4fc1-8566-50f787b3e729`
- Support localhost pour développement

### Service OneSignal
Fichier: `src/services/oneSignalService.js`
- Classe singleton pour gérer OneSignal
- Méthodes d'initialisation et de gestion des permissions
- Gestion des tags utilisateur
- Envoi de notifications personnalisées

### Composant NotificationManager
Fichier: `src/components/NotificationManager.vue`
- Interface utilisateur pour les notifications
- Menu déroulant avec compteur de notifications
- Dialogue de paramètres des notifications
- Types de notifications supportés: event, opportunity, message, system

## Utilisation

### 1. Initialisation Automatique
OneSignal s'initialise automatiquement au chargement de la page.

### 2. Demande de Permission
```javascript
import oneSignalService from '@/services/oneSignalService'

// Demander la permission pour les notifications push
await oneSignalService.requestPermission()
```

### 3. Envoi de Notifications
```javascript
// Via le NotificationManager
notificationManager.value.addNotification({
  type: 'opportunity', // event, opportunity, message, system
  title: 'Titre de la notification',
  message: 'Message de la notification'
})

// Via OneSignal directement
oneSignalService.sendGreenEconomyNotification('opportunity', {
  sector: 'Agriculture',
  location: 'Sénégal',
  investment: '500K€'
})
```

### 4. Gestion des Tags Utilisateur
```javascript
// Définir des tags pour cibler les notifications
oneSignalService.setUserTags({
  sector: 'renewable_energy',
  location: 'senegal',
  role: 'investor'
})
```

## Types de Notifications

1. **event** - Événements communautaires
2. **opportunity** - Opportunités d'investissement
3. **message** - Messages privés
4. **system** - Notifications système

## Composants Mis à Jour

- `DashboardViewClean.vue` - Utilise NotificationManager
- `NotificationTester.vue` - Composant de test des notifications

## Notes de Développement

### Erreur "Can only be used on: http://localhost"

Cette erreur est **normale et attendue** en développement local. OneSignal a des restrictions de sécurité :

- **En développement** : OneSignal fonctionne uniquement sur `http://localhost` (pas sur `127.0.0.1` ou autres)
- **En production** : OneSignal nécessite obligatoirement HTTPS avec un certificat SSL valide

### Solutions pour le développement

1. **Port spécifique** : OneSignal est configuré pour `http://localhost:5173` par défaut
   - Si Vite utilise le port 5174 (port 5173 occupé), l'erreur "Can only be used on: http://localhost:5173" apparaîtra
   - **Solution** : Libérer le port 5173 ou configurer Vite pour utiliser le port 5173

2. **Service Workers créés** : Les fichiers `OneSignalSDKWorker.js` et `OneSignalSDKUpdaterWorker.js` sont disponibles

3. **Configuration actuelle** :
   ```javascript
   allowLocalhostAsSecureOrigin: true,
   serviceWorkerParam: { scope: '/' },
   path: '/OneSignalSDKWorker.js'
   ```

### Pour la production

- Déployer sur un serveur HTTPS
- Configurer le domaine dans le dashboard OneSignal
- Les notifications push fonctionneront parfaitement

### Autres notes

- Les notifications push nécessitent l'autorisation de l'utilisateur
- Le service worker OneSignal est géré automatiquement

## Prochaines Étapes

1. Configurer les segments utilisateur dans le dashboard OneSignal
2. Créer des templates de notifications personnalisés
3. Intégrer avec l'API backend pour les notifications automatiques
4. Ajouter l'analytics des notifications
5. Configurer les notifications programmées