<template>
  <div class="min-h-screen bg-parchment py-8 font-body text-stone-grey">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8 text-center">
        <MedievalSectionTitle>{{ t('quest.title') }}</MedievalSectionTitle>
        <p class="text-lg text-stone-grey -mt-4">{{ t('quest.subtitle') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
        <i class="fas fa-hourglass-half text-6xl text-antique-bronze/40 animate-pulse mb-4 block"></i>
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">{{ t('quest.loading') }}</h3>
      </div>

      <!-- Empty State -->
      <div v-else-if="quests.length === 0" class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
        <i class="fas fa-scroll text-6xl text-antique-bronze/30 mb-4 block"></i>
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">{{ t('quest.empty.message') }}</h3>
        <p class="text-stone-grey mb-6">{{ t('quest.empty.description') }}</p>
        <MedievalButton href="/map">
          <i class="fas fa-map-marked-alt mr-2"></i>
          {{ t('quest.empty.explore') }}
        </MedievalButton>
      </div>

      <!-- Quests Content -->
      <div v-else class="space-y-12">
        
        <!-- ============================================ -->
        <!-- SECTION: IN PROGRESS QUESTS -->
        <!-- ============================================ -->
        <section v-if="inProgressQuests.length > 0">
          <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center gap-3">
            <i class="fas fa-hourglass-half text-antique-bronze"></i>
            {{ t('quest.sections.in_progress') }}
            <span class="text-sm font-body text-stone-grey font-normal">({{ inProgressQuests.length }})</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="userQuest in inProgressQuests" 
              :key="userQuest.id_quest" 
              class="relative group h-full"
            >
              <!-- Card Background -->
              <div class="absolute inset-0 bg-parchment rounded-sm shadow-md transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-antique-bronze/30"></div>
              
              <!-- Decorative Corners -->
              <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
              <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
              <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
              <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>

              <!-- Content Container -->
              <div class="relative p-6 flex flex-col h-full z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
                <!-- Header: Location & XP -->
                <div class="flex items-center justify-center gap-3 mb-4 text-sm">
                  <span class="h-px flex-1 bg-antique-bronze/30"></span>
                  <span class="font-bold text-antique-bronze flex items-center gap-1">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ userQuest.quest.location?.name || t('quest.item.unknown_location') }}
                  </span>
                  <span class="h-px flex-1 bg-antique-bronze/30"></span>
                </div>

                <!-- Quest Title -->
                <h3 class="text-2xl font-medieval font-bold text-iron-black mb-4 text-center group-hover:text-antique-bronze transition-colors duration-300">
                  {{ userQuest.quest.title }}
                </h3>

                <!-- Description -->
                <p class="text-stone-grey leading-relaxed font-body mb-5 line-clamp-3 flex-grow text-center">
                  {{ userQuest.quest.description }}
                </p>

                <!-- XP Reward -->
                <div class="flex justify-center mb-4">
                  <span class="px-4 py-1.5 bg-antique-bronze/10 rounded-sm text-antique-bronze font-medieval font-bold text-sm border border-antique-bronze/20">
                    <i class="fas fa-star mr-1"></i>
                    {{ userQuest.quest.xp_reward }} XP
                  </span>
                </div>

                <!-- Actions -->
                <div class="flex flex-wrap justify-center gap-2 pt-4 border-t border-antique-bronze/20 mt-auto">
                  <!-- Scan Button - Green -->
                  <MedievalButton 
                    variant="success"
                    small
                    @click="scanQuest(userQuest.id_quest)"
                  >
                    <i class="fas fa-qrcode mr-1"></i>
                    {{ t('quest.actions.scan') }}
                  </MedievalButton>

                  <!-- Cancel Button -->
                  <MedievalButton 
                    variant="secondary"
                    small
                    @click="cancelQuest(userQuest.id_quest)"
                  >
                    <i class="fas fa-times mr-1"></i>
                    {{ t('quest.actions.cancel') }}
                  </MedievalButton>

                  <!-- Debug Complete Button -->
                  <button 
                    v-if="isDebug"
                    @click="completeQuest(userQuest.id_quest)"
                    class="text-stone-400 hover:text-stone-600 px-2 py-1 text-xs transition-colors flex items-center gap-1 opacity-50 hover:opacity-100"
                    title="Debug: Terminer la quête instantanément"
                  >
                    <i class="fas fa-bug"></i>
                    {{ t('quest.debug.finish') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================ -->
        <!-- SECTION: COMPLETED QUESTS -->
        <!-- ============================================ -->
        <section v-if="completedQuests.length > 0">
          <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center gap-3">
            <i class="fas fa-check-circle text-emerald-700"></i>
            {{ t('quest.sections.completed') }}
            <span class="text-sm font-body text-stone-grey font-normal">({{ completedQuests.length }})</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="userQuest in completedQuests" 
              :key="userQuest.id_quest" 
              class="relative group h-full cursor-default"
            >
              <!-- Card Background - Parchment with warm border -->
              <div class="absolute inset-0 bg-parchment rounded-sm shadow-md border border-emerald-800/30"></div>
              
              <!-- Decorative Corners - Warm green accent -->
              <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-700 z-10"></div>
              <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-700 z-10"></div>
              <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-700 z-10"></div>
              <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-700 z-10"></div>

              <!-- Checkmark Overlay - Semi-transparent, disappears on hover -->
              <div class="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/15 rounded-sm transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                <div class="text-center">
                  <i class="fas fa-check-circle text-7xl text-emerald-700 drop-shadow-lg"></i>
                </div>
              </div>

              <!-- Content Container -->
              <div class="relative p-6 flex flex-col h-full z-10">
                <!-- Header: Location -->
                <div class="flex items-center justify-center gap-3 mb-4 text-sm">
                  <span class="h-px flex-1 bg-emerald-700/30"></span>
                  <span class="font-bold text-emerald-700 flex items-center gap-1">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ userQuest.quest.location?.name || t('quest.item.unknown_location') }}
                  </span>
                  <span class="h-px flex-1 bg-emerald-700/30"></span>
                </div>

                <!-- Quest Title -->
                <h3 class="text-2xl font-medieval font-bold text-iron-black mb-4 text-center">
                  {{ userQuest.quest.title }}
                </h3>

                <!-- Description -->
                <p class="text-stone-grey leading-relaxed font-body mb-5 line-clamp-3 flex-grow text-center">
                  {{ userQuest.quest.description }}
                </p>

                <!-- XP Reward -->
                <div class="flex justify-center mb-4">
                  <span class="px-4 py-1.5 bg-emerald-700/10 rounded-sm text-emerald-700 font-medieval font-bold text-sm border border-emerald-700/20">
                    <i class="fas fa-star mr-1"></i>
                    +{{ userQuest.quest.xp_reward }} XP
                  </span>
                </div>

                <!-- Completed info -->
                <div class="flex justify-center items-center gap-2 pt-4 border-t border-emerald-800/30 mt-auto text-emerald-700 font-medieval">
                  <i class="fas fa-trophy"></i>
                  {{ t('quest.completed_message') }}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { questService } from '@/services/questService';
import { useI18n } from 'vue-i18n';
import MedievalButton from '@/components/ui/MedievalButton.vue';
import MedievalSectionTitle from '@/components/ui/MedievalSectionTitle.vue';

const { t } = useI18n();
const quests = ref<any[]>([]);
const loading = ref(true);
const isDebug = import.meta.env.DEV;

// Separate quests by status
const inProgressQuests = computed(() => quests.value.filter(q => q.status === 'accepted'));
const completedQuests = computed(() => quests.value.filter(q => q.status === 'completed'));

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
  if (!confirm(t('quest.debug.confirm_finish'))) return;
  
  try {
    await questService.completeQuest(questId);
    await loadQuests();
  } catch (error) {
    console.error('Failed to complete quest:', error);
    alert(t('quest.debug.error_finish'));
  }
};

const scanQuest = (questId: number) => {
  // TODO: Implement QR scan functionality
  console.log('Scan quest:', questId);
};

const cancelQuest = async (questId: number) => {
  if (!confirm(t('quest.actions.confirm_cancel'))) return;
  
  try {
    await questService.cancelQuest(questId);
    await loadQuests();
  } catch (error) {
    console.error('Failed to cancel quest:', error);
    alert(t('quest.actions.error_cancel'));
  }
};

onMounted(() => {
  loadQuests();
});
</script>
