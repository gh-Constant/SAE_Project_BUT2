<template>
  <div class="bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center py-12 md:py-16">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-black mb-4 animate-fade-in-down" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.02em; line-height: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
          {{ t('home.hero.title') }}
        </h1>
        <p class="text-base md:text-lg max-w-3xl mx-auto mb-8 animate-fade-in-up text-center leading-relaxed" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.15);">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="animate-fade-in-up" style="animation-delay: 0.2s;">
          <a href="#map-section" class="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full text-base transition-all transform hover:scale-105 duration-300 ease-in-out shadow-lg">
            {{ t('home.hero.cta') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-10 md:py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">{{ t('home.features.title') }}</h2>
          <p class="mt-3 text-base md:text-lg text-gray-600">{{ t('home.features.subtitle') }}</p>
        </div>
        <div class="mt-8 md:mt-10 grid gap-6 md:grid-cols-3">
          <div class="text-center p-4 border border-orange-200 rounded-lg hover:shadow-lg transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-10 w-10 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10V7m0 0L5 4m4 3l6-3m6 3l4-2"></path></svg>
            </div>
            <h3 class="mt-3 text-base font-medium text-gray-900">{{ t('home.features.discover.title') }}</h3>
            <p class="mt-1 text-sm text-gray-600">{{ t('home.features.discover.description') }}</p>
          </div>

          <div class="text-center p-4 border border-orange-200 rounded-lg hover:shadow-lg transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-10 w-10 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="mt-3 text-base font-medium text-gray-900">{{ t('home.features.events.title') }}</h3>
            <p class="mt-1 text-sm text-gray-600">{{ t('home.features.events.description') }}</p>
          </div>

          <div class="text-center p-4 border border-orange-200 rounded-lg hover:shadow-lg transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-10 w-10 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 class="mt-3 text-base font-medium text-gray-900">{{ t('home.features.community.title') }}</h3>
            <p class="mt-1 text-sm text-gray-600">{{ t('home.features.community.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section id="map-section" class="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 md:py-16 md:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 md:mb-6" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">
            {{ t('map.title') }}
          </h2>
          <MapView />
          <div class="mt-4 text-center">
            <p class="text-xs md:text-sm text-gray-600 italic bg-gray-50 rounded p-2 inline-block">
              {{ t('map.instructions') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-orange-50">
      <div class="max-w-3xl mx-auto text-center py-10 px-4 sm:py-16 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">
          {{ t('home.cta.title') }}
        </h2>
        <p class="mt-3 text-base md:text-lg leading-5 text-gray-600">
          {{ t('home.cta.subtitle') }}
        </p>
        <a href="/register" class="mt-6 w-full inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-orange-600 hover:bg-orange-700 sm:w-auto">
          {{ t('home.cta.button') }}
        </a>
      </div>
    </section>
  </div>
</template>


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MapView from '@/components/MapView.vue';

const { t } = useI18n();
</script>

<style scoped>
</style>
