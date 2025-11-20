<template>
  <v-alert
    v-if="modelValue"
    :class="alertClasses"
    :type="type"
    :variant="variant"
    :closable="closable"
    :icon="computedIcon"
    :color="computedColor"
    :border="border"
    :rounded="rounded"
    v-bind="$attrs"
    @click:close="handleClose"
  >
    <!-- Titre de l'alerte -->
    <template v-if="title" #title>
      <div class="peva-alert__title">{{ title }}</div>
    </template>

    <!-- Contenu principal -->
    <div class="peva-alert__content">
      <slot>{{ text }}</slot>
    </div>

    <!-- Actions personnalisées -->
    <template v-if="$slots.actions" #append>
      <div class="peva-alert__actions">
        <slot name="actions" />
      </div>
    </template>
  </v-alert>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
  },
  variant: {
    type: String,
    default: 'tonal',
    validator: (value) => ['flat', 'tonal', 'outlined', 'text', 'elevated'].includes(value)
  },
  title: {
    type: String,
    default: null
  },
  text: {
    type: String,
    default: null
  },
  icon: {
    type: [String, Boolean],
    default: null
  },
  color: {
    type: String,
    default: null
  },
  closable: {
    type: Boolean,
    default: false
  },
  border: {
    type: [Boolean, String],
    default: false
  },
  rounded: {
    type: [Boolean, String],
    default: 'lg'
  },
  pevaStyle: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'modern', 'minimal', 'bordered', 'gradient'].includes(value)
  },
  autoClose: {
    type: [Boolean, Number],
    default: false
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

// Classes CSS pour l'alerte
const alertClasses = computed(() => {
  const classes = ['peva-alert']
  
  if (props.pevaStyle !== 'default') {
    classes.push(`peva-alert--${props.pevaStyle}`)
  }
  
  if (props.persistent) {
    classes.push('peva-alert--persistent')
  }
  
  return classes
})

// Icône calculée selon le type
const computedIcon = computed(() => {
  if (props.icon === false) return false
  if (props.icon) return props.icon
  
  const iconMap = {
    success: 'mdi-check-circle',
    info: 'mdi-information',
    warning: 'mdi-alert',
    error: 'mdi-alert-circle'
  }
  
  return iconMap[props.type] || 'mdi-information'
})

// Couleur calculée
const computedColor = computed(() => {
  if (props.color) return props.color
  return props.type
})

// Gestion de la fermeture
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Auto-fermeture
if (props.autoClose && typeof props.autoClose === 'number') {
  setTimeout(() => {
    if (props.modelValue) {
      handleClose()
    }
  }, props.autoClose)
}
</script>

<style scoped>
.peva-alert {
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.peva-alert--modern {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.peva-alert--minimal {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 8px 0;
}

.peva-alert--bordered {
  border: 2px solid currentColor;
  background: rgba(var(--v-theme-surface), 0.8);
}

.peva-alert--gradient.peva-alert--success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.peva-alert--gradient.peva-alert--info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.peva-alert--gradient.peva-alert--warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.peva-alert--gradient.peva-alert--error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.peva-alert--persistent {
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-bottom: 0;
  border-radius: 0;
}

.peva-alert__title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
  color: rgb(var(--v-theme-on-surface));
}

.peva-alert__content {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface-variant));
}

.peva-alert__actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  align-items: center;
}

/* Animations */
.peva-alert {
  animation: slideInDown 0.4s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styles pour les différents types */
.peva-alert.v-alert--variant-tonal.v-alert--type-success {
  background-color: rgba(var(--v-theme-success), 0.12);
}

.peva-alert.v-alert--variant-tonal.v-alert--type-info {
  background-color: rgba(var(--v-theme-info), 0.12);
}

.peva-alert.v-alert--variant-tonal.v-alert--type-warning {
  background-color: rgba(var(--v-theme-warning), 0.12);
}

.peva-alert.v-alert--variant-tonal.v-alert--type-error {
  background-color: rgba(var(--v-theme-error), 0.12);
}

/* Responsive */
@media (max-width: 600px) {
  .peva-alert {
    margin-bottom: 12px;
  }
  
  .peva-alert__title {
    font-size: 0.9rem;
  }
  
  .peva-alert__content {
    font-size: 0.8rem;
  }
  
  .peva-alert__actions {
    margin-top: 8px;
    gap: 6px;
  }
}

/* Hover effects */
.peva-alert--modern:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Focus styles pour l'accessibilité */
.peva-alert:focus-within {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
</style>