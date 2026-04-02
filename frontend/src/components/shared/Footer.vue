<script setup lang="ts">
import LanguageSwitcher from '@/components/navbar/LanguageSwitcher.vue';
</script>

<template>
  <footer class="bg-black/95 backdrop-blur-lg border-t border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
        <!-- Logo and copyright -->
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <img src="/images/transparent_logo.png" alt="Les Terres Du Lion Logo"
            class="h-10 md:h-12 w-auto mb-2 sm:mb-0 sm:mr-3">
          <span class="text-white/70 text-xs md:text-sm">
            {{ $t('footer.copyright') }}
          </span>
        </div>

        <!-- Links and language switcher -->
        <div class="flex flex-col items-center gap-4">
          <!-- Navigation links -->
          <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <router-link to="/about" class="text-white/60 hover:text-white text-xs md:text-sm transition-colors">
              {{ $t('footer.about') }}
            </router-link>
            <router-link to="/faq" class="text-white/60 hover:text-white text-xs md:text-sm transition-colors">
              {{ $t('footer.faq') }}
            </router-link>
            <router-link to="/contact" class="text-white/60 hover:text-white text-xs md:text-sm transition-colors">
              {{ $t('footer.contact') }}
            </router-link>
            <router-link to="/accessibility" class="text-white/60 hover:text-white text-xs md:text-sm transition-colors">
              {{ $t('footer.accessibility') }}
            </router-link>
          </div>
          <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <router-link to="/legal" class="text-white/40 hover:text-white/70 text-xs transition-colors">
              {{ $t('footer.legal') }}
            </router-link>
            <router-link to="/privacy" class="text-white/40 hover:text-white/70 text-xs transition-colors">
              {{ $t('footer.privacy') }}
            </router-link>
            <router-link to="/terms" class="text-white/40 hover:text-white/70 text-xs transition-colors">
              {{ $t('footer.terms') }}
            </router-link>
          </div>

          <!-- Language switcher -->
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>