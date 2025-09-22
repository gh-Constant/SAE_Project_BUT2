import { defineStore } from 'pinia'
import { UserMock } from '@/mocks/users'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserMock | null,
    isAuthenticated: false,
  }),
  actions: {
    async login(email: string, password: string) {
      const user = await authService.login(email, password)
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem('currentUser', JSON.stringify(user))
    },
    async register(firstName: string, lastName: string, email: string, password: string, role: string) {
      const user = await authService.register(firstName, lastName, email, password, role)
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem('currentUser', JSON.stringify(user))
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('currentUser')
    },
    checkAuth() {
      const userStr = localStorage.getItem('currentUser')
      if (userStr) {
        this.user = JSON.parse(userStr)
        this.isAuthenticated = true
      }
    }
  }
})