/**
 * Composable pour afficher des notifications snackbar
 * Simplifie l'utilisation des v-snackbar dans toute l'application
 */

import { ref } from 'vue'

// État global partagé
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
})

export function useSnackbar() {
  const show = (message, color = 'success', timeout = 3000) => {
    snackbar.value = {
      show: true,
      message,
      color,
      timeout
    }
  }

  const showSuccess = (message, timeout = 3000) => {
    show(message, 'success', timeout)
  }

  const showError = (message, timeout = 5000) => {
    show(message, 'error', timeout)
  }

  const showWarning = (message, timeout = 4000) => {
    show(message, 'warning', timeout)
  }

  const showInfo = (message, timeout = 3000) => {
    show(message, 'info', timeout)
  }

  const hide = () => {
    snackbar.value.show = false
  }

  return {
    snackbar,
    show,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hide
  }
}

