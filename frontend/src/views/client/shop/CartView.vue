<template>
  <div class="min-h-screen bg-parchment pt-32 pb-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
          <i class="fas fa-shopping-cart mr-3 text-antique-bronze"></i>
          {{ t('cart.page_title') }}
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
        <p class="text-base font-body text-stone-grey">{{ t('cart.items_pending', { count: cartStore.itemCount }) }}</p>
      </div>

      <!-- Panier vide -->
      <div v-if="cartStore.isEmpty" class="text-center py-16 bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 shadow-sm">
        <div class="w-20 h-20 bg-antique-bronze/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-shopping-basket text-4xl text-antique-bronze/50"></i>
        </div>
        <p class="text-xl font-medieval text-iron-black mb-2">{{ t('cart.empty_page_title') }}</p>
        <p class="text-sm font-body text-stone-grey mb-8">{{ t('cart.empty_subtitle') }}</p>
        <router-link
          to="/boutique"
          class="inline-flex items-center bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200"
        >
          <i class="fas fa-store mr-2"></i>
          {{ t('cart.visit_shops') }}
        </router-link>
      </div>

      <!-- Panier avec articles -->
      <div v-else>
        <!-- Articles groupés par location (boutique) -->
        <div v-for="(items, locationId) in cartStore.groupedByLocation" :key="locationId" class="mb-8">
          <!-- En-tête de la location -->
          <div class="bg-antique-bronze/10 border border-antique-bronze/30 rounded-t-lg px-6 py-4 flex items-center justify-between backdrop-blur-sm">
            <div>
              <h2 class="font-medieval font-bold text-lg text-iron-black flex items-center">
                <i class="fas fa-map-marker-alt mr-2 text-antique-bronze"></i>
                {{ getLocationName(Number(locationId)) }}
              </h2>
              <p class="text-sm font-body text-stone-grey mt-1 italic">
                {{ t('cart.merchant', { name: getPrestataireNameForLocation(Number(locationId)) }) }}
              </p>
            </div>
            <div class="text-right hidden sm:block">
              <span class="text-xs font-body text-stone-grey uppercase tracking-wider">{{ t('cart.subtotal') }}</span>
              <p class="font-medieval font-bold text-antique-bronze text-lg">
                {{ calculateSubtotal(items).toFixed(2) }} gold
              </p>
            </div>
          </div>

          <!-- Liste des articles de la location -->
          <div class="bg-white/30 border-x border-b border-antique-bronze/20 rounded-b-lg p-4 space-y-3 backdrop-blur-sm">
            <CartItemComponent
              v-for="item in items"
              :key="item.id_product"
              :item="item"
            />
            
            <!-- Sous-total mobile -->
            <div class="sm:hidden pt-4 mt-2 border-t border-antique-bronze/10 flex justify-between items-center">
              <span class="font-body text-stone-grey">{{ t('cart.subtotal') }}</span>
              <span class="font-medieval font-bold text-antique-bronze text-lg">
                {{ calculateSubtotal(items).toFixed(2) }} gold
              </span>
            </div>
          </div>
        </div>

        <!-- Récapitulatif global -->
        <div class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 p-6 mb-8 shadow-sm">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-center sm:text-left">
              <p class="text-sm font-body text-stone-grey mb-1">{{ t('cart.total_to_pay') }}</p>
              <p class="text-3xl font-medieval font-bold text-antique-bronze">
                {{ cartStore.total.toFixed(2) }} gold
              </p>
            </div>
            <div class="text-sm font-body text-stone-grey bg-antique-bronze/5 px-4 py-2 rounded-md border border-antique-bronze/10">
              <i class="fas fa-info-circle mr-2 text-antique-bronze"></i>
              {{ t('cart.split_order_info') }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link
            to="/boutique"
            class="flex-1 bg-stone-grey/10 hover:bg-stone-grey/20 text-stone-grey font-body font-bold py-4 px-6 rounded-md transition-colors text-center border border-stone-grey/20"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            {{ t('cart.continue_shopping') }}
          </router-link>
          
          <button
            @click="handleCheckout"
            :disabled="isProcessing"
            class="flex-1 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-4 px-6 rounded-md shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i v-if="!isProcessing" class="fas fa-scroll mr-2"></i>
            <i v-else class="fas fa-spinner fa-spin mr-2"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal connexion requise -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showLoginModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="showLoginModal = false">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-parchment rounded-lg shadow-2xl border-2 border-antique-bronze/40 max-w-md w-full p-8 text-center transform transition-all">
            <!-- Close button -->
            <button @click="showLoginModal = false" class="absolute top-3 right-3 text-stone-grey/60 hover:text-iron-black transition-colors">
              <i class="fas fa-times text-lg"></i>
            </button>

            <!-- Icon -->
            <div class="w-20 h-20 bg-antique-bronze/10 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-antique-bronze/20">
              <i class="fas fa-lock text-3xl text-antique-bronze"></i>
            </div>

            <!-- Title -->
            <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
              Connexion requise
            </h3>

            <!-- Description -->
            <p class="text-stone-grey font-body mb-6 leading-relaxed">
              Vous devez être connecté pour finaliser votre commande. Rejoignez l'aventure !
            </p>

            <!-- Actions -->
            <div class="flex flex-col gap-3">
              <router-link
                to="/login"
                class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-3 px-6 rounded-md shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <i class="fas fa-sign-in-alt"></i>
                Se connecter
              </router-link>
              <router-link
                to="/register"
                class="w-full bg-white/80 hover:bg-white text-antique-bronze font-medieval font-bold py-3 px-6 rounded-md border-2 border-antique-bronze/30 hover:border-antique-bronze transition-all duration-200 flex items-center justify-center gap-2"
              >
                <i class="fas fa-user-plus"></i>
                Créer un compte
              </router-link>
            </div>

            <!-- Divider -->
            <div class="mt-5 pt-4 border-t border-antique-bronze/15">
              <button @click="showLoginModal = false" class="text-sm text-stone-grey hover:text-antique-bronze transition-colors font-body">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore, type CartItem } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { USERS } from '@/mocks/users'
import { productService } from '@/services/productService'
import CartItemComponent from '@/components/shop/CartItem.vue'

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const authStore = useAuthStore()
const isProcessing = ref(false)
const showLoginModal = ref(false)

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
  return t('shop.unknown_provider')
}

// Calculer le sous-total pour un groupe de location
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// Gérer le passage de commande
const handleCheckout = async () => {
  if (cartStore.isEmpty) return

  // Vérifier si l'utilisateur est connecté
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }

  isProcessing.value = true

  try {
    // Créer les commandes (séparées par location)
    cartStore.createOrder()

    // Simuler un petit délai pour l'UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Rediriger vers la page de paiement
    router.push({ name: 'checkout' })
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    alert(t('cart.error_creating_order'))
  } finally {
    isProcessing.value = false
  }
}
</script>
