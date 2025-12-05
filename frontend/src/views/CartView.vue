<template>
  <div class="min-h-screen bg-parchment py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
          <i class="fas fa-shopping-cart mr-3 text-antique-bronze"></i>
          Votre Besace
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
        <p class="text-base font-body text-stone-grey">{{ cartStore.itemCount }} article(s) en attente d'acquisition</p>
      </div>

      <!-- Panier vide -->
      <div v-if="cartStore.isEmpty" class="text-center py-16 bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 shadow-sm">
        <div class="w-20 h-20 bg-antique-bronze/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-shopping-basket text-4xl text-antique-bronze/50"></i>
        </div>
        <p class="text-xl font-medieval text-iron-black mb-2">Votre besace est vide</p>
        <p class="text-sm font-body text-stone-grey mb-8">Les échoppes du royaume regorgent de trésors.</p>
        <router-link
          to="/boutique"
          class="inline-flex items-center bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200"
        >
          <i class="fas fa-store mr-2"></i>
          Visiter les échoppes
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
                Marchand : {{ getPrestataireNameForLocation(Number(locationId)) }}
              </p>
            </div>
            <div class="text-right hidden sm:block">
              <span class="text-xs font-body text-stone-grey uppercase tracking-wider">Sous-total</span>
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
              <span class="font-body text-stone-grey">Sous-total</span>
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
              <p class="text-sm font-body text-stone-grey mb-1">Total à régler</p>
              <p class="text-3xl font-medieval font-bold text-antique-bronze">
                {{ cartStore.total.toFixed(2) }} gold
              </p>
            </div>
            <div class="text-sm font-body text-stone-grey bg-antique-bronze/5 px-4 py-2 rounded-md border border-antique-bronze/10">
              <i class="fas fa-info-circle mr-2 text-antique-bronze"></i>
              Les commandes seront traitées séparément par boutique.
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
            Continuer mes achats
          </router-link>
          
          <button
            @click="handleCheckout"
            :disabled="isProcessing"
            class="flex-1 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-4 px-6 rounded-md shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i v-if="!isProcessing" class="fas fa-scroll mr-2"></i>
            <i v-else class="fas fa-spinner fa-spin mr-2"></i>
            {{ isProcessing ? 'Scellement en cours...' : 'Sceller la commande' }}
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
