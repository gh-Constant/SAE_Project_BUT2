<template>
  <div class="cancel-page flex flex-col items-center justify-center min-h-screen bg-parchment font-body text-stone-grey p-8 selection:bg-antique-bronze selection:text-white">
    <div class="relative bg-white/70 backdrop-blur-sm p-10 rounded-lg border-2 border-amber-600/50 max-w-lg w-full text-center shadow-xl shadow-amber-900/10">
      
      <!-- Décoration d'angle -->
      <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-600/40 rounded-tl-lg pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-600/40 rounded-tr-lg pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-600/40 rounded-bl-lg pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-600/40 rounded-br-lg pointer-events-none"></div>

      <div class="bg-amber-100/80 text-amber-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border-4 border-amber-200 shadow-inner">
        <i class="fas fa-exclamation-triangle text-4xl"></i>
      </div>
      
      <h1 class="text-4xl font-medieval font-bold mb-4 text-amber-600">Échange Annulé</h1>
      <p class="text-iron-black mb-8 text-lg">Vous avez rebroussé chemin. Aucun pactole n'a été prélevé, et votre bourse reste inchangée.</p>
      
      <div class="flex flex-col gap-4 justify-center mt-6">
        <router-link to="/buy-gold" class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-3 px-6 rounded shadow-md transition-all duration-200">
          <i class="fas fa-undo mr-2"></i> Réexaminer les offres
        </router-link>
        <router-link to="/" class="w-full bg-stone-100 hover:bg-stone-200 text-iron-black border border-stone-300 font-medieval font-bold py-3 px-6 rounded shadow-md transition-all duration-200">
          <i class="fas fa-map-marked-alt mr-2"></i> Retourner explorer la carte
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple static page for cancellation
</script>
