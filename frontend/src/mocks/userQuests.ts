// Simule le journal de quêtes
export interface UserQuestMock {
  id: number;
  userId: number;
  questId: number;
  status: 'accepted' | 'completed';
}

export const USER_QUESTS: UserQuestMock[] = [
  // user quest mock data
];