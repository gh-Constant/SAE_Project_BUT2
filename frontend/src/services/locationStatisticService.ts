import apiClient from './apiClient';
import {
  locationStatisticMockService,
  LocationStatisticsData,
} from './mock/locationStatisticMockService';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const locationStatisticServiceImpl = {
  async getStatistics(): Promise<LocationStatisticsData> {
    try {
      const response = await apiClient.get('/stats/admin/locations');
      return response.data;
    } catch {
      throw new Error('Failed to fetch location statistics');
    }
  },
};

export const locationStatisticService = isMockEnabled
  ? locationStatisticMockService
  : locationStatisticServiceImpl;

export * from './mock/locationStatisticMockService';
