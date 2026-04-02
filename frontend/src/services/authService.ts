import { UserMock } from '@/mocks/users'
import { authMockService } from './mock/authMockService'
import apiClient from './apiClient'

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_URL = import.meta.env.VITE_API_URL || `${API_BASE_URL}/api/v1`

type OAuthProvider = 'google' | 'discord'

type SecuritySettings = {
  email: string
  hasPassword: boolean
  linkedProviders: Array<{
    provider: OAuthProvider
    email?: string | null
    linkedAt?: string | null
  }>
}

type OAuthConfirmResult = {
  token: string
  provider: OAuthProvider
}

const authServiceImpl = {
  login: async (email: string, password: string): Promise<UserMock> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const data = response.data
      localStorage.setItem('authToken', data.token)
      return { ...data.user, id: data.user.id_user || data.user.id }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  },

  register: async (firstName: string, lastName: string, email: string, password: string, role: string, avatarUrl?: string, avatarType?: string, prestataireTypeId?: number, avatarFile?: File): Promise<UserMock> => {
    try {
      let payload: any
      const headers: Record<string, string> = {}

      if (avatarFile) {
        payload = new FormData()
        payload.append('firstName', firstName)
        payload.append('lastName', lastName)
        payload.append('email', email)
        payload.append('password', password)
        payload.append('role', role)
        if (avatarType) payload.append('avatarType', avatarType)
        if (role === 'prestataire' && prestataireTypeId) {
          payload.append('prestataireTypeId', prestataireTypeId.toString())
        }
        payload.append('avatarFile', avatarFile)
        headers['Content-Type'] = 'multipart/form-data'
      } else {
        payload = { firstName, lastName, email, password, role, avatarUrl, avatarType }
        if (role === 'prestataire' && prestataireTypeId) {
          payload.prestataireTypeId = prestataireTypeId
        }
      }

      const response = await apiClient.post('/auth/register', payload, { headers })
      const user = response.data
      return { ...user, id: user.id_user || user.id }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed')
    }
  },

  validateToken: async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken')
    if (!token) return false

    try {
      await apiClient.get('/auth/me')
      return true
    } catch {
      return false
    }
  },

  getCurrentUser: async (): Promise<UserMock | null> => {
    const token = localStorage.getItem('authToken')
    if (!token) return null

    try {
      const response = await apiClient.get('/auth/me')
      const user = response.data
      return { ...user, id: user.id_user || user.id }
    } catch {
      return null
    }
  },

  setAuthToken: (token: string) => {
    localStorage.setItem('authToken', token)
  },

  completeOAuthLogin: async (token: string): Promise<UserMock | null> => {
    localStorage.setItem('authToken', token)
    return await authServiceImpl.getCurrentUser()
  },

  confirmOAuthLink: async (token: string): Promise<OAuthConfirmResult> => {
    const response = await apiClient.post('/auth/oauth/confirm-link', { token })
    return response.data
  },

  getOAuthStartUrl: (provider: OAuthProvider) => `${API_URL}/auth/${provider}`,

  prepareOAuthLink: async (provider: OAuthProvider): Promise<string> => {
    const response = await apiClient.post(`/auth/oauth/${provider}/link`, {}, { withCredentials: true })
    return `${API_BASE_URL}${response.data.url}`
  },

  getSecuritySettings: async (): Promise<SecuritySettings> => {
    const response = await apiClient.get('/auth/security')
    return response.data
  },

  requestPasswordSetupEmail: async (): Promise<string> => {
    const response = await apiClient.post('/auth/password/setup-request')
    return response.data.message || 'Verification email sent'
  },

  deleteMyAccount: async (currentPassword?: string): Promise<string> => {
    const response = await apiClient.delete('/auth/account', { data: { currentPassword } })
    return response.data.message || 'Account deleted successfully'
  },

  unlinkOAuthProvider: async (provider: OAuthProvider): Promise<SecuritySettings> => {
    const response = await apiClient.delete(`/auth/oauth/${provider}/link`)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
  },

  updateProfile: async (profileData: any, avatarFile?: File): Promise<UserMock> => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Not authenticated')
    }

    try {
      let payload: any
      const headers: Record<string, string> = {}

      if (avatarFile) {
        payload = new FormData()
        Object.keys(profileData).forEach((key) => {
          if (profileData[key] !== undefined && profileData[key] !== null) {
            payload.append(key, profileData[key])
          }
        })
        payload.append('avatarFile', avatarFile)
        headers['Content-Type'] = 'multipart/form-data'
      } else {
        payload = profileData
      }

      const response = await apiClient.put('/auth/profile', payload, { headers })
      const user = response.data
      return { ...user, id: user.id_user || user.id }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile')
    }
  },

  changePassword: async (currentPassword: string | undefined, newPassword: string): Promise<string> => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await apiClient.put('/auth/change-password', { currentPassword, newPassword })
      return response.data.message || 'Password updated successfully'
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password')
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await apiClient.post('/auth/forgot-password', { email })
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send reset email')
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword })
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reset password')
    }
  },
}

export const authService = isMockEnabled ? authMockService : authServiceImpl

console.log(`Auth service initialized: ${isMockEnabled ? 'MOCK' : 'REAL'} mode`)
