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

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, role, avatarUrl, avatarType } = req.body;
      const user = await register(firstName, lastName, email, password, role, avatarUrl, avatarType);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await prisma.user.findUnique({
        where: { id_user: userId },
        select: {
          id_user: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          avatar_url: true,
          avatar_type: true,
          birth_date: true,
          phone: true,
          bio: true
        }
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async getMyRole(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const userWithRole = await prisma.user.findUnique({
        where: { id_user: userId },
        select: { role: true }
      });

      if (!userWithRole) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ role: userWithRole.role });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async updateMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { firstname, lastname, email, avatarUrl, avatarType, prestataireTypeId, birthDate, phone, bio } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { id_user: userId }
      });

      if (!existingUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({ where: { email } });
        if (emailExists) {
          res.status(400).json({ error: 'Email already in use' });
          return;
        }
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

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

      if (bio !== undefined && bio !== null && bio.trim().length > 500) {
        res.status(400).json({ error: 'Bio must not exceed 500 characters' });
        return;
      }

      const updateData: any = {};
      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (email !== undefined) updateData.email = email;
      if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl || null;
      if (avatarType !== undefined) updateData.avatar_type = avatarType || null;
      if (birthDate !== undefined) updateData.birth_date = birthDate ? new Date(birthDate) : null;
      if (phone !== undefined) updateData.phone = phone || null;
      if (bio !== undefined) updateData.bio = bio || null;
      
      if (prestataireTypeId !== undefined) {
        if (prestataireTypeId !== null) {
          const prestataireType = await prisma.prestataireType.findUnique({
            where: { id_prestataire_type: prestataireTypeId }
          });
          if (!prestataireType) {
            res.status(400).json({ error: 'Invalid prestataire type' });
            return;
          }
        }
        updateData.id_prestataire_type = prestataireTypeId;
      }

      if (updateData.firstname !== undefined && !updateData.firstname.trim()) {
        res.status(400).json({ error: 'Firstname cannot be empty' });
        return;
      }

      if (updateData.lastname !== undefined && !updateData.lastname.trim()) {
        res.status(400).json({ error: 'Lastname cannot be empty' });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id_user: userId },
        data: updateData,
        select: {
          id_user: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          id_prestataire_type: true,
          avatar_url: true,
          avatar_type: true,
          birth_date: true,
          phone: true,
          bio: true,
          xp: true,
          level: true,
          created_at: true,
          updated_at: true
        }
      });

      res.json(updatedUser);
    } catch (error) {
      const prismaError = error as { code?: string; message?: string };
      if (prismaError.code === 'P2002') {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      res.status(500).json({ error: prismaError.message || 'Failed to update profile' });
    }
  }
};