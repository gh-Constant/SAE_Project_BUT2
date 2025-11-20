<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          <i class="fas fa-store mr-3 text-orange-500"></i>
          Gestion de ma boutique
        </h1>
        <p class="text-gray-600">Gérez vos produits et votre inventaire</p>
      </div>

      <!-- Formulaire d'ajout -->
      <div class="mb-6">
        <button 
          v-if="showForm == false" 
          class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center" 
          @click="showForm = true"
        >
          <i class="fas fa-plus mr-2"></i>
          Ajouter un produit
        </button>
        <form 
          v-if="showForm == true" 
          @submit.prevent="addProduct(store.newProduct.locationId); showForm = false" 
          class="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i class="fas fa-box-open mr-3 text-orange-500"></i>
            Ajouter un produit
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-tag mr-1 text-orange-500"></i>
                Nom
              </label>
              <input 
                v-model="store.newProduct.name" 
                type="text" 
                required 
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Nom du produit"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-image mr-1 text-orange-500"></i>
                Image
              </label>
              <div class="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleImageSelect(e, 'new')"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer cursor-pointer"
                />
                <input
                  v-model="store.newProduct.imageUrl"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Ou entrez une URL..."
                />
                <div v-if="store.newProduct.imageUrl" class="mt-2">
                  <img
                    :src="store.newProduct.imageUrl"
                    alt="Preview"
                    class="h-24 w-24 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-coins mr-1 text-orange-500"></i>
                Prix (gold)
              </label>
              <input 
                v-model.number="store.newProduct.price" 
                type="number" 
                required 
                step="0.01"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="0.00"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-boxes mr-1 text-orange-500"></i>
                Stock
              </label>
              <input 
                v-model.number="store.newProduct.stock" 
                type="number" 
                required 
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="0"
              >
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-map-marker-alt mr-1 text-orange-500"></i>
                Localisation
              </label>
              <select 
                required 
                v-model="store.newProduct.locationId" 
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="" disabled selected>Sélectionner une localisation</option>
                <option v-for="location in getLocationsForPrestataire()" :key="location.id" :value="location.id">
                  {{ location.name }}
                </option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-align-left mr-1 text-orange-500"></i>
                Description
              </label>
              <textarea 
                v-model="store.newProduct.description" 
                rows="3" 
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Description du produit..."
              ></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button 
              type="submit" 
              class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center"
            >
              <i class="fas fa-check mr-2"></i>
              Ajouter le produit
            </button>
            <button 
              @click="showForm = false" 
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center"
            >
              <i class="fas fa-times mr-2"></i>
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Liste des produits par location -->
      <div v-for="location in prestataireLocations" :key="location.id" class="mb-10">
        <div class="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-4">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center">
            <i class="fas fa-map-marker-alt mr-3 text-orange-500"></i>
            {{ location.name }}
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ productsByLocation(location.id).length }} 
            {{ productsByLocation(location.id).length > 1 ? 'produits' : 'produit' }} 
            dans cette localisation
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-orange-50">
              <tr>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <i class="fas fa-image mr-1"></i>
                  Image
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <i class="fas fa-tag mr-1"></i>
                  Nom
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <i class="fas fa-align-left mr-1"></i>
                  Description
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <i class="fas fa-coins mr-1"></i>
                  Prix
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <i class="fas fa-boxes mr-1"></i>
                  Stock
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <i class="fas fa-cog mr-1"></i>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="product in productsByLocation(location.id)" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div v-if="store.editId !== product.id">
                    <img :src="product.imageUrl" :alt="product.name" class="h-12 w-12 object-cover rounded">
                  </div>
                  <div v-else class="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e) => handleImageSelect(e, 'edit')"
                      class="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer cursor-pointer"
                    />
                    <input
                      v-model="store.editProduct.imageUrl"
                      type="text"
                      class="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="URL..."
                    />
                    <div v-if="store.editProduct.imageUrl">
                      <img
                        :src="store.editProduct.imageUrl"
                        alt="Preview"
                        class="h-16 w-16 object-cover rounded border border-gray-300"
                      />
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="store.editId !== product.id">
                    <div class="font-semibold text-gray-900">{{ product.name }}</div>
                  </div>
                  <div v-else>
                    <input 
                      v-model="store.editProduct.name" 
                      class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                      placeholder="Nom"
                    >
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="store.editId !== product.id">
                    <div class="text-sm text-gray-600 line-clamp-2">{{ product.description }}</div>
                  </div>
                  <div v-else>
                    <textarea 
                      v-model="store.editProduct.description" 
                      class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                      placeholder="Description"
                      rows="2"
                    ></textarea>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="store.editId !== product.id" class="text-sm font-semibold text-orange-600">
                    {{ product.price.toFixed(2) }} gold
                  </div>
                  <input 
                    v-else 
                    v-model.number="store.editProduct.price" 
                    type="number" 
                    step="0.01"
                    class="border border-gray-300 rounded-lg px-3 py-2 w-28 focus:ring-orange-500 focus:border-orange-500"
                  >
                </td>
                <td class="px-6 py-4">
                  <div v-if="store.editId !== product.id">
                    <span 
                      :class="[
                        'text-sm font-semibold px-2 py-1 rounded-full',
                        product.stock === 0 ? 'bg-red-100 text-red-700' :
                        product.stock < 5 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      ]"
                    >
                      {{ product.stock }}
                    </span>
                  </div>
                  <input 
                    v-else 
                    v-model.number="store.editProduct.stock" 
                    type="number" 
                    class="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-orange-500 focus:border-orange-500"
                  >
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <template v-if="store.editId !== product.id">
                      <button 
                        @click="store.startEdit(product)" 
                        class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        title="Modifier"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        @click="store.deleteProduct(product.id)" 
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        title="Supprimer"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button 
                        @click="store.saveEdit()" 
                        class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        title="Enregistrer"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                      <button 
                        @click="store.cancelEdit()" 
                        class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        title="Annuler"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
              <tr v-if="productsByLocation(location.id).length === 0">
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <i class="fas fa-box-open text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500 font-medium">Aucun produit pour cette localisation</p>
                    <p class="text-sm text-gray-400 mt-1">Ajoutez votre premier produit pour commencer</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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

// Fonction réutilisable pour convertir un fichier en data URL
const handleImageSelect = (event: Event, targetField: 'new' | 'edit') => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    if (targetField === 'new') {
      store.newProduct.imageUrl = dataUrl
    } else {
      store.editProduct.imageUrl = dataUrl
    }
  }
  reader.readAsDataURL(file)
}

// Liste des locations du prestataire connecté
const prestataireLocations = computed(() =>
  locationsMock.filter(location => location.userId === authStore.user?.id)
)

// Liste des produits pour une location donnée
function productsByLocation(locationId: number) {
  return store.products.filter(product => product.locationId === locationId)
}

function addProduct(locationId?: number) {
  store.addProductForLocation( locationId || 0)
}

function getLocationsForPrestataire() {
  return locationsMock.filter(location => location.userId === authStore.user?.id)
}
</script>

