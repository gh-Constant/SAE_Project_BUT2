<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <!-- Custom Header -->
    <AdminNavbar :user="user" @logout="logout" />

    <!-- Main Content -->
    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Festival Global Dates -->
        <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg p-4 mb-8 flex justify-center items-center shadow-sm">
          <div v-if="!isEditingDates" class="flex items-center gap-4">
            <i class="fas fa-calendar-alt text-antique-bronze text-xl"></i>
            <p class="text-lg font-medieval text-iron-black">
              {{ t('admin.dashboard.festival.title') }}
              <span class="font-bold text-antique-bronze mx-1">{{ new Date(settingsStore.festival_start_date || '').toLocaleDateString() }}</span>
              {{ t('admin.dashboard.festival.to') }}
              <span class="font-bold text-antique-bronze mx-1">{{ new Date(settingsStore.festival_end_date || '').toLocaleDateString() }}</span>
            </p>
            <button 
              @click="isEditingDates = true"
              class="text-stone-400 hover:text-antique-bronze transition-colors ml-2" 
              :title="t('admin.dashboard.festival.edit')"
            >
              <i class="fas fa-edit"></i>
            </button>
          </div>

          <div v-else class="flex items-center gap-4 bg-white/90 p-2 rounded-lg border border-antique-bronze/30">
            <div class="flex items-center gap-2">
              <label class="text-xs font-bold text-stone-500">{{ t('admin.dashboard.festival.from_label') }}</label>
              <input 
                v-model="settingsStore.festival_start_date" 
                type="date"
                class="p-1 bg-white border border-antique-bronze/30 rounded focus:ring-1 focus:ring-antique-bronze outline-none text-iron-black font-medieval text-sm"
              >
            </div>
            <span class="text-antique-bronze font-bold">-</span>
            <div class="flex items-center gap-2">
              <label class="text-xs font-bold text-stone-500">{{ t('admin.dashboard.festival.to_label') }}</label>
              <input 
                v-model="settingsStore.festival_end_date" 
                type="date"
                class="p-1 bg-white border border-antique-bronze/30 rounded focus:ring-1 focus:ring-antique-bronze outline-none text-iron-black font-medieval text-sm"
              >
            </div>
            <button 
              @click="isEditingDates = false"
              class="text-emerald-700 hover:text-emerald-900 transition-colors ml-2" 
              :title="t('admin.dashboard.festival.validate')"
            >
              <i class="fas fa-check-circle text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Global Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" v-if="stats">
          <!-- Total Users -->
          <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg p-6 flex flex-col items-center">
            <div class="w-12 h-12 bg-antique-bronze/10 rounded-full flex items-center justify-center mb-3">
              <i class="fas fa-users text-antique-bronze text-xl"></i>
            </div>
            <h3 class="text-stone-grey font-bold text-sm uppercase tracking-wider mb-1">{{ t('admin.dashboard.stats.users') }}</h3>
            <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.userCount }}</p>
          </div>

          <!-- Paying Users -->
          <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg p-6 flex flex-col items-center">
            <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <i class="fas fa-wallet text-emerald-600 text-xl"></i>
            </div>
            <h3 class="text-stone-grey font-bold text-sm uppercase tracking-wider mb-1">{{ t('admin.dashboard.stats.paying_users') }}</h3>
            <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.payingUserCount }}</p>
          </div>

          <!-- Total Revenue -->
          <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg p-6 flex flex-col items-center">
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <i class="fas fa-coins text-amber-600 text-xl"></i>
            </div>
            <h3 class="text-stone-grey font-bold text-sm uppercase tracking-wider mb-1">{{ t('admin.dashboard.stats.revenue') }}</h3>
            <p class="text-3xl font-medieval font-bold text-iron-black">{{ stats.totalRevenue }} €</p>
          </div>
        </div>


        <!-- Charts Section -->
        <DashboardCharts :stats="stats" />

        <!-- Admin Categories -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <!-- Quêtes Category -->
          <div
            class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"
            >
            </div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md"
                >
                  <i class="fas fa-scroll text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.quests.title') }}</h2>
                  <p class="text-sm text-stone-grey">{{ t('admin.dashboard.categories.quests.subtitle') }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <router-link
                  to="/admin/quests"
                  class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn"
                >
                  <span class="flex items-center gap-3">
                    <i
                      class="fas fa-cog text-antique-bronze group-hover/btn:rotate-90 transition-transform duration-500"
                    ></i>
                    <span class="font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.quests.manage') }}</span>
                  </span>
                  <i
                    class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                  ></i>
                </router-link>

                <router-link
                  to="/admin/quests/stats"
                  class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn"
                >
                  <span class="flex items-center gap-3">
                    <i
                      class="fas fa-chart-pie text-antique-bronze group-hover/btn:scale-110 transition-transform duration-300"
                    ></i>
                    <span class="font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.quests.stats') }}</span>
                  </span>
                  <i
                    class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                  ></i>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Boutique Category -->
          <div
            class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"
            >
            </div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md"
                >
                  <i class="fas fa-store text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.shop.title') }}</h2>
                  <p class="text-sm text-stone-grey">{{ t('admin.dashboard.categories.shop.subtitle') }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <router-link
                  to="/admin/products"
                  class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn"
                >
                  <span class="flex items-center gap-3">
                    <i
                      class="fas fa-box-open text-antique-bronze group-hover/btn:scale-110 transition-transform duration-300"
                    ></i>
                    <span class="font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.shop.manage') }}</span>
                  </span>
                  <i
                    class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                  ></i>
                </router-link>

                <router-link
                  to="/admin/shop/stats"
                  class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn"
                >
                  <span class="flex items-center gap-3">
                    <i
                      class="fas fa-chart-line text-antique-bronze group-hover/btn:scale-110 transition-transform duration-300"
                    ></i>
                    <span class="font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.shop.stats') }}</span>
                  </span>
                  <i
                    class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                  ></i>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Utilisateurs Category -->
          <div
            class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"
            >
            </div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md"
                >
                  <i class="fas fa-users text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.users.title') }}</h2>
                  <p class="text-sm text-stone-grey">{{ t('admin.dashboard.categories.users.subtitle') }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <router-link
                  to="/admin/users"
                  class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn w-full"
                >
                  <span class="flex items-center gap-3">
                    <i class="fas fa-user-cog text-antique-bronze"></i>
                    <span class="font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.users.manage') }}</span>
                  </span>
                  <i
                    class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                  ></i>
                </router-link>
                <button
                  class="flex items-center justify-between px-4 py-3 bg-white/30 border border-antique-bronze/10 rounded-lg cursor-not-allowed opacity-70 w-full"
                >
                  <span class="flex items-center gap-3">
                    <i class="fas fa-chart-bar text-antique-bronze/60"></i>
                    <span class="font-medieval font-bold text-stone-grey">{{ t('admin.dashboard.categories.users.stats') }}</span>
                  </span>
                  <span class="text-xs bg-antique-bronze/10 text-antique-bronze px-2 py-0.5 rounded-full">{{ t('admin.dashboard.categories.soon') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Lieux Category -->
          <div
            class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"
            >
            </div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md"
                >
                  <i class="fas fa-map-marked-alt text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.locations.title') }}</h2>
                  <p class="text-sm text-stone-grey">{{ t('admin.dashboard.categories.locations.subtitle') }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <router-link
                  to="/admin/locations"
                  class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn w-full"
                >
                  <span class="flex items-center gap-3">
                    <i class="fas fa-map-marker-alt text-antique-bronze"></i>
                    <span class="font-medieval font-bold text-iron-black">{{ t('admin.dashboard.categories.locations.manage') }}</span>
                  </span>
                  <i
                    class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                  ></i>
                </router-link>
                <button
                  class="flex items-center justify-between px-4 py-3 bg-white/30 border border-antique-bronze/10 rounded-lg cursor-not-allowed opacity-70 w-full"
                >
                  <span class="flex items-center gap-3">
                    <i class="fas fa-globe-europe text-antique-bronze/60"></i>
                    <span class="font-medieval font-bold text-stone-grey">{{ t('admin.dashboard.categories.locations.stats') }}</span>
                  </span>
                  <span class="text-xs bg-antique-bronze/10 text-antique-bronze px-2 py-0.5 rounded-full">{{ t('admin.dashboard.categories.soon') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Quiz Category -->
          <div
            class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"
            >
            </div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md"
                >
                  <i class="fas fa-question-circle text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">{{ t('admin.dashboard.quizzes.title') }}</h2>
                  <p class="text-sm text-stone-grey">{{ t('admin.dashboard.quizzes.subtitle') }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <router-link
                  to="/admin/quizzes"
                  class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn w-full"
                >
                  <span class="flex items-center gap-3">
                    <i class="fa-solid fa-gear text-antique-bronze"></i>
                    <span class="font-medieval font-bold text-iron-black">{{ t('admin.quizzes.title') }}</span>
                  </span>
                  <i
                    class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                  ></i>
                </router-link>
                <router-link
                  to="/admin/quizzes/stats"
                  class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn w-full"
                >
                  <span class="flex items-center gap-3">
                    <i class="fas fa-chart-bar text-antique-bronze"></i>
                    <span class="font-medieval font-bold text-iron-black">{{ t('admin.quizzes.view_stats') }}</span>
                  </span>
                  <i
                    class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                  ></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div>
          <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center">
            <span class="w-8 h-1 bg-antique-bronze rounded-full mr-4"></span>
            {{ t('admin.recent_activity.title') }}
          </h2>
          <div class="bg-white/50 backdrop-blur-sm rounded-sm border border-antique-bronze/20 overflow-hidden">
            <ul class="divide-y divide-antique-bronze/10">
              <li v-for="activity in stats?.recentActivity" :key="activity.type + activity.id" class="hover:bg-antique-bronze/5 transition-colors duration-150">
                <div class="px-6 py-4">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-lg font-medieval font-bold text-antique-bronze truncate">
                      {{ activity.type === 'USER_CREATED' ? t('admin.recent_activity.user_created.title') : t('admin.recent_activity.location_added.title') }}
                    </p>
                    <span
                      class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border"
                      :class="activity.type === 'USER_CREATED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200'"
                    >
                      {{ activity.type === 'USER_CREATED' ? t('admin.recent_activity.user_created.status') : t('admin.recent_activity.location_added.status') }}
                    </span>
                  </div>
                  <div class="flex justify-between items-end">
                    <p class="text-stone-grey text-sm">
                      {{ activity.type === 'USER_CREATED' 
                          ? t('admin.recent_activity.user_created.description', { name: activity.name }) 
                          : t('admin.recent_activity.location_added.description', { name: activity.name }) 
                      }}
                    </p>
                    <p class="text-xs font-bold text-antique-bronze/60">
                      {{ new Date(activity.date).toLocaleDateString() }} {{ new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                    </p>
                  </div>
                </div>
              </li>
              <li v-if="!stats?.recentActivity?.length" class="px-6 py-4 text-center text-stone-500 italic">
                Aucune activité récente.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminNavbar from '@/components/navbar/AdminNavbar.vue'
import DashboardCharts from '@/components/admin/DashboardCharts.vue'
import { useI18n } from 'vue-i18n'
import { statsService, type AdminStats } from '@/services/statsService'

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()
import { useSettingsStore } from '@/stores/settings';
import { ref } from 'vue';

const settingsStore = useSettingsStore();
const isEditingDates = ref(false);
const stats = ref<AdminStats | null>(null);

const user = computed(() => authStore.user)

const fetchStats = async () => {
  try {
    stats.value = await statsService.getAdminGlobalStats();
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
  }
};

onMounted(() => {
  fetchStats();
});

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped></style>