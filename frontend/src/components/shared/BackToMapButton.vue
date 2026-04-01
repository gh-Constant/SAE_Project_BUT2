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
import { useRouter } from 'vue-router';

const props = defineProps({
  positionClass: {
    type: String,
    default: 'fixed top-20 left-4'
  },
  to: {
    type: String,
    default: '/'
  },
  title: {
    type: String,
    default: 'Retour'
  }
});

const router = useRouter();

const goBack = () => {
  router.push(props.to);
};
</script>

