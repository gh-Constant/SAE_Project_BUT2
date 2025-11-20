<!--
  @file OrdersView.vue
  @description
  Vue pour afficher l'historique des commandes de l'utilisateur.

  @utilité
  - Affiche toutes les commandes de l'utilisateur
  - Permet de filtrer par état (waiting, payed, collected)
  - Affiche les détails de chaque commande
  - Permet de payer les commandes en attente
-->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          <i class="fas fa-list mr-3 text-orange-500"></i>
          Mes Commandes
        </h1>
        <p class="text-gray-600">Consultez l'historique de vos commandes</p>
      </div>

      <!-- Filtres -->
      <div class="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div class="flex flex-wrap gap-2">
          <button
            @click="filter = 'all'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Toutes
          </button>
          <button
            @click="filter = EtatCommande.WAITING"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filter === EtatCommande.WAITING
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-clock mr-1"></i>
            À payer
          </button>
          <button
            @click="filter = EtatCommande.PAYED"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filter === EtatCommande.PAYED
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-check-circle mr-1"></i>
            Payées
          </button>
          <button
            @click="filter = EtatCommande.COLLECTED"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filter === EtatCommande.COLLECTED
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-box-check mr-1"></i>
            Collectées
          </button>
        </div>
      </div>

      <!-- Message si aucune commande -->
      <div v-if="filteredOrders.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <p class="text-xl text-gray-600 mb-2">Aucune commande</p>
        <p class="text-gray-500 mb-6">
          {{
            filter === 'all'
              ? "Vous n'avez pas encore passé de commande"
              : `Aucune commande ${getFilterLabel()}`
          }}
        </p>
        <router-link
          to="/boutique"
          class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          <i class="fas fa-store mr-2"></i>
          Voir la boutique
        </router-link>
      </div>

      <!-- Liste des commandes -->
      <div v-else class="space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- En-tête de la commande -->
          <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900">
                  Commande #{{ Math.floor(order.id) }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  <i class="fas fa-store mr-2 text-orange-600"></i>
                  {{ getPrestataireName(order.id_prestataire) }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  <i class="fas fa-calendar mr-1"></i>
                  {{ formatDate(order.date_commande) }}
                </p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full',
                    getStatusBadgeClass(order.etat_commande)
                  ]"
                >
                  <i :class="getStatusIcon(order.etat_commande)" class="mr-1"></i>
                  {{ getStatusLabel(order.etat_commande) }}
                </span>
                <span class="text-2xl font-bold text-orange-600">
                  {{ order.total_price.toFixed(2) }} gold
                </span>
              </div>
            </div>
          </div>

          <!-- Détails de la commande -->
          <div class="px-6 py-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Produits commandés :</h4>
            <div class="space-y-2">
              <div
                v-for="ligne in getOrderItems(order.id)"
                :key="`${order.id}-${ligne.id_product}`"
                class="flex justify-between text-sm text-gray-600"
              >
                <span>{{ ligne.productName }} x{{ ligne.quantite }}</span>
                <span class="font-medium text-gray-900">
                  {{ (ligne.price * ligne.quantite).toFixed(2) }} gold
                </span>
              </div>
            </div>

            <div v-if="order.date_collect" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                <i class="fas fa-box-check mr-2 text-green-600"></i>
                Collectée le {{ formatDate(order.date_collect) }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex gap-3">
              <button
                v-if="order.etat_commande === EtatCommande.WAITING"
                @click="goToPayment"
                class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                <i class="fas fa-credit-card mr-2"></i>
                Payer maintenant
              </button>
              <div
                v-else-if="order.etat_commande === EtatCommande.PAYED"
                class="flex-1 bg-green-50 text-green-700 font-semibold py-2.5 px-4 rounded-lg text-center"
              >
                <i class="fas fa-check-circle mr-2"></i>
                En attente de collecte
              </div>
              <div
                v-else
                class="flex-1 bg-blue-50 text-blue-700 font-semibold py-2.5 px-4 rounded-lg text-center"
              >
                <i class="fas fa-box-check mr-2"></i>
                Commande collectée
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { COMMANDES, EtatCommande, CommandeMock } from '@/mocks/commande'
import { LIGNES_COMMANDE } from '@/mocks/ligneCommande'
import { productService } from '@/services/productService'
import { USERS } from '@/mocks/users'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const filter = ref<'all' | EtatCommande>(route.query.allPaid === 'true' ? EtatCommande.PAYED : 'all')

// Commandes filtrées
const filteredOrders = computed(() => {
  if (!authStore.user) return []
  let orders = COMMANDES.filter((cmd) => cmd.id_user === authStore.user!.id)
  
  if (filter.value !== 'all') {
    orders = orders.filter((cmd) => cmd.etat_commande === filter.value)
  }
  
  // Trier par date (plus récentes en premier)
  return orders.sort((a, b) => {
    return new Date(b.date_commande).getTime() - new Date(a.date_commande).getTime()
  })
})

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

// Formater une date
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Obtenir le label du statut
const getStatusLabel = (etat: EtatCommande): string => {
  switch (etat) {
    case EtatCommande.WAITING:
      return 'En attente de paiement'
    case EtatCommande.PAYED:
      return 'Payée'
    case EtatCommande.COLLECTED:
      return 'Collectée'
    default:
      return 'Inconnu'
  }
}

// Obtenir l'icône du statut
const getStatusIcon = (etat: EtatCommande): string => {
  switch (etat) {
    case EtatCommande.WAITING:
      return 'fas fa-clock'
    case EtatCommande.PAYED:
      return 'fas fa-check-circle'
    case EtatCommande.COLLECTED:
      return 'fas fa-box-check'
    default:
      return 'fas fa-question'
  }
}

// Obtenir la classe CSS du badge de statut
const getStatusBadgeClass = (etat: EtatCommande): string => {
  switch (etat) {
    case EtatCommande.WAITING:
      return 'bg-orange-100 text-orange-800'
    case EtatCommande.PAYED:
      return 'bg-green-100 text-green-800'
    case EtatCommande.COLLECTED:
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Obtenir le label du filtre
const getFilterLabel = (): string => {
  switch (filter.value) {
    case EtatCommande.WAITING:
      return 'en attente de paiement'
    case EtatCommande.PAYED:
      return 'payée'
    case EtatCommande.COLLECTED:
      return 'collectée'
    default:
      return ''
  }
}

// Aller vers la page de paiement
const goToPayment = () => {
  router.push({ name: 'checkout' })
}

onMounted(() => {
  // Rediriger si pas connecté
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

