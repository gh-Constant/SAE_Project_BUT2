<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Gestion de ma boutique</h1>

    <!-- Formulaire d'ajout -->
    <button v-if="showForm == false" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6" @click="showForm = true">
      Ajouter un produit
    </button>
    <form v-if="showForm == true" @submit.prevent="addProduct" @submit="showForm = false" class="mb-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Ajouter un produit</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input v-model="store.newProduct.name" type="text" required class="w-full border rounded px-3 py-2">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input v-model="store.newProduct.imageUrl" type="text" required class="w-full border rounded px-3 py-2">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prix</label>
          <input v-model.number="store.newProduct.price" type="number" required class="w-full border rounded px-3 py-2">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input v-model.number="store.newProduct.stock" type="number" required class="w-full border rounded px-3 py-2">
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
          <select v-model="store.newProduct.locationId" class="w-full border rounded px-3 py-2">
            <option value="">Sélectionner une localisation</option>
            <option v-for="location in getLocationsForPrestataire()" :key="location.id" :value="location.id">
              {{ location.name }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="store.newProduct.description" rows="3" class="w-full border rounded px-3 py-2"></textarea>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Ajouter le produit
        </button>
        <button @click="showForm = false" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Annuler
        </button>
      </div>
    </form>

    <!-- Liste des produits par location -->
    <div v-for="location in prestataireLocations" :key="location.id" class="mb-10">
      <h2 class="text-xl font-semibold mb-2 text-indigo-700">
        {{ location.name }}
      </h2>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Image</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Description</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="product in productsByLocation(location.id)" :key="product.id" class="hover:bg-gray-50">
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
                  <div class="text-sm text-gray-500">{{ product.description }}</div>
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
              <td class="px-6 py-4">
                <div v-if="store.editId !== product.id" class="text-sm text-gray-900">
                  {{ productService.getLocation(product.locationId) }}
                </div>
                <div v-else>
                  <select v-model="store.editProduct.locationId" class="w-full border rounded px-3 py-2">
                    <option value="">Sélectionner une localisation</option>
                    <option v-for="loc in getLocationsForPrestataire()" :key="loc.id" :value="loc.id">
                      {{ loc.name }}
                    </option>
                  </select>
                </div>
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
            <tr v-if="productsByLocation(location.id).length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-400">Aucun produit pour cette localisation.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { productService } from '@/services/productService'
import { locationsMock } from '@/mocks/locations'

const authStore = useAuthStore()
const store = useProductStore()
const showForm = ref(false)

// Liste des locations du prestataire connecté
const prestataireLocations = computed(() =>
  locationsMock.filter(location => location.userId === authStore.user?.id)
)

// Liste des produits pour une location donnée
function productsByLocation(locationId: number) {
  return store.products.filter(product => product.locationId === locationId)
}

function addProduct() {
  store.addProductForLocation(authStore.user?.id || 0)
}

function getLocationsForPrestataire() {
  return locationsMock.filter(location => location.userId === authStore.user?.id)
}
</script>

