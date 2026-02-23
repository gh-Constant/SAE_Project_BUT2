import { questMockService } from './mock/questMockService';

export interface Quest {
  id_quest: number;
  title: string;
  description: string;
  xp_reward: number;
  id_location: number;
  created_at?: string;
  updated_at?: string;
  status?: 'accepted' | 'completed' | 'failed'; // For UserQuest
  userQuests?: UserQuest[];
}

export interface UserQuest {
  id_user_quest: number;
  id_user: number;
  id_quest: number;
  status: 'accepted' | 'completed' | 'failed';
  accepted_at?: string;
  completed_at?: string;
}

import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const questServiceImpl = {
  getQuestsByLocation: async (locationId: number): Promise<Quest[]> => {
    try {
      const response = await apiClient.get(`/quests/locations/${locationId}`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch quests');
    }
  },

  getUserQuests: async (): Promise<UserQuest[]> => {
    try {
      const response = await apiClient.get(`/quests/my-quests`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch user quests');
    }
  },

  createQuest: async (quest: Omit<Quest, 'id_quest'>): Promise<Quest> => {
    try {
      const response = await apiClient.post(`/quests`, quest);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create quest');
    }
  },

  acceptQuest: async (questId: number): Promise<void> => {
    try {
      await apiClient.post(`/quests/${questId}/accept`);
    } catch {
      throw new Error('Failed to accept quest');
    }
  },

  completeQuest: async (questId: number): Promise<void> => {
    try {
      await apiClient.post(`/quests/${questId}/complete`);
    } catch {
      throw new Error('Failed to complete quest');
    }
  },

  cancelQuest: async (questId: number): Promise<void> => {
    try {
      await apiClient.post(`/quests/${questId}/cancel`);
    } catch {
      throw new Error('Failed to cancel quest');
    }
  },

  getAllQuests: async (): Promise<Quest[]> => {
    try {
      const response = await apiClient.get(`/quests`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch all quests');
    }
  },

  updateQuest: async (questId: number, data: Partial<Quest>): Promise<Quest> => {
    try {
      const response = await apiClient.put(`/quests/${questId}`, data);
      return response.data;
    } catch {
      throw new Error('Failed to update quest');
    }
  },

  deleteQuest: async (questId: number): Promise<void> => {
    try {
      await apiClient.delete(`/quests/${questId}`);
    } catch {
      throw new Error('Failed to delete quest');
    }
  },

  validateQuestByQR: async (questId: number, scannedCode: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await apiClient.post(`/quests/${questId}/validate-qr`, { scannedCode });
      return response.data;
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Validation failed' };
    }
  }
};

export const questService = isMockEnabled ? questMockService : questServiceImpl;
