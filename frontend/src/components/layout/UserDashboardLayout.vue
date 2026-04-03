<template>
  <div class="min-h-screen bg-parchment pt-28 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8 relative items-start">
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-64 flex-shrink-0 sticky top-28 self-start z-10">
          <button
            type="button"
            class="mb-3 flex w-full items-center justify-between rounded-lg border border-antique-bronze/20 bg-white px-4 py-3 text-left text-iron-black shadow-sm lg:hidden"
            @click="toggleMobileNav"
          >
            <span class="font-medieval font-semibold">
              {{ isSecurityTab ? t('profile.menu.security') : t('profile.menu.profile') }}
            </span>
            <i class="fas transition-transform" :class="mobileNavOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>

          <div class="bg-white rounded-lg shadow-sm border border-antique-bronze/20 overflow-y-auto custom-scrollbar max-h-[calc(100vh-8rem)]">
            <!-- User Summary (Mobile only, or header) -->
            <div class="p-6 border-b border-antique-bronze/10 flex items-center gap-4 bg-parchment/30">
              <div class="w-12 h-12 bg-antique-bronze rounded-full flex items-center justify-center text-white text-xl shadow-inner font-medieval">
                {{ user?.firstname?.charAt(0) }}{{ user?.lastname?.charAt(0) }}
              </div>
              <div class="overflow-hidden">
                <h2 class="text-lg font-bold text-iron-black truncate">
                  {{ user?.firstname }} {{ user?.lastname }}
                </h2>
                <p class="text-sm text-stone-grey truncate">{{ user?.email }}</p>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="py-2 flex flex-col" :class="{ hidden: !mobileNavOpen, 'lg:flex': true }">
              <router-link
                to="/profile"
                class="flex items-center px-6 py-3 transition-colors group border-l-4"
                :class="isActive('/profile') && !isSecurityTab ? 'bg-antique-bronze/5 border-antique-bronze text-iron-black font-semibold' : 'border-transparent text-stone-grey hover:bg-gray-50 hover:text-iron-black'"
                @click="closeMobileNav"
              >
                <i class="fas fa-user w-6 text-center" :class="isActive('/profile') && !isSecurityTab ? 'text-antique-bronze' : 'group-hover:text-iron-black'"></i>
                <span class="ml-2">{{ t('profile.menu.profile') }}</span>
              </router-link>

              <router-link
                to="/profile?tab=security"
                class="flex items-center px-6 py-3 transition-colors group border-l-4"
                :class="isSecurityTab ? 'bg-antique-bronze/5 border-antique-bronze text-iron-black font-semibold' : 'border-transparent text-stone-grey hover:bg-gray-50 hover:text-iron-black'"
                @click="closeMobileNav"
              >
                <i class="fas fa-shield-alt w-6 text-center" :class="isSecurityTab ? 'text-antique-bronze' : 'group-hover:text-iron-black'"></i>
                <span class="ml-2">{{ t('profile.menu.security') }}</span>
              </router-link>

              <div class="my-2 border-t border-antique-bronze/10 mx-4"></div>

              <router-link
                to="/commandes"
                class="flex items-center px-6 py-3 transition-colors group border-l-4"
                :class="isActive('/commandes') ? 'bg-antique-bronze/5 border-antique-bronze text-iron-black font-semibold' : 'border-transparent text-stone-grey hover:bg-gray-50 hover:text-iron-black'"
                @click="closeMobileNav"
              >
                <i class="fas fa-shopping-bag w-6 text-center" :class="isActive('/commandes') ? 'text-antique-bronze' : 'group-hover:text-iron-black'"></i>
                <span class="ml-2">{{ t('profile.menu.orders') }}</span>
              </router-link>

              <router-link
                to="/my-reservations"
                class="flex items-center px-6 py-3 transition-colors group border-l-4"
                :class="isActive('/my-reservations') ? 'bg-antique-bronze/5 border-antique-bronze text-iron-black font-semibold' : 'border-transparent text-stone-grey hover:bg-gray-50 hover:text-iron-black'"
                @click="closeMobileNav"
              >
                <i class="fas fa-ticket-alt w-6 text-center" :class="isActive('/my-reservations') ? 'text-antique-bronze' : 'group-hover:text-iron-black'"></i>
                <span class="ml-2">{{ t('profile.menu.reservations') }}</span>
              </router-link>

              <router-link
                to="/my-quests"
                class="flex items-center px-6 py-3 transition-colors group border-l-4"
                :class="isActive('/my-quests') ? 'bg-antique-bronze/5 border-antique-bronze text-iron-black font-semibold' : 'border-transparent text-stone-grey hover:bg-gray-50 hover:text-iron-black'"
                @click="closeMobileNav"
              >
                <i class="fas fa-scroll w-6 text-center" :class="isActive('/my-quests') ? 'text-antique-bronze' : 'group-hover:text-iron-black'"></i>
                <span class="ml-2">{{ t('profile.menu.quests') }}</span>
              </router-link>

              <div class="my-2 border-t border-antique-bronze/10 mx-4"></div>

              <button
                @click="handleLogout"
                class="w-full flex items-center px-6 py-3 transition-colors text-red-600 hover:bg-red-50 text-left border-l-4 border-transparent group"
              >
                <i class="fas fa-sign-out-alt w-6 text-center group-hover:scale-110 transition-transform"></i>
                <span class="ml-2 font-medium">{{ t('profile.menu.logout') }}</span>
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const user = computed(() => authStore.user)
const mobileNavOpen = ref(false)

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const isSecurityTab = computed(() => {
  return route.path === '/profile' && route.query.tab === 'security'
})

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value
}

const closeMobileNav = () => {
  mobileNavOpen.value = false
}

const handleLogout = () => {
  closeMobileNav()
  authStore.logout()
  router.push('/')
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
