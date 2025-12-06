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
 */
export const acceptQuest = async (userId: number, questId: number) => {
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
 * Get single quest by ID
 */
export const getQuestById = async (questId: number) => {
  return await prisma.quest.findUnique({
    where: {
      id_quest: questId
    }
  });
};
