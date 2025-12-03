
<template>
  <AdminNavbar :user="user" @logout="handleLogout" />
  <div class="min-h-screen bg-parchment py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
          <svg class="w-8 h-8 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Gestion des Produits
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
        <p class="text-base font-body text-stone-grey">Vue d'ensemble et gestion de tous les produits du système</p>
      </div>

      <div class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-antique-bronze/10">
            <thead class="bg-antique-bronze/10">
              <tr>
                <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Image</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Nom</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Description</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Prix</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Stock</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Localisation</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Appartenance</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-antique-bronze/10 font-body">
              <tr v-for="product in store.sortedProducts" :key="product.id" class="hover:bg-antique-bronze/5 transition-colors">
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
              <tr v-if="store.sortedProducts.length === 0">
                <td colspan="8" class="px-6 py-16 text-center bg-white/40">
                  <div class="flex flex-col items-center">
                    <div class="w-16 h-16 bg-stone-grey/10 rounded-full flex items-center justify-center mb-4">
                      <svg class="w-8 h-8 text-stone-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p class="text-iron-black font-medieval text-lg">Aucun produit enregistré</p>
                    <p class="text-sm text-stone-grey mt-1 font-body">Ajoutez votre premier produit pour commencer la gestion</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminNavbar from '@/components/navbar/AdminNavbar.vue'
import { useProductStore } from '@/stores/product'
import { productService } from '@/services/productService'
import { locationsMock } from '@/mocks/locations'
import { USERS } from '@/mocks/users'

const store = useProductStore()
const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.user)

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

