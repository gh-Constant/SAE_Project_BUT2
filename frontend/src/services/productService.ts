import { ProductMock, Products } from '@/mocks/product'
import { USERS } from '@/mocks/users'

// Crée une copie de la liste des products pour pouvoir la modifier
const products: ProductMock[] = []
for (const product of Products) {
  const productCopie = {
    id: product.id,
    name: product.name,
    stock: product.stock,
    prestataireId: product.prestataireId,
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

  getPrestataireName(prestataireId: number) {
    for (const user of USERS) {
      if (user.id === prestataireId) {
        return user.firstname + ' ' + user.lastname
      }
    }
    return 'Inconnu'
  },

  deleteProduct(id: number) {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cet product ?')
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
    prestataireId: number,
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
      prestataireId: nouvelProduct.prestataireId,
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
      prestataireId: 0,
      description: '',
      imageUrl: '',
      price: 0
    }
  },

  // Nouvelles fonctions pour les prestataires
  getProductsByPrestataire(prestataireId: number) {
    return products.filter(product => product.prestataireId === prestataireId)
  },

  createProductForPrestataire(prestataireId: number, productData: {
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
      prestataireId: prestataireId,
      name: productData.name,
      stock: productData.stock,
      description: productData.description,
      imageUrl: productData.imageUrl,
      price: productData.price
    }

    products.push(Object.assign({}, newProduct))
    return newProduct
  },

  canModifyProduct(productId: number, prestataireId: number): boolean {
    for (const product of products) {
      if (product.id === productId) {
        return product.prestataireId === prestataireId
      }
    }
    return false
  }
}

