import { defineStore } from 'pinia'
import { ProductMock } from '@/mocks/products'
import { productService } from '@/services/productService'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: productService.getProducts(),
    editId: null as number | null,
    editProduct: productService.defaultProduct(),
    newProduct: productService.defaultProduct()
  }),

  actions: {
    // Start editing an product
    startEdit(product: ProductMock) {
      this.editId = product.id
      this.editProduct = {
        id: product.id,
        name: product.name,
        stock: product.stock,
        locationId: product.locationId,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price
      }
    },

    // Save the modifications of an product
    saveEdit() {
      const updatedProduct = productService.updateProduct(this.editProduct)
      if (updatedProduct) {
        // Update the product in the list
        let position = -1
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === updatedProduct.id) {
            position = i
            break
          }
        }
        if (position !== -1) {
          this.products[position] = {
            id: updatedProduct.id,
            name: updatedProduct.name,
            stock: updatedProduct.stock,
            locationId: updatedProduct.locationId,
            description: updatedProduct.description,
            imageUrl: updatedProduct.imageUrl,
            price: updatedProduct.price
          }
        }
        this.editId = null
      }
    },

    // Cancel the modifications of an product
    cancelEdit() {
      this.editId = null
    },

    // Delete an product
    deleteProduct(idProduct: number) {
      if (productService.deleteProduct(idProduct)) {
        // Remove the product from the list
        const newAllProducts = []
        for (const product of this.products) {
          if (product.id !== idProduct) {
            newAllProducts.push(product)
          }
        }
        this.products = newAllProducts
      }
    },

    // Add a new product for a location
    addProductForLocation(idProvider: number) {
      const createdProduct = productService.createProductForLocation(idProvider, this.newProduct)
      this.products.push({
        id: createdProduct.id,
        name: createdProduct.name,
        stock: createdProduct.stock,
        locationId: createdProduct.locationId,
        description: createdProduct.description,
        imageUrl: createdProduct.imageUrl,
        price: createdProduct.price
      })
      this.newProduct = productService.defaultProduct()
    }
  },

  getters: {
    // Return the products of a specific provider
    productsForLocation: (state) => (idProvider: number) => {
      const productsProvider = []
      for (const product of state.products) {
        if (product.locationId === idProvider) {
          productsProvider.push(product)
        }
      }
      return productsProvider
    },

    sortedProducts: (state) => {
      const sortedProducts = [...state.products]
      sortedProducts.sort((a, b) => a.locationId - b.locationId)
      return sortedProducts
    }
  }
})



