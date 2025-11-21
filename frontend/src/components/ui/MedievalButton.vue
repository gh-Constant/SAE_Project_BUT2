<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    class="
      relative inline-flex items-center justify-center px-8 py-3
      font-medieval font-bold text-lg tracking-wide
      text-white transition-all duration-300
      bg-antique-bronze
      border-2 border-[#8B6B43]
      shadow-[0_4px_0_#5D4037]
      active:shadow-none active:translate-y-[4px]
      hover:bg-[#a88558] hover:brightness-110
      group overflow-hidden
    "
    :class="{ 'w-full': fullWidth }"
  >
    <!-- Texture overlay -->
    <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>
    
    <!-- Inner bevel highlight -->
    <div class="absolute inset-0 border-t border-white/30 pointer-events-none"></div>
    
    <!-- Content -->
    <span class="relative z-10 flex items-center gap-2 drop-shadow-md">
      <slot></slot>
    </span>
    
    <!-- Shine effect on hover -->
    <div class="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
  </component>
</template>

<script setup lang="ts">
defineProps({
  href: {
    type: String,
    default: null,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}
</style>
