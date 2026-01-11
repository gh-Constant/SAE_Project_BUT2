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
  <div class="bg-white/60 rounded-sm p-4 border border-antique-bronze/20 hover:border-antique-bronze/60 hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden">
    <!-- Texture overlay -->
    <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
    
    <!-- Image du produit -->
    <div v-if="product.image" class="w-full h-48 mb-4 rounded-sm overflow-hidden bg-antique-bronze/10 relative border border-antique-bronze/10">
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div v-else class="w-full h-48 mb-4 rounded-sm bg-antique-bronze/5 flex items-center justify-center border border-antique-bronze/10">
      <i class="fas fa-box-open text-antique-bronze/30 text-4xl"></i>
    </div>

    <!-- Informations du produit -->
    <div class="flex-1 relative z-10">
      <h5 class="font-medieval font-bold text-iron-black text-xl mb-2 line-clamp-2 min-h-[3.5rem]">
        {{ product.name }}
      </h5>
      
      <!-- Nom du prestataire -->
      <p class="text-xs text-stone-grey mb-3 font-bold flex items-center">
        <i class="fas fa-user-tie mr-2 text-antique-bronze"></i>
        {{ prestataireName }}
      </p>
      
      <p v-if="product.description" class="text-sm text-stone-grey mb-4 line-clamp-2 italic font-body">
        {{ product.description }}
      </p>

      <!-- Prix et stock -->
      <div class="flex items-center justify-between mb-4 pt-3 border-t border-antique-bronze/10">
        <p class="text-xl font-medieval font-bold text-antique-bronze">{{ product.price.toFixed(2) }} Gold</p>
        <div class="flex items-center gap-2 font-body">
          <span v-if="product.stock === 0" class="text-xs text-red-700 font-bold bg-red-100 px-2 py-1 rounded-sm border border-red-200">
            <i class="fas fa-times-circle mr-1"></i>
            Rupture
          </span>
          <span v-else-if="product.stock < 5" class="text-xs text-orange-700 font-bold bg-orange-100 px-2 py-1 rounded-sm border border-orange-200">
            <i class="fas fa-exclamation-triangle mr-1"></i>
            Limité
          </span>
          <span v-else class="text-xs text-stone-600 bg-stone-100 px-2 py-1 rounded-sm border border-stone-200">
            Stock: {{ product.stock }}
          </span>
        </div>
      </div>
    </div>

    <!-- Bouton ajouter au panier -->
    <!-- Bouton ajouter au panier -->
    <MedievalButton
      @click="handleAddToCart"
      :disabled="product.stock === 0 || isAdding"
      full-width
      :variant="product.stock === 0 ? 'secondary' : 'primary'"
      class="relative z-10"
      :class="{ 'opacity-50 cursor-not-allowed': product.stock === 0 }"
    >
      <i v-if="!isAdding" class="fas fa-shopping-cart mr-2"></i>
      <i v-else class="fas fa-spinner fa-spin mr-2"></i>
      {{ product.stock === 0 ? 'Rupture de stock' : isAdding ? 'Ajout...' : 'Ajouter au panier' }}
    </MedievalButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ProductMock } from '@/mocks/products'
import { USERS } from '@/mocks/users'
import { useCartStore } from '@/stores/cart'
import MedievalButton from '@/components/ui/MedievalButton.vue'

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
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

