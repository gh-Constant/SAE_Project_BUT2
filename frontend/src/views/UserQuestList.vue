<template>
  <div class="min-h-screen bg-parchment pt-24 px-4 sm:px-6 lg:px-8 pb-12">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8 border-b-2 border-antique-bronze pb-4">
        <h1 class="text-3xl font-medieval font-bold text-iron-black flex items-center gap-3">
          <i class="fas fa-scroll text-antique-bronze"></i>
          Mes Quêtes
        </h1>
        <p class="mt-2 text-stone-grey font-body">
          Suivez votre progression et accomplissez des quêtes pour gagner de l'expérience.
        </p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="text-antique-bronze animate-pulse text-xl font-medieval">Chargement...</div>
      </div>

      <div v-else-if="quests.length === 0" class="text-center py-12 bg-white/40 rounded-lg border border-antique-bronze/20">
        <p class="text-lg text-stone-grey font-body mb-4">Vous n'avez accepté aucune quête pour le moment.</p>
        <router-link to="/map" class="inline-block bg-antique-bronze text-white px-6 py-2 rounded font-medieval hover:bg-antique-bronze/90 transition-colors">
          Explorer la carte
        </router-link>
      </div>

      <div v-else class="grid gap-6">
        <div 
          v-for="userQuest in quests" 
          :key="userQuest.id_quest" 
          class="bg-white shadow-xl rounded-lg overflow-hidden border-2 border-antique-bronze/30 hover:border-antique-bronze transition-colors md:flex"
        >
           <!-- Status Indicator -->
          <div 
            class="md:w-2 bg-gradient-to-b md:h-auto h-2 w-full"
            :class="{
              'from-yellow-500 to-amber-600': userQuest.status === 'accepted',
              'from-green-500 to-emerald-600': userQuest.status === 'completed',
              'from-red-500 to-red-700': userQuest.status === 'failed'
            }"
          ></div>

          <div class="p-6 flex-1">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h2 class="text-xl font-medieval font-bold text-iron-black">{{ userQuest.quest.title }}</h2>
                <div class="text-sm font-bold text-antique-bronze mt-1 flex items-center gap-2">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ userQuest.quest.location?.name || 'Lieu inconnu' }}
                </div>
              </div>
              <div 
                class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                :class="{
                  'bg-yellow-100 text-yellow-800 border-yellow-300': userQuest.status === 'accepted',
                  'bg-green-100 text-green-800 border-green-300': userQuest.status === 'completed',
                  'bg-red-100 text-red-800 border-red-300': userQuest.status === 'failed'
                }"
              >
                {{ statusLabels[userQuest.status] }}
              </div>
            </div>

            <p class="text-stone-grey font-body mb-4 leading-relaxed">
              {{ userQuest.quest.description }}
            </p>

            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <span class="font-medieval text-antique-bronze font-bold flex items-center gap-2">
                <i class="fas fa-star"></i>
                Récompense: {{ userQuest.quest.xp_reward }} XP
              </span>

              <!-- DEBUG BUTTON -->
              <button 
                v-if="isDebug && userQuest.status === 'accepted'"
                @click="completeQuest(userQuest.id_quest)"
                class="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-1"
                title="Debug: Terminer la quête instantanément"
              >
                <i class="fas fa-magic"></i>
                [DEBUG] Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { questService } from '@/services/questService';

const quests = ref<any[]>([]);
const loading = ref(true);
const isDebug = import.meta.env.DEV; // Check if we are in development mode

const statusLabels: Record<string, string> = {
  accepted: 'En cours',
  completed: 'Terminé',
  failed: 'Échoué'
};

const loadQuests = async () => {
  try {
    loading.value = true;
    quests.value = await questService.getUserQuests();
  } catch (error) {
    console.error('Failed to load user quests:', error);
  } finally {
    loading.value = false;
  }
};

const completeQuest = async (questId: number) => {
  if (!confirm('DEBUG: Voulez-vous marquer cette quête comme terminée ?')) return;
  
  try {
    await questService.completeQuest(questId);
    await loadQuests();
    // Optional: Add success toast/notification
  } catch (error) {
    console.error('Failed to complete quest:', error);
    alert('Erreur lors de la completion de la quête.');
  }
};

onMounted(() => {
  loadQuests();
});
</script>
