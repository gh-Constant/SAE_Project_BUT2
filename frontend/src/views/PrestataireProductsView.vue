<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <PrestataireNavbar 
      :user="authStore.user" 
      @logout="handleLogout"
    />
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <svg class="w-8 h-8 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Gestion de l'Échoppe
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">Tenez vos registres et gérez votre inventaire</p>
        </div>

        <!-- Filtres -->
        <div class="mb-12 space-y-4">
          <!-- Ligne 1 : Recherche et Tri -->
          <div class="bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Champ de recherche -->
              <div class="flex-1">
                <label for="search" class="sr-only">Rechercher un produit</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-antique-bronze/50"></i>
                  </div>
                  <input
                    id="search"
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher par nom ou description..."
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body"
                  />
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-antique-bronze transition-colors"
                    title="Effacer la recherche"
                  >
                    <i class="fas fa-times text-stone-grey/50"></i>
                  </button>
                </div>
              </div>

              <!-- Tri -->
              <div class="md:w-56">
                <label for="sortBy" class="sr-only">Trier par</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-sort text-antique-bronze/50"></i>
                  </div>
                  <select
                    id="sortBy"
                    v-model="sortBy"
                    class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey appearance-none cursor-pointer font-body"
                  >
                    <option value="name-asc">Nom (A-Z)</option>
                    <option value="name-desc">Nom (Z-A)</option>
                    <option value="price-asc">Prix (Croissant)</option>
                    <option value="price-desc">Prix (Décroissant)</option>
                    <option value="stock-desc">Stock (Élevé)</option>
                    <option value="stock-asc">Stock (Faible)</option>
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
                  Prix (Gold)
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
                  Disponibilité
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
                    <option value="all">Tous les produits</option>
                    <option value="in-stock">En stock</option>
                    <option value="out-of-stock">Rupture de stock</option>
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
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        <div v-for="location in prestataireLocations" :key="location.id" class="mb-12">
          
          <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-t-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-antique-bronze"></div>
            
            <div>
              <h2 class="text-2xl font-medieval font-bold text-iron-black flex items-center gap-3">
                <svg class="w-6 h-6 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ location.name }}
              </h2>
              <p class="text-sm font-body text-stone-grey mt-1 italic">
                Registre contenant {{ productsByLocation(location.id).length }} 
                {{ productsByLocation(location.id).length > 1 ? 'marchandises' : 'marchandise' }}
              </p>
            </div>
            
            <button 
              v-if="addingProductLocationId !== location.id"
              @click="startAddProduct(location.id)"
              class="group bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-2 px-5 rounded-md transition-all duration-200 shadow-md flex items-center gap-2"
            >
              <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une marchandise
            </button>
          </div>

          <div v-if="addingProductLocationId === location.id" class="bg-parchment-light border-x border-b border-antique-bronze/20 p-8 shadow-inner relative">
             <div class="absolute top-0 left-0 right-0 h-px bg-antique-bronze/10"></div>
             
             <h3 class="text-xl font-medieval font-bold text-iron-black mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Inscrire une nouvelle marchandise
            </h3>

            <form @submit.prevent="store.addProductForLocation(location.id); cancelAddProduct()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medieval font-bold text-iron-black mb-2">Dénomination</label>
                  <input 
                    v-model="store.newProduct.name" 
                    type="text" 
                    required 
                    class="w-full bg-white/50 border border-antique-bronze/30 rounded-md px-4 py-2 text-iron-black placeholder-stone-grey/50 focus:ring-2 focus:ring-antique-bronze focus:border-antique-bronze transition-all font-body"
                    placeholder="Ex: Épée longue en acier"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medieval font-bold text-iron-black mb-2">Représentation (Image)</label>
                  <div class="flex gap-2">
                    <label class="cursor-pointer bg-antique-bronze/10 hover:bg-antique-bronze/20 text-antique-bronze border border-antique-bronze/30 rounded-md px-4 py-2 transition-colors flex items-center justify-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <input type="file" accept="image/*" @change="(e) => handleImageSelect(e, 'new')" class="hidden" />
                    </label>
                    <input
                      v-model="store.newProduct.imageUrl"
                      type="text"
                      required
                      class="flex-1 bg-white/50 border border-antique-bronze/30 rounded-md px-4 py-2 text-iron-black placeholder-stone-grey/50 focus:ring-2 focus:ring-antique-bronze focus:border-antique-bronze font-body"
                      placeholder="Ou lien URL..."
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medieval font-bold text-iron-black mb-2">Prix (Gold)</label>
                  <div class="relative">
                    <input 
                      v-model.number="store.newProduct.price" 
                      type="number" 
                      required 
                      step="0.01"
                      class="w-full bg-white/50 border border-antique-bronze/30 rounded-md pl-4 pr-12 py-2 text-iron-black focus:ring-2 focus:ring-antique-bronze focus:border-antique-bronze font-body"
                      placeholder="0.00"
                    >
                    <span class="absolute right-4 top-2 text-antique-bronze font-medieval font-bold">G</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medieval font-bold text-iron-black mb-2">Stock disponible</label>
                  <input 
                    v-model.number="store.newProduct.stock" 
                    type="number" 
                    required 
                    class="w-full bg-white/50 border border-antique-bronze/30 rounded-md px-4 py-2 text-iron-black focus:ring-2 focus:ring-antique-bronze focus:border-antique-bronze font-body"
                    placeholder="0"
                  >
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medieval font-bold text-iron-black mb-2">Description détaillée</label>
                  <textarea 
                    v-model="store.newProduct.description" 
                    rows="3" 
                    class="w-full bg-white/50 border border-antique-bronze/30 rounded-md px-4 py-2 text-iron-black placeholder-stone-grey/50 focus:ring-2 focus:ring-antique-bronze focus:border-antique-bronze font-body"
                    placeholder="Détails de la marchandise..."
                  ></textarea>
                </div>
              </div>

              <div class="mt-8 flex justify-end gap-3 border-t border-antique-bronze/10 pt-6">
                <button 
                  type="button"
                  @click="cancelAddProduct" 
                  class="px-6 py-2.5 rounded-md font-body font-semibold text-stone-grey hover:bg-stone-grey/10 transition-colors"
                >
                  Abandonner
                </button>
                <button 
                  type="submit" 
                  class="bg-antique-bronze hover:brightness-110 text-white font-body font-semibold py-2.5 px-6 rounded-md shadow-md transition-all duration-200 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Inscrire au registre
                </button>
              </div>
            </form>
          </div>

          <div class="bg-white/60 backdrop-blur-sm border-x border-b border-antique-bronze/20 rounded-b-lg overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/10">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Image</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Nom</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Description</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Prix</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Stock</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-antique-bronze/10 font-body">
                  <tr v-for="product in productsByLocation(location.id)" :key="product.id" class="hover:bg-antique-bronze/5 transition-colors">
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex justify-center">
                        <div v-if="store.editId !== product.id" class="h-12 w-12 rounded-md border border-antique-bronze/20 overflow-hidden bg-white">
                          <img :src="product.imageUrl" :alt="product.name" class="h-full w-full object-cover">
                        </div>
                        <div v-else class="space-y-2 w-32">
                           <div class="flex gap-1">
                              <label class="cursor-pointer bg-antique-bronze/10 hover:bg-antique-bronze/20 text-antique-bronze rounded p-1 flex-1 flex justify-center">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                  <input type="file" accept="image/*" @change="(e) => handleImageSelect(e, 'edit')" class="hidden" />
                              </label>
                           </div>
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
                          {{ product.stock === 0 ? 'Épuisé' : product.stock }}
                        </span>
                      </div>
                      <input 
                        v-else 
                        v-model.number="store.editProduct.stock" 
                        type="number" 
                        class="w-16 text-sm border border-antique-bronze/30 rounded px-2 py-1 text-center focus:ring-1 focus:ring-antique-bronze"
                      >
                    </td>

                    <td class="px-6 py-4 text-center whitespace-nowrap">
                      <div class="flex items-center justify-center gap-2">
                        <template v-if="store.editId !== product.id">
                          <button 
                            @click="store.startEdit(product)" 
                            class="text-stone-grey hover:text-antique-bronze transition-colors p-1"
                            title="Modifier"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button 
                            @click="store.deleteProduct(product.id)" 
                            class="text-stone-grey hover:text-red-700 transition-colors p-1"
                            title="Jeter"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </template>
                        <template v-else>
                          <button 
                            @click="store.saveEdit()" 
                            class="text-green-700 hover:text-green-800 transition-colors p-1"
                            title="Sceller"
                          >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                          </button>
                          <button 
                            @click="store.cancelEdit()" 
                            class="text-red-700 hover:text-red-800 transition-colors p-1"
                            title="Annuler"
                          >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </template>
                      </div>
                    </td>
                  </tr>
                  
                  <tr v-if="productsByLocation(location.id).length === 0">
                    <td colspan="6" class="px-6 py-16 text-center bg-white/40">
                      <div class="flex flex-col items-center">
                        <div class="w-16 h-16 bg-stone-grey/10 rounded-full flex items-center justify-center mb-4">
                          <svg class="w-8 h-8 text-stone-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <p class="text-iron-black font-medieval text-lg">Le registre est vide</p>
                        <p class="text-sm text-stone-grey mt-1 font-body">Ajoutez votre première marchandise pour commencer le commerce</p>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { locationsMock } from '@/mocks/locations'
import PrestataireNavbar from '@/components/navbar/PrestataireNavbar.vue'


const authStore = useAuthStore()
const store = useProductStore()
const route = useRoute()
const router = useRouter()
const addingProductLocationId = ref<number | null>(null)

// Filtres
const searchQuery = ref('')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const stockFilter = ref<'all' | 'in-stock' | 'out-of-stock'>('all')
const sortBy = ref<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'>('name-asc')
const priceError = ref('')

const filteredProducts = computed(() => store.products)

const fetchProducts = () => {
  if (!authStore.user?.id) return

  // Validation du prix
  if (typeof priceMin.value === 'number' && typeof priceMax.value === 'number' && priceMin.value > priceMax.value) {
    priceError.value = 'Le prix minimum ne peut pas être supérieur au maximum.'
    store.fetchProducts({
      search: searchQuery.value,
      stock: stockFilter.value === 'all' ? undefined : stockFilter.value,
      sortBy: sortBy.value,
      prestataireId: authStore.user.id
    })
    return
  }

  priceError.value = ''
  store.fetchProducts({
    search: searchQuery.value,
    minPrice: priceMin.value || undefined,
    maxPrice: priceMax.value || undefined,
    stock: stockFilter.value === 'all' ? undefined : stockFilter.value,
    sortBy: sortBy.value,
    prestataireId: authStore.user.id
  })
}

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

onMounted(() => {
  fetchProducts()
  if (route.query.action === 'add' && route.query.locationId) {
    const locId = Number(route.query.locationId)
    addingProductLocationId.value = locId
    store.newProduct.locationId = locId
  }
})

// Fonction réutilisable pour convertir un fichier en data URL
const handleImageSelect = (event: Event, targetField: 'new' | 'edit') => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    if (targetField === 'new') {
      store.newProduct.imageUrl = dataUrl
    } else {
      store.editProduct.imageUrl = dataUrl
    }
  }
  reader.readAsDataURL(file)
}

// Liste des locations du prestataire connecté
const prestataireLocations = computed(() =>
  locationsMock.filter(location => location.id_prestataire === authStore.user?.id)
)

// Liste des produits pour une location donnée
function productsByLocation(locationId: number) {
  return filteredProducts.value.filter(product => product.locationId === locationId)
}

function startAddProduct(locationId: number) {
  addingProductLocationId.value = locationId
  store.newProduct.locationId = locationId
}

function cancelAddProduct() {
  addingProductLocationId.value = null
  store.resetNewProduct()
}

// Logout handler
function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>