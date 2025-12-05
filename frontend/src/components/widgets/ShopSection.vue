<!--
  @file ShopSection.vue
  @description
  Composant pour afficher un aperçu des produits d'une boutique (location).
  Affiche les premiers produits et un lien vers la boutique complète.

  @props
  - locationId: number - L'ID de la location associée
-->
<template>
  <div class="shop-section">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">Shop Preview</h3>
      <div class="flex gap-2">
        <button 
          v-if="isOwner"
          @click="addProduct"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> Add Product
        </button>
        <button 
          @click="goToShop" 
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm flex items-center"
        >
          <i class="fas fa-store mr-2"></i> View All
        </button>
      </div>
    </div>

    <!-- Products List Display -->
    <div class="space-y-4">
      <div v-if="products.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p class="text-gray-500">No products available yet.</p>
        <p class="text-sm text-gray-400 mt-1">Check back later for new items!</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="product in displayedProducts" :key="product.id" class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <!-- Product Image -->
          <div class="h-32 bg-gray-200 overflow-hidden relative">
            <img 
              v-if="product.imageUrl" 
              :src="product.imageUrl" 
              :alt="product.name" 
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <i class="fas fa-box text-3xl"></i>
            </div>
            <div class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm text-xs font-bold text-gray-800">
              {{ product.price }} gold
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="p-3">
            <h4 class="text-sm font-bold text-gray-900 mb-1 truncate">{{ product.name }}</h4>
            <p class="text-xs text-gray-500 line-clamp-2 mb-2">{{ product.description }}</p>
            <div class="flex justify-between items-center text-xs">
              <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { productService, ProductStoreMock } from '@/services/productService';

interface Props {
  locationId: number;
  isOwner?: boolean;
}

const props = defineProps<Props>();
const router = useRouter();

const products = ref<ProductStoreMock[]>([]);

// Display only the first 3 products
const displayedProducts = computed(() => {
  return products.value.slice(0, 3);
});

const fetchProducts = async () => {
  try {
    products.value = await productService.getProductsByLocation(props.locationId);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

const goToShop = () => {
  router.push({ name: 'boutique-location', params: { locationId: props.locationId } });
};

const addProduct = () => {
  router.push({ 
    name: 'prestataire-products', 
    query: { 
      action: 'add', 
      locationId: props.locationId 
    } 
  });
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
@reference "tailwindcss";
</style>
