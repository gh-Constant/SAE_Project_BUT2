<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <i class="fas fa-scroll text-antique-bronze"></i>
            Gestion des Quêtes
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">Créez et gérez les quêtes pour vos établissements</p>
        </div>

        <!-- Location Sections -->
        <div v-for="location in prestataireLocations" :key="location.id" class="mb-12">
          
          <!-- Location Header -->
          <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-t-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-antique-bronze"></div>
            
            <div>
              <h2 class="text-2xl font-medieval font-bold text-iron-black flex items-center gap-3">
                <i class="fas fa-map-marker-alt text-antique-bronze"></i>
                {{ location.name }}
              </h2>
              <p class="text-sm font-body text-stone-grey mt-1 italic">
                {{ questsByLocation(location.id).length }} 
                {{ questsByLocation(location.id).length > 1 ? 'quêtes actives' : 'quête active' }}
              </p>
            </div>
            
            <button 
              v-if="addingQuestLocationId !== location.id"
              @click="startAddQuest(location.id)"
              class="group bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-2 px-5 rounded-md transition-all duration-200 shadow-md flex items-center gap-2"
            >
              <i class="fas fa-plus transition-transform group-hover:rotate-90"></i>
              Créer une quête
            </button>
          </div>

          <!-- Add Quest Form -->
          <div v-if="addingQuestLocationId === location.id" class="bg-parchment-light border-x border-b border-antique-bronze/20 p-8 shadow-inner relative">
            <div class="absolute top-0 left-0 right-0 h-px bg-antique-bronze/10"></div>
            
            <h3 class="text-xl font-medieval font-bold text-iron-black mb-6 flex items-center gap-2">
              <i class="fas fa-feather-alt text-antique-bronze"></i>
              Rédiger une nouvelle quête
            </h3>

            <form @submit.prevent="createQuest(location.id)">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medieval font-bold text-iron-black mb-2">Titre de la quête</label>
                  <input 
                    v-model="newQuest.title" 
                    type="text" 
                    required 
                    class="w-full bg-white/50 border border-antique-bronze/30 rounded-md px-4 py-2 text-iron-black placeholder-stone-grey/50 focus:ring-2 focus:ring-antique-bronze focus:border-antique-bronze transition-all font-body"
                    placeholder="Ex: Livrer un colis au château"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medieval font-bold text-iron-black mb-2">Récompense (XP)</label>
                  <div class="relative">
                    <input 
                      v-model.number="newQuest.xp_reward" 
                      type="number" 
                      required 
                      min="1"
                      class="w-full bg-white/50 border border-antique-bronze/30 rounded-md pl-4 pr-12 py-2 text-iron-black focus:ring-2 focus:ring-antique-bronze focus:border-antique-bronze font-body"
                      placeholder="10"
                    >
                    <span class="absolute right-4 top-2 text-antique-bronze font-medieval font-bold">XP</span>
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medieval font-bold text-iron-black mb-2">Description détaillée</label>
                  <textarea 
                    v-model="newQuest.description" 
                    rows="3" 
                    required
                    class="w-full bg-white/50 border border-antique-bronze/30 rounded-md px-4 py-2 text-iron-black placeholder-stone-grey/50 focus:ring-2 focus:ring-antique-bronze focus:border-antique-bronze font-body"
                    placeholder="Décrivez les objectifs de la quête..."
                  ></textarea>
                </div>
              </div>

              <div class="mt-8 flex justify-end gap-3 border-t border-antique-bronze/10 pt-6">
                <button 
                  type="button"
                  @click="cancelAddQuest" 
                  class="px-6 py-2.5 rounded-md font-body font-semibold text-stone-grey hover:bg-stone-grey/10 transition-colors"
                >
                  Abandonner
                </button>
                <button 
                  type="submit" 
                  :disabled="isSubmitting"
                  class="bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-2.5 px-6 rounded-md shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <i class="fas fa-check"></i>
                  {{ isSubmitting ? 'Publication...' : 'Publier la quête' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Quests Table -->
          <div class="bg-white/60 backdrop-blur-sm border-x border-b border-antique-bronze/20 rounded-b-lg overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/10">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Titre</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Description</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Récompense</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-antique-bronze/10 font-body">
                  <tr v-for="quest in questsByLocation(location.id)" :key="quest.id_quest" class="hover:bg-antique-bronze/5 transition-colors">
                    <td class="px-6 py-4">
                      <div class="text-sm font-bold text-iron-black">{{ quest.title }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-stone-grey line-clamp-2">{{ quest.description }}</div>
                    </td>
                    <td class="px-6 py-4 text-center whitespace-nowrap">
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-yellow-100/80 text-yellow-900 border-yellow-200">
                        {{ quest.xp_reward }} XP
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center whitespace-nowrap">
                      <button 
                        @click="deleteQuest(quest.id_quest)" 
                        class="text-stone-grey hover:text-red-700 transition-colors p-1"
                        title="Supprimer"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  
                  <tr v-if="questsByLocation(location.id).length === 0">
                    <td colspan="4" class="px-6 py-16 text-center bg-white/40">
                      <div class="flex flex-col items-center">
                        <div class="w-16 h-16 bg-stone-grey/10 rounded-full flex items-center justify-center mb-4">
                          <i class="fas fa-scroll text-3xl text-stone-grey"></i>
                        </div>
                        <p class="text-iron-black font-medieval text-lg">Aucune quête créée</p>
                        <p class="text-sm text-stone-grey mt-1 font-body">Créez votre première quête pour attirer les aventuriers</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- No Locations -->
        <div v-if="prestataireLocations.length === 0" class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
          <i class="fas fa-dungeon text-6xl text-antique-bronze/30 mb-4"></i>
          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
            Vous ne possédez aucun lieu
          </h3>
          <p class="text-stone-grey mb-6">
            Explorez la carte pour acquérir votre premier établissement.
          </p>
          <router-link to="/map" class="inline-block bg-antique-bronze text-white px-6 py-2 rounded font-medieval hover:bg-antique-bronze/90 transition-colors">
            <i class="fas fa-map mr-2"></i>
            Explorer la carte
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { locationService } from '@/services/locationService'
import { questService, Quest } from '@/services/questService'
import { LocationMock } from '@/mocks/locations'

const authStore = useAuthStore()
const addingQuestLocationId = ref<number | null>(null)
const isSubmitting = ref(false)
const allLocations = ref<LocationMock[]>([])
const allQuests = ref<Quest[]>([])

const newQuest = ref({
  title: '',
  description: '',
  xp_reward: 10
})

onMounted(async () => {
  try {
    allLocations.value = await locationService.getAllLocations()
    await loadAllQuests()
  } catch (error) {
    console.error('Failed to fetch locations:', error)
  }
})

const loadAllQuests = async () => {
  const quests: Quest[] = []
  for (const loc of prestataireLocations.value) {
    try {
      const locQuests = await questService.getQuestsByLocation(loc.id)
      quests.push(...locQuests)
    } catch (e) { /* ignore */ }
  }
  allQuests.value = quests
}

const prestataireLocations = computed(() => {
  const userId = authStore.user?.id
  if (!userId) return []
  return allLocations.value.filter(loc => loc.id_prestataire === userId)
})

function questsByLocation(locationId: number) {
  return allQuests.value.filter(q => q.id_location === locationId)
}

function startAddQuest(locationId: number) {
  addingQuestLocationId.value = locationId
}

function cancelAddQuest() {
  addingQuestLocationId.value = null
  newQuest.value = { title: '', description: '', xp_reward: 10 }
}

async function createQuest(locationId: number) {
  if (!newQuest.value.title || !newQuest.value.description) return
  
  try {
    isSubmitting.value = true
    await questService.createQuest({
      ...newQuest.value,
      id_location: locationId
    })
    cancelAddQuest()
    await loadAllQuests()
  } catch (error) {
    console.error('Failed to create quest:', error)
    alert('Erreur lors de la création de la quête')
  } finally {
    isSubmitting.value = false
  }
}

async function deleteQuest(questId: number) {
  if (!confirm('Voulez-vous vraiment supprimer cette quête ?')) return
  // TODO: Implement delete in backend
  alert('La suppression des quêtes sera bientôt disponible.')
}
</script>
