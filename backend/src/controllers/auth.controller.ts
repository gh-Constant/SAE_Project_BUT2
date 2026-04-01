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
import { login, register, changePassword as changePasswordService } from '../services/authService.js';
import prisma from '../prisma.js';
import { buildPublicUploadUrl } from './upload.controller.js';

// Interface pour les requêtes authentifiées avec les infos utilisateur
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email?: string;
    role?: string;
  };
}

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
      const { firstName, lastName, email, password, role, prestataireTypeId } = req.body;
      let { avatarUrl, avatarType } = req.body;
      
      if (req.file) {
        avatarUrl = buildPublicUploadUrl(req, req.file.filename);
        avatarType = 'upload';
      }

      const user = await register(firstName, lastName, email, password, role, avatarUrl, avatarType, prestataireTypeId ? parseInt(prestataireTypeId.toString(), 10) : undefined);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
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
          bio: true,
          profile: {
            select: {
              xp: true,
              level: true
            }
          },
          prestataire: {
            select: {
              id_prestataire_type: true
            }
          }
        }
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        ...user,
        xp: user.profile?.xp ?? null,
        level: user.profile?.level ?? null,
        id_prestataire_type: user.prestataire?.id_prestataire_type ?? null
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async getMyRole(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
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
      const userId = (req as AuthenticatedRequest).user.id;
      const { firstname, lastname, email, prestataireTypeId, birthDate, phone, bio } = req.body;
      let { avatarUrl, avatarType } = req.body;

      if (req.file) {
        avatarUrl = buildPublicUploadUrl(req, req.file.filename);
        avatarType = 'upload';
      }
      
      // Parse prestataireTypeId safely if it's coming from FormData as a string
      const parsedPrestataireTypeId = prestataireTypeId ? parseInt(prestataireTypeId.toString(), 10) : undefined;

      const existingUser = await prisma.user.findUnique({
        where: { id_user: userId },
        include: {
          prestataire: true
        }
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

      const updateData: Record<string, string | number | Date | null> = {};
      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (email !== undefined) updateData.email = email;
      if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl || null;
      if (avatarType !== undefined) updateData.avatar_type = avatarType || null;
      if (birthDate !== undefined) updateData.birth_date = birthDate ? new Date(birthDate) : null;
      if (phone !== undefined) updateData.phone = phone || null;
      if (bio !== undefined) updateData.bio = bio || null;

      if (parsedPrestataireTypeId !== undefined && parsedPrestataireTypeId !== null) {
        const prestataireType = await prisma.prestataireType.findUnique({
          where: { id_prestataire_type: parsedPrestataireTypeId }
        });
        if (!prestataireType) {
          res.status(400).json({ error: 'Invalid prestataire type' });
          return;
        }
      }

      if (updateData.firstname !== undefined && !(updateData.firstname as string).trim()) {
        res.status(400).json({ error: 'Firstname cannot be empty' });
        return;
      }

      if (updateData.lastname !== undefined && !(updateData.lastname as string).trim()) {
        res.status(400).json({ error: 'Lastname cannot be empty' });
        return;
      }

      const updatedUser = await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id_user: userId },
          data: updateData,
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
            bio: true,
            created_at: true,
            updated_at: true,
            profile: {
              select: {
                xp: true,
                level: true
              }
            },
            prestataire: {
              select: {
                id_prestataire_type: true
              }
            }
          }
        });

        if (parsedPrestataireTypeId !== undefined) {
          if (parsedPrestataireTypeId === null) {
            await tx.prestataire.deleteMany({ where: { id_user: userId } });
          } else {
            await tx.prestataire.upsert({
              where: { id_user: userId },
              create: {
                id_user: userId,
                id_prestataire_type: parsedPrestataireTypeId
              },
              update: {
                id_prestataire_type: parsedPrestataireTypeId
              }
            });
          }
        }

        return tx.user.findUnique({
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
            bio: true,
            created_at: true,
            updated_at: true,
            profile: {
              select: {
                xp: true,
                level: true
              }
            },
            prestataire: {
              select: {
                id_prestataire_type: true
              }
            }
          }
        });
      });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        ...updatedUser,
        xp: updatedUser.profile?.xp ?? null,
        level: updatedUser.profile?.level ?? null,
        id_prestataire_type: updatedUser.prestataire?.id_prestataire_type ?? null
      });
    } catch (error) {
      const prismaError = error as { code?: string; message?: string };
      if (prismaError.code === 'P2002') {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      res.status(500).json({ error: prismaError.message || 'Failed to update profile' });
    }
  }
  ,

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Both current and new passwords are required' });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'New password must be at least 6 characters long' });
        return;
      }

      await changePasswordService(userId, currentPassword, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) {
        res.json({ message: 'If the email exists, a reset link has been sent' });
        return;
      }

      const crypto = await import('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000);
      await prisma.user.update({
        where: { id_user: user.id_user },
        data: {
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry
        }
      });

      const { emailService } = await import('../services/emailService.js');
      await emailService.sendPasswordResetEmail(email, resetToken);

      res.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to process password reset request' });
    }
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({ error: 'Token and new password are required' });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { reset_token: token }
      });

      if (!user || !user.reset_token_expiry) {
        res.status(400).json({ error: 'Invalid or expired reset token' });
        return;
      }

      if (new Date() > user.reset_token_expiry) {
        res.status(400).json({ error: 'Reset token has expired' });
        return;
      }
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id_user: user.id_user },
        data: {
          password_hashed: hashedPassword,
          reset_token: null,
          reset_token_expiry: null
        }
      });

      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }
};
