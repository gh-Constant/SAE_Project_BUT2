export interface ProductMock {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  id_prestataire: number;
}

export const PRODUCTS: ProductMock[] = [
];