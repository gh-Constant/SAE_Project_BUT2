<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { isAdmin, isPrestataire } from '@/services/roleService';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const auth = useAuthStore();
const cartStore = useCartStore();
const isLoggedIn = computed(() => auth.isAuthenticated);
const showDropdown = ref(false);

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

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // Le panier est maintenant chargé automatiquement lors du login/checkAuth
  // Plus besoin de le charger ici manuellement
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
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
  <nav class="bg-white shadow-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <router-link
          to="/"
          class="flex-shrink-0 flex items-center cursor-pointer"
        >
          <img 
            src="/images/Logo1.png" 
            alt="MedievalEvent Logo" 
            class="h-16 w-auto transition-transform hover:scale-105"
          >
        </router-link>
        
        <!-- Boutons de switch visibles uniquement en mode mock -->
        <div v-if="isMockMode" class="flex gap-2">
          <button
            class="px-4 py-2 text-orange-600 hover:text-orange-700 rounded-full border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 font-semibold text-sm"
            @click="auth.login('aventurier@medieval.com', 'password123')"
          >
            Switch to Aventurier
          </button>
          <button
            class="px-4 py-2 text-orange-600 hover:text-orange-700 rounded-full border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 font-semibold text-sm"
            @click="auth.login('prestataire@medieval.com', 'password123')"
          >
            Switch to Prestataire
          </button>
          <button
            class="px-4 py-2 text-orange-600 hover:text-orange-700 rounded-full border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 font-semibold text-sm"
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
            class="px-6 py-2.5 text-orange-600 hover:text-orange-700 rounded-full border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 font-semibold text-sm"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="px-6 py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
            >
              Register
            </router-link>
          </template>

          <div
            v-if="isLoggedIn"
            class="relative dropdown-container"
          >
            <button
              class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-orange-50 transition-all duration-200"
              @click="toggleDropdown"
            >
              <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-200">
                <img 
                  v-if="auth.user?.avatarUrl" 
                  :src="auth.user.avatarUrl" 
                  :alt="auth.user.firstname"
                  class="w-full h-full object-cover"
                >
                <i
                  v-else
                  class="fas fa-user text-white text-sm"
                />
              </div>
              <div class="text-left">
                <div class="text-sm font-semibold text-gray-900">
                  {{ auth.user?.firstname }} {{ auth.user?.lastname }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ auth.user?.email }}
                </div>
              </div>
              <i class="fas fa-chevron-down text-xs text-gray-400" />
            </button>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
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
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-cog mr-3 text-gray-400" />
                Panel Administrateur
              </router-link>
              <router-link
                v-if="isPrestataire(auth.user)"
                to="/prestataire"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
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
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
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