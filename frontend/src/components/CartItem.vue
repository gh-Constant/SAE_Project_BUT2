<!--
  @file CartItem.vue
  @description
  Composant pour afficher un article du panier avec possibilité de modifier la quantité ou supprimer.

  @utilité
  - Affiche les informations d'un article du panier
  - Permet de modifier la quantité (+/-)
  - Permet de supprimer l'article

  @props
  - item: CartItem - L'article du panier à afficher
  - product: ProductMock - Les données du produit (optionnel, peut être récupéré depuis PRODUCTS)

  @dépendances
  - useCartStore: Store Pinia pour gérer le panier
-->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
    <!-- Image du produit -->
    <div class="flex-shrink-0">
      <div v-if="product?.image" class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
      </div>
      <div v-else class="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
        <i class="fas fa-image text-gray-400 text-xl"></i>
      </div>
    </div>

    <!-- Informations du produit -->
    <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-gray-900 mb-1 truncate">{{ product?.name || 'Produit' }}</h4>
      <p class="text-sm text-gray-600 mb-2">{{ item.price.toFixed(2) }} gold / unité</p>
      
      <!-- Contrôles de quantité -->
      <div class="flex items-center gap-3">
        <button
          @click="decreaseQuantity"
          :disabled="item.quantity <= 1"
          class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-minus text-xs text-gray-600"></i>
        </button>
        
        <span class="text-base font-semibold text-gray-900 min-w-[2rem] text-center">
          {{ item.quantity }}
        </span>
        
        <button
          @click="increaseQuantity"
          :disabled="product && item.quantity >= product.stock"
          class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-plus text-xs text-gray-600"></i>
        </button>
      </div>
    </div>

    <!-- Prix total et actions -->
    <div class="flex flex-col items-end gap-2">
      <p class="text-lg font-bold text-orange-600">
        {{ (item.price * item.quantity).toFixed(2) }} gold
      </p>
      
      <button
        @click="removeItem"
        class="text-red-500 hover:text-red-700 text-sm transition-colors"
        title="Supprimer"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CartItem } from '@/stores/cart'
import { ProductMock } from '@/mocks/products'
import { productService } from '@/services/productService'
import { useCartStore } from '@/stores/cart'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()
const cartStore = useCartStore()

// Récupérer les données du produit depuis productService (source unique de vérité)
const product = computed(() => {
  const allProducts = productService.getProductsForBoutique()
  return allProducts.find((p: ProductMock) => p.id === props.item.id_product)
})

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    cartStore.updateQuantity(props.item.id_product, props.item.quantity - 1)
  }
}

const increaseQuantity = () => {
  if (product.value && props.item.quantity < product.value.stock) {
    cartStore.updateQuantity(props.item.id_product, props.item.quantity + 1)
  }
}

const removeItem = () => {
  cartStore.removeFromCart(props.item.id_product)
}
</script>

