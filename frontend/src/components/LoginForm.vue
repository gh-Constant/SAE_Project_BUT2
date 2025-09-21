<template>
  <div
    class="h-full w-full flex overflow-hidden"
    style="z-index: -1;"
  >
    <!-- Left side - Image (Hidden on mobile) -->
    <div class="hidden md:flex w-1/2 bg-gray-100 items-center justify-center p-8">
      <div class="max-w-xl text-center">
        <img
          src="/images/login_image.png"
          alt="MedievalEvent Login"
          class="w-4/5 h-auto rounded-lg shadow-lg mx-auto transform scale-150 rotate-3"
        />
      </div>
    </div>

    <!-- Right side - Login Form (Full width on mobile) -->
    <div class="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
      <div class="w-full max-w-md">

        <!-- Welcome Text -->
        <div class="mb-12 text-left">
          <h1 class="mb-3 tracking-tight leading-none" style="font-size: 3rem; font-weight: 900; color: #111827; text-shadow: 3px 3px 6px rgba(0,0,0,0.15); font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.02em;">Welcome Back</h1>
          <p class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Enter your details to login</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Input -->
          <div>
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
          <div>
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
                  v-if="showPassword"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me and Need Help -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                id="remember"
                class="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label for="remember" class="ml-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-medium">
                Remember me
              </label>
            </div>
            <button
              type="button"
              class="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Need help?
            </button>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            Sign In
          </button>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-8 text-center">
          <p class="text-gray-600">
            Don't have an account?
            <router-link to="/register" class="text-orange-500 hover:text-orange-600 font-semibold ml-1">
              Create one here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = () => {
  console.log('Login attempt:', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  })
}

// Emit events for parent component
defineEmits<{
  login: [data: { email: string; password: string; rememberMe: boolean }]
}>()

// Expose methods for parent component
defineExpose({
  handleLogin,
  email,
  password,
  rememberMe
})
</script>