/**
 * Services d'administration 2iEGreenHub
 * Point d'entrée centralisé pour tous les services admin
 */

// Import des services admin
export { userManagementService } from './userManagementService'
export { moderationService } from './moderationService'
export { forumService } from './forumService'
export { groupService } from './groupService'
export { eventsService } from './eventsService'
export { emailTemplatesService } from './emailTemplatesService'
export { reportsService } from './reportsService'
export { contentManagementService } from './contentManagementService'

// Service admin principal (existant)
export { adminService } from '../adminService'

/**
 * Configuration des services admin
 */
export const adminConfig = {
  // Pagination par défaut
  defaultPagination: {
    limit: 50,
    page: 1
  },
  
  // Rôles autorisés pour l'administration
  adminRoles: ['admin', 'super_admin'],
  
  // Types de contenu modérables
  moderatableContent: [
    'opportunities',
    'resources', 
    'events',
    'companies',
    'forum_topics',
    'forum_posts'
  ],
  
  // Statuts de modération
  moderationStatuses: {
    pending: 'En attente',
    in_review: 'En révision', 
    approved: 'Approuvé',
    published: 'Publié',
    rejected: 'Rejeté',
    draft: 'Brouillon'
  },
  
  // Actions de modération
  moderationActions: {
    approve: 'Approuver',
    reject: 'Rejeter',
    suspend: 'Suspendre',
    delete: 'Supprimer'
  }
}

/**
 * Utilitaires admin
 */
export const adminUtils = {
  /**
   * Vérifier si un utilisateur est admin
   * @param {Object} user - Utilisateur à vérifier
   * @returns {boolean}
   */
  isAdmin(user) {
    return user && adminConfig.adminRoles.includes(user.role)
  },
  
  /**
   * Vérifier si un utilisateur peut modérer
   * @param {Object} user - Utilisateur à vérifier
   * @returns {boolean}
   */
  canModerate(user) {
    return user && ['moderator', 'admin', 'super_admin'].includes(user.role)
  },
  
  /**
   * Formater une date pour l'affichage admin
   * @param {string} dateString - Date à formater
   * @returns {string}
   */
  formatAdminDate(dateString) {
    if (!dateString) return 'Non défini'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },
  
  /**
   * Obtenir la couleur d'un statut
   * @param {string} status - Statut
   * @returns {string}
   */
  getStatusColor(status) {
    const colors = {
      pending: 'warning',
      in_review: 'info',
      approved: 'success',
      published: 'success', 
      rejected: 'error',
      draft: 'grey',
      active: 'success',
      inactive: 'grey',
      suspended: 'error'
    }
    return colors[status] || 'grey'
  },
  
  /**
   * Obtenir l'icône d'un type de contenu
   * @param {string} contentType - Type de contenu
   * @returns {string}
   */
  getContentIcon(contentType) {
    const icons = {
      opportunities: 'mdi-briefcase',
      resources: 'mdi-file-document',
      events: 'mdi-calendar',
      companies: 'mdi-domain',
      forum_topics: 'mdi-forum',
      forum_posts: 'mdi-message',
      users: 'mdi-account-group',
      profiles: 'mdi-account'
    }
    return icons[contentType] || 'mdi-file'
  }
}

/**
 * Validation des données admin
 */
export const adminValidation = {
  /**
   * Valider un changement de rôle
   * @param {string} currentRole - Rôle actuel
   * @param {string} newRole - Nouveau rôle
   * @param {Object} adminUser - Utilisateur admin qui fait le changement
   * @returns {Object}
   */
  validateRoleChange(currentRole, newRole, adminUser) {
    const validRoles = ['user', 'moderator', 'admin', 'super_admin']
    
    if (!validRoles.includes(newRole)) {
      return { valid: false, error: 'Rôle invalide' }
    }
    
    // Seul un super_admin peut créer d'autres admins
    if (newRole === 'super_admin' && adminUser.role !== 'super_admin') {
      return { valid: false, error: 'Seul un super administrateur peut créer d\'autres super administrateurs' }
    }
    
    if (newRole === 'admin' && !['admin', 'super_admin'].includes(adminUser.role)) {
      return { valid: false, error: 'Seul un administrateur peut créer d\'autres administrateurs' }
    }
    
    return { valid: true }
  },
  
  /**
   * Valider une action de modération
   * @param {string} action - Action à valider
   * @param {string} contentType - Type de contenu
   * @param {Object} moderator - Modérateur
   * @returns {Object}
   */
  validateModerationAction(action, contentType, moderator) {
    if (!adminConfig.moderatableContent.includes(contentType)) {
      return { valid: false, error: 'Type de contenu non modérable' }
    }
    
    if (!adminUtils.canModerate(moderator)) {
      return { valid: false, error: 'Permissions insuffisantes pour modérer' }
    }
    
    const validActions = ['approve', 'reject', 'suspend', 'delete']
    if (!validActions.includes(action)) {
      return { valid: false, error: 'Action de modération invalide' }
    }
    
    return { valid: true }
  }
}
