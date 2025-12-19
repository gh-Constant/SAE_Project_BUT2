<!--
  @file ProfileForm.vue
  @description
  Formulaire de modification du profil utilisateur (tous types de comptes) avec style Login/Register.
  Permet de modifier les informations personnelles et l'avatar.
  
  @utilité
  - Affiche et permet la modification des informations du profil pour tous les utilisateurs
  - Gère la validation côté client avec floating labels
  - Gère les états de chargement, succès et erreur
  - Affiche la galerie d'avatars comme dans RegisterView
  - Affiche le type de prestataire uniquement si l'utilisateur est prestataire
-->
<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Title -->
      <div class="mb-8 text-left">
        <h1 class="text-3xl font-bold text-black mb-2">
          {{ t('profile.title') }}
        </h1>
        <p class="text-black text-lg mb-4">
          Modifiez vos informations personnelles
        </p>
        <!-- Orange line -->
        <div class="w-24 h-1 bg-orange-500" />
      </div>


      <form @submit.prevent="handleSubmit">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- AVATAR - Centré en haut -->
          <div class="mb-12 flex flex-col items-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ t('profile.fields.avatar') }}</h3>
            
            <!-- Avatar Preview - Grand et centré -->
            <div class="mb-6">
              <div
                v-if="currentAvatarUrl || selectedAvatar"
                class="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 shadow-xl mx-auto"
              >
                <img 
                  :src="(selectedAvatar && selectedAvatar.startsWith('blob:')) ? selectedAvatar : (selectedAvatar ? `/images/Avatar-images/${selectedAvatar}` : currentAvatarUrl || '')" 
                  :alt="(selectedAvatar || 'Avatar')"
                  class="w-full h-full object-cover"
                >
              </div>
              <div
                v-else
                class="w-32 h-32 rounded-full bg-gray-200 border-4 border-dashed border-gray-300 flex items-center justify-center mx-auto"
              >
                <i class="fas fa-user text-gray-400 text-5xl" />
              </div>
            </div>
            
            <!-- Avatar Selection Buttons - Centrés -->
            <div class="flex space-x-3">
              <button
                type="button"
                class="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-sm font-medium shadow-md flex items-center"
                @click="openAvatarModal"
              >
                <i class="fas fa-images mr-2" />
                {{ t('profile.fields.avatarTypeGallery') }}
              </button>
              <label class="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors text-sm font-medium cursor-pointer shadow-md flex items-center">
                <i class="fas fa-upload mr-2" />
                {{ t('profile.fields.avatarTypeUpload') }}
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                >
              </label>
            </div>
            
            <!-- Types d'utilisateur (affichage seulement) - Sous l'avatar -->
            <div v-if="isUserPrestataire || isUserAventurier" class="mt-6 text-center space-y-2">
              <!-- Type de Prestataire -->
              <div v-if="isUserPrestataire" class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                <i class="fas fa-briefcase mr-2" />
                <span class="font-semibold">{{ prestataireTypeName }}</span>
              </div>
              <!-- Type Aventurier -->
              <div v-if="isUserAventurier" class="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800">
                <i class="fas fa-user-ninja mr-2" />
                <span class="font-semibold">{{ t('profile.fields.aventurier') }}</span>
              </div>
            </div>
          </div>

          <!-- SECTION 1: Identité -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
              {{ t('profile.sections.identity') }}
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Prénom -->
              <div class="relative">
                <input
                  id="firstname"
                  v-model="formData.firstname"
                  type="text"
                  maxlength="255"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                  :class="fieldErrors.firstname ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                  placeholder=" "
                  required
                  @blur="validateField('firstname', formData.firstname)"
                  @input="validateField('firstname', formData.firstname)"
                >
                <label 
                  for="firstname" 
                  class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.firstname ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.firstname ? '#ef4444' : formData.firstname ? '#f97316' : '#6b7280' }"
                >
                  {{ (fieldErrors.firstname && formData.firstname) ? fieldErrors.firstname : t('profile.fields.firstname') }}
                </label>
                <p v-if="fieldErrors.firstname && formData.firstname" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.firstname }}
                </p>
              </div>

              <!-- Nom -->
              <div class="relative">
                <input
                  id="lastname"
                  v-model="formData.lastname"
                  type="text"
                  maxlength="255"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                  :class="fieldErrors.lastname ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                  placeholder=" "
                  required
                  @blur="validateField('lastname', formData.lastname)"
                  @input="validateField('lastname', formData.lastname)"
                >
                <label 
                  for="lastname" 
                  class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.lastname ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.lastname ? '#ef4444' : formData.lastname ? '#f97316' : '#6b7280' }"
                >
                  {{ (fieldErrors.lastname && formData.lastname) ? fieldErrors.lastname : t('profile.fields.lastname') }}
                </label>
                <p v-if="fieldErrors.lastname && formData.lastname" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.lastname }}
                </p>
              </div>

              <!-- Email -->
              <div class="relative">
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  maxlength="255"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                  :class="fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                  placeholder=" "
                  required
                  @blur="validateField('email', formData.email)"
                  @input="validateField('email', formData.email)"
                >
                <label 
                  for="email" 
                  class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.email ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.email ? '#ef4444' : formData.email ? '#f97316' : '#6b7280' }"
                >
                  {{ (fieldErrors.email && formData.email) ? fieldErrors.email : t('profile.fields.email') }}
                </label>
                <p v-if="fieldErrors.email && formData.email" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.email }}
                </p>
              </div>

              <!-- Téléphone -->
              <div class="relative">
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  maxlength="20"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                  :class="fieldErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                  placeholder=" "
                  @blur="validateField('phone', formData.phone)"
                  @input="validateField('phone', formData.phone)"
                >
                <label 
                  for="phone" 
                  class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.phone ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.phone ? '#ef4444' : formData.phone ? '#f97316' : '#6b7280' }"
                >
                  {{ (fieldErrors.phone && formData.phone) ? fieldErrors.phone : t('profile.fields.phone') }}
                </label>
                <p v-if="fieldErrors.phone && formData.phone" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.phone }}
                </p>
              </div>

              <!-- Date de naissance -->
              <div class="relative">
                <input
                  id="birthDate"
                  v-model="formData.birthDate"
                  type="date"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                  :class="fieldErrors.birthDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                  :max="new Date(new Date().setFullYear(new Date().getFullYear() - 15)).toISOString().split('T')[0]"
                  @blur="validateField('birthDate', formData.birthDate || '')"
                >
                <label 
                  for="birthDate" 
                  class="absolute left-4 top-1 text-xs bg-white px-2 text-gray-500"
                  :style="{ color: fieldErrors.birthDate ? '#ef4444' : formData.birthDate ? '#f97316' : '#6b7280' }"
                >
                  {{ (fieldErrors.birthDate && formData.birthDate) ? fieldErrors.birthDate : t('profile.fields.birthDate') }}
                </label>
                <p v-if="fieldErrors.birthDate && formData.birthDate" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.birthDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- SECTION 2: Présentation - Bio -->
          <div class="mb-8 pb-8 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
              {{ t('profile.sections.presentation') }}
            </h3>
            <div class="relative">
              <textarea
                id="bio"
                v-model="formData.bio"
                rows="5"
                maxlength="500"
                class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer resize-none"
                :class="fieldErrors.bio ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                :placeholder="t('profile.fields.bioPlaceholder')"
                @blur="validateField('bio', formData.bio)"
              />
              <label 
                for="bio" 
                class="absolute left-4 top-1 text-xs bg-white px-2 text-gray-500"
                :style="{ color: fieldErrors.bio ? '#ef4444' : '#6b7280' }"
              >
                {{ (fieldErrors.bio && formData.bio) ? fieldErrors.bio : t('profile.fields.bio') }}
              </label>
              <p v-if="fieldErrors.bio && formData.bio" class="mt-1 text-xs text-red-500 px-4">
                {{ fieldErrors.bio }}
              </p>
              <div class="mt-2 flex justify-between items-center">
                <p class="text-xs text-gray-500 ml-4">{{ t('profile.fields.bioHint') }}</p>
                <span class="text-xs" :class="formData.bio.length > 450 ? 'text-red-500' : 'text-gray-500'">
                  {{ formData.bio.length }}/500
                </span>
              </div>
            </div>
          </div>


          <!-- Informations de statut et Actions - Layout horizontal -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
            <!-- Informations de statut -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('profile.status.title') }}</h3>
              <dl class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <dt class="text-sm font-medium text-gray-500">{{ t('profile.status.xp') }}</dt>
                  <dd class="mt-1 text-2xl font-bold text-orange-600">{{ user?.xp || 0 }}</dd>
                </div>
                <div class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <dt class="text-sm font-medium text-gray-500">{{ t('profile.status.level') }}</dt>
                  <dd class="mt-1 text-2xl font-bold text-orange-600">{{ user?.level || 0 }}</dd>
                </div>
              </dl>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col justify-end space-y-4">
              <!-- Messages flash (succès/erreur) - Affichés au-dessus des boutons -->
              <div class="space-y-3">
                <!-- Message de succès -->
                <div
                  v-if="successMessage"
                  class="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-sm"
                >
                  <div class="flex items-start">
                    <div class="flex-1">
                      <ul v-if="changedFields.length > 0" class="space-y-1">
                        <li v-for="field in changedFields" :key="field" class="text-sm font-medium text-green-800">
                          {{ getFieldLabel(field) }} {{ t('profile.messages.updatedSuccess') }}
                        </li>
                      </ul>
                      <p v-else class="text-sm font-medium text-green-800">
                        {{ t('profile.messages.success') }}
                      </p>
                    </div>
                    <div class="ml-3 flex-shrink-0">
                      <button
                        class="text-green-400 hover:text-green-600 transition-colors"
                        @click="successMessage = ''; changedFields = []"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Message d'erreur -->
                <div
                  v-if="errorMessage"
                  class="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm"
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
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  @click="resetForm"
                  class="flex-1 px-6 py-3 border border-gray-300 rounded-full shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  {{ t('profile.messages.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="isLoading || !isFormValid || !hasChanges"
                  class="flex-1 px-6 py-3 border border-transparent rounded-full shadow-md text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  :class="isLoading || !isFormValid || !hasChanges ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'"
                >
                  <span v-if="isLoading">{{ t('profile.messages.loading') }}</span>
                  <span v-else>{{ t('profile.messages.save') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal Galerie d'Avatars (même style que RegisterView) -->
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { PRESTATAIRE_TYPES } from '@/mocks/prestataireTypes'
import { isPrestataire, isAventurier } from '@/services/roleService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore()

const user = computed(() => authStore.user)

// Données du formulaire
const formData = ref({
  firstname: '',
  lastname: '',
  email: '',
  birthDate: undefined as string | undefined,
  phone: '',
  bio: '',
  avatarUrl: undefined as string | undefined,
  avatarType: 'gallery' as 'gallery' | 'upload',
  prestataireTypeId: undefined as number | undefined,
})

// État du formulaire
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showAvatarModal = ref(false)
const selectedAvatar = ref<string>('') // Pour le suivi de l'avatar sélectionné
const changedFields = ref<string[]>([]) // Pour stocker les champs modifiés

// Erreurs de validation
const fieldErrors = ref({
  firstname: '',
  lastname: '',
  email: '',
  birthDate: '',
  phone: '',
  bio: ''
})

// Avatar
const currentAvatarUrl = computed(() => {
  if (user.value?.avatar_url) {
    return user.value.avatar_url
  }
  return null
})

const isUserPrestataire = computed(() => isPrestataire(user.value))
const isUserAventurier = computed(() => isAventurier(user.value))

const prestataireTypeName = computed(() => {
  if (!user.value?.id_prestataire_type) return 'Non défini'
  const type = PRESTATAIRE_TYPES.find(t => t.id === user.value?.id_prestataire_type)
  return type ? type.name.charAt(0).toUpperCase() + type.name.slice(1) : 'Non défini'
})

// Liste des avatars disponibles
const availableAvatars = Array.from({ length: 42 }, (_, i) => `con${i + 1}.png`)

// Initialiser le formulaire avec les données utilisateur
onMounted(() => {
  if (user.value) {
    // Format date pour input type="date"
    const birthDateFormatted = user.value.birth_date 
      ? new Date(user.value.birth_date).toISOString().split('T')[0]
      : undefined
    
    formData.value = {
      firstname: user.value.firstname || '',
      lastname: user.value.lastname || '',
      email: user.value.email || '',
      birthDate: birthDateFormatted,
      phone: user.value.phone || '',
      bio: user.value.bio || '',
      avatarUrl: user.value.avatar_url || undefined,
      avatarType: (user.value.avatar_type as 'gallery' | 'upload') || 'gallery',
      prestataireTypeId: user.value.id_prestataire_type || undefined,
    }
    
    // Extraire le nom de l'avatar depuis l'URL si c'est de la galerie
    if (user.value.avatar_url && user.value.avatar_url.includes('/images/Avatar-images/')) {
      const avatarName = user.value.avatar_url.split('/images/Avatar-images/')[1]
      if (avatarName) {
        selectedAvatar.value = avatarName
      }
    }
  }
})

// Validation
const validateField = (field: string, value: string) => {
  switch (field) {
    case 'firstname':
      if (!value.trim()) {
        fieldErrors.value.firstname = t('profile.validation.firstnameRequired')
      } else if (value.trim().length < 2) {
        fieldErrors.value.firstname = t('profile.validation.firstnameMinLength')
      } else if (value.trim().length > 255) {
        fieldErrors.value.firstname = t('profile.validation.firstnameMaxLength')
      } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
        fieldErrors.value.firstname = t('profile.validation.firstnameInvalid')
      } else {
        fieldErrors.value.firstname = ''
      }
      break
    case 'lastname':
      if (!value.trim()) {
        fieldErrors.value.lastname = t('profile.validation.lastnameRequired')
      } else if (value.trim().length < 2) {
        fieldErrors.value.lastname = t('profile.validation.lastnameMinLength')
      } else if (value.trim().length > 255) {
        fieldErrors.value.lastname = t('profile.validation.lastnameMaxLength')
      } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
        fieldErrors.value.lastname = t('profile.validation.lastnameInvalid')
      } else {
        fieldErrors.value.lastname = ''
      }
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        fieldErrors.value.email = t('profile.validation.emailRequired')
      } else if (!emailRegex.test(value)) {
        fieldErrors.value.email = t('profile.validation.emailInvalid')
      } else {
        fieldErrors.value.email = ''
      }
      break
    case 'birthDate':
      if (value) {
        const birthDate = new Date(value)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
        
        if (isNaN(birthDate.getTime())) {
          fieldErrors.value.birthDate = t('profile.validation.birthDateInvalid')
        } else if (birthDate > today) {
          fieldErrors.value.birthDate = t('profile.validation.birthDateFuture')
        } else if (actualAge < 15) {
          fieldErrors.value.birthDate = t('profile.validation.birthDateTooYoung')
        } else {
          fieldErrors.value.birthDate = ''
        }
      } else {
        fieldErrors.value.birthDate = ''
      }
      break
    case 'phone':
      if (value && value.trim()) {
        // Format basique de validation téléphone (peut être amélioré)
        const phoneRegex = /^[\d\s\+\-\(\)]+$/
        const digitsOnly = value.replace(/\D/g, '')
        if (!phoneRegex.test(value)) {
          fieldErrors.value.phone = t('profile.validation.phoneInvalid')
        } else if (digitsOnly.length < 8) {
          fieldErrors.value.phone = t('profile.validation.phoneTooShort')
        } else if (digitsOnly.length > 15) {
          fieldErrors.value.phone = t('profile.validation.phoneTooLong')
        } else if (value.trim().length > 20) {
          fieldErrors.value.phone = t('profile.validation.phoneTooLong')
        } else {
          fieldErrors.value.phone = ''
        }
      } else {
        fieldErrors.value.phone = ''
      }
      break
    case 'bio':
      if (value && value.length > 500) {
        fieldErrors.value.bio = t('profile.validation.bioMaxLength')
      } else {
        fieldErrors.value.bio = ''
      }
      break
  }
}

const isFormValid = computed(() => {
  // Vérifier que les champs requis sont remplis
  const requiredFieldsValid = (
    formData.value.firstname.trim() !== '' &&
    formData.value.lastname.trim() !== '' &&
    formData.value.email.trim() !== ''
  )
  
  // Vérifier qu'il n'y a pas d'erreurs de validation
  const noValidationErrors = (
    !fieldErrors.value.firstname &&
    !fieldErrors.value.lastname &&
    !fieldErrors.value.email &&
    !fieldErrors.value.birthDate &&
    !fieldErrors.value.phone &&
    !fieldErrors.value.bio
  )
  
  return requiredFieldsValid && noValidationErrors
})

// Vérifier s'il y a des changements par rapport aux valeurs initiales
const hasChanges = computed(() => {
  if (!user.value) return false
  
  const hasFirstNameChanged = formData.value.firstname !== user.value.firstname
  const hasLastNameChanged = formData.value.lastname !== user.value.lastname
  const hasEmailChanged = formData.value.email !== user.value.email
  const hasAvatarChanged = formData.value.avatarUrl !== (user.value.avatar_url || null)
  const hasBirthDateChanged = formData.value.birthDate !== (user.value.birth_date ? new Date(user.value.birth_date).toISOString().split('T')[0] : null)
  const hasPhoneChanged = formData.value.phone !== (user.value.phone || '')
  const hasBioChanged = formData.value.bio !== (user.value.bio || '')

  
  return hasFirstNameChanged || hasLastNameChanged || hasEmailChanged || hasAvatarChanged ||
    hasBirthDateChanged || hasPhoneChanged || hasBioChanged
})

// Fonction pour obtenir le label d'un champ modifié
const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    firstname: t('profile.fields.firstname'),
    lastname: t('profile.fields.lastname'),
    email: t('profile.fields.email'),
    birthDate: t('profile.fields.birthDate'),
    phone: t('profile.fields.phone'),
    bio: t('profile.fields.bio'),
    avatarUrl: t('profile.fields.avatar'),
  }
  return labels[field] || field
}

// Gestion de l'avatar
const openAvatarModal = () => {
  showAvatarModal.value = true
}

const closeAvatarModal = () => {
  showAvatarModal.value = false
}

const selectAvatar = (avatar: string) => {
  selectedAvatar.value = avatar
  formData.value.avatarUrl = `/images/Avatar-images/${avatar}`
  formData.value.avatarType = 'gallery'
  showAvatarModal.value = false
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      errorMessage.value = t('profile.validation.avatarInvalid')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = t('profile.validation.avatarTooLarge')
      return
    }
    const imageUrl = URL.createObjectURL(file)
    formData.value.avatarUrl = imageUrl
    formData.value.avatarType = 'upload'
    selectedAvatar.value = imageUrl // Pour l'affichage
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  // Réinitialiser avec les valeurs actuelles de l'utilisateur
  if (user.value) {
    const birthDateFormatted = user.value.birth_date 
      ? new Date(user.value.birth_date).toISOString().split('T')[0]
      : undefined
    
    formData.value = {
      firstname: user.value.firstname || '',
      lastname: user.value.lastname || '',
      email: user.value.email || '',
      birthDate: birthDateFormatted,
      phone: user.value.phone || '',
      bio: user.value.bio || '',
      avatarUrl: user.value.avatar_url || undefined,
      avatarType: (user.value.avatar_type as 'gallery' | 'upload') || 'gallery',
      prestataireTypeId: user.value.id_prestataire_type || undefined,
    }
    
    // Réinitialiser l'avatar sélectionné
    if (user.value.avatar_url && user.value.avatar_url.includes('/images/Avatar-images/')) {
      const avatarName = user.value.avatar_url.split('/images/Avatar-images/')[1]
      selectedAvatar.value = avatarName || ''
    } else {
      selectedAvatar.value = ''
    }
    
    // Réinitialiser les messages et erreurs
    errorMessage.value = ''
    successMessage.value = ''
    changedFields.value = []
    
    // Réinitialiser les erreurs de validation
    Object.keys(fieldErrors.value).forEach(key => {
      fieldErrors.value[key as keyof typeof fieldErrors.value] = ''
    })
  }
}

// Soumettre le formulaire
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  changedFields.value = []

  // Valider tous les champs
  validateField('firstname', formData.value.firstname)
  validateField('lastname', formData.value.lastname)
  validateField('email', formData.value.email)
  validateField('phone', formData.value.phone)
  validateField('birthDate', formData.value.birthDate || '')
  validateField('bio', formData.value.bio)

  // Vérifier s'il y a des erreurs de validation
  const hasErrors = Object.values(fieldErrors.value).some(error => error !== '')
  if (hasErrors || !isFormValid.value) {
    errorMessage.value = t('profile.validation.formErrors')
    return
  }

  isLoading.value = true

  try {
    // Préparer les données à envoyer (seulement les champs modifiés)
    const profileData: {
      firstname?: string
      lastname?: string
      email?: string
      avatarUrl?: string | null
      avatarType?: string | null
      birthDate?: string | null
      phone?: string | null
      bio?: string | null
    } = {}

    // Détecter les champs modifiés
    if (formData.value.firstname !== user.value?.firstname) {
      profileData.firstname = formData.value.firstname
      changedFields.value.push('firstname')
    }
    if (formData.value.lastname !== user.value?.lastname) {
      profileData.lastname = formData.value.lastname
      changedFields.value.push('lastname')
    }
    if (formData.value.email !== user.value?.email) {
      profileData.email = formData.value.email
      changedFields.value.push('email')
    }
    if (formData.value.avatarUrl !== (user.value?.avatar_url || null)) {
      profileData.avatarUrl = formData.value.avatarUrl
      profileData.avatarType = formData.value.avatarType
      changedFields.value.push('avatarUrl')
    }
    const userBirthDate = user.value?.birth_date 
      ? new Date(user.value.birth_date).toISOString().split('T')[0]
      : null
    if (formData.value.birthDate !== userBirthDate) {
      profileData.birthDate = formData.value.birthDate
      changedFields.value.push('birthDate')
    }
    if (formData.value.phone !== (user.value?.phone || '')) {
      profileData.phone = formData.value.phone || null
      changedFields.value.push('phone')
    }
    if (formData.value.bio !== (user.value?.bio || '')) {
      profileData.bio = formData.value.bio || null
      changedFields.value.push('bio')
    }

    // Vérifier s'il y a des modifications
    if (changedFields.value.length === 0) {
      errorMessage.value = 'Aucune modification détectée'
      isLoading.value = false
      return
    }

    // Envoyer la mise à jour
    await authStore.updateProfile(profileData)

    successMessage.value = t('profile.messages.success')
    
    // Masquer le message de succès après 5 secondes
    setTimeout(() => {
      successMessage.value = ''
      changedFields.value = []
    }, 5000)
  } catch (error: unknown) {
    errorMessage.value = (error as Error).message || t('profile.messages.error')
    changedFields.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>
