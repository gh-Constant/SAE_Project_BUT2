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
      <img :src="location.banner_image" :alt="location.name" class="w-full h-full object-cover" />
    </div>

    <div class="p-6">
      <h2 class="text-3xl font-medieval font-bold mb-4 text-iron-black">{{ location.name }}</h2>
      <p class="text-base font-body leading-relaxed text-stone-grey mb-6">{{ location.description }}</p>

      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <div class="flex justify-between mb-2 font-body">
          <span class="font-bold text-iron-black">{{ t('widgets.story.location') }}</span>
          <span class="text-stone-grey">{{ location.static_code }}</span>
        </div>
        <div class="flex justify-between font-body">
          <span class="font-bold text-iron-black">{{ t('widgets.story.type') }}</span>
          <span class="text-stone-grey">{{ t('widgets.story.type_value') }}</span>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <button 
          class="px-6 py-2 bg-stone-grey hover:bg-iron-black text-white font-medieval font-bold rounded shadow-md transition-colors border border-stone-grey/50" 
          @click="$emit('close')"
        >
          {{ t('widgets.story.close') }}
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

import { LocationMock } from '@/mocks/locations';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Props {
  location: LocationMock;
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();

</script>
