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
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Title -->
      <div class="mb-8 text-left">
        <h1 class="text-3xl font-bold text-black mb-2">
          {{ t('prestataire.profile.title') }}
        </h1>
        <p class="text-black text-lg mb-4">
          Modifiez vos informations personnelles et professionnelles
        </p>
        <!-- Orange line -->
        <div class="w-24 h-1 bg-orange-500" />
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- AVATAR - Centré en haut -->
          <div class="mb-12 flex flex-col items-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ t('prestataire.profile.fields.avatar') }}</h3>
            
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
                {{ t('prestataire.profile.fields.avatarTypeGallery') }}
              </button>
              <label class="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors text-sm font-medium cursor-pointer shadow-md flex items-center">
                <i class="fas fa-upload mr-2" />
                {{ t('prestataire.profile.fields.avatarTypeUpload') }}
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                >
              </label>
            </div>
            
            <!-- Type de Prestataire - Sous l'avatar -->
            <div v-if="isUserPrestataire" class="mt-6 text-center">
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                <i class="fas fa-briefcase mr-2" />
                <span class="font-semibold">{{ prestataireTypeName }}</span>
                <span class="ml-2 text-xs text-blue-600">({{ t('prestataire.profile.fields.prestataireTypeReadonly') }})</span>
              </div>
            </div>
          </div>

          <!-- SECTION 1: Identité -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
              {{ t('prestataire.profile.sections.identity') }}
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
                  {{ (fieldErrors.firstname && formData.firstname) ? fieldErrors.firstname : t('prestataire.profile.fields.firstname') }}
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
                  {{ (fieldErrors.lastname && formData.lastname) ? fieldErrors.lastname : t('prestataire.profile.fields.lastname') }}
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
                  {{ (fieldErrors.email && formData.email) ? fieldErrors.email : t('prestataire.profile.fields.email') }}
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
                  {{ (fieldErrors.phone && formData.phone) ? fieldErrors.phone : t('prestataire.profile.fields.phone') }}
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
                  {{ (fieldErrors.birthDate && formData.birthDate) ? fieldErrors.birthDate : t('prestataire.profile.fields.birthDate') }}
                </label>
                <p v-if="fieldErrors.birthDate && formData.birthDate" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.birthDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- SECTION 2: Contact -->
          <div class="mb-8 pb-8 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
              {{ t('prestataire.profile.sections.contact') }}
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Site web -->
              <div class="relative">
                <input
                  id="website"
                  v-model="formData.website"
                  type="url"
                  maxlength="255"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                  :class="fieldErrors.website ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                  placeholder=" "
                  @blur="validateField('website', formData.website)"
                  @input="validateField('website', formData.website)"
                >
                <label 
                  for="website" 
                  class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.website ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.website ? '#ef4444' : formData.website ? '#f97316' : '#6b7280' }"
                >
                  {{ (fieldErrors.website && formData.website) ? fieldErrors.website : t('prestataire.profile.fields.website') }}
                </label>
                <p v-if="fieldErrors.website && formData.website" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.website }}
                </p>
              </div>

              <!-- Réseaux sociaux -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  {{ t('prestataire.profile.fields.socialMedia') }}
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      for="facebook"
                      class="block text-xs font-medium text-gray-600 mb-1"
                    >
                      <i class="fab fa-facebook mr-1"></i> {{ t('prestataire.profile.fields.facebook') }}
                    </label>
                    <input
                      id="facebook"
                      v-model="formData.socialMedia.facebook"
                      type="url"
                      class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-500 transition-all"
                      :class="fieldErrors.socialMedia?.facebook ? 'border-red-500' : 'border-gray-300'"
                      placeholder="https://facebook.com/votre-page"
                    >
                  </div>
                  <div>
                    <label
                      for="instagram"
                      class="block text-xs font-medium text-gray-600 mb-1"
                    >
                      <i class="fab fa-instagram mr-1"></i> {{ t('prestataire.profile.fields.instagram') }}
                    </label>
                    <input
                      id="instagram"
                      v-model="formData.socialMedia.instagram"
                      type="url"
                      class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-500 transition-all"
                      :class="fieldErrors.socialMedia?.instagram ? 'border-red-500' : 'border-gray-300'"
                      placeholder="https://instagram.com/votre-compte"
                    >
                  </div>
                  <div>
                    <label
                      for="twitter"
                      class="block text-xs font-medium text-gray-600 mb-1"
                    >
                      <i class="fab fa-twitter mr-1"></i> {{ t('prestataire.profile.fields.twitter') }}
                    </label>
                    <input
                      id="twitter"
                      v-model="formData.socialMedia.twitter"
                      type="url"
                      class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-500 transition-all"
                      :class="fieldErrors.socialMedia?.twitter ? 'border-red-500' : 'border-gray-300'"
                      placeholder="https://twitter.com/votre-compte"
                    >
                  </div>
                  <div>
                    <label
                      for="linkedin"
                      class="block text-xs font-medium text-gray-600 mb-1"
                    >
                      <i class="fab fa-linkedin mr-1"></i> {{ t('prestataire.profile.fields.linkedin') }}
                    </label>
                    <input
                      id="linkedin"
                      v-model="formData.socialMedia.linkedin"
                      type="url"
                      class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-500 transition-all"
                      :class="fieldErrors.socialMedia?.linkedin ? 'border-red-500' : 'border-gray-300'"
                      placeholder="https://linkedin.com/in/votre-profil"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 3: Localisation -->
          <div class="mb-8 pb-8 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
              {{ t('prestataire.profile.sections.location') }}
            </h3>
            
            <!-- Message si aucune location achetée -->
            <div v-if="purchasedLocations.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <div class="flex items-start">
                <i class="fas fa-exclamation-triangle text-yellow-600 text-2xl mr-4 mt-1"></i>
                <div>
                  <h4 class="text-lg font-semibold text-yellow-800 mb-2">Aucune location achetée</h4>
                  <p class="text-yellow-700 mb-4">
                    Vous devez d'abord acheter une location sur la carte principale pour gérer vos boutiques.
                  </p>
                  <router-link
                    to="/"
                    class="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <i class="fas fa-map mr-2"></i>
                    Voir la carte
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Carte interactive avec toutes les locations achetées -->
            <div v-else>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                <i class="fas fa-map-marker-alt mr-2 text-orange-500"></i>
                Mes emplacements ({{ purchasedLocations.length }})
              </label>
              <div
                :id="'profile-map-' + mapId"
                class="h-96 w-full border rounded-xl shadow-md bg-gray-200 mb-4"
              ></div>
              
              <!-- Liste des locations achetées -->
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm font-medium text-gray-700 mb-3">
                  <i class="fas fa-store mr-2"></i>
                  Toutes mes boutiques
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="location in purchasedLocations"
                    :key="location.id"
                    class="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all"
                  >
                    <div class="flex items-center flex-1">
                      <i class="fas fa-map-marker-alt mr-3 text-lg text-orange-500"></i>
                      <div class="flex-1">
                        <p class="font-semibold text-gray-900">{{ location.name }}</p>
                        <p class="text-sm text-gray-500">{{ location.static_code }}</p>
                        <p v-if="location.description" class="text-xs text-gray-400 mt-1 line-clamp-1">
                          {{ location.description }}
                        </p>
                      </div>
                    </div>
                    <div class="ml-4">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i class="fas fa-check-circle mr-1"></i>
                        Possédée
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 4: Présentation -->
          <div class="mb-8 pb-8 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
              {{ t('prestataire.profile.sections.presentation') }}
            </h3>
            <div class="space-y-6">
              <!-- Bio -->
              <div class="relative">
                <textarea
                  id="bio"
                  v-model="formData.bio"
                  rows="5"
                  maxlength="500"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer resize-none"
                  :class="fieldErrors.bio ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                  :placeholder="t('prestataire.profile.fields.bioPlaceholder')"
                  @blur="validateField('bio', formData.bio)"
                />
                <label 
                  for="bio" 
                  class="absolute left-4 top-1 text-xs bg-white px-2 text-gray-500"
                  :style="{ color: fieldErrors.bio ? '#ef4444' : '#6b7280' }"
                >
                  {{ t('prestataire.profile.fields.bio') }}
                </label>
                <p v-if="fieldErrors.bio && formData.bio" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.bio }}
                </p>
                <div class="mt-2 flex justify-between items-center">
                  <p class="text-xs text-gray-500 ml-4">{{ t('prestataire.profile.fields.bioHint') }}</p>
                  <span class="text-xs" :class="formData.bio.length > 450 ? 'text-red-500' : 'text-gray-500'">
                    {{ formData.bio.length }}/500
                  </span>
                </div>
              </div>

              <!-- Spécialités -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('prestataire.profile.fields.specialties') }}
                </label>
                <textarea
                  v-model="formData.specialties"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-500"
                  :placeholder="t('prestataire.profile.fields.specialtiesPlaceholder')"
                />
              </div>

              <!-- Langues parlées -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('prestataire.profile.fields.languages') }}
                </label>
                <div class="flex flex-wrap gap-3">
                  <label v-for="lang in availableLanguages" :key="lang.value" class="flex items-center">
                    <input
                      v-model="formData.languages"
                      type="checkbox"
                      :value="lang.value"
                      class="mr-2 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    >
                    <span class="text-sm text-gray-700">{{ lang.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 5: Professionnel -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
              {{ t('prestataire.profile.sections.professional') }}
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Années d'expérience -->
              <div class="relative">
                <input
                  id="experienceYears"
                  v-model.number="formData.experienceYears"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all duration-200 peer"
                  :class="fieldErrors.experienceYears ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'"
                  placeholder=" "
                  @blur="validateField('experienceYears', formData.experienceYears?.toString() || '')"
                  @input="validateField('experienceYears', formData.experienceYears?.toString() || '')"
                >
                <label 
                  for="experienceYears" 
                  class="absolute left-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:bg-transparent peer-focus:px-2 pb-1"
                  :class="formData.experienceYears !== undefined && formData.experienceYears !== null ? 'top-1 text-xs bg-transparent px-2 pb-1' : 'top-3 text-base'"
                  :style="{ color: fieldErrors.experienceYears ? '#ef4444' : formData.experienceYears !== undefined && formData.experienceYears !== null ? '#f97316' : '#6b7280' }"
                >
                  {{ t('prestataire.profile.fields.experienceYears') }}
                </label>
                <p v-if="fieldErrors.experienceYears" class="mt-1 text-xs text-red-500 px-4">
                  {{ fieldErrors.experienceYears }}
                </p>
              </div>
            </div>
          </div>

          <!-- Informations de statut et Actions -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
            <!-- Informations de statut -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('prestataire.profile.status.title') }}</h3>
              <dl class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <dt class="text-sm font-medium text-gray-500">{{ t('prestataire.profile.status.xp') }}</dt>
                  <dd class="mt-1 text-2xl font-bold text-orange-600">{{ user?.xp || 0 }}</dd>
                </div>
                <div class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <dt class="text-sm font-medium text-gray-500">{{ t('prestataire.profile.status.level') }}</dt>
                  <dd class="mt-1 text-2xl font-bold text-orange-600">{{ user?.level || 0 }}</dd>
                </div>
              </dl>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col justify-end space-y-4">
              <!-- Messages flash -->
              <div class="space-y-3">
                <div
                  v-if="successMessage"
                  class="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-sm"
                >
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
                  {{ t('prestataire.profile.messages.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="isLoading || !isFormValid || !hasChanges"
                  class="flex-1 px-6 py-3 border border-transparent rounded-full shadow-md text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  :class="isLoading || !isFormValid || !hasChanges ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'"
                >
                  <span v-if="isLoading">{{ t('prestataire.profile.messages.loading') }}</span>
                  <span v-else>{{ t('prestataire.profile.messages.save') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal Galerie d'Avatars -->
    <div
      v-if="showAvatarModal"
      class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      @click="closeAvatarModal"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ t('prestataire.profile.fields.chooseAvatar') }}
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors"
            @click="closeAvatarModal"
          >
            <i class="fas fa-times text-xl" />
          </button>
        </div>
        
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { PRESTATAIRE_TYPES } from '@/mocks/prestataireTypes'
import { isPrestataire } from '@/services/roleService'
import { useI18n } from 'vue-i18n'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { locationService } from '@/services/locationService'
import { LocationMock } from '@/mocks/locations'
import { LocationType } from '@/mocks/locationTypes'
import { iconMarkers, defaultIcon } from '@/utils/map/iconsMarkers'

const router = useRouter()

const { t } = useI18n()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// ID unique pour la carte (évite les conflits avec d'autres cartes)
const mapId = ref(Math.random().toString(36).substring(7))
let profileMap: L.Map | null = null
let locationMarkers: L.Marker[] = []

// Locations achetées par le prestataire
const purchasedLocations = ref<LocationMock[]>([])

// Données du formulaire
const formData = ref({
  firstname: '',
  lastname: '',
  email: '',
  birthDate: undefined as string | undefined,
  phone: '',
  bio: '',
  website: '',
  experienceYears: undefined as number | undefined,
  specialties: '',
  languages: [] as string[],
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    tiktok: ''
  },
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

// Erreurs de validation
const fieldErrors = ref({
  firstname: '',
  lastname: '',
  email: '',
  birthDate: '',
  phone: '',
  bio: '',
  website: '',
  experienceYears: ''
})

// Langues disponibles
const availableLanguages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'es', label: 'Espagnol' },
  { value: 'de', label: 'Allemand' },
  { value: 'it', label: 'Italien' },
  { value: 'pt', label: 'Portugais' }
]

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

// Configuration des icônes Leaflet
function setupLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: '/images/marker.png',
  })
}

// Charger les locations achetées par le prestataire
async function loadPurchasedLocations() {
  if (!user.value) return
  
  const allLocations = await locationService.getAllLocations()
  purchasedLocations.value = allLocations.filter(location => 
    location.id_location_type === LocationType.PRESTATAIRE_LOCATION_TYPE_ID &&
    location.purchased === true &&
    location.id_prestataire === user.value!.id
  )
}

// Pas de sélection unique - on affiche juste toutes les locations

// Initialiser la carte avec les locations achetées
async function initializeProfileMap() {
  await loadPurchasedLocations()
  
  if (purchasedLocations.value.length === 0) return

  nextTick(() => {
    const mapElement = document.getElementById(`profile-map-${mapId.value}`)
    if (!mapElement) return

    // Configuration des icônes
    setupLeafletIcons()

    // Créer la carte
    profileMap = L.map(`profile-map-${mapId.value}`, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 4,
      zoomDelta: 0.5,
      wheelDebounceTime: 100,
      wheelPxPerZoomLevel: 120
    }).setView([250, 250], 0)

    // Ajouter l'image de la carte
    const imageUrl = './maps/75shrinkcompressed.png'
    const imageWidth = 6500
    const imageHeight = 3300
    const imageBounds: L.LatLngBoundsExpression = [[0, 0], [imageHeight, imageWidth]]
    L.imageOverlay(imageUrl, imageBounds).addTo(profileMap)
    profileMap.fitBounds(imageBounds)

    // Ajouter les marqueurs pour chaque location achetée
    purchasedLocations.value.forEach((location) => {
      const [lat, lng] = location.position
      const latlng = L.latLng(lat, lng)
      
      // Utiliser l'icône appropriée
      const iconName = location.icon_name || 'prestataire'
      const icon = iconMarkers[iconName] || defaultIcon

      const marker = L.marker(latlng, { icon })
        .addTo(profileMap!)
        .bindPopup(`
          <strong>${location.name}</strong><br/>
          ${location.description || ''}<br/>
          <span class="text-xs text-gray-500">${location.static_code}</span>
        `)

      locationMarkers.push(marker)
    })

    // Ajuster la vue pour voir toutes les locations
    if (locationMarkers.length > 0) {
      const bounds = L.latLngBounds(
        locationMarkers.map(m => m.getLatLng())
      )
      profileMap.fitBounds(bounds, { padding: [50, 50] })
    }
  })
}

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
      website: '',
      experienceYears: undefined,
      specialties: '',
      languages: [],
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        tiktok: ''
      },
      avatarUrl: user.value.avatar_url || undefined,
      avatarType: (user.value.avatar_type as 'gallery' | 'upload') || 'gallery',
    }
    
    if (user.value.avatar_url && user.value.avatar_url.includes('/images/Avatar-images/')) {
      const avatarName = user.value.avatar_url.split('/images/Avatar-images/')[1]
      if (avatarName) {
        selectedAvatar.value = avatarName
      }
    }

    // Initialiser la carte après un court délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      initializeProfileMap()
    }, 300)
  }
})

// Nettoyer la carte lors du démontage
onUnmounted(() => {
  if (profileMap) {
    locationMarkers.forEach(marker => profileMap!.removeLayer(marker))
    profileMap.remove()
    profileMap = null
  }
  locationMarkers = []
})

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
      if (value && value.length > 500) {
        fieldErrors.value.bio = t('prestataire.profile.validation.bioMaxLength')
      } else {
        fieldErrors.value.bio = ''
      }
      break
    case 'website':
      if (value && value.trim()) {
        const urlRegex = /^https?:\/\/.+/
        if (!urlRegex.test(value)) {
          fieldErrors.value.website = t('prestataire.profile.validation.websiteInvalid')
        } else {
          fieldErrors.value.website = ''
        }
      } else {
        fieldErrors.value.website = ''
      }
      break
    case 'experienceYears':
      if (value) {
        const years = parseInt(value, 10)
        if (isNaN(years) || years < 0 || years > 100) {
          fieldErrors.value.experienceYears = t('prestataire.profile.validation.experienceYearsInvalid')
        } else {
          fieldErrors.value.experienceYears = ''
        }
      } else {
        fieldErrors.value.experienceYears = ''
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
  
  return (
    formData.value.firstname !== user.value.firstname ||
    formData.value.lastname !== user.value.lastname ||
    formData.value.email !== user.value.email ||
    formData.value.avatarUrl !== (user.value.avatar_url || null) ||
    formData.value.birthDate !== (user.value.birth_date ? new Date(user.value.birth_date).toISOString().split('T')[0] : null) ||
    formData.value.phone !== (user.value.phone || '') ||
    formData.value.bio !== (user.value.bio || '')
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
      website: '',
      experienceYears: undefined,
      specialties: '',
      languages: [],
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        tiktok: ''
      },
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
  }
}

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
  validateField('website', formData.value.website)
  validateField('experienceYears', formData.value.experienceYears?.toString() || '')

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
    if (formData.value.bio !== (user.value?.bio || '')) {
      profileData.bio = formData.value.bio || null
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

