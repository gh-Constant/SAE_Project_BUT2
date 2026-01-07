
export interface Blog {
  id_blog?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  id_location: number;
}

export const BLOGS: Blog[] = [
  {
    id_blog: 1,
    title: 'Le Tournoi des Chevaliers commence !',
    content: '<p>Oyez, oyez ! Les plus grands guerriers du royaume se rassemblent demain à l\'arène principale. Venez admirer les joutes et encourager vos champions préférés !</p>',
    created_at: '2024-01-07T08:00:00Z',
    updated_at: '2024-01-07T08:00:00Z',
    id_location: 14
  },
  {
    id_blog: 2,
    title: 'Élixir de Force : Nouvelle Potion',
    content: '<p>Notre alchimiste a enfin terminé sa dernière création. L\'Élixir de Force vous donnera une puissance inégalée pour vos prochaines quêtes. Disponible dès maintenant à la boutique !</p>',
    created_at: '2024-01-06T12:00:00Z',
    updated_at: '2024-01-06T12:00:00Z',
    id_location: 16
  },
  {
    id_blog: 3,
    title: 'Mystère dans la Forêt des Lions',
    content: '<p>Plusieurs voyageurs rapportent des lueurs étranges venant de la forêt profonde. Les gardes recommandent la plus grande prudence à tous les aventuriers s\'aventurant au-delà des sentiers connus.</p>',
    created_at: '2024-01-05T15:30:00Z',
    updated_at: '2024-01-05T15:30:00Z',
    id_location: 16
  },
  {
    id_blog: 4,
    title: 'Grand Banquet au Château',
    content: '<p>Le Roi invite tous les citoyens à célébrer la fin des récoltes. Un banquet gargantuesque sera servi sur la place du marché. Ne manquez pas ce rendez-vous historique !</p>',
    created_at: '2024-01-04T10:00:00Z',
    updated_at: '2024-01-04T10:00:00Z',
    id_location: 14
  }
];
