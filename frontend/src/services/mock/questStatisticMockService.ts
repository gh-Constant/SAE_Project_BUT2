import { QUESTS } from '@/mocks/quests';
import { LOCATIONS } from '@/mocks/locations';
import { USER_QUESTS } from '@/mocks/userQuests';
import { UserQuestStatus } from '@/types/quest';
import { USERS } from '@/mocks/users';

export interface QuestStatistics {
  // Hero stats
  totalQuests: number;
  totalXP: number;
  avgXP: number;
  locationsWithQuests: number;
  minXP: number;
  maxXP: number;
  // User engagement
  totalParticipants: number;
  completedQuestsCount: number;
  completionRate: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
  label: string;
}

export interface LocationDistribution {
  id: number;
  name: string;
  count: number;
  percentage: number;
  color: string; // For the chart
  label: string; // For ChartData compatibility
}


export interface TopQuest {
  id_quest: number;
  title: string;
  description: string;
  xp_reward: number;
  locationName: string;
}

export interface LocationStat {
  id: number;
  name: string;
  questCount: number;
  totalXP: number;
  avgXP: number;
  percentage: number;
}

export interface XpBucket {
  range: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string;
  questsCompleted: number;
  questsInProgress: number;
  totalXpEarned: number;
  level: number;
}

export interface QuestStatisticsData {
  stats: QuestStatistics;
  statusDistribution: StatusDistribution[];
  locationDistribution: LocationDistribution[];
  topQuests: TopQuest[];
  locationStats: LocationStat[];
  xpBuckets: XpBucket[];
  leaderboard: LeaderboardUser[];
}

// Helper to get location name
function getLocationName(locationId: number): string {
  const location = LOCATIONS.find(l => l.id === locationId);
  return location?.name || 'Lieu inconnu';
}

export const questStatisticMockService = {
  getStatistics: async (): Promise<QuestStatisticsData> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const quests = QUESTS;
    const userQuests = USER_QUESTS;
    
    // Calculate hero stats
    const totalQuests = quests.length;
    const totalXP = quests.reduce((sum, q) => sum + q.xp_reward, 0);
    const avgXP = totalQuests > 0 ? Math.round(totalXP / totalQuests) : 0;
    const minXP = totalQuests > 0 ? Math.min(...quests.map(q => q.xp_reward)) : 0;
    const maxXP = totalQuests > 0 ? Math.max(...quests.map(q => q.xp_reward)) : 0;
    
    const locationIds = new Set(quests.map(q => q.id_location));
    const locationsWithQuests = locationIds.size;
    
    // User engagement stats
    const uniqueUsers = new Set(userQuests.map(uq => uq.id_user));
    const totalParticipants = uniqueUsers.size;
    const completedQuests = userQuests.filter(uq => uq.status === UserQuestStatus.COMPLETED);
    const completedQuestsCount = completedQuests.length;
    const completionRate = userQuests.length > 0 ? Math.round((completedQuestsCount / userQuests.length) * 100) : 0;
    
    // Top quests by XP reward (real data)
    const topQuests: TopQuest[] = quests
      .map(q => ({
        id_quest: q.id_quest,
        title: q.title,
        description: q.description || '',
        xp_reward: q.xp_reward,
        locationName: getLocationName(q.id_location)
      }))
      .sort((a, b) => b.xp_reward - a.xp_reward)
      .slice(0, 5);
    
    // Location stats (real data)
    const locationQuestCounts = new Map<number, typeof QUESTS[0][]>();
    quests.forEach(q => {
      if (!locationQuestCounts.has(q.id_location)) {
        locationQuestCounts.set(q.id_location, []);
      }
      locationQuestCounts.get(q.id_location)!.push(q);
    });
    
    const maxQuestCount = Math.max(...Array.from(locationQuestCounts.values()).map(arr => arr.length), 1);
    
    const locationStats: LocationStat[] = Array.from(locationQuestCounts.entries())
      .map(([locId, locQuests]) => {
        const locTotalXP = locQuests.reduce((sum, q) => sum + q.xp_reward, 0);
        return {
          id: locId,
          name: getLocationName(locId),
          questCount: locQuests.length,
          totalXP: locTotalXP,
          avgXP: Math.round(locTotalXP / locQuests.length),
          percentage: Math.round((locQuests.length / maxQuestCount) * 100)
        };
      })
      .sort((a, b) => b.questCount - a.questCount);
    
    // XP distribution buckets (real data)
    const buckets: XpBucket[] = [
      { range: '1-25', min: 1, max: 25, count: 0, percentage: 0 },
      { range: '26-50', min: 26, max: 50, count: 0, percentage: 0 },
      { range: '51-100', min: 51, max: 100, count: 0, percentage: 0 },
      { range: '101-200', min: 101, max: 200, count: 0, percentage: 0 },
      { range: '200+', min: 201, max: Infinity, count: 0, percentage: 0 }
    ];
    
    quests.forEach(q => {
      const bucket = buckets.find(b => q.xp_reward >= b.min && q.xp_reward <= b.max);
      if (bucket) bucket.count++;
    });
    
    const maxBucketCount = Math.max(...buckets.map(b => b.count), 1);
    buckets.forEach(b => {
      b.percentage = Math.round((b.count / maxBucketCount) * 100);
    });
    
    // User Leaderboard
    const leaderboard: LeaderboardUser[] = USERS
      .map(user => {
        const userUserQuests = userQuests.filter(uq => uq.id_user === user.id);
        const completed = userUserQuests.filter(uq => uq.status === UserQuestStatus.COMPLETED);
        const inProgress = userUserQuests.filter(uq => uq.status === UserQuestStatus.ACCEPTED);
        
        // Calculate XP earned from completed quests
        const totalXpEarned = completed.reduce((sum, uq) => {
          const quest = quests.find(q => q.id_quest === uq.id_quest);
          return sum + (quest?.xp_reward || 0);
        }, 0);
        
        return {
          id: user.id,
          name: `${user.firstname} ${user.lastname}`,
          avatar: user.avatar_url || '/images/Avatar-images/default.png',
          questsCompleted: completed.length,
          questsInProgress: inProgress.length,
          totalXpEarned,
          level: user.level
        };
      })
      .filter(u => u.questsCompleted > 0 || u.questsInProgress > 0)
      .sort((a, b) => b.questsCompleted - a.questsCompleted || b.totalXpEarned - a.totalXpEarned);
    
    // Status Distribution
    const statusCounts = {
      [UserQuestStatus.COMPLETED]: userQuests.filter(uq => uq.status === UserQuestStatus.COMPLETED).length,
      [UserQuestStatus.ACCEPTED]: userQuests.filter(uq => uq.status === UserQuestStatus.ACCEPTED).length,
    };
    
    const totalUserQuests = userQuests.length;
    
    const statusDistribution: StatusDistribution[] = [
      { 
        status: UserQuestStatus.COMPLETED, 
        count: statusCounts[UserQuestStatus.COMPLETED], 
        percentage: Math.round((statusCounts[UserQuestStatus.COMPLETED] / totalUserQuests) * 100),
        color: '#10b981', // emerald-500
        label: 'Terminées'
      },
      { 
        status: UserQuestStatus.ACCEPTED, 
        count: statusCounts[UserQuestStatus.ACCEPTED], 
        percentage: Math.round((statusCounts[UserQuestStatus.ACCEPTED] / totalUserQuests) * 100),
        color: '#3b82f6', // blue-500
        label: 'En cours'
      }
    ].filter(s => s.count > 0);

    // Location Distribution for Chart (Top 5 + Others)
    const sortedLocations = [...locationStats].sort((a, b) => b.questCount - a.questCount);
    const topLocations = sortedLocations.slice(0, 5);
    const otherLocations = sortedLocations.slice(5);
    
    const locationColors = ['#d97706', '#b45309', '#92400e', '#78350f', '#451a03', '#A8A29E']; // Amber/Bronze shades + Grey
    
    const locationDistribution: LocationDistribution[] = topLocations.map((loc, index) => ({
      id: loc.id,
      name: loc.name,
      count: loc.questCount,
      percentage: Math.round((loc.questCount / totalQuests) * 100),
      color: locationColors[index % locationColors.length],
      label: loc.name
    }));
    
    if (otherLocations.length > 0) {
      const otherCount = otherLocations.reduce((sum, loc) => sum + loc.questCount, 0);
      locationDistribution.push({
        id: -1,
        name: 'Autres',
        count: otherCount,
        percentage: Math.round((otherCount / totalQuests) * 100),
        color: locationColors[5],
        label: 'Autres'
      });
    }

    return {
      stats: {
        totalQuests,
        totalXP,
        avgXP,
        locationsWithQuests,
        minXP,
        maxXP,
        totalParticipants,
        completedQuestsCount,
        completionRate
      },
      statusDistribution,
      locationDistribution,
      topQuests,
      locationStats,
      xpBuckets: buckets,
      leaderboard
    };
  }
};
