/**
 * Service OneSignal pour les notifications push
 * Plateforme Digitale Stratégique pour l'Écosystème de l'Économie Verte en Afrique
 */

class OneSignalService {
  constructor() {
    this.isInitialized = false;
    this.appId = 'dd2d012b-502a-44f8-bc6c-9a2a2931916f';
    this.safariWebId = 'web.onesignal.auto.0919e572-6b9a-4fc1-8566-50f787b3e729';
  }

  /**
   * Initialise OneSignal (utilise la configuration globale du index.html)
   */
  async init() {
    if (this.isInitialized) {
      return;
    }

    try {
      // OneSignal est déjà initialisé dans index.html
      // On attend que les fonctions globales soient disponibles
      await this.waitForOneSignal();
      
      // Vérifier les permissions avant d'initialiser
      const permission = await this.checkNotificationPermission();
      if (permission === 'denied') {
        console.warn('Permissions de notification refusées par l\'utilisateur');
        this.isInitialized = true; // Marquer comme initialisé même sans permissions
        return;
      }
      
      // Écouter les événements d'abonnement
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('OneSignal service initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation OneSignal service:', error);
      // Marquer comme initialisé même en cas d'erreur pour éviter les boucles
      this.isInitialized = true;
    }
  }

  /**
   * Attend que OneSignal soit disponible
   */
  async waitForOneSignal() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 secondes maximum
      
      const checkOneSignal = () => {
        attempts++;
        
        // Vérifier s'il y a eu une erreur d'initialisation
        if (window.OneSignalError) {
          reject(new Error('OneSignal initialization failed: ' + window.OneSignalError.message));
          return;
        }
        
        // Vérifier si OneSignal est disponible
        if (window.subscribeToNotifications && window.getNotificationStatus) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('OneSignal timeout: Service non disponible après 5 secondes'));
        } else {
          setTimeout(checkOneSignal, 100);
        }
      };
      checkOneSignal();
    });
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    // Écouter les événements d'abonnement
    window.addEventListener('oneSignalSubscribed', (event) => {
      console.log('Utilisateur abonné:', event.detail);
      // Ici vous pouvez envoyer l'info au backend Supabase
    });

    window.addEventListener('oneSignalUnsubscribed', (event) => {
      console.log('Utilisateur désabonné:', event.detail);
      // Ici vous pouvez mettre à jour le backend Supabase
    });
  }

  /**
   * Charge le SDK OneSignal via CDN
   */
  loadOneSignalSDK() {
    return new Promise((resolve, reject) => {
      if (window.OneSignal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Demande la permission pour les notifications
   */
  async requestPermission() {
    try {
      if (!window.subscribeToNotifications) {
        throw new Error('OneSignal n\'est pas initialisé');
      }

      await window.subscribeToNotifications();
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  /**
   * Obtient l'ID du joueur (utilisateur)
   */
  async getPlayerId() {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve) => {
      window.OneSignal.push(function() {
        window.OneSignal.getUserId(function(userId) {
          resolve(userId);
        });
      });
    });
  }

  /**
   * Définit des tags pour l'utilisateur
   */
  async setUserTags(tags) {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve) => {
      window.OneSignal.push(function() {
        window.OneSignal.sendTags(tags, function(tagsSent) {
          resolve(tagsSent);
        });
      });
    });
  }

  /**
   * Envoie une notification locale
   */
  async sendLocalNotification(title, message, data = {}) {
    if (!this.isInitialized) {
      await this.init();
    }

    // Vérifier si les notifications sont supportées
    if (!('Notification' in window)) {
      console.warn('Ce navigateur ne supporte pas les notifications');
      return;
    }

    // Vérifier la permission
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        data: data
      });
    }
  }

  /**
   * Configure les événements OneSignal
   */
  setupEventListeners() {
    if (!this.isInitialized) {
      return;
    }

    try {
      // Événement de souscription (API moderne)
      window.OneSignal.User.addEventListener('subscriptionChanged', function(isSubscribed) {
        console.log('Statut de souscription changé:', isSubscribed);
      });

      // Événement de notification affichée
      window.OneSignal.Notifications.addEventListener('foregroundWillDisplay', function(event) {
        console.log('Notification affichée:', event);
      });

      // Événement de clic sur notification
      window.OneSignal.Notifications.addEventListener('click', function(event) {
        console.log('Notification cliquée:', event);
      });
    } catch (error) {
      console.error('Erreur lors de la configuration des écouteurs OneSignal:', error);
    }
  }

  /**
   * Vérifie si l'utilisateur est abonné
   */
  async isSubscribed() {
    try {
      if (!window.getNotificationStatus) {
        return false;
      }
      
      const status = window.getNotificationStatus();
      return status.optedIn || false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      return false;
    }
  }

  /**
   * Envoie une notification de test
   */
  async sendTestNotification() {
    try {
      if (!window.sendTestNotification) {
        throw new Error('Fonction de test non disponible');
      }
      
      await window.sendTestNotification();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test:', error);
      return false;
    }
  }

  /**
   * Obtient le statut des notifications
   */
  getStatus() {
    try {
      if (!window.getNotificationStatus) {
        return { optedIn: false, permission: 'default' };
      }
      
      return window.getNotificationStatus();
    } catch (error) {
      console.error('Erreur lors de l\'obtention du statut:', error);
      return { optedIn: false, permission: 'default' };
    }
  }

  /**
   * Méthode d'abonnement (alias pour requestPermission)
   */
  async subscribe() {
    return await this.requestPermission();
  }

  /**
   * Notifications pour l'économie verte
   */
  async sendGreenEconomyNotification(type, data) {
    const notifications = {
      'new_opportunity': {
        title: '🌱 Nouvelle Opportunité Verte',
        message: `Une nouvelle opportunité dans ${data.sector} est disponible`
      },
      'project_update': {
        title: '📊 Mise à jour de Projet',
        message: `Votre projet ${data.projectName} a été mis à jour`
      },
      'community_event': {
        title: '🤝 Événement Communautaire',
        message: `Nouvel événement: ${data.eventName}`
      },
      'impact_milestone': {
        title: '🎯 Objectif Atteint',
        message: `Félicitations! Vous avez atteint ${data.milestone}`
      },
      'funding_alert': {
        title: '💰 Alerte Financement',
        message: `Nouveau financement disponible: ${data.fundingName}`
      }
    };

    const notification = notifications[type];
    if (notification) {
      await this.sendLocalNotification(notification.title, notification.message, data);
    }
  }

  /**
   * Vérifier les permissions de notification
   */
  async checkNotificationPermission() {
    try {
      if ('Notification' in window) {
        return Notification.permission;
      }
      return 'default';
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return 'denied';
    }
  }

  /**
   * Demander les permissions de notification de manière sécurisée
   */
  async requestNotificationPermission() {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission;
      }
      return Notification.permission;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return 'denied';
    }
  }

  /**
   * Écouter les notifications reçues
   */
  onNotificationReceived(callback) {
    if (!this.isInitialized) {
      console.warn('OneSignal service non initialisé');
      return;
    }

    try {
      // Écouter les notifications via OneSignal (API moderne)
      if (window.OneSignal) {
        window.OneSignal.Notifications.addEventListener('click', callback);
        window.OneSignal.Notifications.addEventListener('foregroundWillDisplay', callback);
      }
    } catch (error) {
      console.error('Erreur lors de l\'écoute des notifications:', error);
    }
  }
}

// Instance singleton
const oneSignalService = new OneSignalService();

export default oneSignalService;