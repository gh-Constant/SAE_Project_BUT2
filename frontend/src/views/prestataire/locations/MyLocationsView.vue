<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <main class="w-full pt-32 pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex justify-between items-center relative">
          <BackToMapButton to="/prestataire" />
        </div>

        <!-- En-tête -->
        <div class="mb-8 text-center">
          <h1 class="text-4xl md:text-5xl font-medieval font-bold text-iron-black mb-4">
            <i class="fas fa-map-marked-alt mr-3 text-antique-bronze"></i>
            {{ t('prestataire.locations.title') }}
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-6"></div>
          <p class="text-lg text-stone-grey">{{ t('prestataire.locations.subtitle') }}</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <p class="text-xl font-medieval animate-pulse text-antique-bronze">{{ t('prestataire.locations.loading') }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="locations.length === 0"
          class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
          <i class="fas fa-dungeon text-6xl text-antique-bronze/30 mb-4"></i>
          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
            {{ t('prestataire.quests.no_locations.title') }}
          </h3>
          <p class="text-stone-grey mb-6">
            {{ t('prestataire.quests.no_locations.subtitle') }}
          </p>
          <router-link to="/map">
            <MedievalButton>
              <i class="fas fa-map mr-2"></i>
              {{ t('prestataire.quests.no_locations.explore_button') }}
            </MedievalButton>
          </router-link>
        </div>

        <!-- Grid of Locations -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="location in locations" :key="location.id"
            class="bg-white/60 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border-2 border-antique-bronze/20 hover:border-antique-bronze/60 flex flex-col">
            <!-- Image Section -->
            <div class="h-48 bg-antique-bronze/10 overflow-hidden relative group">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <img v-if="location.banner_image" :src="location.banner_image" :alt="location.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div v-else class="w-full h-full flex items-center justify-center bg-stone-200">
                <i class="fas fa-store text-6xl text-stone-400"></i>
              </div>

              <!-- Title Overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h2 class="text-2xl font-medieval font-bold text-white shadow-sm">{{ location.name }}</h2>
              </div>

              <!-- Status Badge -->
              <div class="absolute top-4 right-4 z-20">
                <span v-if="location.status === 'PENDING'"
                  class="px-3 py-1 bg-amber-500/90 text-white text-sm font-bold rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
                  <i class="fas fa-hourglass-half mr-1"></i> {{ t('prestataire.locations.status.pending') }}
                </span>
                <span v-else-if="location.status === 'APPROVED'"
                  class="px-3 py-1 bg-green-600/90 text-white text-sm font-bold rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
                  <i class="fas fa-check-circle mr-1"></i> {{ t('prestataire.locations.status.active') }}
                </span>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-6 flex-1 flex flex-col">
              <div
                class="tiptap prose prose-sm max-w-none text-stone-grey mb-6 line-clamp-3 flex-1"
                v-html="location.description || ''"
              ></div>

              <button
                @click="openEditModal(location)"
                class="w-full mb-3 bg-white/50 hover:bg-white text-antique-bronze border border-antique-bronze font-medieval font-bold py-2.5 px-4 rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <i class="fas fa-edit group-hover:scale-110 transition-transform"></i>
                {{ t('prestataire.locations.actions.edit') }}
              </button>

              <div v-if="location.status === 'APPROVED'"
                class="space-y-3 mt-auto pt-4 border-t border-antique-bronze/20">
                <button @click="manageEvents(location.id)"
                  class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-2.5 px-4 rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 group">
                  <i class="fas fa-calendar-alt group-hover:scale-110 transition-transform"></i>
                  {{ t('prestataire.dashboard.quick_actions.manage_events') }}
                </button>

                <button @click="manageShop(location.id)"
                  class="w-full bg-white/50 hover:bg-white text-antique-bronze border border-antique-bronze font-medieval font-bold py-2.5 px-4 rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 group">
                  <i class="fas fa-store group-hover:scale-110 transition-transform"></i>
                  {{ t('prestataire.dashboard.quick_actions.manage_shop') }}
                </button>

                <button @click="addQuiz(location.id)"
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-medieval font-bold py-2.5 px-4 rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 group">
                  <i class="fas fa-scroll group-hover:scale-110 transition-transform"></i>
                  {{ t('prestataire.dashboard.quick_actions.manage_quizzes') }}
                </button>
              </div>

              <!-- Locked State -->
              <div v-else class="mt-auto pt-4 border-t border-antique-bronze/20 text-center">
                <div class="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-sm">
                  <i class="fas fa-lock mb-2 text-lg"></i><br />
                  {{ t('prestataire.locations.pending_notice') }}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <Teleport to="body">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeEditModal"
      >
        <div class="bg-parchment rounded-lg shadow-2xl border-2 border-antique-bronze/40 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div class="flex items-center justify-between px-6 py-5 border-b border-antique-bronze/15 bg-white/60">
            <div>
              <h2 class="text-2xl font-medieval font-bold text-iron-black">{{ t('prestataire.locations.edit_modal.title') }}</h2>
              <p class="text-sm text-stone-grey mt-1">{{ editForm.name || t('prestataire.locations.edit_modal.untitled') }}</p>
            </div>
            <button @click="closeEditModal" class="text-stone-grey hover:text-iron-black transition-colors">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="overflow-y-auto max-h-[calc(90vh-88px)] p-6">
            <div v-if="editError" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {{ editError }}
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-iron-black mb-2">{{ t('prestataire.locations.edit_modal.name_label') }}</label>
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full px-4 py-3 bg-white border border-antique-bronze/30 rounded-lg focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black"
                  :placeholder="t('prestataire.locations.edit_modal.name_placeholder')"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-iron-black mb-2">{{ t('prestataire.locations.edit_modal.image_label') }}</label>
                <div class="bg-white/60 border border-antique-bronze/20 rounded-lg p-4">
                  <div class="h-56 rounded-lg overflow-hidden bg-stone-200 mb-4 flex items-center justify-center">
                    <img
                      v-if="editForm.banner_image"
                      :src="editForm.banner_image"
                      :alt="editForm.name"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="text-stone-grey flex flex-col items-center gap-2">
                      <i class="fas fa-image text-4xl"></i>
                      <span>{{ t('prestataire.locations.edit_modal.no_image') }}</span>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-3">
                    <label class="px-4 py-2 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold rounded-md shadow-md transition-all cursor-pointer">
                      <span v-if="uploadingImage">
                        <i class="fas fa-spinner fa-spin mr-2"></i> {{ t('prestataire.locations.edit_modal.uploading') }}
                      </span>
                      <span v-else>
                        <i class="fas fa-upload mr-2"></i> {{ t('prestataire.locations.edit_modal.change_image') }}
                      </span>
                      <input type="file" accept="image/*" class="hidden" :disabled="uploadingImage" @change="handleImageUpload">
                    </label>

                    <button
                      v-if="editForm.banner_image"
                      @click="editForm.banner_image = ''"
                      type="button"
                      class="px-4 py-2 bg-white hover:bg-stone-50 text-stone-grey border border-stone-300 rounded-md transition-colors"
                    >
                      {{ t('prestataire.locations.edit_modal.remove_image') }}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-iron-black mb-2">{{ t('prestataire.events.manager.form.description_label') }}</label>
                <Editor ref="editorRef" :initial-content="editForm.description" />
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-antique-bronze/15">
              <button
                @click="closeEditModal"
                type="button"
                class="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-grey border border-stone-300 rounded-md transition-colors"
              >
                {{ t('prestataire.events.manager.form.cancel') }}
              </button>
              <button
                @click="saveLocation"
                type="button"
                :disabled="savingEdit || uploadingImage"
                class="px-5 py-2.5 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold rounded-md shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="savingEdit">
                  <i class="fas fa-spinner fa-spin mr-2"></i> {{ t('prestataire.locations.edit_modal.saving') }}
                </span>
                <span v-else>{{ t('prestataire.profile.messages.save') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { locationService } from '@/services/locationService'
import { LocationMock } from '@/mocks/locations'
import MedievalButton from '@/components/ui/MedievalButton.vue'
import BackToMapButton from '@/components/shared/BackToMapButton.vue'
import Editor from '@/components/editor/Editor.vue'
import { uploadService } from '@/services/uploadService'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const loading = ref(false)
const allLocations = ref<LocationMock[]>([])
const showEditModal = ref(false)
const savingEdit = ref(false)
const uploadingImage = ref(false)
const editError = ref('')
const editingLocationId = ref<number | null>(null)
const editorRef = ref<InstanceType<typeof Editor> | null>(null)
const editForm = ref({
  name: '',
  description: '',
  banner_image: ''
})

onMounted(async () => {
  loading.value = true
  try {
    allLocations.value = await locationService.getAllLocations()
  } catch (error) {
    console.error('Failed to fetch locations:', error)
  } finally {
    loading.value = false
  }
})

const locations = computed(() => {
  const userId = authStore.user?.id
  if (!userId) return []
  return allLocations.value.filter(loc => loc.id_prestataire === userId)
})

function manageEvents(locationId: number) {
  router.push(`/prestataire/location/${locationId}/events`)
}

function manageShop(locationId: number) {
  router.push(`/prestataire/products?locationId=${locationId}`)
}

function addQuiz(locationId: number) {
  router.push({
    path: '/quiz/create',
    query: { locationId: locationId }
  })
}

function openEditModal(location: LocationMock) {
  editingLocationId.value = location.id
  editForm.value = {
    name: location.name || '',
    description: location.description || '',
    banner_image: location.banner_image || ''
  }
  editError.value = ''
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingLocationId.value = null
  editError.value = ''
}

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  try {
    uploadingImage.value = true
    const response = await uploadService.uploadImage(file)
    editForm.value.banner_image = response.url
  } catch (error) {
    editError.value = error instanceof Error ? error.message : t('prestataire.locations.errors.upload')
  } finally {
    uploadingImage.value = false
    input.value = ''
  }
}

async function saveLocation() {
  if (!editingLocationId.value) return

  const trimmedName = editForm.value.name.trim()
  const description = editorRef.value?.getHTML() || editForm.value.description

  if (!trimmedName) {
    editError.value = t('prestataire.locations.errors.name_required')
    return
  }

  try {
    savingEdit.value = true
    editError.value = ''

    const updatedLocation = await locationService.updateLocation({
      id: editingLocationId.value,
      name: trimmedName,
      description,
      banner_image: editForm.value.banner_image,
    })

    const index = allLocations.value.findIndex((loc) => loc.id === updatedLocation.id)
    if (index !== -1) {
      allLocations.value[index] = { ...allLocations.value[index], ...updatedLocation }
    }

    closeEditModal()
  } catch (error) {
    editError.value = error instanceof Error ? error.message : t('prestataire.locations.errors.update')
  } finally {
    savingEdit.value = false
  }
}
</script>
