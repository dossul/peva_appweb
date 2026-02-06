<template>
  <div class="events-banner" v-if="events.length > 0">
    <v-carousel
      v-model="currentSlide"
      height="280"
      :show-arrows="events.length > 1"
      :cycle="true"
      :interval="5000"
      hide-delimiter-background
      delimiter-icon="mdi-circle"
      class="events-carousel"
    >
      <v-carousel-item
        v-for="event in events"
        :key="event.id"
      >
        <div 
          class="carousel-slide d-flex align-center"
          :style="getBackgroundStyle(event)"
        >
          <v-container>
            <v-row align="center">
              <v-col cols="12" md="7">
                <div class="slide-content text-white">
                  <v-chip 
                    v-if="event.event_type" 
                    color="white" 
                    variant="flat" 
                    size="small" 
                    class="mb-3"
                  >
                    <v-icon start size="small">mdi-calendar-star</v-icon>
                    {{ event.event_type }}
                  </v-chip>
                  <h2 class="text-h4 text-md-h3 font-weight-bold mb-3">{{ event.title }}</h2>
                  <p class="text-body-1 mb-4 event-description">{{ truncateText(event.description, 120) }}</p>
                  <div class="d-flex flex-wrap ga-3 mb-4">
                    <div class="d-flex align-center">
                      <v-icon size="20" class="mr-2">mdi-calendar</v-icon>
                      <span>{{ formatDate(event.start_date) }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon size="20" class="mr-2">mdi-map-marker</v-icon>
                      <span>{{ event.location || event.city || 'En ligne' }}</span>
                    </div>
                    <div v-if="event.is_free" class="d-flex align-center">
                      <v-chip color="success" size="small" variant="flat">
                        <v-icon start size="small">mdi-gift</v-icon>
                        Gratuit
                      </v-chip>
                    </div>
                  </div>
                  <v-btn 
                    color="white" 
                    variant="flat" 
                    size="large"
                    class="text-purple-darken-2"
                    @click="goToEvent(event.id)"
                  >
                    <v-icon start>mdi-arrow-right</v-icon>
                    Voir l'événement
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" md="5" class="d-none d-md-flex justify-center">
                <v-card 
                  v-if="event.image_url" 
                  class="event-preview-card" 
                  elevation="8"
                  width="300"
                >
                  <v-img :src="event.image_url" height="200" cover />
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center justify-space-between">
                      <v-chip 
                        :color="event.is_free ? 'success' : 'orange'" 
                        size="small"
                        variant="flat"
                      >
                        {{ event.is_free ? 'Gratuit' : `${event.price || 0} FCFA` }}
                      </v-chip>
                      <div class="text-body-2 text-grey-darken-1">
                        <v-icon size="14">mdi-account-group</v-icon>
                        {{ event.participants_count || 0 }} inscrits
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-carousel-item>
    </v-carousel>
    
    <!-- Indicateur d'événements -->
    <div class="events-counter text-center py-2 bg-purple-darken-2 text-white">
      <v-icon size="16" class="mr-1">mdi-calendar-multiple</v-icon>
      <span class="text-body-2">{{ events.length }} événement(s) à venir</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const props = defineProps({
  limit: {
    type: Number,
    default: 5
  },
  featured: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const events = ref([])
const currentSlide = ref(0)

const loadEvents = async () => {
  try {
    let query = supabase
      .from('pev_events')
      .select('*')
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(props.limit)

    if (props.featured) {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query

    if (error) throw error
    events.value = data || []
  } catch (error) {
    console.error('Erreur chargement événements banner:', error)
  }
}

const getBackgroundStyle = (event) => {
  if (event.image_url) {
    return {
      backgroundImage: `linear-gradient(135deg, rgba(123, 31, 162, 0.9) 0%, rgba(156, 39, 176, 0.8) 100%), url(${event.image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {
    background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 50%, #ab47bc 100%)'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Date à confirmer'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const goToEvent = (id) => {
  router.push(`/events/${id}`)
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.events-banner {
  width: 100%;
  overflow: hidden;
}

.events-carousel {
  border-radius: 0;
}

.carousel-slide {
  height: 100%;
  width: 100%;
}

.slide-content {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.event-description {
  opacity: 0.95;
  max-width: 500px;
}

.event-preview-card {
  border-radius: 16px !important;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.event-preview-card:hover {
  transform: scale(1.02);
}

:deep(.v-carousel__controls) {
  background: transparent;
}

:deep(.v-carousel__controls .v-btn) {
  color: white !important;
}

:deep(.v-carousel-item) {
  transition: opacity 0.5s ease-in-out;
}
</style>
