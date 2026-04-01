<template>
  <div class="min-h-screen bg-parchment py-16">
    <BackToMapButton />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-4xl font-medieval font-bold text-iron-black text-center">{{ t('events.location.title') }}</h1>
      </div>
      
      <div v-if="loading" class="space-y-6 max-w-4xl mx-auto">
        <div v-for="i in 4" :key="i" class="bg-white/60 border border-antique-bronze/20 rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row">
          <div class="md:w-1/3 bg-antique-bronze/5 p-6 flex flex-col justify-center items-center">
            <div class="h-10 skeleton-shimmer rounded w-16 mb-2" />
            <div class="h-5 skeleton-shimmer rounded w-20" />
          </div>
          <div class="flex-1 p-6">
            <div class="h-6 skeleton-shimmer rounded w-3/5 mb-3" />
            <div class="h-3 skeleton-shimmer rounded w-full mb-2" />
            <div class="h-3 skeleton-shimmer rounded w-4/5 mb-4" />
            <div class="flex gap-4">
              <div class="h-4 skeleton-shimmer rounded w-20" />
              <div class="h-4 skeleton-shimmer rounded w-24" />
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="events.length === 0" class="text-center py-12">
        <p class="text-xl font-medieval text-stone-grey">{{ t('events.location.empty') }}</p>
      </div>

      <div v-else class="space-y-6 max-w-4xl mx-auto">
        <div 
          v-for="event in events" 
          :key="event.id_event" 
          class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
        >
          <div class="md:w-1/3 bg-antique-bronze/5 p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-antique-bronze/10">
            <span class="text-3xl font-medieval font-bold text-antique-bronze">{{ event.type === 'ACTIVITY' ? '∞' : getDay(event.start_time) }}</span>
            <span class="text-lg font-medieval text-iron-black">{{ event.type === 'ACTIVITY' ? t('events.list.dates_multiples') : getMonth(event.start_time) }}</span>
            <span v-if="event.type !== 'ACTIVITY'" class="text-sm text-stone-grey mt-2">{{ getTime(event.start_time) }}</span>
          </div>
          
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h2 class="text-2xl font-medieval font-bold text-iron-black mb-2">{{ event.title }}</h2>
              <p class="text-stone-grey mb-4 line-clamp-2">{{ event.description }}</p>
            </div>
            
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-antique-bronze/10">
              <div>
                <span class="block text-xs text-stone-grey uppercase tracking-wider">{{ t('events.details.price_label') }}</span>
                <span class="font-medieval font-bold text-lg text-iron-black">
                  {{ event.type === 'ACTIVITY' ? t('events.list.from_price', { price: event.price }) : event.price + ' G' }}
                </span>
              </div>
              <button 
                @click="viewEvent(event.id_event)"
                class="bg-antique-bronze hover:brightness-110 text-white font-bold py-2 px-6 rounded shadow-md transition-all"
              >
                {{ t('events.location.book_button') }}
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
import BackToMapButton from '@/components/shared/BackToMapButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

function getDay(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).getDate()
}

function getMonth(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'long' })
}

function getTime(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function viewEvent(id: number) {
  router.push(`/events/${id}`)
}
</script>
