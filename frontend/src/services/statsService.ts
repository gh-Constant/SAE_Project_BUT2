
import axios from 'axios';
import { COMMANDES } from '@/mocks/commande';
import { LOCATIONS } from '@/mocks/locations';
import { USERS, Role, PRESTATAIRE_USER_ID } from '@/mocks/users';

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
    charts: {
        months: string[];
        revenue: number[];
        users: number[];
    };
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
        await new Promise(resolve => setTimeout(resolve, 500)); 

        const totalUserCount = USERS.length;
        const payingUserCount = USERS.filter(u => u.role === Role.AVENTURIER_ROLE_ID).length;

        const totalRevenue = COMMANDES.reduce((sum, order) => sum + order.total_price, 0);

        return {
            userCount: totalUserCount,
            payingUserCount: payingUserCount,
            totalRevenue: totalRevenue,
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
            ],
            charts: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                revenue: [5000, 7500, 6200, 8900, 10500, 12000],
                users: [15, 22, 18, 30, 45, 60]
            }
        };
    }

    async getProviderGlobalStats(): Promise<ProviderStats> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const providerId = PRESTATAIRE_USER_ID;
        const locationsCount = LOCATIONS.filter(l => l.id_prestataire === providerId).length;

        const providerOrders = COMMANDES.filter(o => o.id_prestataire === providerId);
        const monthlyRevenue = providerOrders.reduce((sum, o) => sum + o.total_price, 0);

        const orderCount = providerOrders.length;

        return {
            locationsCount,
            monthlyRevenue,
            orderCount
        };
    }
}

export const statsService = isMockEnabled ? new MockStatsService() : new StatsServiceImpl();
