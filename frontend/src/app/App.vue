<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/navbar/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { computed } from 'vue'

const route = useRoute()

const isLoginOrRegisterPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
</script>

<template>
  <div id="app">
    <Navbar v-if="!isLoginOrRegisterPage" />
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