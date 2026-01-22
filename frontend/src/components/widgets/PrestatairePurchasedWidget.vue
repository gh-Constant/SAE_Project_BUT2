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
            <h3 class="text-xl font-medieval font-bold text-iron-black">
              {{ prestataire.firstname }} {{
                prestataire.lastname }}
            </h3>
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
        <div class="flex justify-between mb-4">
          <span class="font-bold text-iron-black">{{ t('widgets.purchased.value') }}</span>
          <span class="text-antique-bronze font-medieval font-bold">{{ location.price }} {{
            t('widgets.available.currency') }}</span>
        </div>

        <!-- QR Code pour les quêtes -->
        <div v-if="location.static_code" class="border-t border-antique-bronze/20 pt-4 mt-4">
          <p class="text-sm font-bold text-iron-black mb-3 text-center">
            <i class="fas fa-qrcode mr-2 text-antique-bronze"></i>
            {{ t('widgets.purchased.qr_code_title') }}
          </p>
          <div class="flex flex-col items-center gap-3">
            <div class="bg-white p-3 rounded-lg shadow-inner border border-antique-bronze/30">
              <canvas ref="qrCanvasRef" class="qr-canvas"></canvas>
            </div>
            <p class="text-xs text-stone-grey text-center max-w-xs">
              {{ t('widgets.purchased.qr_code_hint') }}
            </p>
            <p
              class="text-xs font-mono text-antique-bronze bg-antique-bronze/10 px-3 py-1 rounded border border-antique-bronze/20">
              {{ location.static_code }}
            </p>
          </div>
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

      <!-- Quiz Section -->
      <div v-if="quizzes.length > 0" class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <h3 class="text-xl font-bold text-iron-black mb-4 flex items-center font-medieval">
          <span class="ml-2">Quiz</span>
        </h3>
        <div class="grid gap-3">
          <div v-for="quiz in quizzes" :key="quiz.id_quiz"
            class="bg-white/60 p-4 rounded-lg border border-antique-bronze/10 hover:border-antique-bronze/30 transition-colors flex justify-between items-center group shadow-sm">
            <div>
              <h4 class="font-bold text-iron-black group-hover:text-antique-bronze transition-colors">{{ quiz.title }}
              </h4>
              <p class="text-sm text-stone-grey line-clamp-1">{{ quiz.description }}</p>
            </div>
            <button @click="playQuiz(quiz.id_quiz)"
              class="ml-4 bg-stone-grey hover:bg-iron-black text-white px-4 py-2 rounded font-medieval font-bold shadow-sm transition-colors border border-stone-grey/50 whitespace-nowrap text-sm">
              Jouer
            </button>
          </div>
        </div>
      </div>

      <!-- Contact Section (Visible to non-owners) -->
      <div v-if="!isOwner" class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6">
        <ContactSection :location-id="location.id" />
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

  <!-- Modal Profile Prestataire -->
  <Teleport to="body">
    <div v-if="showProfileModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click="showProfileModal = false">
      <div class="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden" @click.stop>
        <div class="bg-antique-bronze text-white p-6 flex justify-between items-center">
          <h2 class="text-2xl font-medieval font-bold">{{ prestataire?.firstname }} {{ prestataire?.lastname }}</h2>
          <button @click="showProfileModal = false" class="text-white hover:text-gray-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div v-if="prestataire" class="space-y-6">
            <!-- Avatar et infos de base -->
            <div class="flex items-center gap-4 pb-4 border-b border-antique-bronze/20">
              <img :src="prestataire.avatar_url" :alt="prestataire.firstname"
                class="w-24 h-24 rounded-full border-4 border-antique-bronze object-cover" />
              <div>
                <h3 class="text-xl font-medieval font-bold text-iron-black">{{ prestataire.firstname }} {{
                  prestataire.lastname }}</h3>
                <p class="text-sm font-body text-stone-grey italic">{{ prestataireTypeName }}</p>
                <p class="text-sm text-stone-grey mt-1">{{ prestataire.email }}</p>
              </div>
            </div>

            <!-- Bio -->
            <div v-if="prestataire.bio" class="border-b border-antique-bronze/20 pb-4">
              <h4 class="text-lg font-medieval font-bold text-iron-black mb-2">{{
                t('prestataire.profile.sections.presentation') }}</h4>
              <div class="prose prose-sm max-w-none" v-html="prestataire.bio"></div>
            </div>

            <!-- Informations de contact -->
            <div class="border-b border-antique-bronze/20 pb-4">
              <h4 class="text-lg font-medieval font-bold text-iron-black mb-3">{{
                t('prestataire.profile.sections.identity') }}</h4>
              <div class="space-y-2 text-stone-grey">
                <p v-if="prestataire.phone" class="flex items-center gap-2">
                  <i class="fas fa-phone text-antique-bronze"></i>
                  {{ prestataire.phone }}
                </p>
                <p v-if="prestataire.birth_date" class="flex items-center gap-2">
                  <i class="fas fa-birthday-cake text-antique-bronze"></i>
                  {{ new Date(prestataire.birth_date).toLocaleDateString() }}
                </p>
              </div>
            </div>

            <!-- Statut -->
            <div class="flex gap-4">
              <div class="flex-1 bg-antique-bronze/10 border border-antique-bronze/20 rounded-lg p-4">
                <dt class="text-sm font-medium text-stone-grey mb-1">{{ t('prestataire.profile.status.xp') }}</dt>
                <dd class="text-2xl font-bold text-antique-bronze">{{ prestataire.xp || 0 }}</dd>
              </div>
              <div class="flex-1 bg-antique-bronze/10 border border-antique-bronze/20 rounded-lg p-4">
                <dt class="text-sm font-medium text-stone-grey mb-1">{{ t('prestataire.profile.status.level') }}</dt>
                <dd class="text-2xl font-bold text-antique-bronze">{{ prestataire.level || 1 }}</dd>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 flex justify-end gap-3 border-t border-antique-bronze/20">
          <button v-if="authStore.user && prestataire && authStore.user.id === prestataire.id" @click="goToMyProfile"
            class="px-6 py-2 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold rounded shadow-md transition-all">
            {{ t('prestataire.profile.title') }}
          </button>
          <button @click="showProfileModal = false"
            class="px-6 py-2 bg-stone-grey hover:bg-iron-black text-white font-medieval font-bold rounded shadow-md transition-colors">
            {{ t('widgets.purchased.close') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Script du composant PrestatairePurchasedWidget
 * Gère l'affichage des locations prestataires achetées et la gestion des blogs
 */

import { computed, ref, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { LocationMock } from '@/mocks/locations';
import { USERS } from '@/mocks/users';
import { useAuthStore } from '@/stores/auth';
import BlogSection from './BlogSection.vue';
import ContactSection from './ContactSection.vue';
import ShopSection from './ShopSection.vue';
import EventSection from './EventSection.vue';
import QuestSection from './QuestSection.vue';
import { useI18n } from 'vue-i18n';
import { locationService } from '@/services/locationService';
import { isAdmin as checkIsAdmin } from '@/services/roleService';
import QRCode from 'qrcode';
import { quizService } from '@/services/quizService';
import type { Quiz } from '@/types/quiz';

const { t } = useI18n();
const router = useRouter(); // Initialize router

interface Props {
  location: LocationMock;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const authStore = useAuthStore();
const qrCanvasRef = ref<HTMLCanvasElement | null>(null);
const quizzes = ref<Quiz[]>([]);

const prestataire = computed(() => {
  // Use prestataire data from location if available (from backend)
  // Otherwise fallback to mock data for development
  if (props.location.prestataire) {
    return props.location.prestataire;
  }

  // Chercher d'abord dans les utilisateurs modifiés persistants (localStorage)
  const modifiedUsersStr = localStorage.getItem('modifiedUsers');
  if (modifiedUsersStr) {
    try {
      const modifiedUsers = JSON.parse(modifiedUsersStr);
      if (props.location.id_prestataire && modifiedUsers[props.location.id_prestataire]) {
        return modifiedUsers[props.location.id_prestataire];
      }
    } catch (error) {
      console.warn('Error parsing modified users:', error);
    }
  }

  // Sinon chercher dans la session actuelle
  const storedUserStr = localStorage.getItem('currentUser');
  if (storedUserStr) {
    try {
      const storedUser = JSON.parse(storedUserStr);
      if (storedUser.id === props.location.id_prestataire) {
        return storedUser;
      }
    } catch (error) {
      console.warn('Error parsing stored user:', error);
    }
  }

  // Fallback vers les données mock statiques
  return USERS.find(user => user.id === props.location.id_prestataire);
});

const prestataireTypeName = computed(() => {
  // For now, return a generic label since prestataire type is on user, not in the prestataire subset
  // TODO: Fetch full user details if needed for type
  return 'Prestataire';
});

// Check if current user is the owner
const isOwner = computed(() => {
  if (!authStore.user) return false;

  // Strict check: User must be owner AND location must not be PENDING
  // If PENDING, they are technically the owner but cannot edit yet
  const userIsOwner = props.location.id_prestataire === authStore.user.id;
  const isApproved = props.location.status !== 'PENDING';

  return userIsOwner && isApproved;
});



const showProfileModal = ref(false);

const viewProfile = () => {
  if (prestataire.value) {
    showProfileModal.value = true;
  }
};

const goToMyProfile = () => {
  showProfileModal.value = false;
  router.push('/prestataire');
};

const isAdmin = computed(() => {
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

const generateQRCode = async () => {
  if (props.location.static_code && qrCanvasRef.value) {
    try {
      await QRCode.toCanvas(qrCanvasRef.value, props.location.static_code, {
        width: 150,
        margin: 1,
        color: {
          dark: '#8B4513', // Antique bronze like color
          light: '#FFFFFF'
        }
      });
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }
  }
};

const fetchQuizzes = async () => {
  try {
    const response = await quizService.getQuizzes({ id_location: props.location.id });
    quizzes.value = response.quizzes;
  } catch (e) {
    console.error('Failed to fetch quizzes', e);
  }
};

const playQuiz = (quizId: number) => {
  router.push({ name: 'quiz-play', params: { id: quizId } });
};

watch(() => props.location, () => {
  nextTick(() => {
    generateQRCode();
    fetchQuizzes();
  });
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    generateQRCode();
    fetchQuizzes();
  });
});

</script>
```
