<template>
  <div class="min-h-screen flex items-center justify-center bg-parchment px-6">
    <div class="max-w-md w-full rounded-2xl border border-antique-bronze/20 bg-white p-8 shadow-xl text-center">
      <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-antique-bronze text-white">
        <i class="fas fa-user-check text-xl"></i>
      </div>

      <h1 class="text-2xl font-medieval font-bold text-iron-black">
        {{ title }}
      </h1>

      <p class="mt-3 text-stone-grey">
        {{ body }}
      </p>

      <router-link
        v-if="showBackToLogin"
        to="/login"
        class="mt-6 inline-flex rounded-lg bg-antique-bronze px-5 py-2 font-semibold text-white transition hover:brightness-110"
      >
        Retour à la connexion
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const errorMessage = ref('')
const infoMessage = ref('')

const title = computed(() => {
  if (loading.value) return 'Connexion en cours...'
  if (errorMessage.value) return 'Connexion impossible'
  if (infoMessage.value) return 'Vérification nécessaire'
  return 'Connexion réussie'
})

const body = computed(() => {
  if (errorMessage.value) return errorMessage.value
  if (infoMessage.value) return infoMessage.value
  return 'Nous finalisons votre session et vous redirigeons.'
})

const showBackToLogin = computed(() => !loading.value && Boolean(errorMessage.value || infoMessage.value))

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  const error = typeof route.query.error === 'string' ? route.query.error : ''
  const status = typeof route.query.status === 'string' ? route.query.status : ''
  const email = typeof route.query.email === 'string' ? route.query.email : ''

  if (error) {
    errorMessage.value = decodeURIComponent(error)
    loading.value = false
    return
  }

  if (status === 'verification_email_sent') {
    infoMessage.value = `Une vérification par email est requise avant de lier ce compte. Un email a été envoyé à ${email || 'votre adresse'}.`
    loading.value = false
    return
  }

  if (!token) {
    errorMessage.value = 'Aucun token OAuth n’a été reçu.'
    loading.value = false
    return
  }

  try {
    await authStore.completeOAuthLogin(token)
    await router.replace('/')
  } catch (caughtError) {
    errorMessage.value = caughtError instanceof Error ? caughtError.message : 'Connexion OAuth impossible'
    loading.value = false
  }
})
</script>
