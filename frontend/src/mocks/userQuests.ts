export enum UserQuestStatus {
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Simule le journal de quêtes
export interface UserQuestMock {
  id_user: number;
  id_quest: number;
  status: UserQuestStatus;
}

export const USER_QUESTS: UserQuestMock[] = [
  // user quest mock data
];