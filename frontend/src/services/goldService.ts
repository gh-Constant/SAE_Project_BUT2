import { goldMockService } from './mock/goldMockService';
import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const goldServiceImpl = {
  createCheckoutSession: async (userId: number, amountGold: number, priceInCents: number) => {
    const response = await apiClient.post('/gold/checkout', { userId, amountGold, priceInCents });
    return response.data;
  },

  fulfillPurchase: async (sessionId: string) => {
    const response = await apiClient.post('/gold/fulfill', { sessionId });
    return response.data;
  },

  getBalance: async (userId: number) => {
    const response = await apiClient.get(`/gold/${userId}`);
    return response.data;
  }
};

export const goldService = isMockEnabled ? goldMockService : goldServiceImpl;
