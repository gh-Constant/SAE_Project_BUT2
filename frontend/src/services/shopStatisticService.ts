import { shopStatisticMockService, ShopStatisticsData } from './mock/shopStatisticMockService';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const shopStatisticServiceImpl = {
    getStatistics: async (): Promise<ShopStatisticsData> => {
        const response = await fetch(`${API_BASE_URL}/api/v1/shop/statistics`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch shop statistics');
        return await response.json();
    }
};

export const shopStatisticService = isMockEnabled ? shopStatisticMockService : shopStatisticServiceImpl;

// Re-export types for convenience
export * from './mock/shopStatisticMockService';
