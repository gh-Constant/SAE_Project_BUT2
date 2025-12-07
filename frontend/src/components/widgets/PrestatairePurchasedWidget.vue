<!--
  @file PrestatairePurchasedWidget.vue
  @description
  Composant widget pour afficher les informations des locations prestataires déjà achetées.
  Montre le profil du prestataire propriétaire, les options d'interaction, et la gestion des blogs.

  @utilité
  - Affiche l'image de bannière et les informations de base de la location
  - Présente le profil du prestataire propriétaire avec avatar et informations
  - Fournit un accès direct au profil du prestataire
  - Permet la création, modification et suppression de blogs pour la location

  @props
  - location: LocationMock - Les données de la location prestataire achetée

  @events
  - close: Émis quand l'utilisateur ferme le widget

  @dépendances
  - LocationMock, USERS, PRESTATAIRE_TYPES: Données mock
  - useAuthStore: Pour vérifier le rôle de l'utilisateur
  - Editor: Composant d'édition de texte riche
-->
<template>
  <div class="min-h-96">
    <div class="relative w-full h-48 overflow-hidden rounded-t-lg">
      <img :src="location.banner_image" :alt="location.name" class="w-full h-full object-cover" />
    </div>

    <div class="p-6">
      <h2 class="text-3xl font-medieval font-bold mb-4 text-iron-black">{{ location.name }}</h2>
      <p class="text-base font-body leading-relaxed text-stone-grey mb-6">{{ location.description }}</p>

      <!-- Prestataire Profile Section -->
      <div class="bg-antique-bronze/10 border border-antique-bronze/30 rounded-lg p-4 mb-6 shadow-sm" v-if="prestataire">
        <div class="flex items-center mb-4">
          <div class="relative">
            <img :src="prestataire.avatar_url" :alt="prestataire.firstname" class="w-16 h-16 rounded-full mr-4 border-2 border-antique-bronze object-cover" />
            <div class="absolute -bottom-1 -right-1 bg-antique-bronze text-white text-xs px-2 py-0.5 rounded-full font-medieval border border-white">
              {{ t('widgets.purchased.owner_label') }}
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-medieval font-bold text-iron-black">{{ prestataire.firstname }} {{ prestataire.lastname }}</h3>
            <p class="text-sm font-body text-stone-grey italic">{{ prestataireTypeName }}</p>
          </div>
        </div>
        <button 
          class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-2 px-4 rounded shadow-md transition-all duration-200 flex items-center justify-center gap-2" 
          @click="viewProfile"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          {{ t('widgets.purchased.view_profile') }}
        </button>
      </div>

      <!-- Blogs Section -->
      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <BlogSection :locationId="location.id" :isOwner="isOwner" />
      </div>

      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6 font-body">
        <div class="flex justify-between mb-2">
          <span class="font-bold text-iron-black">{{ t('widgets.purchased.location') }}</span>
          <span class="text-stone-grey">{{ location.static_code }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-bold text-iron-black">{{ t('widgets.purchased.status_label') }}</span>
          <span class="text-antique-bronze font-bold">{{ t('widgets.purchased.status_acquired') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold text-iron-black">{{ t('widgets.purchased.value') }}</span>
          <span class="text-antique-bronze font-medieval font-bold">{{ location.price }} {{ t('widgets.available.currency') }}</span>
        </div>
      </div>

      <!-- Shop Section -->
      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <ShopSection :location-id="location.id" :is-owner="isOwner" />
      </div>

      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <EventSection :location-id="location.id" />
      </div>

      <!-- Quest Section -->
      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <QuestSection :location-id="location.id" :is-owner="isOwner" />
      </div>

      <div class="flex gap-3 justify-end">
        <button 
          class="px-6 py-2 bg-stone-grey hover:bg-iron-black text-white font-medieval font-bold rounded shadow-md transition-colors border border-stone-grey/50" 
          @click="$emit('close')"
        >
          {{ t('widgets.purchased.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Script du composant PrestatairePurchasedWidget
 * Gère l'affichage des locations prestataires achetées et la gestion des blogs
 */

import { computed } from 'vue';
import { LocationMock } from '@/mocks/locations';
import { USERS } from '@/mocks/users';
import { useAuthStore } from '@/stores/auth';
import BlogSection from './BlogSection.vue';
import ShopSection from './ShopSection.vue';
import EventSection from './EventSection.vue';
import QuestSection from './QuestSection.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Props {
  location: LocationMock;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const prestataire = computed(() => {
  // Use prestataire data from location if available (from backend)
  // Otherwise fallback to mock data for development
  if (props.location.prestataire) {
    return props.location.prestataire;
  }
  return USERS.find(user => user.id === props.location.id_prestataire);
});

const prestataireTypeName = computed(() => {
  // For now, return a generic label since prestataire type is on user, not in the prestataire subset
  // TODO: Fetch full user details if needed for type
  return 'Prestataire';
});

// Check if current user is the owner
const isOwner = computed(() => {
  const authStore = useAuthStore();
  if (!authStore.user) return false;
  return props.location.id_prestataire === authStore.user.id;
});

const viewProfile = () => {
  // TODO: Naviguer vers le profil du prestataire
  console.log('Affichage du profil de:', prestataire.value?.firstname);
};

</script>
