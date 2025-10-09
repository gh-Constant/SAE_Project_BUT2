<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const auth = useAuthStore();
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
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
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
          />
        </router-link>

        <div class="flex items-center space-x-4">
          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Register
            </router-link>
          </template>
          <div v-else class="relative dropdown-container">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-white text-sm"></i>
              </div>
              <span class="text-sm font-medium">Mon Compte</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            >
              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <i class="fas fa-sign-out-alt mr-3 text-gray-400"></i>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>