<template>
  <div class="qr-generate-view">
    <div class="qr-container">
      <h1 class="title">{{ $t('qrcode.generate.title') }}</h1>
      <p class="description">{{ $t('qrcode.generate.description') }}</p>

      <!-- Generate Button -->
      <div v-if="!qrSession" class="generate-section">
        <button class="btn-generate" @click="generateQR" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>{{ $t('qrcode.generate.button') }}</span>
        </button>
      </div>

      <!-- QR Code Display -->
      <div v-else class="qr-display">
        <div class="qr-code-wrapper">
          <canvas ref="qrCanvas" class="qr-canvas"></canvas>
        </div>

        <div class="qr-info">
          <div class="status-badge" :class="statusClass">
            {{ $t(`qrcode.status.${qrSession.status.toLowerCase()}`) }}
          </div>

          <p v-if="qrSession.status === 'SCANNED'" class="scanned-message">
            ✅ {{ $t('qrcode.generate.scanned') }}
          </p>
        </div>

        <div class="actions">
          <button class="btn-secondary" @click="copyToken">
            {{ $t('qrcode.generate.copyToken') }}
          </button>
          <button class="btn-primary" @click="generateNew">
            {{ $t('qrcode.generate.newQr') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { qrcodeService, type QRSession } from '@/services/qrcodeService'
import QRCode from 'qrcode'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const qrSession = ref<QRSession | null>(null)
const isLoading = ref(false)
const qrCanvas = ref<HTMLCanvasElement | null>(null)
let pollingInterval: number | null = null

const statusClass = computed(() => {
  if (!qrSession.value) return ''
  return {
    PENDING: 'status-pending',
    SCANNED: 'status-scanned',
    USED: 'status-used',
  }[qrSession.value.status]
})

async function generateQR() {
  isLoading.value = true
  try {
    // Example data payload - customize based on your needs
    const qrData = {
      userId: authStore.user?.id,
      // Add any additional data you want to encode
    }

    qrSession.value = await qrcodeService.generate({
      data: qrData,
      userId: authStore.user?.id,
    })

    // Start polling for status updates
    startPolling()
  } catch (error) {
    console.error('Failed to generate QR:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for qrSession changes to render QR code
watch(
  () => qrSession.value?.token,
  async (token) => {
    if (token && qrCanvas.value) {
      await renderQRCode(token)
    }
  }
)

async function renderQRCode(data: string) {
  if (!qrCanvas.value) return

  try {
    await QRCode.toCanvas(qrCanvas.value, data, {
      width: 250,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
    })
  } catch (error) {
    console.error('Failed to render QR code:', error)
  }
}

function startPolling() {
  if (pollingInterval) clearInterval(pollingInterval)

  pollingInterval = window.setInterval(async () => {
    if (!qrSession.value) return

    try {
      const status = await qrcodeService.getStatus(qrSession.value.id)
      if (status && status.status !== qrSession.value.status) {
        qrSession.value = status
        if (status.status === 'SCANNED' || status.status === 'USED') {
          stopPolling()
        }
      }
    } catch (error) {
      console.error('Polling error:', error)
    }
  }, 2000)
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

function copyToken() {
  if (qrSession.value) {
    navigator.clipboard.writeText(qrSession.value.token)
  }
}

function generateNew() {
  stopPolling()
  qrSession.value = null
}

onMounted(() => {
  // Render QR if session already exists
  if (qrSession.value?.token && qrCanvas.value) {
    renderQRCode(qrSession.value.token)
  }
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.qr-generate-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.qr-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem;
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
  margin-bottom: 2rem;
}

.btn-generate {
  background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 200px;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(233, 69, 96, 0.4);
}

.btn-generate:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.qr-code-wrapper {
  background: white;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.qr-canvas {
  display: block;
  border-radius: 8px;
}

.qr-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-scanned {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-used {
  background: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
  border: 1px solid rgba(158, 158, 158, 0.3);
}

.scanned-message {
  color: #4caf50;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(233, 69, 96, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
