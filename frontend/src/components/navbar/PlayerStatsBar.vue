<script setup lang="ts">
/**
 * @file PlayerStatsBar.vue
 * @description
 * A medieval-styled component displaying the user's level progress and gold count.
 * Designed to be placed inside the profile dropdown menu.
 */

import { computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { userService } from '@/services/userService';

const auth = useAuthStore();

// XP required for each level (simplified formula: level * 100)
const xpForNextLevel = computed(() => {
  const level = auth.user?.level || 1;
  return level * 100;
});

// Progress percentage towards next level
const xpProgress = computed(() => {
  const currentXp = auth.user?.xp || 0;
  const required = xpForNextLevel.value;
  // XP wraps around each level, so we use modulo
  const xpInCurrentLevel = currentXp % required;
  return Math.min((xpInCurrentLevel / required) * 100, 100);
});

// Current XP display (within current level)
const currentLevelXp = computed(() => {
  const currentXp = auth.user?.xp || 0;
  const required = xpForNextLevel.value;
  return currentXp % required;
});

// Level badge color based on level tier
const levelBadgeClasses = computed(() => {
  const level = auth.user?.level || 1;

  if (level >= 50) {
    // Legendary - Purple/Diamond
    return 'from-purple-400 via-pink-400 to-purple-600 border-purple-300';
  } else if (level >= 30) {
    // Epic - Gold
    return 'from-yellow-300 via-amber-400 to-yellow-500 border-yellow-200';
  } else if (level >= 20) {
    // Rare - Silver/Blue
    return 'from-blue-300 via-cyan-400 to-blue-500 border-blue-200';
  } else if (level >= 10) {
    // Uncommon - Green
    return 'from-emerald-400 via-green-500 to-emerald-600 border-emerald-300';
  } else {
    // Common - Bronze
    return 'from-antique-bronze/90 to-dark-wood border-antique-bronze';
  }
});

// Level tier name
const levelTierName = computed(() => {
  const level = auth.user?.level || 1;

  if (level >= 50) return 'Légendaire';
  if (level >= 30) return 'Épique';
  if (level >= 20) return 'Rare';
  if (level >= 10) return 'Aventurier';
  return 'Novice';
});

const xp = computed(() => auth.user?.xp);

watch(xp, () => {
  fetchUserRank();
});

const fetchUserRank = async () => {
  if (auth.user?.id) {
    try {
      const response = await userService.getUserRank(auth.user.id);
      if (response.ok) {
        const data = await response.json();
        auth.updateUserRank(data.rank);
      }
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
    }
  }
};

onMounted(() => {
  fetchUserRank();
});


// User's gold amount
const gold = computed(() => auth.user?.gold || 0);

// Format large numbers with K suffix
const formatGold = (amount: number): string => {
  if (amount >= 10000) {
    return (amount / 1000).toFixed(0) + 'K';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return amount.toLocaleString('fr-FR');
};

// Emit event when + button is clicked (for future shop integration)
const emit = defineEmits<{
  addGold: [];
}>();

const handleAddGold = () => {
  emit('addGold');
};
</script>

<template>
  <div class="player-stats-container px-4 py-3 border-b border-antique-bronze/20">
    <!-- Level Section -->
    <div class="flex items-center gap-3 mb-3">
      <!-- Level Badge with dynamic color -->
      <div class="level-badge shrink-0">
        <div
          class="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center border-2 shadow-lg relative overflow-hidden"
          :class="levelBadgeClasses">
          <!-- Inner ring decoration -->
          <div class="absolute inset-1 rounded-full border border-white/20"></div>
          <span class="text-lg font-medieval font-bold text-white drop-shadow-md z-10">
            {{ auth.user?.level || 1 }}
          </span>
        </div>
      </div>

      <!-- Level Info & Progress -->
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between mb-1">
          <div class="flex flex-col">
            <span class="text-xs font-medieval font-bold text-dark-wood tracking-wide leading-none">{{ levelTierName }}</span>
            <span v-if="auth.user?.rank" class="text-[10px] text-stone-grey font-bold uppercase tracking-tighter mt-0.5">
              Rang #{{ auth.user.rank }}
            </span>
          </div>
          <span class="text-[10px] font-body text-stone-grey">{{ currentLevelXp }} / {{ xpForNextLevel }} XP</span>
        </div>
        <!-- XP Progress Bar -->
        <div class="w-full h-2 bg-dark-wood/20 rounded-full overflow-hidden border border-antique-bronze/30">
          <div
            class="h-full bg-gradient-to-r from-antique-bronze to-amber-500 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${xpProgress}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Gold Section - Matching level structure -->
    <div class="flex items-center gap-3">
      <!-- Gold Coin Badge (same size as level) -->
      <div class="shrink-0">
        <div
          class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center border-2 border-yellow-300 shadow-md relative overflow-hidden">
          <div class="absolute inset-1 rounded-full border border-yellow-200/30"></div>
          <i class="fas fa-coins text-yellow-800 z-10"></i>
        </div>
      </div>

      <!-- Gold Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between mb-1">
          <span class="text-xs font-medieval font-bold text-dark-wood tracking-wide">Trésor</span>
        </div>
        <span class="text-lg font-medieval font-bold text-dark-wood">{{ formatGold(gold) }}</span>
      </div>

      <!-- Add Button (same size as level badge) -->
      <div class="shrink-0">
        <button @click.stop="handleAddGold"
          class="w-12 h-12 rounded-full bg-gradient-to-br from-antique-bronze to-dark-wood flex items-center justify-center border-2 border-antique-bronze shadow-md hover:from-antique-bronze/80 hover:to-antique-bronze transition-all duration-200 relative overflow-hidden"
          title="Acheter de l'or">
          <div class="absolute inset-1 rounded-full border border-white/10"></div>
          <i class="fas fa-plus text-parchment z-10"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-stats-container {
  background: linear-gradient(to bottom, rgba(243, 234, 214, 0.5) 0%, transparent 100%);
}
</style>
