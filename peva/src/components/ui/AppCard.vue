<template>
  <v-card
    :class="cardClasses"
    :elevation="computedElevation"
    :variant="variant"
    :color="color"
    :rounded="rounded"
    v-bind="$attrs"
  >
    <!-- En-tête de la carte -->
    <v-card-title v-if="title || $slots.title" :class="titleClasses">
      <slot name="title">
        <div class="tw-flex tw-items-center tw-gap-3">
          <v-icon v-if="titleIcon" :icon="titleIcon" :color="titleIconColor" />
          <span>{{ title }}</span>
        </div>
      </slot>
      
      <!-- Actions dans le titre -->
      <template v-if="$slots.actions">
        <v-spacer />
        <div class="tw-flex tw-items-center tw-gap-2">
          <slot name="actions" />
        </div>
      </template>
    </v-card-title>

    <!-- Sous-titre -->
    <v-card-subtitle v-if="subtitle || $slots.subtitle" class="peva-card__subtitle">
      <slot name="subtitle">{{ subtitle }}</slot>
    </v-card-subtitle>

    <!-- Contenu principal -->
    <v-card-text v-if="$slots.default" :class="contentClasses">
      <slot />
    </v-card-text>

    <!-- Actions de la carte -->
    <v-card-actions v-if="$slots.cardActions" class="peva-card__actions">
      <slot name="cardActions" />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  titleIcon: {
    type: String,
    default: null
  },
  titleIconColor: {
    type: String,
    default: 'primary'
  },
  variant: {
    type: String,
    default: 'elevated',
    validator: (value) => ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'].includes(value)
  },
  color: {
    type: String,
    default: null
  },
  elevation: {
    type: [Number, String],
    default: null
  },
  rounded: {
    type: [Boolean, String],
    default: 'lg'
  },
  pevaStyle: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'gradient', 'bordered', 'glass', 'success', 'warning', 'error', 'info'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  }
})

// Classes CSS pour la carte
const cardClasses = computed(() => {
  const classes = ['peva-card']
  
  if (props.pevaStyle !== 'default') {
    classes.push(`peva-card--${props.pevaStyle}`)
  }
  
  if (props.hover) {
    classes.push('peva-card--hover')
  }
  
  if (props.loading) {
    classes.push('peva-card--loading')
  }
  
  return classes
})

// Classes pour le titre
const titleClasses = computed(() => {
  const classes = ['peva-card__title']
  
  if (props.pevaStyle === 'gradient') {
    classes.push('peva-card__title--gradient')
  }
  
  return classes
})

// Classes pour le contenu
const contentClasses = computed(() => {
  const classes = ['peva-card__content']
  
  if (props.noPadding) {
    classes.push('peva-card__content--no-padding')
  }
  
  return classes
})

// Élévation calculée
const computedElevation = computed(() => {
  if (props.elevation !== null) {
    return props.elevation
  }
  
  switch (props.pevaStyle) {
    case 'glass':
      return 0
    case 'bordered':
      return 1
    default:
      return 2
  }
})
</script>

<style scoped>
.peva-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.peva-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.peva-card--gradient {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.05) 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.peva-card--bordered {
  border: 2px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-surface), 0.8);
}

.peva-card--glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.peva-card--success {
  border-left: 4px solid rgb(var(--v-theme-success));
  background: rgba(var(--v-theme-success), 0.05);
}

.peva-card--warning {
  border-left: 4px solid rgb(var(--v-theme-warning));
  background: rgba(var(--v-theme-warning), 0.05);
}

.peva-card--error {
  border-left: 4px solid rgb(var(--v-theme-error));
  background: rgba(var(--v-theme-error), 0.05);
}

.peva-card--info {
  border-left: 4px solid rgb(var(--v-theme-info));
  background: rgba(var(--v-theme-info), 0.05);
}

.peva-card--loading {
  position: relative;
  overflow: hidden;
}

.peva-card--loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgb(var(--v-theme-primary)), transparent);
  animation: loading 2s infinite;
  z-index: 1;
}

@keyframes loading {
  0% { left: -100%; }
  100% { left: 100%; }
}

.peva-card__title {
  font-weight: 600;
  font-size: 1.25rem;
  color: rgb(var(--v-theme-on-surface));
  padding: 16px 16px 8px 16px;
}

.peva-card__title--gradient {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.peva-card__subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.875rem;
  padding: 0 16px 8px 16px;
}

.peva-card__content {
  padding: 16px;
}

.peva-card__content--no-padding {
  padding: 0;
}

.peva-card__actions {
  padding: 8px 16px 16px 16px;
  gap: 8px;
}

/* Styles responsives */
@media (max-width: 600px) {
  .peva-card__title {
    font-size: 1.125rem;
    padding: 12px 12px 6px 12px;
  }
  
  .peva-card__subtitle {
    padding: 0 12px 6px 12px;
  }
  
  .peva-card__content {
    padding: 12px;
  }
  
  .peva-card__actions {
    padding: 6px 12px 12px 12px;
  }
}

/* Animation d'apparition */
.peva-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>