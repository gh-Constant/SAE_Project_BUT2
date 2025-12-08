<script setup lang="ts">
import LanguageSwitcher from './navbar/LanguageSwitcher.vue';
</script>

<template>
  <footer class="bg-black/95 backdrop-blur-lg border-t border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
        <!-- Logo and copyright -->
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <img 
            src="/images/transparent_logo.png" 
            alt="MedievalEvent Logo" 
            class="h-10 md:h-12 w-auto mb-2 sm:mb-0 sm:mr-3"
          >
          <span class="text-white/70 text-xs md:text-sm">
            {{ $t('footer.copyright') }}
          </span>
        </div>

        <!-- Links and language switcher -->
        <div class="flex flex-col items-center gap-4">
          <!-- Navigation links -->
          <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <a
              href="#"
              class="text-white/60 hover:text-white text-xs md:text-sm transition-colors"
            >
              {{ $t('footer.privacy') }}
            </a>
            <a
              href="#"
              class="text-white/60 hover:text-white text-xs md:text-sm transition-colors"
            >
              {{ $t('footer.terms') }}
            </a>
            <a
              href="#"
              class="text-white/60 hover:text-white text-xs md:text-sm transition-colors"
            >
              {{ $t('footer.contact') }}
            </a>
          </div>
          
          <!-- Language switcher -->
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>