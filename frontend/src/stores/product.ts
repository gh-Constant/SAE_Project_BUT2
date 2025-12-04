import { defineStore } from 'pinia'
import { productService, ProductStoreMock, ProductFilterParams } from '@/services/productService'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as ProductStoreMock[],
    editId: null as number | null,
    editProduct: productService.defaultProduct(),
    newProduct: productService.defaultProduct(),
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchProducts(filters?: ProductFilterParams) {
      this.loading = true;
      this.error = null;
      try {
        this.products = await productService.getProducts(filters);
        this.loading = false;
      } catch (err) {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    },

    // Start editing an product
    startEdit(product: ProductStoreMock) {
      this.editId = product.id
      this.editProduct = {
        id: product.id,
        name: product.name,
        stock: product.stock,
        locationId: product.locationId,
        description: product.description ?? '',
        imageUrl: product.imageUrl,
        price: product.price
      }
    },

    // Save the modifications of an product
    async saveEdit() {
      const updatedProduct = await productService.updateProduct(this.editProduct)
      if (updatedProduct) { 
        // Update the product in the list
        const index = this.products.findIndex(p => p.id === this.editProduct.id);
        if (index !== -1) {
          this.products[index] = { ...this.editProduct };
        }
        this.editId = null
      }
    },

    // Cancel the modifications of an product
    cancelEdit() {
      this.editId = null
    },

    // Delete an product
    async deleteProduct(idProduct: number) {
      if (await productService.deleteProduct(idProduct)) {
        // Remove the product from the list
        this.products = this.products.filter(p => p.id !== idProduct);
      }
    },

    // Add a new product for a location
    addProductForLocation(idProvider: number) {
      productService.createProductForLocation(idProvider, this.newProduct)
      this.newProduct = productService.defaultProduct()
    },

    resetNewProduct() {
      this.newProduct = productService.defaultProduct()
    },

    defaultProduct() {
      return productService.defaultProduct()
    }
  },

  getters: {
    // Return the products of a specific provider
    productsForLocation: (state) => (idProvider: number) => {
      return state.products.filter(product => product.locationId === idProvider);
    },

    sortedProducts: (state) => {
      const sortedProducts = [...state.products]
      sortedProducts.sort((a, b) => a.locationId - b.locationId)
      return sortedProducts
    },

    productsForBoutique: (state) => {
      return state.products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.imageUrl,
        id_prestataire: product.id_prestataire || 0
      }))
    }
  }
})
