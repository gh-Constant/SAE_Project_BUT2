
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

export interface RecentActivityItem {
    type: 'USER_CREATED' | 'LOCATION_ADDED';
    id: number;
    name: string;
    date: string;
}

export interface AdminStats {
    userCount: number;
    payingUserCount: number;
    totalRevenue: number;
    recentActivity: RecentActivityItem[];
}

export interface ProviderStats {
    locationsCount: number;
    monthlyRevenue: number;
    orderCount: number;
}

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

class StatsServiceImpl {
    private getHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }

    async getAdminGlobalStats(): Promise<AdminStats> {
        const response = await axios.get(`${API_URL}/stats/admin/global`, this.getHeaders());
        return response.data;
    }

    async getProviderGlobalStats(): Promise<ProviderStats> {
        const response = await axios.get(`${API_URL}/stats/provider/global`, this.getHeaders());
        return response.data;
    }
}

// Mock implementation
class MockStatsService {
    async getAdminGlobalStats(): Promise<AdminStats> {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        return {
            userCount: 1543,
            payingUserCount: 890,
            totalRevenue: 45200,
            recentActivity: [
                {
                    type: 'USER_CREATED',
                    id: 101,
                    name: 'Jean Dupont',
                    date: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
                },
                {
                    type: 'LOCATION_ADDED',
                    id: 55,
                    name: 'Château de la Loire',
                    date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
                },
                {
                    type: 'USER_CREATED',
                    id: 102,
                    name: 'Marie Curie',
                    date: new Date(Date.now() - 90000000).toISOString()
                }
            ]
        };
    }

    async getProviderGlobalStats(): Promise<ProviderStats> {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        return {
            locationsCount: 2, // Matches PrestataireView hardcoded
            monthlyRevenue: 1250, // Matches PrestataireView hardcoded
            orderCount: 42 // New metric requested
        };
    }
}

export const statsService = isMockEnabled ? new MockStatsService() : new StatsServiceImpl();
