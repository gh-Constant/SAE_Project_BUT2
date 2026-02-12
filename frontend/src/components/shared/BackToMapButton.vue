<template>
  <button 
    @click="goBackToMap" 
    class="fixed top-20 left-4 z-50 flex items-center justify-center gap-0 hover:gap-2 p-3 hover:px-4 bg-antique-bronze text-white rounded-full shadow-lg hover:bg-antique-bronze/90 hover:scale-105 transition-all duration-300 group"
    aria-label="Retour à la carte"
    title="Retour à la carte"
  >
    <i class="fas fa-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
    <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 font-medium text-sm">
      Retour à la carte
    </span>
  </button>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const goBackToMap = () => {
  const query: Record<string, any> = {};
  if (route.query.locationId) {
    query.locationId = route.query.locationId;
  }
  router.push({ path: '/map', query });
};
</script>

