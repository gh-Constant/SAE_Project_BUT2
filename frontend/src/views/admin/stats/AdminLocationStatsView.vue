<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />
    <BackToMapButton />

    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <i class="fas fa-map-marked-alt text-antique-bronze"></i>
            {{ t('admin.location_stats.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">{{ t('admin.location_stats.subtitle') }}</p>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-bronze"></div>
        </div>

        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-map text-2xl text-white"></i>
                </div>
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2 text-center">{{ t('admin.location_stats.cards.total_locations') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ stats.totalLocations }}</p>
                <p class="text-xs text-stone-grey/80">{{ stats.storyLocations }} {{ t('admin.location_stats.cards.story_locations') }}</p>
              </div>
            </div>

            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-store text-2xl text-white"></i>
                </div>
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2 text-center">{{ t('admin.location_stats.cards.purchased') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ stats.purchasedLocations }}</p>
                <p class="text-xs text-stone-grey/80">{{ stats.activePrestataires }} {{ t('admin.location_stats.cards.active_providers') }}</p>
              </div>
            </div>

            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-coins text-2xl text-white"></i>
                </div>
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2 text-center">{{ t('admin.location_stats.cards.average_price') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ formatCurrency(stats.averagePrice) }}</p>
                <p class="text-xs text-stone-grey/80">{{ t('admin.location_stats.cards.potential_revenue') }}: {{ formatCurrency(stats.totalPotentialRevenue) }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div class="bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center">
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.availableLocations }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide text-center">{{ t('admin.location_stats.secondary.available') }}</p>
            </div>
            <div class="bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center">
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.buyableLocations }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide text-center">{{ t('admin.location_stats.secondary.buyable') }}</p>
            </div>
            <div class="bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center">
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.totalActivity }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide text-center">{{ t('admin.location_stats.secondary.total_activity') }}</p>
            </div>
            <div class="bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center">
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ topLocations.length }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide text-center">{{ t('admin.location_stats.secondary.top_locations') }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <i class="fas fa-chart-pie text-white text-sm"></i>
                  </div>
                  {{ t('admin.location_stats.charts.by_type') }}
                </h3>
              </div>
              <div class="p-6 flex justify-center">
                <PieChart v-if="typeDistribution.length > 0" :data="typeDistribution" :size="240" :stroke-width="28" />
                <div v-else class="text-center text-stone-grey">{{ t('admin.location_stats.empty') }}</div>
              </div>
            </div>

            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                  <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                    <i class="fas fa-user-check text-white text-sm"></i>
                  </div>
                  {{ t('admin.location_stats.charts.ownership') }}
                </h3>
              </div>
              <div class="p-6 flex justify-center">
                <PieChart v-if="ownershipDistribution.length > 0" :data="ownershipDistribution" :size="240" :stroke-width="28" />
                <div v-else class="text-center text-stone-grey">{{ t('admin.location_stats.empty') }}</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                  <i class="fas fa-fire text-antique-bronze"></i>
                  {{ t('admin.location_stats.top.title') }}
                </h3>
              </div>
              <div class="p-6">
                <div class="max-h-[22rem] overflow-y-auto custom-scrollbar space-y-3">
                  <div v-for="(loc, index) in topLocations" :key="loc.id" class="flex items-center gap-4 py-2" :class="{ 'border-t border-antique-bronze/10': index > 0 }">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center font-medieval font-bold text-sm bg-antique-bronze/15 text-antique-bronze">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-iron-black truncate">{{ loc.name }}</p>
                      <p class="text-xs text-stone-grey">
                        Q {{ loc.quests }} | Quiz {{ loc.quizzes }} | Ev {{ loc.events }} | Blog {{ loc.blogs }} | Srv {{ loc.services }}
                      </p>
                    </div>
                    <span class="px-2 py-1 bg-antique-bronze/20 rounded-full text-xs font-bold">{{ loc.activityScore }}</span>
                  </div>
                  <div v-if="topLocations.length === 0" class="text-center py-8 text-stone-grey">{{ t('admin.location_stats.empty') }}</div>
                </div>
              </div>
            </div>

            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                  <i class="fas fa-euro-sign text-antique-bronze"></i>
                  {{ t('admin.location_stats.charts.price_distribution') }}
                </h3>
              </div>
                <div class="p-6 mt-16">
                  <div class="flex items-end justify-around h-65 gap-6">
                    <div v-for="bucket in normalizedPriceBuckets" :key="bucket.range" class="flex-1 flex flex-col items-center">
                      <div class="h-60 w-full flex items-end justify-center">
                        <div
                          class="w-16 rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-500 shadow-sm"
                          :style="{ height: `${bucket.displayHeight}%` }"
                        ></div>
                      </div>
                      <div class="mt-2 text-center">
                        <p class="text-xs font-bold text-iron-black">{{ bucket.count }}</p>
                        <p class="text-[10px] text-stone-grey">{{ bucket.range }}</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
            <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20 flex justify-between items-center">
              <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                <i class="fas fa-table text-antique-bronze"></i>
                {{ t('admin.location_stats.table.title') }}
              </h3>
              <router-link to="/admin/locations" class="text-sm text-antique-bronze hover:underline">{{ t('admin.location_stats.table.manage_link') }}</router-link>
            </div>
            <div class="max-h-[30rem] overflow-y-auto overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/5 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.location_stats.table.location') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.location_stats.table.type') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.location_stats.table.owner') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.location_stats.table.price') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.location_stats.table.activity') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-antique-bronze/10">
                  <tr v-for="loc in locationStats" :key="loc.id" class="hover:bg-antique-bronze/5 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-bold text-iron-black">{{ loc.name }}</div>
                      <div class="text-xs text-stone-grey">
                        Q {{ loc.quests }} | Quiz {{ loc.quizzes }} | Ev {{ loc.events }}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-stone-grey">{{ loc.typeName }}</td>
                    <td class="px-6 py-4 text-sm text-stone-grey">{{ loc.ownerName }}</td>
                    <td class="px-6 py-4 text-center font-medieval text-amber-700">{{ formatCurrency(loc.price) }}</td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div class="h-full bg-amber-500 rounded-full" :style="{ width: loc.percentage + '%' }"></div>
                        </div>
                        <span class="text-xs font-bold">{{ loc.activityScore }}</span>
                      </div>
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
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';
import BackToMapButton from '@/components/shared/BackToMapButton.vue';
import PieChart from '@/components/charts/PieChart.vue';
import {
  locationStatisticService,
  LocationStatistics,
  TopLocation,
  LocationRow,
  PriceBucket,
  DistributionItem,
} from '@/services/locationStatisticService';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);

const isLoading = ref(true);
const stats = ref<LocationStatistics>({
  totalLocations: 0,
  purchasedLocations: 0,
  availableLocations: 0,
  activePrestataires: 0,
  storyLocations: 0,
  buyableLocations: 0,
  averagePrice: 0,
  totalPotentialRevenue: 0,
  totalActivity: 0,
});
const typeDistribution = ref<DistributionItem[]>([]);
const ownershipDistribution = ref<DistributionItem[]>([]);
const topLocations = ref<TopLocation[]>([]);
const locationStats = ref<LocationRow[]>([]);
const priceBuckets = ref<PriceBucket[]>([]);

const resolvedPriceBuckets = computed(() => {
  const hasIncomingBuckets = Array.isArray(priceBuckets.value) && priceBuckets.value.length > 0;

  if (hasIncomingBuckets) {
    return priceBuckets.value.map(bucket => ({
      range: bucket.range,
      count: Number(bucket.count) || 0,
      percentage: Number(bucket.percentage) || 0,
    }));
  }

  // Fallback: derive buckets from location prices if API doesn't provide usable buckets.
  const prices = locationStats.value.map(loc => Number(loc.price) || 0);
  const bucketDefs = [
    { range: '0-49', min: 0, max: 49 },
    { range: '50-99', min: 50, max: 99 },
    { range: '100-149', min: 100, max: 149 },
    { range: '150-199', min: 150, max: 199 },
    { range: '200+', min: 200, max: Number.POSITIVE_INFINITY },
  ];

  return bucketDefs.map(def => {
    const count = prices.filter(price => price >= def.min && price <= def.max).length;
    const percentage = prices.length > 0 ? Math.round((count / prices.length) * 100) : 0;
    return {
      range: def.range,
      count,
      percentage,
    };
  });
});

const normalizedPriceBuckets = computed(() => {
  const maxCount = Math.max(...resolvedPriceBuckets.value.map(b => b.count), 1);

  return resolvedPriceBuckets.value.map(bucket => {
    const rawHeight = Math.round((bucket.count / maxCount) * 100);
    return {
      ...bucket,
      displayHeight: bucket.count > 0 ? Math.max(rawHeight, 8) : 0,
    };
  });
});

onMounted(async () => {
  try {
    const data = await locationStatisticService.getStatistics();
    stats.value = data.stats;
    typeDistribution.value = data.typeDistribution;
    ownershipDistribution.value = data.ownershipDistribution;
    topLocations.value = data.topLocations;
    locationStats.value = data.locationStats;
    priceBuckets.value = data.priceBuckets;
  } catch (error) {
    console.error('Failed to fetch location statistics:', error);
  } finally {
    isLoading.value = false;
  }
});

function formatCurrency(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')} Gold`;
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
