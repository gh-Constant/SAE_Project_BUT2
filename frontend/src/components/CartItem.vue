<template>
  <div class="bg-white/40 backdrop-blur-sm rounded-lg border border-antique-bronze/20 p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 hover:bg-white/60">
    <!-- Image du produit -->
    <div class="flex-shrink-0">
      <div v-if="product?.image" class="w-20 h-20 rounded-lg overflow-hidden border border-antique-bronze/10 shadow-sm">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
      </div>
      <div v-else class="w-20 h-20 rounded-lg bg-antique-bronze/5 border border-antique-bronze/10 flex items-center justify-center">
        <i class="fas fa-image text-antique-bronze/40 text-xl"></i>
      </div>
    </div>

    <!-- Informations du produit -->
    <div class="flex-1 min-w-0">
      <h4 class="font-medieval font-bold text-iron-black text-lg mb-1 truncate">{{ product?.name || 'Produit' }}</h4>
      <p class="text-sm font-body text-stone-grey mb-2">{{ item.price.toFixed(2) }} gold / unité</p>
      
      <!-- Contrôles de quantité -->
      <div class="flex items-center gap-3">
        <button
          @click="decreaseQuantity"
          :disabled="item.quantity <= 1"
          class="w-8 h-8 rounded-md border border-antique-bronze/30 flex items-center justify-center hover:bg-antique-bronze/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-iron-black"
        >
          <i class="fas fa-minus text-xs"></i>
        </button>
        
        <span class="text-base font-medieval font-bold text-iron-black min-w-[2rem] text-center">
          {{ item.quantity }}
        </span>
        
        <button
          @click="increaseQuantity"
          :disabled="product && item.quantity >= product.stock"
          class="w-8 h-8 rounded-md border border-antique-bronze/30 flex items-center justify-center hover:bg-antique-bronze/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-iron-black"
        >
          <i class="fas fa-plus text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Prix total et actions -->
    <div class="flex flex-col items-end gap-2">
      <p class="text-lg font-medieval font-bold text-antique-bronze">
        {{ (item.price * item.quantity).toFixed(2) }} gold
      </p>
      
      <button
        @click="removeItem"
        class="text-red-800/70 hover:text-red-800 text-sm transition-colors flex items-center gap-1 font-body"
        title="Supprimer"
      >
        <i class="fas fa-trash"></i>
        <span class="hidden sm:inline">Retirer</span>
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
  if (props.item.product) {
    return props.item.product;
  }
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
