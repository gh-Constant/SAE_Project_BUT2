import { FORGE_LOCATION_ID } from './locations';
import { SHOP_SERVICE_ID, QUEST_SERVICE_ID } from './services';

// Simule la table de liaison
export interface LocationServiceMock {
  id: number;
  locationId: number;
  serviceId: number;
  isActive: boolean;
}

export const LOCATION_SERVICES: LocationServiceMock[] = [
  // La forge de Gérard a activé l'échoppe et le tableau de quêtes
  { id: 1, locationId: FORGE_LOCATION_ID, serviceId: SHOP_SERVICE_ID, isActive: true },
  { id: 2, locationId: FORGE_LOCATION_ID, serviceId: QUEST_SERVICE_ID, isActive: true },
];