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
 * - Les fonctions du mode réel appellent l'API backend.
 */

//TODO: Create an api service to keep the project with a better organisation

import { UserMock } from '@/mocks/users'
import { authMockService } from './mock/authMockService'

// Vérifie si on est en mode mock ou réel selon la variable d'environnement
// VITE_NO_BACKEND=true signifie qu'on n'a pas de backend disponible
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Implémentation du service réel
const authServiceImpl = {
  login: async (email: string, password: string): Promise<UserMock> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    // Store token
    localStorage.setItem('authToken', data.token);
    return data.user;
  },
  register: async (firstName: string, lastName: string, email: string, password: string, role: string): Promise<UserMock> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const user = await response.json();
    return user;
  }
}

// On choisit dynamiquement le service à utiliser selon le mode
export const authService = isMockEnabled ? authMockService : authServiceImpl

// Log pour savoir si on est en mode mock ou réel (utile pour debug)
console.log(`Auth service initialized: ${isMockEnabled ? 'MOCK' : 'REAL'} mode`)