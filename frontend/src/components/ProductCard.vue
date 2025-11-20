<!--
  @file ProductCard.vue
  @description
  Composant pour afficher un produit avec possibilité de l'ajouter au panier.

  @utilité
  - Affiche les informations d'un produit (image, nom, prix, description)
  - Permet d'ajouter le produit au panier
  - Gère l'affichage du stock

  @props
  - product: ProductMock - Les données du produit à afficher

  @dépendances
  - useCartStore: Store Pinia pour gérer le panier
  - ProductMock: Interface du produit
-->
<template>
  <div class="bg-orange-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-200 flex flex-col">
    <!-- Image du produit -->
    <div v-if="product.image" class="w-full h-40 mb-3 rounded-lg overflow-hidden bg-gray-100">
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
    </div>
    <div v-else class="w-full h-40 mb-3 rounded-lg bg-gray-200 flex items-center justify-center">
      <i class="fas fa-image text-gray-400 text-3xl"></i>
    </div>

    <!-- Informations du produit -->
    <div class="flex-1">
      <h5 class="font-semibold text-gray-900 text-base mb-1 line-clamp-2 min-h-[3rem]">
        {{ product.name }}
      </h5>
      
      <!-- Nom du prestataire -->
      <p class="text-xs text-gray-500 mb-2">
        <i class="fas fa-store mr-1"></i>
        {{ prestataireName }}
      </p>
      
      <p v-if="product.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Prix et stock -->
      <div class="flex items-center justify-between mb-3">
        <p class="text-lg font-bold text-orange-600">{{ product.price.toFixed(2) }} gold</p>
        <div class="flex items-center gap-2">
          <span v-if="product.stock === 0" class="text-xs text-red-600 font-semibold">
            <i class="fas fa-times-circle mr-1"></i>
            Rupture
          </span>
          <span v-else-if="product.stock < 5" class="text-xs text-orange-600 font-semibold">
            <i class="fas fa-exclamation-triangle mr-1"></i>
            Stock limité
          </span>
          <span v-else class="text-xs text-gray-500">
            Stock: {{ product.stock }}
          </span>
        </div>
      </div>
    </div>

    <!-- Bouton ajouter au panier -->
    <button
      @click="handleAddToCart"
      :disabled="product.stock === 0 || isAdding"
      :class="[
        'w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200',
        product.stock === 0
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
      ]"
    >
      <i v-if="!isAdding" class="fas fa-shopping-cart mr-2"></i>
      <i v-else class="fas fa-spinner fa-spin mr-2"></i>
      {{ product.stock === 0 ? 'Rupture de stock' : isAdding ? 'Ajout...' : 'Ajouter au panier' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ProductMock } from '@/mocks/products'
import { USERS } from '@/mocks/users'
import { useCartStore } from '@/stores/cart'

interface Props {
  product: ProductMock
}

const props = defineProps<Props>()
const cartStore = useCartStore()
const isAdding = ref(false)

// Récupérer le nom du prestataire
const prestataireName = computed(() => {
  const prestataire = USERS.find((u) => u.id === props.product.id_prestataire)
  return prestataire ? `${prestataire.firstname} ${prestataire.lastname}` : `Prestataire #${props.product.id_prestataire}`
})

const handleAddToCart = async () => {
  if (props.product.stock === 0) return

  isAdding.value = true
  
  // Simuler un petit délai pour l'UX
  await new Promise(resolve => setTimeout(resolve, 300))
  
  cartStore.addToCart(props.product, 1)
  isAdding.value = false
  
  // Optionnel : notification de succès (à implémenter plus tard)
  // showNotification('Produit ajouté au panier')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

