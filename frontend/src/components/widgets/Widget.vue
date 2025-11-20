<!--
  @file Widget.vue
  @description
  Composant principal du système de widgets pour afficher les informations des locations.
  Sert de conteneur modal pour les différents types de widgets de location.

  @utilité
  - Affiche une modale élégante avec des effets visuels (bordure dégradée, lueur intérieure)
  - Gère l'affichage conditionnel des widgets selon le type de location
  - Fournit une interface unifiée pour fermer les widgets
  - Utilise un système de superposition avec un fond semi-transparent

  @props
  - location: LocationMock - Les données de la location à afficher

  @events
  - close: Émis quand l'utilisateur ferme le widget

  @dépendances
  - StoryWidget.vue: Pour les locations de type "story"
  - PrestatairePurchasedWidget.vue: Pour les locations prestataires achetées
  - PrestataireAvailableWidget.vue: Pour les locations prestataires disponibles
-->
<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-[1000] px-4 backdrop-blur-sm bg-black/40"
    @click="closeWidget"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden relative border border-gray-200"
      @click.stop
    >
      <!-- Decorative gradient border -->
      <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-0.5 -z-10">
        <div class="bg-white rounded-2xl h-full w-full"></div>
      </div>

      <!-- Inner glow effect -->
      <div class="absolute inset-1 rounded-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 opacity-50 -z-20"></div>
      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 z-10 hover:scale-110 active:scale-95"
        @click="closeWidget"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[85vh] scrollbar-hide">
        <!-- Story Location Widget -->
        <StoryWidget
          v-if="location.id_location_type === LocationType.STORY_LOCATION_TYPE_ID"
          :location="location"
          @close="closeWidget"
        />

        <!-- Prestataire Location Widgets -->
        <PrestatairePurchasedWidget
          v-else-if="location.id_location_type === LocationType.PRESTATAIRE_LOCATION_TYPE_ID && location.purchased"
          :location="location"
          @close="closeWidget"
        />
        <PrestataireAvailableWidget
          v-else-if="location.id_location_type === LocationType.PRESTATAIRE_LOCATION_TYPE_ID && !location.purchased"
          :location="location"
          @close="closeWidget"
        />

        <!-- Fallback -->
        <div v-else class="p-12 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Unknown Location Type</h3>
          <p class="text-gray-500">Type id: <span class="font-mono text-sm">{{ location.id_location_type }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Script du composant Widget
 * Gère la logique d'affichage conditionnel des différents types de widgets
 */

import { defineProps, defineEmits } from 'vue';
import { LocationMock } from '@/mocks/locations';
import StoryWidget from './StoryWidget.vue';
import PrestatairePurchasedWidget from './PrestatairePurchasedWidget.vue';
import PrestataireAvailableWidget from './PrestataireAvailableWidget.vue';
import { LocationType } from '@/mocks/locationTypes';

interface Props {
  location: LocationMock;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const closeWidget = () => {
  emit('close');
};
</script>

<style scoped>
/* Masquer la scrollbar mais garder le scroll */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>