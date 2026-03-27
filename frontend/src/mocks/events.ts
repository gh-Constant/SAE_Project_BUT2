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

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const baseDate = new Date();
baseDate.setHours(0, 0, 0, 0);

function atDayOffset(daysFromNow: number, hour: number, minute = 0): string {
  const date = new Date(baseDate.getTime() + daysFromNow * ONE_DAY_MS);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const EVENTS: EventMock[] = [
  {
    id_event: 1,
    title: "Grand Tournoi de Chevalerie",
    description: "Assistez aux joutes les plus spectaculaires du royaume. Chevaliers et écuyers s'affrontent pour la gloire et l'honneur.",
    type: 'EVENT',
    start_time: atDayOffset(5, 14, 0),
    end_time: atDayOffset(5, 18, 0),
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
    start_time: atDayOffset(9, 19, 0),
    end_time: atDayOffset(9, 23, 0),
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
    start_time: atDayOffset(14, 20, 0),
    end_time: atDayOffset(14, 23, 59),
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
      { id_schedule: 1, start_time: atDayOffset(4, 16, 0), end_time: atDayOffset(4, 17, 0), sold: 0 },
      { id_schedule: 2, start_time: atDayOffset(4, 17, 0), end_time: atDayOffset(4, 18, 0), sold: 0 },
      { id_schedule: 3, start_time: atDayOffset(4, 18, 0), end_time: atDayOffset(4, 19, 0), sold: 0 }
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
      { id_schedule: 4, start_time: atDayOffset(6, 10, 0), end_time: atDayOffset(6, 12, 0), sold: 0 },
      { id_schedule: 5, start_time: atDayOffset(6, 14, 0), end_time: atDayOffset(6, 16, 0), sold: 0 },
      { id_schedule: 6, start_time: atDayOffset(7, 10, 0), end_time: atDayOffset(7, 12, 0), sold: 0 }
    ]
  },
  {
    id_event: 6,
    title: "Concours de Costume",
    description: "Revêtez votre plus belle tenue médiévale et tentez de gagner un prix !",
    type: 'EVENT',
    start_time: atDayOffset(18, 15, 0),
    end_time: atDayOffset(18, 18, 0),
    price: 2,
    capacity: 100,
    sold: 60,
    categories: [],
    id_location: 16, // Marie
    published: true
  }
];
