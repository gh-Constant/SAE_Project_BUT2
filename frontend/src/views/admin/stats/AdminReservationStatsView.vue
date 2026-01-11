<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />

    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <i class="fas fa-calendar-check text-antique-bronze"></i>
            {{ t('admin.reservation_stats.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base text-stone-grey">
            {{ t('admin.reservation_stats.subtitle') }}
          </p>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-bronze"></div>
        </div>

        <template v-else>
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            <!-- Total reservations -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-calendar text-2xl text-white"></i>
                </div>
                <h3 class="text-sm uppercase tracking-widest font-bold">{{ t('admin.reservation_stats.total_reservations') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black">
                  {{ stats.totalReservations }}
                </p>
              </div>
            </div>

            <!-- Total revenue -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-coins text-2xl text-white"></i>
                </div>
                <h3 class="text-sm uppercase tracking-widest font-bold">{{ t('admin.reservation_stats.revenue') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black">
                  {{ formatCurrency(stats.totalRevenue) }}
                </p>
              </div>
            </div>

            <!-- Average -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-receipt text-2xl text-white"></i>
                </div>
                <h3 class="text-sm uppercase tracking-widest font-bold">{{ t('admin.reservation_stats.average_basket') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black">
                  {{ formatCurrency(stats.averageReservationValue) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Status distribution -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                  <i class="fas fa-chart-pie text-antique-bronze"></i>
                  {{ t('admin.reservation_stats.status_distribution') }}
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div v-for="s in statusDistribution" :key="s.status">
                  <div class="flex justify-between text-sm mb-1">
                    <span>{{ s.label }}</span>
                    <span>{{ s.count }}</span>
                  </div>
                  <div class="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full"
                      :style="{ width: s.percentage + '%', backgroundColor: s.color }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Revenue by location -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                  <i class="fas fa-map-marked-alt text-antique-bronze"></i>
                  {{ t('admin.reservation_stats.revenue_by_location') }}
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div v-for="loc in locationStats" :key="loc.id">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-bold">{{ loc.name }}</span>
                    <span>{{ formatCurrency(loc.revenue) }}</span>
                  </div>
                  <div class="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-antique-bronze to-[#a88558]"
                      :style="{ width: getPercentage(loc.revenue) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg">
            <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
              <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                <i class="fas fa-table text-antique-bronze"></i>
                {{ t('admin.reservation_stats.details_by_location') }}
              </h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase">{{ t('admin.reservation_stats.location') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-bold uppercase">{{ t('admin.reservation_stats.reservations') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-bold uppercase">{{ t('admin.reservation_stats.table_revenue') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-antique-bronze/10">
                  <tr v-for="loc in locationStats" :key="loc.id" class="hover:bg-antique-bronze/5">
                    <td class="px-6 py-4 font-bold text-iron-black">{{ loc.name }}</td>
                    <td class="px-6 py-4 text-center">{{ loc.reservationCount }}</td>
                    <td class="px-6 py-4 text-center font-medieval text-amber-700">
                      {{ formatCurrency(loc.revenue) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import AdminNavbar from '@/components/navbar/AdminNavbar.vue'
import { reservationStatisticService } from '@/services/reservationStatisticService'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const user = computed(() => authStore.user)

const isLoading = ref(true)
const stats = ref<any>({})
const statusDistribution = ref<any[]>([])
const locationStats = ref<any[]>([])

onMounted(async () => {
  const data = await reservationStatisticService.getStatistics()
  stats.value = data.stats
  statusDistribution.value = data.statusDistribution
  locationStats.value = data.locationStats
  isLoading.value = false
})

function formatCurrency(amount: number) {
  return amount.toFixed(2).replace('.', ',') + ' €'
}

function getPercentage(value: number) {
  const max = Math.max(...locationStats.value.map(l => l.revenue), 1)
  return Math.round((value / max) * 100)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
