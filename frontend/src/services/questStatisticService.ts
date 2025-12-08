import { questStatisticMockService, QuestStatisticsData } from './mock/questStatisticMockService';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const questStatisticServiceImpl = {
  getStatistics: async (): Promise<QuestStatisticsData> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/quests/statistics`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch quest statistics');
    return await response.json();
  }
};

export const questStatisticService = isMockEnabled ? questStatisticMockService : questStatisticServiceImpl;

// Re-export types for convenience
export * from './mock/questStatisticMockService';
