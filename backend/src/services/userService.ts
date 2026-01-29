
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

  deleteUser: async (userId: number) => {
    return await prisma.user.delete({
      where: { id_user: userId }
    });
  },

  /**
   * Récupère le classement global (Leaderboard) avec pagination
   */
  getLeaderboard: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    
    // Récupérer les utilisateurs triés
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: [
        { level: 'desc' },
        { xp: 'desc' }
      ],
      select: {
        id_user: true,
        firstname: true,
        lastname: true,
        email: true, // Peut-être masquer l'email pour le public ? on le garde pour l'instant
        role: true,
        avatar_url: true,
        avatar_type: true,
        xp: true,
        level: true,
        bio: true,
        gold: true
      }
    });

    // Compter le nombre total d'utilisateurs pour la pagination
    const total = await prisma.user.count();

    // Calculer le rang pour chaque utilisateur retourné
    // Le rang d'un utilisateur est : (nombre de gens meilleurs qu'eux) + 1
    // Pour la page 1, c'est index + 1
    // Pour la page 2, c'est skip + index + 1
    // C'est une approximation valide si le tri est stable et consistent avec la pagination
    const usersWithRank = users.map((user, index) => ({
      ...user,
      id: user.id_user, // Frontend expects 'id'
      rank: skip + index + 1
    }));

    return {
      users: usersWithRank,
      total,
      page,
      limit
    };
  },

  /**
   * Récupère le rang d'un utilisateur spécifique
   */
  getUserRank: async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id_user: userId },
      select: { level: true, xp: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Compter combien de personnes ont un meilleur score (Level > ou Level = mais XP >)
    const betterPlayersCount = await prisma.user.count({
      where: {
        OR: [
          { level: { gt: user.level } },
          { 
            AND: {
               level: user.level,
               xp: { gt: user.xp }
            }
          }
        ]
      }
    });

    return betterPlayersCount + 1;
  }
};
