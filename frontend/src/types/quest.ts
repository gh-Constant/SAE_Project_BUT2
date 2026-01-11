export enum UserQuestStatus {
  COMPLETED = 'completed',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed'
}

export interface Quest {
  id: number;
  title: string;
  description?: string;
  xpReward: number;
  id_location: number;
}
