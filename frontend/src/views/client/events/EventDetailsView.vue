<template>
  <div class="min-h-screen bg-parchment py-16">
    <BackToMapButton />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse">{{ t('events.details.loading') }}</p>
      </div>

      <div v-else-if="!event" class="text-center py-12">
        <p class="text-xl font-medieval text-red-800">{{ t('events.details.not_found') }}</p>
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
                  {{ event.type === 'ACTIVITY' ? 'Dates multiples' : formatDate(event.start_time) }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {{ event.location?.name || t('events.list.unknown_location') }}
                </span>
              </div>
            </div>
            <div class="bg-antique-bronze/10 px-4 py-2 rounded-lg border border-antique-bronze/20 text-center min-w-[120px]">
              <span class="block text-xs font-bold text-stone-grey uppercase tracking-wider">{{ t('events.details.price_label') }}</span>
              <span class="block text-2xl font-medieval font-bold text-antique-bronze">
                {{ event.type === 'ACTIVITY' && !selectedSchedule ? t('events.list.from_price', { price: event.price }) : currentPrice + ' G' }}
              </span>
            </div>
          </div>

          <div class="prose prose-stone max-w-none mb-10">
            <h3 class="font-medieval text-xl font-bold text-iron-black mb-2">{{ t('events.details.about_title') }}</h3>
            <div class="tiptap text-stone-grey leading-relaxed" v-html="event.description"></div>
          </div>

          <div
            v-if="event.location?.has_water_access || event.location?.has_electricity || event.location?.has_toilets || event.location?.is_accessible_pmr"
            class="mb-8"
          >
            <h3 class="font-medieval text-xl font-bold text-iron-black mb-3">Caractéristiques</h3>
            <div class="flex flex-wrap gap-2">
              <span v-if="event.location?.has_water_access" class="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-sm">
                <i class="fas fa-tint mr-1"></i> Accès à l'eau
              </span>
              <span v-if="event.location?.has_electricity" class="px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 text-sm">
                <i class="fas fa-bolt mr-1"></i> Électricité
              </span>
              <span v-if="event.location?.has_toilets" class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm">
                <i class="fas fa-restroom mr-1"></i> Sanitaires
              </span>
              <span v-if="event.location?.is_accessible_pmr" class="px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-sm">
                <i class="fas fa-wheelchair mr-1"></i> Accessible PMR
              </span>
            </div>
          </div>

          <div class="bg-parchment p-6 rounded-lg border border-antique-bronze/30">
            <h3 class="font-medieval text-xl font-bold text-iron-black mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              {{ t('events.details.book_title') }}
            </h3>

            <div v-if="!isAuthenticated" class="text-center py-4">
              <p class="mb-4 text-stone-grey">{{ t('events.details.login_required') }}</p>
              <button @click="router.push('/login')" class="text-antique-bronze font-bold hover:underline">{{ t('events.details.login_button') }}</button>
            </div>

            <div v-else class="flex flex-col gap-4">
              <!-- Activity Schedule Selector -->
              <div v-if="event.type === 'ACTIVITY'" class="w-full">
                <label class="block text-sm font-bold text-stone-grey mb-2">{{ t('events.details.choose_date') }}</label>
                <select v-model="selectedScheduleId" class="w-full border-stone-300 rounded bg-white p-2 text-stone-700 focus:ring-antique-bronze focus:border-antique-bronze">
                  <option value="" disabled>{{ t('events.details.select_slot') }}</option>
                  <option v-for="schedule in event.schedules" :key="schedule.id_schedule" :value="String(schedule.id_schedule)">
                    {{ formatScheduleDate(schedule.start_time) }} - {{ formatScheduleTime(schedule.start_time) }} 
                    ({{ t('events.details.remaining_slot', { count: (schedule.capacity || event?.capacity || 0) - (schedule.sold || 0) }) }})
                  </option>
                </select>
              </div>

              <div class="flex flex-col sm:flex-row items-end gap-4">
                <div class="w-full sm:w-auto">
                  <label class="block text-sm font-bold text-stone-grey mb-2">{{ t('events.details.quantity') }}</label>
                  <div class="flex items-center border border-stone-grey/30 rounded bg-white">
                    <button @click="quantity > 1 && quantity--" class="px-3 py-2 hover:bg-stone-100 text-stone-grey" type="button">-</button>
                    <input type="number" v-model="quantity" min="1" :max="remainingCapacity" class="w-16 text-center border-none focus:ring-0 py-2" readonly>
                    <button @click="quantity < remainingCapacity && quantity++" class="px-3 py-2 hover:bg-stone-100 text-stone-grey" type="button">+</button>
                  </div>
                </div>
                  
                <div class="flex-1 text-right sm:text-left sm:pl-4 pb-2">
                  <p class="text-sm text-stone-grey">{{ t('events.details.total') }}: <span class="font-bold text-iron-black">{{ total }} G</span></p>
                  <p class="text-xs text-stone-grey/70">
                    {{ t('events.details.remaining_seats', { count: remainingCapacity }) }}
                  </p>
                </div>

                <button 
                  @click="handleBooking" 
                  :disabled="bookingLoading || remainingCapacity === 0 || (event.type === 'ACTIVITY' && !selectedSchedule)"
                  class="w-full sm:w-auto bg-antique-bronze hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span v-if="bookingLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  {{ remainingCapacity === 0 ? t('events.details.sold_out') : t('events.details.confirm_booking') }}
                </button>
              </div>
            </div>
            
            <p v-if="bookingError" class="mt-4 text-red-600 text-sm">{{ bookingError }}</p>
            <p v-if="bookingSuccess" class="mt-4 text-green-700 text-sm font-bold">{{ t('events.details.success') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import { useI18n } from 'vue-i18n'
import BackToMapButton from '@/components/shared/BackToMapButton.vue'
import type { EventSchedule } from '@/stores/event'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const bookingLoading = ref(false)
const bookingError = ref<string | null>(null)
const bookingSuccess = ref(false)
const quantity = ref(1)

const eventId = Number(route.params.id)
const selectedScheduleId = ref('')

onMounted(async () => {
  loading.value = true
  await eventStore.fetchEventById(eventId)
  loading.value = false
})

const event = computed(() => eventStore.currentEvent)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const selectedSchedule = computed<EventSchedule | null>(() => {
  const id = Number(selectedScheduleId.value)
  if (!event.value?.schedules || !Number.isFinite(id) || id <= 0) return null
  return event.value.schedules.find(schedule => schedule.id_schedule === id) || null
})

watch(event, (newVal) => {
  if (newVal?.type !== 'ACTIVITY') {
    selectedScheduleId.value = ''
    return
  }
  if (!selectedScheduleId.value) return
  const selectedId = Number(selectedScheduleId.value)
  const stillExists = newVal.schedules?.some(schedule => schedule.id_schedule === selectedId)
  if (!stillExists) {
    selectedScheduleId.value = ''
  }
})

const currentCapacity = computed(() => {
  if (!event.value) return 0
  if (event.value.type === 'ACTIVITY') {
    if (!selectedSchedule.value) return 0
    return selectedSchedule.value.capacity ?? event.value.capacity ?? 0
  }
  return event.value.capacity ?? 0
})

const currentSold = computed(() => {
  if (!event.value) return 0
  if (event.value.type === 'ACTIVITY') {
    if (!selectedSchedule.value) return 0
    return selectedSchedule.value.sold ?? 0
  }
  return event.value.sold ?? 0
})

const currentPrice = computed(() => {
  if (!event.value) return 0
  if (event.value.type === 'ACTIVITY') {
    if (!selectedSchedule.value) return Number(event.value.price)
    return selectedSchedule.value.price !== undefined
      ? Number(selectedSchedule.value.price)
      : Number(event.value.price)
  }
  return Number(event.value.price)
})


const remainingCapacity = computed(() => {
  return Math.max(0, currentCapacity.value - currentSold.value)
})

const total = computed(() => {
  return currentPrice.value * quantity.value
})

async function handleBooking() {
  if (!event.value) return
  
  if (event.value.type === 'ACTIVITY' && !selectedSchedule.value) {
    bookingError.value = "Veuillez sélectionner un créneau horaire."
    notificationStore.error('Réservation impossible', bookingError.value)
    return
  }

  bookingLoading.value = true
  bookingError.value = null
  bookingSuccess.value = false

  try {
    await eventStore.bookEvent(
      event.value.id_event, 
      quantity.value, 
      selectedSchedule.value?.id_schedule
    )
    bookingSuccess.value = true
    notificationStore.success(
      t('events.details.success'),
      `${quantity.value} place(s) réservée(s) pour ${event.value.title}.`
    )
    // Refresh event data to update capacity
    await eventStore.fetchEventById(eventId)
    setTimeout(() => {
      router.push('/my-reservations')
    }, 1500)
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } }; message?: string }
    bookingError.value = error.response?.data?.message || error.message || t('events.details.error_default')
    notificationStore.error('Réservation impossible', bookingError.value)
  } finally {
    bookingLoading.value = false
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Dates multiples'
  return new Date(dateStr).toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatScheduleDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short', day: 'numeric', month: 'short'
  })
}

function formatScheduleTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
