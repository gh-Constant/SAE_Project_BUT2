<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" v-if="stats && stats.charts">
    <!-- User Growth Chart -->
    <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg p-6">
      <h3 class="text-lg font-medieval font-bold text-iron-black mb-4 flex items-center">
        <i class="fas fa-users-cog text-antique-bronze mr-2"></i>
        {{ t('admin.dashboard.charts.users_growth') }}
      </h3>
      <BarChart 
        :data="userChartData" 
        :height="200" 
        :width="400" 
        color="#8B4513"
      />
    </div>

    <!-- Revenue Chart -->
    <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg p-6">
      <h3 class="text-lg font-medieval font-bold text-iron-black mb-4 flex items-center">
        <i class="fas fa-coins text-amber-600 mr-2"></i>
        {{ t('admin.dashboard.charts.revenue_trend') }}
      </h3>
      <BarChart 
        :data="revenueChartData" 
        :height="200" 
        :width="400" 
        color="#D97706" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AdminStats } from '@/services/statsService';
import BarChart from '@/components/charts/BarChart.vue';

const props = defineProps<{
  stats: AdminStats | null;
}>();

const { t } = useI18n();

const userChartData = computed(() => {
  if (!props.stats?.charts) return [];
  return props.stats.charts.months.map((month, index) => ({
    label: month,
    value: props.stats!.charts.users[index]
  }));
});

const revenueChartData = computed(() => {
  if (!props.stats?.charts) return [];
  return props.stats.charts.months.map((month, index) => ({
    label: month,
    value: props.stats!.charts.revenue[index]
  }));
});
</script>
