<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />
    <BackToMapButton />

    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <i class="fas fa-users text-antique-bronze"></i>
            {{ t('admin.user_stats.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">{{ t('admin.user_stats.subtitle') }}</p>
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
                  <i class="fas fa-users text-2xl text-white"></i>
                </div>
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2 text-center">{{ t('admin.user_stats.cards.total_users') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ stats.totalUsers }}</p>
                <p class="text-xs text-stone-grey/80">{{ stats.newUsersThisMonth }} {{ t('admin.user_stats.cards.new_this_month') }}</p>
              </div>
            </div>

            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-wallet text-2xl text-white"></i>
                </div>
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2 text-center">{{ t('admin.user_stats.cards.paying_users') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ stats.payingUsers }}</p>
                <p class="text-xs text-stone-grey/80">{{ stats.totalOrders }} {{ t('admin.user_stats.cards.orders') }}</p>
              </div>
            </div>

            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
              <div class="relative p-6 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-chart-line text-2xl text-white"></i>
                </div>
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2 text-center">{{ t('admin.user_stats.cards.avg_level') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ stats.avgLevel }}</p>
                <p class="text-xs text-stone-grey/80">XP total: {{ formatNumber(stats.totalXP) }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div class="bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center">
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.verifiedUsers }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide text-center">{{ t('admin.user_stats.secondary.verified') }}</p>
            </div>
            <div class="bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center">
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.activeUsers }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide text-center">{{ t('admin.user_stats.secondary.active') }}</p>
            </div>
            <div class="bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center">
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ formatNumber(stats.totalGold) }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide text-center">{{ t('admin.user_stats.secondary.total_gold') }}</p>
            </div>
            <div class="bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center">
              <p class="text-3xl font-medieval font-bold text-iron-black">{{ topUsers.length }}</p>
              <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide text-center">{{ t('admin.user_stats.secondary.top_users') }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <i class="fas fa-user-tag text-white text-sm"></i>
                  </div>
                  {{ t('admin.user_stats.charts.roles') }}
                </h3>
              </div>
              <div class="p-6 flex justify-center">
                <PieChart v-if="roleDistribution.length > 0" :data="roleDistributionForChart" :size="240" :stroke-width="28" />
                <div v-else class="text-center text-stone-grey">{{ t('admin.user_stats.empty') }}</div>
              </div>
            </div>

            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                  <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                    <i class="fas fa-check-circle text-white text-sm"></i>
                  </div>
                  {{ t('admin.user_stats.charts.verification') }}
                </h3>
              </div>
              <div class="p-6 flex justify-center">
                <PieChart v-if="verificationDistribution.length > 0" :data="verificationDistributionForChart" :size="240" :stroke-width="28" />
                <div v-else class="text-center text-stone-grey">{{ t('admin.user_stats.empty') }}</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                  <i class="fas fa-fire text-antique-bronze"></i>
                  {{ t('admin.user_stats.top.title') }}
                </h3>
              </div>
              <div class="p-6">
                <div class="max-h-[22rem] overflow-y-auto custom-scrollbar space-y-3">
                  <div v-for="(usr, index) in topUsers" :key="usr.id" class="flex items-center gap-4 py-2" :class="{ 'border-t border-antique-bronze/10': index > 0 }">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center font-medieval font-bold text-sm bg-antique-bronze/15 text-antique-bronze">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-iron-black truncate">{{ usr.name }}</p>
                      <p class="text-xs text-stone-grey">
                        {{ t(`admin.user_stats.roles.${usr.role}`) }} | Lvl {{ usr.level }} | {{ usr.totalOrders }} {{ t('admin.user_stats.cards.orders') }}
                      </p>
                    </div>
                    <span class="px-2 py-1 bg-antique-bronze/20 rounded-full text-xs font-bold">{{ usr.activityScore.toFixed(1) }}</span>
                  </div>
                  <div v-if="topUsers.length === 0" class="text-center py-8 text-stone-grey">{{ t('admin.user_stats.empty') }}</div>
                </div>
              </div>
            </div>

            <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
              <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
                <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2 justify-center text-center">
                  <i class="fas fa-layer-group text-antique-bronze"></i>
                  {{ t('admin.user_stats.charts.level_distribution') }}
                </h3>
              </div>
              <div class="p-6 mt-10">
                <div class="flex items-end justify-around h-70 gap-4">
                  <div v-for="bucket in normalizedGroupedLevelBuckets" :key="bucket.range" class="flex-1 flex flex-col items-center">
                    <div class="h-60 w-full flex items-end justify-center">
                      <div
                        class="w-14 rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-500 shadow-sm"
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
                {{ t('admin.user_stats.table.title') }}
              </h3>
              <router-link to="/admin/users" class="text-sm text-antique-bronze hover:underline">{{ t('admin.user_stats.table.manage_link') }}</router-link>
            </div>
            <div class="max-h-[30rem] overflow-y-auto overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/5 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.user_stats.table.user') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.user_stats.table.role') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.user_stats.table.level_xp') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.user_stats.table.engagement') }}</th>
                    <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.user_stats.table.value') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-antique-bronze/10">
                  <tr v-for="usr in userStats" :key="usr.id" class="hover:bg-antique-bronze/5 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-bold text-iron-black">{{ usr.name }}</div>
                      <div class="text-xs" :class="usr.isVerified ? 'text-emerald-700' : 'text-amber-700'">
                        {{ usr.isVerified ? t('admin.user_stats.labels.verified') : t('admin.user_stats.labels.unverified') }}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-stone-grey text-center">{{ t(`admin.user_stats.roles.${usr.role}`) }}</td>
                    <td class="px-6 py-4 text-center">
                      <div class="font-medieval text-iron-black">Lvl {{ usr.level }}</div>
                      <div class="text-xs text-stone-grey">{{ formatNumber(usr.xp) }} XP</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="text-xs text-stone-grey">
                        {{ usr.totalOrders }} {{ t('admin.user_stats.cards.orders') }} | {{ usr.completedQuests }} {{ t('admin.user_stats.labels.completed_quests') }}
                      </div>
                      <div class="flex items-center justify-center gap-2 mt-1">
                        <div class="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div class="h-full bg-amber-500 rounded-full" :style="{ width: usr.percentage + '%' }"></div>
                        </div>
                        <span class="text-xs font-bold">{{ usr.activityScore.toFixed(1) }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="font-medieval text-amber-700">{{ formatGold(usr.gold) }}</div>
                      <div class="text-xs text-stone-grey">{{ formatGold(usr.totalSpent) }} {{ t('admin.user_stats.labels.spent') }}</div>
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
  userStatisticService,
  UserStatistics,
  DistributionItem,
  UserRow,
  LevelBucket,
} from '@/services/userStatisticService';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);

const isLoading = ref(true);
const stats = ref<UserStatistics>({
  totalUsers: 0,
  payingUsers: 0,
  verifiedUsers: 0,
  activeUsers: 0,
  totalOrders: 0,
  avgLevel: 0,
  totalXP: 0,
  totalGold: 0,
  newUsersThisMonth: 0,
});
const roleDistribution = ref<DistributionItem[]>([]);
const verificationDistribution = ref<DistributionItem[]>([]);
const topUsers = ref<UserRow[]>([]);
const userStats = ref<UserRow[]>([]);
const levelBuckets = ref<LevelBucket[]>([]);

const roleDistributionForChart = computed(() =>
  roleDistribution.value.map(item => ({
    ...item,
    label: t(`admin.user_stats.roles.${item.label}`),
  }))
);

const verificationDistributionForChart = computed(() =>
  verificationDistribution.value.map(item => ({
    ...item,
    label: t(`admin.user_stats.labels.${item.label}`),
  }))
);

const normalizedLevelBuckets = computed(() => {
  const maxCount = Math.max(...levelBuckets.value.map(bucket => bucket.count), 1);

  return levelBuckets.value.map(bucket => {
    const rawHeight = Math.round((bucket.count / maxCount) * 100);
    return {
      ...bucket,
      displayHeight: bucket.count > 0 ? Math.max(rawHeight, 8) : 0,
    };
  });
});

// Group levels by steps (1-2,3-4,5-6,7-8,9+) to produce more readable bars
const groupedLevelBuckets = computed(() => {
  const step = 2;
  const bins: LevelBucket[] = [];

  // fixed groups: 1-2,3-4,5-6,7-8
  for (let start = 1; start <= 7; start += step) {
    const end = start + step - 1; // 1-2,3-4,5-6,7-8
    const label = `${start}-${end}`;
    const count = userStats.value.filter(u => u.level >= start && u.level <= end).length;
    bins.push({ range: label, count, percentage: userStats.value.length > 0 ? Math.round((count / userStats.value.length) * 100) : 0 });
  }

  // final bucket: 9+
  const finalCount = userStats.value.filter(u => u.level >= 9).length;
  bins.push({ range: '9+', count: finalCount, percentage: userStats.value.length > 0 ? Math.round((finalCount / userStats.value.length) * 100) : 0 });

  return bins;
});

const normalizedGroupedLevelBuckets = computed(() => {
  const maxCount = Math.max(...groupedLevelBuckets.value.map(b => b.count), 1);

  return groupedLevelBuckets.value.map(bucket => {
    const rawHeight = Math.round((bucket.count / maxCount) * 100);
    return {
      ...bucket,
      displayHeight: bucket.count > 0 ? Math.max(rawHeight, 8) : 0,
    };
  });
});

onMounted(async () => {
  try {
    const data = await userStatisticService.getStatistics();
    stats.value = data.stats;
    roleDistribution.value = data.roleDistribution;
    verificationDistribution.value = data.verificationDistribution;
    topUsers.value = data.topUsers;
    userStats.value = data.userStats;
    levelBuckets.value = data.levelBuckets;
  } catch (error) {
    console.error('Failed to fetch user statistics:', error);
  } finally {
    isLoading.value = false;
  }
});

function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

function formatGold(value: number): string {
  return `${value.toFixed(0)} Gold`;
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
