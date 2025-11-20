/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-', // Important pour la cohabitation avec Vuetify
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charte graphique 2iE GreenHub
        primary: {
          50: '#e6f7ed',
          100: '#b3e6cc',
          200: '#80d6aa',
          300: '#4dc588',
          400: '#26b86d',
          500: '#00B050', // Couleur principale du logo
          600: '#009944',
          700: '#008038',
          800: '#00662c',
          900: '#004d20',
        },
        secondary: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#8f8f8f',
          500: '#808080', // Gris du logo
          600: '#6b6b6b',
          700: '#565656',
          800: '#404040',
          900: '#2b2b2b',
        },
        // Couleurs des barres du logo
        greenhub: {
          red: '#E31E24',
          orange: '#F58220',
          yellow: '#FFC20E',
          green: '#00A651',
          blue: '#0075C9',
          dark: '#1a1a1a',
        },
      },
      backgroundColor: {
        'greenhub-gradient': 'linear-gradient(135deg, #00B050 0%, #00A651 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}