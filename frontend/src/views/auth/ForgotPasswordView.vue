<template>
  <div class="min-h-screen flex font-body">
    <!-- Left side - Map -->
    <div
      class="hidden md:flex w-1/2 bg-aged-paper relative overflow-hidden items-center justify-center p-6 border-r-4 border-double border-antique-bronze/30">
      <div class="absolute inset-0 opacity-10 pointer-events-none"></div>
      <img src="/images/login_image.png" alt="Forgot Password"
        class="w-11/12 h-auto rounded-lg shadow-2xl transform scale-105 rotate-1 border-4 border-antique-bronze/20 sepia-[0.3]">
    </div>

    <!-- Right side - Forgot Password Form -->
    <div class="flex-1 md:w-1/2 bg-parchment flex flex-col justify-center p-8 relative">
      <div class="absolute inset-0 opacity-20 pointer-events-none"></div>
      
      <!-- Back Button -->
      <BackToMapButton positionClass="absolute top-6 left-6" to="/" title="Accueil" />

      <div class="w-full max-w-md mx-auto relative z-10">
        <!-- Logo -->
        <div class="mb-8 text-center">
          <img src="/images/transparent_logo.png" alt="Terres du Lion Logo"
            class="h-40 w-auto mx-auto mb-6 drop-shadow-md">
        </div>

        <!-- Title -->
        <div class="mb-8 text-left">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
            {{ t('auth.forgotPassword.title') }}
          </h1>
          <p class="text-stone-grey text-lg mb-4 italic">
            {{ t('auth.forgotPassword.subtitle') }}
          </p>
          <!-- Bronze line -->
          <div class="w-24 h-1 bg-antique-bronze rounded-full" />
        </div>

        <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-6">
          <div class="relative group">
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-white/50 border-2 border-antique-bronze/30 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 focus:border-antique-bronze transition-all duration-200 peer"
              :placeholder="t('auth.forgotPassword.emailPlaceholder')"
            />
            <label for="email" class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval"
              :class="email ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey'">
              {{ t('auth.forgotPassword.emailLabel') }}
            </label>
          </div>

          <div v-if="errorMessage" class="p-4 bg-red-50/80 border-l-4 border-red-800 rounded-r-lg shadow-sm backdrop-blur-sm">
            <div class="flex items-start">
              <i class="fas fa-exclamation-circle text-red-700 mr-2 mt-0.5"></i>
              <p class="text-sm font-medium text-red-900">{{ errorMessage }}</p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-medieval font-bold text-white bg-antique-bronze hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-antique-bronze disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin mr-2"></i>{{ t('auth.forgotPassword.sending') }}
            </span>
            <span v-else>
              {{ t('auth.forgotPassword.submit') }}
            </span>
          </button>

          <div class="text-center">
            <router-link to="/login" class="text-antique-bronze hover:text-iron-black text-sm font-medieval font-bold transition-colors">
              <i class="fas fa-arrow-left mr-1"></i>{{ t('auth.forgotPassword.backToLogin') }}
            </router-link>
          </div>
        </form>

        <div v-else class="text-center space-y-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-600">
            <i class="fas fa-check text-3xl text-green-600"></i>
          </div>
          <h2 class="text-2xl font-medieval font-bold text-iron-black">
            {{ t('auth.forgotPassword.successTitle') }}
          </h2>
          <p class="text-stone-grey text-base">
            {{ t('auth.forgotPassword.successMessage') }}
          </p>
          <router-link
            to="/login"
            class="inline-block mt-4 px-6 py-3 bg-antique-bronze text-white font-medieval font-bold rounded-lg hover:brightness-110 transition-all shadow-lg transform hover:-translate-y-0.5"
          >
            {{ t('auth.forgotPassword.backToLogin') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { authService } from '@/services/authService'
import BackToMapButton from '@/components/shared/BackToMapButton.vue'

const { t } = useI18n()

const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const emailSent = ref(false)

const handleSubmit = async () => {
  if (!email.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await (authService as any).forgotPassword(email.value)
    emailSent.value = true
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = t('auth.forgotPassword.error')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
