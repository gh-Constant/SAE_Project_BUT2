<template>
  <div class="bg-parchment h-screen flex flex-col overflow-hidden">
    <!-- The Navbar is outside this view, but if it's not fixed, it pushes this view down. 
         However, the router-view is usually placed after the navbar in App.vue. 
         If Navbar is not fixed, this view starts after Navbar. 
         So we just need to fill the remaining height. -->
    <div class="flex-1 relative w-full">
      <MapView :isFullScreen="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MapView from '@/components/MapView.vue';
</script>
