<template>
  <UserDashboardLayout>
    <div v-if="activeTab === 'profile'">
      <ProfileForm />
    </div>
    <div v-else-if="activeTab === 'security'">
      <SecuritySettingsForm />
    </div>
  </UserDashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { isPrestataire } from '@/services/roleService'
import ProfileForm from '@/components/forms/ProfileForm.vue'
import SecuritySettingsForm from '@/components/forms/SecuritySettingsForm.vue'
import UserDashboardLayout from '@/components/layout/UserDashboardLayout.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeTab = computed(() => {
  return route.query.tab === 'security' ? 'security' : 'profile'
})

// Rediriger automatiquement les prestataires vers leur panel avec l'onglet profil
onMounted(() => {
  if (isPrestataire(authStore.user)) {
    // Rediriger vers le panel prestataire avec l'onglet profil
    router.replace({ name: 'prestataire', query: { tab: 'profile' } })
  }
})
</script>
