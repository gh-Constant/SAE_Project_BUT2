import { USERS, Role } from '@/mocks/users';
import { COMMANDES, EtatCommande } from '@/mocks/commande';
import { USER_QUESTS } from '@/mocks/userQuests';
import { UserQuestStatus } from '@/types/quest';

export interface UserStatistics {
  totalUsers: number;
  payingUsers: number;
  verifiedUsers: number;
  activeUsers: number;
  totalOrders: number;
  avgLevel: number;
  totalXP: number;
  totalGold: number;
  newUsersThisMonth: number;
}

export interface DistributionItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface LevelBucket {
  range: string;
  count: number;
  percentage: number;
}

export interface RegistrationBucket {
  month: string;
  count: number;
}

export interface UserRow {
  id: number;
  name: string;
  role: string;
  level: number;
  xp: number;
  gold: number;
  isVerified: boolean;
  totalOrders: number;
  completedQuests: number;
  totalSpent: number;
  activityScore: number;
  percentage: number;
}

export interface UserStatisticsData {
  stats: UserStatistics;
  roleDistribution: DistributionItem[];
  verificationDistribution: DistributionItem[];
  topUsers: UserRow[];
  userStats: UserRow[];
  levelBuckets: LevelBucket[];
  registrationBuckets: RegistrationBucket[];
}

const PAID_STATUSES = new Set([EtatCommande.PAID, EtatCommande.COLLECTED]);

function getPseudoCreatedAt(userId: number): Date {
  const base = new Date();
  base.setMonth(base.getMonth() - 5);
  base.setDate(1);
  base.setHours(0, 0, 0, 0);
  const offsetDays = (userId * 9) % 170;
  const createdAt = new Date(base);
  createdAt.setDate(createdAt.getDate() + offsetDays);
  return createdAt;
}

export const userStatisticMockService = {
  async getStatistics(): Promise<UserStatisticsData> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const rowsBase = USERS.filter(user => user.role !== Role.ADMIN_ROLE_ID).map(user => {
      const userOrders = COMMANDES.filter(
        order => order.id_user === user.id && PAID_STATUSES.has(order.etat_commande)
      );
      const completedQuests = USER_QUESTS.filter(
        quest => quest.id_user === user.id && quest.status === UserQuestStatus.COMPLETED
      ).length;
      const totalSpent = userOrders.reduce((sum, order) => sum + order.total_price, 0);

      const activityScore =
        userOrders.length * 2 +
        completedQuests * 3 +
        user.level +
        user.xp / 100 +
        totalSpent / 50;

      return {
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
        role: user.role,
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        isVerified: user.is_verified,
        totalOrders: userOrders.length,
        completedQuests,
        totalSpent: Number(totalSpent.toFixed(2)),
        activityScore: Number(activityScore.toFixed(2)),
        createdAt: getPseudoCreatedAt(user.id),
      };
    });

    const totalUsers = rowsBase.length;
    const payingUsers = rowsBase.filter(row => row.totalOrders > 0).length;
    const verifiedUsers = rowsBase.filter(row => row.isVerified).length;
    const activeUsers = rowsBase.filter(row => row.totalOrders > 0 || row.completedQuests > 0).length;
    const totalOrders = rowsBase.reduce((sum, row) => sum + row.totalOrders, 0);
    const totalXP = rowsBase.reduce((sum, row) => sum + row.xp, 0);
    const totalGold = rowsBase.reduce((sum, row) => sum + row.gold, 0);
    const avgLevel = totalUsers > 0
      ? Number((rowsBase.reduce((sum, row) => sum + row.level, 0) / totalUsers).toFixed(1))
      : 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = rowsBase.filter(row => row.createdAt >= startOfMonth).length;

    const maxActivity = Math.max(...rowsBase.map(row => row.activityScore), 1);
    const userStats: UserRow[] = [...rowsBase]
      .sort((a, b) => b.activityScore - a.activityScore)
      .map(row => ({
        id: row.id,
        name: row.name,
        role: row.role,
        level: row.level,
        xp: row.xp,
        gold: row.gold,
        isVerified: row.isVerified,
        totalOrders: row.totalOrders,
        completedQuests: row.completedQuests,
        totalSpent: row.totalSpent,
        activityScore: row.activityScore,
        percentage: Math.round((row.activityScore / maxActivity) * 100),
      }));

    const topUsers = userStats.slice(0, 8);

    const roleColors: Record<string, string> = {
      [Role.AVENTURIER_ROLE_ID]: '#d97706',
      [Role.PRESTATAIRE_ROLE_ID]: '#3b82f6',
      [Role.ADMIN_ROLE_ID]: '#10b981',
    };

    const roleOrder = [Role.AVENTURIER_ROLE_ID, Role.PRESTATAIRE_ROLE_ID, Role.ADMIN_ROLE_ID];
    const roleDistribution: DistributionItem[] = roleOrder
      .map(role => {
        const count = rowsBase.filter(row => row.role === role).length;
        return {
          label: role,
          count,
          percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
          color: roleColors[role],
        };
      })
      .filter(item => item.count > 0);

    const verificationDistribution: DistributionItem[] = [
      {
        label: 'verified',
        count: verifiedUsers,
        percentage: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
        color: '#10b981',
      },
      {
        label: 'unverified',
        count: totalUsers - verifiedUsers,
        percentage: totalUsers > 0 ? Math.round(((totalUsers - verifiedUsers) / totalUsers) * 100) : 0,
        color: '#f59e0b',
      },
    ].filter(item => item.count > 0);

    const levelBucketsRaw = [
      { range: '1-5', min: 1, max: 5 },
      { range: '6-10', min: 6, max: 10 },
      { range: '11-20', min: 11, max: 20 },
      { range: '21-50', min: 21, max: 50 },
      { range: '51+', min: 51, max: Number.POSITIVE_INFINITY },
    ];

    const levelBuckets: LevelBucket[] = levelBucketsRaw.map(bucket => {
      const count = rowsBase.filter(row => row.level >= bucket.min && row.level <= bucket.max).length;
      return {
        range: bucket.range,
        count,
        percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
      };
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const registrationBuckets: RegistrationBucket[] = new Array(6).fill(0).map((_, index) => {
      const monthDate = new Date(sixMonthsAgo);
      monthDate.setMonth(monthDate.getMonth() + index);
      return {
        month: monthDate.toLocaleString('default', { month: 'short' }),
        count: 0,
      };
    });

    rowsBase.forEach(row => {
      const monthIndex =
        (row.createdAt.getFullYear() - sixMonthsAgo.getFullYear()) * 12 +
        (row.createdAt.getMonth() - sixMonthsAgo.getMonth());

      if (monthIndex >= 0 && monthIndex < registrationBuckets.length) {
        registrationBuckets[monthIndex].count += 1;
      }
    });

    return {
      stats: {
        totalUsers,
        payingUsers,
        verifiedUsers,
        activeUsers,
        totalOrders,
        avgLevel,
        totalXP,
        totalGold,
        newUsersThisMonth,
      },
      roleDistribution,
      verificationDistribution,
      topUsers,
      userStats,
      levelBuckets,
      registrationBuckets,
    };
  },
};
