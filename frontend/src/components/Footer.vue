<script setup lang="ts">
import LanguageSwitcher from './navbar/LanguageSwitcher.vue';
</script>

<template>
  <footer class="bg-black/95 backdrop-blur-lg border-t border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-4 md:mb-0">
          <img 
            src="/images/nobgicon.png" 
            alt="MedievalEvent Logo" 
            class="h-12 w-auto mr-3"
          >
          <span class="text-white/70 text-sm">
            © 2025 MedievalEvent. All rights reserved.
          </span>
        </div>
        <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div class="flex items-center space-x-6">
            <a
              href="#"
              class="text-white/60 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              class="text-white/60 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              class="text-white/60 hover:text-white text-sm transition-colors"
            >
              Contact
            </a>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>