import { FORGE_LOCATION_ID } from './locations';

export interface ProductMock {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  locationId: number;
}

export const PRODUCTS: ProductMock[] = [
  { id: 1, name: 'Épée de Fer Robuste', description: 'Forgée à la main. Tranchante et fiable.', price: 25.50, stock: 10, imageUrl: '/images/sword.png', locationId: FORGE_LOCATION_ID },
  { id: 2, name: 'Bouclier en Chêne', description: 'Renforcé de bandes de fer. Arrête net les coups.', price: 18.00, stock: 5, imageUrl: '/images/shield.png', locationId: FORGE_LOCATION_ID },
];