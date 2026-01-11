import prisma from '../prisma.js';

interface EventSeed {
  id_event: number;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  price: number;
  capacity: number;
  sold: number;
  id_location: number;
}

// Festival Dates: 20/06/2026 - 05/07/2026
function getEventSeeds(): EventSeed[] {
  return [
    {
      id_event: 1,
      title: 'Grand Tournoi de Chevalerie',
      description: "Assistez aux joutes les plus spectaculaires du royaume. Chevaliers et écuyers s'affrontent pour la gloire et l'honneur.",
      start_time: new Date('2026-06-21T14:00:00'),
      end_time: new Date('2026-06-21T18:00:00'),
      price: 50,
      capacity: 1000,
      sold: 450,
      id_location: 1,
    },
    {
      id_event: 2,
      title: 'Banquet Royal',
      description: 'Un festin digne des rois avec musiciens, jongleurs et mets exquis.',
      start_time: new Date('2026-06-25T19:00:00'),
      end_time: new Date('2026-06-25T23:00:00'),
      price: 120,
      capacity: 200,
      sold: 180,
      id_location: 2,
    },
    {
      id_event: 3,
      title: 'Marché Nocturne',
      description: 'Découvrez les merveilles des artisans locaux sous la lueur des torches.',
      start_time: new Date('2026-06-30T20:00:00'),
      end_time: new Date('2026-06-30T23:59:00'),
      price: 0,
      capacity: 5000,
      sold: 120,
      id_location: 1,
    },
    {
      id_event: 4,
      title: "Dégustation d'Hydromel",
      description: "Venez goûter nos meilleures cuvées d'hydromel artisanal. Ambiance conviviale garantie !",
      start_time: new Date('2026-06-20T16:00:00'),
      end_time: new Date('2026-06-20T19:00:00'),
      price: 5,
      capacity: 50,
      sold: 45,
      id_location: 14, // Gérard
    },
    {
      id_event: 5,
      title: "Cours de Tir à l'Arc",
      description: "Marie vous apprend les bases du tir à l'arc. Matériel fourni.",
      start_time: new Date('2026-06-22T10:00:00'),
      end_time: new Date('2026-06-22T12:00:00'),
      price: 15,
      capacity: 10,
      sold: 8,
      id_location: 16, // Marie
    },
    {
      id_event: 6,
      title: "Concours de Costume",
      description: "Revêtez votre plus belle tenue médiévale et tentez de gagner un prix !",
      start_time: new Date('2026-07-04T15:00:00'),
      end_time: new Date('2026-07-04T18:00:00'),
      price: 2,
      capacity: 100,
      sold: 60,
      id_location: 16, // Marie
    },
  ];
}

export async function seedEvents() {
  console.log(' Seeding events...');

  const events = getEventSeeds();

  for (const event of events) {
    await prisma.event.upsert({
      where: { id_event: event.id_event },
      update: {
        title: event.title,
        description: event.description,
        start_time: event.start_time,
        end_time: event.end_time,
        price: event.price,
        capacity: event.capacity,
        sold: event.sold,
        id_location: event.id_location,
      },
      create: {
        id_event: event.id_event,
        title: event.title,
        description: event.description,
        start_time: event.start_time,
        end_time: event.end_time,
        price: event.price,
        capacity: event.capacity,
        sold: event.sold,
        id_location: event.id_location,
      },
    });
  }

  console.log('✅ Events seeded');
}
