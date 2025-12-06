<template>
  <div class="quest-section">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-medieval font-bold text-iron-black flex items-center gap-2">
        <i class="fas fa-scroll text-antique-bronze"></i>
        Quêtes Disponibles
      </h3>
      <div class="flex gap-2">
        <button 
          v-if="isOwner"
          @click="addQuest"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> Add Quest
        </button>
        <button 
          v-if="isOwner"
          @click="manageQuests" 
          class="px-4 py-2 bg-antique-bronze hover:brightness-110 text-white font-semibold rounded-lg transition-colors text-sm flex items-center"
        >
          <i class="fas fa-cog mr-2"></i> Manage
        </button>
      </div>
    </div>

    <!-- Quest List -->
    <div v-if="loading" class="text-center py-4 text-stone-grey font-body">
      Chargement des quêtes...
    </div>
    <div v-else-if="quests.length === 0" class="text-center py-4 text-stone-grey font-body italic">
      Aucune quête disponible pour le moment.
    </div>
    <div v-else class="space-y-4">
      <div 
        v-for="quest in displayedQuests" 
        :key="quest.id_quest" 
        class="bg-white/60 p-4 rounded-lg border border-antique-bronze/20 hover:border-antique-bronze/40 transition-colors"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-medieval font-bold text-lg text-iron-black">{{ quest.title }}</h4>
            <p class="text-sm text-stone-grey font-body mt-1">{{ quest.description }}</p>
            <div class="mt-2 text-xs font-bold text-antique-bronze flex items-center gap-1">
              <i class="fas fa-star"></i>
              {{ quest.xp_reward }} XP
            </div>
          </div>
          <button 
            v-if="!isOwner && !isQuestTaken(quest.id_quest)"
            @click="acceptQuest(quest.id_quest)"
            class="bg-green-700/80 text-white px-3 py-1 rounded text-sm font-medieval hover:bg-green-700 transition-colors"
          >
            Accepter
          </button>
          <span v-else-if="isQuestTaken(quest.id_quest)" class="text-green-700 text-sm font-medieval">
            <i class="fas fa-check"></i> Acceptée
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { questService, Quest } from '@/services/questService';

const props = defineProps<{
  locationId: number;
  isOwner: boolean;
}>();

const router = useRouter();
const quests = ref<Quest[]>([]);
const userQuests = ref<any[]>([]);
const loading = ref(true);

// Display only the first 3 quests
const displayedQuests = computed(() => {
  return quests.value.slice(0, 3);
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
    alert('Quête acceptée ! Retrouvez-la dans votre profil.');
  } catch (error) {
    console.error('Failed to accept quest:', error);
    alert("Impossible d'accepter la quête (peut-être déjà acceptée ?)");
  }
};

const isQuestTaken = (questId: number) => {
    return userQuests.value.some((uq: any) => uq.id_quest === questId);
};

onMounted(() => {
  loadQuests();
});
</script>
