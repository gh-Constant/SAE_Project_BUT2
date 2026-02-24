<template>
  <div class="success-page flex flex-col items-center justify-center min-h-screen bg-parchment font-body text-stone-grey p-8 selection:bg-antique-bronze selection:text-white">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-antique-bronze border-r-4 border-r-antique-bronze/30 mx-auto mb-6"></div>
      <p class="text-xl font-medieval text-iron-black">Vérification de l'arrivée du convoi d'Or...</p>
    </div>
    
    <div v-else-if="success" class="relative bg-white/70 backdrop-blur-sm p-10 rounded-lg border-2 border-green-600/50 max-w-lg w-full text-center shadow-xl shadow-green-900/10">
      <!-- Décoration d'angle -->
      <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-600/40 rounded-tl-lg pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-600/40 rounded-tr-lg pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-600/40 rounded-bl-lg pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-600/40 rounded-br-lg pointer-events-none"></div>

      <div class="bg-green-100/80 text-green-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border-4 border-green-200 shadow-inner">
        <i class="fas fa-check-circle text-5xl"></i>
      </div>
      
      <h1 class="text-4xl font-medieval font-bold mb-4 text-green-700">Acquisition Réussie !</h1>
      <p class="text-iron-black mb-8 text-lg">Votre or a été ajouté en toute sûreté à votre bourse. Le royaume vous remercie.</p>
      
      <div v-if="user" class="mb-10 p-6 bg-green-50/50 border border-green-200 rounded-lg shadow-sm">
        <p class="text-sm font-bold uppercase tracking-wider text-green-800 mb-2">Nouveau Trésor Total</p>
        <p class="text-4xl font-medieval font-bold text-amber-600 flex items-center justify-center gap-2">
          {{ user.gold }} 
          <i class="fas fa-coins text-2xl"></i>
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/buy-gold" class="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-iron-black border border-stone-300 font-medieval font-bold py-3 px-6 rounded shadow-md transition-all duration-200">
          <i class="fas fa-arrow-left mr-2"></i> Retour aux offres
        </router-link>
        <router-link to="/" class="w-full sm:w-auto bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-3 px-6 rounded shadow-md transition-all duration-200">
          <i class="fas fa-map-marked-alt mr-2"></i> Retour à la carte
        </router-link>
      </div>
    </div>
    
    <div v-else class="relative bg-white/70 backdrop-blur-sm p-10 rounded-lg border-2 border-red-600/50 max-w-lg w-full text-center shadow-xl shadow-red-900/10">
      <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-600/40 rounded-tl-lg pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-600/40 rounded-tr-lg pointer-events-none"></div>

      <div class="bg-red-100/80 text-red-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border-4 border-red-200 shadow-inner">
        <i class="fas fa-times-circle text-5xl"></i>
      </div>

      <h1 class="text-4xl font-medieval font-bold mb-4 text-red-600">Convoi Intercepté</h1>
      <p class="text-red-700 font-medium mb-8">{{ errorMsg }}</p>
      
      <router-link to="/buy-gold" class="inline-block bg-iron-black hover:bg-black text-white font-medieval font-bold py-3 px-8 rounded shadow-md transition-all duration-200">
        <i class="fas fa-undo mr-2"></i> Réessayer
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { goldService } from '@/services/goldService';

const route = useRoute();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref(false);
const errorMsg = ref('');
const user = ref<any>(null);

onMounted(async () => {
  const sessionId = route.query.session_id as string;
  
  if (!sessionId) {
    loading.value = false;
    errorMsg.value = 'ID de session manquant.';
    return;
  }

  try {
    const res = await goldService.fulfillPurchase(sessionId);
    if (res.success && res.user) {
      success.value = true;
      user.value = res.user;
      
      // Update store
      if (authStore.user) {
        authStore.user.gold = res.user.gold;
      }
    } else {
      errorMsg.value = 'Le paiement n\'a pas pu être validé ou vos pièces n\'ont pas pu être ajoutées.';
    }
  } catch (error: any) {
    console.error(error);
    errorMsg.value = error.message || 'Erreur lors de la communication aver le service marchand.';
  } finally {
    loading.value = false;
  }
});
</script>
