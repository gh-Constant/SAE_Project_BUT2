<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isAuthenticated);
</script>

<template>
  <nav class="bg-white shadow-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
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
          <button
            v-else
            @click="auth.logout"
            class="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>