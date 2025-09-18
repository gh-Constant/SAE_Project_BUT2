import { FORGE_LOCATION_ID } from './locations';

export interface QuestMock {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  locationId: number;
}

export const FORGE_QUEST_ID = 1;

export const QUESTS: QuestMock[] = [
  { id: FORGE_QUEST_ID, title: 'L\'Acier Manquant', description: 'Retrouvez mes 5 lingots d\'acier volés par les gobelins dans la forêt voisine !', xpReward: 100, locationId: FORGE_LOCATION_ID },
];