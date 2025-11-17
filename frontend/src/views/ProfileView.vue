<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
    <!-- Bouton retour à l'accueil - Aligné à gauche -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-left">
      <router-link
        to="/"
        class="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        {{ t('prestataire.profile.backToHome') }}
      </router-link>
    </div>

    <!-- Formulaire de profil -->
    <ProfileForm />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProfileForm from '@/components/ProfileForm.vue'

const { t } = useI18n()
</script>