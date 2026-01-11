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
  {
    id_service: 1,
    name: 'Échoppe en Ligne',
    description: 'Permet de vendre des articles aux aventuriers.',
    id_prestataire: 1,
    id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID,
    id_location: 14,
  },
  {
    id_service: 2,
    name: 'Tableau de Quêtes',
    description: 'Permet de proposer des quêtes et des récompenses.',
    id_prestataire: 1, // Using 1 instead of 0 to avoid FK constraint issues
    id_service_type: ServiceType.QUEST_SERVICE_TYPE_ID,
    id_location: 4,
  },
  {
    id_service: 3,
    name: "Calendrier d'Événements",
    description: 'Permet de planifier des démonstrations ou des événements.',
    id_prestataire: 1,
    id_service_type: ServiceType.RESERVATION_SERVICE_TYPE_ID,
    id_location: 15,
  },
  {
    id_service: 4,
    name: "Boutique de Marie",
    description: "Vente de produits artisanaux et d'équipements pour aventuriers.",
    id_prestataire: 4,
    id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID,
    id_location: 16,
  },
  {
    id_service: 5,
    name: "Ateliers de Marie",
    description: "Inscrivez-vous à nos ateliers de fabrication et de tir à l'arc.",
    id_prestataire: 4,
    id_service_type: ServiceType.RESERVATION_SERVICE_TYPE_ID,
    id_location: 16,
  },
  {
    id_service: 6,
    name: "Échoppe d'Herboriste",
    description: "Herbes médicinales et potions rares.",
    id_prestataire: 4,
    id_service_type: ServiceType.SHOP_SERVICE_TYPE_ID,
    id_location: 17,
  },
];

export async function seedServices() {
  console.log('️ Seeding services...');

  for (const service of SERVICE_SEEDS) {
    await prisma.service.upsert({
      where: { id_service: service.id_service },
      update: {
        name: service.name,
        description: service.description,
        id_service_type: service.id_service_type,
        id_prestataire: service.id_prestataire,
        id_location: service.id_location,
      },
      create: {
        id_service: service.id_service,
        name: service.name,
        description: service.description,
        id_service_type: service.id_service_type,
        id_prestataire: service.id_prestataire,
        id_location: service.id_location,
      },
    });
  }

  console.log('✅ Services seeded');
}
