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
import apiClient from './apiClient'

// Vérifier si on est en mode mock ou réel selon la variable d'environnement
// VITE_NO_BACKEND=true signifie qu'on n'a pas de backend disponible
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

// Implémentation du service réel
const authServiceImpl = {
  login: async (email: string, password: string): Promise<UserMock> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = response.data;
      // Store only token for security
      localStorage.setItem('authToken', data.token);

      // Normalize backend id_user to id
      const user = { ...data.user, id: data.user.id_user || data.user.id };
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },
  register: async (firstName: string, lastName: string, email: string, password: string, role: string, avatarUrl?: string, avatarType?: string, prestataireTypeId?: number, avatarFile?: File): Promise<UserMock> => {
    try {
      let payload: any;
      let headers: Record<string, string> = {};

      if (avatarFile) {
        payload = new FormData();
        payload.append('firstName', firstName);
        payload.append('lastName', lastName);
        payload.append('email', email);
        payload.append('password', password);
        payload.append('role', role);
        if (avatarType) payload.append('avatarType', avatarType);
        if (role === 'prestataire' && prestataireTypeId) {
          payload.append('prestataireTypeId', prestataireTypeId.toString());
        }
        payload.append('avatarFile', avatarFile);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        payload = { firstName, lastName, email, password, role, avatarUrl, avatarType };
        if (role === 'prestataire' && prestataireTypeId) {
          payload.prestataireTypeId = prestataireTypeId;
        }
      }
      const response = await apiClient.post('/auth/register', payload, { headers });
      const user = response.data;
      return { ...user, id: user.id_user || user.id };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // Validation du token et récupération des informations utilisateur
  validateToken: async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken'); // Récupérer le token du localStorage
    if (!token) return false; // Pas de token = non valide

    try {
      // Appeler /me pour valider le token (le middleware backend vérifie automatiquement)
      await apiClient.get('/auth/me');
      return true; // Si aucune erreur, le token est valide
    } catch {
      return false; // Erreur réseau = token invalide
    }
  },

  getCurrentUser: async (): Promise<UserMock | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data;
      return { ...user, id: user.id_user || user.id };
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser'); // Remove for security
  },

  updateProfile: async (profileData: any /* UserMock part */, avatarFile?: File): Promise<UserMock> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      let payload: any;
      let headers: Record<string, string> = {};

      if (avatarFile) {
        payload = new FormData();
        Object.keys(profileData).forEach(key => {
          if (profileData[key] !== undefined && profileData[key] !== null) {
            payload.append(key, profileData[key]);
          }
        });
        payload.append('avatarFile', avatarFile);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        payload = profileData;
      }

      const response = await apiClient.put('/auth/profile', payload, { headers });
      const user = response.data;
      return { ...user, id: user.id_user || user.id };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      await apiClient.put('/auth/change-password', { currentPassword, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send reset email');
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reset password');
    }
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