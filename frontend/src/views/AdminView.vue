<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <!-- Custom Header -->
    <AdminNavbar 
      :user="user" 
      @logout="logout"
    />

    <!-- Main Content -->
    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Admin Categories -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <!-- Quêtes Category -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"></div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-scroll text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">Quêtes</h2>
                  <p class="text-sm text-stone-grey">Gestion & Statistiques</p>
                </div>
              </div>
              
              <div class="space-y-3">
                <router-link to="/admin/quests" class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn">
                  <span class="flex items-center gap-3">
                    <i class="fas fa-cog text-antique-bronze group-hover/btn:rotate-90 transition-transform duration-500"></i>
                    <span class="font-medieval font-bold text-iron-black">Gestion des Quêtes</span>
                  </span>
                  <i class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"></i>
                </router-link>
                
                <router-link to="/admin/quests/stats" class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn">
                  <span class="flex items-center gap-3">
                    <i class="fas fa-chart-pie text-antique-bronze group-hover/btn:scale-110 transition-transform duration-300"></i>
                    <span class="font-medieval font-bold text-iron-black">Statistiques</span>
                  </span>
                  <i class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"></i>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Boutique Category -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"></div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-store text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">Boutique</h2>
                  <p class="text-sm text-stone-grey">Produits & Ventes</p>
                </div>
              </div>
              
              <div class="space-y-3">
                <router-link to="/admin/products" class="flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white/80 border border-antique-bronze/20 rounded-lg transition-all duration-300 group/btn">
                  <span class="flex items-center gap-3">
                    <i class="fas fa-box-open text-antique-bronze group-hover/btn:scale-110 transition-transform duration-300"></i>
                    <span class="font-medieval font-bold text-iron-black">Gestion Boutique</span>
                  </span>
                  <i class="fas fa-arrow-right text-antique-bronze opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"></i>
                </router-link>
                
                <button class="flex items-center justify-between px-4 py-3 bg-white/30 border border-antique-bronze/10 rounded-lg cursor-not-allowed opacity-70 w-full">
                  <span class="flex items-center gap-3">
                    <i class="fas fa-chart-line text-antique-bronze/60"></i>
                    <span class="font-medieval font-bold text-stone-grey">Statistiques</span>
                  </span>
                  <span class="text-xs bg-antique-bronze/10 text-antique-bronze px-2 py-0.5 rounded-full">Bientôt</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Utilisateurs Category -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"></div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-users text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">Utilisateurs</h2>
                  <p class="text-sm text-stone-grey">Comptes & Activité</p>
                </div>
              </div>
              
              <div class="space-y-3">
                 <button class="flex items-center justify-between px-4 py-3 bg-white/30 border border-antique-bronze/10 rounded-lg cursor-not-allowed opacity-70 w-full">
                  <span class="flex items-center gap-3">
                    <i class="fas fa-user-cog text-antique-bronze/60"></i>
                    <span class="font-medieval font-bold text-stone-grey">Gestion Utilisateurs</span>
                  </span>
                  <span class="text-xs bg-antique-bronze/10 text-antique-bronze px-2 py-0.5 rounded-full">Bientôt</span>
                </button>
                
                <button class="flex items-center justify-between px-4 py-3 bg-white/30 border border-antique-bronze/10 rounded-lg cursor-not-allowed opacity-70 w-full">
                  <span class="flex items-center gap-3">
                    <i class="fas fa-chart-bar text-antique-bronze/60"></i>
                    <span class="font-medieval font-bold text-stone-grey">Statistiques</span>
                  </span>
                  <span class="text-xs bg-antique-bronze/10 text-antique-bronze px-2 py-0.5 rounded-full">Bientôt</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Lieux Category -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="absolute top-0 right-0 w-32 h-32 bg-antique-bronze/10 rounded-bl-full transform transition-transform group-hover:scale-110"></div>
            <div class="relative p-6">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md">
                  <i class="fas fa-map-marked-alt text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-medieval font-bold text-iron-black">Lieux</h2>
                  <p class="text-sm text-stone-grey">Points d'intérêts</p>
                </div>
              </div>
              
              <div class="space-y-3">
                 <button class="flex items-center justify-between px-4 py-3 bg-white/30 border border-antique-bronze/10 rounded-lg cursor-not-allowed opacity-70 w-full">
                  <span class="flex items-center gap-3">
                    <i class="fas fa-map-marker-alt text-antique-bronze/60"></i>
                    <span class="font-medieval font-bold text-stone-grey">Gestion Lieux</span>
                  </span>
                   <span class="text-xs bg-antique-bronze/10 text-antique-bronze px-2 py-0.5 rounded-full">Bientôt</span>
                </button>
                
                <button class="flex items-center justify-between px-4 py-3 bg-white/30 border border-antique-bronze/10 rounded-lg cursor-not-allowed opacity-70 w-full">
                  <span class="flex items-center gap-3">
                    <i class="fas fa-globe-europe text-antique-bronze/60"></i>
                    <span class="font-medieval font-bold text-stone-grey">Statistiques</span>
                  </span>
                   <span class="text-xs bg-antique-bronze/10 text-antique-bronze px-2 py-0.5 rounded-full">Bientôt</span>
                </button>
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
              <li class="hover:bg-antique-bronze/5 transition-colors duration-150">
                <div class="px-6 py-4">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-lg font-medieval font-bold text-antique-bronze truncate">
                      {{ t('admin.recent_activity.user_created.title') }}
                    </p>
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                      {{ t('admin.recent_activity.user_created.status') }}
                    </span>
                  </div>
                  <div class="flex justify-between items-end">
                    <p class="text-stone-grey text-sm">
                      {{ t('admin.recent_activity.user_created.description', { name: "Jean Dupont" }) }}
                    </p>
                    <p class="text-xs font-bold text-antique-bronze/60">{{ t('admin.recent_activity.time.hour_ago') }}</p>
                  </div>
                </div>
              </li>
              <li class="hover:bg-antique-bronze/5 transition-colors duration-150">
                <div class="px-6 py-4">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-lg font-medieval font-bold text-antique-bronze truncate">
                      {{ t('admin.recent_activity.location_added.title') }}
                    </p>
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {{ t('admin.recent_activity.location_added.status') }}
                    </span>
                  </div>
                  <div class="flex justify-between items-end">
                    <p class="text-stone-grey text-sm">
                      {{ t('admin.recent_activity.location_added.description', { name: "Château de la Loire" }) }}
                    </p>
                    <p class="text-xs font-bold text-antique-bronze/60">{{ t('admin.recent_activity.time.yesterday') }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MedievalButton from '@/components/ui/MedievalButton.vue'
import AdminNavbar from '@/components/navbar/AdminNavbar.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
</style>