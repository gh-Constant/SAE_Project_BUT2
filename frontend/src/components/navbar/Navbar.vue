<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './LanguageSwitcher.vue';

const { t } = useI18n();
</script>

<template>
  <nav class="bg-white shadow-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0">
          <h1 class="text-xl font-bold text-gray-900">
            {{ t('navbar.title') }}
          </h1>
        </div>
        <div class="flex items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </nav>
</template>