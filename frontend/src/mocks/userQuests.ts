import { AVENTURER_USER_ID } from './users';
import { FORGE_QUEST_ID } from './quests';

// Simule le journal de quêtes
export interface UserQuestMock {
  id: number;
  userId: number;
  questId: number;
  status: 'accepted' | 'completed';
}

export const USER_QUESTS: UserQuestMock[] = [
  // Alice a accepté la quête du forgeron
  { id: 1, userId: AVENTURER_USER_ID, questId: FORGE_QUEST_ID, status: 'accepted' },
];