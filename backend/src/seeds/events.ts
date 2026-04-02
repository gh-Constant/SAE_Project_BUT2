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
  schedules?: { start_time: Date; end_time: Date; capacity?: number; price?: number; sold?: number }[];
}

function getEventSeeds(): EventSeed[] {
  return [
    {
      id_event: 1,
      title: 'Grand banquet des halles',
      description: 'Un grand service du soir a partager sur de longues tables avec menu complet et ambiance musicale.',
      event_category: 'restauration',
      start_time: new Date('2026-06-21T19:00:00'),
      end_time: new Date('2026-06-21T22:30:00'),
      price: 12000,
      capacity: 180,
      sold: 132,
      id_location: 14,
      type: EventType.EVENT,
    },
    {
      id_event: 2,
      title: 'Degustation accords et hydromels',
      description: 'Trois verres, trois bouchées et un animateur pour decouvrir les meilleurs accords du Cellier.',
      event_category: 'degustation',
      price: 1500,
      capacity: 36,
      sold: 18,
      id_location: 15,
      type: EventType.ACTIVITY,
      schedules: [
        { start_time: new Date('2026-06-22T16:00:00'), end_time: new Date('2026-06-22T16:45:00'), capacity: 12, price: 1500, sold: 8 },
        { start_time: new Date('2026-06-22T17:15:00'), end_time: new Date('2026-06-22T18:00:00'), capacity: 12, price: 1500, sold: 6 },
        { start_time: new Date('2026-06-23T16:30:00'), end_time: new Date('2026-06-23T17:15:00'), capacity: 12, price: 1500, sold: 4 }
      ]
    },
    {
      id_event: 3,
      title: "Initiation a l arbalete de foire",
      description: 'Une prise en main encadree pour apprendre posture, visee et consignes de securite.',
      event_category: 'atelier',
      price: 1800,
      capacity: 24,
      sold: 11,
      id_location: 16,
      type: EventType.ACTIVITY,
      schedules: [
        { start_time: new Date('2026-06-24T10:00:00'), end_time: new Date('2026-06-24T11:00:00'), capacity: 8, price: 1800, sold: 5 },
        { start_time: new Date('2026-06-24T14:00:00'), end_time: new Date('2026-06-24T15:00:00'), capacity: 8, price: 1800, sold: 3 },
        { start_time: new Date('2026-06-25T11:00:00'), end_time: new Date('2026-06-25T12:00:00'), capacity: 8, price: 1800, sold: 3 }
      ]
    },
    {
      id_event: 4,
      title: 'Forge ouverte et lanterne ajouree',
      description: 'Observation commentees des gestes de chauffe, de pliage et de finition sur une piece en cours.',
      event_category: 'demonstration',
      price: 900,
      capacity: 45,
      sold: 20,
      id_location: 17,
      type: EventType.ACTIVITY,
      schedules: [
        { start_time: new Date('2026-06-26T15:00:00'), end_time: new Date('2026-06-26T15:45:00'), capacity: 15, price: 900, sold: 9 },
        { start_time: new Date('2026-06-26T16:15:00'), end_time: new Date('2026-06-26T17:00:00'), capacity: 15, price: 900, sold: 7 },
        { start_time: new Date('2026-06-27T15:30:00'), end_time: new Date('2026-06-27T16:15:00'), capacity: 15, price: 900, sold: 4 }
      ]
    },
    {
      id_event: 5,
      title: 'Defile des guildes et des blasons',
      description: 'Presentation des bannières, des couleurs et des symbols des compagnies presentes sur le festival.',
      event_category: 'spectacle',
      start_time: new Date('2026-06-28T17:00:00'),
      end_time: new Date('2026-06-28T18:30:00'),
      price: 600,
      capacity: 150,
      sold: 84,
      id_location: 18,
      type: EventType.EVENT,
    },
    {
      id_event: 6,
      title: 'Concours du meilleur toast medieval',
      description: 'Le public vote pour le meilleur cri de table et la meilleure mise en scene de banquet.',
      event_category: 'animation',
      start_time: new Date('2026-06-29T20:00:00'),
      end_time: new Date('2026-06-29T21:30:00'),
      price: 300,
      capacity: 90,
      sold: 46,
      id_location: 14,
      type: EventType.EVENT,
    }
  ];
}

export async function seedEvents() {
  console.log('Seeding events...');

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
        schedules: event.schedules ? { create: event.schedules } : undefined
      },
    });

    if (event.type === EventType.ACTIVITY && event.schedules) {
      const count = await prisma.eventSchedule.count({ where: { id_event: event.id_event } });
      if (count === 0) {
        await prisma.eventSchedule.createMany({
          data: event.schedules.map(s => ({
            id_event: event.id_event,
            start_time: s.start_time,
            end_time: s.end_time,
            capacity: s.capacity,
            price: s.price,
            sold: s.sold ?? 0,
          }))
        });
      }
    }
  }

  console.log('Events seeded');
}
