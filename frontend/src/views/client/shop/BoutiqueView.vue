<!--
  @file BoutiqueView.vue
  @description
  Vue pour afficher le catalogue de tous les produits disponibles.

  @utilité
  - Affiche la liste des boutiques (locations) si pas de locationId
  - Affiche les produits d'une boutique spécifique si locationId présent
  - Permet de filtrer et rechercher les produits
  - Utilise ProductCard pour afficher chaque produit
-->
<template>
  <div class="min-h-screen bg-parchment pt-32 pb-8 font-body text-stone-grey">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Vue Liste des Boutiques (si pas de locationId) -->
      <div v-if="!locationIdFromRoute">
        <!-- En-tête -->
        <div class="mb-8 text-center">
          <h1 class="text-4xl md:text-5xl font-medieval font-bold text-iron-black mb-4">
            <i class="fas fa-store mr-3 text-antique-bronze"></i>
            {{ t('shop.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-6"></div>
          <p class="text-lg text-stone-grey">{{ t('shop.subtitle') }}</p>
        </div>

        <!-- Grille de boutiques -->
        <div v-if="availableLocations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="location in availableLocations" :key="location.id"
            class="bg-white/60 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border-2 border-antique-bronze/20 hover:border-antique-bronze/60"
            @click="goToLocation(location.id)">
            <!-- Image de la boutique -->
            <div class="h-48 bg-antique-bronze/10 overflow-hidden relative">
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
              <img v-if="location.banner_image" :src="location.banner_image" :alt="location.name"
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="fas fa-store text-6xl text-antique-bronze/40"></i>
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-6 relative">
              <h3 class="text-2xl font-medieval font-bold text-iron-black mb-2">
                {{ location.name }}
              </h3>
              <p class="text-sm text-stone-grey mb-3 flex items-center font-bold">
                <i class="fas fa-user-tie mr-2 text-antique-bronze"></i>
                {{ getPrestataireNameForLocation(location.id) }}
              </p>
              <p class="text-sm text-stone-grey mb-5 line-clamp-2 min-h-[2.5rem] italic">
                {{ location.description }}
              </p>
              <div class="flex items-center justify-between pt-4 border-t border-antique-bronze/20">
                <span class="text-sm text-stone-grey flex items-center font-bold">
                  <i class="fas fa-boxes mr-2 text-antique-bronze"></i>

                  {{ t('shop.products_count', { count: getProductCountForLocation(location.id) }) }}
                </span>
                <span
                  class="text-antique-bronze font-medieval font-bold flex items-center group-hover:translate-x-1 transition-transform">
                  {{ t('shop.visit') }}
                  <i class="fas fa-arrow-right ml-2"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucune boutique -->
        <div v-else class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
          <i class="fas fa-store-slash text-6xl text-antique-bronze/30 mb-4"></i>
          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
            {{ t('shop.no_shops.title') }}
          </h3>
          <p class="text-stone-grey mb-6">
            {{ t('shop.no_shops.description') }}
          </p>
        </div>
      </div>

      <!-- Vue Produits d'une Boutique (si locationId présent) -->
      <div v-else>
        <!-- En-tête avec retour -->
        <div class="mb-8">
          <button @click="goBackToBoutiques"
            class="mb-6 inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group">
            <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {{ t('shop.back_to_shops') }}
          </button>

          <div class="bg-white/60 p-6 rounded-sm border-2 border-antique-bronze/20 shadow-sm">
            <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center">
              <i class="fas fa-store mr-4 text-antique-bronze"></i>
              {{ getLocationName(locationIdFromRoute) }}
            </h1>
            <p class="text-stone-grey font-bold flex items-center mt-2">
              <i class="fas fa-user-tie mr-2 text-antique-bronze"></i>
              {{ getPrestataireNameForLocation(locationIdFromRoute) }}
              <span class="mx-3 text-antique-bronze/40">|</span>
              <i class="fas fa-boxes mr-2 text-antique-bronze"></i>
              {{ t('shop.products_count', { count: getProductCountForLocation(locationIdFromRoute) }) }}
            </p>
          </div>
        </div>

        <!-- Barre de recherche et filtres -->
        <div class="mb-8 space-y-4">
          <!-- Ligne 1 : Recherche et Tri -->
          <div class="bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Champ de recherche -->
              <div class="flex-1">
                <label for="search" class="sr-only">{{ t('shop.filters.search_label') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-antique-bronze/50"></i>
                  </div>
                  <input id="search" v-model="searchQuery" type="text"
                    :placeholder="t('shop.filters.search_placeholder')"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body" />
                  <button v-if="searchQuery" @click="searchQuery = ''"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-antique-bronze transition-colors"
                    :title="t('shop.filters.clear_search')">
                    <i class="fas fa-times text-stone-grey/50"></i>
                  </button>
                </div>
              </div>

              <!-- Tri -->
              <div class="md:w-56">
                <label for="sortBy" class="sr-only">{{ t('shop.filters.sort_label') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-sort text-antique-bronze/50"></i>
                  </div>
                  <select id="sortBy" v-model="sortBy"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey appearance-none cursor-pointer font-body">
                    <option value="name-asc">{{ t('shop.sort_options.name_asc') }}</option>
                    <option value="name-desc">{{ t('shop.sort_options.name_desc') }}</option>
                    <option value="price-asc">{{ t('shop.sort_options.price_asc') }}</option>
                    <option value="price-desc">{{ t('shop.sort_options.price_desc') }}</option>
                    <option value="stock-desc">{{ t('shop.sort_options.stock_desc') }}</option>
                    <option value="stock-asc">{{ t('shop.sort_options.stock_asc') }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i class="fas fa-chevron-down text-antique-bronze/50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ligne 2 : Filtres avancés -->
          <div class="bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20">
            <div class="flex flex-col lg:flex-row gap-4">

              <!-- Filtre par prix -->
              <div class="flex-1">
                <label class="block text-sm font-medieval font-bold text-iron-black mb-2">
                  <i class="fas fa-coins mr-1 text-antique-bronze"></i>
                  {{ t('shop.filters.price_label') }}
                </label>
                <div class="flex items-center gap-2">
                  <input v-model.number="priceMin" @input="fetchProducts" type="number" min="0" step="0.01"
                    :placeholder="t('shop.filters.min')"
                    class="flex-1 py-2.5 px-3 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body" />
                  <span class="text-stone-grey font-bold">-</span>
                  <input v-model.number="priceMax" @input="fetchProducts" type="number" min="0" step="0.01"
                    :placeholder="t('shop.filters.max')"
                    class="flex-1 py-2.5 px-3 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body" />
                </div>
              </div>

              <!-- Filtre par stock -->
              <div class="flex-1">
                <label for="stockFilter" class="block text-sm font-medieval font-bold text-iron-black mb-2">
                  <i class="fas fa-box mr-1 text-antique-bronze"></i>
                  {{ t('shop.filters.availability_label') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-check-circle text-antique-bronze/50"></i>
                  </div>
                  <select id="stockFilter" v-model="stockFilter"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey appearance-none cursor-pointer font-body">
                    <option value="all">{{ t('shop.stock_options.all') }}</option>
                    <option value="in-stock">{{ t('shop.stock_options.in_stock') }}</option>
                    <option value="out-of-stock">{{ t('shop.stock_options.out_of_stock') }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i class="fas fa-chevron-down text-antique-bronze/50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Badges des filtres actifs et résultats -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Badges des filtres actifs -->
            <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
              <span v-if="searchQuery"
                class="inline-flex items-center px-3 py-1 rounded-sm text-xs font-bold font-medieval bg-antique-bronze/10 text-antique-bronze border border-antique-bronze/20">
                {{ t('shop.filters.active_search') }} "{{ searchQuery }}"
                <button @click="searchQuery = ''" class="ml-2 hover:text-dark-wood">
                  <i class="fas fa-times"></i>
                </button>
              </span>
              <span v-if="priceMin || priceMax"
                class="inline-flex items-center px-3 py-1 rounded-sm text-xs font-bold font-medieval bg-green-100/50 text-green-800 border border-green-200">
                {{ t('shop.filters.active_price') }} {{ priceMin || 0 }} - {{ priceMax || '∞' }} Gold
                <button @click="priceMin = null; priceMax = null" class="ml-2 hover:text-green-900">
                  <i class="fas fa-times"></i>
                </button>
              </span>
              <span v-if="stockFilter !== 'all'"
                class="inline-flex items-center px-3 py-1 rounded-sm text-xs font-bold font-medieval bg-purple-100/50 text-purple-800 border border-purple-200">
                {{ getStockFilterLabel(stockFilter) }}
                <button @click="stockFilter = 'all'" class="ml-2 hover:text-purple-900">
                  <i class="fas fa-times"></i>
                </button>
              </span>
              <button @click="clearFilters"
                class="inline-flex items-center px-3 py-1 rounded-sm text-xs font-bold font-medieval bg-stone-200/50 text-stone-700 hover:bg-stone-300/50 transition-colors border border-stone-300">
                <i class="fas fa-times-circle mr-1"></i>
                {{ t('shop.filters.clear_all') }}
              </button>
            </div>

            <!-- Compteur de résultats -->
            <div class="ml-auto text-sm text-stone-600 font-body">
              <span class="font-bold text-iron-black">{{ filteredProducts.length }}</span>
              {{ t('shop.results.count', { count: filteredProducts.length }) }}
            </div>
          </div>
        </div>

        <!-- Liste des produits -->
        <div v-if="filteredProducts.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
          </div>
        </div>

        <!-- Message si aucun produit -->
        <div v-else class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
          <div v-if="hasActiveFilters" class="max-w-md mx-auto">
            <i class="fas fa-filter text-6xl text-antique-bronze/30 mb-4"></i>
            <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
              {{ t('shop.results.no_matches.title') }}
            </h3>
            <p class="text-stone-grey mb-6">
              {{ t('shop.results.no_matches.description') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <MedievalButton @click="clearFilters">
                <i class="fas fa-redo mr-2"></i>
                {{ t('shop.filters.reset') }}
              </MedievalButton>
              <MedievalButton @click="searchQuery = ''" v-if="searchQuery" variant="secondary">
                <i class="fas fa-search-minus mr-2"></i>
                {{ t('shop.filters.clear_search') }}
              </MedievalButton>
            </div>
          </div>
          <div v-else class="max-w-md mx-auto">
            <i class="fas fa-box-open text-6xl text-antique-bronze/30 mb-4"></i>
            <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
              {{ t('shop.results.empty_shop.title') }}
            </h3>
            <p class="text-stone-grey mb-6">
              {{ t('shop.results.empty_shop.description') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { USERS } from '@/mocks/users'
import { LocationType } from '@/mocks/locationTypes'
import { productService } from '@/services/productService'
import { useProductStore } from '@/stores/product'
import { locationsMock } from '@/mocks/locations'
import ProductCard from '@/components/shop/ProductCard.vue'
import MedievalButton from '@/components/ui/MedievalButton.vue'


const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const store = useProductStore()

// Détecter si on est sur la liste des boutiques ou sur une boutique spécifique
const locationIdFromRoute = computed(() => {
  const id = route.params.locationId
  return id ? Number(id) : undefined
})

// Récupérer les produits depuis le store (transformés pour l'affichage)
const filteredProducts = computed(() => store.productsForBoutique)


// Liste des locations (boutiques) qui ont des produits
const availableLocations = computed(() => {
  // Use store products if loaded, otherwise fallback to service (mock) or empty
  // Note: On main page, store.products has all products.
  const products = store.products


  const locationIdsWithProducts = new Set(products.map(p => p.locationId))

  return locationsMock.filter(loc =>
    loc.id_location_type === LocationType.PRESTATAIRE_LOCATION_TYPE_ID &&
    loc.purchased &&
    loc.id_prestataire !== undefined &&
    locationIdsWithProducts.has(loc.id)
  )
})

// État de la recherche et filtres
const searchQuery = ref('')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const stockFilter = ref<'all' | 'in-stock' | 'out-of-stock'>('all')
const sortBy = ref<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'>('name-asc')

// Fonctions utilitaires pour les boutiques
const getLocationName = (locationId: number): string => {
  return productService.getLocation(locationId)
}

const getPrestataireNameForLocation = (locationId: number): string => {
  const location = locationsMock.find(l => l.id === locationId)
  if (!location || !location.id_prestataire) return t('shop.unknown_provider')
  const prestataire = USERS.find(u => u.id === location.id_prestataire)
  return prestataire ? `${prestataire.firstname} ${prestataire.lastname}` : t('shop.unknown_provider')
}

const getProductCountForLocation = (locationId: number): number => {
  const productsInStore = store.products
  return productsInStore.filter(p => p.locationId === locationId).length
}

// Navigation
const goToLocation = (locationId: number) => {
  router.push({ name: 'boutique-location', params: { locationId } })
}

const goBackToBoutiques = () => {
  router.push({ name: 'boutique' })
}

// Obtenir le label du filtre stock
const getStockFilterLabel = (filter: string): string => {
  switch (filter) {
    case 'in-stock':
      return t('shop.stock_options.label_in_stock')
    case 'out-of-stock':
      return t('shop.stock_options.label_out_of_stock')
    default:
      return t('shop.stock_options.label_all')
  }
}

// Vérifier si des filtres sont actifs
const hasActiveFilters = computed(() => {
  return !!(
    searchQuery.value ||
    priceMin.value ||
    priceMax.value ||
    stockFilter.value !== 'all'
  )
})

// Filtrer et trier les produits
// const filteredProducts = computed(() => { ... }) // Replaced above

// Fetch products on mount and when filters/route change
const fetchProducts = () => {
  store.fetchProducts({
    search: searchQuery.value,
    minPrice: priceMin.value || undefined,
    maxPrice: priceMax.value || undefined,
    stock: stockFilter.value === 'all' ? undefined : stockFilter.value,
    sortBy: sortBy.value,
    locationId: locationIdFromRoute.value
  })
}

onMounted(() => {
  fetchProducts()
})

watch([locationIdFromRoute, searchQuery, priceMin, priceMax, stockFilter, sortBy], () => {
  fetchProducts()
})

// Réinitialiser tous les filtres
const clearFilters = () => {
  searchQuery.value = ''
  priceMin.value = null
  priceMax.value = null
  stockFilter.value = 'all'
  sortBy.value = 'name-asc'
}

// Validation du prix
// Note: watch is already imported


watch(priceMin, (newMin) => {
  if (newMin !== null && priceMax.value !== null && newMin > priceMax.value) {
    priceMax.value = newMin
  }
})

watch(priceMax, (newMax) => {
  if (newMax !== null && priceMin.value !== null && newMax < priceMin.value) {
    priceMin.value = newMax
  }
})
</script>
