import type { LocationMock } from './locations';

export interface EventCategoryMock {
  id_event_category?: number;
  name: string;
  price: number;
  capacity: number;
  sold?: number;
}

export interface EventScheduleMock {
  id_schedule?: number;
  start_time: string;
  end_time: string;
  capacity?: number;
  price?: number;
  sold?: number;
}

export interface EventMock {
  id_event: number;
  title: string;
  description: string;
  type?: 'EVENT' | 'ACTIVITY';
  event_category?: string;
  start_time?: string;
  end_time?: string;
  price: number;
  capacity: number;
  sold: number;
  id_location: number;
  published: boolean;
  location?: LocationMock;
  categories: EventCategoryMock[];
  schedules?: EventScheduleMock[];
}

export type EventInput = Omit<EventMock, 'id_event' | 'sold' | 'location' | 'categories'> & { categories?: EventCategoryMock[]; };
export type EventUpdateInput = { [K in keyof EventInput]?: EventInput[K]; };

export const EVENTS: EventMock[] = [
  { id_event: 1, title: 'Grand banquet des halles', description: 'Un grand service du soir a partager sur de longues tables avec menu complet et ambiance musicale.', type: 'EVENT', event_category: 'restauration', start_time: '2026-06-21T19:00:00.000Z', end_time: '2026-06-21T22:30:00.000Z', price: 12000, capacity: 180, sold: 132, categories: [], id_location: 14, published: true },
  { id_event: 2, title: 'Degustation accords et hydromels', description: 'Trois verres, trois bouchees et un animateur pour decouvrir les meilleurs accords du Cellier.', type: 'ACTIVITY', event_category: 'degustation', price: 1500, capacity: 36, sold: 18, categories: [], id_location: 15, published: true, schedules: [
    { id_schedule: 1, start_time: '2026-06-22T16:00:00.000Z', end_time: '2026-06-22T16:45:00.000Z', capacity: 12, price: 1500, sold: 8 },
    { id_schedule: 2, start_time: '2026-06-22T17:15:00.000Z', end_time: '2026-06-22T18:00:00.000Z', capacity: 12, price: 1500, sold: 6 },
    { id_schedule: 3, start_time: '2026-06-23T16:30:00.000Z', end_time: '2026-06-23T17:15:00.000Z', capacity: 12, price: 1500, sold: 4 }
  ]},
  { id_event: 3, title: 'Initiation a l arbalete de foire', description: 'Une prise en main encadree pour apprendre posture, visee et consignes de securite.', type: 'ACTIVITY', event_category: 'atelier', price: 1800, capacity: 24, sold: 11, categories: [], id_location: 16, published: true, schedules: [
    { id_schedule: 4, start_time: '2026-06-24T10:00:00.000Z', end_time: '2026-06-24T11:00:00.000Z', capacity: 8, price: 1800, sold: 5 },
    { id_schedule: 5, start_time: '2026-06-24T14:00:00.000Z', end_time: '2026-06-24T15:00:00.000Z', capacity: 8, price: 1800, sold: 3 },
    { id_schedule: 6, start_time: '2026-06-25T11:00:00.000Z', end_time: '2026-06-25T12:00:00.000Z', capacity: 8, price: 1800, sold: 3 }
  ]},
  { id_event: 4, title: 'Forge ouverte et lanterne ajouree', description: 'Observation commentees des gestes de chauffe, de pliage et de finition sur une piece en cours.', type: 'ACTIVITY', event_category: 'demonstration', price: 900, capacity: 45, sold: 20, categories: [], id_location: 17, published: true, schedules: [
    { id_schedule: 7, start_time: '2026-06-26T15:00:00.000Z', end_time: '2026-06-26T15:45:00.000Z', capacity: 15, price: 900, sold: 9 },
    { id_schedule: 8, start_time: '2026-06-26T16:15:00.000Z', end_time: '2026-06-26T17:00:00.000Z', capacity: 15, price: 900, sold: 7 },
    { id_schedule: 9, start_time: '2026-06-27T15:30:00.000Z', end_time: '2026-06-27T16:15:00.000Z', capacity: 15, price: 900, sold: 4 }
  ]},
  { id_event: 5, title: 'Defile des guildes et des blasons', description: 'Presentation des bannieres, des couleurs et des symboles des compagnies presentes sur le festival.', type: 'EVENT', event_category: 'spectacle', start_time: '2026-06-28T17:00:00.000Z', end_time: '2026-06-28T18:30:00.000Z', price: 600, capacity: 150, sold: 84, categories: [], id_location: 18, published: true },
  { id_event: 6, title: 'Concours du meilleur toast medieval', description: 'Le public vote pour le meilleur cri de table et la meilleure mise en scene de banquet.', type: 'EVENT', event_category: 'animation', start_time: '2026-06-29T20:00:00.000Z', end_time: '2026-06-29T21:30:00.000Z', price: 300, capacity: 90, sold: 46, categories: [], id_location: 14, published: true }
];
