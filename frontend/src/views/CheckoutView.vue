<!--
  @file CheckoutView.vue
  @description
  Vue pour payer les commandes en attente.

  @utilité
  - Affiche toutes les commandes en état "waiting" de l'utilisateur
  - Permet de payer chaque commande séparément
  - Affiche un récapitulatif global
-->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          <i class="fas fa-credit-card mr-3 text-orange-500"></i>
          Finaliser vos commandes
        </h1>
        <p class="text-gray-600">Payer vos commandes séparément</p>
      </div>

      <!-- Aucune commande en attente -->
      <div v-if="pendingOrders.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
        <p class="text-xl text-gray-600 mb-2">Toutes vos commandes sont payées !</p>
        <p class="text-gray-500 mb-6">Vous pouvez consulter vos commandes dans l'historique</p>
        <router-link
          to="/commandes"
          class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          <i class="fas fa-list mr-2"></i>
          Voir mes commandes
        </router-link>
      </div>

      <!-- Liste des commandes à payer -->
      <div v-else class="space-y-6">
        <div
          v-for="order in pendingOrders"
          :key="order.id"
          class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
          <!-- En-tête de la commande -->
          <div class="bg-orange-50 border-b border-orange-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-gray-900">
                  Commande #{{ Math.floor(order.id) }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  <i class="fas fa-map-marker-alt mr-2 text-orange-600"></i>
                  {{ getLocationName(order.id_location) }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  <i class="fas fa-store mr-1"></i>
                  {{ getPrestataireName(order.id_prestataire) }}
                </p>
              </div>
              <span class="px-3 py-1 bg-orange-200 text-orange-800 text-xs font-semibold rounded-full">
                <i class="fas fa-clock mr-1"></i>
                En attente de paiement
              </span>
            </div>
          </div>

          <!-- Détails de la commande -->
          <div class="px-6 py-4">
            <div class="space-y-2 mb-4">
              <div
                v-for="ligne in getOrderItems(order.id)"
                :key="`${order.id}-${ligne.id_product}`"
                class="flex justify-between text-sm"
              >
                <span class="text-gray-700">
                  {{ ligne.productName }} x{{ ligne.quantite }}
                </span>
                <span class="text-gray-900 font-medium">
                  {{ (ligne.price * ligne.quantite).toFixed(2) }} gold
                </span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total de cette commande</span>
                <span class="text-2xl font-bold text-orange-600">
                  {{ order.total_price.toFixed(2) }} gold
                </span>
              </div>
            </div>
          </div>

          <!-- Bouton de paiement -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              @click="payOrder(order.id)"
              :disabled="isPaying[order.id] || order.etat_commande !== EtatCommande.WAITING"
              :class="[
                'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200',
                order.etat_commande !== EtatCommande.WAITING || isPaying[order.id]
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
              ]"
            >
              <i v-if="!isPaying[order.id]" class="fas fa-credit-card mr-2"></i>
              <i v-else class="fas fa-spinner fa-spin mr-2"></i>
              {{
                isPaying[order.id]
                  ? 'Paiement en cours...'
                  : `Payer ${order.total_price.toFixed(2)} gold`
              }}
            </button>
          </div>
        </div>

        <!-- Récapitulatif global -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-gray-600">
              <span>Commandes à payer</span>
              <span class="font-medium">{{ pendingOrders.length }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total à payer</span>
              <span class="text-orange-600">{{ totalToPay.toFixed(2) }} gold</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500 pt-2">
              <span>Commandes payées</span>
              <span>{{ paidOrdersCount }}/{{ totalOrdersCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { COMMANDES, EtatCommande, CommandeMock } from '@/mocks/commande'
import { LIGNES_COMMANDE, LigneCommandeMock } from '@/mocks/ligneCommande'
import { productService } from '@/services/productService'
import { USERS } from '@/mocks/users'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isPaying = ref<Record<number, boolean>>({})

// Commandes en attente de paiement
const pendingOrders = computed(() => {
  if (!authStore.user) return []
  return COMMANDES.filter(
    (cmd) => cmd.id_user === authStore.user!.id && cmd.etat_commande === EtatCommande.WAITING
  )
})

// Total à payer
const totalToPay = computed(() => {
  return pendingOrders.value.reduce((sum, order) => sum + order.total_price, 0)
})

// Toutes les commandes de l'utilisateur
const totalOrdersCount = computed(() => {
  if (!authStore.user) return 0
  return COMMANDES.filter((cmd) => cmd.id_user === authStore.user!.id).length
})

// Commandes payées
const paidOrdersCount = computed(() => {
  if (!authStore.user) return 0
  return COMMANDES.filter(
    (cmd) =>
      cmd.id_user === authStore.user!.id &&
      (cmd.etat_commande === EtatCommande.PAYED || cmd.etat_commande === EtatCommande.COLLECTED)
  ).length
})

// Récupérer le nom de la location (boutique)
const getLocationName = (locationId: number): string => {
  return productService.getLocation(locationId)
}

// Récupérer le nom du prestataire
const getPrestataireName = (prestataireId: number): string => {
  const prestataire = USERS.find((u) => u.id === prestataireId)
  return prestataire ? `${prestataire.firstname} ${prestataire.lastname}` : `Prestataire #${prestataireId}`
}

// Récupérer les items d'une commande
const getOrderItems = (orderId: number) => {
  const lignes = LIGNES_COMMANDE.filter((ligne) => ligne.id_commande === orderId)
  const allProducts = productService.getProductsForBoutique()
  return lignes.map((ligne) => {
    const product = allProducts.find((p) => p.id === ligne.id_product)
    return {
      id_product: ligne.id_product,
      productName: product?.name || 'Produit inconnu',
      quantite: ligne.quantite,
      price: ligne.price,
    }
  })
}

// Décrémenter le stock pour une commande
const decreaseStockForOrder = (orderId: number) => {
  // Récupérer toutes les lignes de commande pour cette commande
  const lignes = LIGNES_COMMANDE.filter((ligne) => ligne.id_commande === orderId)
  const allProducts = productService.getProducts()
  
  lignes.forEach((ligne) => {
    const product = allProducts.find((p) => p.id === ligne.id_product)
    if (product) {
      // Décrémenter le stock (ne pas aller en dessous de 0)
      product.stock = Math.max(0, product.stock - ligne.quantite)
      // Mettre à jour le produit dans le service
      productService.updateProduct(product)
    }
  })
}

// Payer une commande
const payOrder = async (orderId: number) => {
  const order = COMMANDES.find((cmd) => cmd.id === orderId)
  if (!order || order.etat_commande !== EtatCommande.WAITING) return

  isPaying.value[orderId] = true

  try {
    // Simuler un délai de paiement
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Décrémenter le stock des produits de cette commande
    decreaseStockForOrder(orderId)

    // Changer l'état de la commande
    order.etat_commande = EtatCommande.PAYED

    // Si toutes les commandes sont payées, rediriger vers l'historique
    const allPaid = COMMANDES.filter((cmd) => cmd.id_user === authStore.user!.id).every(
      (cmd) => cmd.etat_commande !== EtatCommande.WAITING
    )

    if (allPaid) {
      setTimeout(() => {
        router.push({ name: 'commandes', query: { allPaid: 'true' } })
      }, 500)
    }
  } catch (error) {
    console.error('Erreur lors du paiement:', error)
    alert('Une erreur est survenue lors du paiement. Veuillez réessayer.')
  } finally {
    isPaying.value[orderId] = false
  }
}

onMounted(() => {
  // Rediriger si pas connecté
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

