<template>
  <v-card :class="cardClass" :elevation="elevation">
    <v-card-text class="pa-6">
      <v-row align="center">
        <v-col cols="12" :md="compact ? 12 : 8">
          <h3 class="text-h6 font-weight-bold mb-2">
            <v-icon :color="scoreColor" class="mr-2">{{ scoreIcon }}</v-icon>
            Score RSE Global
          </h3>
          <p class="text-body-2 text-grey">
            <slot name="subtitle">
              Année {{ fiscalYear }} • 
              <v-chip :color="statusColor" size="small" class="ml-2">
                {{ statusLabel }}
              </v-chip>
            </slot>
          </p>
        </v-col>
        <v-col cols="12" :md="compact ? 12 : 4" class="text-center">
          <div class="score-circle mx-auto" :style="scoreCircleStyle">
            <div class="score-value" :style="{ color: scoreColor }">{{ score }}</div>
            <div class="score-label">/ 100</div>
          </div>
          <div v-if="showRank" class="text-caption mt-2 text-grey">
            {{ rankLabel }}
          </div>
        </v-col>
      </v-row>

      <!-- Détails des critères (optionnel) -->
      <v-expand-transition>
        <div v-if="showDetails && details">
          <v-divider class="my-4" />
          <v-row dense>
            <v-col v-for="criterion in criteriaList" :key="criterion.key" cols="12" sm="6">
              <div class="d-flex align-center mb-2">
                <v-icon :color="criterion.color" size="small" class="mr-2">
                  {{ criterion.icon }}
                </v-icon>
                <span class="text-caption">{{ criterion.label }}</span>
                <v-spacer />
                <v-chip :color="criterion.color" size="x-small" variant="flat">
                  {{ criterion.value }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>

      <!-- Actions -->
      <v-card-actions v-if="showActions" class="px-0 pt-4">
        <v-btn
          variant="text"
          color="primary"
          size="small"
          @click="$emit('view-details')"
        >
          <v-icon start>mdi-eye</v-icon>
          Voir le détail
        </v-btn>
        <v-spacer />
        <v-btn
          variant="text"
          :color="showDetails ? 'primary' : 'grey'"
          size="small"
          @click="showDetails = !showDetails"
        >
          <v-icon>{{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  fiscalYear: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'published',
    validator: (value) => ['draft', 'submitted', 'validated', 'published'].includes(value)
  },
  details: {
    type: Object,
    default: null
  },
  compact: {
    type: Boolean,
    default: false
  },
  elevation: {
    type: Number,
    default: 2
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showRank: {
    type: Boolean,
    default: false
  },
  rank: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['view-details'])

const showDetails = ref(false)

// Computed properties
const scoreColor = computed(() => {
  if (props.score >= 80) return '#4CAF50' // Vert
  if (props.score >= 60) return '#8BC34A' // Vert clair
  if (props.score >= 40) return '#FFC107' // Orange
  return '#FF5722' // Rouge
})

const scoreIcon = computed(() => {
  if (props.score >= 80) return 'mdi-emoticon-happy'
  if (props.score >= 60) return 'mdi-emoticon'
  if (props.score >= 40) return 'mdi-emoticon-neutral'
  return 'mdi-emoticon-sad'
})

const scoreCircleStyle = computed(() => ({
  borderColor: scoreColor.value
}))

const cardClass = computed(() => {
  if (props.score >= 80) return 'gradient-card-green'
  if (props.score >= 60) return 'gradient-card-blue'
  if (props.score >= 40) return 'gradient-card-orange'
  return 'gradient-card-red'
})

const statusColor = computed(() => {
  const colors = {
    draft: 'grey',
    submitted: 'blue',
    validated: 'green',
    published: 'success'
  }
  return colors[props.status] || 'grey'
})

const statusLabel = computed(() => {
  const labels = {
    draft: 'Brouillon',
    submitted: 'Soumis',
    validated: 'Validé',
    published: 'Publié'
  }
  return labels[props.status] || props.status
})

const rankLabel = computed(() => {
  if (!props.rank) return ''
  const suffix = props.rank === 1 ? 'er' : 'ème'
  return `${props.rank}${suffix} sur ${props.rank * 2}` // Exemple
})

const criteriaList = computed(() => {
  if (!props.details) return []
  
  return [
    {
      key: 'cdi',
      label: 'Emploi stable (CDI)',
      icon: 'mdi-account-tie',
      color: 'purple',
      value: `${props.details.cdi_percentage || 0}%`
    },
    {
      key: 'local',
      label: 'Achats locaux',
      icon: 'mdi-handshake',
      color: 'teal',
      value: `${props.details.local_purchases_percentage || 0}%`
    },
    {
      key: 'solar',
      label: 'Énergie solaire',
      icon: 'mdi-solar-power',
      color: 'orange',
      value: `${props.details.solar_percentage || 0}%`
    },
    {
      key: 'waste',
      label: 'Valorisation déchets',
      icon: 'mdi-recycle',
      color: 'green',
      value: `${props.details.waste_recovery_percentage || 0}%`
    },
    {
      key: 'carbon',
      label: 'Empreinte carbone',
      icon: 'mdi-molecule-co2',
      color: 'blue',
      value: `${props.details.carbon_total_tco2eq || 0} tCO2eq`
    },
    {
      key: 'sdg',
      label: 'Contribution ODD',
      icon: 'mdi-earth',
      color: 'indigo',
      value: `${props.details.sdg_contributions?.length || 0} ODD`
    }
  ]
})
</script>

<style scoped>
.gradient-card-green {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
}

.gradient-card-blue {
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
  color: white;
}

.gradient-card-orange {
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
  color: white;
}

.gradient-card-red {
  background: linear-gradient(135deg, #F44336 0%, #FF5722 100%);
  color: white;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 4px solid;
  transition: transform 0.3s ease;
}

.score-circle:hover {
  transform: scale(1.05);
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.score-label {
  font-size: 0.875rem;
  color: #888;
}
</style>

