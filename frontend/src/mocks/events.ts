

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
  location?: any;
}

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
    start_time: new Date(Date.now() + 172800000).toISOString(), // Après-demain
    end_time: new Date(Date.now() + 180000000).toISOString(),
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
