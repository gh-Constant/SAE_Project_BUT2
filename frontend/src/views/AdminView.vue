
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
        <!-- Dashboard Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <!-- User Management Card -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="relative p-6">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div class="text-center mb-4">
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">Utilisateurs</h3>
                <p class="text-4xl font-medieval font-bold text-iron-black mb-1">3</p>
                <p class="text-xs text-stone-grey/80">utilisateurs actifs</p>
              </div>
              <div class="pt-4 border-t border-antique-bronze/20">
                <router-link to="/admin/users" class="contents">
                  <button class="w-full text-antique-bronze hover:text-iron-black font-bold text-sm flex items-center justify-center gap-2 transition-colors group-hover:gap-3 duration-300">
                    Gérer les utilisateurs
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </router-link>
              </div>
            </div>
          </div>
          <!-- Locations Management Card -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="relative p-6">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div class="text-center mb-4">
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">Lieux</h3>
                <p class="text-4xl font-medieval font-bold text-iron-black mb-1">12</p>
                <p class="text-xs text-stone-grey/80">lieux actifs</p>
              </div>
              <div class="pt-4 border-t border-antique-bronze/20">
                <button class="w-full text-antique-bronze hover:text-iron-black font-bold text-sm flex items-center justify-center gap-2 transition-colors group-hover:gap-3 duration-300">
                  Gérer les lieux
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- System Stats Card -->
          <div class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>
            <div class="relative p-6">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div class="text-center mb-4">
                <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">Système</h3>
                <p class="text-4xl font-medieval font-bold text-iron-black mb-1">Actif</p>
                <p class="text-xs text-stone-grey/80">statistiques système</p>
              </div>
              <div class="pt-4 border-t border-antique-bronze/20">
                <button class="w-full text-antique-bronze hover:text-iron-black font-bold text-sm flex items-center justify-center gap-2 transition-colors group-hover:gap-3 duration-300">
                  Voir les statistiques
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mb-12">
          <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center">
            <span class="w-8 h-1 bg-antique-bronze rounded-full mr-4"></span>
            Actions Rapides
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link to="/admin/users" class="contents">
              <MedievalButton variant="primary" :full-width="true">    
                Gérer les utilisateurs
              </MedievalButton>
            </router-link>
            <MedievalButton variant="primary" :full-width="true">
              Gérer les lieux
            </MedievalButton>
            <MedievalButton variant="primary" :full-width="true">
              Gérer les rôles
            </MedievalButton>
            <MedievalButton variant="primary" :full-width="true">
              Voir les logs
            </MedievalButton> 
            <router-link to="/admin/products" class="contents">
              <MedievalButton variant="primary" :full-width="true">
                Gérer les articles
              </MedievalButton>
            </router-link>
          </div>
        </div>

        <!-- Recent Activity -->
        <div>
          <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center">
            <span class="w-8 h-1 bg-antique-bronze rounded-full mr-4"></span>
            Activité Récente
          </h2>
          <div class="bg-white/50 backdrop-blur-sm rounded-sm border border-antique-bronze/20 overflow-hidden">
            <ul class="divide-y divide-antique-bronze/10">
              <li class="hover:bg-antique-bronze/5 transition-colors duration-150">
                <div class="px-6 py-4">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-lg font-medieval font-bold text-antique-bronze truncate">
                      Nouvelle création d'utilisateur
                    </p>
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                      Confirmée
                    </span>
                  </div>
                  <div class="flex justify-between items-end">
                    <p class="text-stone-grey text-sm">
                      Utilisateur "Jean Dupont" ajouté au système
                    </p>
                    <p class="text-xs font-bold text-antique-bronze/60">Il y a 1 heure</p>
                  </div>
                </div>
              </li>
              <li class="hover:bg-antique-bronze/5 transition-colors duration-150">
                <div class="px-6 py-4">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-lg font-medieval font-bold text-antique-bronze truncate">
                      Nouveau lieu ajouté
                    </p>
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Réussi
                    </span>
                  </div>
                  <div class="flex justify-between items-end">
                    <p class="text-stone-grey text-sm">
                      Lieu "Château de la Loire" ajouté
                    </p>
                    <p class="text-xs font-bold text-antique-bronze/60">Hier</p>
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