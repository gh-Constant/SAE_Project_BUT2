<template>
  <div class="min-h-screen bg-parchment py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <button @click="router.back()" class="flex items-center text-stone-grey hover:text-antique-bronze transition-colors mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour
        </button>
        <h1 class="text-4xl font-medieval font-bold text-iron-black text-center">Événements à ce lieu</h1>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse">Consultation des registres...</p>
      </div>
      
      <div v-else-if="events.length === 0" class="text-center py-12">
        <p class="text-xl font-medieval text-stone-grey">Aucun événement prévu ici pour le moment.</p>
      </div>

      <div v-else class="space-y-6 max-w-4xl mx-auto">
        <div 
          v-for="event in events" 
          :key="event.id_event" 
          class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
        >
          <div class="md:w-1/3 bg-antique-bronze/5 p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-antique-bronze/10">
            <span class="text-3xl font-medieval font-bold text-antique-bronze">{{ getDay(event.start_time) }}</span>
            <span class="text-lg font-medieval text-iron-black">{{ getMonth(event.start_time) }}</span>
            <span class="text-sm text-stone-grey mt-2">{{ getTime(event.start_time) }}</span>
          </div>
          
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h2 class="text-2xl font-medieval font-bold text-iron-black mb-2">{{ event.title }}</h2>
              <p class="text-stone-grey mb-4 line-clamp-2">{{ event.description }}</p>
            </div>
            
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-antique-bronze/10">
              <div>
                <span class="block text-xs text-stone-grey uppercase tracking-wider">Prix</span>
                <span class="font-medieval font-bold text-lg text-iron-black">{{ event.price }} G</span>
              </div>
              <button 
                @click="viewEvent(event.id_event)"
                class="bg-antique-bronze hover:brightness-110 text-white font-bold py-2 px-6 rounded shadow-md transition-all"
              >
                Réserver
              </button>
            </div>
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

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()
const loading = ref(false)
const locationId = Number(route.params.locationId)

onMounted(async () => {
  loading.value = true
  await eventStore.fetchEvents({ id_location: locationId, published: true })
  loading.value = false
})

const events = computed(() => eventStore.events.filter(e => e.id_location === locationId))

function getDay(dateStr: string) {
  return new Date(dateStr).getDate()
}

function getMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'long' })
}

function getTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function viewEvent(id: number) {
  router.push(`/events/${id}`)
}
</script>
