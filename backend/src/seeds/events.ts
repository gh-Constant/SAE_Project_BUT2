import prisma from '../prisma.js';
import { EventType } from '@prisma/client';

interface EventSeed {
  id_event: number;
  title: string;
  description: string;
  event_category?: string;
  start_time?: Date;
  end_time?: Date;
  price: number;
  capacity: number;
  sold: number;
  id_location: number;
  type: EventType;
  schedules?: { start_time: Date; end_time: Date; capacity?: number; price?: number }[];
}

// Festival Dates: 20/06/2026 - 05/07/2026
function getEventSeeds(): EventSeed[] {
  return [
    {
      id_event: 1,
      title: 'Grand Tournoi de Chevalerie',
      description: "Assistez aux joutes les plus spectaculaires du royaume. Chevaliers et écuyers s'affrontent pour la gloire et l'honneur.",
      event_category: 'spectacle',
      start_time: new Date('2026-06-21T14:00:00'),
      end_time: new Date('2026-06-21T18:00:00'),
      price: 5000,
      capacity: 1000,
      sold: 450,
      id_location: 1,
      type: EventType.EVENT,
    },
    {
      id_event: 2,
      title: 'Banquet Royal',
      description: 'Un festin digne des rois avec musiciens, jongleurs et mets exquis.',
      event_category: 'restauration',
      start_time: new Date('2026-06-25T19:00:00'),
      end_time: new Date('2026-06-25T23:00:00'),
      price: 12000,
      capacity: 200,
      sold: 180,
      id_location: 2,
      type: EventType.EVENT,
    },
    {
      id_event: 3,
      title: 'Marché Nocturne',
      description: 'Découvrez les merveilles des artisans locaux sous la lueur des torches.',
      event_category: 'marche',
      start_time: new Date('2026-06-30T20:00:00'),
      end_time: new Date('2026-06-30T23:59:00'),
      price: 0,
      capacity: 5000,
      sold: 120,
      id_location: 1,
      type: EventType.EVENT,
    },
    {
      id_event: 4,
      title: "Dégustation d'Hydromel",
      description: "Venez goûter nos meilleures cuvées d'hydromel artisanal. Ambiance conviviale garantie !",
      event_category: 'restauration',
      price: 500,
      capacity: 50,
      sold: 0,
      id_location: 14, // Gérard
      type: EventType.ACTIVITY,
      schedules: [
        { start_time: new Date('2026-06-20T16:00:00'), end_time: new Date('2026-06-20T17:00:00') },
        { start_time: new Date('2026-06-20T17:00:00'), end_time: new Date('2026-06-20T18:00:00') },
        { start_time: new Date('2026-06-20T18:00:00'), end_time: new Date('2026-06-20T19:00:00') }
      ]
    },
    {
      id_event: 5,
      title: "Cours de Tir à l'Arc",
      description: "Marie vous apprend les bases du tir à l'arc. Matériel fourni.",
      event_category: 'atelier',
      price: 1500,
      capacity: 10,
      sold: 0,
      id_location: 16, // Marie
      type: EventType.ACTIVITY,
      schedules: [
        { start_time: new Date('2026-06-22T10:00:00'), end_time: new Date('2026-06-22T12:00:00') },
        { start_time: new Date('2026-06-22T14:00:00'), end_time: new Date('2026-06-22T16:00:00') },
        { start_time: new Date('2026-06-23T10:00:00'), end_time: new Date('2026-06-23T12:00:00') }
      ]
    },
    {
      id_event: 6,
      title: "Concours de Costume",
      description: "Revêtez votre plus belle tenue médiévale et tentez de gagner un prix !",
      event_category: 'concours',
      start_time: new Date('2026-07-04T15:00:00'),
      end_time: new Date('2026-07-04T18:00:00'),
      price: 200,
      capacity: 100,
      sold: 60,
      id_location: 16, // Marie
      type: EventType.EVENT,
    },
  ];
}

export async function seedEvents() {
  console.log(' Seeding events...');

  const events = getEventSeeds();

  for (const event of events) {
    const basePayload: any = {
      title: event.title,
      description: event.description,
      event_category: event.event_category,
      start_time: event.start_time || null,
      end_time: event.end_time || null,
      price: event.price,
      capacity: event.capacity,
      sold: event.sold,
      id_location: event.id_location,
      type: event.type,
    };

    await prisma.event.upsert({
      where: { id_event: event.id_event },
      update: basePayload,
      create: {
        id_event: event.id_event,
        ...basePayload,
        schedules: event.schedules ? {
          create: event.schedules
        } : undefined
      },
    });

    // If activity, ensure schedules are created if not present (simple approach)
    if (event.type === EventType.ACTIVITY && event.schedules) {
        // Check if schedules exist
        const count = await prisma.eventSchedule.count({ where: { id_event: event.id_event }});
        if (count === 0) {
            await prisma.eventSchedule.createMany({
                data: event.schedules.map(s => ({
                    id_event: event.id_event,
                    start_time: s.start_time,
                    end_time: s.end_time,
                    capacity: s.capacity,
                    price: s.price
                }))
            });
        }
    }
  }

  console.log('✅ Events seeded');
}
