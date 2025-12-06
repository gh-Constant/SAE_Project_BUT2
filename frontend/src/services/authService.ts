/**
 * @file authService.ts
 * @description
 * Service d'authentification qui choisit entre le mode mock et le mode réel.
 * Fournit les fonctions login, register et validation de token pour gérer les utilisateurs.
 *
 * @utilité
 * - Permet de tester l'application avec des données mock sans backend.
 * - Prépare l'intégration avec un vrai backend plus tard.
 * - Fournit une interface unique pour la connexion, l'inscription et la validation.
 * - Gère la communication avec l'API backend pour l'authentification.
 *
 * @exports
 * - authService : service d'authentification utilisé dans l'application.
 *
 * @remarques
 * - Le mode mock est activé si VITE_NO_BACKEND est true.
 * - Les fonctions du mode réel appellent l'API backend avec fetch.
 * - validateToken utilise maintenant /me au lieu de /verify pour simplifier.
 */

//. TODO: Créer un service API pour garder le projet avec une meilleure organisation

import { UserMock } from '@/mocks/users'
import { authMockService } from './mock/authMockService'

// Vérifier si on est en mode mock ou réel selon la variable d'environnement
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
    // Store only token for security
    localStorage.setItem('authToken', data.token);
    
    // Normalize backend id_user to id
    const user = { ...data.user, id: data.user.id_user || data.user.id };
    return user;
  },
  register: async (firstName: string, lastName: string, email: string, password: string, role: string, avatarUrl?: string, avatarType?: string): Promise<UserMock> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, role, avatarUrl, avatarType }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const user = await response.json();
    return { ...user, id: user.id_user || user.id };
  },

  // Validation du token et récupération des informations utilisateur
  validateToken: async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken'); // Récupérer le token du localStorage
    if (!token) return false; // Pas de token = non valide

    try {
      // Appeler /me pour valider le token (le middleware backend vérifie automatiquement)
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // Envoyer le token dans l'en-tête
        },
      });

      return response.ok; // Si la réponse est OK, le token est valide
    } catch {
      return false; // Erreur réseau = token invalide
    }
  },

  getCurrentUser: async (): Promise<UserMock | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        return null;
      }

      const user = await response.json();
      return { ...user, id: user.id_user || user.id };
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser'); // Remove for security
  },

  updateProfile: async (profileData: UserMock): Promise<UserMock> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    const user = await response.json();
    return { ...user, id: user.id_user || user.id };
  },

  /**
  getMyRole: async (): Promise<any> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/role`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      return null;
    }
  },

  getUserRole: async (userId: number): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/roles/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user role');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw new Error('Failed to fetch user role');
    }
  }
   */
}

// On choisit dynamiquement le service à utiliser selon le mode
export const authService = isMockEnabled ? authMockService : authServiceImpl

// Log pour savoir si on est en mode mock ou réel (utile pour debug)
console.log(`Auth service initialized: ${isMockEnabled ? 'MOCK' : 'REAL'} mode`)