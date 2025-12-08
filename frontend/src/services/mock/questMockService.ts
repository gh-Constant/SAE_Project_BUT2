import { Quest } from '../questService';

const mockQuests: Quest[] = [
  {
    id_quest: 1,
    title: 'Explore the Park',
    description: 'Visit all 3 landmarks in the park.',
    xp_reward: 100,
    id_location: 1,
    created_at: new Date().toISOString()
  },
  {
    id_quest: 2,
    title: 'Coffee tasting',
    description: 'Drink 3 different coffees.',
    xp_reward: 50,
    id_location: 1,
    created_at: new Date().toISOString()
  }
];

const userQuests: any[] = [];

export const questMockService = {
  getQuestsByLocation: async (locationId: number): Promise<Quest[]> => {
    return mockQuests.filter(q => q.id_location === locationId);
  },

  getUserQuests: async (): Promise<any[]> => {
    return userQuests;
  },

  createQuest: async (quest: Omit<Quest, 'id_quest'>): Promise<Quest> => {
    const newQuest = { ...quest, id_quest: mockQuests.length + 1, created_at: new Date().toISOString() };
    mockQuests.push(newQuest);
    return newQuest;
  },

  acceptQuest: async (questId: number): Promise<void> => {
    const quest = mockQuests.find(q => q.id_quest === questId);
    if (quest && !userQuests.find(uq => uq.id_quest === questId)) {
        userQuests.push({ ...quest, status: 'accepted', quest: quest });
    }
  },

  completeQuest: async (questId: number): Promise<void> => {
    const uq = userQuests.find(q => q.id_quest === questId);
    if (uq) {
        uq.status = 'completed';
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
