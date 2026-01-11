<template>
  <div class="min-h-screen bg-parchment py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-medieval font-bold text-iron-black mb-8 text-center">{{ t('reservations.title') }}</h1>
      
      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse">{{ t('reservations.loading') }}</p>
      </div>
      
      <div v-else-if="reservations.length === 0" class="text-center py-12 bg-white/40 rounded-lg border border-antique-bronze/20">
        <p class="text-xl font-medieval text-stone-grey mb-4">{{ t('reservations.empty.text') }}</p>
        <router-link to="/events" class="text-antique-bronze font-bold hover:underline">{{ t('reservations.empty.link') }}</router-link>
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="reservation in reservations" 
          :key="reservation.id_reservation" 
          class="bg-white/80 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row relative"
        >
          <!-- Status Badge -->
          <div class="absolute top-4 right-4">
            <span 
              class="px-3 py-1 rounded-full text-xs font-bold border"
              :class="{
                'bg-green-100 text-green-800 border-green-200': reservation.status === 'CONFIRMED',
                'bg-yellow-100 text-yellow-800 border-yellow-200': reservation.status === 'PENDING',
                'bg-red-100 text-red-800 border-red-200': reservation.status === 'CANCELLED'
              }"
            >
              {{ t(`reservations.status.${reservation.status.toLowerCase()}`) }}
            </span>
          </div>

          <!-- Ticket Stub (Visual) -->
          <div class="md:w-48 bg-antique-bronze text-white p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r-2 border-dashed border-white/30 relative">
            <div class="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-parchment rounded-full z-10 hidden md:block"></div>
            <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-parchment rounded-full z-10 hidden md:block"></div>
            
            <span class="text-sm uppercase tracking-widest opacity-80 mb-1">{{ t('reservations.ticket.label') }}</span>
            <span class="text-3xl font-medieval font-bold">#{{ reservation.id_reservation }}</span>
          </div>
          
          <div class="p-6 flex-1">
            <h2 class="text-2xl font-medieval font-bold text-iron-black mb-2">{{ reservation.event?.title || t('reservations.ticket.event_deleted') }}</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm text-stone-grey">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {{ formatDate(reservation.event?.start_time) }}
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ reservation.event?.location?.name || t('reservations.ticket.unknown_location') }}
              </div>
            </div>
            
            <div class="flex justify-between items-end mt-4 pt-4 border-t border-antique-bronze/10">
              <div>
                <p class="text-sm text-stone-grey">{{ t('reservations.ticket.quantity') }}: <span class="font-bold text-iron-black">{{ reservation.quantity }}</span></p>
              </div>
              <div class="text-right">
                <p class="text-xs text-stone-grey uppercase">{{ t('reservations.ticket.total_paid') }}</p>
                <p class="text-xl font-medieval font-bold text-antique-bronze">{{ reservation.total_price }} G</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- CTA Button to discover more events -->
        <div class="mt-12 text-center">
          <MedievalButton 
            to="/events" 
            class="!shadow-[0_2px_0_#5D4037] !active:translate-y-[2px] !text-lg !px-8 !py-4"
          >
            <i class="fas fa-sparkles mr-2"></i>
            Envie d'autres aventures épiques ?
            <i class="fas fa-arrow-right ml-2"></i>
          </MedievalButton>
          <p class="mt-4 text-sm text-stone-grey font-medieval">
            Découvrez nos prochains tournois, banquets et festivités légendaires
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useEventStore } from '@/stores/event'
import { useI18n } from 'vue-i18n'
import MedievalButton from '@/components/ui/MedievalButton.vue'

const { t } = useI18n()
const eventStore = useEventStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await eventStore.fetchUserReservations()
  loading.value = false
})

const reservations = computed(() => eventStore.userReservations)

function formatDate(dateStr?: string) {
  if (!dateStr) return t('reservations.ticket.unknown_date')
  return new Date(dateStr).toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
