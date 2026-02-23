<template>
  <div class="min-h-screen bg-parchment pt-32 pb-16">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2">
          {{ $t('qrcode.scan.title') }}
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
        <p class="text-base font-body text-stone-grey">{{ $t('qrcode.scan.description') }}</p>
      </div>

      <!-- Camera Permission Error -->
      <div v-if="cameraError && !scanResult" class="bg-white/60 backdrop-blur-sm rounded-lg border border-red-300 p-8 text-center shadow-sm">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-lg font-medieval text-iron-black mb-2">{{ $t('qrcode.scan.cameraError') }}</p>
        <button
          @click="initCamera"
          class="px-6 py-2 bg-antique-bronze hover:brightness-110 text-white font-body font-semibold rounded-md shadow-md transition-all mt-4"
        >
          {{ $t('qrcode.scan.retry') }}
        </button>
      </div>

      <!-- Scanner -->
      <div v-else-if="!scanResult" class="space-y-6">
        <!-- Video Scanner -->
        <div class="bg-white/60 backdrop-blur-sm rounded-lg border border-antique-bronze/20 p-6 shadow-sm">
          <div class="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden bg-iron-black/10">
            <div v-if="!cameraRequested" class="absolute inset-0 flex flex-col items-center justify-center bg-iron-black/80 z-10 w-full h-full">
              <button
                @click="requestCamera"
                class="px-6 py-3 bg-antique-bronze hover:brightness-110 text-white font-body font-semibold rounded-md shadow-md transition-all flex flex-col items-center gap-2"
              >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ $t('qrcode.scan.requestCamera') }}
              </button>
            </div>
            <video v-else ref="videoElement" class="w-full h-full object-cover" autoplay playsinline></video>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-3/4 h-3/4 border-2 border-antique-bronze rounded-lg relative">
                <div class="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-antique-bronze rounded-tl-lg"></div>
                <div class="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-antique-bronze rounded-tr-lg"></div>
                <div class="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-antique-bronze rounded-bl-lg"></div>
                <div class="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-antique-bronze rounded-br-lg"></div>
              </div>
            </div>
          </div>
          <p v-if="cameraRequested" class="text-center text-sm text-stone-grey mt-4">{{ $t('qrcode.scan.hint') }}</p>
        </div>
      </div>

      <!-- Scan Result -->
      <div v-else class="space-y-6">
        <div v-if="scanResult.success" class="bg-white/60 backdrop-blur-sm rounded-lg border border-green-300 p-8 text-center shadow-sm">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-xl font-medieval font-bold text-iron-black mb-2">{{ $t('qrcode.scan.success') }}</h2>
          
          <div v-if="scanResult.data" class="mt-4 text-left p-4 bg-white/40 rounded-md border border-antique-bronze/20 overflow-x-auto">
            <h3 class="text-sm font-bold text-stone-grey uppercase tracking-wide mb-2">{{ $t('qrcode.scan.receivedData') }}</h3>
            <pre class="text-sm font-body text-iron-black">{{ JSON.stringify(scanResult.data, null, 2) }}</pre>
          </div>
          <button
            @click="resetScanner"
            class="mt-6 px-6 py-2 bg-antique-bronze hover:brightness-110 text-white font-body font-semibold rounded-md shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {{ $t('qrcode.scan.scanAgain') }}
          </button>
        </div>

        <div v-else class="bg-white/60 backdrop-blur-sm rounded-lg border border-red-300 p-8 text-center shadow-sm">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="text-lg font-medieval text-iron-black mb-2">{{ $t('qrcode.scan.failed') }}</h2>
          <p class="text-sm text-stone-grey mb-6">{{ scanResult.error }}</p>
          <button
            @click="resetScanner"
            class="px-6 py-2 bg-antique-bronze hover:brightness-110 text-white font-body font-semibold rounded-md shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {{ $t('qrcode.scan.scanAgain') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { qrcodeService, type ValidateQRResult } from '@/services/qrcodeService'
import jsQR from 'jsqr'

const videoElement = ref<HTMLVideoElement | null>(null)
const cameraRequested = ref(false)
const cameraError = ref(false)
const scanResult = ref<ValidateQRResult | null>(null)
let stream: MediaStream | null = null
let animationFrame: number | null = null

function requestCamera() {
  cameraRequested.value = true
  initCamera()
}

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

async function handleQRDetected(token: string) {
  stopCamera()

  try {
    scanResult.value = await qrcodeService.validate({ token })
  } catch (error) {
    console.error('Validation error:', error)
    scanResult.value = { success: false, error: 'Validation failed' }
  }
}

function stopCamera() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
}

function resetScanner() {
  scanResult.value = null
  initCamera()
}

onMounted(() => {
  // Wait for user to explicitly request camera
})

onUnmounted(() => {
  stopCamera()
})
</script>
