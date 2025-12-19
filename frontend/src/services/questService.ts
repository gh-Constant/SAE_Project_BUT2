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
  userQuests?: any[];
}

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const questServiceImpl = {
  getQuestsByLocation: async (locationId: number): Promise<Quest[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/locations/${locationId}`, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch quests');
    return await response.json();
  },

  getUserQuests: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/my-quests`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch user quests');
    return await response.json();
  },

  createQuest: async (quest: Omit<Quest, 'id_quest'>): Promise<Quest> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(quest)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create quest');
    }
    return await response.json();
  },

  acceptQuest: async (questId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/${questId}/accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) throw new Error('Failed to accept quest');
  },

  completeQuest: async (questId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/${questId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) throw new Error('Failed to complete quest');
  },

  cancelQuest: async (questId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/${questId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) throw new Error('Failed to cancel quest');
  },

  getAllQuests: async (): Promise<Quest[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch all quests');
    return await response.json();
  },

  updateQuest: async (questId: number, data: Partial<Quest>): Promise<Quest> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/${questId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update quest');
    return await response.json();
  },

  deleteQuest: async (questId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/${questId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete quest');
  }
};

export const questService = isMockEnabled ? questMockService : questServiceImpl;
