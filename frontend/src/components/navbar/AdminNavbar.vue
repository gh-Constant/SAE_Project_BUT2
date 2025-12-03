<template>
  <header class="bg-white/50 backdrop-blur-sm border-b-4 border-double border-antique-bronze/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo & Title -->
        <div class="flex items-center gap-6">
          <router-link to="/" class="hover:opacity-80 transition-opacity">
            <img 
              src="/images/transparent_logo.png" 
              alt="Kingdom Logo" 
              class="h-16 w-auto object-contain drop-shadow-md"
            />
          </router-link>
          <div class="hidden md:block w-px h-12 bg-antique-bronze/30"></div>
          <router-link to="/admin" class="hover:opacity-80 transition-opacity">
            <h1 class="text-3xl font-medieval font-bold text-iron-black leading-none">
              Panel Admin
            </h1>
          </router-link>
        </div>

        <!-- User Actions -->
        <div class="flex items-center gap-6">
          <span class="text-iron-black font-medieval text-lg hidden sm:block">
            Bienvenue, {{ user?.firstname }} {{ user?.lastname }}
          </span>
          <MedievalButton 
            variant="primary" 
            :small="true"
            @click="$emit('logout')"
          >
            Déconnexion
          </MedievalButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import MedievalButton from '@/components/ui/MedievalButton.vue';
import { PropType } from 'vue';

defineProps({
  user: {
    type: Object as PropType<any>,
    required: true
  }
});

defineEmits(['logout']);
</script>
