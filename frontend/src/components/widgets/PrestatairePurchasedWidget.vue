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

    <div class="p-5">
      <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ location.name }}</h2>
      <p class="text-base leading-relaxed text-gray-600 mb-5">{{ location.description }}</p>

      <!-- Prestataire Profile Section -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5" v-if="prestataire">
        <div class="flex items-center mb-3">
          <img :src="prestataire.avatar_url" :alt="prestataire.firstname" class="w-12 h-12 rounded-full mr-3 border-2 border-gray-300" />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800">{{ prestataire.firstname }} {{ prestataire.lastname }}</h3>
            <p class="text-sm text-gray-600">{{ prestataireTypeName }}</p>
          </div>
        </div>
        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors" @click="viewProfile">
          View Profile
        </button>
      </div>

      <!-- Blogs Section -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
        <BlogSection :locationId="location.id" :isOwner="isOwner" />
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
        <div class="flex justify-between mb-2">
          <span class="font-semibold text-gray-700">Location:</span>
          <span class="text-gray-600">{{ location.static_code }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-semibold text-gray-700">Status:</span>
          <span class="text-green-600 font-semibold">Purchased</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Price:</span>
          <span class="text-green-600 font-semibold">{{ location.price }} gold</span>
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
 * Script du composant PrestatairePurchasedWidget
 * Gère l'affichage des locations prestataires achetées et la gestion des blogs
 */

import { defineProps, defineEmits, computed } from 'vue';
import { LocationMock } from '@/mocks/locations';
import { USERS } from '@/mocks/users';
import BlogSection from './BlogSection.vue';

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
  // Already done in the backend but better to also do it in the frontend
  // TODO: Replace with actual auth check
  // For now, assuming user is owner if location has a prestataire
  return props.location.id_prestataire !== null;
});

const viewProfile = () => {
  // TODO: Naviguer vers le profil du prestataire
  console.log('Affichage du profil de:', prestataire.value?.firstname);
};


</script>
