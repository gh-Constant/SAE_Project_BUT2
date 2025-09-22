/**
 * @file authServices.ts
 * @description
 * Service d'authentification qui choisit entre le mode mock et le mode réel.
 * Fournit les fonctions login et register pour gérer les utilisateurs.
 *
 * @utilité
 * - Permet de tester l'application avec des données mock sans backend.
 * - Prépare l'intégration avec un vrai backend plus tard.
 * - Fournit une interface unique pour la connexion et l'inscription.
 *
 * @exports
 * - authService : service d'authentification utilisé dans l'application.
 *
 * @remarques
 * - Le mode mock est activé si VITE_NO_BACKEND est true.
 * - Les fonctions du mode réel ne sont pas encore implémentées et lèvent une erreur.
 */

import { UserMock } from '@/mocks/users'
import { authMockService } from './mock/authMockService'

// Vérifie si on est en mode mock ou réel selon la variable d'environnement
// VITE_NO_BACKEND=true signifie qu'on n'a pas de backend disponible
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

// Implémentation du service réel (pas codée et va surement être exporté dans un autre .ts)
const authServiceImpl = {
  login: async (email: string, password: string): Promise<UserMock> => {
    console.log('Auth service: login called with', email) // Ici normalement on ferait un appel HTTP vers le backend
    throw new Error('Auth service not implemented yet')
  },
  register: async (firstName: string, lastName: string, email: string, password: string, role: string): Promise<UserMock> => {
    console.log('Auth service: register called with', firstName, email, role) // Ici normalement on enverrait les données au backend pour créer un utilisateur
    throw new Error('Auth service not implemented yet')
  }
}

// On choisit dynamiquement le service à utiliser selon le mode
export const authService = isMockEnabled ? authMockService : authServiceImpl

// Log pour savoir si on est en mode mock ou réel (utile pour debug)
console.log(`Auth service initialized: ${isMockEnabled ? 'MOCK' : 'REAL'} mode`)