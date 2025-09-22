/**
 * @file auth.ts
 * @description
 * Store Pinia pour gérer l'authentification des utilisateurs.
 * Contient l'état de connexion, les infos utilisateur et les actions pour se connecter ou se déconnecter.
 *
 * @utilité
 * - Garder toutes les infos de connexion au même endroit.
 * - Permettre aux composants de savoir si l'utilisateur est connecté.
 * - Faciliter la connexion et la déconnexion des utilisateurs.
 *
 * @exports
 * - useAuthStore : store principal pour l'authentification, utilisable dans toute l'application.
 *
 * @remarques
 * - Ce store doit pouvoir être utilisable avec les données mock et avec les vraies données
 */

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
      this.user = user as UserMock
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