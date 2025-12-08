
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  /**
   * Récupère tous les utilisateurs
   */
  getAllUsers: async () => {
    return await prisma.user.findMany({
      select: {
        id_user: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        is_verified: true,
        avatar_url: true,
        avatar_type: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  },

  /**
   * Vérifie un utilisateur (met à jour is_verified = true)
   */
  verifyUser: async (userId: number) => {
    return await prisma.user.update({
      where: { id_user: userId },
      data: { is_verified: true }
    });
  },

  /**
   * Supprime un utilisateur
   */
  deleteUser: async (userId: number) => {
    return await prisma.user.delete({
      where: { id_user: userId }
    });
  }
};
