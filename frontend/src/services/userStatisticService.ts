import apiClient from './apiClient';
import {
  userStatisticMockService,
  UserStatisticsData,
} from './mock/userStatisticMockService';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const userStatisticServiceImpl = {
  async getStatistics(): Promise<UserStatisticsData> {
    try {
      const response = await apiClient.get('/stats/admin/users');
      return response.data;
    } catch {
      throw new Error('Failed to fetch user statistics');
    }
  },
};

export const userStatisticService = isMockEnabled
  ? userStatisticMockService
  : userStatisticServiceImpl;

export * from './mock/userStatisticMockService';
