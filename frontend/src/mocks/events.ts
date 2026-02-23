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

// Type pour les données d'entrée lors de la création d'un événement
// Exclut les propriétés auto-générées (id_event, sold, location)
export type EventInput = Omit<EventMock, 'id_event' | 'sold' | 'location' | 'categories'> & {
  categories?: EventCategoryMock[];
};

// Type pour les données de mise à jour d'un événement (toutes les propriétés optionnelles sauf celles auto-générées)
export type EventUpdateInput = {
  [K in keyof EventInput]?: EventInput[K];
};

export const EVENTS: EventMock[] = [
  {
    id_event: 1,
    title: "Grand Tournoi de Chevalerie",
    description: "Assistez aux joutes les plus spectaculaires du royaume. Chevaliers et écuyers s'affrontent pour la gloire et l'honneur.",
    type: 'EVENT',
    start_time: new Date('2026-06-21T14:00:00').toISOString(),
    end_time: new Date('2026-06-21T18:00:00').toISOString(),
    price: 50,
    capacity: 1000,
    sold: 450,
    categories: [],
    id_location: 1, 
    published: true
  },
  {
    id_event: 2,
    title: "Banquet Royal",
    description: "Un festin digne des rois avec musiciens, jongleurs et mets exquis.",
    type: 'EVENT',
    start_time: new Date('2026-06-25T19:00:00').toISOString(),
    end_time: new Date('2026-06-25T23:00:00').toISOString(),
    price: 120,
    capacity: 200,
    sold: 180,
    categories: [],
    id_location: 2,
    published: true
  },
  {
    id_event: 3,
    title: "Marché Nocturne",
    description: "Découvrez les merveilles des artisans locaux sous la lueur des torches.",
    type: 'EVENT',
    start_time: new Date('2026-06-30T20:00:00').toISOString(),
    end_time: new Date('2026-06-30T23:59:00').toISOString(),
    price: 0,
    capacity: 5000,
    sold: 120,
    categories: [],
    id_location: 1,
    published: true
  },
  {
    id_event: 4,
    title: "Dégustation d'Hydromel",
    description: "Venez goûter nos meilleures cuvées d'hydromel artisanal. Ambiance conviviale garantie !",
    type: 'ACTIVITY',
    price: 5,
    capacity: 50,
    sold: 0,
    categories: [],
    id_location: 14, // Gérard
    published: true,
    schedules: [
      { id_schedule: 1, start_time: new Date('2026-06-20T16:00:00').toISOString(), end_time: new Date('2026-06-20T17:00:00').toISOString(), sold: 0 },
      { id_schedule: 2, start_time: new Date('2026-06-20T17:00:00').toISOString(), end_time: new Date('2026-06-20T18:00:00').toISOString(), sold: 0 },
      { id_schedule: 3, start_time: new Date('2026-06-20T18:00:00').toISOString(), end_time: new Date('2026-06-20T19:00:00').toISOString(), sold: 0 }
    ]
  },
  {
    id_event: 5,
    title: "Cours de Tir à l'Arc",
    description: "Marie vous apprend les bases du tir à l'arc. Matériel fourni.",
    type: 'ACTIVITY',
    price: 15,
    capacity: 10,
    sold: 0,
    categories: [],
    id_location: 16, // Marie
    published: true,
    schedules: [
      { id_schedule: 4, start_time: new Date('2026-06-22T10:00:00').toISOString(), end_time: new Date('2026-06-22T12:00:00').toISOString(), sold: 0 },
      { id_schedule: 5, start_time: new Date('2026-06-22T14:00:00').toISOString(), end_time: new Date('2026-06-22T16:00:00').toISOString(), sold: 0 },
      { id_schedule: 6, start_time: new Date('2026-06-23T10:00:00').toISOString(), end_time: new Date('2026-06-23T12:00:00').toISOString(), sold: 0 }
    ]
  },
  {
    id_event: 6,
    title: "Concours de Costume",
    description: "Revêtez votre plus belle tenue médiévale et tentez de gagner un prix !",
    type: 'EVENT',
    start_time: new Date('2026-07-04T15:00:00').toISOString(),
    end_time: new Date('2026-07-04T18:00:00').toISOString(),
    price: 2,
    capacity: 100,
    sold: 60,
    categories: [],
    id_location: 16, // Marie
    published: true
  }
];
