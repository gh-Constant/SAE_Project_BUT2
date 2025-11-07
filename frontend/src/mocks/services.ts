import { ServiceType } from "./serviceType";

export interface ServiceMock {
  id: number;
  name: string;
  description?: string;
  
  id_service_type: number;
  id_prestataire: number;
  id_location: number;
}

export const SERVICES: ServiceMock[] = [
  { 
    id: 1, 
    name: 'Échoppe en Ligne', 
    description: 'Permet de vendre des articles aux aventuriers.',
    id_prestataire: 1,
    id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID,
    id_location: 14
  },
  { 
    id: 2, 
    name: 'Tableau de Quêtes', 
    description: 'Permet de proposer des quêtes et des récompenses.',
    id_prestataire: 0,
    id_service_type: ServiceType.QUEST_SERVICE_TYPE_ID,
    id_location: 4
  },
  { 
    id: 3, 
    name: 'Calendrier d\'Événements', 
    description: 'Permet de planifier des démonstrations ou des événements.',
    id_prestataire: 1,
    id_service_type: ServiceType.RESERVATION_SERVICE_TYPE_ID,
    id_location: 15
  },
];