<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Gestion des produits</h1>

    <!-- Liste des products -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Image</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Description</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Prix</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Propriétaire</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="product in store.products" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <img :src="product.imageUrl" :alt="product.name" class="h-12 w-12 object-cover rounded">
            </td>

            <td class="px-6 py-4">
              <div v-if="store.editId !== product.id">
                <div class="font-medium text-gray-900">{{ product.name }}</div>
              </div>
              <div v-else class="space-y-2">
                <input v-model="store.editProduct.name" class="border rounded px-2 py-1 w-full" placeholder="Nom">
              </div>
            </td>
            
            <td class="px-6 py-4">
              <div v-if="store.editId !== product.id">
                <div class="text-sm text-gray-500"> {{ product.description }} </div>
              </div>
              <div v-else class="space-y-2">
                <textarea v-model="store.editProduct.description" class="border rounded px-2 py-1 w-full" placeholder="Description"></textarea>
              </div>
            </td>

            <td class="px-6 py-4">
              <div v-if="store.editId !== product.id" class="text-sm text-gray-900">
                {{ product.price }}€
              </div>
              <input v-else v-model.number="store.editProduct.price" type="number" class="border rounded px-2 py-1 w-24">
            </td>

            <td class="px-6 py-4">
              <div v-if="store.editId !== product.id" class="text-sm text-gray-900">
                {{ product.stock }}
              </div>
              <input v-else v-model.number="store.editProduct.stock" type="number" class="border rounded px-2 py-1 w-24">
            </td>

            <td class="px-6 py-4 text-center">
              <div v-if="store.editId !== product.id" class="text-sm text-gray-900">
                {{ productService.getPrestataireName(product.prestataireId) }}
              </div>
              <input 
                v-else 
                v-model.number="store.editProduct.prestataireId" 
                type="number" 
                class="border rounded px-2 py-1 w-24"
                :title="productService.getPrestataireName(store.editProduct.prestataireId)"
              >
            </td>

            <td class="px-6 py-4 space-x-2">
              <template v-if="store.editId !== product.id">
                <button @click="store.startEdit(product)" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="store.deleteProduct(product.id)" class="text-red-600 hover:text-red-800">
                  <i class="fas fa-trash"></i>
                </button>
              </template>
              <template v-else>
                <button @click="store.saveEdit()" class="text-green-600 hover:text-green-800">
                  <i class="fas fa-check"></i>
                </button>
                <button @click="store.cancelEdit()" class="text-gray-600 hover:text-gray-800">
                  <i class="fas fa-times"></i>
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/product'
import { productService } from '@/services/productService'

const store = useProductStore()
</script>
