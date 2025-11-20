<!--
  @file PrestatairePurchasedWidget.vue
  @description
  Composant widget pour afficher les informations des locations prestataires déjà achetées.
  Montre le profil du prestataire propriétaire enrichi et les options d'interaction.

  @utilité
  - Affiche l'image de bannière et les informations de base de la location
  - Présente le profil du prestataire propriétaire avec avatar et informations enrichies
  - Affiche les services disponibles et produits en vente
  - Fournit un accès direct au profil du prestataire et à la boutique

  @props
  - location: LocationMock - Les données de la location prestataire achetée

  @events
  - close: Émis quand l'utilisateur ferme le widget

  @dépendances
  - LocationMock, USERS, PRESTATAIRE_TYPES: Données mock
  - SERVICES, PRODUCTS: Données mock pour services et produits
-->
<template>
  <div class="bg-white">
    <!-- Bannière avec overlay -->
    <div class="relative w-full h-48 overflow-hidden">
      <img :src="location.banner_image" :alt="location.name" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-4 left-6 right-6">
        <h2 class="text-2xl font-bold text-white mb-1 drop-shadow-lg">{{ location.name }}</h2>
      </div>
    </div>

    <div class="p-6 max-w-2xl mx-auto">
      <p class="text-base leading-relaxed text-gray-700 mb-6 text-center">{{ location.description }}</p>

      <!-- Section Profil Prestataire (enrichie) -->
      <div class="bg-white border-2 border-orange-200 rounded-xl shadow-md p-6 mb-6 mx-auto" v-if="prestataire">
        <h3 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
          Profil Prestataire
        </h3>
        
        <div class="flex items-start mb-5">
          <div class="relative">
            <img :src="prestataire.avatar_url" :alt="prestataire.firstname" class="w-20 h-20 rounded-full border-4 border-orange-500 shadow-lg flex-shrink-0" />
            <span v-if="prestataire.is_verified" class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <i class="fas fa-check text-white text-xs"></i>
            </span>
          </div>
          <div class="flex-1 min-w-0 ml-4">
            <div class="flex items-center gap-2 mb-2">
              <h4 class="text-lg font-bold text-gray-900">{{ prestataire.firstname }} {{ prestataire.lastname }}</h4>
            </div>
            <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 mb-3">
              {{ prestataireTypeName }}
            </span>
            <div class="flex items-center gap-4 text-sm text-gray-700">
              <span class="flex items-center font-medium">
                <i class="fas fa-star mr-1.5 text-yellow-500"></i>
                Niveau {{ prestataire.level }}
              </span>
              <span class="flex items-center font-medium">
                <i class="fas fa-gem mr-1.5 text-purple-500"></i>
                {{ Math.round(prestataire.xp) }} XP
              </span>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <div v-if="prestataire.bio" class="mb-4">
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ truncatedBio }}
          </p>
        </div>

        <!-- Spécialités -->
        <div v-if="prestataireFormData.specialties" class="mb-4">
          <p class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Spécialités</p>
          <p class="text-sm text-gray-800 font-medium">{{ prestataireFormData.specialties }}</p>
        </div>

        <!-- Expérience -->
        <div v-if="prestataireFormData.experienceYears" class="mb-4">
          <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
            <i class="fas fa-calendar-alt mr-2"></i>
            {{ prestataireFormData.experienceYears }} années d'expérience
          </span>
        </div>

        <!-- Langues parlées -->
        <div v-if="prestataireFormData.languages && prestataireFormData.languages.length > 0" class="mb-4">
          <p class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Langues parlées</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="lang in prestataireFormData.languages" :key="lang" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              <img :src="getLanguageFlag(lang)" :alt="getLanguageName(lang)" class="w-5 h-4 mr-2 rounded" />
              {{ getLanguageName(lang) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Section Contact -->
      <div class="bg-white border-2 border-orange-200 rounded-xl shadow-md p-6 mb-6 mx-auto" v-if="hasContactInfo">
        <h3 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
          Contact
        </h3>
        
        <!-- Site web -->
        <div v-if="prestataireFormData.website" class="mb-4">
          <a :href="prestataireFormData.website" target="_blank" rel="noopener noreferrer" class="flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
            <i class="fas fa-globe mr-2"></i>
            {{ prestataireFormData.website }}
          </a>
        </div>

        <!-- Réseaux sociaux -->
        <div v-if="hasSocialMedia" class="flex flex-wrap gap-4">
          <a v-if="prestataireFormData.socialMedia.facebook" :href="prestataireFormData.socialMedia.facebook" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-110 shadow-md" title="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
          <a v-if="prestataireFormData.socialMedia.instagram" :href="prestataireFormData.socialMedia.instagram" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all transform hover:scale-110 shadow-md" title="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a v-if="prestataireFormData.socialMedia.twitter" :href="prestataireFormData.socialMedia.twitter" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 text-white transition-all transform hover:scale-110 shadow-md" title="Twitter/X">
            <i class="fab fa-twitter"></i>
          </a>
          <a v-if="prestataireFormData.socialMedia.linkedin" :href="prestataireFormData.socialMedia.linkedin" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-all transform hover:scale-110 shadow-md" title="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </div>

      <!-- Section Services disponibles -->
      <div class="bg-white border-2 border-orange-200 rounded-xl shadow-md p-6 mb-6 mx-auto" v-if="availableServices.length > 0">
        <h3 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
          Services disponibles ici
        </h3>
        <div class="space-y-4">
          <div v-for="service in displayedServices" :key="service.id" class="bg-orange-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-shadow">
            <h5 class="font-semibold text-gray-900 mb-2">{{ service.name }}</h5>
            <p v-if="service.description" class="text-sm text-gray-700 mb-3">{{ service.description }}</p>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
              {{ getServiceTypeName(service.id_service_type) }}
            </span>
          </div>
        </div>
        <button v-if="availableServices.length > 3" @click="viewAllServices" class="mt-4 w-full text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors flex items-center justify-center">
          Voir tous les services ({{ availableServices.length }})
          <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>

      <!-- Section Produits en vente -->
      <div class="bg-white border-2 border-orange-200 rounded-xl shadow-md p-6 mb-6 mx-auto" v-if="availableProducts.length > 0">
        <h3 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
          Produits en vente
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="product in displayedProducts" :key="product.id" class="bg-orange-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-shadow">
            <div v-if="product.image" class="w-full h-28 mb-3 rounded-lg overflow-hidden bg-gray-100">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-full h-28 mb-3 rounded-lg bg-gray-200 flex items-center justify-center">
              <i class="fas fa-image text-gray-400 text-2xl"></i>
            </div>
            <h5 class="font-semibold text-gray-900 text-sm mb-2 truncate">{{ product.name }}</h5>
            <p class="text-base font-bold text-orange-600">{{ product.price }} gold</p>
          </div>
        </div>
        <button v-if="availableProducts.length > 0" @click="viewBoutique" class="mt-4 w-full text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors flex items-center justify-center">
          Voir la boutique
          <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>

      <!-- Section Informations Location -->
      <div class="bg-white border-2 border-orange-200 rounded-xl shadow-md p-6 mb-6 mx-auto">
        <h3 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
          Informations Location
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="font-semibold text-gray-700">Location:</span>
            <span class="text-gray-900 font-medium">{{ location.static_code }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="font-semibold text-gray-700">Status:</span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
              <i class="fas fa-check-circle mr-1.5"></i>
              Purchased
            </span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="font-semibold text-gray-700">Price:</span>
            <span class="text-orange-600 font-bold text-lg">{{ location.price }} gold</span>
          </div>
        </div>
      </div>

      <!-- Section Actions -->
      <div class="bg-white border-2 border-orange-200 rounded-xl shadow-md p-6 mb-6 mx-auto">
        <h3 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
          Actions
        </h3>
        <div class="flex flex-col gap-3">
          <button @click="viewFullProfile" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center">
            <i class="fas fa-user-circle mr-2"></i>
            Voir le profil complet
          </button>
          <button v-if="availableProducts.length > 0" @click="viewBoutique" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center">
            <i class="fas fa-store mr-2"></i>
            Voir la boutique
          </button>
        </div>
      </div>

      <div class="flex gap-3 justify-center pt-4 border-t border-gray-200">
        <button class="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md" @click="$emit('close')">
          <i class="fas fa-times mr-2"></i>
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Script du composant PrestatairePurchasedWidget
 * Gère l'affichage des locations prestataires achetées avec informations enrichies
 */

import { defineProps, defineEmits, computed } from 'vue';
import { LocationMock } from '@/mocks/locations';
import { USERS } from '@/mocks/users';
import { PRESTATAIRE_TYPES } from '@/mocks/prestataireTypes';
import { SERVICES, ServiceMock } from '@/mocks/services';
import { PRODUCTS, ProductMock } from '@/mocks/products';
import { SERVICE_TYPES } from '@/mocks/serviceType';

interface Props {
  location: LocationMock;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

// Données du prestataire
const prestataire = computed(() => {
  return USERS.find(user => user.id === props.location.id_prestataire);
});

const prestataireTypeName = computed(() => {
  if (!prestataire.value?.id_prestataire_type) return '';
  const type = PRESTATAIRE_TYPES.find(t => t.id === prestataire.value?.id_prestataire_type);
  return type?.name || '';
});

// Données du formulaire - Pour l'instant, ces champs ne sont pas stockés dans la base de données
// TODO: Ajouter ces champs au modèle User ou créer un modèle PrestataireProfile
// Pour l'instant, on retourne des valeurs vides pour ne pas afficher de fausses données
const prestataireFormData = computed(() => {
  // Ces données ne sont pas encore persistées dans la base de données
  // Elles seront disponibles une fois que le formulaire pourra les sauvegarder
  return {
    website: '', // À récupérer depuis la base de données une fois implémenté
    experienceYears: undefined, // À récupérer depuis la base de données une fois implémenté
    specialties: '', // À récupérer depuis la base de données une fois implémenté
    languages: [], // À récupérer depuis la base de données une fois implémenté
    socialMedia: {
      facebook: '', // À récupérer depuis la base de données une fois implémenté
      instagram: '', // À récupérer depuis la base de données une fois implémenté
      twitter: '', // À récupérer depuis la base de données une fois implémenté
      linkedin: '', // À récupérer depuis la base de données une fois implémenté
      tiktok: ''
    }
  };
});

// Bio tronquée
const truncatedBio = computed(() => {
  if (!prestataire.value?.bio) return '';
  const bio = prestataire.value.bio;
  return bio.length > 100 ? bio.substring(0, 100) + '...' : bio;
});

// Vérification des informations de contact
const hasContactInfo = computed(() => {
  return prestataireFormData.value.website || hasSocialMedia.value;
});

const hasSocialMedia = computed(() => {
  const sm = prestataireFormData.value.socialMedia;
  return !!(sm.facebook || sm.instagram || sm.twitter || sm.linkedin);
});

// Services disponibles pour cette location et ce prestataire
const availableServices = computed(() => {
  if (!prestataire.value) return [];
  return SERVICES.filter(service => 
    service.id_location === props.location.id && 
    service.id_prestataire === prestataire.value!.id
  );
});

const displayedServices = computed(() => {
  return availableServices.value.slice(0, 3);
});

// Produits en vente par ce prestataire
const availableProducts = computed(() => {
  if (!prestataire.value) return [];
  return PRODUCTS.filter(product => product.id_prestataire === prestataire.value!.id);
});

const displayedProducts = computed(() => {
  return availableProducts.value.slice(0, 2);
});

// Fonctions utilitaires
const getLanguageFlag = (lang: string): string => {
  const flags: Record<string, string> = {
    'fr': 'https://flagcdn.com/w20/fr.png',
    'en': 'https://flagcdn.com/w20/gb.png',
    'es': 'https://flagcdn.com/w20/es.png',
    'de': 'https://flagcdn.com/w20/de.png',
    'it': 'https://flagcdn.com/w20/it.png',
    'pt': 'https://flagcdn.com/w20/pt.png'
  };
  return flags[lang] || 'https://flagcdn.com/w20/xx.png';
};

const getLanguageName = (lang: string): string => {
  const names: Record<string, string> = {
    'fr': 'Français',
    'en': 'Anglais',
    'es': 'Espagnol',
    'de': 'Allemand',
    'it': 'Italien',
    'pt': 'Portugais'
  };
  return names[lang] || lang;
};

const getServiceTypeName = (serviceTypeId: number): string => {
  const serviceType = SERVICE_TYPES.find(st => st.id === serviceTypeId);
  return serviceType?.name || 'Service';
};

// Actions
const viewFullProfile = () => {
  // TODO: Créer la page de profil public du prestataire
  console.log('Affichage du profil complet de:', prestataire.value?.firstname, prestataire.value?.id);
};

const viewBoutique = () => {
  // TODO: Créer la page de boutique
  console.log('Affichage de la boutique pour location:', props.location.id);
};

const viewAllServices = () => {
  // TODO: Créer la page de profil public ou page des services
  console.log('Affichage de tous les services pour location:', props.location.id);
};
</script>
