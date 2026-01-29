<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">

      <!-- En-tête -->
      <div class="mb-8">
        <div class="flex gap-4 mb-6">
          <button @click="router.back()"
                  class="inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group">
            <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {{ t('details.back') }}
          </button>
          
          <router-link :to="{ path: '/map', query: { locationId: locationId } }" 
                       class="inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group border-l border-antique-bronze/30 pl-4">
            <i class="fas fa-map-marked-alt mr-2"></i>
            {{ t('details.view_on_map') }}
            <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform text-xs"></i>
          </router-link>
        </div>

        <div
          class="bg-white/60 p-6 rounded-sm border-2 border-antique-bronze/20 shadow-sm text-center relative overflow-hidden">
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-antique-bronze to-transparent opacity-50">
          </div>

          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center gap-2 border-b border-antique-bronze/10 pb-4">
            <i class="fas fa-calendar-plus text-antique-bronze"></i>
            {{ isEditing ? t('events.manager.form.submit_update') : t('events.manager.form.submit_create') }}
          </h3>
          <p class="text-stone-grey font-bold flex items-center justify-center mt-2">
            <i class="fas fa-map-marker-alt mr-2 text-antique-bronze"></i>
            Lieu #{{ locationId }}
            <span class="mx-3 text-antique-bronze/40">|</span>
            <i class="fas fa-ticket-alt mr-2 text-antique-bronze"></i>
            {{ events.length }} événement(s)
          </p>

          <!-- Stats Row -->
          <div class="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-antique-bronze/10">
            <div class="text-center px-4">
              <div class="text-xs font-bold text-stone-grey uppercase tracking-widest mb-1">Billets Vendus</div>
              <div class="text-2xl font-medieval font-bold text-antique-bronze">{{ totalSold }}</div>
            </div>
            <div class="w-px bg-antique-bronze/20 h-10 hidden sm:block"></div>
            <div class="text-center px-4">
              <div class="text-xs font-bold text-stone-grey uppercase tracking-widest mb-1">Revenus Est.</div>
              <div class="text-2xl font-medieval font-bold text-green-700">{{ totalRevenue }} G</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre d'outils (Recherche, Filtres, Création) -->
      <div
        class="mb-8 bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20 flex flex-col md:flex-row gap-4 justify-between items-center">

        <!-- Recherche -->
        <div class="relative w-full md:w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-antique-bronze/50"></i>
          </div>
          <input v-model="searchQuery" type="text" :placeholder="t('events.search.placeholder')"
                 class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body" />
          <button v-if="searchQuery" @click="searchQuery = ''"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-antique-bronze transition-colors">
            <i class="fas fa-times text-stone-grey/50"></i>
          </button>
        </div>

        <!-- Bouton Créer -->
        <button @click="openCreateModal"
                class="w-full md:w-auto bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-2.5 px-6 rounded-sm shadow-md transition-all flex items-center justify-center gap-2">
          <i class="fas fa-plus-circle"></i>
          {{ t('events.manager.create_button') }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse text-antique-bronze">Consultation des astres...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEvents.length === 0"
           class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
        <i class="fas fa-calendar-times text-6xl text-antique-bronze/30 mb-4"></i>
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
          {{ t('events.manager.empty_search.title') }}
        </h3>
        <p class="text-stone-grey mb-6">
          {{ t('events.manager.empty_search.description') }}
        </p>
        <button @click="openCreateModal" class="inline-flex items-center text-antique-bronze font-bold hover:underline">
          Créer un événement maintenant
        </button>
      </div>

      <!-- Grid of Events -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="event in filteredEvents" :key="event.id_event"
             class="bg-white/60 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-antique-bronze/20 hover:border-antique-bronze/60 flex flex-col group">
          <!-- Header / Date -->
          <div class="bg-antique-bronze/10 p-4 border-b border-antique-bronze/10 flex justify-between items-center">
            <div class="flex items-center gap-2 text-antique-bronze font-bold">
              <i class="fas fa-clock"></i>
              <span>{{ formatDate(event.start_time) }}</span>
            </div>
            <div class="text-sm font-bold text-stone-500 bg-white/50 px-2 py-1 rounded-sm border border-stone-200">
              {{ event.price }} G
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex-1 flex flex-col">
            <h3
              class="text-xl font-medieval font-bold text-iron-black mb-2 group-hover:text-antique-bronze transition-colors">
              {{ event.title }}
            </h3>
            <p class="text-stone-grey text-sm mb-4 line-clamp-2 flex-1">
              {{ event.description }}
            </p>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex justify-between text-xs font-bold text-stone-500 mb-1">
                <span>Places vendues</span>
                <span>{{ event.sold || 0 }} / {{ event.capacity }}</span>
              </div>
              <div class="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div class="bg-antique-bronze h-full rounded-full transition-all duration-500"
                     :style="{ width: getProgress(event) + '%' }"></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-auto pt-4 border-t border-antique-bronze/10">
              <button @click="viewReservations(event)"
                      class="bg-white hover:bg-stone-50 text-emerald-700 border border-emerald-200 font-bold py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-center gap-2"
                      :title="t('events.actions.view_reservations')">
                <i class="fas fa-ticket-alt"></i>
                <span class="hidden xl:inline">{{ event.sold || 0 }}</span>
              </button>
              <button @click="editEvent(event)"
                      class="flex-1 bg-white hover:bg-stone-50 text-indigo-700 border border-indigo-200 font-bold py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-center gap-2">
                <i class="fas fa-edit"></i> {{ t('events.actions.edit') }}
              </button>
              <button @click="deleteEvent(event.id_event)"
                      class="bg-white hover:bg-stone-50 text-red-700 border border-red-200 font-bold py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-center gap-2"
                      :title="t('events.actions.delete')">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Create/Edit Modal (Styled) -->
    <div v-if="showModal" class="fixed inset-0 z-[2000] overflow-y-auto" aria-labelledby="modal-title" role="dialog"
         aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true"
             @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-parchment rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-antique-bronze relative z-10"
          @click.stop>
          <div class="bg-parchment px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-6 border-b border-antique-bronze/20 pb-4">
              <h3 class="text-2xl leading-6 font-medieval font-bold text-iron-black" id="modal-title">
                {{ isEditing ? 'Modifier le Décret' : 'Nouveau Décret' }}
              </h3>
              <button @click="closeModal" class="text-stone-grey hover:text-antique-bronze">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <div class="space-y-4 font-body">
              <div>
                <label class="block text-sm font-bold text-iron-black mb-1">{{ t('events.manager.form.title_label') }}</label>
                <input v-model="form.title" type="text"
                       class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white">
              </div>
              <div>
                <label class="block text-sm font-bold text-iron-black mb-1">{{ t('events.manager.form.description_label') }}</label>
                <textarea v-model="form.description" rows="3"
                          class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white"></textarea>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-bold text-iron-black mb-2">{{ t('events.manager.form.date_label') }}</label>

                <!-- Date Navigation -->
                <div
                  class="flex items-center justify-between mb-2 bg-antique-bronze/10 p-2 rounded-sm border border-antique-bronze/20">
                  <button type="button" @click="changeDate(-1)"
                          class="text-antique-bronze hover:text-iron-black font-bold px-2">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <div class="flex items-center gap-2">
                    <input type="date" v-model="selectedDate" :min="settingsStore.festival_start_date || undefined"
                           :max="settingsStore.festival_end_date || undefined"
                           class="bg-transparent border-none font-medieval font-bold text-lg text-center focus:ring-0 cursor-pointer text-iron-black">
                  </div>
                  <button type="button" @click="changeDate(1)"
                          class="text-antique-bronze hover:text-iron-black font-bold px-2">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>

                <!-- Time Grid -->
                <div
                  class="border-2 border-antique-bronze/30 rounded-sm bg-parchment h-64 overflow-y-auto relative custom-scrollbar">
                  <div class="grid grid-cols-1 divide-y divide-antique-bronze/10">
                    <div v-for="hour in 24" :key="hour - 1" @mousedown="startDrag(hour - 1)"
                         @mouseenter="onMouseEnter(hour - 1)"
                         class="flex h-10 hover:bg-antique-bronze/5 cursor-pointer transition-colors relative group"
                         :class="getTimeSlotClass(hour - 1)">
                      <div
                        class="w-16 flex-shrink-0 flex items-center justify-end pr-3 border-r border-antique-bronze/20 text-xs font-bold text-stone-500 select-none">
                        {{ formatHour(hour - 1) }}
                      </div>
                      <div class="flex-grow relative">
                        <!-- Selection Indicator -->
                        <div v-if="isHourSelected(hour - 1)"
                             class="absolute inset-0 bg-antique-bronze/20 border-l-4 border-antique-bronze flex items-center px-2 gap-2">
                          <span class="text-xs font-bold text-antique-bronze" v-if="isStartHour(hour - 1)">{{ t('events.manager.form.start') }}</span>
                          <span class="text-xs font-bold text-antique-bronze" v-if="isEndHour(hour - 1)">{{ t('events.manager.form.end') }}</span>
                        </div>
                        <!-- Hover Hint -->
                        <div
                          class="hidden group-hover:flex absolute inset-0 items-center pl-2 text-xs text-stone-400 italic pointer-events-none">
                          {{ form.start_time && !form.end_time ? 'Définir fin' : 'Définir début' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-2 text-sm text-center font-bold text-antique-bronze"
                     v-if="form.start_time && form.end_time">
                  {{ formatDateTime(form.start_time) }} - {{ formatResultTime(form.end_time) }}
                </div>
              </div>
              <div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-iron-black mb-1">{{ t('events.manager.form.price_label') }}</label>
                    <div class="relative">
                      <input v-model.number="form.price" type="number" min="0"
                             class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white pl-8">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-coins text-antique-bronze/50 text-xs"></i>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-iron-black mb-1">{{ t('events.manager.form.capacity_label') }}</label>
                    <div class="relative">
                      <input v-model.number="form.capacity" type="number" min="1"
                             class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white pl-8">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-users text-antique-bronze/50 text-xs"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-antique-bronze/5 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-antique-bronze/10">
            <button @click="saveEvent" type="button"
                    class="w-full inline-flex justify-center rounded-sm border border-transparent shadow-sm px-4 py-2 bg-antique-bronze text-base font-medium text-white hover:brightness-110 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              {{ isEditing ? t('events.manager.form.submit_update') : t('events.manager.form.submit_create') }}
            </button>
            <button @click="closeModal" type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-sm border border-stone-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-stone-700 hover:bg-stone-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              {{ t('events.manager.form.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservations Modal -->
    <div v-if="showReservationsModal" class="fixed inset-0 z-[2000] overflow-y-auto" aria-labelledby="modal-title"
         role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true"
             @click="closeReservationsModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-parchment rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border-2 border-antique-bronze relative z-10"
          @click.stop>
          <div class="bg-parchment px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-6 border-b border-antique-bronze/20 pb-4">
              <h3 class="text-2xl leading-6 font-medieval font-bold text-iron-black">
                Réservations : {{ currentReservationEvent?.title }}
              </h3>
              <button @click="closeReservationsModal" class="text-stone-grey hover:text-antique-bronze">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <div v-if="loadingReservations" class="text-center py-8">
              <p class="text-lg font-medieval animate-pulse text-antique-bronze">Recherche des parchemins de
                réservation...</p>
            </div>

            <div v-else-if="currentEventReservations.length === 0"
                 class="text-center py-8 bg-white/40 rounded-sm border border-dashed border-antique-bronze/30">
              <i class="fas fa-scroll text-4xl text-antique-bronze/30 mb-3"></i>
              <p class="text-stone-grey">{{ t('events.manager.reservations.empty') }}</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/10">
                  <tr>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('events.manager.reservations.headers.adventurer') }}</th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('events.manager.reservations.headers.places') }}</th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('events.manager.reservations.headers.total') }}</th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('events.manager.reservations.headers.date') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white/60 divide-y divide-antique-bronze/10">
                  <tr v-for="reservation in currentEventReservations" :key="reservation.id_reservation"
                      class="hover:bg-antique-bronze/5 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="flex-shrink-0 h-8 w-8 rounded-full bg-antique-bronze/20 flex items-center justify-center text-antique-bronze font-bold">
                          {{ reservation.user?.firstname?.charAt(0) || '?' }}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-bold text-iron-black">{{ reservation.user?.firstname }} {{
                            reservation.user?.lastname }}</div>
                          <div class="text-sm text-stone-grey">{{ reservation.user?.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-stone-900 font-bold">{{ reservation.quantity }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-amber-700 font-bold">{{ reservation.total_price }} G</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {{ new Date(reservation.created_at).toLocaleDateString() }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-6 flex justify-end pt-4 border-t border-antique-bronze/10">
              <div class="text-sm text-stone-grey mr-4 flex items-center">
                <span class="font-bold mr-2">Total Réservé:</span>
                {{currentEventReservations.reduce((acc, r) => acc + r.quantity, 0)}} places
              </div>
              <div class="text-sm text-stone-grey flex items-center">
                <span class="font-bold mr-2">Revenu Total:</span>
                <span class="text-green-700 font-bold">{{currentEventReservations.reduce((acc, r) => acc +
                  r.total_price, 0)}} G</span>
              </div>
            </div>

          </div>
          <div
            class="bg-antique-bronze/5 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-antique-bronze/10">
            <button @click="closeReservationsModal" type="button"
                    class="w-full inline-flex justify-center rounded-sm border border-transparent shadow-sm px-4 py-2 bg-antique-bronze text-base font-medium text-white hover:brightness-110 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              {{ t('events.manager.reservations.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore, Event } from '@/stores/event'
import { locationService } from '@/services/locationService';
import { LocationMock } from '@/mocks/locations';
import { useSettingsStore } from '@/stores/settings';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()
const settingsStore = useSettingsStore()

const locationId = Number(route.params.locationId)
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const searchQuery = ref('')

const form = reactive({
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  price: 0,
  capacity: 0
})

const location = ref<LocationMock | null>(null)

// Reservations Logic
const showReservationsModal = ref(false)
const loadingReservations = ref(false)
const currentEventReservations = ref<any[]>([])
const currentReservationEvent = ref<Event | null>(null)


// Calendar Logic
const selectedDate = ref(new Date().toISOString().split('T')[0])
const isDragging = ref(false)
const dragStartHour = ref<number | null>(null)

// Initialize selectedDate when opening modal with existing data
watch(() => form.start_time, (newVal) => {
  if (newVal) {
    selectedDate.value = newVal.split('T')[0]
  }
}, { immediate: true })

function changeDate(days: number) {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  const newDateStr = date.toISOString().split('T')[0]

  // Check constraints using Global Settings
  if (settingsStore.festival_start_date && newDateStr < settingsStore.festival_start_date) return
  if (settingsStore.festival_end_date && newDateStr > settingsStore.festival_end_date) return

  selectedDate.value = newDateStr
}

function formatHour(h: number) {
  return `${h.toString().padStart(2, '0')}:00`
}

function formatResultTime(isoString: string) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateTime(isoString: string) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
}

function getHourFromISO(isoString: string) {
  if (!isoString) return -1
  // Ensure we compare dates properly, ignoring time for date check, but checking same day
  if (isoString.split('T')[0] !== selectedDate.value) return -1
  return new Date(isoString).getHours()
}

function isHourSelected(h: number) {
  if (!form.start_time) return false
  const start = getHourFromISO(form.start_time)
  if (start === -1) return false

  if (!form.end_time) return h === start

  const end = getHourFromISO(form.end_time)
  // If end day is different (next day), handle strictly less than 24 logic?
  // For simplicity, handle single day events. 
  // If end is -1 (different day), maybe we should show full selection?
  // Let's assume strict single day for visual simplicity first.

  if (end !== -1) {
    // Standard case: start and end on same day
    return h >= start && h < end
  }

  // If end date is > selected date, then all hours after start are selected
  if (form.end_time.split('T')[0] > selectedDate.value) {
    return h >= start
  }

  return h === start
}

function isStartHour(h: number) {
  return getHourFromISO(form.start_time) === h
}

function isEndHour(h: number) {
  // End time is exclusive in logic (14:00 - 15:00 means 14:00 slot selected), 
  // but visually we might want to mark the last slot.
  // With the current logic: 14:00 start, 16:00 end -> 14, 15 selected. 16 is NOT selected.
  // So "EndHour" visual marker should technically be the last SELECTED block?

  if (!form.end_time) return false
  const end = getHourFromISO(form.end_time)
  const start = getHourFromISO(form.start_time)

  // If end is 16, range is [14, 15]. Last selected is 15.
  // So visual tag "Fin" should be on 15? Or do we want to show strict time?
  // Let's put "Fin" on the last selected block.

  if (end !== -1) {
    return h === end - 1
  }
  if (form.end_time.split('T')[0] > selectedDate.value && start !== -1) {
    return h === 23 // Show end on last slot if spanning
  }
  return false
}

function getTimeSlotClass(h: number) {
  if (isHourSelected(h)) {
    return 'bg-emerald-100/50'
  }
  return ''
}

function startDrag(h: number) {
  isDragging.value = true
  dragStartHour.value = h
  updateSelection(h)
}

function onMouseEnter(h: number) {
  if (isDragging.value && dragStartHour.value !== null) {
    updateSelection(h)
  }
}

function stopDrag() {
  if (isDragging.value) {
    isDragging.value = false
    dragStartHour.value = null
  }
}

function updateSelection(currentHour: number) {
  if (dragStartHour.value === null) return

  const start = Math.min(dragStartHour.value, currentHour)
  const end = Math.max(dragStartHour.value, currentHour) + 1 // +1 because end time is exclusive

  const startTime = `${selectedDate.value}T${start.toString().padStart(2, '0')}:00`
  const endTime = `${selectedDate.value}T${end.toString().padStart(2, '0')}:00`

  form.start_time = startTime
  // Note: endTime might overflow if end is 24.
  if (end === 24) {
    // Handle next day overflow properly
    const nextDay = new Date(selectedDate.value)
    nextDay.setDate(nextDay.getDate() + 1)
    form.end_time = `${nextDay.toISOString().split('T')[0]}T00:00`
  } else {
    form.end_time = endTime
  }
}



async function viewReservations(event: Event) {
  currentReservationEvent.value = event
  showReservationsModal.value = true
  loadingReservations.value = true
  try {
    currentEventReservations.value = await eventStore.fetchEventReservations(event.id_event)
  } catch (e) {
    console.error("Failed to load reservations", e)
    alert("Impossible de charger les réservations.")
  } finally {
    loadingReservations.value = false
  }
}

function closeReservationsModal() {
  showReservationsModal.value = false
  currentEventReservations.value = []
  currentReservationEvent.value = null
}

onMounted(async () => {
  window.addEventListener('mouseup', stopDrag)
  loading.value = true

  // Fetch location details first to check status
  try {
    const loc = await locationService.getLocationById(locationId);
    location.value = loc;

    // Initialize date to global festival start_date if available and current date is out of range
    if (settingsStore.festival_start_date) {
      if (selectedDate.value < settingsStore.festival_start_date) {
        selectedDate.value = settingsStore.festival_start_date
      }
    }

    if (loc.status === 'PENDING') {
      alert("Ce lieu est en attente de validation. Vous ne pouvez pas encore gérer ses événements.");
      router.back();
      return;
    }
  } catch (e) {
    console.error("Error checking location status", e);
  }

  await eventStore.fetchEvents({ id_location: locationId })
  loading.value = false
})

onUnmounted(() => {
  window.removeEventListener('mouseup', stopDrag)
})

const events = computed(() => eventStore.events.filter(e => e.id_location === locationId))

const filteredEvents = computed(() => {
  if (!searchQuery.value) return events.value
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(e =>
    e.title.toLowerCase().includes(query) ||
    (e.description && e.description.toLowerCase().includes(query))
  )
})

const totalSold = computed(() => events.value.reduce((acc, e) => acc + (e.sold || 0), 0))
const totalRevenue = computed(() => events.value.reduce((acc, e) => acc + ((e.sold || 0) * (e.price || 0)), 0))

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

function getProgress(event: Event) {
  if (!event.capacity || event.capacity === 0) return 0
  return ((event.sold || 0) / event.capacity) * 100
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  form.title = ''
  form.description = ''
  form.start_time = ''
  form.end_time = ''
  form.price = 0
  form.capacity = 0
  showModal.value = true
}

function editEvent(event: Event) {
  isEditing.value = true
  editingId.value = event.id_event
  form.title = event.title
  form.description = event.description || ''
  form.start_time = new Date(event.start_time).toISOString().slice(0, 16)
  form.end_time = new Date(event.end_time).toISOString().slice(0, 16)
  form.price = event.price || 0
  form.capacity = event.capacity || 0
  showModal.value = true
}

async function deleteEvent(id: number) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
    await eventStore.deleteEvent(id)
  }
}

function closeModal() {
  showModal.value = false
}

async function saveEvent() {
  const eventData = {
    ...form,
    id_location: locationId,
    published: true,
    categories: []
  }

  try {
    if (isEditing.value && editingId.value) {
      await eventStore.updateEvent(editingId.value, eventData)
    } else {
      await eventStore.createEvent(eventData)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save event:', error)
    alert('Erreur lors de l\'enregistrement')
  }
}
</script>
