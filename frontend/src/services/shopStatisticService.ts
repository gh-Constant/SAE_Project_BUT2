import { shopStatisticMockService, ShopStatisticsData } from './mock/shopStatisticMockService';
import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const shopStatisticServiceImpl = {
    getStatistics: async (): Promise<ShopStatisticsData> => {
        try {
            const response = await apiClient.get('/shop/statistics');
            return response.data;
        } catch {
            throw new Error('Failed to fetch shop statistics');
        }
    }
};

export const shopStatisticService = isMockEnabled ? shopStatisticMockService : shopStatisticServiceImpl;

// Re-export types for convenience
export * from './mock/shopStatisticMockService';
