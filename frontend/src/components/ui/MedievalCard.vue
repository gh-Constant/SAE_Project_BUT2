<template>
  <div class="relative group h-full">
    <!-- Card Background with texture -->
    <div class="absolute inset-0 bg-parchment rounded-sm shadow-md transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-antique-bronze/30"></div>
    
    <!-- Decorative Corners -->
    <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
    <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
    <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
    <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>

    <!-- Content Container -->
    <div class="relative p-8 flex flex-col items-center text-center h-full z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
      <!-- Icon Container -->
      <div class="mb-6 relative">
        <div class="w-16 h-16 bg-antique-bronze/10 rounded-full flex items-center justify-center text-antique-bronze border border-antique-bronze/20 group-hover:bg-antique-bronze group-hover:text-parchment transition-colors duration-300">
          <slot name="icon"></slot>
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-2xl font-medieval font-bold text-iron-black mb-4 group-hover:text-antique-bronze transition-colors duration-300">
        <slot name="title"></slot>
      </h3>

      <!-- Description -->
      <p class="text-stone-grey leading-relaxed font-body">
        <slot name="description"></slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Slot-based component for maximum flexibility
</script>
