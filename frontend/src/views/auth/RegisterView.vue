<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
      errorMessage.value = t('auth.errors.image_invalid')
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
        fieldErrors.value[field] = t('auth.errors.firstname_required')
      } else if (value.trim().length < 2) {
        fieldErrors.value[field] = t('auth.errors.min_length')
      } else {
        fieldErrors.value[field] = ''
      }
      break
    case 'lastName':
      if (!value.trim()) {
        fieldErrors.value[field] = t('auth.errors.lastname_required')
      } else if (value.trim().length < 2) {
        fieldErrors.value[field] = t('auth.errors.min_length')
      } else {
        fieldErrors.value[field] = ''
      }
      break
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
      } else if (value.length < 6) {
        fieldErrors.value[field] = t('auth.errors.password_length')
      } else {
        fieldErrors.value[field] = ''
      }
      break
    case 'confirmPassword':
      if (!value) {
        fieldErrors.value[field] = t('auth.errors.required')
      } else if (value !== password.value) {
        fieldErrors.value[field] = t('auth.errors.password_mismatch')
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
    errorMessage.value = t('auth.errors.fill_all')
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
  <div class="min-h-screen flex font-body">
    <!-- Left side - Map -->
    <div
      class="hidden md:flex w-1/2 bg-aged-paper relative overflow-hidden items-center justify-center p-6 border-r-4 border-double border-antique-bronze/30">
      <div class="absolute inset-0 opacity-10 pointer-events-none"></div>
      <img src="/images/login_image.png" alt="Register"
        class="w-11/12 h-auto rounded-lg shadow-2xl transform scale-105 rotate-1 border-4 border-antique-bronze/20 sepia-[0.3]">
    </div>

    <!-- Right side - Register Form -->
    <div class="flex-1 md:w-1/2 bg-parchment flex flex-col justify-center p-8 relative">
      <div class="absolute inset-0 opacity-20 pointer-events-none"></div>

      <div class="w-full max-w-md mx-auto relative z-10">
        <!-- Logo -->
        <div class="mb-8 text-center">
          <img src="/images/transparent_logo.png" alt="MedievalEvent Logo"
            class="h-40 w-auto mx-auto mb-6 drop-shadow-md">
        </div>

        <!-- Title -->
        <div class="mb-8 text-left">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-medieval font-bold text-iron-black">
              {{ t('auth.register.title') }}
            </h1>
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-medieval border-2 transition-all duration-300"
                  :class="!showStep2 ? 'bg-antique-bronze text-white border-antique-bronze' : 'bg-parchment text-stone-grey border-stone-grey/30'">
                  I
                </div>
                <div class="w-8 h-1 rounded bg-stone-grey/20" />
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-medieval border-2 transition-all duration-300"
                  :class="showStep2 ? 'bg-antique-bronze text-white border-antique-bronze' : 'bg-parchment text-stone-grey border-stone-grey/30'">
                  II
                </div>
              </div>
            </div>
          </div>
          <p class="text-stone-grey text-lg mb-4 italic">
            {{ t('auth.register.subtitle') }}
          </p>
          <!-- Bronze line -->
          <div class="w-24 h-1 bg-antique-bronze rounded-full" />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage"
          class="mb-6 p-4 bg-red-50/80 border-l-4 border-red-800 rounded-r-lg shadow-sm backdrop-blur-sm">
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-red-900">
                {{ errorMessage }}
              </p>
            </div>
            <div class="ml-3 flex-shrink-0">
              <button class="text-red-700 hover:text-red-900 transition-colors" @click="errorMessage = ''">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading"
          class="fixed inset-0 bg-iron-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            class="bg-parchment p-8 rounded-lg shadow-2xl border-2 border-antique-bronze flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-4 border-antique-bronze" />
            <span class="text-iron-black font-medieval text-xl">{{ t('auth.register.creating') }}</span>
          </div>
        </div>

        <!-- Role Selection (Only in Step 1) -->
        <div v-if="!showStep2" class="mb-6">
          <p class="text-stone-grey text-base mb-3 font-medieval font-bold">
            {{ t('auth.register.role_title') }}
          </p>
          <div class="grid grid-cols-2 gap-4">
            <!-- Aventurier Role -->
            <button type="button" class="relative p-4 rounded-lg border-2 transition-all cursor-pointer group"
              :class="selectedRole === 'aventurier' ? 'border-antique-bronze bg-antique-bronze/10' : 'border-stone-grey/30 bg-white/50 hover:border-antique-bronze/50'"
              @click="selectedRole = 'aventurier'">
              <div class="flex flex-col items-center space-y-2">
                <div class="p-2 rounded-full transition-colors"
                  :class="selectedRole === 'aventurier' ? 'bg-antique-bronze text-white' : 'bg-stone-grey/10 text-stone-grey group-hover:text-antique-bronze'">
                  <i class="fas fa-user w-6 h-6" />
                </div>
                <span class="font-medieval font-bold text-sm"
                  :class="selectedRole === 'aventurier' ? 'text-antique-bronze' : 'text-stone-grey'">
                  {{ t('auth.register.roles.aventurier') }}
                </span>
              </div>
              <div v-if="selectedRole === 'aventurier'" class="absolute -top-2 -right-2">
                <div
                  class="w-6 h-6 bg-antique-bronze rounded-full flex items-center justify-center shadow-sm border-2 border-parchment">
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
            </button>

            <!-- prestataire Role -->
            <button type="button" class="relative p-4 rounded-lg border-2 transition-all cursor-pointer group"
              :class="selectedRole === 'prestataire' ? 'border-antique-bronze bg-antique-bronze/10' : 'border-stone-grey/30 bg-white/50 hover:border-antique-bronze/50'"
              @click="selectedRole = 'prestataire'">
              <div class="flex flex-col items-center space-y-2">
                <div class="p-2 rounded-full transition-colors"
                  :class="selectedRole === 'prestataire' ? 'bg-antique-bronze text-white' : 'bg-stone-grey/10 text-stone-grey group-hover:text-antique-bronze'">
                  <i class="fas fa-shopping-bag w-6 h-6" />
                </div>
                <span class="font-medieval font-bold text-sm"
                  :class="selectedRole === 'prestataire' ? 'text-antique-bronze' : 'text-stone-grey'">
                  {{ t('auth.register.roles.prestataire') }}
                </span>
              </div>
              <div v-if="selectedRole === 'prestataire'" class="absolute -top-2 -right-2">
                <div
                  class="w-6 h-6 bg-antique-bronze rounded-full flex items-center justify-center shadow-sm border-2 border-parchment">
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Avatar Selection (Only in Step 1) -->
        <div v-if="!showStep2" class="mb-6">
          <div class="relative">
            <div
              class="flex items-center justify-between w-full px-4 py-3 bg-white/50 border-2 rounded-lg transition-all duration-200"
              :class="selectedAvatar ? 'border-antique-bronze/50' : 'border-stone-grey/30'">
              <!-- Avatar Preview -->
              <div class="flex items-center space-x-3">
                <div v-if="selectedAvatar"
                  class="w-12 h-12 rounded-full overflow-hidden border-2 border-antique-bronze flex-shrink-0 shadow-sm">
                  <img
                    :src="selectedAvatar.startsWith('blob:') ? selectedAvatar : `/images/Avatar-images/${selectedAvatar}`"
                    :alt="selectedAvatar" class="w-full h-full object-cover">
                </div>
                <div v-else
                  class="w-12 h-12 rounded-full bg-stone-grey/10 border-2 border-dashed border-stone-grey/30 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user text-stone-grey/50" />
                </div>
                <span class="text-iron-black font-medium">
                  {{ selectedAvatar ? t('auth.register.avatar.selected') : t('auth.register.avatar.choose') }}
                </span>
              </div>

              <!-- Avatar Selection Buttons -->
              <div class="flex space-x-2">
                <button type="button"
                  class="px-3 py-1.5 bg-antique-bronze text-white rounded-md hover:brightness-110 transition-all text-sm font-medieval font-bold shadow-sm"
                  @click="openAvatarModal">
                  <i class="fas fa-images mr-1" />
                  {{ t('auth.register.avatar.gallery') }}
                </button>
                <label
                  class="px-3 py-1.5 bg-stone-grey text-white rounded-md hover:bg-iron-black transition-all text-sm font-medieval font-bold cursor-pointer shadow-sm">
                  <i class="fas fa-upload mr-1" />
                  {{ t('auth.register.avatar.import') }}
                  <input type="file" accept="image/*" class="hidden" @change="handleFileUpload">
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 1: Name Information -->
        <div v-if="!showStep2" class="mb-8">
          <!-- Name Inputs -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="relative group">
              <input id="firstName" v-model="firstName" type="text"
                class="w-full px-4 py-3 bg-white/50 border-2 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 peer"
                :class="fieldErrors.firstName ? 'border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
                :placeholder="t('auth.register.names.first')" required @blur="validateField('firstName', firstName)"
                @input="validateField('firstName', firstName)">
              <label for="firstName"
                class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval" :class="[
                  firstName ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey',
                  fieldErrors.firstName ? 'text-red-600' : ''
                ]">
                {{ fieldErrors.firstName || t('auth.register.names.first') }}
              </label>
            </div>

            <div class="relative group">
              <input id="lastName" v-model="lastName" type="text"
                class="w-full px-4 py-3 bg-white/50 border-2 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 peer"
                :class="fieldErrors.lastName ? 'border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
                :placeholder="t('auth.register.names.last')" required @blur="validateField('lastName', lastName)"
                @input="validateField('lastName', lastName)">
              <label for="lastName"
                class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval" :class="[
                  lastName ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey',
                  fieldErrors.lastName ? 'text-red-600' : ''
                ]">
                {{ fieldErrors.lastName || t('auth.register.names.last') }}
              </label>
            </div>
          </div>

          <!-- Next Button -->
          <button type="button" :disabled="!canProceedToStep2()"
            class="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-medieval font-bold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-antique-bronze transform hover:-translate-y-0.5"
            :class="canProceedToStep2() ? 'bg-antique-bronze hover:brightness-110 cursor-pointer' : 'bg-stone-grey/50 cursor-not-allowed'"
            @click="showStep2 = true">
            {{ t('auth.register.next') }}
            <i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>

        <!-- Step 2: Account Information -->
        <form v-if="showStep2" class="mb-8 space-y-6" @submit.prevent="handleRegister">
          <!-- Selected Role Display -->
          <div class="mb-6 p-4 bg-antique-bronze/10 border border-antique-bronze/30 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <!-- Avatar Display -->
                <div v-if="selectedAvatar"
                  class="w-12 h-12 rounded-full overflow-hidden border-2 border-antique-bronze flex-shrink-0">
                  <img
                    :src="selectedAvatar.startsWith('blob:') ? selectedAvatar : `/images/Avatar-images/${selectedAvatar}`"
                    :alt="selectedAvatar" class="w-full h-full object-cover">
                </div>

                <!-- Role and Name -->
                <div class="text-left">
                  <p class="text-xs font-medieval text-stone-grey uppercase tracking-wider">
                    {{ t('auth.register.identity') }}
                  </p>
                  <p class="text-base font-bold text-iron-black capitalize">
                    <span class="text-antique-bronze">{{ selectedRole }}</span> {{ firstName }} {{ lastName }}
                  </p>
                </div>
              </div>
              <button type="button"
                class="text-antique-bronze hover:text-iron-black text-sm font-bold font-medieval transition-colors cursor-pointer underline decoration-antique-bronze/30 underline-offset-2"
                @click="showStep2 = false">
                {{ t('auth.register.edit') }}
              </button>
            </div>
          </div>

          <!-- Email Input with floating label -->
          <div class="relative group">
            <input id="email" v-model="email" type="email"
              class="w-full px-4 py-3 bg-white/50 border-2 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 peer"
              :class="fieldErrors.email ? 'border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
              :placeholder="t('auth.login.email_placeholder')" required @blur="validateField('email', email)">
            <label for="email" class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval"
              :class="[
                email ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey',
                fieldErrors.email ? 'text-red-600' : ''
              ]">
              {{ fieldErrors.email || t('auth.login.email_label') }}
            </label>
          </div>

          <!-- Password Input with floating label -->
          <div class="relative group">
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 bg-white/50 border-2 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 peer"
              :class="fieldErrors.password ? 'border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
              :placeholder="t('auth.login.password_placeholder')" required @blur="validateField('password', password)">
            <label for="password" class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval"
              :class="[
                password ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey',
                fieldErrors.password ? 'text-red-600' : ''
              ]">
              {{ fieldErrors.password || t('auth.login.password_label') }}
            </label>
            <button type="button"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-antique-bronze hover:text-iron-black transition-colors"
              @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>

          <!-- Confirm Password Input with floating label -->
          <div class="relative group">
            <input id="confirmPassword" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 bg-white/50 border-2 rounded-lg text-base text-iron-black placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 peer"
              :class="fieldErrors.confirmPassword ? 'border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
              :placeholder="t('auth.register.confirm_password')" required
              @blur="validateField('confirmPassword', confirmPassword)">
            <label for="confirmPassword"
              class="absolute left-4 transition-all duration-200 pointer-events-none font-medieval" :class="[
                confirmPassword ? '-top-3 text-xs bg-parchment px-2 text-antique-bronze' : 'top-3 text-base text-stone-grey',
                fieldErrors.confirmPassword ? 'text-red-600' : ''
              ]">
              {{ fieldErrors.confirmPassword || t('auth.register.confirm_password') }}
            </label>
            <button type="button"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-antique-bronze hover:text-iron-black transition-colors"
              @click="toggleConfirmPasswordVisibility">
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex gap-4">
            <button type="button"
              class="flex-1 flex justify-center py-3 px-6 border-2 border-stone-grey/30 rounded-lg shadow-sm text-base font-medieval font-bold text-stone-grey bg-white/50 hover:bg-stone-grey/10 hover:text-iron-black transition-all duration-200"
              @click="showStep2 = false">
              {{ t('auth.register.back') }}
            </button>
            <button type="submit" :disabled="isLoading"
              class="flex-1 flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-base font-medieval font-bold text-white bg-antique-bronze hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-antique-bronze disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5">
              {{ isLoading ? t('auth.register.creating') : t('auth.register.submit') }}
            </button>
          </div>
        </form>

        <!-- Sign In Link -->
        <div class="mt-8 text-center">
          <p class="text-stone-grey">
            {{ t('auth.register.already_account') }}
            <router-link to="/login"
              class="font-medieval font-bold text-antique-bronze hover:text-iron-black transition-colors ml-1 text-lg">
              {{ t('auth.register.signin') }}
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Avatar Selection Modal -->
    <div v-if="showAvatarModal"
      class="fixed inset-0 bg-iron-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      @click="closeAvatarModal">
      <div
        class="bg-parchment rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden border-4 border-double border-antique-bronze"
        @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-antique-bronze/20 bg-antique-bronze/5">
          <h3 class="text-2xl font-medieval font-bold text-iron-black">
            {{ t('auth.register.avatar.modal_title') }}
          </h3>
          <button class="text-stone-grey hover:text-red-700 transition-colors" @click="closeAvatarModal">
            <i class="fas fa-times text-xl" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[60vh] bg-opacity-50">
          <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4">
            <div v-for="avatar in availableAvatars" :key="avatar"
              class="aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-antique-bronze"
              :class="selectedAvatar === avatar ? 'border-antique-bronze ring-4 ring-antique-bronze/20 scale-105' : 'border-stone-grey/30'"
              @click="selectAvatar(avatar)">
              <img :src="`/images/Avatar-images/${avatar}`" :alt="avatar" class="w-full h-full object-cover">
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end p-6 border-t border-antique-bronze/20 bg-antique-bronze/5">
          <button
            class="px-6 py-2 bg-stone-grey text-white rounded-lg hover:bg-iron-black transition-colors font-medieval font-bold shadow-md"
            @click="closeAvatarModal">
            {{ t('auth.register.avatar.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>