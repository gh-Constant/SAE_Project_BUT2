/**
 * @file mock/authMockService.ts
 * @description
 * Service d'authentification en mode mock.
 * Simule les fonctions login et register avec des données fictives.
 *
 * @utilité
 * - Permet de tester la connexion et l'inscription sans serveur réel.
 * - Retourne des utilisateurs factices pour le développement.
 *
 * @exports
 * - authMockService : service mock utilisé par authServices.ts si le backend n'est pas disponible.
 *
 * @remarques
 * - Les mots de passe sont stockés en clair pour le mock (à ne jamais faire de base).
 * - La fonction register ajoute l'utilisateur au tableau USERS pour simuler une base de données mais le ne sera donc pas modifié sur le serveur.
 */

import { Role, UserMock, AvatarType } from '@/mocks';
import { mockUsers } from './sharedMockData';

export const authMockService = {

  // Fonction login en mode mock

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      // Cherche l'utilisateur correspondant dans le tableau mockUsers partagé
      let user = mockUsers.find(u => u.email === email && u.password_hashed === password);

      if (user) {
        // Vérifier si on a une version modifiée dans localStorage (persistante entre sessions)
        const modifiedUsersStr = localStorage.getItem('modifiedUsers');
        if (modifiedUsersStr) {
          try {
            const modifiedUsers = JSON.parse(modifiedUsersStr);
            if (modifiedUsers[user.id]) {
              user = modifiedUsers[user.id];
            }
          } catch (e) {
            console.warn('Error parsing modified users, using default:', e);
          }
        }

        // Sinon, vérifier si on a une version de la session actuelle dans localStorage
        const storedUserStr = localStorage.getItem('currentUser');
        if (storedUserStr && !modifiedUsersStr) {
          try {
            const storedUser = JSON.parse(storedUserStr) as UserMock;
            // Si c'est le même utilisateur (même ID et email), utiliser la version stockée
            if (storedUser.id === user.id && storedUser.email === user.email) {
              user = storedUser;
            }
          } catch (e) {
            console.warn('Error parsing stored user, using default:', e);
          }
        }

        resolve(user); // Si trouvé, on retourne l'utilisateur (mis à jour si disponible)
      } else {
        reject(new Error('Identifiants incorrects')); // Sinon on renvoie une erreur
      }
    });
  },

  // Fonction register en mode mock

  register(firstName: string, lastName: string, email: string, password: string, role: string, avatarUrl?: string, avatarType?: string) {
    return new Promise<UserMock>((resolve, reject) => {
      // Vérifie si l'email existe déjà dans mockUsers
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        reject(new Error('Email already exists')); // Empêche la création de doublons
        return; // Sortie aprés rejet
      }

      // Generate a unique ID that won't collide with hardcoded quest user IDs (2, 3, 5)
      // Strategy: start from ID 100 for new mock users to avoid collision with demo data
      const existingIds = mockUsers.map(u => u.id);
      const maxId = Math.max(...existingIds, 99); // Minimum 100
      const newId = maxId + 1;

      // Puisque le return n'a pas été fait, création d'un nouvel utilisateur mock
      const newUser: UserMock = {
        id: newId, // Use guaranteed unique ID
        firstname: firstName,
        lastname: lastName,
        birth_date: undefined,
        phone: undefined,
        bio: undefined,
        email,
        password_hashed: password,  // Ici le mot de passe n'est pas hashé, juste pour le mock
        role: role === 'aventurier' ? Role.AVENTURIER_ROLE_ID : Role.PRESTATAIRE_ROLE_ID,
        avatar_url: avatarUrl || undefined, // Ajout de l'avatar
        avatar_type: avatarType === 'gallery' ? AvatarType.GALLERY : AvatarType.UPLOAD || undefined, // Ajout du type d'avatar
        is_verified: false,
        xp: 0,
        level: 1,
        gold: 0, // Initialize gold to 0
      };

      mockUsers.push(newUser); // Ajoute l'utilisateur au tableau mockUsers partagé

      // CRITICAL: Clear quest data for this truly new user
      // This prevents inheriting quests from previous localStorage sessions
      const storedQuests = localStorage.getItem('mock_userQuests');
      if (storedQuests) {
        try {
          const parsed = JSON.parse(storedQuests);
          // Remove any quests that might exist for this new ID (shouldn't happen, but safety)
          const filtered = parsed.filter((uq: any) => uq.id_user !== newId);
          localStorage.setItem('mock_userQuests', JSON.stringify(filtered));
        } catch (e) {
          console.warn('Failed to clean quest data for new user:', e);
        }
      }

      // CRITICAL: Clear reservation data for this new user
      // RESERVATIONS array contains hardcoded data for id_user: 2
      // Import is mutable so we need to filter it
      const RESERVATIONS_KEY = 'mock_reservations';
      const storedReservations = localStorage.getItem(RESERVATIONS_KEY);
      if (storedReservations) {
        try {
          const parsed = JSON.parse(storedReservations);
          const filtered = parsed.filter((r: any) => r.id_user !== newId);
          localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(filtered));
        } catch (e) {
          console.warn('Failed to clean reservation data for new user:', e);
        }
      }

      resolve(newUser);    // Retourne le nouvel utilisateur
    });
  },

  // Fonction updateProfile en mode mock
  updateProfile(profileData: UserMock) {
    return new Promise<UserMock>((resolve, reject) => {
      // Récupérer l'utilisateur actuel depuis localStorage
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) {
        reject(new Error('Not authenticated'));
        return;
      }

      try {
        const currentUser = JSON.parse(currentUserStr) as UserMock;
        const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        // Vérifier l'unicité de l'email si modifié
        if (profileData.email && profileData.email !== currentUser.email) {
          const emailExists = mockUsers.find(u => u.email === profileData.email && u.id !== currentUser.id);
          if (emailExists) {
            reject(new Error('Email already in use'));
            return;
          }
        }

        // Valider le format email
        if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
          reject(new Error('Invalid email format'));
          return;
        }

        // Mettre à jour les champs fournis
        const updatedUser = {
          ...mockUsers[userIndex],
          ...(profileData.firstname !== undefined && { firstname: profileData.firstname }),
          ...(profileData.lastname !== undefined && { lastname: profileData.lastname }),
          ...(profileData.email !== undefined && { email: profileData.email }),
          ...(profileData.avatar_url !== undefined && { avatarUrl: profileData.avatar_url || undefined }),
          ...(profileData.avatar_type !== undefined && { avatarType: profileData.avatar_type || undefined }),
          ...(profileData.birth_date !== undefined && { birthDate: profileData.birth_date || undefined }),
          ...(profileData.phone !== undefined && { phone: profileData.phone || undefined }),
          ...(profileData.bio !== undefined && { bio: profileData.bio || undefined }),
        };

        // Valider que les champs requis ne sont pas vides
        if (updatedUser.firstname && !updatedUser.firstname.trim()) {
          reject(new Error('Firstname cannot be empty'));
          return;
        }

        if (updatedUser.lastname && !updatedUser.lastname.trim()) {
          reject(new Error('Lastname cannot be empty'));
          return;
        }

        // Mettre à jour dans le tableau mockUsers
        mockUsers[userIndex] = updatedUser;

        // Sauvegarder les utilisateurs modifiés dans localStorage pour persister entre sessions
        const modifiedUsers = JSON.parse(localStorage.getItem('modifiedUsers') || '{}');
        modifiedUsers[currentUser.id] = updatedUser;
        localStorage.setItem('modifiedUsers', JSON.stringify(modifiedUsers));

        // Mettre à jour localStorage pour la session actuelle
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        resolve(updatedUser);
      } catch (error) {
        reject(new Error('Failed to update profile'));
      }
    });
  },

  // Get current user from localStorage
  getCurrentUser(): Promise<UserMock | null> {
    return new Promise((resolve) => {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) {
        resolve(null);
        return;
      }

      try {
        const currentUser = JSON.parse(currentUserStr) as UserMock;
        resolve(currentUser);
      } catch (error) {
        console.warn('Error parsing current user from localStorage:', error);
        resolve(null);
      }
    });
  },
}