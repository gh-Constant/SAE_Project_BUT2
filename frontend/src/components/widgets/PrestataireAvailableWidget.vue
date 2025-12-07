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

    <div class="p-6">
      <h2 class="text-3xl font-medieval font-bold mb-4 text-iron-black">{{ location.name }}</h2>
      <p class="text-base font-body leading-relaxed text-stone-grey mb-6">{{ location.description }}</p>

      <div class="bg-antique-bronze/10 border border-antique-bronze/30 rounded-lg p-4 mb-6 flex items-center shadow-sm">
        <div class="w-12 h-12 bg-antique-bronze text-white rounded-full flex items-center justify-center mr-4 text-lg shadow-md">
          <i class="fas fa-store"></i>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-medieval font-bold text-antique-bronze mb-1">{{ t('widgets.available.title') }}</h3>
          <p class="text-sm font-body text-stone-grey">
            {{ t('widgets.available.description') }}
          </p>
        </div>
      </div>

      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6 font-body">
        <div class="flex justify-between mb-2">
          <span class="font-bold text-iron-black">{{ t('widgets.available.location') }}</span>
          <span class="text-stone-grey">{{ location.static_code }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-bold text-iron-black">{{ t('widgets.available.status_label') }}</span>
          <span class="text-green-700 font-bold">{{ t('widgets.available.status_available') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold text-iron-black">{{ t('widgets.available.price') }}</span>
          <span class="text-antique-bronze font-medieval font-bold text-lg">{{ location.price }} {{ t('widgets.available.currency') }}</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 font-body">
        <p class="text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-5 font-body">
        <p class="text-green-700">{{ successMessage }}</p>
      </div>

      <div class="mb-6">
        <button 
          class="w-full py-3 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold text-lg rounded shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          @click="acheterEmplacement"
          :disabled="isLoading || isPurchased"
        >
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i>
            {{ t('widgets.available.acquire_loading') }}
          </span>
          <span v-else-if="isPurchased">
            <i class="fas fa-check"></i>
            {{ t('widgets.available.acquire_success') }}
          </span>
          <span v-else>
            {{ t('widgets.available.acquire_button') }}
          </span>
        </button>
        
        <h3 class="text-xl font-medieval font-bold mb-3 text-iron-black mt-6">{{ t('widgets.available.opportunities_title') }}</h3>
        <ul class="space-y-2 font-body">
          <li class="flex items-center p-2 border-b border-antique-bronze/10 last:border-b-0">
            <i class="fas fa-store text-antique-bronze mr-3 w-4"></i>
            <span class="text-stone-grey">{{ t('widgets.available.opp_store') }}</span>
          </li>
          <li class="flex items-center p-2 border-b border-antique-bronze/10 last:border-b-0">
            <i class="fas fa-scroll text-antique-bronze mr-3 w-4"></i>
            <span class="text-stone-grey">{{ t('widgets.available.opp_quest') }}</span>
          </li>
          <li class="flex items-center p-2 border-b border-antique-bronze/10 last:border-b-0">
            <i class="fas fa-calendar-alt text-antique-bronze mr-3 w-4"></i>
            <span class="text-stone-grey">{{ t('widgets.available.opp_event') }}</span>
          </li>
          <li class="flex items-center p-2">
            <i class="fas fa-users text-antique-bronze mr-3 w-4"></i>
            <span class="text-stone-grey">{{ t('widgets.available.opp_reputation') }}</span>
          </li>
        </ul>
      </div>

      <div class="flex justify-end">
        <button 
          class="px-6 py-2 bg-stone-grey hover:bg-iron-black text-white font-medieval font-bold rounded shadow-md transition-colors border border-stone-grey/50" 
          @click="$emit('close')"
        >
          {{ t('widgets.available.close') }}
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

import { ref } from 'vue';
import { LocationMock } from '@/mocks/locations';
import { locationService } from '@/services/locationService';
import { authService } from '@/services/authService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
      errorMessage.value = t('widgets.available.error_login');
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
