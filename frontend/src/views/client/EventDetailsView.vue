<template>
  <div class="min-h-screen bg-parchment py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button @click="router.back()" class="flex items-center text-stone-grey hover:text-antique-bronze transition-colors mb-6">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Retour
      </button>

      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse">Chargement des détails...</p>
      </div>

      <div v-else-if="!event" class="text-center py-12">
        <p class="text-xl font-medieval text-red-800">Événement introuvable.</p>
      </div>

      <div v-else class="bg-white/80 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-xl">
        <div class="h-4 bg-gradient-to-r from-antique-bronze to-[#a88558] w-full"></div>
        
        <div class="p-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">{{ event.title }}</h1>
              <div class="flex items-center gap-4 text-stone-grey">
                <span class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {{ formatDate(event.start_time) }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {{ event.location?.name || 'Lieu inconnu' }}
                </span>
              </div>
            </div>
            <div class="bg-antique-bronze/10 px-4 py-2 rounded-lg border border-antique-bronze/20 text-center min-w-[120px]">
              <span class="block text-xs font-bold text-stone-grey uppercase tracking-wider">Prix</span>
              <span class="block text-2xl font-medieval font-bold text-antique-bronze">{{ event.price }} G</span>
            </div>
          </div>

          <div class="prose prose-stone max-w-none mb-10">
            <h3 class="font-medieval text-xl font-bold text-iron-black mb-2">À propos de cet événement</h3>
            <p class="text-stone-grey leading-relaxed whitespace-pre-line">{{ event.description }}</p>
          </div>

          <div class="bg-parchment p-6 rounded-lg border border-antique-bronze/30">
            <h3 class="font-medieval text-xl font-bold text-iron-black mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              Réserver vos places
            </h3>

            <div v-if="!isAuthenticated" class="text-center py-4">
              <p class="mb-4 text-stone-grey">Vous devez être connecté pour réserver.</p>
              <button @click="router.push('/login')" class="text-antique-bronze font-bold hover:underline">Se connecter</button>
            </div>

            <div v-else class="flex flex-col sm:flex-row items-end gap-4">
              <div class="w-full sm:w-auto">
                <label class="block text-sm font-bold text-stone-grey mb-2">Quantité</label>
                <div class="flex items-center border border-stone-grey/30 rounded bg-white">
                  <button @click="quantity > 1 && quantity--" class="px-3 py-2 hover:bg-stone-100 text-stone-grey">-</button>
                  <input type="number" v-model="quantity" min="1" :max="remainingCapacity" class="w-16 text-center border-none focus:ring-0 py-2" readonly>
                  <button @click="quantity < remainingCapacity && quantity++" class="px-3 py-2 hover:bg-stone-100 text-stone-grey">+</button>
                </div>
              </div>
              
              <div class="flex-1 text-right sm:text-left sm:pl-4 pb-2">
                <p class="text-sm text-stone-grey">Total: <span class="font-bold text-iron-black">{{ total }} G</span></p>
                <p class="text-xs text-stone-grey/70">{{ remainingCapacity }} places restantes</p>
              </div>

              <button 
                @click="handleBooking" 
                :disabled="bookingLoading || remainingCapacity === 0"
                class="w-full sm:w-auto bg-antique-bronze hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span v-if="bookingLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                {{ remainingCapacity === 0 ? 'Complet' : 'Confirmer la réservation' }}
              </button>
            </div>
            
            <p v-if="bookingError" class="mt-4 text-red-600 text-sm">{{ bookingError }}</p>
            <p v-if="bookingSuccess" class="mt-4 text-green-700 text-sm font-bold">Réservation confirmée avec succès !</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()
const authStore = useAuthStore()

const loading = ref(false)
const bookingLoading = ref(false)
const bookingError = ref<string | null>(null)
const bookingSuccess = ref(false)
const quantity = ref(1)

const eventId = Number(route.params.id)

onMounted(async () => {
  loading.value = true
  await eventStore.fetchEventById(eventId)
  loading.value = false
})

const event = computed(() => eventStore.currentEvent)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const remainingCapacity = computed(() => {
  if (!event.value) return 0
  return (event.value.capacity || 0) - (event.value.sold || 0)
})

const total = computed(() => {
  if (!event.value) return 0
  return (event.value.price || 0) * quantity.value
})

async function handleBooking() {
  if (!event.value) return
  
  bookingLoading.value = true
  bookingError.value = null
  bookingSuccess.value = false

  try {
    await eventStore.bookEvent(event.value.id_event, quantity.value)
    bookingSuccess.value = true
    // Refresh event data to update capacity
    await eventStore.fetchEventById(eventId)
    setTimeout(() => {
      router.push('/my-reservations')
    }, 1500)
  } catch (err: any) {
    bookingError.value = err.response?.data?.message || err.message || 'Une erreur est survenue lors de la réservation.'
  } finally {
    bookingLoading.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
