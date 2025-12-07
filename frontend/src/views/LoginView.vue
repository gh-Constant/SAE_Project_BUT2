<template>
  <div class="min-h-screen flex font-body">
    <!-- Left side - Map -->
    <div class="hidden md:flex w-1/2 bg-aged-paper relative overflow-hidden items-center justify-center p-6 border-r-4 border-double border-antique-bronze/30">
      <div class="absolute inset-0 bg-[url('/images/paper-texture.jpg')] opacity-10 pointer-events-none"></div>
      <img
        src="/images/login_image.png"
        alt="Login"
        class="w-11/12 h-auto rounded-lg shadow-2xl transform scale-105 rotate-1 border-4 border-antique-bronze/20 sepia-[0.3]"
      >
    </div>

    <!-- Right side - Login Form -->
    <div class="flex-1 md:w-1/2 bg-parchment flex flex-col justify-center p-8 relative">
      <div class="absolute inset-0 bg-[url('/images/paper-texture.jpg')] opacity-20 pointer-events-none"></div>
      
      <div class="w-full max-w-md mx-auto relative z-10">
        <!-- Logo -->
        <div class="mb-8 text-center">
          <img 
            src="/images/transparent_logo.png" 
            alt="MedievalEvent Logo" 
            class="h-40 w-auto mx-auto mb-6 drop-shadow-md"
          >
        </div>

        <!-- Title -->
        <div class="mb-8 text-left">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
            {{ t('auth.login.title') }}
          </h1>
          <p class="text-stone-grey text-lg mb-4 italic">
            {{ t('auth.login.subtitle') }}
          </p>
          <!-- Bronze line -->
          <div class="w-24 h-1 bg-antique-bronze rounded-full" />
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 bg-red-50/80 border-l-4 border-red-800 rounded-r-lg shadow-sm backdrop-blur-sm"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-red-900">
                {{ errorMessage }}
              </p>
            </div>
            <div class="ml-3 flex-shrink-0">
              <button
                class="text-red-700 hover:text-red-900 transition-colors"
                @click="errorMessage = ''"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div
          v-if="isLoading"
          class="fixed inset-0 bg-iron-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div class="bg-parchment p-8 rounded-lg shadow-2xl border-2 border-antique-bronze flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-4 border-antique-bronze" />
            <span class="text-iron-black font-medieval text-xl">{{ t('auth.login.loading') }}</span>
          </div>
        </div>

        <!-- Login Form -->
        <form
          class="space-y-6"
          @submit.prevent="handleLogin"
        >
          <!-- Email Input with floating label -->
          <div class="relative group">
            <input
              id="email"
              v-model="email"
              type="email"
              class="w-full px-4 py-3 bg-white/50 border-2 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 peer"
              :class="fieldErrors.email ? 'border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
              :placeholder="t('auth.login.email_placeholder')"
              required
              @blur="validateField('email', email)"
            >
            <label 
              for="email" 
              class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval"
              :class="[
                email ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey',
                fieldErrors.email ? 'text-red-600' : ''
              ]"
            >
              {{ fieldErrors.email || t('auth.login.email_label') }}
            </label>
            <div class="absolute inset-0 rounded-lg pointer-events-none border border-transparent peer-focus:border-antique-bronze/10"></div>
          </div>

          <!-- Password Input with floating label -->
          <div class="relative group">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 bg-white/50 border-2 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 peer"
              :class="fieldErrors.password ? 'border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
              :placeholder="t('auth.login.password_placeholder')"
              required
            >
            <label 
              for="password" 
              class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval"
              :class="[
                password ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey',
                fieldErrors.password ? 'text-red-600' : ''
              ]"
            >
              {{ fieldErrors.password || t('auth.login.password_label') }}
            </label>
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-antique-bronze hover:text-iron-black transition-colors"
              @click="togglePasswordVisibility"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-antique-bronze focus:ring-antique-bronze border-antique-bronze/50 rounded bg-white/50"
              >
              <label
                for="remember"
                class="ml-2 text-sm text-stone-grey hover:text-iron-black transition-colors cursor-pointer"
              >
              {{ t('auth.login.remember_me') }}
              </label>
            </div>
            <button
              type="button"
              class="text-sm text-antique-bronze hover:text-iron-black transition-colors font-medium underline decoration-antique-bronze/30 underline-offset-2"
            >
              {{ t('auth.login.forgot_password') }}
            </button>
          </div>

          <!-- Sign In Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-medieval font-bold text-white bg-antique-bronze hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-antique-bronze disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {{ isLoading ? t('auth.login.loading') : t('auth.login.submit') }}
          </button>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-8 text-center">
          <p class="text-stone-grey">
            {{ t('auth.login.no_account') }}
            <router-link
              to="/register"
              class="font-medieval font-bold text-antique-bronze hover:text-iron-black transition-colors ml-1 text-lg"
            >
              {{ t('auth.login.join') }}
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({
  email: '',
  password: ''
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const validateField = (field: string, value: string) => {
  switch (field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        fieldErrors.value[field] = t('auth.errors.email_required')
      } else if (!emailRegex.test(value)) {
        fieldErrors.value[field] = t('auth.errors.email_invalid')
      } else {
        fieldErrors.value[field] = ''
      }
      break
    case 'password':
      if (!value) {
        fieldErrors.value[field] = t('auth.errors.password_required')
      } else {
        fieldErrors.value[field] = ''
      }
      break
  }
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = t('auth.errors.fill_all')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)

    console.log('Login successful:', authStore.user)
    await router.push('/')

  } catch (error) {
    console.error('Login failed:', error)
    
    // Messages d'erreur user-friendly
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage.value = t('auth.errors.network_error')
      } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
        errorMessage.value = t('auth.errors.login_failed')
      } else if (error.message.includes('404')) {
        errorMessage.value = t('auth.errors.user_not_found')
      } else {
        errorMessage.value = t('auth.errors.login_failed')
      }
    } else {
      errorMessage.value = t('auth.errors.login_failed')
    }
  } finally {
    isLoading.value = false
  }
}
</script>