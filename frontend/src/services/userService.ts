import { userServiceMock } from './mock/userServiceMock';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const userServiceImpl = {
  getUsers: async (): Promise<Response> => {
    return fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
  },

  verifyUser: async (userId: number): Promise<Response> => {
    return fetch(`${API_URL}/users/${userId}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      // body: JSON.stringify({ userId }), // Include body if your API expects it
    });
  },

  deleteUser: async (userId: number): Promise<Response> => {
    return fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  getUserRank: async (userId: number): Promise<Response> => {
    return fetch(`${API_URL}/users/${userId}/rank`, {
      headers: getAuthHeaders()
    });
  },

  getLeaderboard: async (page = 1, limit = 10): Promise<Response> => {
    return fetch(`${API_URL}/users/leaderboard?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
  },
};

export const userService = isMockEnabled ? userServiceMock : userServiceImpl;
