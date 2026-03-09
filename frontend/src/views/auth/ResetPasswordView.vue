<template>
  <div class="min-h-screen flex font-body">
    <!-- Left side - Map -->
    <div
      class="hidden md:flex w-1/2 bg-aged-paper relative overflow-hidden items-center justify-center p-6 border-r-4 border-double border-antique-bronze/30">
      <div class="absolute inset-0 opacity-10 pointer-events-none"></div>
      <img src="/images/login_image.png" alt="Reset Password"
        class="w-11/12 h-auto rounded-lg shadow-2xl transform scale-105 rotate-1 border-4 border-antique-bronze/20 sepia-[0.3]">
    </div>

    <!-- Right side - Reset Password Form -->
    <div class="flex-1 md:w-1/2 bg-parchment flex flex-col justify-center p-8 relative">
      <div class="absolute inset-0 opacity-20 pointer-events-none"></div>

      <div class="w-full max-w-md mx-auto relative z-10">
        <!-- Logo -->
        <div class="mb-8 text-center">
          <img src="/images/transparent_logo.png" alt="Terres du Lion Logo"
            class="h-40 w-auto mx-auto mb-6 drop-shadow-md">
        </div>

        <!-- Title -->
        <div class="mb-8 text-left">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
            {{ t('auth.resetPassword.title') }}
          </h1>
          <p class="text-stone-grey text-lg mb-4 italic">
            {{ t('auth.resetPassword.subtitle') }}
          </p>
          <!-- Bronze line -->
          <div class="w-24 h-1 bg-antique-bronze rounded-full" />
        </div>

        <form v-if="!passwordReset" @submit.prevent="handleSubmit" class="space-y-6">
          <div class="relative group">
            <input
              id="newPassword"
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full px-4 py-3 pr-12 bg-white/50 border-2 border-antique-bronze/30 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 focus:border-antique-bronze transition-all duration-200 peer"
              :placeholder="t('auth.resetPassword.newPasswordPlaceholder')"
            />
            <label for="newPassword" class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval"
              :class="newPassword ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey'">
              {{ t('auth.resetPassword.newPasswordLabel') }}
            </label>
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-antique-bronze hover:text-iron-black transition-colors"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>

          <div class="relative group">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-12 bg-white/50 border-2 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 peer"
              :class="passwordMismatch ? 'border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
              :placeholder="t('auth.resetPassword.confirmPasswordPlaceholder')"
            />
            <label for="confirmPassword" class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval"
              :class="[
                confirmPassword ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey',
                passwordMismatch ? 'text-red-600' : ''
              ]">
              {{ passwordMismatch ? t('auth.resetPassword.passwordMismatch') : t('auth.resetPassword.confirmPasswordLabel') }}
            </label>
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-antique-bronze hover:text-iron-black transition-colors"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>

          <div v-if="errorMessage" class="p-4 bg-red-50/80 border-l-4 border-red-800 rounded-r-lg shadow-sm backdrop-blur-sm">
            <div class="flex items-start">
              <i class="fas fa-exclamation-circle text-red-700 mr-2 mt-0.5"></i>
              <p class="text-sm font-medium text-red-900">{{ errorMessage }}</p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading || passwordMismatch || !isFormValid"
            class="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-medieval font-bold text-white bg-antique-bronze hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-antique-bronze disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin mr-2"></i>{{ t('auth.resetPassword.resetting') }}
            </span>
            <span v-else>
              {{ t('auth.resetPassword.submit') }}
            </span>
          </button>
        </form>

        <div v-else class="text-center space-y-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-600">
            <i class="fas fa-check text-3xl text-green-600"></i>
          </div>
          <h2 class="text-2xl font-medieval font-bold text-iron-black">
            {{ t('auth.resetPassword.successTitle') }}
          </h2>
          <p class="text-stone-grey text-base">
            {{ t('auth.resetPassword.successMessage') }}
          </p>
          <router-link
            to="/login"
            class="inline-block mt-4 px-6 py-3 bg-antique-bronze text-white font-medieval font-bold rounded-lg hover:brightness-110 transition-all shadow-lg transform hover:-translate-y-0.5"
          >
            {{ t('auth.resetPassword.goToLogin') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authService } from '@/services/authService'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const token = ref(route.params.token as string)
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isLoading = ref(false)
const errorMessage = ref('')
const passwordReset = ref(false)

const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value
})

const isFormValid = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value.length >= 6 && !passwordMismatch.value
})

const handleSubmit = async () => {
  if (!isFormValid.value || !token.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await (authService as any).resetPassword(token.value, newPassword.value)
    passwordReset.value = true
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = t('auth.resetPassword.error')
    }
  } finally {
    isLoading.value = false
  }
}

// Redirect if no token
if (!token.value) {
  router.push('/login')
}
</script>
