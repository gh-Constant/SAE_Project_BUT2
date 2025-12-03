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
      class="bg-parchment rounded-lg shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden relative border-4 border-double border-antique-bronze"
      @click.stop
    >
      <!-- Decorative corner elements -->
      <div class="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-antique-bronze/40 rounded-tl-lg pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-antique-bronze/40 rounded-tr-lg pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-antique-bronze/40 rounded-bl-lg pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-antique-bronze/40 rounded-br-lg pointer-events-none"></div>

      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-antique-bronze/10 hover:bg-antique-bronze text-antique-bronze hover:text-white transition-all duration-200 z-10"
        @click="closeWidget"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-antique-bronze/50 scrollbar-track-transparent font-body">
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
          @purchased="handlePurchased"
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

import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue';
import { LocationMock } from '@/mocks/locations';
import { useUIStore } from '@/stores/ui';
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
  purchased: [location: LocationMock];
}>();

const closeWidget = () => {
  emit('close');
};

const handlePurchased = (location: LocationMock) => {
  emit('purchased', location);
};

const uiStore = useUIStore();

onMounted(() => {
  uiStore.setWidgetOpen(true);
});

onUnmounted(() => {
  uiStore.setWidgetOpen(false);
});
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(120, 80, 40, 0.4);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(120, 80, 40, 0.7);
}
</style>