<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ t('prestataire.dashboard.title') }}
            </h1>
            <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ prestataireTypeName }}
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ t('prestataire.dashboard.welcome') }}, {{ user?.firstname }} {{ user?.lastname }}</span>
            <button
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              @click="logout"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Tabs Navigation -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          class="flex space-x-8"
          aria-label="Tabs"
        >
          <button
            :class="[
              activeTab === 'dashboard'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
            @click="activeTab = 'dashboard'"
          >
            {{ t('prestataire.tabs.dashboard') }}
          </button>
          <button
            :class="[
              activeTab === 'profile'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
            @click="activeTab = 'profile'"
          >
            {{ t('prestataire.tabs.profile') }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="w-full">
      <!-- Dashboard Tab -->
      <div
        v-if="activeTab === 'dashboard'"
        class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <div class="px-4 py-6 sm:px-0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- My Services Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        {{ t('prestataire.dashboard.services.title') }}
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        3 {{ t('prestataire.dashboard.services.count') }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                  <button class="font-medium text-indigo-600 hover:text-indigo-500">
                    {{ t('prestataire.dashboard.services.manage') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- My Locations Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        {{ t('prestataire.dashboard.locations.title') }}
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        2 {{ t('prestataire.dashboard.locations.count') }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                  <button class="font-medium text-indigo-600 hover:text-indigo-500">
                    {{ t('prestataire.dashboard.locations.view') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Earnings Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        {{ t('prestataire.dashboard.earnings.title') }}
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        1 250 €
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                  <button class="font-medium text-indigo-600 hover:text-indigo-500">
                    {{ t('prestataire.dashboard.earnings.view') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ t('prestataire.dashboard.quickActions.title') }}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                {{ t('prestataire.dashboard.quickActions.addService') }}
              </button>
              <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                {{ t('prestataire.dashboard.quickActions.createLocation') }}
              </button>
              <button class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                {{ t('prestataire.dashboard.quickActions.viewReservations') }}
              </button>
              <button
                class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                @click="activeTab = 'profile'"
              >
                {{ t('prestataire.dashboard.quickActions.editProfile') }}
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="mt-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ t('prestataire.dashboard.recentActivity.title') }}
            </h2>
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <li>
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-indigo-600 truncate">
                        Nouvelle réservation reçue
                      </p>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Confirmée
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          Réservation pour le service "Dégustation médiévale" - 15 personnes
                        </p>
                      </div>
                      <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Il y a 2 heures</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-indigo-600 truncate">
                        Paiement reçu
                      </p>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Réussi
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          Paiement de 450€ pour l'événement d'hier
                        </p>
                      </div>
                      <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Hier</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Tab -->
      <div
        v-if="activeTab === 'profile'"
        class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <PrestataireProfileForm />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { PRESTATAIRE_TYPES } from '@/mocks/prestataireTypes'
import { useI18n } from 'vue-i18n'
import PrestataireProfileForm from '@/components/PrestataireProfileForm.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
// Initialiser l'onglet actif depuis la query string ou par défaut 'dashboard'
const activeTab = ref<'dashboard' | 'profile'>(
  (route.query.tab === 'profile' ? 'profile' : 'dashboard') as 'dashboard' | 'profile'
)

// Écouter les changements de route pour mettre à jour l'onglet
onMounted(() => {
  if (route.query.tab === 'profile') {
    activeTab.value = 'profile'
  }
})

const prestataireTypeName = computed(() => {
  if (!user.value?.id_prestataire_type) return 'Type inconnu'
  const type = PRESTATAIRE_TYPES.find(
    t => t.id === user.value?.id_prestataire_type)
  return type ? type.name.charAt(0).toUpperCase() + type.name.slice(1) : 'Type inconnu'
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>