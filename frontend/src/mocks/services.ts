export interface ServiceMock {
  id: number;
  serviceCode: 'ONLINE_SHOP' | 'QUEST_BOARD' | 'EVENT_CALENDAR';
  name: string;
  description: string;
}

export const SHOP_SERVICE_ID = 1;
export const QUEST_SERVICE_ID = 2;
export const EVENT_SERVICE_ID = 3;

export const SERVICES: ServiceMock[] = [
  { id: SHOP_SERVICE_ID, serviceCode: 'ONLINE_SHOP', name: 'Échoppe en Ligne', description: 'Permet de vendre des articles aux aventuriers.' },
  { id: QUEST_SERVICE_ID, serviceCode: 'QUEST_BOARD', name: 'Tableau de Quêtes', description: 'Permet de proposer des quêtes et des récompenses.' },
  { id: EVENT_SERVICE_ID, serviceCode: 'EVENT_CALENDAR', name: 'Calendrier d\'Événements', description: 'Permet de planifier des démonstrations ou des événements.' },
];