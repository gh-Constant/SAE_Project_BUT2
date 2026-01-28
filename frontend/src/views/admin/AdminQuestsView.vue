<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <i class="fas fa-scroll text-antique-bronze"></i>
            {{ t('admin.quests.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey mb-6">{{ t('admin.quests.subtitle') }}</p>
          <router-link 
            to="/admin/quests/stats" 
            class="group inline-flex items-center gap-3 bg-gradient-to-br from-aged-paper to-warm-sand border-2 border-antique-bronze/30 text-iron-black font-medieval font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fas fa-chart-pie text-white"></i>
            </div>
            {{ t('admin.quests.view_stats') }}
            <svg class="w-5 h-5 text-antique-bronze group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>

        <!-- Search and Filter Bar -->
        <div class="mb-8 bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <label for="search" class="sr-only">{{ t('admin.quests.search.label') }}</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-antique-bronze/50"></i>
                </div>
                <input
                  id="search"
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('admin.quests.search.placeholder')"
                  class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-antique-bronze transition-colors"
                >
                  <i class="fas fa-times text-stone-grey/50"></i>
                </button>
              </div>
            </div>
            <div class="md:w-64">
              <label for="locationFilter" class="sr-only">{{ t('admin.quests.filter.location') }}</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-map-marker-alt text-antique-bronze/50"></i>
                </div>
                <select
                  id="locationFilter"
                  v-model="selectedLocationId"
                  class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey appearance-none cursor-pointer font-body"
                >
                  <option :value="null">{{ t('admin.quests.filter.all_locations') }}</option>
                  <option v-for="location in allLocations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-antique-bronze/50"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Advanced Filters Row -->
          <div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-antique-bronze/10">
            <!-- Show only with quests toggle -->
            <label class="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                v-model="showOnlyWithQuests"
                class="w-4 h-4 text-antique-bronze bg-white/80 border-antique-bronze/30 rounded focus:ring-antique-bronze cursor-pointer"
              >
              <span class="text-sm font-body text-stone-grey group-hover:text-iron-black transition-colors">
                {{ t('admin.quests.filter.only_with_quests') }}
              </span>
            </label>
            
            <!-- Stats summary -->
            <div class="ml-auto flex items-center gap-4 text-sm text-stone-grey">
              <span class="flex items-center gap-1">
                <i class="fas fa-map-marker-alt text-antique-bronze"></i>
                <strong class="text-iron-black">{{ filteredLocations.length }}</strong>
                {{ t('admin.quests.stats.locations') }}
              </span>
              <span class="flex items-center gap-1">
                <i class="fas fa-scroll text-antique-bronze"></i>
                <strong class="text-iron-black">{{ totalQuestsCount }}</strong>
                {{ t('admin.quests.stats.quests') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Location Sections -->
        <div v-for="location in displayedLocations" :key="location.id" class="mb-12">
          
          <!-- Location Header -->
          <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-t-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-antique-bronze"></div>
            
            <div>
              <h2 class="text-2xl font-medieval font-bold text-iron-black flex items-center gap-3">
                <i class="fas fa-map-marker-alt text-antique-bronze"></i>
                {{ location.name }}
              </h2>
              <p class="text-sm font-body text-stone-grey mt-1 italic">
                {{ t('admin.quests.location.quest_count', questsByLocation(location.id).length) }}
              </p>
            </div>
            

          </div>



          <!-- Quests Table -->
          <div class="bg-white/60 backdrop-blur-sm border-x border-b border-antique-bronze/20 rounded-b-lg overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/10">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.quests.table.headers.title') }}</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.quests.table.headers.description') }}</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.quests.table.headers.reward') }}</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.quests.table.headers.actions') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-antique-bronze/10 font-body">
                  <tr v-for="quest in questsByLocation(location.id)" :key="quest.id_quest" class="hover:bg-antique-bronze/5 transition-colors">
                    <td class="px-6 py-4">
                      <div v-if="editingQuestId !== quest.id_quest" class="text-sm font-bold text-iron-black">{{ quest.title }}</div>
                      <input 
                        v-else 
                        v-model="editQuest.title" 
                        class="w-full text-sm border border-antique-bronze/30 rounded px-2 py-1 focus:ring-1 focus:ring-antique-bronze"
                      >
                    </td>
                    <td class="px-6 py-4">
                      <div v-if="editingQuestId !== quest.id_quest" class="text-sm text-stone-grey line-clamp-2">{{ quest.description }}</div>
                      <textarea 
                        v-else 
                        v-model="editQuest.description" 
                        rows="2"
                        class="w-full text-sm border border-antique-bronze/30 rounded px-2 py-1 focus:ring-1 focus:ring-antique-bronze"
                      ></textarea>
                    </td>
                    <td class="px-6 py-4 text-center whitespace-nowrap">
                      <span v-if="editingQuestId !== quest.id_quest" class="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-yellow-100/80 text-yellow-900 border-yellow-200">
                        {{ quest.xp_reward }} XP
                      </span>
                      <input 
                        v-else 
                        v-model.number="editQuest.xp_reward" 
                        type="number" 
                        class="w-20 text-sm border border-antique-bronze/30 rounded px-2 py-1 text-center focus:ring-1 focus:ring-antique-bronze"
                      >
                    </td>
                    <td class="px-6 py-4 text-center whitespace-nowrap">
                      <div class="flex items-center justify-center gap-2">
                        <template v-if="editingQuestId !== quest.id_quest">
                          <button 
                            @click="startEditQuest(quest)" 
                            class="text-stone-grey hover:text-antique-bronze transition-colors p-1"
                            :title="t('admin.quests.table.actions.edit')"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button 
                            @click="deleteQuest(quest.id_quest)" 
                            class="text-stone-grey hover:text-red-700 transition-colors p-1"
                            :title="t('admin.quests.table.actions.delete')"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </template>
                        <template v-else>
                          <button 
                            @click="saveEditQuest()" 
                            class="text-green-700 hover:text-green-800 transition-colors p-1"
                            :title="t('admin.quests.table.actions.save')"
                          >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                          </button>
                          <button 
                            @click="cancelEditQuest()" 
                            class="text-red-700 hover:text-red-800 transition-colors p-1"
                            :title="t('admin.quests.table.actions.cancel')"
                          >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </template>
                      </div>
                    </td>
                  </tr>
                  
                  <tr v-if="questsByLocation(location.id).length === 0">
                    <td colspan="4" class="px-6 py-16 text-center bg-white/40">
                      <div class="flex flex-col items-center">
                        <div class="w-16 h-16 bg-stone-grey/10 rounded-full flex items-center justify-center mb-4">
                          <i class="fas fa-scroll text-3xl text-stone-grey"></i>
                        </div>
                        <p class="text-iron-black font-medieval text-lg">{{ t('admin.quests.table.empty.title') }}</p>
                        <p class="text-sm text-stone-grey mt-1 font-body">{{ t('admin.quests.table.empty.subtitle') }}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- View More Button -->
        <div v-if="hasMoreLocations" class="text-center mb-12">
          <button 
            @click="showAllLocations = true"
            class="inline-flex items-center gap-3 bg-white/60 hover:bg-white/80 text-iron-black font-medieval font-bold py-3 px-8 rounded-lg border-2 border-antique-bronze/30 hover:border-antique-bronze/60 transition-all shadow-sm hover:shadow-md"
          >
            <i class="fas fa-chevron-down text-antique-bronze"></i>
            {{ t('admin.quests.view_more', { remaining: remainingLocationsCount }) }}
          </button>
        </div>

        <!-- No Locations -->
        <div v-if="filteredLocations.length === 0" class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
          <i class="fas fa-search text-6xl text-antique-bronze/30 mb-4"></i>
          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
            {{ t('admin.quests.no_results.title') }}
          </h3>
          <p class="text-stone-grey mb-6">
            {{ t('admin.quests.no_results.subtitle') }}
          </p>
          <button 
            @click="clearFilters"
            class="inline-block bg-antique-bronze text-white px-6 py-2 rounded font-medieval hover:bg-antique-bronze/90 transition-colors"
          >
            <i class="fas fa-undo mr-2"></i>
            {{ t('admin.quests.no_results.reset') }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminNavbar from '@/components/navbar/AdminNavbar.vue'
import { locationService } from '@/services/locationService'
import { questService, Quest } from '@/services/questService'
import { useI18n } from 'vue-i18n'
import { LocationMock } from '@/mocks/locations'

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// State
const allLocations = ref<LocationMock[]>([])
const allQuests = ref<Quest[]>([])
const searchQuery = ref('')
const selectedLocationId = ref<number | null>(null)
const showOnlyWithQuests = ref(false)
const showAllLocations = ref(false)
const LOCATIONS_LIMIT = 10
const editingQuestId = ref<number | null>(null)

const editQuest = ref({
  title: '',
  description: '',
  xp_reward: 10
})

// Load data on mount
onMounted(async () => {
  try {
    allLocations.value = await locationService.getAllLocations()
    await loadAllQuests()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
})

const loadAllQuests = async () => {
  const quests: Quest[] = []
  for (const loc of allLocations.value) {
    try {
      const locQuests = await questService.getQuestsByLocation(loc.id)
      quests.push(...locQuests)
    } catch (e) { /* ignore */ }
  }
  allQuests.value = quests
}

// Computed
const filteredLocations = computed(() => {
  let locations = allLocations.value

  if (selectedLocationId.value !== null) {
    locations = locations.filter(loc => loc.id === selectedLocationId.value)
  }

  if (showOnlyWithQuests.value) {
    const locationIdsWithQuests = new Set(allQuests.value.map(q => q.id_location))
    locations = locations.filter(loc => locationIdsWithQuests.has(loc.id))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    const matchingQuestLocationIds = new Set(
      allQuests.value
        .filter(q => 
          q.title.toLowerCase().includes(query) || 
          q.description.toLowerCase().includes(query)
        )
        .map(q => q.id_location)
    )
    locations = locations.filter(loc => 
      loc.name.toLowerCase().includes(query) || 
      matchingQuestLocationIds.has(loc.id)
    )
  }

  return locations
})

const displayedLocations = computed(() => {
  if (showAllLocations.value || selectedLocationId.value !== null || searchQuery.value) {
    return filteredLocations.value
  }
  return filteredLocations.value.slice(0, LOCATIONS_LIMIT)
})

const hasMoreLocations = computed(() => {
  return !showAllLocations.value && 
         selectedLocationId.value === null && 
         !searchQuery.value &&
         filteredLocations.value.length > LOCATIONS_LIMIT
})

const remainingLocationsCount = computed(() => {
  return filteredLocations.value.length - LOCATIONS_LIMIT
})

const totalQuestsCount = computed(() => {
  return filteredLocations.value.reduce((sum, loc) => sum + questsByLocation(loc.id).length, 0)
})

function questsByLocation(locationId: number) {
  let quests = allQuests.value.filter(q => q.id_location === locationId)
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    quests = quests.filter(q => 
      q.title.toLowerCase().includes(query) || 
      q.description.toLowerCase().includes(query)
    )
  }
  
  return quests
}

// Actions
function clearFilters() {
  searchQuery.value = ''
  selectedLocationId.value = null
  showOnlyWithQuests.value = false
  showAllLocations.value = false
}



function startEditQuest(quest: Quest) {
  editingQuestId.value = quest.id_quest
  editQuest.value = {
    title: quest.title,
    description: quest.description,
    xp_reward: quest.xp_reward
  }
}

function cancelEditQuest() {
  editingQuestId.value = null
}

async function saveEditQuest() {
  if (!editingQuestId.value) return
  
  try {
    await questService.updateQuest(editingQuestId.value, editQuest.value)
    await loadAllQuests()
    editingQuestId.value = null
  } catch (error) {
    console.error('Failed to update quest:', error)
    alert('Erreur lors de la modification de la quête')
  }
}

async function deleteQuest(questId: number) {
  if (!confirm('Voulez-vous vraiment supprimer cette quête ?')) return
  
  try {
    await questService.deleteQuest(questId)
    await loadAllQuests()
  } catch (error) {
    console.error('Failed to delete quest:', error)
    alert('Erreur lors de la suppression de la quête')
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
