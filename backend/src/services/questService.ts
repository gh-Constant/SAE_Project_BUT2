import { PrismaClient, UserQuestStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateQuestData {
  title: string;
  description: string;
  xp_reward: number;
  id_location: number;
}

/**
 * Create a new quest for a location
 */
export const createQuest = async (data: CreateQuestData) => {
  return await prisma.quest.create({
    data: {
      title: data.title,
      description: data.description,
      xp_reward: data.xp_reward,
      id_location: data.id_location,
    },
  });
};

/**
 * Get all quests for a specific location
 */
export const getQuestsByLocation = async (locationId: number) => {
  return await prisma.quest.findMany({
    where: {
      id_location: locationId,
    },
    include: {
      userQuests: true // To check if user already accepted it (filtering can be done in controller if needed, or by second query)
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

/**
 * Get all quests for a specific user (accepted/completed)
 */
export const getUserQuests = async (userId: number) => {
  return await prisma.userQuest.findMany({
    where: {
      id_user: userId,
    },
    include: {
      quest: {
        include: {
          location: true
        }
      }
    },
    orderBy: {
      updated_at: 'desc',
    },
  });
};

/**
 * User accepts a quest
 * Note: Prestataires cannot accept quests - they can only create them
 */
export const acceptQuest = async (userId: number, questId: number) => {
  // Check if user is a prestataire - they cannot accept quests
  const user = await prisma.user.findUnique({
    where: { id_user: userId },
    select: { role: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'prestataire') {
    throw new Error('Prestataires cannot accept quests. They can only create quests for their locations.');
  }

  return await prisma.userQuest.create({
    data: {
      id_user: userId,
      id_quest: questId,
      status: UserQuestStatus.accepted,
    },
  });
};

/**
 * Complete a quest (Debug/Logic)
 */
export const completeQuest = async (userId: number, questId: number) => {
  return await prisma.userQuest.update({
    where: {
      id_user_id_quest: {
        id_user: userId,
        id_quest: questId,
      },
    },
    data: {
      status: UserQuestStatus.completed,
    },
  });
};

/**
 * Cancel/Abandon a quest - removes it from user's list
 */
export const cancelQuest = async (userId: number, questId: number) => {
  return await prisma.userQuest.delete({
    where: {
      id_user_id_quest: {
        id_user: userId,
        id_quest: questId,
      },
    },
  });
};

/**
 * Get single quest by ID
 */
export const getQuestById = async (questId: number) => {
  return await prisma.quest.findUnique({
    where: {
      id_quest: questId
    }
  });
};

/**
 * Get all quests from all locations (admin)
 */
export const getAllQuests = async () => {
  return await prisma.quest.findMany({
    include: {
      location: true,
      userQuests: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};

/**
 * Update an existing quest
 */
export const updateQuest = async (questId: number, data: Partial<CreateQuestData>) => {
  return await prisma.quest.update({
    where: {
      id_quest: questId
    },
    data
  });
};

/**
 * Delete a quest
 */
export const deleteQuest = async (questId: number) => {
  // First delete related userQuests
  await prisma.userQuest.deleteMany({
    where: {
      id_quest: questId
    }
  });
  
  return await prisma.quest.delete({
    where: {
      id_quest: questId
    }
  });
};

/**
 * Get quest statistics for admin dashboard
 */
export const getQuestStatistics = async () => {
  // Get all quests with their locations and user participations
  const quests = await prisma.quest.findMany({
    include: {
      location: true,
      userQuests: true
    }
  });

  // Get all user quests for engagement stats
  const userQuests = await prisma.userQuest.findMany();
  
  // Calculate hero stats
  const totalQuests = quests.length;
  const totalXP = quests.reduce((sum, q) => sum + (q.xp_reward || 0), 0);
  const avgXP = totalQuests > 0 ? Math.round(totalXP / totalQuests) : 0;
  const locationsWithQuests = new Set(quests.map(q => q.id_location)).size;
  
  // User engagement
  const completedUserQuests = userQuests.filter(uq => uq.status === 'completed');
  const inProgressUserQuests = userQuests.filter(uq => uq.status === 'accepted');
  const uniqueUsers = new Set(userQuests.map(uq => uq.id_user));
  
  const totalParticipants = uniqueUsers.size;
  const questsInProgress = inProgressUserQuests.length;
  const completedQuests = completedUserQuests.length;
  const totalUserQuestsCount = userQuests.length;
  const completionRate = totalUserQuestsCount > 0 ? Math.round((completedQuests / totalUserQuestsCount) * 100) : 0;
  
  // XP given from completed quests
  const xpGiven = completedUserQuests.reduce((sum, uq) => {
    const quest = quests.find(q => q.id_quest === uq.id_quest);
    return sum + (quest?.xp_reward || 0);
  }, 0);
  const xpGivenToday = Math.floor(xpGiven * 0.15); // Simulated daily portion
  
  const avgQuestsPerUser = totalParticipants > 0 ? (totalUserQuestsCount / totalParticipants).toFixed(1) : '0';
  
  // Top quests by participation
  const questParticipation = new Map<number, number>();
  userQuests.forEach(uq => {
    questParticipation.set(uq.id_quest, (questParticipation.get(uq.id_quest) || 0) + 1);
  });
  
  const topQuests = quests
    .map(q => ({
      id_quest: q.id_quest,
      title: q.title,
      description: q.description || '',
      xp_reward: q.xp_reward || 0,
      locationName: q.location?.name || 'Unknown',
      participantCount: questParticipation.get(q.id_quest) || 0
    }))
    .sort((a, b) => b.participantCount - a.participantCount)
    .slice(0, 5);
  
  // Location stats
  const locationQuestMap = new Map<number, typeof quests>();
  quests.forEach(q => {
    if (!locationQuestMap.has(q.id_location)) {
      locationQuestMap.set(q.id_location, []);
    }
    locationQuestMap.get(q.id_location)!.push(q);
  });
  
  const maxQuestCount = Math.max(...Array.from(locationQuestMap.values()).map(arr => arr.length), 1);
  
  const locationStats = Array.from(locationQuestMap.entries())
    .map(([locId, locQuests]) => {
      const locUserQuests = userQuests.filter(uq => locQuests.some(q => q.id_quest === uq.id_quest));
      const locCompletedQuests = locUserQuests.filter(uq => uq.status === 'completed');
      const locParticipants = new Set(locUserQuests.map(uq => uq.id_user)).size;
      
      return {
        id: locId,
        name: locQuests[0]?.location?.name || 'Unknown',
        questCount: locQuests.length,
        totalXP: locQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0),
        participants: locParticipants,
        completionRate: locUserQuests.length > 0 ? Math.round((locCompletedQuests.length / locUserQuests.length) * 100) : 0,
        percentage: Math.round((locQuests.length / maxQuestCount) * 100)
      };
    })
    .sort((a, b) => b.questCount - a.questCount);
  
  // XP distribution buckets
  const xpBuckets = [
    { range: '1-25', min: 1, max: 25, count: 0, percentage: 0 },
    { range: '26-50', min: 26, max: 50, count: 0, percentage: 0 },
    { range: '51-100', min: 51, max: 100, count: 0, percentage: 0 },
    { range: '101-200', min: 101, max: 200, count: 0, percentage: 0 },
    { range: '200+', min: 201, max: Infinity, count: 0, percentage: 0 }
  ];
  
  quests.forEach(q => {
    const xpReward = q.xp_reward || 0;
    const bucket = xpBuckets.find(b => xpReward >= b.min && xpReward <= b.max);
    if (bucket) bucket.count++;
  });
  
  const maxBucketCount = Math.max(...xpBuckets.map(b => b.count), 1);
  xpBuckets.forEach(b => {
    b.percentage = Math.round((b.count / maxBucketCount) * 100);
  });
  
  return {
    stats: {
      totalQuests,
      totalXP,
      avgXP,
      locationsWithQuests,
      totalParticipants,
      questsInProgress,
      completedQuests,
      completionRate,
      xpGivenToday,
      avgQuestsPerUser
    },
    topQuests,
    locationStats,
    xpBuckets
  };
};
