import { UserMock } from '@/mocks/users'
import { authMockService } from './mock/authMockService'

// Check if mock mode is enabled
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const authServiceImpl = {
  login: async (email: string, password: string): Promise<UserMock> => {
    console.log('Auth service: login called with', email)
    throw new Error('Auth service not implemented yet')
  },
  register: async (firstName: string, lastName: string, email: string, password: string, role: string): Promise<UserMock> => {
    console.log('Auth service: register called with', firstName, email, role)
    throw new Error('Auth service not implemented yet')
  }
}

// Use mock or real service based on environment
export const authService = isMockEnabled ? authMockService : authServiceImpl

console.log(`Auth service initialized: ${isMockEnabled ? 'MOCK' : 'REAL'} mode`)