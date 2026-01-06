<template>
  <div class="min-h-screen bg-parchment py-8 font-body text-stone-grey">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8 text-center">
        <MedievalSectionTitle>{{ t('quest.title') }}</MedievalSectionTitle>
        <p class="text-lg text-stone-grey -mt-4">{{ t('quest.subtitle') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
        <i class="fas fa-hourglass-half text-6xl text-antique-bronze/40 animate-pulse mb-4 block"></i>
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">{{ t('quest.loading') }}</h3>
      </div>

      <!-- Empty State -->
      <div v-else-if="quests.length === 0" class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
        <i class="fas fa-scroll text-6xl text-antique-bronze/30 mb-4 block"></i>
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">{{ t('quest.empty.message') }}</h3>
        <p class="text-stone-grey mb-6">{{ t('quest.empty.description') }}</p>
        <MedievalButton href="/map">
          <i class="fas fa-map-marked-alt mr-2"></i>
          {{ t('quest.empty.explore') }}
        </MedievalButton>
      </div>

      <!-- Quests Content -->
      <div v-else class="space-y-12">
        
        <!-- ============================================ -->
        <!-- SECTION: IN PROGRESS QUESTS -->
        <!-- ============================================ -->
        <section v-if="inProgressQuests.length > 0">
          <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center gap-3">
            <i class="fas fa-hourglass-half text-antique-bronze"></i>
            {{ t('quest.sections.in_progress') }}
            <span class="text-sm font-body text-stone-grey font-normal">({{ inProgressQuests.length }})</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="userQuest in inProgressQuests" 
              :key="userQuest.id_quest" 
              class="relative group h-full"
            >
              <!-- Card Background -->
              <div class="absolute inset-0 bg-parchment rounded-sm shadow-md transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-antique-bronze/30"></div>
              
              <!-- Decorative Corners -->
              <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
              <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
              <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>
              <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-antique-bronze z-10 transition-transform duration-300 group-hover:-translate-y-2"></div>

              <!-- Content Container -->
              <div class="relative p-6 flex flex-col h-full z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
                <!-- Header: Location & XP -->
                <div class="flex items-center justify-center gap-3 mb-4 text-sm">
                  <span class="h-px flex-1 bg-antique-bronze/30"></span>
                  <span class="font-bold text-antique-bronze flex items-center gap-1">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ userQuest.quest.location?.name || t('quest.item.unknown_location') }}
                  </span>
                  <span class="h-px flex-1 bg-antique-bronze/30"></span>
                </div>

                <!-- Quest Title -->
                <h3 class="text-2xl font-medieval font-bold text-iron-black mb-4 text-center group-hover:text-antique-bronze transition-colors duration-300">
                  {{ userQuest.quest.title }}
                </h3>

                <!-- Description -->
                <p class="text-stone-grey leading-relaxed font-body mb-5 line-clamp-3 flex-grow text-center">
                  {{ userQuest.quest.description }}
                </p>

                <!-- XP Reward -->
                <div class="flex justify-center mb-4">
                  <span class="px-4 py-1.5 bg-antique-bronze/10 rounded-sm text-antique-bronze font-medieval font-bold text-sm border border-antique-bronze/20">
                    <i class="fas fa-star mr-1"></i>
                    {{ userQuest.quest.xp_reward }} XP
                  </span>
                </div>

                <!-- Actions -->
                <div class="flex flex-wrap justify-center gap-2 pt-4 border-t border-antique-bronze/20 mt-auto">
                  <!-- Scan Button - Green -->
                  <MedievalButton 
                    variant="success"
                    small
                    @click="scanQuest(userQuest.id_quest)"
                  >
                    <i class="fas fa-qrcode mr-1"></i>
                    {{ t('quest.actions.scan') }}
                  </MedievalButton>

                  <!-- Cancel Button -->
                  <MedievalButton 
                    variant="secondary"
                    small
                    @click="cancelQuest(userQuest.id_quest)"
                  >
                    <i class="fas fa-times mr-1"></i>
                    {{ t('quest.actions.cancel') }}
                  </MedievalButton>

                  <!-- Debug Complete Button -->
                  <button 
                    v-if="isDebug"
                    @click="completeQuest(userQuest.id_quest)"
                    class="text-stone-400 hover:text-stone-600 px-2 py-1 text-xs transition-colors flex items-center gap-1 opacity-50 hover:opacity-100"
                    title="Debug: Terminer la quête instantanément"
                  >
                    <i class="fas fa-bug"></i>
                    {{ t('quest.debug.finish') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================ -->
        <!-- SECTION: COMPLETED QUESTS -->
        <!-- ============================================ -->
        <section v-if="completedQuests.length > 0">
          <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center gap-3">
            <i class="fas fa-check-circle text-emerald-700"></i>
            {{ t('quest.sections.completed') }}
            <span class="text-sm font-body text-stone-grey font-normal">({{ completedQuests.length }})</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="userQuest in completedQuests" 
              :key="userQuest.id_quest" 
              class="relative group h-full cursor-default"
            >
              <!-- Card Background - Parchment with warm border -->
              <div class="absolute inset-0 bg-parchment rounded-sm shadow-md border border-emerald-800/30"></div>
              
              <!-- Decorative Corners - Warm green accent -->
              <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-700 z-10"></div>
              <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-700 z-10"></div>
              <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-700 z-10"></div>
              <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-700 z-10"></div>

              <!-- Checkmark Overlay - Semi-transparent, disappears on hover -->
              <div class="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/15 rounded-sm transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                <div class="text-center">
                  <i class="fas fa-check-circle text-7xl text-emerald-700 drop-shadow-lg"></i>
                </div>
              </div>

              <!-- Content Container -->
              <div class="relative p-6 flex flex-col h-full z-10">
                <!-- Header: Location -->
                <div class="flex items-center justify-center gap-3 mb-4 text-sm">
                  <span class="h-px flex-1 bg-emerald-700/30"></span>
                  <span class="font-bold text-emerald-700 flex items-center gap-1">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ userQuest.quest.location?.name || t('quest.item.unknown_location') }}
                  </span>
                  <span class="h-px flex-1 bg-emerald-700/30"></span>
                </div>

                <!-- Quest Title -->
                <h3 class="text-2xl font-medieval font-bold text-iron-black mb-4 text-center">
                  {{ userQuest.quest.title }}
                </h3>

                <!-- Description -->
                <p class="text-stone-grey leading-relaxed font-body mb-5 line-clamp-3 flex-grow text-center">
                  {{ userQuest.quest.description }}
                </p>

                <!-- XP Reward -->
                <div class="flex justify-center mb-4">
                  <span class="px-4 py-1.5 bg-emerald-700/10 rounded-sm text-emerald-700 font-medieval font-bold text-sm border border-emerald-700/20">
                    <i class="fas fa-star mr-1"></i>
                    +{{ userQuest.quest.xp_reward }} XP
                  </span>
                </div>

                <!-- Completed info -->
                <div class="flex justify-center items-center gap-2 pt-4 border-t border-emerald-800/30 mt-auto text-emerald-700 font-medieval">
                  <i class="fas fa-trophy"></i>
                  {{ t('quest.completed_message') }}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>

    <!-- ============================================ -->
    <!-- QR SCANNER MODAL -->
    <!-- ============================================ -->
    <Teleport to="body">
      <div v-if="showScanner" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="bg-parchment rounded-lg shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-antique-bronze">
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-antique-bronze/10 border-b border-antique-bronze/20 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-medieval font-bold text-iron-black flex items-center gap-2">
                <i class="fas fa-qrcode text-antique-bronze"></i>
                {{ t('quest.scan.title') }}
              </h2>
              <p class="text-sm text-stone-grey mt-1">{{ currentQuestTitle }}</p>
            </div>
            <button 
              @click="closeScanner"
              class="text-stone-grey hover:text-iron-black transition-colors"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="p-6">
            <!-- Camera Error -->
            <div v-if="cameraError && !scanResult" class="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
              <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-video-slash text-2xl text-red-500"></i>
              </div>
              <p class="font-medieval text-iron-black mb-2">{{ t('quest.scan.camera_error') }}</p>
              <p class="text-sm text-stone-grey mb-4">{{ t('quest.scan.camera_error_hint') }}</p>
              <MedievalButton @click="initCamera" small>
                <i class="fas fa-redo mr-2"></i>
                {{ t('quest.scan.retry') }}
              </MedievalButton>
            </div>

            <!-- Scanner Active -->
            <div v-else-if="!scanResult" class="space-y-5">
              <!-- Video Scanner -->
              <div class="relative w-full aspect-square rounded-lg overflow-hidden bg-iron-black/10 border border-antique-bronze/30">
                <video ref="videoElement" class="w-full h-full object-cover" autoplay playsinline></video>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="w-3/4 h-3/4 border-2 border-antique-bronze rounded-lg relative">
                    <div class="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-antique-bronze rounded-tl-lg"></div>
                    <div class="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-antique-bronze rounded-tr-lg"></div>
                    <div class="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-antique-bronze rounded-bl-lg"></div>
                    <div class="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-antique-bronze rounded-br-lg"></div>
                  </div>
                </div>
              </div>
              <p class="text-center text-sm text-stone-grey">{{ t('quest.scan.hint') }}</p>

              <!-- Manual Input -->
              <div class="border-t border-antique-bronze/20 pt-5">
                <p class="text-sm text-stone-grey text-center mb-3">{{ t('quest.scan.or_manual') }}</p>
                <div class="flex gap-2">
                  <input
                    v-model="manualToken"
                    type="text"
                    :placeholder="t('quest.scan.enter_code')"
                    class="flex-1 px-4 py-2 border border-antique-bronze/30 rounded-md bg-white/50 text-iron-black font-body focus:outline-none focus:ring-2 focus:ring-antique-bronze/50"
                    @keyup.enter="validateManualToken"
                  />
                  <MedievalButton 
                    @click="validateManualToken" 
                    :disabled="!manualToken.trim()"
                    small
                  >
                    {{ t('quest.scan.validate') }}
                  </MedievalButton>
                </div>
              </div>
            </div>

            <!-- Scan Result -->
            <div v-else class="space-y-5">
              <!-- Error -->
              <div v-if="!scanResult.success" class="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
                <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-times-circle text-3xl text-red-500"></i>
                </div>
                <p class="font-medieval text-iron-black mb-2">{{ t('quest.scan.failed') }}</p>
                <p class="text-sm text-stone-grey mb-5">{{ scanResult.error }}</p>
                <MedievalButton @click="resetScanner" small>
                  <i class="fas fa-redo mr-2"></i>
                  {{ t('quest.scan.try_again') }}
                </MedievalButton>
              </div>

              <!-- Success -->
              <div v-else class="bg-emerald-50 rounded-lg border border-emerald-200 p-6 text-center">
                <div class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-check-circle text-3xl text-emerald-600"></i>
                </div>
                <p class="font-medieval text-iron-black text-xl mb-2">{{ t('quest.scan.success') }}</p>
                <p class="text-sm text-emerald-700 mb-5">{{ scanResult.message }}</p>
                <MedievalButton @click="closeScanner" variant="success" small>
                  <i class="fas fa-check mr-2"></i>
                  {{ t('quest.scan.close') }}
                </MedievalButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { questService } from '@/services/questService';
import { useI18n } from 'vue-i18n';
import MedievalButton from '@/components/ui/MedievalButton.vue';
import MedievalSectionTitle from '@/components/ui/MedievalSectionTitle.vue';
import jsQR from 'jsqr';

const { t } = useI18n();
const quests = ref<any[]>([]);
const loading = ref(true);
const isDebug = import.meta.env.DEV;

// QR Scanner state
const showScanner = ref(false);
const currentQuestId = ref<number | null>(null);
const currentQuestTitle = ref('');
const videoElement = ref<HTMLVideoElement | null>(null);
const cameraError = ref(false);
const manualToken = ref('');
const scanResult = ref<{ success: boolean; message?: string; error?: string } | null>(null);
let stream: MediaStream | null = null;
let animationFrame: number | null = null;

// Separate quests by status
const inProgressQuests = computed(() => quests.value.filter(q => q.status === 'accepted'));
const completedQuests = computed(() => quests.value.filter(q => q.status === 'completed'));

const loadQuests = async () => {
  try {
    loading.value = true;
    quests.value = await questService.getUserQuests();
  } catch (error) {
    console.error('Failed to load user quests:', error);
  } finally {
    loading.value = false;
  }
};

const completeQuest = async (questId: number) => {
  if (!confirm(t('quest.debug.confirm_finish'))) return;
  
  try {
    await questService.completeQuest(questId);
    await loadQuests();
  } catch (error) {
    console.error('Failed to complete quest:', error);
    alert(t('quest.debug.error_finish'));
  }
};

// ========== QR Scanner Functions ==========

const scanQuest = (questId: number) => {
  const userQuest = quests.value.find(q => q.id_quest === questId);
  currentQuestId.value = questId;
  currentQuestTitle.value = userQuest?.quest?.title || 'Quête';
  showScanner.value = true;
  scanResult.value = null;
  manualToken.value = '';
  cameraError.value = false;
  
  // Attendre que le DOM soit mis à jour
  setTimeout(() => {
    initCamera();
  }, 100);
};

const closeScanner = () => {
  stopCamera();
  showScanner.value = false;
  currentQuestId.value = null;
  currentQuestTitle.value = '';
  scanResult.value = null;
  manualToken.value = '';
};

async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream;
      videoElement.value.onloadedmetadata = () => {
        startScanning();
      };
    }
  } catch (error) {
    console.error('Camera access denied:', error);
    cameraError.value = true;
  }
}

function startScanning() {
  const video = videoElement.value;
  if (!video) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  function tick() {
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrame = requestAnimationFrame(tick);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (imageData) {
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        handleQRDetected(code.data);
        return;
      }
    }

    animationFrame = requestAnimationFrame(tick);
  }

  tick();
}

function stopCamera() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

async function handleQRDetected(token: string) {
  stopCamera();
  await validateQuestWithToken(token);
}

async function validateManualToken() {
  if (!manualToken.value.trim()) return;
  stopCamera();
  await validateQuestWithToken(manualToken.value.trim());
}

async function validateQuestWithToken(token: string) {
  if (!currentQuestId.value) return;

  try {
    const result = await questService.validateQuestByQR(currentQuestId.value, token);
    scanResult.value = result;
    
    if (result.success) {
      // Recharger les quêtes après succès
      await loadQuests();
    }
  } catch (error) {
    console.error('QR validation error:', error);
    scanResult.value = { success: false, error: 'Erreur de validation du QR code' };
  }
}

function resetScanner() {
  scanResult.value = null;
  manualToken.value = '';
  cameraError.value = false;
  initCamera();
}

const cancelQuest = async (questId: number) => {
  if (!confirm(t('quest.actions.confirm_cancel'))) return;
  
  try {
    await questService.cancelQuest(questId);
    await loadQuests();
  } catch (error) {
    console.error('Failed to cancel quest:', error);
    alert(t('quest.actions.error_cancel'));
  }
};

onMounted(() => {
  loadQuests();
});

onUnmounted(() => {
  stopCamera();
});
</script>
