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
 * - Ce store peut être utilisé avec les données mock et avec les vraies données API.
 * - L'état authReady permet aux guards du routeur d'attendre la fin de la vérification d'authentification.
 */

import { defineStore } from 'pinia'
import { UserMock } from '@/mocks/users'
import { authService } from '@/services/authService'

// Check if we're in mock mode
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserMock | null,
    isAuthenticated: false,
    authReady: false,
  }),
  actions: {
    async login(email: string, password: string) {
      const user = await authService.login(email, password)
      this.user = user as UserMock
      this.isAuthenticated = true
      // Only store currentUser in mock mode for compatibility
      if (isMockEnabled) {
        localStorage.setItem('currentUser', JSON.stringify(user))
      }
    },
    async register(firstName: string, lastName: string, email: string, password: string, role: string) {
      const user = await authService.register(firstName, lastName, email, password, role)
      this.user = user as UserMock
      this.isAuthenticated = true
      // Only store currentUser in mock mode for compatibility
      if (isMockEnabled) {
        localStorage.setItem('currentUser', JSON.stringify(user))
      }
    },
    async validateAndRefreshUser() {
      if (isMockEnabled) {
        // Mode mock : utiliser la logique existante
        const userStr = localStorage.getItem('currentUser')
        const token = localStorage.getItem('authToken')
        if (userStr && token) {
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
        }
        return;
      }

      // Mode réel : valider le token et récupérer les données utilisateur
      // (as any) nécessaire car authService choisit mock/réel à l'exécution, TypeScript voit union des types
      // TODO: Trouver une meilleure solution au probléme du authservice mock/reel à l'exec
      const isValid = await (authService as any).validateToken()
      if (isValid) {
        const user = await (authService as any).getCurrentUser()
        if (user) {
          this.user = user
          this.isAuthenticated = true
        } else {
          this.logout()
        }
      } else {
        this.logout()
      }
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
      if (typeof (authService as any).logout === 'function') { // Quand on aura le logout
        (authService as any).logout()
      }
    },
    checkAuth() {
      if (isMockEnabled) {
        // Mode mock : utiliser la logique existante
        const userStr = localStorage.getItem('currentUser')
        const token = localStorage.getItem('authToken')
        if (userStr && token) {
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
        }
        this.authReady = true; // Marquer l'auth comme prête immédiatement
      } else {
        // Mode réel : valider le token et récupérer les données utilisateur
        this.validateAndRefreshUser().finally(() => {
          this.authReady = true; // Marquer l'auth comme prête après validation
        });
      }
    }
  }
})