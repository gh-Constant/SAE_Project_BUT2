<template>
  <div class="min-h-screen bg-parchment py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
          {{ t('checkout.title') }}
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
        <p class="text-base font-body text-stone-grey">{{ t('checkout.subtitle') }}</p>
      </div>

      <div v-if="pendingOrders.length === 0" class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 p-16 text-center shadow-sm">
        <div class="w-20 h-20 bg-green-100/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        </div>
        <p class="text-xl font-medieval text-iron-black mb-2">{{ t('checkout.all_paid.title') }}</p>
        <p class="text-sm font-body text-stone-grey mb-8">{{ t('checkout.all_paid.description') }}</p>
        <router-link
          to="/commandes"
          class="inline-flex items-center bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ t('checkout.all_paid.button') }}
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div
              v-for="order in pendingOrders"
              :key="order.id"
              class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div class="px-6 py-4 border-b border-antique-bronze/10 flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medieval font-bold text-iron-black">
                    {{ t('checkout.order_card.title', { id: Math.floor(order.id) }) }}
                  </h3>
                  <p class="text-sm font-body text-stone-grey mt-1 flex items-center gap-2">
                    <svg class="w-4 h-4 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ getLocationName(order.id_location) }}
                  </p>
                </div>
                <span class="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold font-body rounded-full border border-orange-200 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ t('checkout.order_card.waiting') }}
                </span>
              </div>

              <div class="px-6 py-4 bg-antique-bronze/5">
                <div class="space-y-2 mb-4">
                  <div
                    v-for="ligne in getOrderItems(order.id)"
                    :key="`${order.id}-${ligne.id_product}`"
                    class="flex justify-between items-center text-sm font-body"
                  >
                    <span class="text-stone-grey">
                      <span class="font-medium text-iron-black">{{ ligne.productName }}</span>
                      <span class="text-antique-bronze ml-2">× {{ ligne.quantite }}</span>
                    </span>
                    <span class="font-semibold text-iron-black">
                      {{ (ligne.price * ligne.quantite).toFixed(2) }} gold
                    </span>
                  </div>
                </div>
              </div>

              <div class="px-6 py-4 bg-white/40 border-t border-antique-bronze/10 flex justify-between items-center">
                 <div class="text-left">
                    <p class="text-xs font-body text-stone-grey">{{ t('checkout.order_card.total_order') }}</p>
                    <p class="text-xl font-medieval font-bold text-antique-bronze">
                      {{ order.total_price.toFixed(2) }} gold
                    </p>
                  </div>
                
                <button
                  @click="payOrder(order.id)"
                  :disabled="isPaying[order.id] || order.etat_commande !== EtatCommande.WAITING"
                  :class="[
                    'py-2 px-6 rounded-md font-body font-semibold shadow-md transition-all duration-200 flex items-center gap-2',
                    order.etat_commande !== EtatCommande.WAITING || isPaying[order.id]
                      ? 'bg-stone-grey/20 text-stone-grey cursor-not-allowed'
                      : 'bg-antique-bronze hover:brightness-110 text-white'
                  ]"
                >
                  <svg v-if="!isPaying[order.id]" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isPaying[order.id] ? t('checkout.order_card.processing') : t('checkout.order_card.pay') }}
                </button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
             <div class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 p-6 sticky top-8">
              <h3 class="text-xl font-medieval font-bold text-iron-black mb-4 border-b border-antique-bronze/10 pb-2">
                Récapitulatif
              </h3>
              <div class="space-y-3 font-body">
                <div class="flex justify-between text-stone-grey text-sm">
                  <span>Commandes à payer</span>
                  <span class="font-bold text-iron-black">{{ pendingOrders.length }}</span>
                </div>
                <div class="flex justify-between text-stone-grey text-sm">
                  <span>Commandes déjà payées</span>
                  <span class="font-bold text-iron-black">{{ paidOrdersCount }}/{{ totalOrdersCount }}</span>
                </div>
                
                <div class="h-px bg-antique-bronze/20 my-2"></div>
                
                <div class="flex justify-between items-end">
                  <span class="text-base font-semibold text-iron-black">{{ t('checkout.summary.grand_total') }}</span>
                  <span class="text-2xl font-medieval font-bold text-antique-bronze">
                    {{ totalToPay.toFixed(2) }} gold
                  </span>
                </div>
              </div>

              <div class="mt-6 p-4 bg-antique-bronze/10 rounded-md">
                <p class="text-xs text-stone-grey italic text-center">
                  {{ t('checkout.summary.quote') }}
                </p>
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
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { COMMANDES, EtatCommande } from '@/mocks/commande'
import { LIGNES_COMMANDE } from '@/mocks/ligneCommande'
import { productService } from '@/services/productService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t } = useI18n()
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
      (cmd.etat_commande === EtatCommande.PAID || cmd.etat_commande === EtatCommande.COLLECTED) // Note: Fixed enum PAIED -> PAID to match logic usually
  ).length
})

// Récupérer le nom de la location (boutique)
const getLocationName = (locationId: number): string => {
  return productService.getLocation(locationId)
}

// Récupérer le nom du prestataire (Not used in new template but kept for logic)
// const getPrestataireName = (prestataireId: number): string => {
//   const prestataire = USERS.find((u) => u.id === prestataireId)
//   return prestataire ? `${prestataire.firstname} ${prestataire.lastname}` : `Prestataire #${prestataireId}`
// }

// Récupérer les items d'une commande
const getOrderItems = (orderId: number) => {
  const lignes = LIGNES_COMMANDE.filter((ligne) => ligne.id_commande === orderId)
  const allProducts = productService.getProductsForBoutique()
  return lignes.map((ligne) => {
    const product = allProducts.find((p) => p.id === ligne.id_product)
    return {
      id_product: ligne.id_product,
      productName: product?.name || t('checkout.order_card.unknown_product'),
      quantite: ligne.quantite,
      price: ligne.price,
    }
  })
}

// Décrémenter le stock pour une commande
const decreaseStockForOrder = async (orderId: number) => {
  const lignes = LIGNES_COMMANDE.filter((ligne) => ligne.id_commande === orderId)
  const allProducts = await productService.getProducts()
  
  for (const ligne of lignes) {
    const product = allProducts.find((p) => p.id === ligne.id_product)
    if (product) {
      product.stock = Math.max(0, product.stock - ligne.quantite)
      await productService.updateProduct(product)
    }
  }
}

// Payer une commande
const payOrder = async (orderId: number) => {
  const order = COMMANDES.find((cmd) => cmd.id === orderId)
  if (!order || order.etat_commande !== EtatCommande.WAITING) return

  isPaying.value[orderId] = true

  try {
    // Simuler un délai de paiement
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Décrémenter le stock
    await decreaseStockForOrder(orderId)

    // Changer l'état de la commande
    order.etat_commande = EtatCommande.PAID

    // Vérifier si tout est payé
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
    alert(t('checkout.order_card.error_paying'))
  } finally {
    isPaying.value[orderId] = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>