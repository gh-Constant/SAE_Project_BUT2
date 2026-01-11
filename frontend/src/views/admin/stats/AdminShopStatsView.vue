<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />
    <!-- Main Content -->
    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <i class="fas fa-chart-line text-antique-bronze"></i>
            Statistiques Boutique
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">Analysez les performances de vente de votre boutique</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-bronze"></div>
        </div>

        <template v-else>
          <!-- Hero Stats - The Big Numbers -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <!-- Total Orders -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6">
                <div class="flex justify-center mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <i class="fas fa-shopping-cart text-2xl text-white"></i>
                  </div>
                </div>
                <div class="text-center">
                  <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">Total Commandes</h3>
                  <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ stats.totalOrders }}</p>
                  <p class="text-xs text-stone-grey/80 flex items-center justify-center gap-1">
                    <i class="fas fa-map-marker-alt text-antique-bronze"></i>
                    {{ stats.locationsWithSales }} lieux actifs
                  </p>
                </div>
              </div>
            </div>

            <!-- Total Revenue -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6">
                <div class="flex justify-center mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <i class="fas fa-coins text-2xl text-white"></i>
                  </div>
                </div>
                <div class="text-center">
                  <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">Chiffre d'Affaires</h3>
                  <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ formatCurrency(stats.totalRevenue) }}</p>
                  <p class="text-xs text-stone-grey/80 flex items-center justify-center gap-1">
                    <i class="fas fa-chart-line text-antique-bronze"></i>
                    Revenus totaux
                  </p>
                </div>
              </div>
            </div>

            <!-- Average Order Value -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6">
                <div class="flex justify-center mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <i class="fas fa-receipt text-2xl text-white"></i>
                  </div>
                </div>
                <div class="text-center">
                  <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">Panier Moyen</h3>
                  <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ formatCurrency(stats.averageOrderValue) }}</p>
                  <p class="text-xs text-stone-grey/80 flex items-center justify-center gap-1">
                    <i class="fas fa-box text-antique-bronze"></i>
                    {{ stats.totalProductsSold }} produits vendus
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div class="group bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center hover:shadow-lg transition-all relative overflow-hidden">
              <div class="absolute top-0 right-0 w-10 h-10 bg-antique-bronze/5 rounded-bl-full"></div>
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <i class="fas fa-check-circle text-white"></i>
              </div>
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.paidOrdersCount }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide">Payées</p>
            </div>
            
            <div class="group bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center hover:shadow-lg transition-all relative overflow-hidden">
              <div class="absolute top-0 right-0 w-10 h-10 bg-antique-bronze/5 rounded-bl-full"></div>
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <i class="fas fa-box-open text-white"></i>
              </div>
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.collectedOrdersCount }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide">Collectées</p>
            </div>
            
            <div class="group bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center hover:shadow-lg transition-all relative overflow-hidden">
              <div class="absolute top-0 right-0 w-10 h-10 bg-antique-bronze/5 rounded-bl-full"></div>
              <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <i class="fas fa-clock text-white"></i>
              </div>
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.waitingOrdersCount }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide">En attente</p>
            </div>
            
            <div class="group bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center hover:shadow-lg transition-all relative overflow-hidden">
              <div class="absolute top-0 right-0 w-10 h-10 bg-antique-bronze/5 rounded-bl-full"></div>
              <div class="w-10 h-10 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <i class="fas fa-box text-white"></i>
              </div>
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.totalProductsSold }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide">Produits vendus</p>
            </div>
          </div>

          <!-- Visualizations Row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            <!-- Order Status Distribution (Pie Chart) -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <i class="fas fa-chart-pie text-white text-sm"></i>
                  </div>
                  Statuts des Commandes
                </h3>
              </div>
              <div class="p-6 flex justify-center">
                <PieChart v-if="orderStatusChartData.length > 0" :data="orderStatusChartData" :size="240" :stroke-width="30" />
                <div v-else class="text-center py-8 text-stone-grey">
                  <i class="fas fa-chart-pie text-4xl opacity-30 mb-2"></i>
                  <p>Aucune donnée disponible</p>
                </div>
              </div>
            </div>

            <!-- Location Sales Distribution (Donut Chart) -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                    <i class="fas fa-map-marked-alt text-white text-sm"></i>
                  </div>
                  Ventes par Lieu
                </h3>
              </div>
              <div class="p-6 flex justify-center">
                <PieChart v-if="locationChartData.length > 0" :data="locationChartData" :size="240" :stroke-width="25" />
                <div v-else class="text-center py-8 text-stone-grey">
                  <i class="fas fa-map text-4xl opacity-30 mb-2"></i>
                  <p>Aucune donnée disponible</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Products & Location Stats -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- Top Products -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center">
                    <i class="fas fa-fire-alt text-white text-sm"></i>
                  </div>
                  Produits les Plus Vendus
                </h3>
              </div>
              <div class="p-6">
                <div v-for="(product, index) in topProducts" :key="product.id" class="flex items-center gap-4 py-3" :class="{ 'border-t border-antique-bronze/10': index > 0 }">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-medieval font-bold text-sm shadow-sm"
                    :class="{
                      'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900': index === 0,
                      'bg-gradient-to-br from-stone-300 to-stone-400 text-stone-700': index === 1,
                      'bg-gradient-to-br from-antique-bronze to-[#a88558] text-white': index === 2,
                      'bg-antique-bronze/10 text-antique-bronze': index > 2
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-iron-black truncate">{{ product.name }}</p>
                    <p class="text-xs text-stone-grey truncate">{{ product.locationName }}</p>
                  </div>
                  <div class="text-right">
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-antique-bronze/20 text-iron-black rounded-full text-xs font-bold">
                      <i class="fas fa-coins text-antique-bronze text-[10px]"></i>
                      {{ formatCurrency(product.revenue) }}
                    </span>
                    <p class="text-xs text-stone-grey mt-1">{{ product.quantitySold }} vendus</p>
                  </div>
                </div>
                <div v-if="topProducts.length === 0" class="text-center py-8 text-stone-grey">
                  <i class="fas fa-box text-4xl opacity-30 mb-2"></i>
                  <p>Aucun produit vendu</p>
                </div>
              </div>
            </div>

            <!-- Location Breakdown List -->
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center">
                    <i class="fas fa-list-ol text-white text-sm"></i>
                  </div>
                  Ventes par Lieu
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div v-for="loc in locationStats.slice(0, 6)" :key="loc.id" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-iron-black text-sm truncate flex-1 mr-4">{{ loc.name }}</span>
                    <span class="text-xs text-stone-grey whitespace-nowrap">{{ formatCurrency(loc.revenue) }}</span>
                  </div>
                  <div class="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-antique-bronze to-[#a88558] rounded-full transition-all duration-500"
                      :style="{ width: `${loc.percentage}%` }"
                    ></div>
                  </div>
                </div>
                <div v-if="locationStats.length === 0" class="text-center py-8 text-stone-grey">
                  <i class="fas fa-map text-4xl opacity-30 mb-2"></i>
                  <p>Aucune donnée disponible</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue Distribution Chart -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg mb-12">
            <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
              <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-sm">
                  <i class="fas fa-gem text-white text-sm"></i>
                </div>
                Répartition des Montants
              </h3>
            </div>
            <div class="p-6">
              <div class="flex items-end justify-around h-48 gap-2">
                <div v-for="(bucket, index) in revenueBuckets" :key="index" class="flex-1 flex flex-col items-center">
                  <div class="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-500 hover:from-amber-500 hover:to-amber-300 shadow-sm"
                    :style="{ height: `${bucket.percentage}%`, minHeight: bucket.count > 0 ? '8px' : '0' }"
                  ></div>
                  <div class="mt-2 text-center">
                    <p class="text-xs font-bold text-iron-black">{{ bucket.count }}</p>
                    <p class="text-[10px] text-stone-grey">{{ bucket.range }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Table -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
            <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20 flex justify-between items-center">
              <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center">
                  <i class="fas fa-table text-white text-sm"></i>
                </div>
                Détails par Lieu
              </h3>
              <router-link to="/admin/products" class="text-sm text-antique-bronze hover:underline flex items-center gap-1">
                Gérer les produits
                <i class="fas fa-arrow-right text-xs"></i>
              </router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medieval font-bold text-iron-black uppercase">Lieu</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">Commandes</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">Produits</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">Revenus</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">Part</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-antique-bronze/10">
                  <tr v-for="loc in locationStats" :key="loc.id" class="hover:bg-antique-bronze/5 transition-colors">
                    <td class="px-6 py-4">
                      <span class="font-bold text-iron-black">{{ loc.name }}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="px-2 py-1 bg-antique-bronze/10 text-antique-bronze border border-antique-bronze/20 rounded-full text-xs font-bold shadow-sm">{{ loc.orderCount }}</span>
                    </td>
                    <td class="px-6 py-4 text-center text-stone-grey">{{ loc.productsSold }}</td>
                    <td class="px-6 py-4 text-center">
                      <span class="font-medieval font-bold text-amber-700">{{ formatCurrency(loc.revenue) }}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div class="h-full bg-amber-500 rounded-full" :style="{ width: `${loc.percentage}%` }"></div>
                        </div>
                        <span class="text-xs text-stone-grey">{{ loc.percentage }}%</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="locationStats.length === 0">
                    <td colspan="5" class="px-6 py-8 text-center text-stone-grey">
                      Aucune donnée disponible
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
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminNavbar from '@/components/navbar/AdminNavbar.vue'
import PieChart from '@/components/charts/PieChart.vue'
import { 
  shopStatisticService, 
  ShopStatisticsData, 
  ShopStatistics, 
  TopProduct, 
  LocationStat, 
  RevenueBucket 
} from '@/services/shopStatisticService'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// State
const isLoading = ref(true)
const stats = ref<ShopStatistics>({
  totalOrders: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  totalProductsSold: 0,
  paidOrdersCount: 0,
  collectedOrdersCount: 0,
  waitingOrdersCount: 0,
  locationsWithSales: 0,
})
const topProducts = ref<TopProduct[]>([])
const locationStats = ref<LocationStat[]>([])
const revenueBuckets = ref<RevenueBucket[]>([])

// Chart data for PieChart component
const orderStatusChartData = ref<Array<{ label: string; count: number; color: string }>>([])
const locationChartData = ref<Array<{ label: string; count: number; color: string }>>([])

onMounted(async () => {
  try {
    isLoading.value = true
    const data: ShopStatisticsData = await shopStatisticService.getStatistics()
    
    stats.value = data.stats
    topProducts.value = data.topProducts
    locationStats.value = data.locationStats
    revenueBuckets.value = data.revenueBuckets

    // Transform data for PieChart
    orderStatusChartData.value = data.orderStatusDistribution.map(s => ({
      label: s.label,
      count: s.count,
      color: s.color,
    }))

    locationChartData.value = data.locationSalesDistribution.map(l => ({
      label: l.name,
      count: l.count,
      color: l.color,
    }))
  } catch (error) {
    console.error('Failed to fetch shop statistics:', error)
  } finally {
    isLoading.value = false
  }
})

// Helper to format currency
function formatCurrency(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + ' €'
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
