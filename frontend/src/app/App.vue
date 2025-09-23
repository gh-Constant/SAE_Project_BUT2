<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from '@/components/navbar/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Vérifie si l'utilisateur est connecté au démarrage de l'application
onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <div id="app" class="h-screen flex flex-col">
    <Navbar />
    <main class="flex-1 overflow-auto">
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