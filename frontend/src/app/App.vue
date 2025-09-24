<script setup lang="ts">
import { RouterView } from 'vue-router' // Composant pour afficher les routes
import Navbar from '@/components/navbar/Navbar.vue' // Barre de navigation
import Footer from '@/components/Footer.vue' // Pied de page
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