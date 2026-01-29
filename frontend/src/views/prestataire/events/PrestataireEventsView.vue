<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <!-- Navbar (if needed, but PrestataireView usually manages layout, actually PrestataireView is a dashboard wrapper?) 
         Wait, PrestataireView has tabs. If I add a NEW route /prestataire/events, it won't be inside PrestataireView tabs unless I make it a child or similar.
         The Admin view is standalone. The Provider Products view is standalone (linked from dashboard).
         So this view should be standalone with a Back button or Navbar.
         PrestataireProductsView has no Navbar, just a back button? No, it has no back button in the code I read.
         It seems to be a full page.
         I will assume it effectively replaces the dashboard view when navigated to.
    -->
    <div class="pt-32 pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <button @click="router.push('/prestataire')"
            class="mb-6 inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group">
            <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {{ t('prestataire.details.back') || 'Retour au tableau de bord' }}
          </button>
          
          <div class="text-center">
            <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
              <i class="fas fa-calendar-alt text-antique-bronze"></i>
              {{ t('prestataire.events.title') }}
            </h1>
            <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
            <p class="text-base font-body text-stone-grey">{{ t('prestataire.events.subtitle') }}</p>
          </div>
        </div>

        <div class="mb-8 space-y-4">
          <!-- Filters -->
          <div class="bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Search -->
              <div class="flex-1">
                <label for="search" class="sr-only">{{ t('prestataire.events.search.label') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-antique-bronze/50"></i>
                  </div>
                  <input
                    id="search"
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('prestataire.events.search.placeholder')"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body"
                  />
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-antique-bronze transition-colors"
                    :title="t('prestataire.events.search.clear')"
                  >
                    <i class="fas fa-times text-stone-grey/50"></i>
                  </button>
                </div>
              </div>

              <!-- Location Filter -->
              <div class="md:w-64">
                <label for="locationFilter" class="sr-only">{{ t('prestataire.events.filter.location') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-map-marker-alt text-antique-bronze/50"></i>
                  </div>
                  <select
                    id="locationFilter"
                    v-model="selectedLocationId"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey appearance-none cursor-pointer font-body"
                  >
                    <option :value="null">{{ t('prestataire.events.filter.all_locations') }}</option>
                    <option v-for="loc in providerLocations" :key="loc.id" :value="loc.id">
                      {{ loc.name }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i class="fas fa-chevron-down text-antique-bronze/50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reset Button -->
          <div class="flex justify-end" v-if="searchQuery || selectedLocationId">
            <button
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-sm transition-colors font-medieval font-bold text-sm"
            >
              <i class="fas fa-undo mr-2"></i>
              {{ t('prestataire.events.filter.reset') }}
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-antique-bronze/10">
              <thead class="bg-antique-bronze/10">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.events.table.headers.title') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.events.table.headers.date') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.events.table.headers.location') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.events.table.headers.price') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.events.table.headers.capacity') }}</th>
                   <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.events.table.headers.sold') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.events.table.headers.actions') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-antique-bronze/10 font-body">
                <tr v-for="event in filteredEvents" :key="event.id_event" class="hover:bg-antique-bronze/5 transition-colors">
                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-iron-black">{{ event.title }}</div>
                    <div class="text-xs text-stone-grey">{{ event.description?.substring(0, 50) }}...</div>
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-stone-600">
                     {{ new Date(event.start_time).toLocaleDateString() }}
                     <br>
                     <span class="text-xs">{{ new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                  </td>
                  <td class="px-6 py-4 text-center text-sm text-stone-600">
                    {{ getLocationName(event.id_location) }}
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-antique-bronze">
                    {{ event.price }} G
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-stone-600">
                    {{ event.capacity }}
                  </td>
                   <td class="px-6 py-4 text-center whitespace-nowrap text-sm font-bold" :class="event.sold === event.capacity ? 'text-red-600' : 'text-green-600'">
                    {{ event.sold || 0 }}
                  </td>

                  <td class="px-6 py-4 text-center whitespace-nowrap">
                     <button
                        @click="router.push(`/prestataire/location/${event.id_location}/events`)"
                        class="text-stone-grey hover:text-antique-bronze transition-colors p-1 mr-2"
                        :title="t('prestataire.events.table.actions.manage')"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                  </td>
                </tr>
                <tr v-if="filteredEvents.length === 0">
                  <td colspan="7" class="px-6 py-16 text-center bg-white/40">
                    <div class="flex flex-col items-center">
                      <div class="w-16 h-16 bg-stone-grey/10 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-calendar-times text-2xl text-stone-grey"></i>
                      </div>
                      <p class="text-iron-black font-medieval text-lg">{{ t('prestataire.events.table.empty.title') }}</p>
                      <p class="text-sm text-stone-grey mt-1 font-body">{{ t('prestataire.events.table.empty.subtitle') }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/event'
import { useI18n } from 'vue-i18n'
import { locationsMock } from '@/mocks/locations'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const eventStore = useEventStore()

const searchQuery = ref('')
const selectedLocationId = ref<number | null>(null)

// Computed
const providerLocations = computed(() => {
  return locationsMock.filter(l => l.id_prestataire === authStore.user?.id)
})

const filteredEvents = computed(() => {
  // Start with ALL events from store, then filter by those that belong to one of the provider's locations
  const myLocationIds = providerLocations.value.map(l => l.id)
  let events = eventStore.events.filter(e => myLocationIds.includes(e.id_location))

  if (selectedLocationId.value) {
    events = events.filter(e => e.id_location === selectedLocationId.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    events = events.filter(e =>
      e.title.toLowerCase().includes(query) ||
      (e.description && e.description.toLowerCase().includes(query))
    )
  }

  return events
})

// Lifecycle
onMounted(() => {
  // Fetch all events (assuming global fetch works as per Admin view)
  // We filter client-side for "my" events
  eventStore.fetchEvents({})
})

function clearFilters() {
  searchQuery.value = ''
  selectedLocationId.value = null
}

function getLocationName(locationId: number) {
  const loc = locationsMock.find(l => l.id === locationId)
  return loc ? loc.name : 'Unknown'
}

</script>
