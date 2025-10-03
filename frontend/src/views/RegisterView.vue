<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import LanguageSwitcher from '@/components/navbar/LanguageSwitcher.vue'
import { UserIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const selectedRole = ref<'aventurier' | 'artisan'>('aventurier')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showStep2 = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const canProceedToStep2 = () => {
  return firstName.value.trim() !== '' && lastName.value.trim() !== ''
}

const validateField = (field: string, value: string) => {
  switch (field) {
    case 'firstName':
    case 'lastName':
      if (!value.trim()) {
        fieldErrors.value[field] = 'This field is required'
      } else if (value.trim().length < 2) {
        fieldErrors.value[field] = 'Must be at least 2 characters'
      } else {
        fieldErrors.value[field] = ''
      }
      break
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
      } else if (value.length < 6) {
        fieldErrors.value[field] = 'Password must be at least 6 characters'
      } else {
        fieldErrors.value[field] = ''
      }
      break
    case 'confirmPassword':
      if (!value) {
        fieldErrors.value[field] = 'Please confirm your password'
      } else if (value !== password.value) {
        fieldErrors.value[field] = 'Passwords do not match'
      } else {
        fieldErrors.value[field] = ''
      }
      break
  }
}

const validateAllFields = () => {
  validateField('firstName', firstName.value)
  validateField('lastName', lastName.value)
  validateField('email', email.value)
  validateField('password', password.value)
  validateField('confirmPassword', confirmPassword.value)

  return Object.values(fieldErrors.value).every(error => error === '')
}

const handleRegister = async () => {
  // Validate all fields before submission
  if (!validateAllFields()) {
    errorMessage.value = 'Please fix all validation errors before submitting'
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
  <div class="min-h-screen flex">
    <!-- Left side - Map -->
    <div class="hidden md:flex w-1/2 bg-gradient-to-br from-orange-50 to-orange-100 items-center justify-center p-8">
      <img src="/images/login_image.png" alt="Register" class="w-4/5 h-auto rounded-lg shadow-lg transform scale-150 rotate-3" />
    </div>

    <!-- Right side - Register Form -->
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
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-bold text-black">
              Create Account
            </h1>
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                     :class="!showStep2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'">
                  1
                </div>
                <div class="w-8 h-1 bg-gray-200 rounded"></div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                     :class="showStep2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'">
                  2
                </div>
              </div>
            </div>
          </div>
          <p class="text-black text-lg mb-4">
            Join Les Terres Du Lion and start your adventure
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
            <span class="text-gray-700">Creating account...</span>
          </div>
        </div>

        <!-- Role Selection (Only in Step 1) -->
        <div v-if="!showStep2" class="mb-6">
          <p class="text-gray-500 text-base mb-3">Please select your role</p>
          <div class="grid grid-cols-2 gap-2">
            <!-- Aventurier Role -->
            <button
              type="button"
              @click="selectedRole = 'aventurier'"
              class="relative p-3 rounded-lg border-2 transition-all cursor-pointer"
              :class="selectedRole === 'aventurier' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'"
            >
              <div class="flex flex-col items-center space-y-1">
                <div
                  class="p-1.5 rounded-md"
                  :class="selectedRole === 'aventurier' ? 'bg-orange-100' : 'bg-gray-100'"
                >
                  <UserIcon
                    class="w-5 h-5"
                    :class="selectedRole === 'aventurier' ? 'text-orange-500' : 'text-gray-400'"
                  />
                </div>
                <span
                  class="font-medium text-xs"
                  :class="selectedRole === 'aventurier' ? 'text-orange-500' : 'text-gray-400'"
                >
                  Aventurier
                </span>
              </div>
              <div
                v-if="selectedRole === 'aventurier'"
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
              class="relative p-3 rounded-lg border-2 transition-all cursor-pointer"
              :class="selectedRole === 'artisan' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'"
            >
              <div class="flex flex-col items-center space-y-1">
                <div
                  class="p-1.5 rounded-md"
                  :class="selectedRole === 'artisan' ? 'bg-orange-100' : 'bg-gray-100'"
                >
                  <ShoppingBagIcon
                    class="w-5 h-5"
                    :class="selectedRole === 'artisan' ? 'text-orange-500' : 'text-gray-400'"
                  />
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
            <div class="relative">
              <input
                id="firstName"
                v-model="firstName"
                @blur="validateField('firstName', firstName)"
                type="text"
                class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                :class="fieldErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                placeholder=" "
                required
              />
              <label
                for="firstName"
                class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2"
                :class="firstName ? 'top-1 text-xs bg-white px-2' : 'top-3 text-base'"
                :style="{ color: fieldErrors.firstName ? '#ef4444' : firstName ? '#f97316' : '#6b7280' }"
              >
                First Name
              </label>
            </div>
            <p v-if="fieldErrors.firstName" class="text-red-500 text-xs mt-1">{{ fieldErrors.firstName }}</p>

            <div class="relative">
              <input
                id="lastName"
                v-model="lastName"
                @blur="validateField('lastName', lastName)"
                type="text"
                class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                :class="fieldErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                placeholder=" "
                required
              />
              <label
                for="lastName"
                class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2"
                :class="lastName ? 'top-1 text-xs bg-white px-2' : 'top-3 text-base'"
                :style="{ color: fieldErrors.lastName ? '#ef4444' : lastName ? '#f97316' : '#6b7280' }"
              >
                Last Name
              </label>
            </div>
            <p v-if="fieldErrors.lastName" class="text-red-500 text-xs mt-1">{{ fieldErrors.lastName }}</p>
          </div>

          <!-- Next Button -->
          <button
            type="button"
            @click="showStep2 = true"
            :disabled="!canProceedToStep2()"
            class="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-full shadow-md text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            :class="canProceedToStep2() ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'"
          >
            Continue
            <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Step 2: Account Information -->
        <form v-if="showStep2" @submit.prevent="handleRegister" class="mb-8 space-y-6">
          <!-- Selected Role Display -->
          <div class="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-orange-100 rounded-lg">
                  <UserIcon v-if="selectedRole === 'aventurier'" class="w-5 h-5 text-orange-500" />
                  <ShoppingBagIcon v-else class="w-5 h-5 text-orange-500" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-700">Selected Role</p>
                  <p class="text-lg font-semibold text-orange-600 capitalize">{{ selectedRole }}: {{ firstName }} {{ lastName }}</p>
                </div>
              </div>
              <button
                type="button"
                @click="showStep2 = false"
                class="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>

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
              class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2"
              :class="email ? 'top-1 text-xs bg-white px-2' : 'top-3 text-base'"
              :style="{ color: fieldErrors.email ? '#ef4444' : email ? '#f97316' : '#6b7280' }"
            >
              Email Address
            </label>
          </div>
          <p v-if="fieldErrors.email" class="text-red-500 text-xs mt-1">{{ fieldErrors.email }}</p>

          <!-- Password Input with floating label -->
          <div class="relative">
            <input
              id="password"
              v-model="password"
              @blur="validateField('password', password)"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
              :class="fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
              placeholder=" "
              required
            />
            <label
              for="password"
              class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2"
              :class="password ? 'top-1 text-xs bg-white px-2' : 'top-3 text-base'"
              :style="{ color: fieldErrors.password ? '#ef4444' : password ? '#f97316' : '#6b7280' }"
            >
              Password
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
          <p v-if="fieldErrors.password" class="text-red-500 text-xs mt-1">{{ fieldErrors.password }}</p>

          <!-- Confirm Password Input with floating label -->
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              @blur="validateField('confirmPassword', confirmPassword)"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
              :class="fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
              placeholder=" "
              required
            />
            <label
              for="confirmPassword"
              class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2"
              :class="confirmPassword ? 'top-1 text-xs bg-white px-2' : 'top-3 text-base'"
              :style="{ color: fieldErrors.confirmPassword ? '#ef4444' : confirmPassword ? '#f97316' : '#6b7280' }"
            >
              Confirm Password
            </label>
            <button
              type="button"
              @click="toggleConfirmPasswordVisibility"
              class="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <svg v-if="showConfirmPassword" class="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="fieldErrors.confirmPassword" class="text-red-500 text-xs mt-1">{{ fieldErrors.confirmPassword }}</p>

          <!-- Navigation Buttons -->
          <div class="flex gap-4">
            <button
              type="button"
              @click="showStep2 = false"
              class="flex-1 flex justify-center py-3 px-6 border border-gray-300 rounded-full shadow-md text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 flex justify-center py-3 px-6 border border-transparent rounded-full shadow-md text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 transition-all duration-200"
            >
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </div>
        </form>

        <!-- Sign In Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
              Sign in
            </router-link>
          </p>
        </div>

      </div>
    </div>

    <!-- Language Switcher - Bottom Left -->
    <div class="fixed bottom-6 left-6 z-50">
      <LanguageSwitcher />
    </div>
  </div>
</template>