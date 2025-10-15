/**
 * @file auth.controller.ts
 * @description
 * Contrôleurs pour gérer l'authentification des utilisateurs.
 * Fournit des endpoints pour la connexion, l'inscription et la récupération des informations utilisateur.
 *
 * @utilité
 * - Gère la logique métier de l'authentification.
 * - Valide les données d'entrée et appelle les services appropriés.
 * - Retourne les réponses HTTP appropriées avec les données utilisateur ou les erreurs.
 *
 * @exports
 * - login : endpoint de connexion (/auth/login).
 * - register : endpoint d'inscription (/auth/register).
 * - getMe : endpoint pour récupérer les informations de l'utilisateur connecté (/auth/me).
 * - getMyRole : endpoint pour récupérer le rôle de l'utilisateur connecté (/auth/role).
 *
 * @remarques
 * - Utilise Prisma pour accéder à la base de données.
 * - Les endpoints getMe et getMyRole utilisent le middleware d'authentification.
 * - Les erreurs sont gérées et retournées avec des codes HTTP appropriés.
 */

import { Request, Response } from 'express';
import { login, register } from '../services/authService.js';
import prisma from '../prisma.js';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body; // Extraire les identifiants du corps de la requête
      const result = await login(email, password); // Appeler le service pour authentifier l'utilisateur
      res.json(result); // Retourner les données utilisateur et le token
    } catch (error) {
      res.status(401).json({ error: (error as Error).message }); // Retourner une erreur d'authentification
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, role, avatarUrl, avatarType } = req.body; // Extraire les données d'inscription
      const user = await register(firstName, lastName, email, password, role, avatarUrl, avatarType); // Créer un nouvel utilisateur
      res.status(201).json(user); // Retourner les données de l'utilisateur créé
    } catch (error) {
      res.status(400).json({ error: (error as Error).message }); // Retourner une erreur de validation
    }
  },


  async getMe(req: Request, res: Response): Promise<void> {
    try {
      // L'utilisateur est déjà authentifié par le middleware, req.user est disponible
      const userId = (req as any).user.id; // Obtenir l'ID utilisateur de la requête authentifiée
      const user = await prisma.user.findUnique({ // Récupérer l'utilisateur de la base de données
        where: { id: userId },
        select: { // Sélectionner uniquement les champs nécessaires pour la sécurité
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          roleId: true,
          avatarUrl: true,
          avatarType: true
        }
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' }); // Utilisateur non trouvé en BD
        return;
      }

      res.json(user); // Retourner les informations utilisateur
    } catch (error) {
      res.status(500).json({ error: (error as Error).message }); // Gérer les erreurs de base de données
    }
  },

  async getMyRole(req: Request, res: Response): Promise<void> {
    try {
      // L'utilisateur est déjà authentifié par le middleware
      const userId = (req as any).user.id; // Obtenir l'ID de l'utilisateur authentifié

      // Récupérer l'utilisateur avec les informations de rôle de la base de données
      const userWithRole = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true } // Inclure les données de rôle dans la requête
      });

      if (!userWithRole) {
        res.status(404).json({ error: 'User not found' }); // Utilisateur non trouvé
        return;
      }

      res.json(userWithRole.role); // Retourner les informations de rôle
    } catch (error) {
      res.status(500).json({ error: (error as Error).message }); // Gérer les erreurs de base de données
    }
  }
};