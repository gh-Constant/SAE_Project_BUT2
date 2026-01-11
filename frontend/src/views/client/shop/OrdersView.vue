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
  <div class="min-h-screen bg-parchment py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-12">
        <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
          {{ t('orders.title') }}
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
        <p class="text-base font-body text-stone-grey">{{ t('orders.subtitle') }}</p>
      </div>

      <!-- Filtres -->
      <div class="mb-8 flex flex-wrap gap-2">
        <button @click="filter = 'all'" :class="[
          'px-5 py-2.5 rounded-md font-body font-semibold text-sm transition-all duration-200',
          filter === 'all'
            ? 'bg-antique-bronze text-white shadow-md'
            : 'bg-white/60 text-stone-grey hover:bg-white border border-antique-bronze/20'
        ]">
          {{ t('orders.filters.all') }}
        </button>
        <button @click="filter = EtatCommande.WAITING" :class="[
          'px-5 py-2.5 rounded-md font-body font-semibold text-sm transition-all duration-200',
          filter === EtatCommande.WAITING
            ? 'bg-antique-bronze text-white shadow-md'
            : 'bg-white/60 text-stone-grey hover:bg-white border border-antique-bronze/20'
        ]">
          {{ t('orders.filters.waiting') }}
        </button>
        <button @click="filter = EtatCommande.PAID" :class="[
          'px-5 py-2.5 rounded-md font-body font-semibold text-sm transition-all duration-200',
          filter === EtatCommande.PAID
            ? 'bg-antique-bronze text-white shadow-md'
            : 'bg-white/60 text-stone-grey hover:bg-white border border-antique-bronze/20'
        ]">
          {{ t('orders.filters.paid') }}
        </button>
        <button @click="filter = EtatCommande.COLLECTED" :class="[
          'px-5 py-2.5 rounded-md font-body font-semibold text-sm transition-all duration-200',
          filter === EtatCommande.COLLECTED
            ? 'bg-antique-bronze text-white shadow-md'
            : 'bg-white/60 text-stone-grey hover:bg-white border border-antique-bronze/20'
        ]">
          {{ t('orders.filters.collected') }}
        </button>
      </div>

      <!-- Message si aucune commande -->
      <div v-if="filteredOrders.length === 0"
        class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 p-16 text-center">
        <div class="w-20 h-20 bg-antique-bronze/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p class="text-xl font-medieval text-iron-black mb-2">{{ t('orders.empty.title') }}</p>
        <p class="text-sm font-body text-stone-grey mb-8">
          {{
            filter === 'all'
              ? t('orders.empty.all')
              : t('orders.empty.filtered', { filter: getFilterLabel() })
          }}
        </p>
        <router-link to="/boutique"
          class="inline-block bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200">
          {{ t('orders.empty.browse') }}
        </router-link>
      </div>

      <!-- Liste des commandes -->
      <div v-else class="space-y-4">
        <div v-for="order in filteredOrders" :key="order.id"
          class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <!-- En-tête de la commande -->
          <div class="px-6 py-5 border-b border-antique-bronze/10">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <h3 class="text-xl font-medieval font-bold text-iron-black">
                    {{ t('orders.item.title', { id: Math.floor(order.id) }) }}
                  </h3>
                  <span :class="[
                    'px-3 py-1 text-xs font-body font-bold rounded-full',
                    getStatusBadgeClass(order.etat_commande)
                  ]">
                    {{ getStatusLabel(order.etat_commande) }}
                  </span>
                </div>
                <div class="space-y-1.5 text-sm font-body text-stone-grey">
                  <p class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-antique-bronze flex-shrink-0" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="font-medium text-iron-black">{{ getLocationName(order.id_location) }}</span>
                  </p>
                  <p class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-antique-bronze flex-shrink-0" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(order.date_commande) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs font-body text-stone-grey mb-1">{{ t('orders.item.total') }}</p>
                <p class="text-2xl font-medieval font-bold text-antique-bronze">
                  {{ t('cart.price_format', { price: order.total_price.toFixed(2) }) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Produits -->
          <div class="px-6 py-4 bg-antique-bronze/5">
            <div class="space-y-2">
              <div v-for="ligne in getOrderItems(order.id)" :key="`${order.id}-${ligne.id_product}`"
                class="flex justify-between items-center text-sm font-body py-2">
                <span class="text-stone-grey">
                  <span class="font-medium text-iron-black">{{ ligne.productName }}</span>
                  <span class="text-antique-bronze ml-2">× {{ ligne.quantite }}</span>
                </span>
                <span class="font-semibold text-iron-black">
                  {{ (ligne.price * ligne.quantite).toFixed(2) }} gold
                </span>
              </div>
            </div>

            <div v-if="order.date_collect" class="mt-4 pt-4 border-t border-antique-bronze/10">
              <p class="text-sm font-body text-green-700 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ t('orders.item.collected_at', { date: formatDate(order.date_collect) }) }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 bg-white/40">
            <button v-if="order.etat_commande === EtatCommande.WAITING" @click="goToPayment"
              class="w-full bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200 flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {{ t('orders.actions.pay') }}
            </button>
            <div v-else-if="order.etat_commande === EtatCommande.PAID"
              class="w-full bg-green-50 text-green-700 font-body py-4 px-6 rounded-md border border-green-200">
              <!-- QR Code Display -->
              <div v-if="order.qrToken" class="flex flex-col items-center gap-3">
                <p class="font-semibold text-sm flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  {{ t('orders.actions.qr_code') }}
                </p>
                <div class="bg-white p-3 rounded-lg shadow-inner">
                  <canvas :ref="el => setQrCanvasRef(el, order.id)" class="qr-canvas"></canvas>
                </div>
                <p class="text-xs text-green-600">{{ t('orders.actions.qr_scan_hint') }}</p>
              </div>
              <!-- Fallback if no QR token -->
              <div v-else class="text-center flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-semibold">{{ t('orders.actions.paid_waiting') }}</span>
              </div>
            </div>
            <div v-else
              class="w-full bg-blue-50 text-blue-700 font-body font-semibold py-3 px-6 rounded-md text-center flex items-center justify-center gap-2 border border-blue-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ t('orders.actions.collected') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { COMMANDES, EtatCommande } from '@/mocks/commande'
import { LIGNES_COMMANDE } from '@/mocks/ligneCommande'
import { productService } from '@/services/productService'

import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()
const filter = ref<'all' | EtatCommande>(route.query.allPaid === 'true' ? EtatCommande.PAID : 'all')

// QR Code canvas refs
const qrCanvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map())

const setQrCanvasRef = (el: unknown, orderId: number) => {
  if (el instanceof HTMLCanvasElement) {
    qrCanvasRefs.value.set(orderId, el)
  }
}

async function renderQRCodes() {
  await nextTick()
  for (const order of filteredOrders.value) {
    if (order.etat_commande === EtatCommande.PAID && order.qrToken) {
      const canvas = qrCanvasRefs.value.get(order.id)
      if (canvas) {
        try {
          await QRCode.toCanvas(canvas, order.qrToken, {
            width: 150,
            margin: 1,
            color: {
              dark: '#166534',
              light: '#ffffff',
            },
          })
        } catch (error) {
          console.error('Failed to render QR code for order', order.id, error)
        }
      }
    }
  }
}

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

// Récupérer le nom de la location (boutique)
const getLocationName = (locationId: number): string => {
  return productService.getLocation(locationId)
}



// Récupérer les items d'une commande
const getOrderItems = (orderId: number) => {
  const lignes = LIGNES_COMMANDE.filter((ligne) => ligne.id_commande === orderId)
  const allProducts = productService.getProductsForBoutique()
  return lignes.map((ligne) => {
    const product = allProducts.find((p) => p.id === ligne.id_product)
    return {
      id_product: ligne.id_product,
      productName: product?.name || t('orders.item.unknown_product'),
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
      return t('orders.status.waiting')
    case EtatCommande.PAID:
      return t('orders.status.paid')
    case EtatCommande.COLLECTED:
      return t('orders.status.collected')
    default:
      return t('orders.status.unknown')
  }
}



// Obtenir la classe CSS du badge de statut
const getStatusBadgeClass = (etat: EtatCommande): string => {
  switch (etat) {
    case EtatCommande.WAITING:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case EtatCommande.PAID:
      return 'bg-green-100 text-green-800 border-green-200'
    case EtatCommande.COLLECTED:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-stone-grey/10 text-stone-grey border-stone-grey/20'
  }
}

// Obtenir le label du filtre
const getFilterLabel = (): string => {
  switch (filter.value) {
    case EtatCommande.WAITING:
      return t('orders.filter_labels.waiting')
    case EtatCommande.PAID:
      return t('orders.filter_labels.paid')
    case EtatCommande.COLLECTED:
      return t('orders.filter_labels.collected')
    default:
      return ''
  }
}

// Aller vers la page de paiement
const goToPayment = () => {
  router.push({ name: 'checkout' })
}

onMounted(async () => {
  // Rediriger si pas connecté
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  // Render QR codes after component is mounted
  await renderQRCodes()
})

// Watch filteredOrders to re-render QR codes when filter changes
watch(filteredOrders, async () => {
  await renderQRCodes()
})
</script>
