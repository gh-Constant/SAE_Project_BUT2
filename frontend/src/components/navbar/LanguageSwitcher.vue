<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const changeLanguage = (lang: string) => {
  locale.value = lang;
};
</script>

<template>
  <div class="flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
    <span class="text-sm font-medium text-gray-700 mr-2">Language:</span>
    <button
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
        locale === 'en'
          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
      @click="changeLanguage('en')"
    >
      EN
    </button>
    <button
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
        locale === 'fr'
          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
      @click="changeLanguage('fr')"
    >
      FR
    </button>
    <button
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
        locale === 'de'
          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
      @click="changeLanguage('de')"
    >
      DE
    </button>
    <button
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
        locale === 'es'
          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
      @click="changeLanguage('es')"
    >
      ES
    </button>
  </div>
</template>