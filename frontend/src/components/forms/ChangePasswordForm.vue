<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-orange-500">
      {{ t('profile.security.title') }}
    </h2>

    <!-- Current Password -->
    <div>
      <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
        {{ t('profile.security.currentPassword') }}
      </label>
      <div class="relative">
        <input
          id="currentPassword"
          v-model="currentPassword"
          :type="showCurrentPassword ? 'text' : 'password'"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="showCurrentPassword = !showCurrentPassword"
        >
          <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <!-- New Password -->
    <div>
      <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
        {{ t('profile.security.newPassword') }}
      </label>
      <div class="relative">
        <input
          id="newPassword"
          v-model="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          required
          minlength="8"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="showNewPassword = !showNewPassword"
        >
          <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <!-- Confirm Password -->
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
        {{ t('profile.security.confirmPassword') }}
      </label>
      <div class="relative">
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
        {{ t('profile.security.passwordMismatch') }}
      </p>
    </div>

    <!-- Messages -->
    <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
      <i class="fas fa-check-circle mr-2"></i> {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i> {{ errorMessage }}
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end pt-4">
      <button
        type="submit"
        :disabled="isLoading || passwordMismatch || !isFormValid"
        class="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">
          <i class="fas fa-spinner fa-spin mr-2"></i> {{ t('profile.messages.loading') }}
        </span>
        <span v-else>
          {{ t('profile.security.changePassword') }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
// import { userService } from '@/services/userService' 

const { t } = useI18n()
const authStore = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value
})

const isFormValid = computed(() => {
  return currentPassword.value && newPassword.value && confirmPassword.value && 
         newPassword.value.length >= 8 && !passwordMismatch.value
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await authStore.changePassword(currentPassword.value, newPassword.value)
    
    successMessage.value = t('profile.security.passwordUpdated')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    
    // Reset validation state if needed (ref values are reactive so computed properties update automatically)
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = t('profile.security.error')
    }
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>
