<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />
    <!-- Main Content -->
    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <i class="fas fa-chart-pie text-antique-bronze"></i>
            {{ t('admin.quest_stats.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">{{ t('admin.quest_stats.subtitle') }}</p>
        </div>

        <!-- Hero Stats - The Big Numbers -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Total Quests -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="relative p-6">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-scroll text-2xl text-white"></i>
                </div>
              </div>
              <div class="text-center">
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">{{ t('admin.quest_stats.hero.total_quests') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ stats.totalQuests }}</p>
                <p class="text-xs text-stone-grey/80 flex items-center justify-center gap-1">
                  <i class="fas fa-map-marker-alt text-antique-bronze"></i>
                  {{ t('admin.quest_stats.hero.across_locations', { count: stats.locationsWithQuests }) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Total XP Available -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="relative p-6">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-star text-2xl text-white"></i>
                </div>
              </div>
              <div class="text-center">
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">{{ t('admin.quest_stats.hero.total_xp') }}</h3>
                <p class="text-5xl font-medieval font-bold text-iron-black mb-1">{{ formatNumber(stats.totalXP) }}</p>
                <p class="text-xs text-stone-grey/80 flex items-center justify-center gap-1">
                  <i class="fas fa-coins text-antique-bronze"></i>
                  {{ t('admin.quest_stats.hero.avg_reward', { avg: stats.avgXP }) }} XP
                </p>
              </div>
            </div>
          </div>

          <!-- XP Range -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="relative p-6">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-gem text-2xl text-white"></i>
                </div>
              </div>
              <div class="text-center">
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">{{ t('admin.quest_stats.hero.xp_range') }}</h3>
                <p class="text-4xl font-medieval font-bold text-iron-black mb-1">{{ stats.minXP }} - {{ stats.maxXP }}</p>
                <p class="text-xs text-stone-grey/80 flex items-center justify-center gap-1">
                  <i class="fas fa-coins text-antique-bronze"></i>
                  {{ t('admin.quest_stats.hero.xp_range_label') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div class="group bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center hover:shadow-lg transition-all relative overflow-hidden">
            <div class="absolute top-0 right-0 w-10 h-10 bg-antique-bronze/5 rounded-bl-full"></div>
            <div class="w-10 h-10 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <i class="fas fa-map-marker-alt text-white"></i>
            </div>
            <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.locationsWithQuests }}</p>
            <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide">{{ t('admin.quest_stats.secondary.locations') }}</p>
          </div>
          
          <div class="group bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center hover:shadow-lg transition-all relative overflow-hidden">
            <div class="absolute top-0 right-0 w-10 h-10 bg-antique-bronze/5 rounded-bl-full"></div>
            <div class="w-10 h-10 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <i class="fas fa-star text-white"></i>
            </div>
            <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.avgXP }}</p>
            <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide">{{ t('admin.quest_stats.secondary.avg_xp') }}</p>
          </div>
          
          <div class="group bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center hover:shadow-lg transition-all relative overflow-hidden">
            <div class="absolute top-0 right-0 w-10 h-10 bg-antique-bronze/5 rounded-bl-full"></div>
            <div class="w-10 h-10 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <i class="fas fa-arrow-down text-white"></i>
            </div>
            <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.minXP }}</p>
            <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide">{{ t('admin.quest_stats.secondary.min_xp') }}</p>
          </div>
          
          <div class="group bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg p-5 border-2 border-antique-bronze/20 text-center hover:shadow-lg transition-all relative overflow-hidden">
            <div class="absolute top-0 right-0 w-10 h-10 bg-antique-bronze/5 rounded-bl-full"></div>
            <div class="w-10 h-10 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <i class="fas fa-arrow-up text-white"></i>
            </div>
            <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.maxXP }}</p>
            <p class="text-xs text-stone-grey mt-1 uppercase tracking-wide">{{ t('admin.quest_stats.secondary.max_xp') }}</p>
          </div>
        </div>

        <!-- Visualizations Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          <!-- Quest Outcomes (Pie Chart) -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
            <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
              <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <i class="fas fa-chart-pie text-white text-sm"></i>
                </div>
                {{ t('admin.quest_stats.outcomes.title', 'Répartition des statuts') }}
              </h3>
            </div>
            <div class="p-6 flex justify-center">
              <PieChart :data="statusDistribution" :size="240" :stroke-width="30" />
            </div>
          </div>

          <!-- Location Distribution (Donut Chart) -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
            <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
              <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                  <i class="fas fa-map-marked-alt text-white text-sm"></i>
                </div>
                {{ t('admin.quest_stats.locations.distribution_title', 'Répartition par lieu') }}
              </h3>
            </div>
            <div class="p-6 flex justify-center">
              <PieChart :data="locationDistribution" :size="240" :stroke-width="25" />
            </div>
          </div>
        </div>

        <!-- Top Locations Section & Popular Quests -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <!-- Most Popular Quests -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg">
            <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
              <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center">
                  <i class="fas fa-fire-alt text-white text-sm"></i>
                </div>
                {{ t('admin.quest_stats.popular.title') }}
              </h3>
            </div>
            <div class="p-6">
              <div v-for="(quest, index) in topQuests" :key="quest.id_quest" class="flex items-center gap-4 py-3" :class="{ 'border-t border-antique-bronze/10': index > 0 }">
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
                  <p class="font-bold text-iron-black truncate">{{ quest.title }}</p>
                  <p class="text-xs text-stone-grey truncate">{{ quest.locationName }}</p>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-antique-bronze/20 text-iron-black rounded-full text-xs font-bold">
                    <i class="fas fa-star text-antique-bronze text-[10px]"></i>
                    {{ quest.xp_reward }} XP
                  </span>
                </div>
              </div>
              <div v-if="topQuests.length === 0" class="text-center py-8 text-stone-grey">
                <i class="fas fa-scroll text-4xl opacity-30 mb-2"></i>
                <p>{{ t('admin.quest_stats.popular.empty') }}</p>
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
                {{ t('admin.quest_stats.locations.title') }}
              </h3>
            </div>
            <div class="p-6 space-y-4">
              <div v-for="loc in locationStats" :key="loc.id" class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-iron-black text-sm truncate flex-1 mr-4">{{ loc.name }}</span>
                  <span class="text-xs text-stone-grey whitespace-nowrap">{{ loc.questCount }} {{ t('admin.quest_stats.locations.quests') }}</span>
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
                <p>{{ t('admin.quest_stats.locations.empty') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Leaderboard -->
        <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg mb-12">
          <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
          <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
            <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <i class="fas fa-trophy text-white text-sm"></i>
              </div>
              {{ t('admin.quest_stats.leaderboard.title') }}
            </h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="(user, index) in leaderboard" :key="user.id" 
                class="relative bg-white/40 backdrop-blur-sm rounded-xl p-5 border-2 transition-all duration-300 hover:shadow-lg hover:bg-white/60"
                :class="{
                  'border-yellow-500/50 shadow-yellow-500/20': index === 0,
                  'border-stone-400/50': index === 1,
                  'border-antique-bronze/50': index === 2,
                  'border-antique-bronze/20': index > 2
                }">
                <!-- Rank Badge -->
                <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-medieval font-bold text-sm shadow-md"
                  :class="{
                    'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900': index === 0,
                    'bg-gradient-to-br from-stone-300 to-stone-400 text-stone-700': index === 1,
                    'bg-gradient-to-br from-antique-bronze to-[#a88558] text-white': index === 2,
                    'bg-antique-bronze/10 text-antique-bronze': index > 2
                  }"
                >
                  {{ index + 1 }}
                </div>
                
                <!-- User Info -->
                <div class="flex items-center gap-3 mb-4">
                  <img :src="user.avatar" :alt="user.name" class="w-12 h-12 rounded-full border-2 border-antique-bronze/20 object-cover" />
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-iron-black truncate">{{ user.name }}</p>
                    <p class="text-xs text-stone-grey">{{ t('admin.quest_stats.leaderboard.level') }} {{ user.level }}</p>
                  </div>
                </div>
                
                <!-- Stats -->
                <div class="grid grid-cols-2 gap-2 text-center">
                  <div class="bg-emerald-50 rounded-lg py-2 px-3 border border-emerald-100">
                    <p class="text-lg font-medieval font-bold text-emerald-800">{{ user.questsCompleted }}</p>
                    <p class="text-[10px] text-emerald-700/70 uppercase tracking-widest">{{ t('admin.quest_stats.leaderboard.completed') }}</p>
                  </div>
                  <div class="bg-amber-50 rounded-lg py-2 px-3 border border-amber-100">
                    <p class="text-lg font-medieval font-bold text-amber-800">{{ user.totalXpEarned }}</p>
                    <p class="text-[10px] text-amber-800/60 uppercase tracking-widest">XP</p>
                  </div>
                </div>
                
                <!-- In Progress Badge -->
                <div v-if="user.questsInProgress > 0" class="absolute -top-2 -right-2">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-[10px] font-bold shadow-sm">
                    <i class="fas fa-hourglass-half text-blue-600"></i>
                    {{ user.questsInProgress }} {{ t('admin.quest_stats.leaderboard.in_progress') }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="leaderboard.length === 0" class="text-center py-8 text-stone-grey">
              <i class="fas fa-users text-4xl opacity-30 mb-2"></i>
              <p>{{ t('admin.quest_stats.leaderboard.empty') }}</p>
            </div>
          </div>
        </div>

        <!-- XP Distribution Chart -->
        <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 overflow-hidden shadow-lg mb-12">
          <div class="absolute top-0 right-0 w-16 h-16 bg-antique-bronze/10 rounded-bl-full"></div>
          <div class="bg-antique-bronze/10 px-6 py-4 border-b border-antique-bronze/20">
            <h3 class="font-medieval font-bold text-iron-black flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-sm">
                <i class="fas fa-gem text-white text-sm"></i>
              </div>
              {{ t('admin.quest_stats.xp_distribution.title') }}
            </h3>
          </div>
          <div class="p-6">
            <div class="flex items-end justify-around h-48 gap-2">
              <div v-for="(bucket, index) in xpBuckets" :key="index" class="flex-1 flex flex-col items-center">
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
              {{ t('admin.quest_stats.detailed.title') }}
            </h3>
            <router-link to="/admin/quests" class="text-sm text-antique-bronze hover:underline flex items-center gap-1">
              {{ t('admin.quest_stats.detailed.manage_link') }}
              <i class="fas fa-arrow-right text-xs"></i>
            </router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-antique-bronze/10">
              <thead class="bg-antique-bronze/5">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.quest_stats.detailed.location') }}</th>
                  <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.quest_stats.detailed.quests') }}</th>
                  <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.quest_stats.detailed.total_xp') }}</th>
                  <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.quest_stats.detailed.avg_xp') }}</th>
                  <th class="px-6 py-3 text-center text-xs font-medieval font-bold text-iron-black uppercase">{{ t('admin.quest_stats.detailed.distribution') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-antique-bronze/10">
                <tr v-for="loc in detailedLocationStats" :key="loc.id" class="hover:bg-antique-bronze/5 transition-colors">
                  <td class="px-6 py-4">
                    <span class="font-bold text-iron-black">{{ loc.name }}</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="px-2 py-1 bg-antique-bronze/10 text-antique-bronze border border-antique-bronze/20 rounded-full text-xs font-bold shadow-sm">{{ loc.questCount }}</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="font-medieval font-bold text-amber-700">{{ loc.totalXP }} XP</span>
                  </td>
                  <td class="px-6 py-4 text-center text-stone-grey">{{ loc.avgXP }} XP</td>
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <div class="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-500 rounded-full" :style="{ width: `${loc.percentage}%` }"></div>
                      </div>
                      <span class="text-xs text-stone-grey">{{ loc.percentage }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
import { questStatisticService, QuestStatisticsData, QuestStatistics, TopQuest, LocationStat, XpBucket, LeaderboardUser, StatusDistribution, LocationDistribution } from '@/services/questStatisticService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// State
const isLoading = ref(true)
const stats = ref<QuestStatistics>({
  totalQuests: 0,
  totalXP: 0,
  avgXP: 0,
  locationsWithQuests: 0,
  minXP: 0,
  maxXP: 0,
  totalParticipants: 0,
  completedQuestsCount: 0,
  completionRate: 0
})
const topQuests = ref<TopQuest[]>([])
const locationStats = ref<LocationStat[]>([])
const xpBuckets = ref<XpBucket[]>([])
const leaderboard = ref<LeaderboardUser[]>([])
const statusDistribution = ref<StatusDistribution[]>([])
const locationDistribution = ref<LocationDistribution[]>([])

// Use locationStats for detailed table (same data)
const detailedLocationStats = computed(() => locationStats.value)

onMounted(async () => {
  try {
    isLoading.value = true
    const data: QuestStatisticsData = await questStatisticService.getStatistics()
    
    stats.value = data.stats
    topQuests.value = data.topQuests
    locationStats.value = data.locationStats.slice(0, 6) // Top 6 for chart
    xpBuckets.value = data.xpBuckets
    leaderboard.value = data.leaderboard
    statusDistribution.value = data.statusDistribution
    locationDistribution.value = data.locationDistribution
  } catch (error) {
    console.error('Failed to fetch quest statistics:', error)
  } finally {
    isLoading.value = false
  }
})

// Helper to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

