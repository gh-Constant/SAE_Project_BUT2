import type { LocationMock } from './locations';


export interface EventMock {
  id_event: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  price: number;
  capacity: number;
  sold: number;
  id_location: number;
  published: boolean;
  location?: LocationMock;
}

// Type pour les données d'entrée lors de la création d'un événement
// Exclut les propriétés auto-générées (id_event, sold, location)
export type EventInput = Omit<EventMock, 'id_event' | 'sold' | 'location'>;

// Type pour les données de mise à jour d'un événement (toutes les propriétés optionnelles sauf celles auto-générées)
export type EventUpdateInput = {
  [K in keyof EventInput]?: EventInput[K];
};

export const EVENTS: EventMock[] = [
  {
    id_event: 1,
    title: "Grand Tournoi de Chevalerie",
    description: "Assistez aux joutes les plus spectaculaires du royaume. Chevaliers et écuyers s'affrontent pour la gloire et l'honneur.",
    start_time: new Date(Date.now() + 86400000).toISOString(), // Demain
    end_time: new Date(Date.now() + 90000000).toISOString(),
    price: 50,
    capacity: 1000,
    sold: 450,
    id_location: 1, // Assumes location 1 exists
    published: true
  },
  {
    id_event: 2,
    title: "Banquet Royal",
    description: "Un festin digne des rois avec musiciens, jongleurs et mets exquis.",
    start_time: new Date('2026-01-09T19:00:00').toISOString(), // Vendredi 9 janvier 2026 à 19h00
    end_time: new Date('2026-01-09T22:00:00').toISOString(), // Fin à 22h00
    price: 120,
    capacity: 200,
    sold: 180,
    id_location: 2,
    published: true
  },
  {
    id_event: 3,
    title: "Marché Nocturne",
    description: "Découvrez les merveilles des artisans locaux sous la lueur des torches.",
    start_time: new Date(Date.now() + 259200000).toISOString(),
    end_time: new Date(Date.now() + 270000000).toISOString(),
    price: 0,
    capacity: 5000,
    sold: 120,
    id_location: 1,
    published: true
  }
];
