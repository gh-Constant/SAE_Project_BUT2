import { goldMockService } from './mock/goldMockService';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const goldServiceImpl = {
  createCheckoutSession: async (userId: number, amountGold: number, priceInCents: number) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/gold/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, amountGold, priceInCents })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }
    
    return await response.json();
  },

  fulfillPurchase: async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/gold/fulfill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
      throw new Error('Failed to fulfill purchase');
    }

    return await response.json();
  },

  getBalance: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/gold/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    return await response.json();
  }
};

export const goldService = isMockEnabled ? goldMockService : goldServiceImpl;
