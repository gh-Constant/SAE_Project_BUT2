import { locationsMock } from '@/mocks'
import { ProductMock, PRODUCTS } from '@/mocks/products'

// Interface pour les produits dans le store (avec locationId et imageUrl)
export interface ProductStoreMock {
  id: number;
  name: string;
  stock: number;
  locationId: number;
  description?: string;
  imageUrl: string;
  price: number;
  id_prestataire?: number; // Added for compatibility
}

export interface ProductFilterParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  stock?: 'all' | 'in-stock' | 'out-of-stock';
  sortBy?: string;
  locationId?: number;
  prestataireId?: number;
}

// Crée une copie de la liste des products pour pouvoir la modifier
// Convertit de la structure products.ts (id_prestataire, image) vers la structure du store (locationId, imageUrl)
const products: ProductStoreMock[] = []
for (const product of PRODUCTS) {
  // Trouver la première location du prestataire pour ce produit
  const prestataireLocations = locationsMock.filter(loc => loc.id_prestataire === product.id_prestataire)
  const locationId = prestataireLocations.length > 0 ? prestataireLocations[0].id : 0

  const productCopie: ProductStoreMock = {
    id: product.id,
    name: product.name,
    stock: product.stock,
    locationId: locationId, // Convertir id_prestataire vers locationId
    description: product.description,
    imageUrl: product.image, // Convertir image vers imageUrl
    price: product.price,
    id_prestataire: product.id_prestataire
  }
  products.push(productCopie)
}

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const productMockService = {
  async getProducts(filters?: ProductFilterParams) {
    // Simulate async
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...products];

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower))
        );
      }
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.stock) {
        if (filters.stock === 'in-stock') filtered = filtered.filter(p => p.stock > 0);
        if (filters.stock === 'out-of-stock') filtered = filtered.filter(p => p.stock === 0);
      }
      if (filters.locationId) {
        filtered = filtered.filter(p => p.locationId === filters.locationId);
      }
      if (filters.prestataireId) {
        filtered = filtered.filter(p => p.id_prestataire === filters.prestataireId);
      }
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case 'name-asc': return a.name.localeCompare(b.name);
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'stock-asc': return a.stock - b.stock;
            case 'stock-desc': return b.stock - a.stock;
            default: return 0;
          }
        });
      }
    }
    return filtered;
  },

  getLocation(locationId: number) {
    for (const location of locationsMock) {
      if (location.id === locationId) {
        return location.name
      }
    }
    return 'Inconnu'
  },

  async deleteProduct(id: number) {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')
    if (!confirmation) return false

    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      return true;
    }
    return false;
  },

  async updateProduct(productToUpdate: ProductStoreMock) {
    const index = products.findIndex(a => a.id === productToUpdate.id)
    if (index >= 0) {
      products[index] = { ...productToUpdate }
      return products[index]
    }
    return null
  },

  async createProduct(nouvelProduct: {
    name: string,
    stock: number,
    locationId: number,
    description: string,
    imageUrl: string,
    price: number
  }) {
    let maxId = 0
    for (const product of products) {
      if (product.id > maxId) {
        maxId = product.id
      }
    }

    // Créer le nouvel product avec un ID unique
    const productComplet = {
      id: maxId + 1,
      name: nouvelProduct.name,
      stock: nouvelProduct.stock,
      locationId: nouvelProduct.locationId,
      description: nouvelProduct.description,
      imageUrl: nouvelProduct.imageUrl,
      price: nouvelProduct.price
    }

    products.push(productComplet)
    return productComplet
  },

  defaultProduct() {
    return {
      id: 0,
      name: '',
      stock: 0,
      locationId: 0,
      description: '',
      imageUrl: '',
      price: 0
    }
  },

  // Nouvelles fonctions pour les locations
  async getProductsByLocation(locationId: number) {
    return products.filter(product => product.locationId === locationId)
  },

  async createProductForLocation(locationId: number, productData: {
    name: string,
    stock: number,
    description: string,
    imageUrl: string,
    price: number
  }) {
    let maxId = 0
    for (const product of products) {
      if (product.id > maxId) {
        maxId = product.id
      }
    }

    const newProduct = {
      id: maxId + 1,
      locationId: locationId,
      name: productData.name,
      stock: productData.stock,
      description: productData.description,
      imageUrl: productData.imageUrl,
      price: productData.price
    }

    products.push(newProduct)
    return newProduct
  },

  canModifyProduct(productId: number, locationId: number): boolean {
    for (const product of products) {
      if (product.id === productId) {
        return product.locationId === locationId
      }
    }
    return false
  },

  getProductsForBoutique(): ProductMock[] {
    return products.map(product => {
      // Trouver le prestataire propriétaire de la location
      const location = locationsMock.find(loc => loc.id === product.locationId)
      const id_prestataire = location?.id_prestataire || 0

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.imageUrl, // Convertir imageUrl vers image
        id_prestataire: id_prestataire, // Convertir locationId vers id_prestataire
        locationId: product.locationId
      }
    })
  }
}

const productServiceImpl = {
  ...productMockService, // Inherit helper methods like defaultProduct, getLocation (if not API based)

  async getProducts(filters?: ProductFilterParams) {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.stock) queryParams.append('stock', filters.stock);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.locationId) queryParams.append('locationId', filters.locationId.toString());
      if (filters.prestataireId) queryParams.append('prestataireId', filters.prestataireId.toString());
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/products?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  },
};

export const productService = isMockEnabled ? productMockService : productServiceImpl;
