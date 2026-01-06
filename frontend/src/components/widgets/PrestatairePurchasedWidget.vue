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

      <!-- Pending Warning -->
      <div v-if="location.status === 'PENDING'" class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-amber-700" v-if="!isAdmin">
              <span class="font-bold">Validation en cours :</span>
              Ce lieu est en attente de validation par un administrateur. Les modifications sont temporairement
              désactivées.
            </p>
            <div class="text-sm text-amber-700" v-else>
              <div class="flex gap-3 mt-2">
                <button
                  class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded shadow-sm text-sm font-bold transition-colors flex items-center gap-1"
                  @click="validateLocation">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                  {{ t('widgets.purchased.validate_button') }}
                </button>
                <button
                  class="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded shadow-sm text-sm font-bold transition-colors flex items-center gap-1"
                  @click="rejectLocation">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                  {{ t('widgets.purchased.reject_button') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prestataire Profile Section -->
      <div class="bg-antique-bronze/10 border border-antique-bronze/30 rounded-lg p-4 mb-6 shadow-sm"
        v-if="prestataire">
        <div class="flex items-center mb-4">
          <div class="relative">
            <img :src="prestataire.avatar_url" :alt="prestataire.firstname"
              class="w-16 h-16 rounded-full mr-4 border-2 border-antique-bronze object-cover" />
            <div
              class="absolute -bottom-1 -right-1 bg-antique-bronze text-white text-xs px-2 py-0.5 rounded-full font-medieval border border-white">
              {{ t('widgets.purchased.owner_label') }}
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-medieval font-bold text-iron-black">{{ prestataire.firstname }} {{
              prestataire.lastname }}</h3>
            <p class="text-sm font-body text-stone-grey italic">{{ prestataireTypeName }}</p>
          </div>
        </div>
        <button
          class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-2 px-4 rounded shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          @click="viewProfile">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
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
          <span class="text-antique-bronze font-medieval font-bold">{{ location.price }} {{
            t('widgets.available.currency') }}</span>
        </div>
      </div>

      <!-- Shop Section -->
      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <ShopSection :location-id="location.id" :is-owner="isOwner" />
      </div>

      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <EventSection :location-id="location.id" :is-owner="isOwner" />
      </div>

      <!-- Quest Section -->
      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <QuestSection :location-id="location.id" :is-owner="isOwner" />
      </div>

      <div class="flex gap-3 justify-end">
        <button
          class="px-6 py-2 bg-stone-grey hover:bg-iron-black text-white font-medieval font-bold rounded shadow-md transition-colors border border-stone-grey/50"
          @click="$emit('close')">
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
import { useRouter } from 'vue-router'; // Added import
import { LocationMock } from '@/mocks/locations';
import { USERS } from '@/mocks/users';
import { useAuthStore } from '@/stores/auth';
import BlogSection from './BlogSection.vue';
import ShopSection from './ShopSection.vue';
import EventSection from './EventSection.vue';
import QuestSection from './QuestSection.vue';
import { useI18n } from 'vue-i18n';
import { locationService } from '@/services/locationService';
import { isAdmin as checkIsAdmin } from '@/services/roleService';

const { t } = useI18n();
const router = useRouter(); // Initialize router

interface Props {
  location: LocationMock;
}

const props = defineProps<Props>();

const emit = defineEmits<{
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

  // Strict check: User must be owner AND location must not be PENDING
  // If PENDING, they are technically the owner but cannot edit yet
  const userIsOwner = props.location.id_prestataire === authStore.user.id;
  const isApproved = props.location.status !== 'PENDING';

  return userIsOwner && isApproved;
});

const isPendingOwner = computed(() => {
  const authStore = useAuthStore();
  return authStore.user?.id === props.location.id_prestataire && props.location.status === 'PENDING';
});

const viewProfile = () => {
  // TODO: Naviguer vers le profil du prestataire
  console.log('Affichage du profil de:', prestataire.value?.firstname);
};

const isAdmin = computed(() => {
  const authStore = useAuthStore();
  return checkIsAdmin(authStore.user);
});

const validateLocation = async () => {
  if (!confirm('Voulez-vous vraiment valider ce lieu ?')) return;
  try {
    await locationService.validatePurchase(props.location.id);
    emit('close');
    // Note: The map needs to refresh to show the new status color.
    // Ideally we would emit a 'refresh' event, but 'close' might trigger re-fetch in parent or just close.
    // Since we reload map markers frequently, it might be fine, or user has to pan map.
    // For MVP/Mock this is acceptable.
  } catch (error) {
    console.error('Failed to validate location:', error);
    alert('Erreur lors de la validation du lieu.');
  }
};

const rejectLocation = async () => {
  if (!confirm('Voulez-vous vraiment refuser ce lieu ? Il redeviendra disponible.')) return;
  try {
    await locationService.rejectPurchase(props.location.id);
    emit('close');
  } catch (error) {
    console.error('Failed to reject location:', error);
    alert('Erreur lors du refus du lieu.');
  }
};

</script>
