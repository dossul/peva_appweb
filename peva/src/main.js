import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './assets/css/main.css'

// Importer les composants UI
import UIComponents from './components/ui'

// Initialiser l'authentification au démarrage
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(UIComponents)

// Initialiser l'authentification
const authStore = useAuthStore()
authStore.initialize().catch(console.error)

app.mount('#app')
