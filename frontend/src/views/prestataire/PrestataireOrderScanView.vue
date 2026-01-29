<template>
  <div class="min-h-screen bg-parchment pt-32 pb-16">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
          {{ t('prestataire.order_scan.title') }}
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
        <p class="text-base font-body text-stone-grey">{{ t('prestataire.order_scan.description') }}</p>
      </div>

      <!-- Camera Permission Error -->
      <div v-if="cameraError && !scanResult" class="bg-white/60 backdrop-blur-sm rounded-lg border border-red-300 p-8 text-center shadow-sm">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-lg font-medieval text-iron-black mb-2">{{ t('prestataire.order_scan.camera_error') }}</p>
        <p class="text-sm text-stone-grey mb-4">{{ t('prestataire.order_scan.camera_error_hint') }}</p>
        <button
          @click="initCamera"
          class="px-6 py-2 bg-antique-bronze hover:brightness-110 text-white font-body font-semibold rounded-md shadow-md transition-all"
        >
          {{ t('prestataire.order_scan.retry') }}
        </button>
      </div>

      <!-- Scanner -->
      <div v-else-if="!scanResult" class="space-y-6">
        <!-- Video Scanner -->
        <div class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 p-6 shadow-sm">
          <div class="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden bg-iron-black/10">
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
          <p class="text-center text-sm text-stone-grey mt-4">{{ t('prestataire.order_scan.scanning_hint') }}</p>
        </div>

        <!-- Manual Input -->
        <div class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 p-6 shadow-sm">
          <p class="text-sm text-stone-grey text-center mb-4">{{ t('prestataire.order_scan.or_manual') }}</p>
          <div class="flex gap-3">
            <input
              v-model="manualToken"
              type="text"
              :placeholder="t('prestataire.order_scan.enter_token')"
              class="flex-1 px-4 py-2 border border-antique-bronze/30 rounded-md bg-white/50 text-iron-black font-body focus:outline-none focus:ring-2 focus:ring-antique-bronze/50"
              @keyup.enter="validateManualToken"
            />
            <button
              @click="validateManualToken"
              :disabled="!manualToken.trim()"
              :class="[
                'px-6 py-2 rounded-md font-body font-semibold shadow-md transition-all',
                manualToken.trim()
                  ? 'bg-antique-bronze hover:brightness-110 text-white'
                  : 'bg-stone-grey/20 text-stone-grey cursor-not-allowed'
              ]"
            >
              {{ t('prestataire.order_scan.validate') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Scan Result -->
      <div v-else class="space-y-6">
        <!-- Error Result -->
        <div v-if="!scanResult.success" class="bg-white/60 backdrop-blur-sm rounded-lg border border-red-300 p-8 text-center shadow-sm">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p class="text-lg font-medieval text-iron-black mb-2">{{ t('prestataire.order_scan.invalid_code') }}</p>
          <p class="text-sm text-stone-grey mb-6">{{ scanResult.error || t('prestataire.order_scan.order_not_found') }}</p>
          <button
            @click="resetScanner"
            class="px-6 py-2 bg-antique-bronze hover:brightness-110 text-white font-body font-semibold rounded-md shadow-md transition-all"
          >
            {{ t('prestataire.order_scan.scan_again') }}
          </button>
        </div>

        <!-- Success Result with Order Details -->
        <div v-else-if="orderDetails" class="space-y-6">
          <!-- Order Header -->
          <div class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 overflow-hidden shadow-sm">
            <div class="px-6 py-4 bg-antique-bronze/10 border-b border-antique-bronze/20 flex items-center justify-between">
              <div>
                <h2 class="text-xl font-medieval font-bold text-iron-black">
                  {{ t('prestataire.order_scan.order_number', { id: orderDetails.id }) }}
                </h2>
                <p class="text-sm text-stone-grey mt-1">
                  {{ formatDate(orderDetails.date_commande) }}
                </p>
              </div>
              <span
                :class="[
                  'px-3 py-1 text-xs font-bold font-body rounded-full border flex items-center gap-1',
                  orderDetails.etat_commande === EtatCommande.COLLECTED
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                ]"
              >
                <svg v-if="orderDetails.etat_commande === EtatCommande.COLLECTED" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ orderDetails.etat_commande === EtatCommande.COLLECTED 
                  ? t('prestataire.order_scan.status_collected') 
                  : t('prestataire.order_scan.status_paid') 
                }}
              </span>
            </div>

            <!-- Customer Info -->
            <div class="px-6 py-4 border-b border-antique-bronze/10">
              <h3 class="text-sm font-bold text-stone-grey uppercase tracking-wide mb-2">
                {{ t('prestataire.order_scan.customer') }}
              </h3>
              <p class="text-lg font-medieval text-iron-black">{{ customerName }}</p>
            </div>

            <!-- Products List -->
            <div class="px-6 py-4">
              <h3 class="text-sm font-bold text-stone-grey uppercase tracking-wide mb-3">
                {{ t('prestataire.order_scan.products') }}
              </h3>
              <div class="space-y-3">
                <div
                  v-for="item in orderItems"
                  :key="item.id_product"
                  class="flex justify-between items-center py-2 border-b border-antique-bronze/10 last:border-0"
                >
                  <div class="flex-1">
                    <p class="font-body font-medium text-iron-black">{{ item.productName }}</p>
                    <p class="text-sm text-stone-grey">
                      {{ item.quantite }} × {{ item.price.toFixed(2) }} gold
                    </p>
                  </div>
                  <p class="font-medieval font-bold text-antique-bronze">
                    {{ (item.quantite * item.price).toFixed(2) }} gold
                  </p>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="px-6 py-4 bg-antique-bronze/5 border-t border-antique-bronze/20 flex justify-between items-center">
              <p class="text-lg font-medieval font-bold text-iron-black">
                {{ t('prestataire.order_scan.total') }}
              </p>
              <p class="text-2xl font-medieval font-bold text-antique-bronze">
                {{ orderDetails.total_price.toFixed(2) }} gold
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              v-if="orderDetails.etat_commande === EtatCommande.PAID"
              @click="markAsCollected"
              :disabled="isProcessing"
              class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-body font-bold rounded-md shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <svg v-if="!isProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isProcessing ? t('prestataire.order_scan.processing') : t('prestataire.order_scan.validate_collection') }}
            </button>

            <div v-else class="flex-1 py-3 bg-green-100 text-green-800 font-body font-bold rounded-md text-center border border-green-200">
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ t('prestataire.order_scan.already_collected') }}
              </span>
            </div>

            <button
              @click="resetScanner"
              class="flex-1 py-3 bg-white/60 hover:bg-white/80 text-iron-black font-body font-semibold rounded-md border border-antique-bronze/30 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              {{ t('prestataire.order_scan.scan_again') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Back Link -->
      <div class="mt-8 text-center">
        <router-link
          to="/prestataire"
          class="inline-flex items-center text-antique-bronze hover:text-iron-black font-body font-semibold transition-colors gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ t('prestataire.order_scan.back_to_dashboard') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { COMMANDES, EtatCommande, type CommandeMock } from '@/mocks/commande'
import { LIGNES_COMMANDE } from '@/mocks/ligneCommande'
import { productService } from '@/services/productService'
import { USERS } from '@/mocks/users'
import jsQR from 'jsqr'

const { t } = useI18n()

const videoElement = ref<HTMLVideoElement | null>(null)
const cameraError = ref(false)
const scanResult = ref<{ success: boolean; error?: string } | null>(null)
const manualToken = ref('')
const orderDetails = ref<CommandeMock | null>(null)
const isProcessing = ref(false)

let stream: MediaStream | null = null
let animationFrame: number | null = null

// Get customer name
const customerName = computed(() => {
  if (!orderDetails.value) return ''
  const user = USERS.find((u) => u.id === orderDetails.value!.id_user)
  return user ? `${user.firstname} ${user.lastname}` : `Client #${orderDetails.value.id_user}`
})

// Get order items with product names
const orderItems = computed(() => {
  if (!orderDetails.value) return []
  const lignes = LIGNES_COMMANDE.filter((l) => l.id_commande === orderDetails.value!.id)
  const allProducts = productService.getProductsForBoutique()
  return lignes.map((ligne) => {
    const product = allProducts.find((p) => p.id === ligne.id_product)
    return {
      id_product: ligne.id_product,
      productName: product?.name || `Produit #${ligne.id_product}`,
      quantite: ligne.quantite,
      price: ligne.price,
    }
  })
})

// Format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date))
}

// Initialize camera
async function initCamera() {
  cameraError.value = false

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    })

    if (videoElement.value) {
      videoElement.value.srcObject = stream
      videoElement.value.onloadedmetadata = () => {
        videoElement.value?.play()
        startScanning()
      }
    }
  } catch (error) {
    console.error('Camera access denied:', error)
    cameraError.value = true
  }
}

// Start scanning for QR codes
function startScanning() {
  const video = videoElement.value
  if (!video) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  function tick() {
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrame = requestAnimationFrame(tick)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
    if (imageData) {
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        handleQRDetected(code.data)
        return
      }
    }

    animationFrame = requestAnimationFrame(tick)
  }

  tick()
}

// Handle QR code detection
function handleQRDetected(token: string) {
  stopCamera()
  findOrderByToken(token)
}

// Validate manual token input
function validateManualToken() {
  if (!manualToken.value.trim()) return
  stopCamera()
  findOrderByToken(manualToken.value.trim())
}

// Find order by QR token
function findOrderByToken(token: string) {
  const order = COMMANDES.find((cmd) => cmd.qrToken === token)

  if (order) {
    scanResult.value = { success: true }
    orderDetails.value = order
  } else {
    scanResult.value = { success: false, error: t('prestataire.order_scan.order_not_found') }
    orderDetails.value = null
  }
}

// Mark order as collected
async function markAsCollected() {
  if (!orderDetails.value || orderDetails.value.etat_commande !== EtatCommande.PAID) return

  isProcessing.value = true

  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Update order status
    orderDetails.value.etat_commande = EtatCommande.COLLECTED
    orderDetails.value.date_collect = new Date()
  } catch (error) {
    console.error('Error marking order as collected:', error)
  } finally {
    isProcessing.value = false
  }
}

// Stop camera stream
function stopCamera() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
}

// Reset scanner to scan another code
function resetScanner() {
  scanResult.value = null
  orderDetails.value = null
  manualToken.value = ''
  initCamera()
}

onMounted(() => {
  initCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>
