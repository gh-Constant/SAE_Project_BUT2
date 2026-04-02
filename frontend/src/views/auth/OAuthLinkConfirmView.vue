<template>
  <div class="min-h-screen flex items-center justify-center bg-parchment px-6">
    <div class="max-w-md w-full rounded-2xl border border-antique-bronze/20 bg-white p-8 shadow-xl text-center">
      <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-antique-bronze text-white">
        <i class="fas fa-link text-xl"></i>
      </div>

      <h1 class="text-2xl font-medieval font-bold text-iron-black">
        {{ loading ? 'Liaison du compte...' : errorMessage ? 'Liaison impossible' : 'Compte lié' }}
      </h1>

      <p class="mt-3 text-stone-grey">
        {{ errorMessage || 'Nous finalisons la liaison de votre compte externe.' }}
      </p>

      <router-link
        v-if="errorMessage"
        to="/login"
        class="mt-6 inline-flex rounded-lg bg-antique-bronze px-5 py-2 font-semibold text-white transition hover:brightness-110"
      >
        Retour à la connexion
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''

  if (!token) {
    errorMessage.value = 'Le lien de confirmation est invalide.'
    loading.value = false
    return
  }

  try {
    const result = await (authService as any).confirmOAuthLink(token)
    await authStore.completeOAuthLogin(result.token)
    await router.replace({ path: '/profile', query: { tab: 'security', oauth: 'linked', provider: result.provider } })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de confirmer la liaison'
    loading.value = false
  }
})
</script>
