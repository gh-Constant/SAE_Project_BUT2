<template>
  <div class="min-h-screen bg-parchment py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-medieval font-bold text-iron-black mb-8 text-center">{{ t('events.list.title') }}</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse">{{ t('events.list.loading') }}</p>
      </div>

      <div v-else-if="events.length === 0" class="text-center py-12">
        <p class="text-xl font-medieval text-stone-grey">{{ t('events.list.empty') }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="event in events" :key="event.id_event"
          class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
          @click="viewEvent(event.id_event)">
          <div class="h-2 bg-antique-bronze w-full"></div>
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
              <h2
                class="text-2xl font-medieval font-bold text-iron-black group-hover:text-antique-bronze transition-colors">
                {{ event.title }}</h2>
              <span
                class="bg-antique-bronze/10 text-antique-bronze text-xs font-bold px-2 py-1 rounded border border-antique-bronze/20">
                {{ event.location?.name || t('events.list.unknown_location') }}
              </span>
            </div>

            <p class="text-sm text-stone-grey mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(event.start_time) }}
            </p>

            <p class="text-stone-grey mb-6 line-clamp-3 font-body">{{ event.description }}</p>

            <div class="flex justify-between items-center mt-auto pt-4 border-t border-antique-bronze/10">
              <span class="font-medieval font-bold text-lg text-iron-black">{{ t('events.list.from_price', {
                price:
                getMinPrice(event) }) }}</span>
              <span
                class="text-antique-bronze font-bold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                {{ t('events.list.view_details') }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore, Event } from '@/stores/event'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const eventStore = useEventStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await eventStore.fetchEvents({ published: true })
  loading.value = false
})

const events = computed(() => eventStore.events)

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

function getMinPrice(event: Event) {
  if (event.price !== undefined) return event.price
  // Fallback if categories are used (though current backend seems to use flat price on event now based on user edits)
  // Based on user's backend changes, price is on Event model now.
  return 0
}

function viewEvent(id: number) {
  router.push(`/events/${id}`)
}
</script>
