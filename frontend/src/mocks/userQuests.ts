import { QUESTS } from './quests';
import { UserQuestStatus } from '@/types/quest';

// Matches backend/src/seeds/userQuests.ts - hardcoded
export const USER_QUESTS = [
  // User 2 (Alice L'Aventurière) - Mix of quests from all merchant stalls
  { id_user: 2, id_quest: 1, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-15T10:00:00Z'), updated_at: new Date('2024-01-15T14:30:00Z'), quest: QUESTS[0] },
  { id_user: 2, id_quest: 3, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-16T09:00:00Z'), updated_at: new Date('2024-01-16T09:45:00Z'), quest: QUESTS[2] },
  { id_user: 2, id_quest: 6, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-17T11:00:00Z'), updated_at: new Date('2024-01-17T13:00:00Z'), quest: QUESTS[5] },
  { id_user: 2, id_quest: 9, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-18T15:00:00Z'), updated_at: new Date('2024-01-18T17:30:00Z'), quest: QUESTS[8] },
  { id_user: 2, id_quest: 12, status: UserQuestStatus.ACCEPTED, created_at: new Date('2024-01-19T08:00:00Z'), updated_at: new Date('2024-01-19T08:00:00Z'), quest: QUESTS[11] },
  { id_user: 2, id_quest: 15, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-20T10:00:00Z'), updated_at: new Date('2024-01-20T12:00:00Z'), quest: QUESTS[14] },
  { id_user: 2, id_quest: 18, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-21T09:00:00Z'), updated_at: new Date('2024-01-21T11:30:00Z'), quest: QUESTS[17] },
  { id_user: 2, id_quest: 20, status: UserQuestStatus.ACCEPTED, created_at: new Date('2024-01-22T06:00:00Z'), updated_at: new Date('2024-01-22T06:00:00Z'), quest: QUESTS[19] },

  // NOTE: User 1 (Gérard) and User 4 (Marie) are prestataires - they cannot accept quests, only create them

  // User 3 (Godefroy Le Sénéchal / Admin) - Various quests
  { id_user: 3, id_quest: 4, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-13T07:00:00Z'), updated_at: new Date('2024-01-13T12:00:00Z'), quest: QUESTS[3] },
  { id_user: 3, id_quest: 7, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-14T19:00:00Z'), updated_at: new Date('2024-01-14T20:30:00Z'), quest: QUESTS[6] },
  { id_user: 3, id_quest: 10, status: UserQuestStatus.ACCEPTED, created_at: new Date('2024-01-15T14:00:00Z'), updated_at: new Date('2024-01-15T14:00:00Z'), quest: QUESTS[9] },
  { id_user: 3, id_quest: 16, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-16T11:00:00Z'), updated_at: new Date('2024-01-16T13:00:00Z'), quest: QUESTS[15] },

  // User 5 (Pierre Le Paysan) - Beginner quest
  { id_user: 5, id_quest: 1, status: UserQuestStatus.ACCEPTED, created_at: new Date('2024-01-22T08:00:00Z'), updated_at: new Date('2024-01-22T08:00:00Z'), quest: QUESTS[0] },
  { id_user: 5, id_quest: 2, status: UserQuestStatus.COMPLETED, created_at: new Date('2024-01-23T09:00:00Z'), updated_at: new Date('2024-01-23T11:00:00Z'), quest: QUESTS[1] },
  { id_user: 5, id_quest: 8, status: UserQuestStatus.ACCEPTED, created_at: new Date('2024-01-24T10:00:00Z'), updated_at: new Date('2024-01-24T10:00:00Z'), quest: QUESTS[7] },
];