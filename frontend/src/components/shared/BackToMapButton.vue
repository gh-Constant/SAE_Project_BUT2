<template>
  <button 
    @click="goBack" 
    :class="[positionClass, 'z-50 flex items-center justify-center gap-0 hover:gap-2 p-3 hover:px-4 bg-antique-bronze text-white rounded-full shadow-lg hover:bg-antique-bronze/90 hover:scale-105 transition-all duration-300 group']"
    aria-label="Retour"
    title="Retour"
  >
    <i class="fas fa-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
    <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 font-medium text-sm">
      {{ title }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  positionClass: {
    type: String,
    default: 'fixed top-20 left-4'
  },
  to: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: 'Retour'
  }
});

const router = useRouter();
const route = useRoute();

const goBack = () => {
  if (props.to) {
    router.push(props.to);
  } else if (window.history.state && window.history.state.back) {
    router.back();
  } else {
    // Determine sensible fallback based on current route path
    const path = route.path;
    if (path.startsWith('/admin') && path !== '/admin') {
      router.push('/admin');
    } else if (path.startsWith('/prestataire') && path !== '/prestataire') {
      router.push('/prestataire');
    } else {
      router.push('/map');
    }
  }
};
</script>
