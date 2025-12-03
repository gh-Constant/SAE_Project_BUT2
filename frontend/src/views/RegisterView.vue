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
const selectedRole = ref<'aventurier' | 'prestataire'>('aventurier')
const selectedAvatar = ref<string>('')
const showAvatarModal = ref(false)
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
  return firstName.value.trim() !== '' && lastName.value.trim() !== '' && selectedAvatar.value !== ''
}

// Générer la liste des avatars disponibles
const availableAvatars = Array.from({ length: 42 }, (_, i) => `con${i + 1}.png`)

const selectAvatar = (avatar: string) => {
  selectedAvatar.value = avatar
  showAvatarModal.value = false
}

const openAvatarModal = () => {
  showAvatarModal.value = true
}

const closeAvatarModal = () => {
  showAvatarModal.value = false
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Vérifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Veuillez sélectionner un fichier image valide'
      return
    }
    
    // Créer une URL pour l'image téléchargée
    const imageUrl = URL.createObjectURL(file)
    selectedAvatar.value = imageUrl
    showAvatarModal.value = false
  }
}

const validateField = (field: string, value: string) => {
  switch (field) {
    case 'firstName':
      if (!value.trim()) {
        fieldErrors.value[field] = 'First Name is required'
      } else if (value.trim().length < 2) {
        fieldErrors.value[field] = 'Must be at least 2 characters'
      } else {
        fieldErrors.value[field] = ''
      }
      break
    case 'lastName':
      if (!value.trim()) {
        fieldErrors.value[field] = 'Last Name is required'
      } else if (value.trim().length < 2) {
        fieldErrors.value[field] = 'Must be at least 2 characters'
      } else {
        fieldErrors.value[field] = ''
      }
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        fieldErrors.value[field] = 'Email Address is required'
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
        fieldErrors.value[field] = 'Confirm Password is required'
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
    // Préparer les données d'avatar
    let avatarUrl: string | undefined = undefined
    let avatarType: string | undefined = undefined

    if (selectedAvatar.value) {
      if (selectedAvatar.value.startsWith('blob:')) {
        // Image uploadée - pour l'instant on ne peut pas l'envoyer au backend
        // TODO: Implémenter l'upload vers le serveur
        avatarUrl = selectedAvatar.value
        avatarType = 'upload'
      } else {
        // Image de la galerie
        avatarUrl = `/images/Avatar-images/${selectedAvatar.value}`
        avatarType = 'gallery'
      }
    }
    
    await authStore.register(firstName.value, lastName.value, email.value, password.value, selectedRole.value, avatarUrl, avatarType)
    console.log('Registration successful:', authStore.user)
    await router.push('/')
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
      <img
        src="/images/login_image.png"
        alt="Register"
        class="w-4/5 h-auto rounded-lg shadow-lg transform scale-150 rotate-3"
      >
    </div>

    <!-- Right side - Register Form -->
    <div class="flex-1 md:w-1/2 bg-white flex flex-col justify-center p-8">
      <div class="w-full max-w-md mx-auto">
        <!-- Logo -->
        <div class="mb-8 text-center">
          <img
            src="/images/transparent_logo.png"
            alt="MedievalEvent Logo"
            class="h-39 w-auto mx-auto mb-6"
          >
        </div>

        <!-- Title -->
        <div class="mb-8 text-left">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-bold text-black">
              Create Account
            </h1>
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  :class="!showStep2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'"
                >
                  1
                </div>
                <div class="w-8 h-1 bg-gray-200 rounded" />
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  :class="showStep2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'"
                >
                  2
                </div>
              </div>
            </div>
          </div>
          <p class="text-black text-lg mb-4">
            Join Les Terres Du Lion and start your adventure
          </p>
          <!-- Orange line -->
          <div class="w-24 h-1 bg-orange-500" />
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </p>
            </div>
            <div class="ml-3 flex-shrink-0">
              <button
                class="text-red-400 hover:text-red-600 transition-colors"
                @click="errorMessage = ''"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div
          v-if="isLoading"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
            <span class="text-gray-700">Creating account...</span>
          </div>
        </div>

        <!-- Role Selection (Only in Step 1) -->
        <div
          v-if="!showStep2"
          class="mb-6"
        >
          <p class="text-gray-500 text-base mb-3">
            Please select your role
          </p>
          <div class="grid grid-cols-2 gap-2">
            <!-- Aventurier Role -->
            <button
              type="button"
              class="relative p-3 rounded-lg border-2 transition-all cursor-pointer"
              :class="selectedRole === 'aventurier' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'"
              @click="selectedRole = 'aventurier'"
            >
              <div class="flex flex-col items-center space-y-1">
                <div
                  class="p-1.5 rounded-md"
                  :class="selectedRole === 'aventurier' ? 'bg-orange-100' : 'bg-gray-100'"
                >
                  <i
                    class="fas fa-user w-5 h-5"
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
                  <svg
                    class="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </button>

            <!-- prestataire Role -->
            <button
              type="button"
              class="relative p-3 rounded-lg border-2 transition-all cursor-pointer"
              :class="selectedRole === 'prestataire' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'"
              @click="selectedRole = 'prestataire'"
            >
              <div class="flex flex-col items-center space-y-1">
                <div
                  class="p-1.5 rounded-md"
                  :class="selectedRole === 'prestataire' ? 'bg-orange-100' : 'bg-gray-100'"
                >
                  <i
                    class="fas fa-shopping-bag w-5 h-5"
                    :class="selectedRole === 'prestataire' ? 'text-orange-500' : 'text-gray-400'"
                  />
                </div>
                <span
                  class="font-medium text-xs"
                  :class="selectedRole === 'prestataire' ? 'text-orange-500' : 'text-gray-400'"
                >
                  Prestataire
                </span>
              </div>
              <div
                v-if="selectedRole === 'prestataire'"
                class="absolute -top-1 -right-1"
              >
                <div class="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg
                    class="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
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

        <!-- Avatar Selection (Only in Step 1) -->
        <div
          v-if="!showStep2"
          class="mb-6"
        >
          <div class="relative">
            <div class="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200">
              <!-- Avatar Preview -->
              <div class="flex items-center space-x-3">
                <div
                  v-if="selectedAvatar"
                  class="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0"
                >
                  <img 
                    :src="selectedAvatar.startsWith('blob:') ? selectedAvatar : `/images/Avatar-images/${selectedAvatar}`" 
                    :alt="selectedAvatar"
                    class="w-full h-full object-cover rounded-full"
                  >
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-user text-gray-400" />
                </div>
                <span class="text-gray-700 font-medium">
                  {{ selectedAvatar ? 'Avatar sélectionné' : 'Choisir un avatar' }}
                </span>
              </div>
              
              <!-- Avatar Selection Buttons -->
              <div class="flex space-x-2">
                <button
                  type="button"
                  class="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
                  @click="openAvatarModal"
                >
                  <i class="fas fa-images mr-1" />
                  Galerie
                </button>
                <label class="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium cursor-pointer">
                  <i class="fas fa-upload mr-1" />
                  Importer
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                  >
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 1: Name Information -->
        <div
          v-if="!showStep2"
          class="mb-8"
        >
          <!-- Name Inputs -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="relative">
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                :class="fieldErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                placeholder=" "
                required
                @blur="validateField('firstName', firstName)"
                @input="validateField('firstName', firstName)"
              >
              <label
                for="firstName"
                class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                :class="firstName ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                :style="{ color: fieldErrors.firstName ? '#ef4444' : firstName ? '#f97316' : '#6b7280' }"
              >
                {{ fieldErrors.firstName || 'First Name' }}
              </label>
            </div>

            <div class="relative">
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                :class="fieldErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                placeholder=" "
                required
                @blur="validateField('lastName', lastName)"
                @input="validateField('lastName', lastName)"
              >
              <label
                for="lastName"
                class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                :class="lastName ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                :style="{ color: fieldErrors.lastName ? '#ef4444' : lastName ? '#f97316' : '#6b7280' }"
              >
                {{ fieldErrors.lastName || 'Last Name' }}
              </label>
            </div>
          </div>

          <!-- Next Button -->
          <button
            type="button"
            :disabled="!canProceedToStep2()"
            class="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-full shadow-md text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            :class="canProceedToStep2() ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'"
            @click="showStep2 = true"
          >
            Continue
            <svg
              class="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Step 2: Account Information -->
        <form
          v-if="showStep2"
          class="mb-8 space-y-6"
          @submit.prevent="handleRegister"
        >
          <!-- Selected Role Display -->
          <div class="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <!-- Avatar Display -->
                <div
                  v-if="selectedAvatar"
                  class="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0"
                >
                  <img 
                    :src="selectedAvatar.startsWith('blob:') ? selectedAvatar : `/images/Avatar-images/${selectedAvatar}`" 
                    :alt="selectedAvatar"
                    class="w-full h-full object-cover rounded-full"
                  >
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-user text-gray-400" />
                </div>
                
                <!-- Role and Name -->
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-700">
                    Selected Role
                  </p>
                  <p class="text-lg font-semibold text-orange-600 capitalize">
                    {{ selectedRole }}: {{ firstName }} {{ lastName }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors cursor-pointer"
                @click="showStep2 = false"
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
              type="email"
              class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
              :class="fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
              placeholder=" "
              required
              @blur="validateField('email', email)"
            >
            <label
              for="email"
              class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
              :class="email ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
              :style="{ color: fieldErrors.email ? '#ef4444' : email ? '#f97316' : '#6b7280' }"
            >
              {{ fieldErrors.email || 'Email Address' }}
            </label>
          </div>

          <!-- Password Input with floating label -->
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
              :class="fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
              placeholder=" "
              required
              @blur="validateField('password', password)"
            >
            <label
              for="password"
              class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
              :class="password ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
              :style="{ color: fieldErrors.password ? '#ef4444' : password ? '#f97316' : '#6b7280' }"
            >
              {{ fieldErrors.password || 'Password' }}
            </label>
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-4 flex items-center"
              @click="togglePasswordVisibility"
            >
              <svg
                v-if="showPassword"
                class="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            </button>
          </div>

          <!-- Confirm Password Input with floating label -->
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
              :class="fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
              placeholder=" "
              required
              @blur="validateField('confirmPassword', confirmPassword)"
            >
            <label
              for="confirmPassword"
              class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
              :class="confirmPassword ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
              :style="{ color: fieldErrors.confirmPassword ? '#ef4444' : confirmPassword ? '#f97316' : '#6b7280' }"
            >
              {{ fieldErrors.confirmPassword || 'Confirm Password' }}
            </label>
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-4 flex items-center"
              @click="toggleConfirmPasswordVisibility"
            >
              <svg
                v-if="showConfirmPassword"
                class="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            </button>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex gap-4">
            <button
              type="button"
              class="flex-1 flex justify-center py-3 px-6 border border-gray-300 rounded-full shadow-md text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              @click="showStep2 = false"
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
            <router-link
              to="/login"
              class="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
            >
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Avatar Selection Modal -->
    <div
      v-if="showAvatarModal"
      class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      @click="closeAvatarModal"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            Choisissez votre avatar
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors"
            @click="closeAvatarModal"
          >
            <i class="fas fa-times text-xl" />
          </button>
        </div>
        
        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
            <div
              v-for="avatar in availableAvatars"
              :key="avatar"
              class="w-16 h-16 rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
              :class="selectedAvatar === avatar ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'"
              @click="selectAvatar(avatar)"
            >
              <img 
                :src="`/images/Avatar-images/${avatar}`" 
                :alt="avatar"
                class="w-full h-full object-cover"
              >
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="flex justify-end p-6 border-t border-gray-200">
          <button
            class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            @click="closeAvatarModal"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>