<!--
  @file StoryWidget.vue
  @description
  Composant widget pour afficher les informations des locations de type "story".
  Montre les détails des emplacements principaux de l'histoire du jeu.

  @utilité
  - Affiche l'image de bannière de la location
  - Présente le nom, la description et les informations de base
  - Utilise un design simple et épuré pour les éléments narratifs

  @props
  - location: LocationMock - Les données de la location story à afficher

  @events
  - close: Émis quand l'utilisateur ferme le widget

  @dépendances
  - LocationMock: Interface des données de location
-->
<template>
  <div class="min-h-96">
    <div class="relative w-full h-48 overflow-hidden rounded-t-lg">
      <img :src="location.bannerImage" :alt="location.name" class="w-full h-full object-cover" />
    </div>

    <div class="p-5">
      <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ location.name }}</h2>
      <p class="text-base leading-relaxed text-gray-600 mb-5">{{ location.description }}</p>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
        <div class="flex justify-between mb-2">
          <span class="font-semibold text-gray-700">Location:</span>
          <span class="text-gray-600">{{ location.staticCode }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Type:</span>
          <span class="text-gray-600">Story Location</span>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <button class="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Script du composant StoryWidget
 * Gère l'affichage des informations des locations narratives
 */

import { defineProps, defineEmits } from 'vue';
import { LocationMock } from '@/mocks/locations';

interface Props {
  location: LocationMock;
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();

</script>
