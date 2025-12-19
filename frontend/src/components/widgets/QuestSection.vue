<template>
  <div class="quest-section">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-medieval font-bold text-iron-black flex items-center gap-2">
        <i class="fas fa-scroll text-antique-bronze"></i>
        {{ t('widgets.quests.title') }}
      </h3>
      <div class="flex gap-2">
        <button 
          v-if="isOwner"
          @click="addQuest"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> {{ t('widgets.quests.add_button') }}
        </button>
        <button 
          v-if="isOwner"
          @click="manageQuests" 
          class="px-4 py-2 bg-antique-bronze hover:brightness-110 text-white font-semibold rounded-lg transition-colors text-sm flex items-center"
        >
          <i class="fas fa-cog mr-2"></i> {{ t('widgets.quests.manage_button') }}
        </button>
      </div>
    </div>

    <!-- Quest List -->
    <div v-if="loading" class="text-center py-4 text-stone-grey font-body">
      {{ t('widgets.quests.loading') }}
    </div>
    <div v-else-if="quests.length === 0" class="text-center py-4 text-stone-grey font-body italic">
      {{ t('widgets.quests.empty') }}
    </div>
    <div v-else class="grid grid-cols-1 gap-4">
      <div 
        v-for="quest in displayedQuests" 
        :key="quest.id_quest" 
        class="relative group"
      >
        <!-- Card Background - Different style for completed (grayed) vs others -->
        <div 
          :class="[
            'absolute inset-0 rounded-sm shadow-md transition-all duration-300',
            isQuestCompleted(quest.id_quest) 
              ? 'bg-stone-100 border border-stone-300 opacity-60' 
              : isQuestTaken(quest.id_quest)
                ? 'bg-parchment border border-antique-bronze/30'
                : 'bg-parchment border border-antique-bronze/30 group-hover:-translate-y-1 group-hover:shadow-lg'
          ]"
        ></div>
        
        <!-- Decorative Corners - Gray for completed, bronze for others -->
        <div :class="[
          'absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 z-10 transition-all duration-300',
          isQuestCompleted(quest.id_quest) ? 'border-stone-400' : 'border-antique-bronze',
          !isQuestTaken(quest.id_quest) && 'group-hover:-translate-y-1'
        ]"></div>
        <div :class="[
          'absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 z-10 transition-all duration-300',
          isQuestCompleted(quest.id_quest) ? 'border-stone-400' : 'border-antique-bronze',
          !isQuestTaken(quest.id_quest) && 'group-hover:-translate-y-1'
        ]"></div>
        <div :class="[
          'absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 z-10 transition-all duration-300',
          isQuestCompleted(quest.id_quest) ? 'border-stone-400' : 'border-antique-bronze',
          !isQuestTaken(quest.id_quest) && 'group-hover:-translate-y-1'
        ]"></div>
        <div :class="[
          'absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 z-10 transition-all duration-300',
          isQuestCompleted(quest.id_quest) ? 'border-stone-400' : 'border-antique-bronze',
          !isQuestTaken(quest.id_quest) && 'group-hover:-translate-y-1'
        ]"></div>

        <!-- Content Container -->
        <div :class="[
          'relative p-4 z-10 transition-all duration-300',
          !isQuestTaken(quest.id_quest) && 'group-hover:-translate-y-1'
        ]">
          <div class="flex justify-between items-start gap-3">
            <div class="flex-1 min-w-0">
              <h4 :class="[
                'font-medieval font-bold text-lg transition-colors duration-300',
                isQuestCompleted(quest.id_quest) ? 'text-stone-500' : 'text-iron-black group-hover:text-antique-bronze'
              ]">{{ quest.title }}</h4>
              <p :class="[
                'text-sm font-body mt-1 line-clamp-2',
                isQuestCompleted(quest.id_quest) ? 'text-stone-400' : 'text-stone-grey'
              ]">{{ quest.description }}</p>
              <div :class="[
                'mt-3 text-xs font-bold flex items-center gap-1',
                isQuestCompleted(quest.id_quest) ? 'text-stone-400' : 'text-antique-bronze'
              ]">
                <i class="fas fa-star"></i>
                {{ quest.xp_reward }} XP
              </div>
            </div>
            
            <!-- Action Button / Status -->
            <div class="flex-shrink-0">
              <button 
                v-if="!isOwner && !isQuestTaken(quest.id_quest) && !isPrestataire"
                @click="acceptQuest(quest.id_quest)"
                class="bg-antique-bronze hover:brightness-110 text-white px-3 py-1.5 rounded-sm text-sm font-medieval transition-all duration-200 flex items-center gap-1.5"
              >
                <i class="fas fa-scroll text-xs"></i>
                {{ t('widgets.quests.accept') }}
              </button>
              <span 
                v-else-if="isQuestCompleted(quest.id_quest)" 
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-200 text-stone-500 text-sm font-medieval rounded-sm border border-stone-300"
              >
                <i class="fas fa-check"></i> {{ t('widgets.quests.completed') }}
              </span>
              <span 
                v-else-if="isQuestTaken(quest.id_quest)" 
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-antique-bronze/10 text-antique-bronze text-sm font-medieval rounded-sm border border-antique-bronze/20"
              >
                <i class="fas fa-hourglass-half"></i> {{ t('widgets.quests.accepted') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View More Button -->
    <button 
      v-if="quests.length > 3 && !loading"
      @click="showAll = !showAll"
      class="mt-4 w-full py-2 text-sm font-medieval text-antique-bronze hover:text-antique-bronze/80 transition-colors flex items-center justify-center gap-2"
    >
      <span v-if="!showAll">
        <i class="fas fa-chevron-down"></i>
        {{ t('widgets.quests.view_more', { count: quests.length - 3 }) }}
      </span>
      <span v-else>
        <i class="fas fa-chevron-up"></i>
        {{ t('widgets.quests.view_less') }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { questService, Quest } from '@/services/questService';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const authStore = useAuthStore();

const props = defineProps<{
  locationId: number;
  isOwner: boolean;
}>();

const router = useRouter();
const quests = ref<Quest[]>([]);
const userQuests = ref<any[]>([]);
const loading = ref(true);

// Check if current user is a prestataire (they cannot accept quests)
const isPrestataire = computed(() => authStore.user?.role === 'prestataire');

// Toggle for showing all quests
const showAll = ref(false);

// Helper to get quest priority for sorting (lower = shown first)
const getQuestPriority = (quest: Quest): number => {
  if (isQuestCompleted(quest.id_quest)) return 2; // Completed at end
  if (isQuestTaken(quest.id_quest)) return 1; // In progress in middle
  return 0; // Available at top
};

// Display quests with proper sorting: available > in progress > completed
const displayedQuests = computed(() => {
  const sorted = [...quests.value].sort((a, b) => {
    return getQuestPriority(a) - getQuestPriority(b);
  });
  return showAll.value ? sorted : sorted.slice(0, 3);
});

const loadQuests = async () => {
  try {
    loading.value = true;
    
    // Load location quests (always)
    const locationQuests = await questService.getQuestsByLocation(props.locationId);
    quests.value = locationQuests;
    
    // Try to load user's quests (may fail if not authenticated)
    try {
      const myQuests = await questService.getUserQuests();
      userQuests.value = myQuests;
    } catch {
      // User not authenticated - that's OK, they just can't see their accepted quests
      userQuests.value = [];
    }
  } catch (error) {
    console.error('Failed to load quests:', error);
  } finally {
    loading.value = false;
  }
};

const addQuest = () => {
  router.push({ 
    name: 'prestataire-quests', 
    query: { 
      action: 'add', 
      locationId: props.locationId 
    } 
  });
};

const manageQuests = () => {
  router.push({ name: 'prestataire-quests' });
};

const acceptQuest = async (questId: number) => {
  try {
    await questService.acceptQuest(questId);
    await loadQuests();
  } catch (error) {
    console.error('Failed to accept quest:', error);
  }
};

const isQuestTaken = (questId: number) => {
    return userQuests.value.some((uq: any) => uq.id_quest === questId);
};

const isQuestCompleted = (questId: number) => {
    const userQuest = userQuests.value.find((uq: any) => uq.id_quest === questId);
    return userQuest?.status === 'completed';
};

onMounted(() => {
  loadQuests();
});
</script>
