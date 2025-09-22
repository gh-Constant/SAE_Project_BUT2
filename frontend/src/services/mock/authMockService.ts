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

import { USERS, UserMock } from '@/mocks';

export const authMockService = {

  // Fonction login en mode mock

  login(email : string, password : string) {
    return new Promise((resolve, reject) => {
      // Cherche l'utilisateur correspondant dans le tableau USERS exporté de users.ts défini dans /mocks
      const user = USERS.find(u => u.email === email && u.password_hashed === password);
      if (user) resolve(user); // Si trouvé, on retourne l'utilisateur
      else reject(new Error('Identifiants incorrects')); // Sinon on renvoie une erreur
    });
  },

  // Fonction register en mode mock

  register(firstName: string, lastName: string, email: string, password: string, role: string) {
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
        email,
        password_hashed: password,  // Ici le mot de passe n’est pas hashé, juste pour le mock
        roleId: role === 'adventurer' ? 1 : 2, // Assigne un rôle par défaut selon le type (1: aventurier 2: artisan) (Le 3 n'est pas present car on ne peut pas s'enregistrer en tant qu'admin directement)
        role: { id: role === 'adventurer' ? 1 : 2, name: role },
        is_active: true,
        is_verified: false,
        xp: 0,
        level: 1,
      };
      USERS.push(newUser); // Ajoute l'utilisateur au tableau USERS
      resolve(newUser);    // Retourne le nouvel utilisateur
    });
  },
}