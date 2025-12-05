<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- En-tête -->
        <div class="mb-8 text-center">
          <h1 class="text-4xl md:text-5xl font-medieval font-bold text-iron-black mb-4">
            <i class="fas fa-map-marked-alt mr-3 text-antique-bronze"></i>
            Mes Lieux
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-6"></div>
          <p class="text-lg text-stone-grey">Gérez vos établissements, vos événements et vos marchandises</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <p class="text-xl font-medieval animate-pulse text-antique-bronze">Chargement de vos terres...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="locations.length === 0" class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
          <i class="fas fa-dungeon text-6xl text-antique-bronze/30 mb-4"></i>
          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
            Vous ne possédez aucun lieu
          </h3>
          <p class="text-stone-grey mb-6">
            Explorez la carte pour acquérir votre premier établissement.
          </p>
          <router-link to="/map">
            <MedievalButton>
              <i class="fas fa-map mr-2"></i>
              Explorer la carte
            </MedievalButton>
          </router-link>
        </div>

        <!-- Grid of Locations -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="location in locations" 
            :key="location.id" 
            class="bg-white/60 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border-2 border-antique-bronze/20 hover:border-antique-bronze/60 flex flex-col"
          >
            <!-- Image Section -->
            <div class="h-48 bg-antique-bronze/10 overflow-hidden relative group">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <img
                v-if="location.banner_image"
                :src="location.banner_image"
                :alt="location.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-stone-200">
                 <i class="fas fa-store text-6xl text-stone-400"></i>
              </div>
              <!-- Title Overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h2 class="text-2xl font-medieval font-bold text-white shadow-sm">{{ location.name }}</h2>
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="p-6 flex-1 flex flex-col">
              <p class="text-stone-grey mb-6 line-clamp-3 italic flex-1">{{ location.description }}</p>
              
              <div class="space-y-3 mt-auto pt-4 border-t border-antique-bronze/20">
                <button 
                  @click="manageEvents(location.id)"
                  class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-2.5 px-4 rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
                >
                  <i class="fas fa-calendar-alt group-hover:scale-110 transition-transform"></i>
                  Gérer les événements
                </button>
                
                <button 
                  @click="manageShop(location.id)"
                  class="w-full bg-white/50 hover:bg-white text-antique-bronze border border-antique-bronze font-medieval font-bold py-2.5 px-4 rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
                >
                  <i class="fas fa-store group-hover:scale-110 transition-transform"></i>
                  Gérer la boutique
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { locationService } from '@/services/locationService'
import { LocationMock } from '@/mocks/locations'
import MedievalButton from '@/components/ui/MedievalButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const allLocations = ref<LocationMock[]>([])

onMounted(async () => {
  loading.value = true
  try {
    allLocations.value = await locationService.getAllLocations()
  } catch (error) {
    console.error('Failed to fetch locations:', error)
  } finally {
    loading.value = false
  }
})

const locations = computed(() => {
  const userId = authStore.user?.id
  if (!userId) return []
  return allLocations.value.filter(loc => loc.id_prestataire === userId)
})

function manageEvents(locationId: number) {
  router.push(`/prestataire/location/${locationId}/events`)
}

function manageShop(locationId: number) {
  router.push(`/prestataire/products?locationId=${locationId}`)
}
</script>
