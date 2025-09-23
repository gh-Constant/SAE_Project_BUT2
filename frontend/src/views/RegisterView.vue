<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const selectedRole = ref<'adventurer' | 'artisan'>('adventurer')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showStep2 = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleRegister = async () => {
  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.register(firstName.value, lastName.value, email.value, password.value, selectedRole.value)
    console.log('Registration successful:', authStore.user)
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Registration failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-full flex flex-col">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          <span>Creating account...</span>
        </div>
      </div>
    </div>

    <!-- Error mesEsage -->
    <div v-if="errorMessage" class="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-40">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="ml-4 text-red-200 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Register Form -->
    <div class="flex-1 flex flex-col md:flex-row">
      <!-- Left side - Image (Hidden on mobile) -->
      <div class="hidden md:flex w-1/2 bg-gray-100 items-center justify-center p-8">
        <div class="max-w-xl text-center">
          <img
            src="/images/login_image.png"
            alt="MedievalEvent Register"
            class="w-4/5 h-auto rounded-lg shadow-lg mx-auto transform scale-150 rotate-3"
          />
        </div>
      </div>

      <!-- Right side - Register Form (Full width on mobile) -->
      <div class="flex-1 md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div class="w-full max-w-md">
          <!-- Page Title -->
          <div class="mb-8 text-left">
            <h1
              class="mb-3 tracking-tight leading-none"
              style="font-size: 2.5rem; font-weight: 900; color: #111827; text-shadow: 3px 3px 6px rgba(0,0,0,0.15); font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.02em;"
            >
              Create Account
            </h1>
            <p class="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Join MedievalEvent and start your adventure
            </p>
          </div>

          <!-- Orange separator bar -->
          <div class="w-32 h-1 bg-orange-500 mb-6"></div>

          <!-- Role Selection (Always Visible) -->
          <div class="mb-6">
            <p class="text-gray-500 text-base mb-3">Please select your role</p>
            <div class="grid grid-cols-2 gap-2">
              <!-- Adventurer Role -->
              <button
                type="button"
                @click="selectedRole = 'adventurer'"
                class="relative p-3 rounded-lg border-2 transition-all"
                :class="selectedRole === 'adventurer' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'"
              >
                <div class="flex flex-col items-center space-y-1">
                  <div
                    class="p-1.5 rounded-md"
                    :class="selectedRole === 'adventurer' ? 'bg-orange-100' : 'bg-gray-100'"
                  >
                    <svg
                      class="w-5 h-5"
                      :class="selectedRole === 'adventurer' ? 'text-orange-500' : 'text-gray-400'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v2M7 4h10M5 8h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <span
                    class="font-medium text-xs"
                    :class="selectedRole === 'adventurer' ? 'text-orange-500' : 'text-gray-400'"
                  >
                  Adventurer
                </span>
                </div>
                <div
                  v-if="selectedRole === 'adventurer'"
                  class="absolute -top-1 -right-1"
                >
                  <div class="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <!-- Artisan Role -->
              <button
                type="button"
                @click="selectedRole = 'artisan'"
                class="relative p-3 rounded-lg border-2 transition-all"
                :class="selectedRole === 'artisan' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'"
              >
                <div class="flex flex-col items-center space-y-1">
                  <div
                    class="p-1.5 rounded-md"
                    :class="selectedRole === 'artisan' ? 'bg-orange-100' : 'bg-gray-100'"
                  >
                    <svg
                      class="w-5 h-5"
                      :class="selectedRole === 'artisan' ? 'text-orange-500' : 'text-gray-400'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <span
                    class="font-medium text-xs"
                    :class="selectedRole === 'artisan' ? 'text-orange-500' : 'text-gray-400'"
                  >
                  Artisan
                </span>
                </div>
                <div
                  v-if="selectedRole === 'artisan'"
                  class="absolute -top-1 -right-1"
                >
                  <div class="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Step 1: Name Information -->
          <div v-if="!showStep2" class="mb-8">
            <!-- Name Inputs -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <!-- Next Button -->
            <button
              type="button"
              @click="showStep2 = true"
              class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm mb-4"
            >
              Next: Account Details
            </button>
          </div>

          <!-- Step 2: Account Information -->
          <form v-if="showStep2" @submit.prevent="handleRegister" class="mb-8">
            <!-- Email Input -->
            <div class="mb-6">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                required
              />
            </div>

            <!-- Password Input -->
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="showPassword"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  @click="toggleConfirmPasswordVisibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="showConfirmPassword"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex gap-4 mb-4">
              <button
                type="button"
                @click="showStep2 = false"
                class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
              >
                Back
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
              >
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </div>
          </form>

          <!-- Sign In Link -->
          <div class="mt-8 text-center">
            <p class="text-gray-600">
              Already have an account?
              <router-link to="/login" class="text-orange-500 hover:text-orange-600 font-semibold ml-1">
                Sign in here
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>