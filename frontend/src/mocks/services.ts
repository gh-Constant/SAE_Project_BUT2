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
  { id: 1, name: 'Comptoir de la Rotisserie', description: 'Commande de plats chauds et assiettes a emporter.', id_prestataire: 1, id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID, id_location: 14 },
  { id: 2, name: 'Cellier du Voyageur', description: 'Boissons, douceurs et paniers a emporter.', id_prestataire: 1, id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID, id_location: 15 },
  { id: 3, name: 'Experiences Gourmandes', description: 'Reservations pour degustations et banquets commentes.', id_prestataire: 1, id_service_type: ServiceType.RESERVATION_SERVICE_TYPE_ID, id_location: 14 },
  { id: 4, name: 'Chroniques du Lion', description: 'Articles et carnets gourmands gratuits ou premium.', id_prestataire: 1, id_service_type: ServiceType.BLOG_SERVICE_TYPE_ID, id_location: 15 },
  { id: 5, name: 'Parcours des Saveurs', description: 'Quetes gourmandes a realiser sur les stands du restaurateur.', id_prestataire: 1, id_service_type: ServiceType.QUEST_SERVICE_TYPE_ID, id_location: 15 },
  { id: 6, name: "Atelier de l'Arbaletriere", description: 'Vente de pieces artisanales et accessoires de demonstration.', id_prestataire: 4, id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID, id_location: 16 },
  { id: 7, name: 'Demonstrations de Tir', description: 'Reservations pour initiations et demonstrations d atelier.', id_prestataire: 4, id_service_type: ServiceType.RESERVATION_SERVICE_TYPE_ID, id_location: 16 },
  { id: 8, name: "Carnets d'Artisan", description: 'Recits de fabrication, guides et articles premium.', id_prestataire: 4, id_service_type: ServiceType.BLOG_SERVICE_TYPE_ID, id_location: 17 },
  { id: 9, name: 'Defis des Apprentis', description: 'Quetes immersives pour visiter l atelier et la forge.', id_prestataire: 4, id_service_type: ServiceType.QUEST_SERVICE_TYPE_ID, id_location: 17 },
  { id: 10, name: 'Quiz des Savoir-Faire', description: 'Quiz relies aux metiers, blasons et gestes artisanaux.', id_prestataire: 4, id_service_type: ServiceType.QUIZ_SERVICE_TYPE_ID, id_location: 18 }
];
