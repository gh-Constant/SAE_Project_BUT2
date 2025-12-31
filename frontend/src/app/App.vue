<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/navbar/Navbar.vue'
import PrestataireNavbar from '@/components/navbar/PrestataireNavbar.vue'
import Footer from '@/components/Footer.vue'
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

import { Role } from '@/mocks/users'

const uiStore = useUIStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const isLoginOrRegisterPage = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path.startsWith('/prestataire') || route.path.startsWith('/admin')
})

const isPrestataireRoute = computed(() => {
  const isPrestataire = authStore.user?.role === Role.PRESTATAIRE_ROLE_ID
  const isQuizRoute = route.path.startsWith('/quiz')
  return route.path.startsWith('/prestataire') || (isQuizRoute && isPrestataire)
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div id="app">
    <Navbar v-if="!isLoginOrRegisterPage && !isPrestataireRoute && !uiStore.isWidgetOpen" />
    <PrestataireNavbar 
      v-if="isPrestataireRoute" 
      :user="authStore.user" 
      @logout="logout"
    />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Minimal default styles from Vue scaffold */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>