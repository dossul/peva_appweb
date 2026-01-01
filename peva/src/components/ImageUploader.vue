<template>
  <div class="image-uploader">
    <div class="d-flex flex-column align-center">
      <!-- Avatar/Image preview -->
      <v-avatar 
        :size="avatarSize" 
        class="mb-4 position-relative"
        :color="previewUrl || currentImage ? undefined : 'grey-lighten-2'"
      >
        <v-img 
          v-if="previewUrl || currentImage" 
          :src="previewUrl || currentImage"
          cover
        />
        <v-icon v-else size="large" color="grey">mdi-image</v-icon>
        
        <!-- Badge supprimer -->
        <v-btn
          v-if="previewUrl || currentImage"
          icon
          size="x-small"
          color="red"
          class="delete-btn"
          @click="handleDelete"
        >
          <v-icon size="small">mdi-close</v-icon>
        </v-btn>
      </v-avatar>

      <!-- File input -->
      <v-file-input
        v-model="file"
        accept="image/*"
        :label="label"
        prepend-icon="mdi-camera"
        variant="outlined"
        density="compact"
        hide-details
        @change="handleFileChange"
        :disabled="uploading"
        class="mb-3"
        style="max-width: 300px;"
      />

      <!-- Upload button -->
      <v-btn
        v-if="file && !uploading"
        color="primary"
        @click="uploadImage"
        prepend-icon="mdi-upload"
        :disabled="!file"
      >
        Uploader l'image
      </v-btn>

      <!-- Loading -->
      <v-progress-circular
        v-if="uploading"
        indeterminate
        color="primary"
        class="mb-2"
      />

      <!-- Helper text -->
      <div class="text-caption text-grey-darken-1 text-center mt-2">
        {{ helperText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  currentImage: {
    type: String,
    default: null
  },
  bucketName: {
    type: String,
    default: 'peva-public'
  },
  folder: {
    type: String,
    default: 'avatars'
  },
  label: {
    type: String,
    default: 'Choisir une image'
  },
  avatarSize: {
    type: [Number, String],
    default: 120
  },
  maxSizeMB: {
    type: Number,
    default: 2
  }
})

const emit = defineEmits(['uploaded', 'deleted', 'error'])

const authStore = useAuthStore()
const file = ref(null)
const previewUrl = ref(null)
const uploading = ref(false)

const helperText = computed(() => {
  return `Format: JPG, PNG, GIF. Taille max: ${props.maxSizeMB}MB`
})

const handleFileChange = () => {
  if (!file.value) {
    previewUrl.value = null
    return
  }

  // Validation taille
  const sizeMB = file.value.size / (1024 * 1024)
  if (sizeMB > props.maxSizeMB) {
    emit('error', `La taille du fichier dépasse ${props.maxSizeMB}MB`)
    file.value = null
    return
  }

  // Validation type
  if (!file.value.type.startsWith('image/')) {
    emit('error', 'Le fichier doit être une image')
    file.value = null
    return
  }

  // Créer preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file.value)
}

const uploadImage = async () => {
  if (!file.value || !authStore.user) return

  try {
    uploading.value = true

    // Générer nom de fichier unique
    const fileExt = file.value.name.split('.').pop()
    const userId = authStore.user.id
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${props.folder}/${fileName}`

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from(props.bucketName)
      .upload(filePath, file.value, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Obtenir URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(props.bucketName)
      .getPublicUrl(filePath)

    // Émettre événement avec URL
    emit('uploaded', publicUrl)

    // Reset
    file.value = null
    previewUrl.value = null

  } catch (error) {
    console.error('Erreur upload image:', error)
    emit('error', error.message || 'Erreur lors de l\'upload')
  } finally {
    uploading.value = false
  }
}

const handleDelete = async () => {
  try {
    // Si URL actuelle existe, supprimer de Storage
    if (props.currentImage && props.currentImage.includes(props.bucketName)) {
      // Extraire le path du fichier depuis l'URL
      const urlParts = props.currentImage.split(`/${props.bucketName}/`)
      if (urlParts[1]) {
        const filePath = urlParts[1]
        
        const { error } = await supabase.storage
          .from(props.bucketName)
          .remove([filePath])

        if (error) console.error('Erreur suppression Storage:', error)
      }
    }

    // Reset local
    file.value = null
    previewUrl.value = null
    
    // Émettre événement
    emit('deleted')

  } catch (error) {
    console.error('Erreur suppression image:', error)
    emit('error', error.message || 'Erreur lors de la suppression')
  }
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
