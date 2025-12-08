
<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <svg class="w-8 h-8 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ t('admin.products.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">{{ t('admin.products.subtitle') }}</p>
        </div>

        <div class="mb-8 space-y-4">
          <!-- Ligne 1 : Recherche et Tri -->
          <div class="bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Champ de recherche -->
              <div class="flex-1">
                <label for="search" class="sr-only">{{ t('admin.products.search.label') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-antique-bronze/50"></i>
                  </div>
                  <input
                    id="search"
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('admin.products.search.placeholder')"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body"
                  />
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-antique-bronze transition-colors"
                    :title="t('admin.products.search.clear')"
                  >
                    <i class="fas fa-times text-stone-grey/50"></i>
                  </button>
                </div>
              </div>

              <!-- Tri -->
              <div class="md:w-56">
                <label for="sortBy" class="sr-only">{{ t('admin.products.sort.label') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-sort text-antique-bronze/50"></i>
                  </div>
                  <select
                    id="sortBy"
                    v-model="sortBy"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey appearance-none cursor-pointer font-body"
                  >
                    <option value="name-asc">{{ t('admin.products.sort.name_asc') }}</option>
                    <option value="name-desc">{{ t('admin.products.sort.name_desc') }}</option>
                    <option value="price-asc">{{ t('admin.products.sort.price_asc') }}</option>
                    <option value="price-desc">{{ t('admin.products.sort.price_desc') }}</option>
                    <option value="stock-desc">{{ t('admin.products.sort.stock_desc') }}</option>
                    <option value="stock-asc">{{ t('admin.products.sort.stock_asc') }}</option>
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
                  {{ t('admin.products.filter.price') }}
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model.number="priceMin"
                    @input="fetchProducts"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Min"
                    class="flex-1 py-2.5 px-3 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body"
                  />
                  <span class="text-stone-grey font-bold">-</span>
                  <input
                    v-model.number="priceMax"
                    @input="fetchProducts"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Max"
                    class="flex-1 py-2.5 px-3 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body"
                  />
                </div>
                <p v-if="priceError" class="text-red-600 text-xs mt-1 font-bold">{{ priceError }}</p>
              </div>

              <!-- Filtre par stock -->
              <div class="flex-1">
                <label for="stockFilter" class="block text-sm font-medieval font-bold text-iron-black mb-2">
                  <i class="fas fa-box mr-1 text-antique-bronze"></i>
                  {{ t('admin.products.filter.availability') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-check-circle text-antique-bronze/50"></i>
                  </div>
                  <select
                    id="stockFilter"
                    v-model="stockFilter"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey appearance-none cursor-pointer font-body"
                  >
                    <option value="all">{{ t('admin.products.filter.all') }}</option>
                    <option value="in-stock">{{ t('admin.products.filter.in_stock') }}</option>
                    <option value="out-of-stock">{{ t('admin.products.filter.out_of_stock') }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i class="fas fa-chevron-down text-antique-bronze/50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Bouton de réinitialisation -->
          <div class="flex justify-end">
            <button
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-sm transition-colors font-medieval font-bold text-sm"
            >
              <i class="fas fa-undo mr-2"></i>
              {{ t('admin.products.filter.reset') }}
            </button>
          </div>
        </div>

        <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-antique-bronze/10">
              <thead class="bg-antique-bronze/10">
                <tr>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.products.table.headers.image') }}</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.products.table.headers.name') }}</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.products.table.headers.description') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.products.table.headers.price') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.products.table.headers.stock') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.products.table.headers.location') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.products.table.headers.owner') }}</th>
                  <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.products.table.headers.actions') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-antique-bronze/10 font-body">
                <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-antique-bronze/5 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex justify-center">
                      <div v-if="store.editId !== product.id" class="h-12 w-12 rounded-md border border-antique-bronze/20 overflow-hidden bg-white">
                        <img :src="product.imageUrl" :alt="product.name" class="h-full w-full object-cover">
                      </div>
                      <div v-else class="space-y-2 w-32">
                        <input v-model="store.editProduct.imageUrl" type="text" class="w-full text-xs border border-antique-bronze/30 rounded px-1 py-1" placeholder="URL">
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    <div v-if="store.editId !== product.id" class="text-sm font-bold text-iron-black">{{ product.name }}</div>
                    <input 
                      v-else 
                      v-model="store.editProduct.name" 
                      class="w-full text-sm border border-antique-bronze/30 rounded px-2 py-1 focus:ring-1 focus:ring-antique-bronze"
                    >
                  </td>

                  <td class="px-6 py-4">
                    <div v-if="store.editId !== product.id" class="text-sm text-stone-grey line-clamp-2">{{ product.description }}</div>
                    <textarea 
                      v-else 
                      v-model="store.editProduct.description" 
                      rows="2"
                      class="w-full text-sm border border-antique-bronze/30 rounded px-2 py-1 focus:ring-1 focus:ring-antique-bronze"
                    ></textarea>
                  </td>

                  <td class="px-6 py-4 text-center whitespace-nowrap">
                    <div v-if="store.editId !== product.id" class="text-sm font-medieval font-bold text-antique-bronze">
                      {{ product.price.toFixed(2) }} gold
                    </div>
                    <input 
                      v-else 
                      v-model.number="store.editProduct.price" 
                      type="number" 
                      step="0.01"
                      class="w-20 text-sm border border-antique-bronze/30 rounded px-2 py-1 text-center focus:ring-1 focus:ring-antique-bronze"
                    >
                  </td>

                  <td class="px-6 py-4 text-center whitespace-nowrap">
                    <div v-if="store.editId !== product.id">
                      <span 
                        :class="[
                          'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                          product.stock === 0 
                            ? 'bg-red-100/80 text-red-900 border-red-200' 
                            : product.stock < 5 
                              ? 'bg-orange-100/80 text-orange-900 border-orange-200' 
                              : 'bg-green-100/80 text-green-900 border-green-200'
                        ]"
                      >
                        {{ product.stock === 0 ? t('admin.products.table.stock.sold_out') : product.stock }}
                      </span>
                    </div>
                    <input 
                      v-else 
                      v-model.number="store.editProduct.stock" 
                      type="number" 
                      class="w-16 text-sm border border-antique-bronze/30 rounded px-2 py-1 text-center focus:ring-1 focus:ring-antique-bronze"
                    >
                  </td>

                  <td class="px-6 py-4 text-center">
                    <div v-if="store.editId !== product.id" class="text-sm text-iron-black">
                      {{ productService.getLocation(product.locationId) }}
                    </div>
                    <div v-else>
                      <select v-model="store.editProduct.locationId" class="w-full border rounded px-3 py-2">
                        <option v-for="location in locationsMock" :key="location.id" :value="location.id">
                          {{ location.name }}
                        </option>
                      </select>
                    </div>
                  </td>

                  <td class="px-6 py-4 text-center">
                    <div class="text-sm text-iron-black">
                      {{ getLocationOwner(product.locationId) }}
                    </div>
                  </td>

                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <template v-if="store.editId !== product.id">
                        <button 
                          @click="store.startEdit(product)" 
                          class="text-stone-grey hover:text-antique-bronze transition-colors p-1"
                          :title="t('admin.products.table.actions.edit')"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          @click="store.deleteProduct(product.id)" 
                          class="text-stone-grey hover:text-red-700 transition-colors p-1"
                          :title="t('admin.products.table.actions.delete')"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </template>
                      <template v-else>
                        <button 
                          @click="store.saveEdit()" 
                          class="text-green-700 hover:text-green-800 transition-colors p-1"
                          :title="t('admin.products.table.actions.save')"
                        >
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                        <button 
                          @click="store.cancelEdit()" 
                          class="text-red-700 hover:text-red-800 transition-colors p-1"
                          :title="t('admin.products.table.actions.cancel')"
                        >
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </template>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredProducts.length === 0">
                  <td colspan="8" class="px-6 py-16 text-center bg-white/40">
                    <div class="flex flex-col items-center">
                      <div class="w-16 h-16 bg-stone-grey/10 rounded-full flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-stone-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p class="text-iron-black font-medieval text-lg">{{ t('admin.products.table.empty.title') }}</p>
                      <p class="text-sm text-stone-grey mt-1 font-body">{{ t('admin.products.table.empty.subtitle') }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminNavbar from '@/components/navbar/AdminNavbar.vue'
import { useProductStore } from '@/stores/product'
import { productService } from '@/services/productService'
import { locationsMock } from '@/mocks/locations'
import { USERS } from '@/mocks/users'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useProductStore()
const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.user)

// Filtres
const searchQuery = ref('')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const stockFilter = ref<'all' | 'in-stock' | 'out-of-stock'>('all')
const sortBy = ref<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'>('name-asc')

const priceError = ref('')

const filteredProducts = computed(() => store.products)

const fetchProducts = () => {
  // Validation du prix
  if (typeof priceMin.value === 'number' && typeof priceMax.value === 'number' && priceMin.value > priceMax.value) {
    priceError.value = t('admin.products.filter.price_error')
    // On n'applique pas le filtre de prix si invalide
    store.fetchProducts({
      search: searchQuery.value,
      stock: stockFilter.value === 'all' ? undefined : stockFilter.value,
      sortBy: sortBy.value
    })
    return
  }

  priceError.value = ''
  store.fetchProducts({
    search: searchQuery.value,
    minPrice: priceMin.value || undefined,
    maxPrice: priceMax.value || undefined,
    stock: stockFilter.value === 'all' ? undefined : stockFilter.value,
    sortBy: sortBy.value
  })
}

onMounted(() => {
  fetchProducts()
})

watch([searchQuery, priceMin, priceMax, stockFilter, sortBy], () => {
  fetchProducts()
})

function clearFilters() {
  searchQuery.value = ''
  priceMin.value = null
  priceMax.value = null
  stockFilter.value = 'all'
  sortBy.value = 'name-asc'
  priceError.value = ''
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function getLocationOwner(locationId: number): string | null {
  const location = locationsMock.find(location => location.id === locationId)
  if (location) {
    const user = USERS.find(user => user.id === location.id_prestataire)
    if (user) {
      return `${user.firstname} ${user.lastname}`
    }
  }
  return null
}

</script>

