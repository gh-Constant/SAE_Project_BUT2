import { Quest } from '../questService';
import { QUESTS } from '@/mocks/quests';
import { USER_QUESTS } from '@/mocks/userQuests';
import { LOCATIONS } from '@/mocks/locations';
import { calculateLevelFromXP } from '@/utils/levelCalculator';
import { useAuthStore } from '@/stores/auth';
import { mockUsers } from './sharedMockData';
import { calculateUserRank } from './userServiceMock';

const mockQuests = [...QUESTS];

// Initialize user quests from localStorage or fallback to static data
const initializeUserQuests = () => {
  const stored = localStorage.getItem('mock_userQuests');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure each quest has the full quest object
      return parsed.map((uq: any) => ({
        ...uq,
        created_at: new Date(uq.created_at),
        updated_at: new Date(uq.updated_at),
        quest: QUESTS.find(q => q.id_quest === uq.id_quest)
      }));
    } catch (error) {
      console.warn('Failed to parse stored quests, using defaults:', error);
      return [...USER_QUESTS];
    }
  }
  return [...USER_QUESTS];
};

let userQuests = initializeUserQuests();

// Save user quests to localStorage
const saveUserQuests = () => {
  try {
    // Only save essential data to reduce localStorage size
    const toSave = userQuests.map((uq: any) => ({
      id_user: uq.id_user,
      id_quest: uq.id_quest,
      status: uq.status,
      created_at: uq.created_at,
      updated_at: uq.updated_at
    }));
    localStorage.setItem('mock_userQuests', JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save quests to localStorage:', error);
  }
};

// Helper to get current user ID from localStorage
const getCurrentUserId = (): number => {
  const currentUserStr = localStorage.getItem('currentUser');
  if (currentUserStr) {
    try {
      const user = JSON.parse(currentUserStr);
      return user.id;
    } catch {
      return 2; // Default to Alice (aventurier)
    }
  }
  return 2; // Default to Alice (aventurier)
};

export const questMockService = {
  getQuestsByLocation: async (locationId: number): Promise<Quest[]> => {
    return mockQuests.filter(q => q.id_location === locationId);
  },

  getUserQuests: async () => {
    const userId = getCurrentUserId();
    return userQuests.filter((uq: any) => uq.id_user === userId);
  },

  createQuest: async (quest: Omit<Quest, 'id_quest'>): Promise<Quest> => {
    const location = LOCATIONS.find(l => l.id === quest.id_location);
    const newQuest = { ...quest, id_quest: mockQuests.length + 1, location, created_at: new Date().toISOString() };
    mockQuests.push(newQuest);
    return newQuest;
  },

  acceptQuest: async (questId: number): Promise<void> => {
    const userId = getCurrentUserId();
    const quest = mockQuests.find(q => q.id_quest === questId);
    if (quest && !userQuests.find((uq: any) => uq.id_quest === questId && uq.id_user === userId)) {
      userQuests.push({
        id_user: userId,
        id_quest: quest.id_quest,
        status: 'accepted',
        created_at: new Date(),
        updated_at: new Date(),
        quest: quest
      });
      saveUserQuests(); // Persist to localStorage
    }
  },

  completeQuest: async (questId: number): Promise<void> => {
    const authStore = useAuthStore();
    const user = authStore.user;

    if (!user) {
      throw new Error('User not found');
    }

    const userId = user.id;

    // Trouver la quête utilisateur
    const uq = userQuests.find((q: any) => q.id_quest === questId && q.id_user === userId);
    if (!uq) {
      throw new Error('Quest not found or not accepted');
    }

    // Trouver la quête pour obtenir l'XP reward
    const quest = mockQuests.find(q => q.id_quest === questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    // Calculer les récompenses (seulement XP, pas d'or)
    const xpReward = quest.xp_reward || 0;

    // Mettre à jour le statut de la quête
    uq.status = 'completed';
    uq.updated_at = new Date();

    // Mettre à jour l'utilisateur dans le store (seulement XP et niveau)
    const newXP = user.xp + xpReward;
    const newLevel = calculateLevelFromXP(newXP);

    // Mettre à jour mockUsers pour que les autres services (classement, etc.) voient le changement
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      mockUser.xp = newXP;
      mockUser.level = newLevel;
    }

    const newRank = calculateUserRank(userId);

    // Mettre à jour le store auth via l'action dédiée qui gère aussi la persistance
    authStore.updateUserStats({
      xp: newXP,
      level: newLevel,
      rank: newRank
    });

    // Persist quest state
    saveUserQuests();
  },

  cancelQuest: async (questId: number): Promise<void> => {
    const userId = getCurrentUserId();
    const index = userQuests.findIndex((q: any) => q.id_quest === questId && q.id_user === userId);
    if (index !== -1) {
      userQuests.splice(index, 1);
      saveUserQuests(); // Persist to localStorage
    }
  },

  getAllQuests: async (): Promise<Quest[]> => {
    return mockQuests;
  },

  updateQuest: async (questId: number, data: Partial<Quest>): Promise<Quest> => {
    const quest = mockQuests.find(q => q.id_quest === questId);
    if (!quest) throw new Error('Quest not found');
    Object.assign(quest, data);
    return quest;
  },

  deleteQuest: async (questId: number): Promise<void> => {
    const index = mockQuests.findIndex(q => q.id_quest === questId);
    if (index !== -1) {
      mockQuests.splice(index, 1);
    }
  },

  /**
   * Valider une quête en scannant le QR code de la location
   * @param questId - ID de la quête à valider
   * @param scannedCode - Code scanné (static_code de la location)
   * @returns Objet avec success et message/error
   */
  validateQuestByQR: async (questId: number, scannedCode: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const authStore = useAuthStore();
    const user = authStore.user;

    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    const userId = user.id;

    // Trouver la quête utilisateur
    const uq = userQuests.find((q: any) => q.id_quest === questId && q.id_user === userId);
    if (!uq) {
      return { success: false, error: 'Quête non trouvée ou non acceptée' };
    }

    if (uq.status === 'completed') {
      return { success: false, error: 'Cette quête est déjà terminée' };
    }

    // Trouver la quête
    const quest = mockQuests.find(q => q.id_quest === questId);
    if (!quest) {
      return { success: false, error: 'Quête non trouvée' };
    }

    // Trouver la location de la quête
    const location = LOCATIONS.find(l => l.id === quest.id_location);
    if (!location) {
      return { success: false, error: 'Location de la quête non trouvée' };
    }

    // Vérifier que le code scanné correspond au static_code de la location
    if (location.static_code !== scannedCode) {
      return {
        success: false,
        error: `Mauvais emplacement ! Cette quête doit être validée à "${location.name}"`
      };
    }

    // Tout est bon, compléter la quête
    const xpReward = quest.xp_reward || 0;

    uq.status = 'completed';
    uq.updated_at = new Date();

    const newXP = user.xp + xpReward;
    const newLevel = calculateLevelFromXP(newXP);

    // Mettre à jour mockUsers pour que les autres services (classement, etc.) voient le changement
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      mockUser.xp = newXP;
      mockUser.level = newLevel;
    }

    const newRank = calculateUserRank(userId);

    // Mettre à jour le store auth via l'action dédiée qui gère aussi la persistance
    authStore.updateUserStats({
      xp: newXP,
      level: newLevel,
      rank: newRank
    });

    // Persist quest state
    saveUserQuests();

    return {
      success: true,
      message: `Quête validée ! +${xpReward} XP gagné`
    };
  },

  /**
   * Reset user quests to initial data (for testing/demo)
   */
  resetUserQuests: () => {
    userQuests = [...USER_QUESTS];
    saveUserQuests();
    console.log('Quest data reset to initial state');
  }
};
