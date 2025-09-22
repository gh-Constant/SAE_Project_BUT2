<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router';
import Navbar from '@/components/navbar/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
    <Navbar />
    <main>
      <RouterView />
    </main>
    <Footer />
</template>

