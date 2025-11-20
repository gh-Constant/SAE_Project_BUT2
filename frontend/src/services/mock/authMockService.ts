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

import { Role, USERS, UserMock, AvatarType } from '@/mocks';

export const authMockService = {

  // Fonction login en mode mock

  login(email : string, password : string) {
    return new Promise((resolve, reject) => {
      // Cherche l'utilisateur correspondant dans le tableau USERS exporté de users.ts défini dans /mocks
      let user = USERS.find(u => u.email === email && u.password_hashed === password);
      
      if (user) {
        // Vérifier si on a une version mise à jour dans localStorage
        const storedUserStr = localStorage.getItem('currentUser');
        if (storedUserStr) {
          try {
            const storedUser = JSON.parse(storedUserStr) as UserMock;
            // Si c'est le même utilisateur (même ID et email), utiliser la version stockée
            if (storedUser.id === user.id && storedUser.email === user.email) {
              user = storedUser;
            }
          } catch (e) {
            // Si erreur de parsing, utiliser l'utilisateur du tableau USERS
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
      // Vérifie si l'email existe déjà
      const existingUser = USERS.find(u => u.email === email);
      if (existingUser) {
        reject(new Error('Email already exists')); // Empêche la création de doublons
        return; // Sortie aprés rejet
      }
      // Puisque le return n'a pas été fait, création d'un nouvel utilisateur mock
      const newUser: UserMock = {
        id: USERS.length + 1, // ID auto-incrémenté (fait à la va vite pour mock).
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
      };
      USERS.push(newUser); // Ajoute l'utilisateur au tableau USERS
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
        const userIndex = USERS.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        // Vérifier l'unicité de l'email si modifié
        if (profileData.email && profileData.email !== currentUser.email) {
          const emailExists = USERS.find(u => u.email === profileData.email && u.id !== currentUser.id);
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
          ...USERS[userIndex],
          ...(profileData.firstname !== undefined && { firstname: profileData.firstname }),
          ...(profileData.lastname !== undefined && { lastname: profileData.lastname }),
          ...(profileData.email !== undefined && { email: profileData.email }),
          ...(profileData.avatar_url !== undefined && { avatarUrl: profileData.avatar_url || undefined }),
          ...(profileData.avatar_type !== undefined && { avatarType: profileData.avatar_type || undefined }),
          ...(profileData.birth_date !== undefined && { birthDate: profileData.birth_date || undefined }),
          ...(profileData.phone !== undefined && { phone: profileData.phone || undefined }),
          ...(profileData.bio !== undefined && { bio: profileData.bio || undefined }),
          // Gérer les champs professionnels (camelCase depuis le formulaire)
          ...((profileData as any).website !== undefined && { 
            website: (profileData as any).website || undefined 
          }),
          ...((profileData as any).experienceYears !== undefined && { 
            experience_years: (profileData as any).experienceYears || undefined 
          }),
          ...((profileData as any).specialties !== undefined && { 
            specialties: (profileData as any).specialties || undefined 
          }),
          ...((profileData as any).languages !== undefined && { 
            languages: (profileData as any).languages || undefined 
          }),
          ...((profileData as any).socialMedia !== undefined && { 
            social_media: (profileData as any).socialMedia || undefined 
          }),
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

        // Mettre à jour dans le tableau USERS
        USERS[userIndex] = updatedUser;

        // Mettre à jour localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        resolve(updatedUser);
      } catch (error) {
        reject(new Error('Failed to update profile'));
      }
    });
  },
}