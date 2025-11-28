<!--
  @file PrestataireAvailableWidget.vue
  @description
  Composant widget pour afficher les informations des locations prestataires disponibles à l'achat.
  Présente les emplacements libres que les prestataires peuvent acquérir.

  @utilité
  - Affiche l'image de bannière et les informations de base de la location
  - Présente un message d'encouragement pour l'achat
  - Liste les fonctionnalités disponibles sur cette location
  - Affiche le prix et les informations de statut
  - Utilise un design informatif pour inciter à l'achat

  @props
  - location: LocationMock - Les données de la location prestataire disponible

  @events
  - close: Émis quand l'utilisateur ferme le widget

  @remarques
  - Ce widget est principalement informatif pour les locations non achetées
  - La logique d'achat sera implémentée plus tard dans le développement
-->
<template>
  <div class="min-h-96">
    <div class="relative w-full h-48 overflow-hidden rounded-t-lg">
      <img :src="location.banner_image" :alt="location.name" class="w-full h-full object-cover" />
    </div>

    <div class="p-5">
      <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ location.name }}</h2>
      <p class="text-base leading-relaxed text-gray-600 mb-5">{{ location.description }}</p>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 flex items-center">
        <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 text-lg">
          <i class="fas fa-store"></i>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-blue-800 mb-1">Available for Purchase</h3>
          <p class="text-sm text-blue-700">
            This location is available for prestataires to set up their business.
          </p>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
        <div class="flex justify-between mb-2">
          <span class="font-semibold text-gray-700">Location:</span>
          <span class="text-gray-600">{{ location.static_code }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-semibold text-gray-700">Status:</span>
          <span class="text-yellow-600 font-semibold">Available</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Price:</span>
          <span class="text-green-600 font-semibold text-lg">{{ location.price }} gold</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
        <p class="text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
        <p class="text-green-700">{{ successMessage }}</p>
      </div>

      <div class="mb-5">
        <button 
          class="px-5 py-2.5 bg-blue-600 hover:bg-green-700 text-white font-semibold py-3 px-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" 
          @click="acheterEmplacement"
          :disabled="isLoading || isPurchased"
        >
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Purchasing...
          </span>
          <span v-else-if="isPurchased">
            <i class="fas fa-check mr-2"></i>
            Purchased!
          </span>
          <span v-else>
            Acheter cet emplacement
          </span>
        </button>
        <h3 class="text-lg font-semibold mb-3 text-gray-800 mt-4">What you can do here:</h3>
        <ul class="space-y-2">
          <li class="flex items-center p-2 border-b border-gray-200 last:border-b-0">
            <i class="fas fa-store text-gray-600 mr-3 w-4"></i>
            <span class="text-gray-700">Set up an online shop to sell your products</span>
          </li>
          <li class="flex items-center p-2 border-b border-gray-200 last:border-b-0">
            <i class="fas fa-scroll text-gray-600 mr-3 w-4"></i>
            <span class="text-gray-700">Post quests and offer rewards to adventurers</span>
          </li>
          <li class="flex items-center p-2 border-b border-gray-200 last:border-b-0">
            <i class="fas fa-calendar-alt text-gray-600 mr-3 w-4"></i>
            <span class="text-gray-700">Organize events and demonstrations</span>
          </li>
          <li class="flex items-center p-2">
            <i class="fas fa-users text-gray-600 mr-3 w-4"></i>
            <span class="text-gray-700">Build your reputation and attract more customers</span>
          </li>
        </ul>
      </div>

      <div class="flex justify-end">
        <button class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Script du composant PrestataireAvailableWidget
 * Gère l'affichage et l'achat des locations prestataires disponibles
 */

import { defineProps, defineEmits, ref } from 'vue';
import { LocationMock } from '@/mocks/locations';
import { locationService } from '@/services/locationService';
import { authService } from '@/services/authService';

interface Props {
  location: LocationMock;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  purchased: [location: LocationMock];
}>();

const isLoading = ref(false);
const isPurchased = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function acheterEmplacement() {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    // Get current user
    const user = await authService.getCurrentUser();
    console.log(user + "try to purchase location");
    
    if (!user) {
      errorMessage.value = 'You must be logged in to purchase a location';
      return;
    }

    // Purchase the location using the service
    // Handle both real backend (id_user) and mock data (id)
    const userId = (user as any).id_user || user.id;
    const updatedLocation = await locationService.purchaseLocation(props.location.id, userId);
    
    // Update local state
    isPurchased.value = true;
    successMessage.value = 'Location purchased successfully!';
    
    // Emit event to notify parent component
    emit('purchased', updatedLocation);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      emit('close');
    }, 2000);
    
  } catch (error) {
    console.error('Error purchasing location:', error);
    errorMessage.value = error instanceof Error ? error.message : 'Failed to purchase location. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>
