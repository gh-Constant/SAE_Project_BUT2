<template>
  <div class="mt-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-medieval font-bold text-iron-black flex items-center gap-2">
        <svg class="w-5 h-5 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ t('widgets.events.title') }}
      </h3>
      <div class="flex gap-2">
        <button v-if="isOwner" @click="manageEvents"
          class="px-4 py-2 bg-antique-bronze hover:brightness-110 text-white font-semibold rounded-lg transition-colors text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ t('widgets.events.manage') }}
        </button>
        <button v-if="events.length > 0" @click="viewAllEvents"
          class="text-sm text-antique-bronze hover:text-iron-black font-bold hover:underline">
          {{ t('widgets.events.view_all') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4 text-stone-grey">
      {{ t('widgets.events.loading') }}
    </div>

    <div v-else-if="events.length === 0"
      class="text-center py-4 bg-white/30 rounded-lg border border-antique-bronze/10">
      <p class="text-stone-grey italic">{{ t('widgets.events.empty') }}</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="event in previewEvents" :key="event.id_event"
        class="bg-white/60 p-3 rounded border border-antique-bronze/10 hover:border-antique-bronze/30 transition-colors cursor-pointer"
        @click="viewEvent(event.id_event)">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold text-iron-black">{{ event.title }}</h4>
            <p class="text-xs text-stone-grey">{{ formatDate(event.start_time) }}</p>
          </div>
          <span class="text-sm font-medieval font-bold text-antique-bronze">{{ event.price }} G</span>
        </div>
      </div>
    </div>

    <button v-if="events.length > 0" @click="viewAllEvents"
      class="w-full mt-4 bg-antique-bronze/10 hover:bg-antique-bronze/20 text-antique-bronze font-bold py-2 rounded transition-colors">
      {{ t('widgets.events.view_calendar') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  locationId: number
  isOwner?: boolean
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

function manageEvents() {
  router.push({
    name: 'prestataire-location-events',
    params: { locationId: props.locationId }
  })
}
</script>
