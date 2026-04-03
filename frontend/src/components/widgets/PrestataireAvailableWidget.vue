<template>
  <div class="min-h-96">
    <div class="relative w-full h-48 overflow-hidden rounded-t-lg">
      <img :src="location.banner_image" :alt="location.name" class="w-full h-full object-cover" />
    </div>

    <div class="p-6">
      <h2 class="text-3xl font-medieval font-bold mb-4 text-iron-black">{{ location.name }}</h2>
      <div class="tiptap prose prose-sm sm:prose lg:prose-base max-w-none text-stone-grey mb-6" v-html="location.description || ''"></div>

      <div v-if="location.has_water_access || location.has_electricity || location.has_toilets || location.is_accessible_pmr" class="bg-gradient-to-br from-white/50 to-antique-bronze/5 border border-antique-bronze/20 rounded-lg p-5 mb-6">
        <h3 class="text-lg font-medieval font-bold text-iron-black mb-1">{{ t('widgets.available.features.title') }}</h3>
        <p class="text-xs text-stone-grey mb-4 font-body">{{ t('widgets.available.features.subtitle') }}</p>
        <div class="grid grid-cols-2 gap-3">
          <div v-if="location.has_water_access" class="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-antique-bronze/10"><div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><i class="fas fa-tint text-blue-500 text-sm"></i></div><div><p class="text-sm font-bold text-iron-black">{{ t('widgets.available.features.water_title') }}</p><p class="text-xs text-stone-grey">{{ t('widgets.available.features.water_description') }}</p></div></div>
          <div v-if="location.has_electricity" class="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-antique-bronze/10"><div class="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0"><i class="fas fa-bolt text-yellow-500 text-sm"></i></div><div><p class="text-sm font-bold text-iron-black">{{ t('widgets.available.features.power_title') }}</p><p class="text-xs text-stone-grey">{{ t('widgets.available.features.power_description') }}</p></div></div>
          <div v-if="location.has_toilets" class="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-antique-bronze/10"><div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"><i class="fas fa-restroom text-emerald-500 text-sm"></i></div><div><p class="text-sm font-bold text-iron-black">{{ t('widgets.available.features.toilets_title') }}</p><p class="text-xs text-stone-grey">{{ t('widgets.available.features.toilets_description') }}</p></div></div>
          <div v-if="location.is_accessible_pmr" class="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-antique-bronze/10"><div class="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0"><i class="fas fa-wheelchair text-purple-500 text-sm"></i></div><div><p class="text-sm font-bold text-iron-black">{{ t('widgets.available.features.accessible_title') }}</p><p class="text-xs text-stone-grey">{{ t('widgets.available.features.accessible_description') }}</p></div></div>
        </div>
      </div>

      <div class="bg-antique-bronze/10 border border-antique-bronze/30 rounded-lg p-4 mb-6 flex items-center shadow-sm">
        <div class="w-12 h-12 bg-antique-bronze text-white rounded-full flex items-center justify-center mr-4 text-lg shadow-md"><i class="fas fa-store"></i></div>
        <div class="flex-1"><h3 class="text-lg font-medieval font-bold text-antique-bronze mb-1">{{ t('widgets.available.title') }}</h3><p class="text-sm font-body text-stone-grey">{{ t('widgets.available.description') }}</p></div>
      </div>

      <div class="bg-white/40 border border-antique-bronze/20 rounded-lg p-4 mb-6 font-body">
        <div class="flex justify-between mb-2"><span class="font-bold text-iron-black">{{ t('widgets.available.location') }}</span><span class="text-stone-grey">{{ location.static_code }}</span></div>
        <div class="flex justify-between mb-2"><span class="font-bold text-iron-black">{{ t('widgets.available.status_label') }}</span><span class="text-green-700 font-bold">{{ t('widgets.available.status_available') }}</span></div>
        <div class="flex justify-between"><span class="font-bold text-iron-black">{{ t('widgets.available.price') }}</span><span class="text-antique-bronze font-medieval font-bold text-lg">{{ location.price }} {{ t('widgets.available.currency') }}</span></div>
      </div>

      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 font-body"><p class="text-red-700">{{ errorMessage }}</p></div>
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-5 font-body"><p class="text-green-700">{{ successMessage }}</p></div>

      <div class="mb-6">
        <button class="w-full py-3 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold text-lg rounded shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" @click="acheterEmplacement" :disabled="isLoading || isPurchased">
          <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i>{{ t('widgets.available.acquire_loading') }}</span>
          <span v-else-if="isPurchased"><i class="fas fa-check"></i>{{ t('widgets.available.acquire_success') }}</span>
          <span v-else>{{ t('widgets.available.acquire_button') }}</span>
        </button>
        <h3 class="text-xl font-medieval font-bold mb-3 text-iron-black mt-6">{{ t('widgets.available.opportunities_title') }}</h3>
        <ul class="space-y-2 font-body">
          <li class="flex items-center p-2 border-b border-antique-bronze/10 last:border-b-0"><i class="fas fa-store text-antique-bronze mr-3 w-4"></i><span class="text-stone-grey">{{ t('widgets.available.opp_store') }}</span></li>
          <li class="flex items-center p-2 border-b border-antique-bronze/10 last:border-b-0"><i class="fas fa-scroll text-antique-bronze mr-3 w-4"></i><span class="text-stone-grey">{{ t('widgets.available.opp_quest') }}</span></li>
          <li class="flex items-center p-2 border-b border-antique-bronze/10 last:border-b-0"><i class="fas fa-calendar-alt text-antique-bronze mr-3 w-4"></i><span class="text-stone-grey">{{ t('widgets.available.opp_event') }}</span></li>
          <li class="flex items-center p-2"><i class="fas fa-users text-antique-bronze mr-3 w-4"></i><span class="text-stone-grey">{{ t('widgets.available.opp_reputation') }}</span></li>
        </ul>
      </div>

      <div class="flex justify-end"><button class="px-6 py-2 bg-stone-grey hover:bg-iron-black text-white font-medieval font-bold rounded shadow-md transition-colors border border-stone-grey/50" @click="$emit('close')">{{ t('widgets.available.close') }}</button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LocationMock } from '@/mocks/locations'
import { locationService } from '@/services/locationService'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props { location: LocationMock }
const props = defineProps<Props>()
const emit = defineEmits<{ close: []; purchased: [location: LocationMock] }>()

const isLoading = ref(false)
const isPurchased = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function acheterEmplacement() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    const user = await authService.getCurrentUser()
    if (!user) {
      errorMessage.value = t('widgets.available.error_login')
      return
    }
    const userId = (user as any).id_user || user.id
    const updatedLocation = await locationService.purchaseLocation(props.location.id, userId)
    const authStore = useAuthStore()
    if (authStore.user) {
      authStore.user.gold -= props.location.price || 0
      authStore.saveUserToStorage()
    }
    isPurchased.value = true
    successMessage.value = t('widgets.available.purchase_success_message')
    emit('purchased', updatedLocation)
    setTimeout(() => emit('close'), 2000)
  } catch (error) {
    console.error('Error purchasing location:', error)
    errorMessage.value = error instanceof Error ? error.message : t('widgets.available.purchase_error')
  } finally {
    isLoading.value = false
  }
}
</script>
