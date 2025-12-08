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

// Generate dates relative to seed execution time
function getEventSeeds(): EventSeed[] {
  const now = Date.now();

  return [
    {
      id_event: 1,
      title: 'Grand Tournoi de Chevalerie',
      description: "Assistez aux joutes les plus spectaculaires du royaume. Chevaliers et écuyers s'affrontent pour la gloire et l'honneur.",
      start_time: new Date(now + 86400000), // Tomorrow
      end_time: new Date(now + 90000000),
      price: 50,
      capacity: 1000,
      sold: 450,
      id_location: 1,
    },
    {
      id_event: 2,
      title: 'Banquet Royal',
      description: 'Un festin digne des rois avec musiciens, jongleurs et mets exquis.',
      start_time: new Date(now + 172800000), // Day after tomorrow
      end_time: new Date(now + 180000000),
      price: 120,
      capacity: 200,
      sold: 180,
      id_location: 2,
    },
    {
      id_event: 3,
      title: 'Marché Nocturne',
      description: 'Découvrez les merveilles des artisans locaux sous la lueur des torches.',
      start_time: new Date(now + 259200000), // 3 days from now
      end_time: new Date(now + 270000000),
      price: 0,
      capacity: 5000,
      sold: 120,
      id_location: 1,
    },
  ];
}

export async function seedEvents() {
  console.log('🎪 Seeding events...');

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
