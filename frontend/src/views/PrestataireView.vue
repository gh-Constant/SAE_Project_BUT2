<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <!-- Tabs Navigation -->
    <div class="bg-white/40 backdrop-blur-sm border-b border-antique-bronze/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            :class="[
              activeTab === 'dashboard'
                ? 'border-antique-bronze text-antique-bronze'
                : 'border-transparent text-stone-grey hover:text-iron-black hover:border-antique-bronze/30',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medieval font-bold text-sm transition-colors'
            ]" @click="updateTab('dashboard')"
          >
            {{ t('prestataire.tabs.dashboard') }}
          </button>
          <button
            :class="[
              activeTab === 'profile'
                ? 'border-antique-bronze text-antique-bronze'
                : 'border-transparent text-stone-grey hover:text-iron-black hover:border-antique-bronze/30',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medieval font-bold text-sm transition-colors'
            ]" @click="updateTab('profile')"
          >
            {{ t('prestataire.tabs.profile') }}
          </button>
          <button
            :class="[
              activeTab === 'messages'
                ? 'border-antique-bronze text-antique-bronze'
                : 'border-transparent text-stone-grey hover:text-iron-black hover:border-antique-bronze/30',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medieval font-bold text-sm transition-colors'
            ]" @click="updateTab('messages')"
          >
            {{ t('messaging.title') || 'Messages' }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'">
          <!-- Dashboard Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <!-- Orders Card -->
            <div
              class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <!-- Decorative corner -->
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>

              <div class="relative p-6">
                <!-- Icon -->
                <div class="flex justify-center mb-4">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                  >
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="text-center mb-4">
                  <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">{{ t('prestataire.dashboard.orders.title') }}</h3>
                  <p class="text-4xl font-medieval font-bold text-iron-black mb-1">{{ stats?.orderCount ?? '-' }}</p>
                  <p class="text-xs text-stone-grey/80">{{ t('prestataire.dashboard.orders.total_label') }}</p>
                </div>

                <!-- Action -->
                <div class="pt-4 border-t border-antique-bronze/20">
                  <router-link to="/prestataire/orders/scan" class="contents">
                    <button
                      class="w-full text-antique-bronze hover:text-iron-black font-bold text-sm flex items-center justify-center gap-2 transition-colors group-hover:gap-3 duration-300"
                    >
                      {{ t('prestataire.dashboard.orders.scan') }}
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- My Locations Card -->
            <div
              class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <!-- Decorative corner -->
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>

              <div class="relative p-6">
                <!-- Icon -->
                <div class="flex justify-center mb-4">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                  >
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="text-center mb-4">
                  <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">{{
                    t('prestataire.dashboard.locations.title') }}</h3>
                  <p class="text-4xl font-medieval font-bold text-iron-black mb-1">{{ stats?.locationsCount ?? '-' }}</p>
                  <p class="text-xs text-stone-grey/80">{{ t('prestataire.dashboard.locations.managed_count_label') }}
                  </p>
                </div>

                <!-- Action -->
                <div class="pt-4 border-t border-antique-bronze/20">
                  <router-link to="/prestataire/locations" class="contents">
                    <button
                      class="w-full text-antique-bronze hover:text-iron-black font-bold text-sm flex items-center justify-center gap-2 transition-colors group-hover:gap-3 duration-300"
                    >
                      {{ t('prestataire.dashboard.locations.view') }}
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Earnings Card -->
            <div
              class="group relative bg-gradient-to-br from-aged-paper to-warm-sand rounded-lg border-2 border-antique-bronze/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <!-- Decorative corner -->
              <div class="absolute top-0 right-0 w-20 h-20 bg-antique-bronze/10 rounded-bl-full"></div>

              <div class="relative p-6">
                <!-- Icon -->
                <div class="flex justify-center mb-4">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-antique-bronze to-[#a88558] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                  >
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="text-center mb-4">
                  <h3 class="text-sm font-bold text-stone-grey uppercase tracking-widest mb-2">{{
                    t('prestataire.dashboard.earnings.title') }}</h3>
                  <p class="text-4xl font-medieval font-bold text-iron-black mb-1">{{ stats?.monthlyRevenue ?? '-' }} €</p>
                  <p class="text-xs text-stone-grey/80">{{ t('prestataire.dashboard.earnings.monthly_total') }}</p>
                </div>

                <!-- Action -->
                <div class="pt-4 border-t border-antique-bronze/20">
                  <button
                    class="w-full text-antique-bronze hover:text-iron-black font-bold text-sm flex items-center justify-center gap-2 transition-colors group-hover:gap-3 duration-300"
                  >
                    {{ t('prestataire.dashboard.earnings.view_details') }}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mb-12">
            <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center">
              <span class="w-8 h-1 bg-antique-bronze rounded-full mr-4"></span>
              {{ t('prestataire.dashboard.quick_actions.title') }}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <router-link to="/prestataire/products" class="contents">
                <MedievalButton variant="primary" :fullWidth="true">
                  {{ t('prestataire.dashboard.quick_actions.manage_shop') }}
                </MedievalButton>
              </router-link>

              <router-link to="/prestataire/events" class="contents">
                <MedievalButton variant="primary" :fullWidth="true">
                  {{ t('prestataire.dashboard.quick_actions.manage_events') }}
                </MedievalButton>
              </router-link>

              <router-link to="/prestataire/quests" class="contents">
                <MedievalButton variant="primary" :fullWidth="true">
                  {{ t('prestataire.dashboard.quick_actions.manage_quests') }}
                </MedievalButton>
              </router-link>

              <router-link to="/prestataire/orders/scan" class="contents">
                <MedievalButton variant="primary" :fullWidth="true">
                  {{ t('prestataire.dashboard.quick_actions.scan_order') }}
                </MedievalButton>
              </router-link>

              <router-link to="/quiz" class="contents">
                <MedievalButton variant="primary" :fullWidth="true">
                  {{ t('prestataire.dashboard.quick_actions.manage_quizzes') }}
                </MedievalButton>
              </router-link>

              <router-link to="/prestataire/reservations" class="contents">
                <MedievalButton variant="primary" :fullWidth="true">
                  {{ t('prestataire.dashboard.quick_actions.view_bookings') }}
                </MedievalButton>
              </router-link>

              <MedievalButton variant="primary" :fullWidth="true" @click="updateTab('profile')">
                {{ t('prestataire.dashboard.quick_actions.edit_profile') }}
              </MedievalButton>
            </div>
          </div>
        </div>

        <!-- Messages Tab -->
        <div v-if="activeTab === 'messages'" class="h-[calc(100vh-200px)]">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden h-full flex border border-antique-bronze/20">
            <!-- Conversations List -->
            <div class="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
              <div class="flex justify-between items-center mb-4 px-4 pt-4">
                <h2 class="text-xl font-medieval font-bold text-iron-black">{{ t('messaging.conversations') ||
                  'Conversations' }}</h2>
              </div>

              <div class="flex-1 overflow-y-auto">
                <div v-if="isLoadingMessages" class="p-4 text-center">
                  <i class="fas fa-spinner fa-spin text-antique-bronze"></i>
                </div>

                <div v-else-if="conversations.length === 0" class="p-6 text-center text-stone-grey">
                  {{ t('messaging.no_conversations') || 'Aucune conversation.' }}
                </div>

                <ul v-else class="divide-y divide-gray-200">
                  <li
                    v-for="conv in conversations" :key="conv.id_conversation" @click="selectConversation(conv)"
                    class="p-4 hover:bg-white cursor-pointer transition-colors border-l-4 group relative"
                    :class="selectedConversation?.id_conversation === conv.id_conversation ? 'bg-white border-l-antique-bronze shadow-sm' : 'border-l-transparent bg-transparent'"
                  >
                    <div class="flex justify-between items-start mb-1">
                      <h3 class="font-bold text-gray-800 text-sm truncate pr-2">
                        {{ conv.user?.firstname }} {{ conv.user?.lastname }}
                      </h3>
                      <button
                        @click.stop="deleteConversation(conv.id_conversation)"
                        class="text-gray-400 hover:text-red-500 transition-colors p-1"
                        :title="t('messaging.delete') || 'Delete'"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center text-xs text-gray-500 mb-1">
                        <i class="fas fa-map-marker-alt text-antique-bronze mr-1"></i>
                        {{ conv.location.name }}
                      </div>
                      <span class="text-[10px] text-gray-500 whitespace-nowrap">
                        {{ new Date(conv.updated_at).toLocaleDateString() }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 truncate mt-1">
                      {{ conv.messages?.[0]?.content || '...' }}
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Conversation Thread -->
            <div class="flex-1 bg-gray-100 p-4 flex flex-col items-center justify-center relative">
              <div v-if="!selectedConversation" class="text-center text-gray-400">
                <i class="fas fa-comments text-4xl mb-2"></i>
                <p>{{ t('messaging.select_conversation') || 'Sélectionnez une conversation' }}</p>
              </div>

              <ConversationThread
                v-else :conversation-id="selectedConversation.id_conversation"
                :initial-conversation="selectedConversation" :is-provider-view="true" class="w-full h-full"
              />
            </div>
          </div>
        </div>
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'">
          <PrestataireProfileForm />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MedievalButton from '@/components/ui/MedievalButton.vue'
import PrestataireProfileForm from '@/components/PrestataireProfileForm.vue'
import ConversationThread from '@/components/messaging/ConversationThread.vue'
import { useI18n } from 'vue-i18n'
import { messagingService, type Conversation } from '@/services/messagingService'
import { useAuthStore } from '@/stores/auth'
import { statsService, type ProviderStats } from '@/services/statsService'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Gérer l'onglet actif depuis la query string
const activeTab = ref<string>((route.query.tab as string) || 'dashboard')

// Stats state
const stats = ref<ProviderStats | null>(null)

// Messages state
const conversations = ref<Conversation[]>([])
const selectedConversation = ref<Conversation | null>(null)
const isLoadingMessages = ref(false)

const fetchStats = async () => {
  try {
    stats.value = await statsService.getProviderGlobalStats()
  } catch (error) {
    console.error('Failed to fetch provider stats:', error)
  }
}

// Mettre à jour l'URL quand l'onglet change
const updateTab = (tab: string) => {
  activeTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}

const fetchConversations = async () => {
  if (!authStore.user) return

  isLoadingMessages.value = true
  try {
    conversations.value = await messagingService.getConversations()
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
  } finally {
    isLoadingMessages.value = false
  }
}

const selectConversation = (conv: Conversation) => {
  selectedConversation.value = conv
}

const deleteConversation = async (id: number) => {
  if (confirm(t('messaging.confirm_delete') || 'Are you sure?')) {
    try {
      await messagingService.deleteConversation(id);
      // Remove locally
      conversations.value = conversations.value.filter(c => c.id_conversation !== id);
      if (selectedConversation.value?.id_conversation === id) {
        selectedConversation.value = null;
      }
    } catch (e) {
      console.error('Failed to delete:', e);
    }
  }
}

// Watch tab changes to fetch data
watch(activeTab, (newTab) => {
  if (newTab === 'messages') {
    fetchConversations()
  }
})

// Écouter les changements de route
onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab as string
  }
  if (activeTab.value === 'messages') {
    fetchConversations()
  }
  fetchStats()
})
</script>