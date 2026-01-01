<template>
  <div class="social-share-buttons d-flex align-center ga-1">
    <v-tooltip text="Partager sur LinkedIn" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          @click="shareOnLinkedIn"
          color="blue-darken-3"
        >
          <v-icon>mdi-linkedin</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Partager sur WhatsApp" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          @click="shareOnWhatsApp"
          color="green-darken-1"
        >
          <v-icon>mdi-whatsapp</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Partager sur Facebook" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          @click="shareOnFacebook"
          color="blue"
        >
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Partager sur X (Twitter)" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          @click="shareOnTwitter"
          color="black"
        >
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Copier le lien" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          @click="copyLink"
          color="grey-darken-1"
        >
          <v-icon>mdi-link-variant</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- Snackbar confirmation copie -->
    <v-snackbar
      v-model="showCopySnackbar"
      :timeout="2000"
      color="success"
      location="bottom"
    >
      Lien copié dans le presse-papier !
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const showCopySnackbar = ref(false)

const shareOnLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareOnWhatsApp = () => {
  const text = `${props.title}\n\n${props.url}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareOnTwitter = () => {
  const text = props.title || props.description
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(props.url)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    showCopySnackbar.value = true
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    // Fallback pour navigateurs anciens
    const textArea = document.createElement('textarea')
    textArea.value = props.url
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      showCopySnackbar.value = true
    } catch (err) {
      console.error('Erreur fallback copie:', err)
    }
    document.body.removeChild(textArea)
  }
}
</script>

<style scoped>
.social-share-buttons {
  display: inline-flex;
}
</style>
