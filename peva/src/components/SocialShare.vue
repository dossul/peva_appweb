<template>
  <div class="social-share">
    <v-btn-group variant="outlined" density="compact">
      <v-btn
        size="small"
        color="#0077b5"
        @click="shareOnLinkedIn"
        prepend-icon="mdi-linkedin"
      >
        <span class="d-none d-sm-inline">LinkedIn</span>
      </v-btn>
      
      <v-btn
        size="small"
        color="#25D366"
        @click="shareOnWhatsApp"
        prepend-icon="mdi-whatsapp"
      >
        <span class="d-none d-sm-inline">WhatsApp</span>
      </v-btn>
      
      <v-btn
        size="small"
        color="#1877F2"
        @click="shareOnFacebook"
        prepend-icon="mdi-facebook"
      >
        <span class="d-none d-sm-inline">Facebook</span>
      </v-btn>
      
      <v-btn
        v-if="showCopyLink"
        size="small"
        @click="copyLink"
        prepend-icon="mdi-link-variant"
      >
        <span class="d-none d-sm-inline">Copier</span>
      </v-btn>
    </v-btn-group>
    
    <!-- Snackbar pour confirmation copie -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="2000"
      color="success"
      location="top"
    >
      Lien copié dans le presse-papiers!
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  showCopyLink: {
    type: Boolean,
    default: true
  }
})

const showSnackbar = ref(false)

const shareUrl = computed(() => {
  return props.url || window.location.href
})

const shareOnLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareOnWhatsApp = () => {
  const text = `${props.title}\n${props.description}\n${shareUrl.value}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    showSnackbar.value = true
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea')
    textArea.value = shareUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showSnackbar.value = true
  }
}
</script>

<style scoped>
.social-share {
  display: inline-block;
}

.v-btn {
  text-transform: none;
}
</style>
