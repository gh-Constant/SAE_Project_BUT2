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

const getQuestValidationCode = (questId: number, locationId: number, staticCode?: string | null) => {
  const normalizedStaticCode = staticCode?.trim() || `LOCATION-${locationId}`;
  return `QUEST:${questId}:LOC:${locationId}:CODE:${normalizedStaticCode}:${crypto.randomUUID()}`;
};

const getStoredQuestValidationCode = (quest: any, locationId: number, staticCode?: string | null) => {
  if (quest.validation_code) return quest.validation_code;
  const normalizedStaticCode = staticCode?.trim() || `LOCATION-${locationId}`;
  return `QUEST:NEW:LOC:${locationId}:CODE:${normalizedStaticCode}:${crypto.randomUUID()}`;
};

const parseQuestValidationCode = (value: string) => {
  const parts = value.trim().split(':');
  if (parts.length < 7) return null;
  if (parts[0] !== 'QUEST' || parts[2] !== 'LOC' || parts[4] !== 'CODE') return null;

  const questId = Number(parts[1]);
  const locationId = Number(parts[3]);
  const nonce = parts[parts.length - 1];
  const code = parts.slice(5, parts.length - 1).join(':');

  if (!Number.isInteger(questId) || !Number.isInteger(locationId) || !code || !nonce) {
    return null;
  }

  return { questId, locationId, code, nonce };
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
    const validation_code = getStoredQuestValidationCode(quest, quest.id_location, location?.static_code);
    const newQuest = { ...quest, id_quest: mockQuests.length + 1, validation_code, location, created_at: new Date().toISOString() };
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

    // Trouver la quÃªte utilisateur
    const uq = userQuests.find((q: any) => q.id_quest === questId && q.id_user === userId);
    if (!uq) {
      throw new Error('Quest not found or not accepted');
    }

    // Trouver la quÃªte pour obtenir l'XP reward
    const quest = mockQuests.find(q => q.id_quest === questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    // Calculer les rÃ©compenses (seulement XP, pas d'or)
    const xpReward = quest.xp_reward || 0;

    // Mettre Ã  jour le statut de la quÃªte
    uq.status = 'completed';
    uq.updated_at = new Date();

    // Mettre Ã  jour l'utilisateur dans le store (seulement XP et niveau)
    const newXP = user.xp + xpReward;
    const newLevel = calculateLevelFromXP(newXP);

    // Mettre Ã  jour mockUsers pour que les autres services (classement, etc.) voient le changement
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      mockUser.xp = newXP;
      mockUser.level = newLevel;
    }

    const newRank = calculateUserRank(userId);

    // Mettre Ã  jour le store auth via l'action dÃ©diÃ©e qui gÃ¨re aussi la persistance
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
   * Valider une quÃªte en scannant le QR code de la location
   * @param questId - ID de la quÃªte Ã  valider
   * @param scannedCode - Code scannÃ© (static_code de la location)
   * @returns Objet avec success et message/error
   */
  validateQuestByQR: async (questId: number, scannedCode: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const authStore = useAuthStore();
    const user = authStore.user;

    if (!user) {
      return { success: false, error: 'Utilisateur non connectÃ©' };
    }

    const userId = user.id;

    // Trouver la quÃªte utilisateur
    const uq = userQuests.find((q: any) => q.id_quest === questId && q.id_user === userId);
    if (!uq) {
      return { success: false, error: 'QuÃªte non trouvÃ©e ou non acceptÃ©e' };
    }

    if (uq.status === 'completed') {
      return { success: false, error: 'Cette quÃªte est dÃ©jÃ  terminÃ©e' };
    }

    // Trouver la quÃªte
    const quest = mockQuests.find(q => q.id_quest === questId);
    if (!quest) {
      return { success: false, error: 'QuÃªte non trouvÃ©e' };
    }

    // Trouver la location de la quÃªte
    const location = LOCATIONS.find(l => l.id === quest.id_location);
    if (!location) {
      return { success: false, error: 'Location de la quÃªte non trouvÃ©e' };
    }

    const parsedCode = parseQuestValidationCode(scannedCode);
    const expectedStaticCode = location.static_code?.trim() || `LOCATION-${location.id}`;
    const storedNonce = (quest.validation_code || '').split(':').pop();

    // VÃ©rifier que le code scannÃ© correspond Ã  cette quÃªte et Ã  ce lieu
    if (
      !parsedCode ||
      parsedCode.questId !== questId ||
      parsedCode.locationId !== location.id ||
      parsedCode.code !== expectedStaticCode ||
      !storedNonce ||
      parsedCode.nonce !== storedNonce
    ) {
      return {
        success: false,
        error: `Mauvais emplacement ! Cette quÃªte doit Ãªtre validÃ©e Ã  "${location.name}"`
      };
    }

    // Tout est bon, complÃ©ter la quÃªte
    const xpReward = quest.xp_reward || 0;

    uq.status = 'completed';
    uq.updated_at = new Date();

    const newXP = user.xp + xpReward;
    const newLevel = calculateLevelFromXP(newXP);

    // Mettre Ã  jour mockUsers pour que les autres services (classement, etc.) voient le changement
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      mockUser.xp = newXP;
      mockUser.level = newLevel;
    }

    const newRank = calculateUserRank(userId);

    // Mettre Ã  jour le store auth via l'action dÃ©diÃ©e qui gÃ¨re aussi la persistance
    authStore.updateUserStats({
      xp: newXP,
      level: newLevel,
      rank: newRank
    });

    // Persist quest state
    saveUserQuests();

    return {
      success: true,
      message: `QuÃªte validÃ©e ! +${xpReward} XP gagnÃ©`
    };
  },

  getQuestQRCode: async (questId: number) => {
    const quest = mockQuests.find(q => q.id_quest === questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    const location = LOCATIONS.find(l => l.id === quest.id_location);
    if (!location) {
      throw new Error('Location not found');
    }

    if (!quest.validation_code) {
      quest.validation_code = getStoredQuestValidationCode(quest, location.id, location.static_code);
    }

    const qrValue = getQuestValidationCode(
      quest.id_quest,
      location.id,
      location.static_code,
      quest.validation_code.split(':').pop()
    );

    return {
      questId: quest.id_quest,
      questTitle: quest.title,
      locationId: location.id,
      locationName: location.name,
      manualCode: qrValue,
      qrValue
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

