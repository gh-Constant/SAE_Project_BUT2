import { locationsMock } from '@/mocks'
import { ProductMock, PRODUCTS } from '@/mocks/products'

// Crée une copie de la liste des products pour pouvoir la modifier
const products: ProductMock[] = []
for (const product of PRODUCTS) {
  const productCopie = {
    id: product.id,
    name: product.name,
    stock: product.stock,
    locationId: product.locationId,
    description: product.description,
    imageUrl: product.imageUrl,
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

  updateProduct(productToUpdate: ProductMock) {
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

    products.push(Object.assign({}, newProduct))
    return newProduct
  },

  canModifyProduct(productId: number, locationId: number): boolean {
    for (const product of products) {
      if (product.id === productId) {
        return product.locationId === locationId
      }
    }
    return false
  }
}

