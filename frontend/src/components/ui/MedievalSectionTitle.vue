<template>
  <div class="flex items-center justify-center gap-4 md:gap-8 mb-10">
    <!-- Left Flourish -->
    <div class="hidden md:block w-16 h-[2px] relative" :class="flourishGradientLeft">
      <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45" :class="accentColor"></div>
    </div>
    
    <div class="text-center relative">
      <!-- Top Underline with Diamond -->
      <div class="flex items-center justify-center mb-4 gap-2">
        <div class="h-[2px] w-12" :class="underlineGradientLeft"></div>
        <div class="w-3 h-3 border-2 rotate-45" :class="[borderColor, diamondBg]"></div>
        <div class="h-[2px] w-12" :class="underlineGradientRight"></div>
      </div>
      
      <h2 class="text-4xl md:text-5xl font-medieval font-bold px-4 relative z-10" :class="textColor">
        <slot></slot>
      </h2>
      
      <!-- Bottom Underline with Diamond -->
      <div class="flex items-center justify-center mt-4 gap-2">
        <div class="h-[2px] w-12" :class="underlineGradientLeft"></div>
        <div class="w-3 h-3 border-2 rotate-45" :class="[borderColor, diamondBg]"></div>
        <div class="h-[2px] w-12" :class="underlineGradientRight"></div>
      </div>
    </div>

    <!-- Right Flourish -->
    <div class="hidden md:block w-16 h-[2px] relative" :class="flourishGradientRight">
      <div class="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45" :class="accentColor"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  theme: {
    type: String,
    default: 'light', // 'light' or 'dark'
    validator: (value: string) => ['light', 'dark'].includes(value)
  }
});

const isDark = computed(() => props.theme === 'dark');

const textColor = computed(() => isDark.value ? 'text-parchment' : 'text-iron-black');
const accentColor = computed(() => isDark.value ? 'bg-warm-sand text-warm-sand' : 'bg-antique-bronze text-antique-bronze');
const borderColor = computed(() => isDark.value ? 'border-warm-sand' : 'border-antique-bronze');
const diamondBg = computed(() => isDark.value ? 'bg-dark-wood' : 'bg-parchment');

const flourishGradientLeft = computed(() => isDark.value 
  ? 'bg-gradient-to-l from-warm-sand to-transparent' 
  : 'bg-gradient-to-l from-antique-bronze to-transparent');

const flourishGradientRight = computed(() => isDark.value 
  ? 'bg-gradient-to-r from-warm-sand to-transparent' 
  : 'bg-gradient-to-r from-antique-bronze to-transparent');

const underlineGradientLeft = computed(() => isDark.value 
  ? 'bg-gradient-to-r from-transparent to-warm-sand' 
  : 'bg-gradient-to-r from-transparent to-antique-bronze');

const underlineGradientRight = computed(() => isDark.value 
  ? 'bg-gradient-to-l from-transparent to-warm-sand' 
  : 'bg-gradient-to-l from-transparent to-antique-bronze');
</script>
