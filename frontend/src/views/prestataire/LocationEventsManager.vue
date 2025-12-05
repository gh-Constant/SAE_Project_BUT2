<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- En-tête -->
      <div class="mb-8">
        <button
          @click="router.back()"
          class="mb-6 inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group"
        >
          <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
          Retour aux lieux
        </button>
        
        <div class="bg-white/60 p-6 rounded-sm border-2 border-antique-bronze/20 shadow-sm text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-antique-bronze to-transparent opacity-50"></div>
          
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center">
            <i class="fas fa-calendar-alt mr-4 text-antique-bronze"></i>
            Gestion des Événements
          </h1>
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
      <div class="mb-8 bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <!-- Recherche -->
        <div class="relative w-full md:w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-antique-bronze/50"></i>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un événement..."
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

        <!-- Bouton Créer -->
        <button 
          @click="openCreateModal"
          class="w-full md:w-auto bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-2.5 px-6 rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <i class="fas fa-plus-circle"></i>
          Créer un événement
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse text-antique-bronze">Consultation des astres...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEvents.length === 0" class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
        <i class="fas fa-calendar-times text-6xl text-antique-bronze/30 mb-4"></i>
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
          Aucun événement trouvé
        </h3>
        <p class="text-stone-grey mb-6">
          Commencez par organiser votre premier événement festif !
        </p>
        <button 
          @click="openCreateModal"
          class="inline-flex items-center text-antique-bronze font-bold hover:underline"
        >
          Créer un événement maintenant
        </button>
      </div>

      <!-- Grid of Events -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="event in filteredEvents" 
          :key="event.id_event" 
          class="bg-white/60 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-antique-bronze/20 hover:border-antique-bronze/60 flex flex-col group"
        >
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
            <h3 class="text-xl font-medieval font-bold text-iron-black mb-2 group-hover:text-antique-bronze transition-colors">
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
                <div 
                  class="bg-antique-bronze h-full rounded-full transition-all duration-500" 
                  :style="{ width: getProgress(event) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-auto pt-4 border-t border-antique-bronze/10">
              <button 
                @click="editEvent(event)" 
                class="flex-1 bg-white hover:bg-stone-50 text-indigo-700 border border-indigo-200 font-bold py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-center gap-2"
              >
                <i class="fas fa-edit"></i> Modifier
              </button>
              <button 
                @click="deleteEvent(event.id_event)" 
                class="flex-1 bg-white hover:bg-stone-50 text-red-700 border border-red-200 font-bold py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-center gap-2"
              >
                <i class="fas fa-trash-alt"></i> Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Create/Edit Modal (Styled) -->
    <div v-if="showModal" class="fixed inset-0 z-[2000] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-parchment rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-antique-bronze relative z-10" @click.stop>
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
                <label class="block text-sm font-bold text-iron-black mb-1">Titre de l'événement</label>
                <input v-model="form.title" type="text" class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white">
              </div>
              <div>
                <label class="block text-sm font-bold text-iron-black mb-1">Description</label>
                <textarea v-model="form.description" rows="3" class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-1">Début</label>
                  <input v-model="form.start_time" type="datetime-local" class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white text-sm">
                </div>
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-1">Fin</label>
                  <input v-model="form.end_time" type="datetime-local" class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white text-sm">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-1">Prix (Gold)</label>
                  <div class="relative">
                    <input v-model.number="form.price" type="number" min="0" class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white pl-8">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-coins text-antique-bronze/50 text-xs"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-1">Capacité</label>
                  <div class="relative">
                    <input v-model.number="form.capacity" type="number" min="1" class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white pl-8">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-users text-antique-bronze/50 text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-antique-bronze/5 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-antique-bronze/10">
            <button @click="saveEvent" type="button" class="w-full inline-flex justify-center rounded-sm border border-transparent shadow-sm px-4 py-2 bg-antique-bronze text-base font-medium text-white hover:brightness-110 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              {{ isEditing ? 'Mettre à jour' : 'Publier' }}
            </button>
            <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-sm border border-stone-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-stone-700 hover:bg-stone-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore, Event } from '@/stores/event'

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()

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

onMounted(async () => {
  loading.value = true
  await eventStore.fetchEvents({ id_location: locationId })
  loading.value = false
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
    id_location: locationId
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
