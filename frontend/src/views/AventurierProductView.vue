<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Boutique</h1>
    <div v-if="selectedLocation">
      <h2 class="text-xl font-semibold mb-6 text-indigo-700 text-center">
        {{ selectedLocation.name }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div
          v-for="product in productsByLocation(selectedLocation.id)"
          :key="product.id"
          class="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden transition-transform hover:scale-105"
        >
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-48 object-cover"
          />
          <div class="flex-1 flex flex-col px-4 py-3">
            <div class="text-lg font-bold text-center mb-2 text-gray-900">
              {{ product.name }}
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-600 font-semibold">
                Stock: {{ product.stock }}
              </span>
              <span class="text-sm text-green-700 font-bold">
                {{ product.price }}€
              </span>
            </div>
            <div class="text-sm text-gray-500 mt-2 text-center">
              {{ product.description }}
            </div>
            <div class="mt-4 flex gap-2 justify-center">
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium"
                @click="addToCart(product)"
              >
                Ajouter au panier
              </button>
              <button
                class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium"
                @click="buyNow(product)"
              >
                Acheter maintenant
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="productsByLocation(selectedLocation.id).length === 0"
          class="col-span-full text-center text-gray-400 py-8"
        >
          Aucun produit pour cette localisation.
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-400 py-8">
      Boutique introuvable.
    </div>
  </div>
</template>

<script setup lang="ts">
// filepath: c:\Users\maxou\Documents\Cours\IUT\S3\SAE_Project_BUT2\frontend\src\views\AventurierProductView.vue
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { locationsMock } from '@/mocks/locations'

const route = useRoute()
const store = useProductStore()

const locationId = computed(() => {
  return Number(route.params.locationId || route.query.locationId)
})

const selectedLocation = computed(() =>
  locationsMock.find(location => location.id === locationId.value)
)

function productsByLocation(locationId: number) {
  return store.products.filter(product => product.locationId === locationId)
}

function addToCart(product) {
  // TODO: Ajouter le produit au panier
  alert(`Produit "${product.name}" ajouté au panier !`)
}

function buyNow(product) {
  // TODO: Acheter le produit directement
  alert(`Vous avez acheté "${product.name}" !`)
}
</script>

