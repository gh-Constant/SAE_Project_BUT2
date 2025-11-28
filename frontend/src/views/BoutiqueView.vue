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
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Vue Liste des Boutiques (si pas de locationId) -->
      <div v-if="!locationIdFromRoute">
        <!-- En-tête -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            <i class="fas fa-store mr-3 text-orange-500"></i>
            Nos Boutiques
          </h1>
          <p class="text-gray-600">Découvrez nos boutiques et leurs produits artisanaux</p>
        </div>

        <!-- Grille de boutiques -->
        <div v-if="availableLocations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="location in availableLocations"
            :key="location.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
            @click="goToLocation(location.id)"
          >
            <!-- Image de la boutique -->
            <div class="h-48 bg-gray-200 overflow-hidden">
              <img
                v-if="location.bannerImage"
                :src="location.bannerImage"
                :alt="location.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                <i class="fas fa-store text-6xl text-orange-400"></i>
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ location.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-2 flex items-center">
                <i class="fas fa-user-tie mr-2 text-orange-500"></i>
                {{ getPrestataireNameForLocation(location.id) }}
              </p>
              <p class="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                {{ location.description }}
              </p>
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <span class="text-sm text-gray-600 flex items-center">
                  <i class="fas fa-boxes mr-2 text-orange-500"></i>
                  <span class="font-semibold">{{ getProductCountForLocation(location.id) }}</span>
                  {{ getProductCountForLocation(location.id) > 1 ? 'produits' : 'produit' }}
                </span>
                <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center font-semibold text-sm">
                  Voir les produits
                  <i class="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucune boutique -->
        <div v-else class="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <i class="fas fa-store text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Aucune boutique disponible
          </h3>
          <p class="text-gray-600 mb-6">
            Les boutiques seront bientôt disponibles.
          </p>
        </div>
      </div>

      <!-- Vue Produits d'une Boutique (si locationId présent) -->
      <div v-else>
        <!-- En-tête avec retour -->
        <div class="mb-8">
          <button
            @click="goBackToBoutiques"
            class="mb-4 inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold transition-colors"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Retour aux boutiques
          </button>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            <i class="fas fa-store mr-3 text-orange-500"></i>
            {{ getLocationName(locationIdFromRoute) }}
          </h1>
          <p class="text-gray-600">
            {{ getPrestataireNameForLocation(locationIdFromRoute) }} • {{ getProductCountForLocation(locationIdFromRoute) }} produit(s)
          </p>
        </div>

        <!-- Barre de recherche et filtres -->
        <div class="mb-6 space-y-4">
        <!-- Ligne 1 : Recherche et Tri -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Champ de recherche -->
            <div class="flex-1">
              <label for="search" class="sr-only">Rechercher un produit</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input
                  id="search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher un produit..."
                  class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-orange-600 transition-colors"
                  title="Effacer la recherche"
                >
                  <i class="fas fa-times text-gray-400"></i>
                </button>
              </div>
            </div>

            <!-- Tri -->
            <div class="md:w-48">
              <label for="sortBy" class="sr-only">Trier par</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-sort text-gray-400"></i>
                </div>
                <select
                  id="sortBy"
                  v-model="sortBy"
                  class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white cursor-pointer"
                >
                  <option value="name-asc">Nom (A-Z)</option>
                  <option value="name-desc">Nom (Z-A)</option>
                  <option value="price-asc">Prix (Croissant)</option>
                  <option value="price-desc">Prix (Décroissant)</option>
                  <option value="stock-desc">Stock (Élevé)</option>
                  <option value="stock-asc">Stock (Faible)</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ligne 2 : Filtres avancés -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="flex flex-col lg:flex-row gap-4">

            <!-- Filtre par prix -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-coins mr-1 text-orange-500"></i>
                Prix (gold)
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="priceMin"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Min"
                  class="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
                <span class="text-gray-500">-</span>
                <input
                  v-model.number="priceMax"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Max"
                  class="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
            </div>

            <!-- Filtre par stock -->
            <div class="flex-1">
              <label for="stockFilter" class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-box mr-1 text-orange-500"></i>
                Disponibilité
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-check-circle text-gray-400"></i>
                </div>
                <select
                  id="stockFilter"
                  v-model="stockFilter"
                  class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Tous les produits</option>
                  <option value="in-stock">En stock</option>
                  <option value="low-stock">Stock limité (&lt; 5)</option>
                  <option value="out-of-stock">Rupture de stock</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges des filtres actifs et résultats -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Badges des filtres actifs -->
          <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
            <span
              v-if="searchQuery"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              Recherche: "{{ searchQuery }}"
              <button @click="searchQuery = ''" class="ml-2 hover:text-orange-900">
                <i class="fas fa-times"></i>
              </button>
            </span>
            <span
              v-if="priceMin || priceMax"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              Prix: {{ priceMin || 0 }} - {{ priceMax || '∞' }} gold
              <button @click="priceMin = null; priceMax = null" class="ml-2 hover:text-green-900">
                <i class="fas fa-times"></i>
              </button>
            </span>
            <span
              v-if="stockFilter !== 'all'"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              {{ getStockFilterLabel(stockFilter) }}
              <button @click="stockFilter = 'all'" class="ml-2 hover:text-purple-900">
                <i class="fas fa-times"></i>
              </button>
            </span>
            <button
              @click="clearFilters"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <i class="fas fa-times-circle mr-1"></i>
              Tout effacer
            </button>
          </div>

          <!-- Compteur de résultats -->
          <div class="ml-auto text-sm text-gray-600">
            <span class="font-semibold text-gray-900">{{ filteredProducts.length }}</span>
            {{ filteredProducts.length > 1 ? 'produits trouvés' : 'produit trouvé' }}
            <span v-if="hasActiveFilters" class="text-gray-500">
              (sur {{ PRODUCTS.length }} au total)
            </span>
          </div>
        </div>
      </div>

      <!-- Liste des produits -->
      <div v-if="filteredProducts.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <!-- Message si aucun produit -->
      <div v-else class="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
        <div v-if="hasActiveFilters" class="max-w-md mx-auto">
          <i class="fas fa-filter text-6xl text-orange-300 mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Aucun produit ne correspond à vos critères
          </h3>
          <p class="text-gray-600 mb-6">
            Essayez de modifier vos filtres ou votre recherche pour trouver d'autres produits.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              @click="clearFilters"
              class="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <i class="fas fa-redo mr-2"></i>
              Réinitialiser tous les filtres
            </button>
            <button
              @click="searchQuery = ''"
              v-if="searchQuery"
              class="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <i class="fas fa-search-minus mr-2"></i>
              Effacer la recherche
            </button>
          </div>
        </div>
        <div v-else class="max-w-md mx-auto">
          <i class="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            Aucun produit disponible
          </h3>
          <p class="text-gray-600 mb-6">
            La boutique est actuellement vide. Les produits seront bientôt disponibles.
          </p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProductMock } from '@/mocks/products'
import { USERS, UserMock } from '@/mocks/users'
import { PRESTATAIRE_ROLE_ID } from '@/mocks/roles'
import { productService } from '@/services/productService'
import { locationsMock, LocationMock } from '@/mocks/locations'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

// Détecter si on est sur la liste des boutiques ou sur une boutique spécifique
const locationIdFromRoute = computed(() => {
  const id = route.params.locationId
  return id ? Number(id) : null
})

// Récupérer tous les produits dynamiques depuis productService
const ALL_PRODUCTS = computed(() => productService.getProductsForBoutique())

// Récupérer les produits filtrés par location si locationId présent
const PRODUCTS = computed(() => {
  if (!locationIdFromRoute.value) {
    return ALL_PRODUCTS.value
  }
  
  // Filtrer par locationId : convertir locationId vers produits via productService
  const productsInStore = productService.getProducts()
  const productIdsForLocation = productsInStore
    .filter(p => p.locationId === locationIdFromRoute.value)
    .map(p => p.id)
  
  return ALL_PRODUCTS.value.filter(p => productIdsForLocation.includes(p.id))
})

// Liste des locations (boutiques) qui ont des produits
const availableLocations = computed(() => {
  const products = productService.getProducts()
  const locationIdsWithProducts = new Set(products.map(p => p.locationId))
  
  return locationsMock.filter(loc => 
    loc.type === 'prestataire' && 
    loc.purchased && 
    loc.userId !== null &&
    locationIdsWithProducts.has(loc.id)
  )
})

// État de la recherche et filtres
const searchQuery = ref('')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const stockFilter = ref<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all')
const sortBy = ref<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'>('name-asc')

// Fonctions utilitaires pour les boutiques
const getLocationName = (locationId: number): string => {
  return productService.getLocation(locationId)
}

const getPrestataireNameForLocation = (locationId: number): string => {
  const location = locationsMock.find(l => l.id === locationId)
  if (!location || !location.userId) return 'Prestataire inconnu'
  const prestataire = USERS.find(u => u.id === location.userId)
  return prestataire ? `${prestataire.firstname} ${prestataire.lastname}` : 'Prestataire inconnu'
}

const getProductCountForLocation = (locationId: number): number => {
  const productsInStore = productService.getProducts()
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
      return 'En stock'
    case 'low-stock':
      return 'Stock limité'
    case 'out-of-stock':
      return 'Rupture de stock'
    default:
      return 'Tous'
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
const filteredProducts = computed(() => {
  let products = [...PRODUCTS.value] // Utiliser .value car PRODUCTS est un computed (déjà filtré par location si nécessaire)

  // Filtre par recherche (nom ou description)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    products = products.filter((p: ProductMock) => {
      const nameMatch = p.name.toLowerCase().includes(query)
      const descMatch = p.description?.toLowerCase().includes(query) || false
      return nameMatch || descMatch
    })
  }

  // Filtre par prix
  if (priceMin.value !== null) {
    products = products.filter((p: ProductMock) => p.price >= priceMin.value!)
  }
  if (priceMax.value !== null) {
    products = products.filter((p: ProductMock) => p.price <= priceMax.value!)
  }

  // Filtre par stock
  switch (stockFilter.value) {
    case 'in-stock':
      products = products.filter((p: ProductMock) => p.stock > 0)
      break
    case 'low-stock':
      products = products.filter((p: ProductMock) => p.stock > 0 && p.stock < 5)
      break
    case 'out-of-stock':
      products = products.filter((p: ProductMock) => p.stock === 0)
      break
  }

  // Tri
  products.sort((a: ProductMock, b: ProductMock) => {
    switch (sortBy.value) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'stock-desc':
        return b.stock - a.stock
      case 'stock-asc':
        return a.stock - b.stock
      default:
        return 0
    }
  })

  return products
})

// Réinitialiser tous les filtres
const clearFilters = () => {
  searchQuery.value = ''
  priceMin.value = null
  priceMax.value = null
  stockFilter.value = 'all'
  sortBy.value = 'name-asc'
}
</script>

