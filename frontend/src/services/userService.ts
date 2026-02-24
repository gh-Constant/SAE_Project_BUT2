import { userServiceMock } from './mock/userServiceMock';
import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const userServiceImpl = {
  getUsers: async (): Promise<any> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  verifyUser: async (userId: number): Promise<any> => {
    const response = await apiClient.post(`/users/${userId}/verify`);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<any> => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  getUserRank: async (userId: number): Promise<any> => {
    const response = await apiClient.get(`/users/${userId}/rank`);
    return response.data;
  },

  getLeaderboard: async (page = 1, limit = 10): Promise<any> => {
    const response = await apiClient.get('/users/leaderboard', {
      params: { page, limit }
    });
    return response.data;
  },
};

export const userService = isMockEnabled ? userServiceMock : userServiceImpl;
