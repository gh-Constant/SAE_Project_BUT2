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
 * - updateMe : endpoint pour mettre à jour le profil de l'utilisateur connecté (/auth/profile).
 *
 * @remarques
 * - Utilise Prisma pour accéder à la base de données.
 * - Les endpoints getMe et getMyRole utilisent le middleware d'authentification.
 * - Les erreurs sont gérées et retournées avec des codes HTTP appropriés.
 */

import { Request, Response } from 'express';
import { login, register } from '../services/authService.js';
import prisma from '../prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

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
      const userId = (req as AuthenticatedRequest).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      const user = await prisma.user.findUnique({ // Récupérer l'utilisateur de la base de données
        where: { id: userId },
        select: { // Sélectionner uniquement les champs nécessaires pour la sécurité
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          roleId: true,
          avatarUrl: true,
          avatarType: true,
          birthDate: true,
          phone: true,
          bio: true
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
      const userId = (req as AuthenticatedRequest).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

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
  },

  async updateMe(req: Request, res: Response): Promise<void> {
    try {
      // L'utilisateur est déjà authentifié par le middleware
      const userId = (req as AuthenticatedRequest).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      
      // Extraire les données à mettre à jour du corps de la requête
      const { 
        firstname, 
        lastname, 
        email, 
        avatarUrl, 
        avatarType, 
        prestataireTypeId,
        birthDate,
        phone,
        bio
      } = req.body;

      // Vérifier que l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        res.status(404).json({ error: 'User not found' }); // Utilisateur non trouvé
        return;
      }

      // Valider l'unicité de l'email si modifié
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email }
        });

        if (emailExists) {
          res.status(400).json({ error: 'Email already in use' }); // Email déjà utilisé
          return;
        }
      }

      // Valider le format de l'email si fourni
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ error: 'Invalid email format' }); // Format d'email invalide
        return;
      }

      // Valider la date de naissance si fournie
      if (birthDate) {
        const birthDateObj = new Date(birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate()) ? age - 1 : age;
        
        if (isNaN(birthDateObj.getTime())) {
          res.status(400).json({ error: 'Invalid birth date format' });
          return;
        }
        
        if (actualAge < 15) {
          res.status(400).json({ error: 'User must be at least 15 years old' });
          return;
        }
        
        if (birthDateObj > today) {
          res.status(400).json({ error: 'Birth date cannot be in the future' });
          return;
        }
      }

      // Valider la longueur de la bio si fournie
      if (bio !== undefined && bio !== null && bio.trim().length > 500) {
        res.status(400).json({ error: 'Bio must not exceed 500 characters' });
        return;
      }

      // Préparer les données à mettre à jour (seulement les champs fournis et autorisés)
      const updateData: {
        firstname?: string;
        lastname?: string;
        email?: string;
        avatarUrl?: string | null;
        avatarType?: string | null;
        prestataireTypeId?: number | null;
        birthDate?: Date | null;
        phone?: string | null;
        bio?: string | null;
      } = {};

      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (email !== undefined) updateData.email = email;
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl || null;
      if (avatarType !== undefined) updateData.avatarType = avatarType || null;
      if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
      if (phone !== undefined) updateData.phone = phone || null;
      if (bio !== undefined) updateData.bio = bio || null;
      
      if (prestataireTypeId !== undefined) {
        // Valider que le prestataireTypeId existe si fourni
        if (prestataireTypeId !== null) {
          const prestataireType = await prisma.prestataireType.findUnique({
            where: { id: prestataireTypeId }
          });
          if (!prestataireType) {
            res.status(400).json({ error: 'Invalid prestataire type' }); // Type prestataire invalide
            return;
          }
        }
        updateData.prestataireTypeId = prestataireTypeId;
      }

      // Valider que les champs requis ne sont pas vides
      if (updateData.firstname !== undefined && !updateData.firstname.trim()) {
        res.status(400).json({ error: 'Firstname cannot be empty' });
        return;
      }

      if (updateData.lastname !== undefined && !updateData.lastname.trim()) {
        res.status(400).json({ error: 'Lastname cannot be empty' });
        return;
      }

      // Mettre à jour l'utilisateur dans la base de données
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: { // Sélectionner uniquement les champs nécessaires pour la sécurité
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          roleId: true,
          prestataireTypeId: true,
          avatarUrl: true,
          avatarType: true,
          birthDate: true,
          phone: true,
          bio: true,
          xp: true,
          level: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.json(updatedUser); // Retourner l'utilisateur mis à jour
    } catch (error) {
      // Gérer les erreurs Prisma spécifiques
      const prismaError = error as { code?: string; message?: string };
      if (prismaError.code === 'P2002') {
        // Erreur d'unicité Prisma
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      
      // Gérer les autres erreurs
      res.status(500).json({ error: prismaError.message || 'Failed to update profile' });
    }
  }
};