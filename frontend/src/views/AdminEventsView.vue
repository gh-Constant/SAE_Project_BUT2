<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <i class="fas fa-calendar-alt text-antique-bronze"></i>
            {{ t('admin.events.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">{{ t('admin.events.subtitle') }}</p>
        </div>

        <div class="mb-8 space-y-4">
          <!-- Filters -->
          <div class="bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Search -->
              <div class="flex-1">
                <label for="search" class="sr-only">{{ t('admin.events.search.label') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-antique-bronze/50"></i>
                  </div>
                  <input
                    id="search"
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('admin.events.search.placeholder')"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body"
                  />
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-antique-bronze transition-colors"
                    :title="t('admin.events.search.clear')"
                  >
                    <i class="fas fa-times text-stone-grey/50"></i>
                  </button>
                </div>
              </div>

              <!-- Location Filter -->
              <div class="md:w-64">
                <label for="locationFilter" class="sr-only">{{ t('admin.events.filter.location') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-map-marker-alt text-antique-bronze/50"></i>
                  </div>
                  <select
                    id="locationFilter"
                    v-model="selectedLocationId"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey appearance-none cursor-pointer font-body"
                  >
                    <option :value="null">{{ t('admin.events.filter.all_locations') }}</option>
                    <option v-for="loc in locationsMock" :key="loc.id" :value="loc.id">
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
              {{ t('admin.events.filter.reset') }}
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-antique-bronze/10">
              <thead class="bg-antique-bronze/10">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.events.table.headers.title') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.events.table.headers.date') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.events.table.headers.location') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.events.table.headers.price') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.events.table.headers.capacity') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.events.table.headers.sold') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.events.table.headers.actions') }}</th>
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
                      @click="deleteEvent(event.id_event)"
                      class="text-stone-grey hover:text-red-700 transition-colors p-1"
                      :title="t('admin.events.table.actions.delete')"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredEvents.length === 0">
                  <td colspan="7" class="px-6 py-16 text-center bg-white/40">
                    <div class="flex flex-col items-center">
                      <div class="w-16 h-16 bg-stone-grey/10 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-calendar-times text-2xl text-stone-grey"></i>
                      </div>
                      <p class="text-iron-black font-medieval text-lg">{{ t('admin.events.table.empty.title') }}</p>
                      <p class="text-sm text-stone-grey mt-1 font-body">{{ t('admin.events.table.empty.subtitle') }}</p>
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
import AdminNavbar from '@/components/navbar/AdminNavbar.vue'
import { locationsMock } from '@/mocks/locations'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const eventStore = useEventStore()

const user = computed(() => authStore.user)

const searchQuery = ref('')
const selectedLocationId = ref<number | null>(null)

// Computed
const filteredEvents = computed(() => {
  let events = eventStore.events

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
  eventStore.fetchEvents({})
})

// Methods
function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function clearFilters() {
  searchQuery.value = ''
  selectedLocationId.value = null
}

function getLocationName(locationId: number) {
  const loc = locationsMock.find(l => l.id === locationId)
  return loc ? loc.name : 'Unknown'
}

async function deleteEvent(id: number) {
  if (confirm(t('admin.products.table.actions.delete') + '?')) { // Reusing product delete confirm or use generic
     await eventStore.deleteEvent(id)
  }
}
</script>
