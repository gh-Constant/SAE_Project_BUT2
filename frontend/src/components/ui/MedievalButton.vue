<template>
  <component
    :is="to ? 'router-link' : (href ? 'a' : 'button')"
    :to="to"
    :href="href"
    class="
      relative inline-flex items-center justify-center
      font-medieval font-bold tracking-wide
      text-white transition-all duration-300
      group overflow-hidden
    "
    :class="{ 
      'w-full': fullWidth,
      'px-8 py-3 text-lg': !small,
      'px-4 py-2 text-sm': small,
      'bg-antique-bronze border-2 border-[#8B6B43] shadow-[0_4px_0_#5D4037] active:shadow-none active:translate-y-[4px] hover:bg-[#a88558] hover:brightness-110': variant === 'primary',
      'bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20 hover:border-white/30 active:scale-95': variant === 'transparent',
      'bg-[#8B0000] border-2 border-[#5c0000] shadow-[0_4px_0_#3d0000] active:shadow-none active:translate-y-[4px] hover:bg-[#a30000] hover:brightness-110': variant === 'danger',
      'bg-stone-grey border-2 border-[#2c2c2c] shadow-[0_4px_0_#1a1a1a] active:shadow-none active:translate-y-[4px] hover:bg-[#4a4a4a] hover:brightness-110': variant === 'secondary',
      'bg-transparent border-2 border-antique-bronze text-antique-bronze shadow-none hover:bg-antique-bronze/10 active:translate-y-[2px]': variant === 'outline'
    }"
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
  to: {
    type: [String, Object],
    default: null,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'primary', // 'primary' | 'transparent' | 'danger' | 'secondary' | 'outline'
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
