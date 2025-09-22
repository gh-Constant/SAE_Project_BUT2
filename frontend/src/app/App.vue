<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router';
import Navbar from '@/components/navbar/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Vérifie si l'utilisateur est connecté au démarrage de l'application
onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <Navbar />         <!-- Barre de navigation -->
  <main>
    <RouterView />  <!-- Affiche le composant correspondant à la route -->
  </main>
  <Footer />        <!-- Pied de page -->
</template>
