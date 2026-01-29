import { userServiceMock } from './mock/userServiceMock';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const userServiceImpl = {
  getUsers: async (): Promise<Response> => {
    return fetch(`${API_URL}/users`);
  },

  verifyUser: async (userId: number): Promise<Response> => {
    return fetch(`${API_URL}/users/${userId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ userId }), // Include body if your API expects it
    });
  },

  deleteUser: async (userId: number): Promise<Response> => {
    return fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    });
  },

  getUserRank: async (userId: number): Promise<Response> => {
    return fetch(`${API_URL}/users/${userId}/rank`);
  },

  getLeaderboard: async (page = 1, limit = 10): Promise<Response> => {
    return fetch(`${API_URL}/users/leaderboard?page=${page}&limit=${limit}`);
  },
};

export const userService = isMockEnabled ? userServiceMock : userServiceImpl;
