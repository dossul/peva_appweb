import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // Charte graphique 2iE GreenHub
          primary: '#00B050', // Vert principal du logo
          secondary: '#808080', // Gris du logo
          accent: '#00A651', // Vert des barres colorées
          error: '#E31E24', // Rouge des barres
          warning: '#F58220', // Orange des barres
          info: '#0075C9', // Bleu des barres
          success: '#00B050', // Vert principal
          surface: '#ffffff',
          background: '#f8fafc',
          // Couleurs additionnelles
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'greenhub-yellow': '#FFC20E', // Jaune des barres
          'greenhub-dark': '#1a1a1a', // Noir du texte Hub
        },
      },
      dark: {
        colors: {
          // Version dark de la charte 2iE GreenHub
          primary: '#00D060', // Vert plus clair pour le mode sombre
          secondary: '#a0a0a0', // Gris plus clair
          accent: '#00C761', // Vert accent plus clair
          error: '#ff4444',
          warning: '#ff9933',
          info: '#3399ff',
          success: '#00D060',
          surface: '#1e293b',
          background: '#0f172a',
          'on-primary': '#000000',
          'on-secondary': '#000000',
          'greenhub-yellow': '#FFD93D',
          'greenhub-dark': '#e0e0e0',
        },
      },
    },
  },
})