// Export de tous les composants UI réutilisables
export { default as AppButton } from './AppButton.vue'
export { default as AppCard } from './AppCard.vue'
export { default as AppAlert } from './AppAlert.vue'

// Plugin pour enregistrer globalement les composants
export default {
  install(app) {
    // Import des composants
    const AppButton = () => import('./AppButton.vue')
    const AppCard = () => import('./AppCard.vue')
    const AppAlert = () => import('./AppAlert.vue')
    
    // Enregistrement global des composants
    app.component('AppButton', AppButton)
    app.component('AppCard', AppCard)
    app.component('AppAlert', AppAlert)
  }
}