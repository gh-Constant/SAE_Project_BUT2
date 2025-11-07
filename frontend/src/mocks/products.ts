export interface ProductMock {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  id_prestataire: number; // Reference to user id
}

export const PRODUCTS: ProductMock[] = [
];