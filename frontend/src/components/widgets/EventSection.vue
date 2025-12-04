<template>
  <div class="mt-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-medieval font-bold text-iron-black flex items-center gap-2">
        <svg class="w-5 h-5 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Événements à venir
      </h3>
      <button 
        v-if="events.length > 0"
        @click="viewAllEvents"
        class="text-sm text-antique-bronze hover:text-iron-black font-bold hover:underline"
      >
        Voir tout
      </button>
    </div>

    <div v-if="loading" class="text-center py-4 text-stone-grey">
      Chargement...
    </div>

    <div v-else-if="events.length === 0" class="text-center py-4 bg-white/30 rounded-lg border border-antique-bronze/10">
      <p class="text-stone-grey italic">Aucun événement prévu pour le moment.</p>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="event in previewEvents" 
        :key="event.id_event"
        class="bg-white/60 p-3 rounded border border-antique-bronze/10 hover:border-antique-bronze/30 transition-colors cursor-pointer"
        @click="viewEvent(event.id_event)"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold text-iron-black">{{ event.title }}</h4>
            <p class="text-xs text-stone-grey">{{ formatDate(event.start_time) }}</p>
          </div>
          <span class="text-sm font-medieval font-bold text-antique-bronze">{{ event.price }} G</span>
        </div>
      </div>
    </div>
    
    <button 
      v-if="events.length > 0"
      @click="viewAllEvents"
      class="w-full mt-4 bg-antique-bronze/10 hover:bg-antique-bronze/20 text-antique-bronze font-bold py-2 rounded transition-colors"
    >
      Voir le calendrier complet
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore } from '@/stores/event'

const props = defineProps<{
  locationId: number
}>()

const router = useRouter()
const eventStore = useEventStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await eventStore.fetchEvents({ id_location: props.locationId, published: true })
  loading.value = false
})

const events = computed(() => eventStore.events.filter(e => e.id_location === props.locationId))
const previewEvents = computed(() => events.value.slice(0, 3))

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function viewAllEvents() {
  router.push(`/location/${props.locationId}/events`)
}

function viewEvent(eventId: number) {
  router.push(`/events/${eventId}`)
}
</script>
