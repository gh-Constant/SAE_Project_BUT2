import { Quest } from '../questService';
import { QUESTS } from '@/mocks/quests';
import { USER_QUESTS } from '@/mocks/userQuests';
import { LOCATIONS } from '@/mocks/locations';

const mockQuests = [...QUESTS];
const userQuests = [...USER_QUESTS];

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
    return userQuests.filter(uq => uq.id_user === userId);
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
    if (quest && !userQuests.find(uq => uq.id_quest === questId && uq.id_user === userId)) {
      userQuests.push({
        id_user: userId,
        id_quest: quest.id_quest,
        status: 'accepted',
        created_at: new Date(),
        updated_at: new Date(),
        quest: quest
      });
    }
  },

  completeQuest: async (questId: number): Promise<void> => {
    const userId = getCurrentUserId();
    const uq = userQuests.find(q => q.id_quest === questId && q.id_user === userId);
    if (uq) {
      uq.status = 'completed';
    }
  },

  cancelQuest: async (questId: number): Promise<void> => {
    const userId = getCurrentUserId();
    const index = userQuests.findIndex(q => q.id_quest === questId && q.id_user === userId);
    if (index !== -1) {
      userQuests.splice(index, 1);
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
  }
};
