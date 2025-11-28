import { locationsMock } from '@/mocks'
import { ProductMock, PRODUCTS } from '@/mocks/products'

// Interface pour les produits dans le store (avec locationId et imageUrl)
export interface ProductStoreMock {
  id: number;
  name: string;
  stock: number;
  locationId: number;
  description: string;
  imageUrl: string;
  price: number;
}

// Crée une copie de la liste des products pour pouvoir la modifier
// Convertit de la structure products.ts (id_prestataire, image) vers la structure du store (locationId, imageUrl)
const products: ProductStoreMock[] = []
for (const product of PRODUCTS) {
  // Trouver la première location du prestataire pour ce produit
  const prestataireLocations = locationsMock.filter(loc => loc.userId === product.id_prestataire)
  const locationId = prestataireLocations.length > 0 ? prestataireLocations[0].id : 0
  
  const productCopie: ProductStoreMock = {
    id: product.id,
    name: product.name,
    stock: product.stock,
    locationId: locationId, // Convertir id_prestataire vers locationId
    description: product.description,
    imageUrl: product.image, // Convertir image vers imageUrl
    price: product.price
  }
  products.push(productCopie)
}

export const productService = {
  getProducts() {
    return products
  },

  getLocation(locationId: number) {
    for (const location of locationsMock) {
      if (location.id === locationId) {
        return location.name
      }
    }
    return 'Inconnu'
  },

  deleteProduct(id: number) {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')
    if (!confirmation) return false

    const newProducts = []
    for (const product of products) {
      if (product.id !== id) {
        newProducts.push(product)
      }
    }
    
    // Remplace l'ancienne liste par la nouvelle
    products.length = 0
    for (const product of newProducts) {
      products.push(product)
    }
    return true
  },

  updateProduct(productToUpdate: ProductStoreMock) {
    const index = products.findIndex(a => a.id === productToUpdate.id)
    if (index >= 0) {
      products[index] = { ...productToUpdate }
      return products[index]
    }
    return null
  },

  createProduct(nouvelProduct: {
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
  getProductsByLocation(locationId: number) {
    return products.filter(product => product.locationId === locationId)
  },

  createProductForLocation(locationId: number, productData: {
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

  /**
   * Convertit les produits du store (locationId, imageUrl) vers le format ProductMock (id_prestataire, image)
   * Pour être utilisé par BoutiqueView et autres composants qui attendent ProductMock
   * Cette fonction garantit que les modifications dans productService se reflètent partout
   */
  getProductsForBoutique(): ProductMock[] {
    return products.map(product => {
      // Trouver le prestataire propriétaire de la location
      const location = locationsMock.find(loc => loc.id === product.locationId)
      const id_prestataire = location?.userId || 0
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.imageUrl, // Convertir imageUrl vers image
        id_prestataire: id_prestataire // Convertir locationId vers id_prestataire
      }
    })
  }
}

