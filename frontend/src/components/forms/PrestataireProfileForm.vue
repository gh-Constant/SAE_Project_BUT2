<!--
  @file PrestataireProfileForm.vue
  @description
  Formulaire de modification du profil prestataire avec tous les champs professionnels.
  Permet de modifier les informations personnelles, professionnelles et de localisation.
  
  @utilité
  - Affiche et permet la modification des informations du profil prestataire
  - Gère la validation côté client avec floating labels
  - Gère les états de chargement, succès et erreur
  - Affiche la galerie d'avatars
-->
<template>
  <div class="py-12 bg-parchment">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Title -->
      <div class="mb-8 text-left">
        <h1 class="text-3xl font-medieval font-bold text-iron-black mb-2">
          {{ t('prestataire.profile.title') }}
        </h1>
        <p class="text-stone-grey text-lg mb-4">
          Modifiez vos informations personnelles et professionnelles
        </p>
        <!-- Decorative line -->
        <div class="w-24 h-1 bg-antique-bronze rounded-full" />
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="bg-white/40 backdrop-blur-sm rounded-sm shadow-lg p-8">
          <!-- AVATAR - Centré en haut -->
          <div class="mb-12 flex flex-col items-center">
            <h3 class="text-lg font-semibold text-iron-black mb-6">{{ t('prestataire.profile.fields.avatar') }}</h3>

            <!-- Avatar Preview - Grand et centré -->
            <div class="mb-6">
              <div v-if="currentAvatarUrl || selectedAvatar"
                class="w-32 h-32 rounded-full overflow-hidden border-4 border-antique-bronze shadow-xl mx-auto">
                <img
                  :src="(selectedAvatar && selectedAvatar.startsWith('blob:')) ? selectedAvatar : (selectedAvatar ? `/images/Avatar-images/${selectedAvatar}` : currentAvatarUrl || '')"
                  :alt="(selectedAvatar || 'Avatar')" class="w-full h-full object-cover">
              </div>
              <div v-else
                class="w-32 h-32 rounded-full bg-stone-grey/20 border-4 border-dashed border-antique-bronze/30 flex items-center justify-center mx-auto">
                <i class="fas fa-user text-gray-400 text-5xl" />
              </div>
            </div>

            <!-- Avatar Selection Buttons - Centrés -->
            <div class="flex space-x-3">
              <button type="button"
                class="px-6 py-3 bg-antique-bronze text-white rounded-sm hover:brightness-110 transition-colors text-sm font-medium shadow-md flex items-center"
                @click="openAvatarModal">
                <i class="fas fa-images mr-2" />
                {{ t('prestataire.profile.fields.avatarTypeGallery') }}
              </button>
              <label
                class="px-6 py-3 bg-stone-grey text-white rounded-sm hover:bg-iron-black transition-colors text-sm font-medium cursor-pointer shadow-md flex items-center">
                <i class="fas fa-upload mr-2" />
                {{ t('prestataire.profile.fields.avatarTypeUpload') }}
                <input type="file" accept="image/*" class="hidden" @change="handleFileUpload">
              </label>
            </div>

            <!-- Type de Prestataire - Sous l'avatar -->
            <div v-if="isUserPrestataire" class="mt-6 text-center">
              <div class="inline-flex items-center px-4 py-2 rounded-sm bg-blue-100 text-blue-800">
                <i class="fas fa-briefcase mr-2" />
                <span class="font-semibold">{{ prestataireTypeName }}</span>
                <span class="ml-2 text-xs text-blue-600">({{ t('prestataire.profile.fields.prestataireTypeReadonly')
                }})</span>
              </div>
            </div>
          </div>

          <!-- SECTION 1: Identité -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-iron-black mb-6 border-b-2 border-antique-bronze pb-2">
              {{ t('prestataire.profile.sections.identity') }}
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Prénom -->
              <div class="relative">
                <input id="firstname" v-model="formData.firstname" type="text" maxlength="255"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-antique-bronze/50 transition-all duration-200 peer"
                  :class="fieldErrors.firstname ? 'border-red-500 focus:border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
                  placeholder=" " required @blur="validateField('firstname', formData.firstname)"
                  @input="validateField('firstname', formData.firstname)">
                <label for="firstname"
                  class="absolute left-4 text-stone-grey transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.firstname ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.firstname ? '#ef4444' : formData.firstname ? '#8B4513' : '#6b7280' }">
                  {{ (fieldErrors.firstname && formData.firstname) ? fieldErrors.firstname :
                    t('prestataire.profile.fields.firstname') }}
                </label>
                <p v-if="fieldErrors.firstname && formData.firstname" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.firstname }}
                </p>
              </div>

              <!-- Nom -->
              <div class="relative">
                <input id="lastname" v-model="formData.lastname" type="text" maxlength="255"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-antique-bronze/50 transition-all duration-200 peer"
                  :class="fieldErrors.lastname ? 'border-red-500 focus:border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
                  placeholder=" " required @blur="validateField('lastname', formData.lastname)"
                  @input="validateField('lastname', formData.lastname)">
                <label for="lastname"
                  class="absolute left-4 text-stone-grey transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.lastname ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.lastname ? '#ef4444' : formData.lastname ? '#8B4513' : '#6b7280' }">
                  {{ (fieldErrors.lastname && formData.lastname) ? fieldErrors.lastname :
                    t('prestataire.profile.fields.lastname') }}
                </label>
                <p v-if="fieldErrors.lastname && formData.lastname" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.lastname }}
                </p>
              </div>

              <!-- Email -->
              <div class="relative">
                <input id="email" v-model="formData.email" type="email" maxlength="255"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-antique-bronze/50 transition-all duration-200 peer"
                  :class="fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
                  placeholder=" " required @blur="validateField('email', formData.email)"
                  @input="validateField('email', formData.email)">
                <label for="email"
                  class="absolute left-4 text-stone-grey transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.email ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.email ? '#ef4444' : formData.email ? '#8B4513' : '#6b7280' }">
                  {{ (fieldErrors.email && formData.email) ? fieldErrors.email : t('prestataire.profile.fields.email')
                  }}
                </label>
                <p v-if="fieldErrors.email && formData.email" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.email }}
                </p>
              </div>

              <!-- Téléphone -->
              <div class="relative">
                <input id="phone" v-model="formData.phone" type="tel" maxlength="20"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-antique-bronze/50 transition-all duration-200 peer"
                  :class="fieldErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
                  placeholder=" " @blur="validateField('phone', formData.phone)"
                  @input="validateField('phone', formData.phone)">
                <label for="phone"
                  class="absolute left-4 text-stone-grey transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.phone ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.phone ? '#ef4444' : formData.phone ? '#8B4513' : '#6b7280' }">
                  {{ (fieldErrors.phone && formData.phone) ? fieldErrors.phone : t('prestataire.profile.fields.phone')
                  }}
                </label>
                <p v-if="fieldErrors.phone && formData.phone" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.phone }}
                </p>
              </div>

              <!-- Date de naissance -->
              <div class="relative">
                <input id="birthDate" v-model="formData.birthDate" type="date"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-antique-bronze/50 transition-all duration-200 peer"
                  :class="fieldErrors.birthDate ? 'border-red-500 focus:border-red-500' : 'border-antique-bronze/30 focus:border-antique-bronze'"
                  :max="new Date(new Date().setFullYear(new Date().getFullYear() - 15)).toISOString().split('T')[0]"
                  @blur="validateField('birthDate', formData.birthDate || '')">
                <label for="birthDate" class="absolute left-4 top-1 text-xs bg-white px-2 text-stone-grey"
                  :style="{ color: fieldErrors.birthDate ? '#ef4444' : formData.birthDate ? '#8B4513' : '#6b7280' }">
                  {{ (fieldErrors.birthDate && formData.birthDate) ? fieldErrors.birthDate :
                    t('prestataire.profile.fields.birthDate') }}
                </label>
                <p v-if="fieldErrors.birthDate && formData.birthDate" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.birthDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- SECTION 2: Présentation -->
          <div class="mb-8 pb-8 border-b border-antique-bronze/20">
            <h3 class="text-xl font-bold text-iron-black mb-6 border-b-2 border-antique-bronze pb-2">
              {{ t('prestataire.profile.sections.presentation') }}
            </h3>
            <div class="space-y-6">
              <!-- Bio -->
              <div>
                <label class="block text-sm font-medium text-stone-grey mb-2">
                  {{ t('prestataire.profile.fields.bio') }}
                </label>
                <Editor ref="bioEditorRef" :initialContent="formData.bio || '<p></p>'" />
                <p v-if="fieldErrors.bio" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.bio }}
                </p>
                <div class="mt-2 flex justify-between items-center">
                  <p class="text-xs text-stone-grey ml-4">{{ t('prestataire.profile.fields.bioHint') }}</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col justify-end space-y-4 pt-6 border-t border-antique-bronze/20">
            <!-- Messages flash -->
            <div class="space-y-3">
              <div v-if="successMessage" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-sm">
                <div class="flex items-start">
                  <div class="flex-1">
                    <ul v-if="changedFields.length > 0" class="space-y-1">
                      <li v-for="field in changedFields" :key="field" class="text-sm font-medium text-green-800">
                        {{ getFieldLabel(field) }} {{ t('prestataire.profile.messages.updatedSuccess') }}
                      </li>
                    </ul>
                    <p v-else class="text-sm font-medium text-green-800">
                      {{ t('prestataire.profile.messages.success') }}
                    </p>
                  </div>
                  <div class="ml-3 flex-shrink-0">
                    <button class="text-green-400 hover:text-green-600 transition-colors"
                      @click="successMessage = ''; changedFields = []">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="errorMessage" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm">
                <div class="flex items-start">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-red-800">
                      {{ errorMessage }}
                    </p>
                  </div>
                  <div class="ml-3 flex-shrink-0">
                    <button class="text-red-400 hover:text-red-600 transition-colors" @click="errorMessage = ''">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button type="button" @click="resetForm"
                class="flex-1 px-6 py-3 border border-antique-bronze/30 rounded-sm shadow-sm text-base font-semibold text-stone-grey bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200">
                {{ t('prestataire.profile.messages.cancel') }}
              </button>
              <button type="submit" :disabled="isLoading || !isFormValid || !hasChanges"
                class="flex-1 px-6 py-3 border border-transparent rounded-sm shadow-md text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-antique-bronze"
                :class="isLoading || !isFormValid || !hasChanges ? 'bg-antique-bronze/30 cursor-not-allowed' : 'bg-antique-bronze hover:brightness-110'">
                <span v-if="isLoading">{{ t('prestataire.profile.messages.loading') }}</span>
                <span v-else>{{ t('prestataire.profile.messages.save') }}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal Galerie d'Avatars -->
    <div v-if="showAvatarModal" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      @click="closeAvatarModal">
      <div class="bg-white/40 backdrop-blur-sm rounded-sm shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
        @click.stop>
        <div class="flex items-center justify-between p-6 border-b border-antique-bronze/20">
          <h3 class="text-xl font-semibold text-iron-black">
            {{ t('prestataire.profile.fields.chooseAvatar') }}
          </h3>
          <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="closeAvatarModal">
            <i class="fas fa-times text-xl" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
            <div v-for="avatar in availableAvatars" :key="avatar"
              class="w-16 h-16 rounded-sm overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
              :class="selectedAvatar === avatar ? 'border-antique-bronze ring-2 ring-antique-bronze/20' : 'border-antique-bronze/20 hover:border-antique-bronze/40'"
              @click="selectAvatar(avatar)">
              <img :src="`/images/Avatar-images/${avatar}`" :alt="avatar" class="w-full h-full object-cover">
            </div>
          </div>
        </div>

        <div class="flex justify-end p-6 border-t border-antique-bronze/20">
          <button class="px-6 py-2 bg-stone-grey text-white rounded-lg hover:bg-iron-black transition-colors"
            @click="closeAvatarModal">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { PRESTATAIRE_TYPES } from '@/mocks/prestataireTypes'
import { isPrestataire } from '@/services/roleService'
import { useI18n } from 'vue-i18n'
import Editor from '@/components/editor/Editor.vue'

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
})

// État du formulaire
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showAvatarModal = ref(false)
const selectedAvatar = ref<string>('')
const changedFields = ref<string[]>([])
const bioEditorRef = ref<InstanceType<typeof Editor> | null>(null)

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
    }

    if (user.value.avatar_url && user.value.avatar_url.includes('/images/Avatar-images/')) {
      const avatarName = user.value.avatar_url.split('/images/Avatar-images/')[1]
      if (avatarName) {
        selectedAvatar.value = avatarName
      }
    }

    // Initialiser l'éditeur bio avec le contenu après le montage
    nextTick(() => {
      if (bioEditorRef.value && user.value?.bio) {
        bioEditorRef.value.setHTML(user.value.bio)
      }
    })
  }
})

// Pas de watch automatique - l'éditeur ne sera mis à jour que lors du resetForm ou de l'initialisation

// Validation
const validateField = (field: string, value: string) => {
  switch (field) {
    case 'firstname':
      if (!value.trim()) {
        fieldErrors.value.firstname = t('prestataire.profile.validation.firstnameRequired')
      } else if (value.trim().length < 2) {
        fieldErrors.value.firstname = t('prestataire.profile.validation.firstnameMinLength')
      } else if (value.trim().length > 255) {
        fieldErrors.value.firstname = t('prestataire.profile.validation.firstnameMaxLength')
      } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
        fieldErrors.value.firstname = t('prestataire.profile.validation.firstnameInvalid')
      } else {
        fieldErrors.value.firstname = ''
      }
      break
    case 'lastname':
      if (!value.trim()) {
        fieldErrors.value.lastname = t('prestataire.profile.validation.lastnameRequired')
      } else if (value.trim().length < 2) {
        fieldErrors.value.lastname = t('prestataire.profile.validation.lastnameMinLength')
      } else if (value.trim().length > 255) {
        fieldErrors.value.lastname = t('prestataire.profile.validation.lastnameMaxLength')
      } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
        fieldErrors.value.lastname = t('prestataire.profile.validation.lastnameInvalid')
      } else {
        fieldErrors.value.lastname = ''
      }
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        fieldErrors.value.email = t('prestataire.profile.validation.emailRequired')
      } else if (!emailRegex.test(value)) {
        fieldErrors.value.email = t('prestataire.profile.validation.emailInvalid')
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
          fieldErrors.value.birthDate = t('prestataire.profile.validation.birthDateInvalid')
        } else if (birthDate > today) {
          fieldErrors.value.birthDate = t('prestataire.profile.validation.birthDateFuture')
        } else if (actualAge < 15) {
          fieldErrors.value.birthDate = t('prestataire.profile.validation.birthDateTooYoung')
        } else {
          fieldErrors.value.birthDate = ''
        }
      } else {
        fieldErrors.value.birthDate = ''
      }
      break
    case 'phone':
      if (value && value.trim()) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/
        const digitsOnly = value.replace(/\D/g, '')
        if (!phoneRegex.test(value)) {
          fieldErrors.value.phone = t('prestataire.profile.validation.phoneInvalid')
        } else if (digitsOnly.length < 8) {
          fieldErrors.value.phone = t('prestataire.profile.validation.phoneTooShort')
        } else if (digitsOnly.length > 15 || value.trim().length > 20) {
          fieldErrors.value.phone = t('prestataire.profile.validation.phoneTooLong')
        } else {
          fieldErrors.value.phone = ''
        }
      } else {
        fieldErrors.value.phone = ''
      }
      break
    case 'bio':
      // Pour l'éditeur, on utilise la valeur passée (HTML) et on vérifie la longueur du texte brut
      if (value) {
        // Extraire le texte brut du HTML pour vérifier la longueur
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = value
        const textContent = tempDiv.textContent || tempDiv.innerText || ''
        if (textContent.length > 500) {
          fieldErrors.value.bio = t('prestataire.profile.validation.bioMaxLength')
        } else {
          fieldErrors.value.bio = ''
        }
      } else {
        fieldErrors.value.bio = ''
      }
      break
  }
}

const isFormValid = computed(() => {
  const requiredFieldsValid = (
    formData.value.firstname.trim() !== '' &&
    formData.value.lastname.trim() !== '' &&
    formData.value.email.trim() !== ''
  )

  const noValidationErrors = Object.values(fieldErrors.value).every(error => error === '')

  return requiredFieldsValid && noValidationErrors
})

const hasChanges = computed(() => {
  if (!user.value) return false

  // Récupérer le HTML de l'éditeur bio pour la comparaison
  const currentBioHTML = bioEditorRef.value?.getHTML() || ''

  return (
    formData.value.firstname !== user.value.firstname ||
    formData.value.lastname !== user.value.lastname ||
    formData.value.email !== user.value.email ||
    formData.value.avatarUrl !== (user.value.avatar_url || null) ||
    formData.value.birthDate !== (user.value.birth_date ? new Date(user.value.birth_date).toISOString().split('T')[0] : null) ||
    formData.value.phone !== (user.value.phone || '') ||
    currentBioHTML !== (user.value.bio || '')
  )
})

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    firstname: t('prestataire.profile.fields.firstname'),
    lastname: t('prestataire.profile.fields.lastname'),
    email: t('prestataire.profile.fields.email'),
    birthDate: t('prestataire.profile.fields.birthDate'),
    phone: t('prestataire.profile.fields.phone'),
    bio: t('prestataire.profile.fields.bio'),
    avatarUrl: t('prestataire.profile.fields.avatar'),
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
      errorMessage.value = t('prestataire.profile.validation.avatarInvalid')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = t('prestataire.profile.validation.avatarTooLarge')
      return
    }
    const imageUrl = URL.createObjectURL(file)
    formData.value.avatarUrl = imageUrl
    formData.value.avatarType = 'upload'
    selectedAvatar.value = imageUrl
  }
}

const resetForm = () => {
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
    }


    if (user.value.avatar_url && user.value.avatar_url.includes('/images/Avatar-images/')) {
      const avatarName = user.value.avatar_url.split('/images/Avatar-images/')[1]
      selectedAvatar.value = avatarName || ''
    } else {
      selectedAvatar.value = ''
    }

    errorMessage.value = ''
    successMessage.value = ''
    changedFields.value = []

    Object.keys(fieldErrors.value).forEach(key => {
      fieldErrors.value[key as keyof typeof fieldErrors.value] = ''
    })

    // Mettre à jour l'éditeur bio avec le nouveau contenu
    if (bioEditorRef.value) {
      bioEditorRef.value.setHTML(user.value.bio || '<p></p>')
    }
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  changedFields.value = []

  // Récupérer le HTML de l'éditeur bio
  const bioHTML = bioEditorRef.value?.getHTML() || ''
  formData.value.bio = bioHTML

  // Valider tous les champs
  validateField('firstname', formData.value.firstname)
  validateField('lastname', formData.value.lastname)
  validateField('email', formData.value.email)
  validateField('phone', formData.value.phone)
  validateField('birthDate', formData.value.birthDate || '')
  validateField('bio', bioHTML)

  const hasErrors = Object.values(fieldErrors.value).some(error => error !== '')
  if (hasErrors || !isFormValid.value) {
    errorMessage.value = t('prestataire.profile.validation.formErrors')
    return
  }

  isLoading.value = true

  try {
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
    // Récupérer le HTML de l'éditeur bio pour la comparaison
    const currentBioHTML = bioEditorRef.value?.getHTML() || ''

    if (currentBioHTML !== (user.value?.bio || '')) {
      profileData.bio = currentBioHTML || null
      changedFields.value.push('bio')
    }

    if (changedFields.value.length === 0) {
      errorMessage.value = 'Aucune modification détectée'
      isLoading.value = false
      return
    }

    await authStore.updateProfile(profileData)

    successMessage.value = t('prestataire.profile.messages.success')

    setTimeout(() => {
      successMessage.value = ''
      changedFields.value = []
    }, 5000)
  } catch (error: any) {
    errorMessage.value = error.message || t('prestataire.profile.messages.error')
    changedFields.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>
