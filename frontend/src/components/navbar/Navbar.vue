<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { isAdmin, isPrestataire } from '@/services/roleService';
import { computed, ref, onMounted, onUnmounted } from 'vue';

import CartDropdown from './CartDropdown.vue';
import MedievalButton from '@/components/ui/MedievalButton.vue';

const auth = useAuthStore();
const cartStore = useCartStore();
const isLoggedIn = computed(() => auth.isAuthenticated);
const showDropdown = ref(false);
const showDevDropdown = ref(false);
const showCartDropdown = ref(false);
const isScrolled = ref(false);

// Check if we're on the home page
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    showDropdown.value = false;
    showDevDropdown.value = false;
    showCartDropdown.value = false;
  }
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) {
    showDevDropdown.value = false;
    showCartDropdown.value = false;
  }
};

const toggleDevDropdown = () => {
  showDevDropdown.value = !showDevDropdown.value;
  if (showDevDropdown.value) {
    showDropdown.value = false;
    showCartDropdown.value = false;
  }
};

const toggleCartDropdown = () => {
  showCartDropdown.value = !showCartDropdown.value;
  if (showCartDropdown.value) {
    showDropdown.value = false;
    showDevDropdown.value = false;
  }
};

const closeDevDropdown = () => {
  showDevDropdown.value = false;
};

const handleLogout = () => {
  auth.logout();
  showDropdown.value = false;
  showDevDropdown.value = false;
  showCartDropdown.value = false;
};

// Fermer le dropdown si on clique ailleurs
const closeDropdown = () => {
  showDropdown.value = false;
};

// Gérer le clic en dehors du dropdown
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-container')) {
    showDropdown.value = false;
  }
  if (!target.closest('.dev-dropdown-container')) {
    showDevDropdown.value = false;
  }
  if (!target.closest('.cart-dropdown-container')) {
    showCartDropdown.value = false;
  }
};

// Cache scroll threshold for better performance
let scrollThreshold = 0;

const updateScrollState = () => {
  const shouldBeScrolled = window.scrollY > scrollThreshold;
  
  // Only update if the state actually changes
  if (isScrolled.value !== shouldBeScrolled) {
    isScrolled.value = shouldBeScrolled;
  }
};

const handleScroll = () => {
  updateScrollState();
};

onMounted(() => {
  // Calculate and cache the scroll threshold once
  scrollThreshold = window.innerHeight * 0.8;
  
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Check initial scroll position
  updateScrollState();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScroll);
});

const isDev = import.meta.env.DEV;

// Route vers le profil selon le rôle de l'utilisateur
const profileRoute = computed(() => {
  if (isAdmin(auth.user)) {
    return '/admin';
  } else if (isPrestataire(auth.user)) {
    return '/prestataire';
  }
  // Pour les aventuriers ou autres rôles, on pourrait créer une route /profile
  return '/';
});

</script>

<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-[1100] bg-transparent"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-4">
          <MedievalButton 
            to="/" 
            class="!shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            active-class="!bg-[#8B6B43] !border-[#5D4037]"
          >
            <i class="fas fa-home text-lg"></i>
            <span class="ml-2">{{ $t('navbar.home') }}</span>
          </MedievalButton>
          <MedievalButton 
            v-if="isLoggedIn"
            to="/map" 
            class="!shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            active-class="!bg-[#8B6B43] !border-[#5D4037]"
          >
            <i class="fas fa-map text-lg"></i>
            <span class="ml-2">{{ $t('navbar.map') }}</span>
          </MedievalButton>
          <MedievalButton 
            v-if="isLoggedIn"
            to="/events" 
            class="!shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            active-class="!bg-[#8B6B43] !border-[#5D4037]"
          >
            <i class="fas fa-calendar-alt text-lg"></i>
            <span class="ml-2">{{ $t('navbar.events') }}</span>
          </MedievalButton>
        </div>

        <div class="flex items-center space-x-4 ml-auto">
          <!-- Icône panier (visible uniquement si connecté, caché sur mobile) -->
          <div v-if="isLoggedIn" class="relative cart-dropdown-container hidden md:block">
            <MedievalButton
              @click="toggleCartDropdown"
              small
              class="!shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              title="Mon panier"
            >
              <i class="fas fa-shopping-cart text-lg"></i>
              <span class="ml-2">{{ $t('navbar.cart') }}</span>
              <span
                v-if="cartStore.itemCount > 0"
                class="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm ml-2"
              >
                {{ cartStore.itemCount > 9 ? '9+' : cartStore.itemCount }}
              </span>
            </MedievalButton>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <CartDropdown 
                v-if="showCartDropdown" 
                @close="showCartDropdown = false" 
              />
            </transition>
          </div>

          <!-- Login/Register buttons (hidden on mobile) -->
          <template v-if="!isLoggedIn">
            <MedievalButton
              to="/login"
              class="hidden md:flex !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            >
              <i class="fas fa-sign-in-alt text-lg"></i>
              <span class="ml-2">{{ $t('navbar.signin') }}</span>
            </MedievalButton>
            <MedievalButton
              to="/register"
              class="hidden md:flex !bg-[#8B6B43] hover:!bg-[#a88558] !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            >
              <i class="fas fa-user-plus text-lg"></i>
              <span class="ml-2">{{ $t('navbar.register') }}</span>
            </MedievalButton>
          </template>

          <!-- Profile dropdown (hidden on mobile) -->
          <div
            v-if="isLoggedIn"
            class="relative dropdown-container hidden md:block"
          >
            <MedievalButton
              class="flex items-center gap-2 !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="toggleDropdown"
              small
            >
              <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center overflow-hidden border border-white/30 shadow-md">
                <img 
                  v-if="auth.user?.avatar_url" 
                  :src="auth.user.avatar_url" 
                  :alt="auth.user.firstname"
                  class="w-full h-full object-cover"
                >
                <i
                  v-else
                  class="fas fa-user text-white text-xs"
                />
              </div>
              <div class="text-left hidden sm:block">
                <div class="text-xs font-medieval tracking-wide text-white leading-tight">
                  {{ auth.user?.firstname }}
                </div>
              </div>
              <i class="fas fa-chevron-down text-xs text-white/70 ml-1" />
            </MedievalButton>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-56 bg-parchment rounded-sm shadow-xl py-2 z-50 border-2 border-antique-bronze"
            >
              <!-- User Info Header -->
              <div class="px-4 py-2 border-b border-antique-bronze/20">
                <div class="text-sm font-medieval font-bold text-iron-black">
                  {{ auth.user?.firstname }} {{ auth.user?.lastname }}
                </div>
                <div class="text-xs text-stone-grey font-body">
                  {{ auth.user?.email }}
                </div>
              </div>
              
              <!-- Menu Items -->
              <router-link
                v-if="isAdmin(auth.user)"
                to="/admin"
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-cog mr-3 text-antique-bronze" />
                {{ $t('navbar.admin_panel') }}
              </router-link>
              <router-link
                v-if="isPrestataire(auth.user)"
                to="/prestataire"
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-briefcase mr-3 text-antique-bronze" />
                {{ $t('navbar.prestataire_panel') }}
              </router-link>
              <div class="border-t border-antique-bronze/20" />
              <router-link
                to="/commandes"
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-list mr-3 text-antique-bronze" />
                {{ $t('navbar.my_orders') }}
              </router-link>
              <router-link
                to="/my-reservations"
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-ticket-alt mr-3 text-antique-bronze" />
                {{ $t('navbar.my_reservations') }}
              </router-link>
              <router-link
                to="/my-quests"
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-scroll mr-3 text-antique-bronze" />
                {{ $t('navbar.my_quests') }}
              </router-link>
              <router-link
                :to="profileRoute"
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="closeDropdown"
              >
                <i class="fas fa-user-edit mr-3 text-antique-bronze" />
                {{ $t('navbar.profile') }}
              </router-link>
              <button
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="handleLogout"
              >
                <i class="fas fa-sign-out-alt mr-3 text-antique-bronze" />
                {{ $t('navbar.logout') }}
              </button>
            </div>
          </div>

          <!-- Dev Tools Dropdown (Dev Mode Only, hidden on mobile) -->
          <div v-if="isDev" class="relative dev-dropdown-container hidden md:block">
            <MedievalButton
              @click="toggleDevDropdown"
              small
              variant="transparent"
              class="!px-3"
              title="Dev Tools"
            >
              <i class="fas fa-chevron-down text-xs"></i>
            </MedievalButton>

            <!-- Dropdown Menu -->
            <div
              v-if="showDevDropdown"
              class="absolute right-0 mt-2 w-48 bg-parchment rounded-sm shadow-xl py-2 z-50 border-2 border-antique-bronze"
            >
              <div class="px-4 py-2 border-b border-antique-bronze/20 text-xs font-bold text-stone-grey uppercase tracking-wider font-medieval">
                Quick Login (Dev)
              </div>
              <button
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="() => { auth.login('aventurier@medieval.com', 'password123'); closeDevDropdown(); }"
              >
                <i class="fas fa-user mr-2 text-antique-bronze"></i> Aventurier
              </button>
              <button
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="() => { auth.login('prestataire@medieval.com', 'password123'); closeDevDropdown(); }"
              >
                <i class="fas fa-store mr-2 text-antique-bronze"></i> Prestataire
              </button>
              <button
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="() => { auth.login('prestataire2@medieval.com', 'password123'); closeDevDropdown(); }"
              >
                <i class="fas fa-store mr-2 text-antique-bronze"></i> Prestataire 2
              </button>
              <button
                class="flex items-center w-full px-4 py-2 text-sm font-medieval text-dark-wood hover:bg-antique-bronze/10 transition-colors"
                @click="() => { auth.login('admin@medieval.com', 'password123'); closeDevDropdown(); }"
              >
                <i class="fas fa-user-shield mr-2 text-antique-bronze"></i> Admin
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button (on the right) -->
          <div class="flex md:hidden">
            <MedievalButton
              @click="toggleMobileMenu"
              class="!p-2 !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            >
              <i class="fas" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
            </MedievalButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden bg-parchment border-b-4 border-antique-bronze shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
        <div class="px-4 pt-2 pb-6 space-y-3">
          <MedievalButton 
            to="/" 
            full-width
            class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            active-class="!bg-[#8B6B43] !border-[#5D4037]"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-home text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.home') }}</span>
          </MedievalButton>
          
          <MedievalButton 
            v-if="isLoggedIn"
            to="/map" 
            full-width
            class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            active-class="!bg-[#8B6B43] !border-[#5D4037]"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-map text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.map') }}</span>
          </MedievalButton>

          <MedievalButton 
            v-if="isLoggedIn"
            to="/events" 
            full-width
            class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            active-class="!bg-[#8B6B43] !border-[#5D4037]"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-calendar-alt text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.events') }}</span>
          </MedievalButton>

          <!-- Cart button in mobile menu -->
          <MedievalButton 
            v-if="isLoggedIn"
            to="/panier" 
            full-width
            class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-shopping-cart text-lg w-8"></i>
            <span class="ml-2">{{ $t('navbar.cart') }}</span>
            <span
              v-if="cartStore.itemCount > 0"
              class="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm ml-2"
            >
              {{ cartStore.itemCount > 9 ? '9+' : cartStore.itemCount }}
            </span>
          </MedievalButton>

          <div class="border-t border-antique-bronze/20 my-2"></div>

          <template v-if="isLoggedIn">
            <div class="flex items-center px-2 py-2 mb-2">
              <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center overflow-hidden border border-white/30 shadow-md mr-3">
                <img 
                  v-if="auth.user?.avatar_url" 
                  :src="auth.user.avatar_url" 
                  :alt="auth.user.firstname"
                  class="w-full h-full object-cover"
                >
                <i v-else class="fas fa-user text-white text-sm" />
              </div>
              <div>
                <div class="text-sm font-medieval font-bold text-iron-black">
                  {{ auth.user?.firstname }} {{ auth.user?.lastname }}
                </div>
                <div class="text-xs text-stone-grey font-body">
                  {{ auth.user?.email }}
                </div>
              </div>
            </div>

            <MedievalButton
              to="/commandes"
              full-width
              class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-list text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.my_orders') }}</span>
            </MedievalButton>

            <MedievalButton
              to="/my-reservations"
              full-width
              class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-ticket-alt text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.my_reservations') }}</span>
            </MedievalButton>

            <MedievalButton
              to="/my-quests"
              full-width
              class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-scroll text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.my_quests') }}</span>
            </MedievalButton>

            <MedievalButton
              :to="profileRoute"
              full-width
              class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-user-edit text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.profile') }}</span>
            </MedievalButton>

            <MedievalButton
              v-if="isAdmin(auth.user)"
              to="/admin"
              full-width
              class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-cog text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.admin_panel') }}</span>
            </MedievalButton>

            <MedievalButton
              v-if="isPrestataire(auth.user)"
              to="/prestataire"
              full-width
              class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-briefcase text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.prestataire_panel') }}</span>
            </MedievalButton>

            <MedievalButton
              full-width
              class="!justify-start !bg-red-800/80 hover:!bg-red-700 !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="() => { handleLogout(); isMobileMenuOpen = false; }"
            >
              <i class="fas fa-sign-out-alt text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.logout') }}</span>
            </MedievalButton>
          </template>

          <template v-else>
            <MedievalButton
              to="/login"
              full-width
              class="!justify-start !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-sign-in-alt text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.signin') }}</span>
            </MedievalButton>
            <MedievalButton
              to="/register"
              full-width
              class="!justify-start !bg-[#8B6B43] hover:!bg-[#a88558] !shadow-[0_2px_0_#5D4037] !active:translate-y-[2px]"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-user-plus text-lg w-8"></i>
              <span class="ml-2">{{ $t('navbar.register') }}</span>
            </MedievalButton>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>