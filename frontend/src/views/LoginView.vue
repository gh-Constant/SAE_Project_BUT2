<template>
  <div class="min-h-screen flex">
    <!-- Left side - Map -->
    <div class="hidden md:flex w-1/2 bg-gradient-to-br from-orange-50 to-orange-100 items-center justify-center p-8">
      <img src="/images/login_image.png" alt="Login" class="w-4/5 h-auto rounded-lg shadow-lg transform scale-150 rotate-3" />
    </div>

    <!-- Right side - Login Form -->
    <div class="flex-1 md:w-1/2 bg-white flex flex-col justify-center p-8">
      <div class="w-full max-w-md mx-auto">
        
        <!-- Logo -->
        <div class="mb-8 text-center">
          <img 
            src="/images/Logo1.png" 
            alt="MedievalEvent Logo" 
            class="h-39 w-auto mx-auto mb-6"
          />
        </div>

        <!-- Title -->
        <div class="mb-8 text-left">
          <h1 class="text-3xl font-bold text-black mb-2">
            Welcome
          </h1>
          <p class="text-black text-lg mb-4">
            Enter your details to log in
          </p>
          <!-- Orange line -->
          <div class="w-24 h-1 bg-orange-500"></div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm">
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
            </div>
            <div class="ml-3 flex-shrink-0">
              <button @click="errorMessage = ''" class="text-red-400 hover:text-red-600 transition-colors">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span class="text-gray-700">Signing in...</span>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Email Input with floating label -->
          <div class="relative">
            <input
              id="email"
              v-model="email"
              @blur="validateField('email', email)"
              type="email"
              class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
              :class="fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
              placeholder=" "
              required
            />
            <label 
              for="email" 
              class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
              :class="email ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
              :style="{ color: fieldErrors.email ? '#ef4444' : email ? '#f97316' : '#6b7280' }"
            >
              {{ fieldErrors.email || 'Email' }}
            </label>
          </div>

          <!-- Password Input with floating label -->
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
              placeholder=" "
              required
            />
            <label 
              for="password" 
              class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-500 peer-focus:bg-transparent peer-focus:px-2 pb-1"
              :class="password ? 'top-1 text-xs text-orange-500 bg-transparent px-2 pb-1' : 'top-3 text-base'"
            >
              {{ fieldErrors.password || 'Password' }}
            </label>
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <svg v-if="showPassword" class="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                id="remember"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <button type="button" class="text-sm text-orange-600 hover:text-orange-500 transition-colors">
              Forgot password?
            </button>
          </div>

          <!-- Sign In Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-6 border border-transparent rounded-full shadow-md text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 transition-all duration-200"
          >
            {{ isLoading ? 'Signing in...' : 'Log In' }}
          </button>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Don't have an account?
            <router-link to="/register" class="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
              Sign up
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

const router = useRouter()
const authStore = useAuthStore()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({
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
        fieldErrors.value[field] = 'Email is required'
      } else if (!emailRegex.test(value)) {
        fieldErrors.value[field] = 'Please enter a valid email'
      } else {
        fieldErrors.value[field] = ''
      }
      break
    case 'password':
      if (!value) {
        fieldErrors.value[field] = 'Password is required'
      } else {
        fieldErrors.value[field] = ''
      }
      break
  }
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)

    console.log('Login successful:', authStore.user)
    router.push('/')

  } catch (error) {
    console.error('Login failed:', error)
    
    // Messages d'erreur user-friendly
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage.value = 'Erreur de connexion. Vérifiez votre connexion internet.'
      } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
        errorMessage.value = 'Email ou mot de passe incorrect'
      } else if (error.message.includes('404')) {
        errorMessage.value = 'Utilisateur non trouvé'
      } else {
        errorMessage.value = 'Email ou mot de passe incorrect'
      }
    } else {
      errorMessage.value = 'Email ou mot de passe incorrect'
    }
  } finally {
    isLoading.value = false
  }
}
</script>