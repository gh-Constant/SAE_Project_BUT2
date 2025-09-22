<script setup lang="ts">
import LanguageSwitcher from './navbar/LanguageSwitcher.vue';
</script>

<template>
  <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-4 md:mb-0">
          <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
            <span class="text-white font-bold text-sm">M</span>
          </div>
          <span class="text-gray-600 text-sm">
            © 2024 MedievalEvent. All rights reserved.
          </span>
        </div>
        <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div class="flex items-center space-x-6">
            <a
              href="#"
              class="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              class="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              class="text-gray-500 hover:text-gray-700 text-sm transition-colors"
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