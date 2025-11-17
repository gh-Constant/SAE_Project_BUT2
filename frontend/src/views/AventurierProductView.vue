<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Boutique</h1>

    <!-- Liste des produits de la location -->
    <div v-for="location in prestataireLocations" :key="location.id" class="mb-10">
      <h2 class="text-xl font-semibold mb-2 text-indigo-700">
        {{ location.name }}
      </h2>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="product in productsByLocation(location.id)" :key="product.id" class="p-4 mb-4">
            <div class="bg-white rounded-lg shadow">
              <img :src="product.imageUrl" :alt="product.name" class="h-48 w-full">
            </div>
            <div class="px-4 py-4">
              <div class="font-medium text-gray-900">{{ product.name }}</div>
            </div>
            <div class="text-sm text-gray-500">{{ product.description }}</div>
            <div class="text-sm text-gray-500">{{ product.price }}€</div>
            <div class="text-sm text-gray-500">{{ product.stock }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { locationsMock } from '@/mocks/locations'

const authStore = useAuthStore()
const store = useProductStore()

// Liste des locations du prestataire connecté
const prestataireLocations = computed(() =>
  locationsMock.filter(location => location.userId === authStore.user?.id)
)

// Liste des produits pour une location donnée
function productsByLocation(locationId: number) {
  return store.products.filter(product => product.locationId === locationId)
}
</script>

