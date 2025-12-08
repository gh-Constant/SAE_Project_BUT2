<template>
  <header class="bg-white/50 backdrop-blur-sm border-b-4 border-double border-antique-bronze/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3 md:gap-6">
          <router-link to="/" class="hover:opacity-80 transition-opacity">
            <img 
              src="/images/transparent_logo.png" 
              alt="Kingdom Logo" 
              class="h-10 md:h-16 w-auto object-contain drop-shadow-md"
            />
          </router-link>
          <div class="hidden md:block w-px h-12 bg-antique-bronze/30"></div>
          <router-link to="/prestataire" class="hover:opacity-80 transition-opacity hidden sm:block">
            <h1 class="text-xl md:text-3xl font-medieval font-bold text-iron-black leading-none">
              {{ $t('navbar.prestataire_panel') }}
            </h1>
          </router-link>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex gap-6">
          <router-link to="/prestataire/products" class="text-iron-black hover:text-antique-bronze font-medieval text-lg">{{ $t('navbar.products') }}</router-link>
          <router-link to="/prestataire/events" class="text-iron-black hover:text-antique-bronze font-medieval text-lg">{{ $t('navbar.events') }}</router-link>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center gap-3 md:gap-6 ml-auto">
          <span class="text-iron-black font-medieval text-sm md:text-lg hidden lg:block">
            {{ $t('navbar.welcome', { name: `${user?.firstname} ${user?.lastname}` }) }}
          </span>
          <MedievalButton 
            variant="primary" 
            :small="true"
            class="hidden md:flex"
            @click="$emit('logout')"
          >
            {{ $t('navbar.logout') }}
          </MedievalButton>

          <!-- Mobile Menu Button -->
          <MedievalButton
            class="md:hidden !p-2 !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <i class="fas" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
          </MedievalButton>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden bg-parchment border-t border-antique-bronze/20 shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto"
      >
        <div class="px-4 py-4 space-y-3">
          <!-- User info on mobile -->
          <div class="flex items-center px-2 py-2 mb-2 border-b border-antique-bronze/20 pb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center overflow-hidden border border-white/30 shadow-md mr-3">
              <i class="fas fa-user text-white text-sm" />
            </div>
            <div>
              <div class="text-sm font-medieval font-bold text-iron-black">
                {{ user?.firstname }} {{ user?.lastname }}
              </div>
              <div class="text-xs text-stone-grey font-body">
                {{ user?.email }}
              </div>
            </div>
          </div>

          <!-- Panel home -->
          <MedievalButton 
            to="/prestataire" 
            full-width
            class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-store text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.prestataire_panel') }}</span>
          </MedievalButton>

          <!-- Products -->
          <MedievalButton 
            to="/prestataire/products" 
            full-width
            class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-box text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.products') }}</span>
          </MedievalButton>

          <!-- Events -->
          <MedievalButton 
            to="/prestataire/events" 
            full-width
            class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-calendar-alt text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.events') }}</span>
          </MedievalButton>

          <div class="border-t border-antique-bronze/20 my-2"></div>

          <!-- Back to site -->
          <MedievalButton 
            to="/" 
            full-width
            class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-home text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.home') }}</span>
          </MedievalButton>

          <!-- Logout -->
          <MedievalButton
            full-width
            class="!justify-start !bg-red-800/80 hover:!bg-red-700 !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            @click="() => { $emit('logout'); isMobileMenuOpen = false; }"
          >
            <i class="fas fa-sign-out-alt text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.logout') }}</span>
          </MedievalButton>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import MedievalButton from '@/components/ui/MedievalButton.vue';
import { PropType, ref } from 'vue';

defineProps({
  user: {
    type: Object as PropType<any>,
    required: true
  }
});

defineEmits(['logout']);

const isMobileMenuOpen = ref(false);
</script>
