<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center bg-red-lighten-5">
        <v-icon color="red-darken-2" class="mr-2">mdi-flag</v-icon>
        Signaler ce contenu
      </v-card-title>
      
      <v-card-text class="pa-6">
        <p class="text-body-2 text-grey mb-4">
          Vous signalez : <strong>{{ contentTitle }}</strong>
        </p>
        
        <v-select
          v-model="reason"
          :items="reasonOptions"
          label="Raison du signalement"
          variant="outlined"
          :rules="[v => !!v || 'Veuillez sélectionner une raison']"
          class="mb-3"
        />
        
        <v-textarea
          v-model="description"
          label="Description détaillée"
          placeholder="Décrivez le problème en détail..."
          variant="outlined"
          rows="4"
          :rules="[v => !!v || 'Veuillez décrire le problème']"
          counter
          maxlength="500"
        />
        
        <v-select
          v-model="priority"
          :items="priorityOptions"
          label="Niveau d'urgence"
          variant="outlined"
          class="mt-3"
        />
        
        <v-alert type="info" density="compact" class="mt-4">
          <p class="text-caption ma-0">
            Votre signalement sera examiné par notre équipe de modération. 
            Vous serez notifié par email une fois le signalement traité.
          </p>
        </v-alert>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="close" :disabled="submitting">
          Annuler
        </v-btn>
        <v-btn 
          color="error" 
          variant="flat" 
          @click="submitReport"
          :loading="submitting"
          :disabled="!isValid"
        >
          Envoyer le signalement
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { reportsService } from '@/services/admin/reportsService'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  targetType: {
    type: String,
    required: true,
    validator: (value) => [
      'opportunity', 'event', 'resource', 'forum_topic', 
      'forum_post', 'user', 'company', 'message'
    ].includes(value)
  },
  targetId: {
    type: String,
    required: true
  },
  contentTitle: {
    type: String,
    default: 'Contenu'
  }
})

const emit = defineEmits(['update:modelValue', 'reported'])

const authStore = useAuthStore()

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const reason = ref('')
const description = ref('')
const priority = ref('medium')
const submitting = ref(false)

const reasonOptions = [
  { title: 'Contenu inapproprié', value: 'inappropriate' },
  { title: 'Spam ou publicité', value: 'spam' },
  { title: 'Information fausse ou trompeuse', value: 'misinformation' },
  { title: 'Violation des droits d\'auteur', value: 'copyright' },
  { title: 'Harcèlement ou intimidation', value: 'harassment' },
  { title: 'Contenu offensant', value: 'offensive' },
  { title: 'Autre', value: 'other' }
]

const priorityOptions = [
  { title: 'Basse - Peut attendre', value: 'low' },
  { title: 'Moyenne - À traiter bientôt', value: 'medium' },
  { title: 'Haute - Urgent', value: 'high' },
  { title: 'Critique - Danger immédiat', value: 'critical' }
]

const isValid = computed(() => {
  return reason.value && description.value && description.value.length >= 10
})

const getReasonLabel = (value) => {
  const option = reasonOptions.find(o => o.value === value)
  return option ? option.title : value
}

const submitReport = async () => {
  if (!isValid.value || !authStore.isAuthenticated) return

  submitting.value = true
  try {
    const reportContent = `[${getReasonLabel(reason.value)}] ${description.value}`
    
    const result = await reportsService.createReport({
      content: reportContent,
      reporter_id: authStore.user.id,
      target_type: props.targetType,
      target_id: props.targetId,
      priority: priority.value
    })

    if (result.success) {
      emit('reported', result.data)
      close()
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Erreur signalement:', error)
    alert('Erreur lors de l\'envoi du signalement: ' + error.message)
  } finally {
    submitting.value = false
  }
}

const close = () => {
  dialog.value = false
  reason.value = ''
  description.value = ''
  priority.value = 'medium'
}

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    reason.value = ''
    description.value = ''
    priority.value = 'medium'
  }
})
</script>
