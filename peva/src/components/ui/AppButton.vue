<template>
  <v-btn
    :class="buttonClasses"
    :color="computedColor"
    :variant="computedVariant"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :block="block"
    :rounded="rounded"
    v-bind="$attrs"
    @click="handleClick"
  >
    <template v-if="prependIcon" #prepend>
      <v-icon :icon="prependIcon" />
    </template>
    
    <slot />
    
    <template v-if="appendIcon" #append>
      <v-icon :icon="appendIcon" />
    </template>
  </v-btn>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'elevated',
    validator: (value) => ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: [Boolean, String],
    default: true
  },
  prependIcon: {
    type: String,
    default: null
  },
  appendIcon: {
    type: String,
    default: null
  },
  pevaStyle: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'error', 'info', 'gradient'].includes(value)
  }
})

const emit = defineEmits(['click'])

// Classes CSS personnalisées pour les styles PEVA
const buttonClasses = computed(() => {
  const classes = ['peva-btn']
  
  if (props.pevaStyle !== 'default') {
    classes.push(`peva-btn--${props.pevaStyle}`)
  }
  
  return classes
})

// Couleur calculée basée sur le style PEVA
const computedColor = computed(() => {
  const styleColorMap = {
    success: 'success',
    warning: 'warning', 
    error: 'error',
    info: 'info',
    gradient: 'primary'
  }
  
  return styleColorMap[props.pevaStyle] || props.color
})

// Variant calculé
const computedVariant = computed(() => {
  if (props.pevaStyle === 'gradient') {
    return 'elevated'
  }
  return props.variant
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.peva-btn {
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.peva-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.peva-btn--gradient {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
}

.peva-btn--gradient:hover {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
}

.peva-btn--success {
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.peva-btn--warning {
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.peva-btn--error {
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.peva-btn--info {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Animation de chargement personnalisée */
.peva-btn .v-btn__loader {
  color: currentColor;
}

/* Styles pour les tailles */
.peva-btn.v-btn--size-x-small {
  font-size: 0.75rem;
  padding: 0 12px;
}

.peva-btn.v-btn--size-small {
  font-size: 0.875rem;
  padding: 0 16px;
}

.peva-btn.v-btn--size-large {
  font-size: 1.125rem;
  padding: 0 24px;
  min-height: 48px;
}

.peva-btn.v-btn--size-x-large {
  font-size: 1.25rem;
  padding: 0 32px;
  min-height: 56px;
}
</style>