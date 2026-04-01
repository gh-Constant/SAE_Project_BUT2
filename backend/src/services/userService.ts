
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  /**
   * Récupère tous les utilisateurs
   */
  getAllUsers: async () => {
    return await prisma.user.findMany({
      where: {
        role: {
          not: 'admin'
        }
      },
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
      where: {
        role: 'aventurier'
      },
      skip,
      take: limit,
      orderBy: [
        { profile: { level: 'desc' } },
        { profile: { xp: 'desc' } }
      ],
      select: {
        id_user: true,
        firstname: true,
        lastname: true,
        email: true, // Peut-être masquer l'email pour le public ? on le garde pour l'instant
        role: true,
        avatar_url: true,
        avatar_type: true,
        bio: true,
        gold: true,
        profile: {
          select: {
            xp: true,
            level: true
          }
        }
      }
    });

    // Compter le nombre total d'utilisateurs pour la pagination
    const total = await prisma.user.count({
      where: {
        role: 'aventurier'
      }
    });

    // Calculer le rang pour chaque utilisateur retourné
    // Le rang d'un utilisateur est : (nombre de gens meilleurs qu'eux) + 1
    // Pour la page 1, c'est index + 1
    // Pour la page 2, c'est skip + index + 1
    // C'est une approximation valide si le tri est stable et consistent avec la pagination
    const usersWithRank = users.map((user, index) => ({
      ...user,
      xp: user.profile?.xp ?? 0,
      level: user.profile?.level ?? 0,
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
      select: {
        role: true,
        profile: {
          select: {
            level: true,
            xp: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'aventurier') {
      throw new Error('Only adventurers are ranked');
    }

    if (!user.profile || user.profile.level === null || user.profile.xp === null) {
      throw new Error('Adventurer progression data is missing');
    }

    const userLevel = user.profile.level;
    const userXp = user.profile.xp;

    // Compter combien de personnes ont un meilleur score (Level > ou Level = mais XP >)
    const betterPlayersCount = await prisma.user.count({
      where: {
        role: 'aventurier',
        profile: {
          is: {
            OR: [
              { level: { gt: userLevel } },
              {
                AND: [
                  { level: userLevel },
                  { xp: { gt: userXp } }
                ]
              }
            ]
          }
        }
      }
    });

    return betterPlayersCount + 1;
  }
};
