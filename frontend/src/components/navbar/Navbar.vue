<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { isAdmin, isPrestataire } from '@/services/roleService';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const auth = useAuthStore();
const cartStore = useCartStore();
const isLoggedIn = computed(() => auth.isAuthenticated);
const showDropdown = ref(false);
const isScrolled = ref(false);

// Check if we're on the home page
const route = useRoute();
const isHomePage = computed(() => route.path === '/');

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleLogout = () => {
  auth.logout();
  showDropdown.value = false;
};

// Fermer le dropdown si on clique ailleurs
const closeDropdown = () => {
  showDropdown.value = false;
};

// Gérer le clic en dehors du dropdown
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-container')) {
    showDropdown.value = false;
  }
};

// Cache scroll threshold for better performance
let scrollThreshold = 0;

const updateScrollState = () => {
  const shouldBeScrolled = window.scrollY > scrollThreshold;
  
  // Only update if the state actually changes
  if (isScrolled.value !== shouldBeScrolled) {
    isScrolled.value = shouldBeScrolled;
  }
};

const handleScroll = () => {
  updateScrollState();
};

onMounted(() => {
  // Calculate and cache the scroll threshold once
  scrollThreshold = window.innerHeight * 0.8;
  
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Check initial scroll position
  updateScrollState();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScroll);
});

const isMockMode = import.meta.env.VITE_NO_BACKEND === 'true';

// Route vers le profil selon le rôle de l'utilisateur
const profileRoute = computed(() => {
  if (isAdmin(auth.user)) {
    return '/admin';
  } else if (isPrestataire(auth.user)) {
    return '/prestataire';
  }
  // Pour les aventuriers ou autres rôles, on pourrait créer une route /profile
  return '/';
});

</script>

<template>
  <nav 
    :class="[
      'z-[1100]',
      isHomePage 
        ? ['fixed top-0 left-0 right-0', isScrolled ? 'bg-black/95 backdrop-blur-lg shadow-lg' : 'bg-transparent']
        : 'bg-black/95 backdrop-blur-lg shadow-lg'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Boutons de switch visibles uniquement en mode mock -->
        <div v-if="isMockMode" class="flex gap-2">
          <button
            class="px-4 py-2 text-white/90 hover:text-white rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 font-semibold text-sm shadow-sm hover:shadow-md"
            @click="auth.login('aventurier@medieval.com', 'password123')"
          >
            Switch to Aventurier
          </button>
          <button
            class="px-4 py-2 text-white/90 hover:text-white rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 font-semibold text-sm shadow-sm hover:shadow-md"
            @click="auth.login('prestataire@medieval.com', 'password123')"
          >
            Switch to Prestataire
          </button>
          <button
            class="px-4 py-2 text-white/90 hover:text-white rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 font-semibold text-sm shadow-sm hover:shadow-md"
            @click="auth.login('prestataire2@medieval.com', 'password123')"
          >
            Switch to Prestataire 2
          </button>
          <button
            class="px-4 py-2 text-white/90 hover:text-white rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 font-semibold text-sm shadow-sm hover:shadow-md"
            @click="auth.login('admin@medieval.com', 'password123')"
          >
            Switch to Admin
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Icône panier (visible uniquement si connecté) -->
          <router-link
            v-if="isLoggedIn"
            to="/panier"
            class="relative p-2 text-gray-700 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200"
            title="Mon panier"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount > 9 ? '9+' : cartStore.itemCount }}
            </span>
          </router-link>

          <template v-if="!isLoggedIn">
            <router-link
            to="/login"
            class="px-6 py-2.5 text-white/90 hover:text-white rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 font-semibold text-sm shadow-sm hover:shadow-md"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="px-6 py-2.5 bg-gradient-to-r from-orange-500/90 to-amber-600/90 backdrop-blur-md text-white rounded-lg hover:from-orange-600/95 hover:to-amber-700/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500/50 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl border border-white/10"
            >
              Register
            </router-link>
          </template>

          <div
            v-if="isLoggedIn"
            class="relative dropdown-container"
          >
            <button
              class="flex items-center space-x-3 px-4 py-2 text-white/90 hover:text-white rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
              @click="toggleDropdown"
            >
              <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-md">
                <img 
                  v-if="auth.user?.avatar_url" 
                  :src="auth.user.avatar_url" 
                  :alt="auth.user.firstname"
                  class="w-full h-full object-cover"
                >
                <i
                  v-else
                  class="fas fa-user text-white text-sm"
                />
              </div>
              <div class="text-left">
                <div class="text-sm font-semibold text-white">
                  {{ auth.user?.firstname }} {{ auth.user?.lastname }}
                </div>
                <div class="text-xs text-white/70">
                  {{ auth.user?.email }}
                </div>
              </div>
              <i class="fas fa-chevron-down text-xs text-white/70" />
            </button>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg py-2 z-50 border border-gray-200/50"
            >
              <!-- User Info Header -->
              <div class="px-4 py-2 border-b border-gray-100">
                <div class="text-sm font-semibold text-gray-900">
                  {{ auth.user?.firstname }} {{ auth.user?.lastname }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ auth.user?.email }}
                </div>
              </div>
              
              <!-- Menu Items -->
              <router-link
                v-if="isAdmin(auth.user)"
                to="/admin"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-cog mr-3 text-gray-400" />
                Panel Administrateur
              </router-link>
              <router-link
                v-if="isPrestataire(auth.user)"
                to="/prestataire"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-briefcase mr-3 text-gray-400" />
                Panel Prestataire
              </router-link>
              <div class="border-t border-gray-100" />
              <router-link
                to="/commandes"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-list mr-3 text-gray-400" />
                Mes Commandes
              </router-link>
              <router-link
                :to="profileRoute"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-user-edit mr-3 text-gray-400" />
                Mon Profil
              </router-link>
              <button
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                @click="handleLogout"
              >
                <i class="fas fa-sign-out-alt mr-3 text-gray-400" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>