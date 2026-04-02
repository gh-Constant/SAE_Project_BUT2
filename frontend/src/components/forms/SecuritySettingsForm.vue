<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2 pb-2 border-b border-orange-500">
        {{ t('profile.security.title') }}
      </h2>
      <p class="text-sm text-stone-grey">
        Gérez vos connexions externes et votre mot de passe depuis un seul écran.
      </p>
    </div>

    <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
      <i class="fas fa-check-circle mr-2"></i>{{ successMessage }}
    </div>
    <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>{{ errorMessage }}
    </div>

    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold text-iron-black">Connexions externes</h3>
        <p class="text-sm text-stone-grey">
          Liez Google ou Discord pour vous connecter sans mot de passe.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <article
          v-for="provider in providers"
          :key="provider.id"
          class="rounded-xl border border-antique-bronze/20 bg-white p-5 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-base font-semibold text-iron-black">{{ provider.label }}</p>
              <p class="mt-1 text-sm text-stone-grey">
                {{ getProviderDescription(provider.id) }}
              </p>
            </div>
            <span
              class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
              :class="isLinked(provider.id) ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-grey'"
            >
              {{ isLinked(provider.id) ? 'Connecté' : 'Non connecté' }}
            </span>
          </div>

          <p v-if="getLinkedEmail(provider.id)" class="mt-4 text-sm text-stone-grey">
            {{ getLinkedEmail(provider.id) }}
          </p>

          <div class="mt-5">
            <button
              v-if="!isLinked(provider.id)"
              type="button"
              class="w-full rounded-lg bg-antique-bronze px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              :disabled="loadingProvider === provider.id"
              @click="linkProvider(provider.id)"
            >
              {{ loadingProvider === provider.id ? 'Connexion...' : `Connecter ${provider.label}` }}
            </button>

            <button
              v-else
              type="button"
              class="w-full rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              :disabled="loadingProvider === provider.id"
              @click="unlinkProvider(provider.id)"
            >
              {{ loadingProvider === provider.id ? 'Suppression...' : `Retirer ${provider.label}` }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold text-iron-black">
          {{ security?.hasPassword ? 'Mot de passe' : 'Ajouter un mot de passe' }}
        </h3>
        <p class="text-sm text-stone-grey">
          {{ security?.hasPassword
            ? 'Modifiez votre mot de passe actuel.'
            : 'Ajoutez un mot de passe local pour conserver une connexion de secours.' }}
        </p>
      </div>

      <div v-if="!security?.hasPassword" class="rounded-xl border border-antique-bronze/20 bg-white p-5 shadow-sm">
        <p class="text-sm text-stone-grey">
          Pour ajouter un mot de passe à un compte connecté via OAuth, une vérification par email est obligatoire.
        </p>
        <div class="mt-4 flex justify-end">
          <button
            type="button"
            :disabled="isSendingSetupEmail"
            class="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="requestPasswordSetupEmail"
          >
            {{ isSendingSetupEmail ? 'Envoi...' : 'Envoyer l’email de vérification' }}
          </button>
        </div>
      </div>

      <form v-else class="space-y-4" @submit.prevent="submitPassword">
        <div v-if="security?.hasPassword">
          <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
            {{ t('profile.security.currentPassword') }}
          </label>
          <input
            id="currentPassword"
            v-model="currentPassword"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            required
          />
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
            {{ t('profile.security.newPassword') }}
          </label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            required
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            {{ t('profile.security.confirmPassword') }}
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            required
          />
          <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
            {{ t('profile.security.passwordMismatch') }}
          </p>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSavingPassword || passwordMismatch || newPassword.length < 6"
            class="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSavingPassword ? 'Enregistrement...' : t('profile.security.changePassword') }}
          </button>
        </div>
      </form>
    </section>

    <section class="space-y-4 border-t border-red-100 pt-8">
      <div>
        <h3 class="text-lg font-semibold text-red-700">Suppression du compte</h3>
        <p class="text-sm text-stone-grey">
          Cette action supprime définitivement votre compte et ses liaisons OAuth.
        </p>
      </div>

      <div class="rounded-xl border border-red-200 bg-red-50/60 p-5">
        <div v-if="security?.hasPassword" class="mb-4">
          <label for="deletePassword" class="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe actuel
          </label>
          <input
            id="deletePassword"
            v-model="deletePassword"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
        </div>

        <div class="mb-4">
          <label for="deleteConfirmText" class="block text-sm font-medium text-gray-700 mb-1">
            Tapez <span class="font-semibold">SUPPRIMER</span> pour confirmer
          </label>
          <input
            id="deleteConfirmText"
            v-model="deleteConfirmText"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            :disabled="isDeletingAccount || deleteConfirmText !== 'SUPPRIMER'"
            class="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="deleteAccount"
          >
            {{ isDeletingAccount ? 'Suppression...' : 'Supprimer mon compte' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'

type OAuthProvider = 'google' | 'discord'

type SecuritySettings = {
  email: string
  hasPassword: boolean
  linkedProviders: Array<{
    provider: OAuthProvider
    email?: string | null
    linkedAt?: string | null
  }>
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const providers = [
  { id: 'google' as const, label: 'Google' },
  { id: 'discord' as const, label: 'Discord' },
]

const security = ref<SecuritySettings | null>(null)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSavingPassword = ref(false)
const isSendingSetupEmail = ref(false)
const isDeletingAccount = ref(false)
const loadingProvider = ref<OAuthProvider | null>(null)
const deletePassword = ref('')
const deleteConfirmText = ref('')

const passwordMismatch = computed(() => {
  return Boolean(newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value)
})

const isLinked = (provider: OAuthProvider) => {
  return security.value?.linkedProviders.some((item) => item.provider === provider) ?? false
}

const getLinkedEmail = (provider: OAuthProvider) => {
  return security.value?.linkedProviders.find((item) => item.provider === provider)?.email || ''
}

const getProviderDescription = (provider: OAuthProvider) => {
  if (isLinked(provider)) {
    return 'Ce fournisseur est déjà lié à votre compte.'
  }
  return 'Ajoutez cette connexion pour simplifier vos prochaines authentifications.'
}

const loadSecurity = async () => {
  security.value = await (authService as any).getSecuritySettings()
}

const submitPassword = async () => {
  if (passwordMismatch.value) return

  isSavingPassword.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const message = await (authService as any).changePassword(
      security.value?.hasPassword ? currentPassword.value : undefined,
      newPassword.value
    )
    successMessage.value = message
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    await loadSecurity()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de mettre à jour le mot de passe'
  } finally {
    isSavingPassword.value = false
  }
}

const requestPasswordSetupEmail = async () => {
  isSendingSetupEmail.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    successMessage.value = await (authService as any).requestPasswordSetupEmail()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible d’envoyer l’email de vérification'
  } finally {
    isSendingSetupEmail.value = false
  }
}

const linkProvider = async (provider: OAuthProvider) => {
  loadingProvider.value = provider
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const redirectUrl = await (authService as any).prepareOAuthLink(provider)
    window.location.href = redirectUrl
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de lancer la connexion externe'
    loadingProvider.value = null
  }
}

const unlinkProvider = async (provider: OAuthProvider) => {
  loadingProvider.value = provider
  errorMessage.value = ''
  successMessage.value = ''

  try {
    security.value = await (authService as any).unlinkOAuthProvider(provider)
    successMessage.value = `${provider === 'google' ? 'Google' : 'Discord'} a été retiré de votre compte.`
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de retirer cette connexion'
  } finally {
    loadingProvider.value = null
  }
}

const deleteAccount = async () => {
  isDeletingAccount.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authStore.deleteMyAccount(security.value?.hasPassword ? deletePassword.value : undefined)
    await router.replace('/login')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de supprimer le compte'
  } finally {
    isDeletingAccount.value = false
  }
}

onMounted(async () => {
  if (route.query.oauth === 'linked' && typeof route.query.provider === 'string') {
    successMessage.value = `${route.query.provider === 'google' ? 'Google' : 'Discord'} a bien été lié à votre compte.`
  }

  if (route.query.error && typeof route.query.error === 'string') {
    errorMessage.value = route.query.error
  }

  await loadSecurity()
})
</script>
