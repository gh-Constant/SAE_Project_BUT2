import prisma from '../prisma.js';

export const ServiceType = {
  SHOP_SERVICE_TYPE_ID: 1,
  RESERVATION_SERVICE_TYPE_ID: 2,
  BLOG_SERVICE_TYPE_ID: 3,
  RESTAURANT_SERVICE_TYPE_ID: 4,
  QUEST_SERVICE_TYPE_ID: 5,
  QUIZ_SERVICE_TYPE_ID: 6,
};

interface ServiceSeed {
  id_service: number;
  name: string;
  description?: string;
  id_service_type: number;
  id_prestataire: number;
  id_location: number;
}

const SERVICE_SEEDS: ServiceSeed[] = [
  { id_service: 1, name: 'Comptoir de la Rotisserie', description: 'Commande de plats chauds et assiettes a emporter.', id_prestataire: 1, id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID, id_location: 14 },
  { id_service: 2, name: 'Cellier du Voyageur', description: 'Boissons, douceurs et paniers a emporter.', id_prestataire: 1, id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID, id_location: 15 },
  { id_service: 3, name: 'Experiences Gourmandes', description: 'Reservations pour degustations et banquets commentes.', id_prestataire: 1, id_service_type: ServiceType.RESERVATION_SERVICE_TYPE_ID, id_location: 14 },
  { id_service: 4, name: 'Chroniques du Lion', description: 'Articles et carnets gourmands gratuits ou premium.', id_prestataire: 1, id_service_type: ServiceType.BLOG_SERVICE_TYPE_ID, id_location: 15 },
  { id_service: 5, name: 'Parcours des Saveurs', description: 'Quetes gourmandes a realiser sur les stands du restaurateur.', id_prestataire: 1, id_service_type: ServiceType.QUEST_SERVICE_TYPE_ID, id_location: 15 },
  { id_service: 6, name: "Atelier de l'Arbaletriere", description: 'Vente de pieces artisanales et accessoires de demonstration.', id_prestataire: 4, id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID, id_location: 16 },
  { id_service: 7, name: 'Demonstrations de Tir', description: 'Reservations pour initiations et demonstrations d atelier.', id_prestataire: 4, id_service_type: ServiceType.RESERVATION_SERVICE_TYPE_ID, id_location: 16 },
  { id_service: 8, name: "Carnets d'Artisan", description: 'Recits de fabrication, guides et articles premium.', id_prestataire: 4, id_service_type: ServiceType.BLOG_SERVICE_TYPE_ID, id_location: 17 },
  { id_service: 9, name: 'Defis des Apprentis', description: 'Quetes immersives pour visiter l atelier et la forge.', id_prestataire: 4, id_service_type: ServiceType.QUEST_SERVICE_TYPE_ID, id_location: 17 },
  { id_service: 10, name: 'Quiz des Savoir-Faire', description: 'Quiz relies aux metiers, blasons et gestes artisanaux.', id_prestataire: 4, id_service_type: ServiceType.QUIZ_SERVICE_TYPE_ID, id_location: 18 }
];

export async function seedServices() {
  console.log('Seeding services...');

  for (const service of SERVICE_SEEDS) {
    await prisma.service.upsert({
      where: { id_service: service.id_service },
      update: service,
      create: service,
    });
  }

  console.log('Services seeded');
}
