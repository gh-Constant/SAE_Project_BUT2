<template>
  <div class="qr-scan-view">
    <div class="scan-container">
      <h1 class="title">{{ $t('qrcode.scan.title') }}</h1>
      <p class="description">{{ $t('qrcode.scan.description') }}</p>

      <!-- Camera Permission Error -->
      <div v-if="cameraError" class="error-message">
        <span class="error-icon"></span>
        <p>{{ $t('qrcode.scan.cameraError') }}</p>
        <button class="btn-retry" @click="initCamera">
          {{ $t('qrcode.scan.retry') }}
        </button>
      </div>

      <!-- Scanner -->
      <div v-else-if="!scanResult" class="scanner-wrapper">
        <div class="scanner-frame">
          <video ref="videoElement" class="scanner-video" autoplay playsinline></video>
          <div class="scanner-overlay">
            <div class="scanner-corners"></div>
          </div>
        </div>

        <p class="scanning-hint">{{ $t('qrcode.scan.hint') }}</p>

        <!-- Manual Input -->
        <div class="manual-input">
          <p class="or-text">{{ $t('qrcode.scan.or') }}</p>
          <div class="input-group">
            <input
              v-model="manualToken"
              type="text"
              :placeholder="$t('qrcode.scan.enterToken')"
              class="token-input"
              @keyup.enter="validateManualToken"
            />
            <button class="btn-validate" @click="validateManualToken" :disabled="!manualToken">
              {{ $t('qrcode.scan.validate') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Scan Result -->
      <div v-else class="scan-result">
        <div v-if="scanResult.success" class="result-success">
          <h2>{{ $t('qrcode.scan.success') }}</h2>
          
          <div v-if="scanResult.data" class="result-data">
            <h3>{{ $t('qrcode.scan.receivedData') }}</h3>
            <pre class="data-display">{{ JSON.stringify(scanResult.data, null, 2) }}</pre>
          </div>
        </div>

        <div v-else class="result-error">
          <h2>{{ $t('qrcode.scan.failed') }}</h2>
          <p class="error-detail">{{ scanResult.error }}</p>
        </div>

        <button class="btn-scan-again" @click="resetScanner">
          {{ $t('qrcode.scan.scanAgain') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { qrcodeService, type ValidateQRResult } from '@/services/qrcodeService'
import jsQR from 'jsqr'

const videoElement = ref<HTMLVideoElement | null>(null)
const cameraError = ref(false)
const scanResult = ref<ValidateQRResult | null>(null)
const manualToken = ref('')
let stream: MediaStream | null = null
let animationFrame: number | null = null

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

async function validateManualToken() {
  if (!manualToken.value.trim()) return

  stopCamera()

  try {
    scanResult.value = await qrcodeService.validate({ token: manualToken.value.trim() })
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

<style scoped>
.qr-scan-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.scan-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
}

.error-message {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 3rem;
}

.error-message p {
  color: rgba(255, 255, 255, 0.7);
}

.btn-retry {
  background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-retry:hover {
  transform: translateY(-2px);
}

.scanner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.scanner-frame {
  position: relative;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-corners {
  width: 70%;
  height: 70%;
  border: 3px solid transparent;
  position: relative;
}

.scanner-corners::before,
.scanner-corners::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: #e94560;
  border-style: solid;
}

.scanner-corners::before {
  top: 0;
  left: 0;
  border-width: 3px 0 0 3px;
}

.scanner-corners::after {
  top: 0;
  right: 0;
  border-width: 3px 3px 0 0;
}

.scanning-hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.manual-input {
  width: 100%;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.or-text {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.token-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.875rem;
}

.token-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.token-input:focus {
  outline: none;
  border-color: #e94560;
}

.btn-validate {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-validate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scan-result {
  padding: 2rem 0;
}

.result-success,
.result-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-icon {
  font-size: 4rem;
  animation: pop 0.3s ease-out;
}

.error-icon-large {
  font-size: 4rem;
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.result-success h2 {
  color: #4caf50;
}

.result-error h2 {
  color: #f44336;
}

.error-detail {
  color: rgba(255, 255, 255, 0.6);
}

.result-data {
  width: 100%;
  margin-top: 1rem;
  text-align: left;
}

.result-data h3 {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.data-display {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 12px;
  color: #4caf50;
  font-size: 0.8rem;
  overflow-x: auto;
  max-height: 200px;
}

.btn-scan-again {
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-scan-again:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
