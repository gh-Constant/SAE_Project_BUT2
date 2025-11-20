<!--
  @file CartView.vue
  @description
  Vue pour afficher et gérer le panier d'achat.

  @utilité
  - Affiche tous les articles du panier groupés par location (boutique)
  - Permet de modifier les quantités ou supprimer des articles
  - Affiche les sous-totaux par location et le total général
  - Permet de passer commande (crée les commandes séparées par location)
-->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          <i class="fas fa-shopping-cart mr-3 text-orange-500"></i>
          Mon Panier
        </h1>
        <p class="text-gray-600">{{ cartStore.itemCount }} article(s) dans votre panier</p>
      </div>

      <!-- Panier vide -->
      <div v-if="cartStore.isEmpty" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
        <p class="text-xl text-gray-600 mb-2">Votre panier est vide</p>
        <p class="text-gray-500 mb-6">Découvrez nos produits dans la boutique</p>
        <router-link
          to="/boutique"
          class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          <i class="fas fa-store mr-2"></i>
          Voir la boutique
        </router-link>
      </div>

      <!-- Panier avec articles -->
      <div v-else>
        <!-- Articles groupés par location (boutique) -->
        <div v-for="(items, locationId) in cartStore.groupedByLocation" :key="locationId" class="mb-6">
          <!-- En-tête de la location -->
          <div class="bg-orange-100 border border-orange-300 rounded-t-lg px-4 py-3">
            <h2 class="font-semibold text-gray-900">
              <i class="fas fa-map-marker-alt mr-2 text-orange-600"></i>
              {{ getLocationName(Number(locationId)) }}
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ getPrestataireNameForLocation(Number(locationId)) }}
            </p>
          </div>

          <!-- Liste des articles de la location -->
          <div class="bg-white border-x border-gray-200 divide-y divide-gray-200">
            <CartItemComponent
              v-for="item in items"
              :key="item.id_product"
              :item="item"
            />
          </div>

          <!-- Sous-total de la location -->
          <div class="bg-gray-50 border-x border-b border-gray-200 rounded-b-lg px-4 py-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Sous-total</span>
              <span class="text-lg font-bold text-gray-900">
                {{ calculateSubtotal(items).toFixed(2) }} gold
              </span>
            </div>
          </div>
        </div>

        <!-- Récapitulatif global -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="space-y-3">
            <div class="flex justify-between items-center text-lg">
              <span class="font-semibold text-gray-900">Total général</span>
              <span class="text-2xl font-bold text-orange-600">
                {{ cartStore.total.toFixed(2) }} gold
              </span>
            </div>
            <p class="text-sm text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>
              Les commandes seront créées séparément pour chaque boutique (location)
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <router-link
            to="/boutique"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Continuer mes achats
          </router-link>
          
          <button
            @click="handleCheckout"
            :disabled="isProcessing"
            class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="!isProcessing" class="fas fa-credit-card mr-2"></i>
            <i v-else class="fas fa-spinner fa-spin mr-2"></i>
            {{ isProcessing ? 'Traitement...' : 'Passer commande' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore, type CartItem } from '@/stores/cart'
import { USERS } from '@/mocks/users'
import { productService } from '@/services/productService'
import CartItemComponent from '@/components/CartItem.vue'

const router = useRouter()
const cartStore = useCartStore()
const isProcessing = ref(false)

// Récupérer le nom de la location (boutique)
const getLocationName = (locationId: number): string => {
  return productService.getLocation(locationId)
}

// Récupérer le nom du prestataire pour une location donnée
const getPrestataireNameForLocation = (locationId: number): string => {
  // Trouver le prestataire via les items du panier pour cette location
  const itemsForLocation = cartStore.groupedByLocation[locationId] || []
  if (itemsForLocation.length > 0) {
    const prestataireId = itemsForLocation[0].id_prestataire
    const prestataire = USERS.find((u) => u.id === prestataireId)
    return prestataire ? `${prestataire.firstname} ${prestataire.lastname}` : `Prestataire #${prestataireId}`
  }
  return 'Prestataire inconnu'
}

// Calculer le sous-total pour un groupe de location
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// Gérer le passage de commande
const handleCheckout = async () => {
  if (cartStore.isEmpty) return

  isProcessing.value = true

  try {
    // Créer les commandes (séparées par location)
    const orders = cartStore.createOrder()

    // Simuler un petit délai pour l'UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Rediriger vers la page de paiement
    router.push({ name: 'checkout' })
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    alert('Une erreur est survenue. Veuillez réessayer.')
  } finally {
    isProcessing.value = false
  }
}
</script>

