/**
 * @file auth.middleware.ts
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
import { useCartStore } from './cart'

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
      const user = await authService.login(email, password) as UserMock
      this.user = user
      this.isAuthenticated = true
      this.authReady = true
      
      // Charger le panier de cet utilisateur
      const cartStore = useCartStore()
      cartStore.loadCartForUser(user.id)
      
      // Only store currentUser in mock mode for compatibility
      if (isMockEnabled) {
        localStorage.setItem('currentUser', JSON.stringify(user))
        localStorage.setItem('authToken', 'mock-token-' + Date.now()) // Ajouter un token mock
      }
    },
    async register(firstName: string, lastName: string, email: string, password: string, role: string, avatarUrl?: string, avatarType?: string) {
      const user = await authService.register(firstName, lastName, email, password, role, avatarUrl, avatarType)
      this.user = user as UserMock
      this.isAuthenticated = true
      this.authReady = true
      
      // Charger le panier de ce nouvel utilisateur (sera vide pour un nouveau compte)
      const cartStore = useCartStore()
      cartStore.loadCartForUser(user.id)
      
      // Only store currentUser in mock mode for compatibility
      if (isMockEnabled) {
        localStorage.setItem('currentUser', JSON.stringify(user))
        localStorage.setItem('authToken', 'mock-token-' + Date.now()) // Ajouter un token mock
      }
    },
    async validateAndRefreshUser() {
      if (isMockEnabled) {
        // Mode mock : utiliser la logique existante
        const userStr = localStorage.getItem('currentUser')
        const token = localStorage.getItem('authToken')
        if (userStr && token) {
          try {
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true
          } catch {
            // Si les données sont corrompues, nettoyer
            console.warn('Corrupted user data in localStorage, clearing...')
            this.logout()
          }
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
      // Vider le panier avant de se déconnecter
      const cartStore = useCartStore()
      cartStore.clearCart()
      
      this.user = null
      this.isAuthenticated = false
      // authReady reste true car l'état est bien défini (utilisateur déconnecté)
      // Nettoyer complètement le localStorage
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
      // Nettoyer aussi d'autres clés potentielles
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      if (typeof (authService as any).logout === 'function') { // Quand on aura le logout
        (authService as any).logout()
      }
    },
    checkAuth() {
      if (isMockEnabled) {
        // Mode mock : vérifier les données dans localStorage
        const userStr = localStorage.getItem('currentUser')
        const token = localStorage.getItem('authToken')
        
        // Si on a des données valides, les charger
        if (userStr && token) {
          try {
            const user = JSON.parse(userStr) as UserMock
            this.user = user
            this.isAuthenticated = true
            
            // Charger le panier de cet utilisateur
            const cartStore = useCartStore()
            cartStore.loadCartForUser(user.id)
          } catch {
            // Si les données sont corrompues, nettoyer
            console.warn('Corrupted user data in localStorage, clearing...')
            this.logout()
          }
        } else {
          // Pas de données, s'assurer que l'état est propre
          this.user = null
          this.isAuthenticated = false
          
          // Vider le panier si pas d'utilisateur
          const cartStore = useCartStore()
          cartStore.items = []
        }
        this.authReady = true; // Marquer l'auth comme prête immédiatement
      } else {
        // Mode réel : valider le token et récupérer les données utilisateur
        this.validateAndRefreshUser().finally(() => {
          this.authReady = true; // Marquer l'auth comme prête après validation
        });
      }
    },
    // Fonction pour forcer le nettoyage complet (utile pour le debug)
    forceLogout() {
      this.user = null
      this.isAuthenticated = false
      // authReady reste true car l'état est bien défini (utilisateur déconnecté)
      // Nettoyer TOUT le localStorage lié à l'auth
      Object.keys(localStorage).forEach(key => {
        if (key.includes('auth') || key.includes('user') || key.includes('token') || key.includes('current')) {
          localStorage.removeItem(key)
        }
      })
    }
  }
})