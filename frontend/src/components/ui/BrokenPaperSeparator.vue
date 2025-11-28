<template>
  <div 
    class="w-full h-[60px] relative z-20 -mb-10 pointer-events-none"
  >
    <div 
      class="absolute inset-0 w-full h-full rotate-180"
      :style="{
        backgroundColor: fillColor,
        maskImage: `url('/images/separatorinspirated.png')`,
        // @ts-ignore
        webkitMaskImage: `url('/images/separatorinspirated.png')`,
        maskSize: '100% 100%',
        // @ts-ignore
        webkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        // @ts-ignore
        webkitMaskRepeat: 'no-repeat'
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: '#E6D6BC', // Warm Sand by default
  },
  direction: {
    type: String,
    default: 'top', // 'top' or 'bottom'
  },
});

const fillColor = computed(() => props.color);
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
