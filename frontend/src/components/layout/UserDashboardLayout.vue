<template>
  <div class="min-h-screen bg-parchment pt-20 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-antique-bronze/20 overflow-hidden sticky top-24">
            <!-- User Summary (Mobile only, or header) -->
            <div class="p-6 bg-antique-bronze/10 border-b border-antique-bronze/20 text-center lg:text-left">
              <h2 class="text-xl font-medieval font-bold text-iron-black truncate">
                {{ user?.firstname }} {{ user?.lastname }}
              </h2>
              <p class="text-sm text-stone-grey truncate">{{ user?.email }}</p>
            </div>

            <!-- Navigation Links -->
            <nav class="p-2 space-y-1">
              <router-link
                to="/profile"
                class="flex items-center px-4 py-3 rounded-lg transition-colors group"
                :class="isActive('/profile') && !isSecurityTab ? 'bg-antique-bronze text-white shadow-md' : 'text-stone-grey hover:bg-antique-bronze/10 hover:text-iron-black'"
              >
                <i class="fas fa-user w-6 text-center" :class="isActive('/profile') && !isSecurityTab ? 'text-white' : 'text-antique-bronze group-hover:text-iron-black'"></i>
                <span class="font-medium">{{ t('profile.menu.profile') }}</span>
              </router-link>

              <router-link
                to="/profile?tab=security"
                class="flex items-center px-4 py-3 rounded-lg transition-colors group"
                :class="isSecurityTab ? 'bg-antique-bronze text-white shadow-md' : 'text-stone-grey hover:bg-antique-bronze/10 hover:text-iron-black'"
              >
                <i class="fas fa-shield-alt w-6 text-center" :class="isSecurityTab ? 'text-white' : 'text-antique-bronze group-hover:text-iron-black'"></i>
                <span class="font-medium">{{ t('profile.menu.security') }}</span>
              </router-link>

              <div class="my-2 border-t border-antique-bronze/10"></div>

              <router-link
                to="/commandes"
                class="flex items-center px-4 py-3 rounded-lg transition-colors group"
                :class="isActive('/commandes') ? 'bg-antique-bronze text-white shadow-md' : 'text-stone-grey hover:bg-antique-bronze/10 hover:text-iron-black'"
              >
                <i class="fas fa-shopping-bag w-6 text-center" :class="isActive('/commandes') ? 'text-white' : 'text-antique-bronze group-hover:text-iron-black'"></i>
                <span class="font-medium">{{ t('profile.menu.orders') }}</span>
              </router-link>

              <router-link
                to="/my-reservations"
                class="flex items-center px-4 py-3 rounded-lg transition-colors group"
                :class="isActive('/my-reservations') ? 'bg-antique-bronze text-white shadow-md' : 'text-stone-grey hover:bg-antique-bronze/10 hover:text-iron-black'"
              >
                <i class="fas fa-ticket-alt w-6 text-center" :class="isActive('/my-reservations') ? 'text-white' : 'text-antique-bronze group-hover:text-iron-black'"></i>
                <span class="font-medium">{{ t('profile.menu.reservations') }}</span>
              </router-link>

              <router-link
                to="/my-quests"
                class="flex items-center px-4 py-3 rounded-lg transition-colors group"
                :class="isActive('/my-quests') ? 'bg-antique-bronze text-white shadow-md' : 'text-stone-grey hover:bg-antique-bronze/10 hover:text-iron-black'"
              >
                <i class="fas fa-scroll w-6 text-center" :class="isActive('/my-quests') ? 'text-white' : 'text-antique-bronze group-hover:text-iron-black'"></i>
                <span class="font-medium">{{ t('profile.menu.quests') }}</span>
              </router-link>

              <div class="my-2 border-t border-antique-bronze/10"></div>

              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 text-left"
              >
                <i class="fas fa-sign-out-alt w-6 text-center mr-0"></i>
                <span class="font-medium">{{ t('profile.menu.logout') }}</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <div class="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-antique-bronze/20 p-6 sm:p-8 animate-fade-in-up">
            <slot></slot>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const user = computed(() => authStore.user)

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const isSecurityTab = computed(() => {
  return route.path === '/profile' && route.query.tab === 'security'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>
