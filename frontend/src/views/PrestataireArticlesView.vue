<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Gestion de ma boutique</h1>

    <!-- Formulaire d'ajout -->
    <form @submit.prevent="addArticle" class="mb-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Ajouter un article</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input v-model="store.newArticle.name" type="text" required class="w-full border rounded px-3 py-2">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input v-model="store.newArticle.imageUrl" type="text" required class="w-full border rounded px-3 py-2">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prix</label>
          <input v-model.number="store.newArticle.price" type="number" required class="w-full border rounded px-3 py-2">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input v-model.number="store.newArticle.stock" type="number" required class="w-full border rounded px-3 py-2">
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="store.newArticle.description" rows="3" class="w-full border rounded px-3 py-2"></textarea>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Ajouter l'article
        </button>
      </div>
    </form>

    <!-- Liste des articles -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Image</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Description</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Prix</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="article in myArticles" :key="article.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <img :src="article.imageUrl" :alt="article.name" class="h-12 w-12 object-cover rounded">
            </td>

            <td class="px-6 py-4">
              <div v-if="store.editId !== article.id">
                <div class="font-medium text-gray-900">{{ article.name }}</div>
              </div>
              <div v-else class="space-y-2">
                <input v-model="store.editArticle.name" class="border rounded px-2 py-1 w-full" placeholder="Nom">
              </div>
            </td>

            <td class="px-6 py-4">
              <div v-if="store.editId !== article.id">
                <div class="text-sm text-gray-500">{{ article.description }}</div>
              </div>
              <div v-else class="space-y-2">
                <textarea v-model="store.editArticle.description" class="border rounded px-2 py-1 w-full" placeholder="Description"></textarea>
              </div>
            </td>

            <td class="px-6 py-4">
              <div v-if="store.editId !== article.id" class="text-sm text-gray-900">
                {{ article.price }}€
              </div>
              <input v-else v-model.number="store.editArticle.price" type="number" class="border rounded px-2 py-1 w-24">
            </td>

            <td class="px-6 py-4">
              <div v-if="store.editId !== article.id" class="text-sm text-gray-900">
                {{ article.stock }}
              </div>
              <input v-else v-model.number="store.editArticle.stock" type="number" class="border rounded px-2 py-1 w-24">
            </td>
            
            <td class="px-6 py-4 space-x-2">
              <template v-if="store.editId !== article.id">
                <button @click="store.startEdit(article)" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="store.deleteArticle(article.id)" class="text-red-600 hover:text-red-800">
                  <i class="fas fa-trash"></i>
                </button>
              </template>
              <template v-else>
                <button @click="store.saveEdit()" class="text-green-600 hover:text-green-800">
                  <i class="fas fa-check"></i>
                </button>
                <button @click="store.cancelEdit()" class="text-gray-600 hover:text-gray-800">
                  <i class="fas fa-times"></i>
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useArticleStore } from '@/stores/article'

const authStore = useAuthStore()
const store = useArticleStore()

// Filtrer uniquement les articles du prestataire connecté
const myArticles = computed(() => 
  store.articlesForPrestataire(authStore.user?.id || 0)
)

function addArticle() {
  store.addArticleForPrestataire(authStore.user?.id || 0)
}
</script>

