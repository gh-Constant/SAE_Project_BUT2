import { ARTISAN_USER_ID } from './users';

export interface LocationMock {
  id: number;
  staticCode: string;
  // Les infos statiques qu'on aurait dans le code
  name: string;
  description: string;
  // Les infos dynamiques de la BDD
  price: number;
  available: boolean;
  userId: string | null;
}

export const FORGE_LOCATION_ID = 1;

export const LOCATIONS: LocationMock[] = [
  {
    id: FORGE_LOCATION_ID,
    staticCode: 'BLACKSMITH_FORGE',
    name: 'La Forge Grise',
    description: 'Une forge ancestrale où le métal chante sous le marteau.',
    price: 150.0,
    available: false,
    userId: ARTISAN_USER_ID,
  },
  {
    id: 2,
    staticCode: 'ALCHEMIST_HUT',
    name: 'La Hutte de l\'Alchimiste',
    description: 'Des fioles bouillonnantes et des parchemins mystérieux vous attendent.',
    price: 120.0,
    available: true,
    userId: null,
  },
  {
    id: 3,
    staticCode: 'MERCHANT_STALL_1',
    name: 'Étal du Marchand',
    description: 'Un étal bien achalandé près de la place du marché.',
    price: 80.0,
    available: true,
    userId: null,
  },
];