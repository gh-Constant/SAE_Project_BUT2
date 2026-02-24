import { questStatisticMockService, QuestStatisticsData } from './mock/questStatisticMockService';
import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const questStatisticServiceImpl = {
  getStatistics: async (): Promise<QuestStatisticsData> => {
    try {
      const response = await apiClient.get('/quests/statistics');
      return response.data;
    } catch {
      throw new Error('Failed to fetch quest statistics');
    }
  }
};

export const questStatisticService = isMockEnabled ? questStatisticMockService : questStatisticServiceImpl;

// Re-export types for convenience
export * from './mock/questStatisticMockService';
