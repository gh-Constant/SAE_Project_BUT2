<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <button
            @click="router.push('/prestataire')"
            class="mb-6 inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group"
          >
            <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {{ t('prestataire.details.back') || 'Retour' }}
          </button>
          
          <div class="text-center">
            <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
              <i class="fas fa-scroll text-antique-bronze"></i>
              {{ t('prestataire.reservations.title') || 'Gestion des Réservations' }}
            </h1>
            <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
            <p class="text-base font-body text-stone-grey">{{ t('prestataire.reservations.subtitle') || 'Suivez les inscriptions à vos événements' }}</p>
          </div>
        </div>

        <div class="mb-8 space-y-4">
          <!-- Filters -->
          <div class="bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Search -->
              <div class="flex-1">
                <label for="search" class="sr-only">{{ t('prestataire.reservations.search.label') || 'Rechercher' }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-antique-bronze/50"></i>
                  </div>
                  <input
                    id="search"
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('prestataire.reservations.search.placeholder') || 'Rechercher par client ou événement...'"
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
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-antique-bronze/10">
              <thead class="bg-antique-bronze/10">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.reservations.table.headers.event') || 'Événement' }}</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.reservations.table.headers.customer') || 'Client' }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.reservations.table.headers.date') || 'Date' }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.reservations.table.headers.quantity') || 'Qté' }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.reservations.table.headers.total') || 'Total' }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('prestataire.reservations.table.headers.status') || 'Statut' }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-antique-bronze/10 font-body">
                <tr v-for="reservation in filteredReservations" :key="reservation.id_reservation" class="hover:bg-antique-bronze/5 transition-colors">
                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-iron-black">{{ reservation.event?.title || 'Unknown Event' }}</div>
                    <div class="text-xs text-stone-grey">{{ reservation.event?.location?.name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-stone-700">
                      {{ reservation.user?.firstname }} {{ reservation.user?.lastname }}
                    </div>
                    <div class="text-xs text-stone-grey">{{ reservation.user?.email }}</div>
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-stone-600">
                    {{ new Date(reservation.created_at).toLocaleDateString() }}
                    <br>
                    <span class="text-xs">{{ new Date(reservation.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-stone-600">
                    {{ reservation.quantity }}
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-antique-bronze">
                    {{ reservation.total_price }} G
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap text-sm font-bold">
                    <span
                      :class="{
                        'text-green-600': reservation.status === 'CONFIRMED',
                        'text-yellow-600': reservation.status === 'PENDING',
                        'text-red-600': reservation.status === 'CANCELLED'
                      }"
                    >{{ reservation.status }}</span>
                  </td>
                </tr>
                <tr v-if="filteredReservations.length === 0">
                  <td colspan="6" class="px-6 py-16 text-center bg-white/40">
                    <div class="flex flex-col items-center">
                      <div class="w-16 h-16 bg-stone-grey/10 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-scroll text-2xl text-stone-grey"></i>
                      </div>
                      <p class="text-iron-black font-medieval text-lg">{{ t('prestataire.reservations.table.empty.title') || 'Aucune réservation' }}</p>
                      <p class="text-sm text-stone-grey mt-1 font-body">{{ t('prestataire.reservations.table.empty.subtitle') || 'Vos événements n\'ont pas encore reçu d\'inscriptions.' }}</p>
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
import { useEventStore } from '@/stores/event'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const eventStore = useEventStore()

const searchQuery = ref('')

const filteredReservations = computed(() => {
  let reservations = eventStore.providerReservations
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    reservations = reservations.filter(r => 
      (r.event?.title?.toLowerCase().includes(query)) ||
      (r.user?.firstname?.toLowerCase().includes(query)) ||
      (r.user?.lastname?.toLowerCase().includes(query)) ||
      (r.user?.email?.toLowerCase().includes(query))
    )
  }

  // Sort by date desc (most recent first)
  return [...reservations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

onMounted(() => {
  eventStore.fetchProviderReservations()
})
</script>
