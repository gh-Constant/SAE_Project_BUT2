<template>
  <div class="min-h-screen bg-parchment pt-32 pb-16 font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-medieval font-bold text-iron-black mb-4">
          <i class="fas fa-coins mr-3 text-antique-bronze"></i>
          {{ t('checkout.gold.buy.title') }}
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-6"></div>
        <p class="text-lg text-stone-grey max-w-2xl mx-auto">
          {{ t('checkout.gold.buy.subtitle') }}
        </p>
      </div>

      <div class="flex justify-center mb-12">
        <div class="bg-white/60 backdrop-blur-sm rounded-lg border-2 border-antique-bronze/30 p-6 flex items-center shadow-md shadow-antique-bronze/10">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center border-2 border-yellow-300 shadow-inner mr-4">
            <i class="fas fa-coins text-white text-xl"></i>
          </div>
          <div>
            <span class="text-sm font-bold text-stone-grey uppercase tracking-wider block mb-1">{{ t('checkout.gold.buy.current_total') }}</span>
            <span class="text-3xl font-medieval font-bold text-iron-black flex items-center">
              {{ formatGold(userGold) }}
              <span class="text-lg text-antique-bronze ml-2 border-l border-antique-bronze/30 pl-2">{{ t('checkout.gold.buy.currency') }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="pkg in packages"
          :key="pkg.amount"
          class="group relative bg-white/70 backdrop-blur-sm rounded-lg border-2 border-antique-bronze/20 hover:border-antique-bronze/60 transition-all duration-300 overflow-hidden flex flex-col justify-between transform hover:-translate-y-2 hover:shadow-xl shadow-md"
        >
          <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-antique-bronze/40 rounded-tl-lg pointer-events-none"></div>
          <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-antique-bronze/40 rounded-tr-lg pointer-events-none"></div>

          <div class="p-8 text-center flex-1 flex flex-col items-center">
            <div class="w-full flex justify-center mb-6">
              <div class="bg-antique-bronze/10 border border-antique-bronze/30 px-4 py-1.5 rounded-full inline-flex items-center">
                <i class="fas fa-coins text-antique-bronze mr-2"></i>
                <span class="font-medieval font-bold text-antique-bronze text-lg">+ {{ formatGold(pkg.amount) }} {{ t('checkout.gold.buy.currency') }}</span>
              </div>
            </div>

            <h3 class="text-2xl font-medieval font-bold mb-4 text-iron-black group-hover:text-antique-bronze transition-colors">{{ pkg.name }}</h3>

            <div class="w-32 h-32 mb-6 relative">
              <div class="absolute inset-0 bg-antique-bronze/20 rounded-full blur-xl group-hover:bg-amber-400/30 transition-all duration-500"></div>
              <div class="w-full h-full rounded-full border-4 border-amber-600 bg-gradient-to-b from-yellow-400 via-amber-500 to-amber-800 shadow-inner flex items-center justify-center relative z-10 transform group-hover:scale-110 transition-transform duration-500 shadow-xl border-t-yellow-300">
                <i :class="['fas', pkg.icon, 'text-5xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]']"></i>
              </div>
            </div>

            <p class="text-stone-grey text-sm mb-6 flex-1 italic">{{ pkg.description }}</p>
          </div>

          <div class="p-6 bg-parchment/50 border-t border-antique-bronze/20 text-center">
            <div class="text-3xl font-medieval font-bold text-iron-black mb-4 flex items-baseline justify-center gap-1">
              {{ (pkg.priceInCents / 100).toFixed(2) }}<span class="text-xl">€</span>
            </div>
            <button
              @click="purchase(pkg)"
              :disabled="loading"
              class="w-full py-4 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold text-lg rounded shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
              <i v-else class="fas fa-shopping-bag"></i>
              {{ loading ? t('checkout.gold.buy.processing') : t('checkout.gold.buy.buy_pack') }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <div class="bg-white/70 backdrop-blur-sm rounded-lg border-2 border-antique-bronze/20 p-6 md:p-8 shadow-md">
          <div class="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div class="flex-1">
              <h2 class="text-2xl font-medieval font-bold text-iron-black mb-2">
                {{ t('checkout.gold.buy.custom_title') }}
              </h2>
              <p class="text-stone-grey text-sm mb-4">
                {{ t('checkout.gold.buy.custom_description') }}
              </p>
              <label for="custom-gold" class="block text-sm font-bold text-stone-grey mb-2">
                {{ t('checkout.gold.buy.custom_label') }}
              </label>
              <input
                id="custom-gold"
                v-model.number="customGoldAmount"
                type="number"
                min="100"
                max="100000"
                step="1"
                class="w-full md:max-w-xs rounded-md border-2 border-antique-bronze/30 bg-white/80 px-4 py-3 text-iron-black focus:border-antique-bronze focus:outline-none"
              >
              <p v-if="customError" class="mt-2 text-sm text-red-700">
                {{ customError }}
              </p>
            </div>

            <div class="md:text-right">
              <div class="text-stone-grey text-sm mb-1">{{ t('checkout.gold.buy.estimated_price') }}</div>
              <div class="text-3xl font-medieval font-bold text-iron-black mb-3">
                {{ (customPriceInCents / 100).toFixed(2) }}€
              </div>
              <button
                @click="purchaseCustom"
                :disabled="loading"
                class="w-full md:w-auto py-3 px-6 bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold text-lg rounded shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
                <i v-else class="fas fa-coins"></i>
                {{ loading ? t('checkout.gold.buy.processing') : t('checkout.gold.buy.buy_custom') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showLoginModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="showLoginModal = false">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-parchment rounded-lg shadow-2xl border-2 border-antique-bronze/40 max-w-md w-full p-8 text-center transform transition-all">
          <button @click="showLoginModal = false" class="absolute top-3 right-3 text-stone-grey/60 hover:text-iron-black transition-colors">
            <i class="fas fa-times text-lg"></i>
          </button>

          <div class="w-20 h-20 bg-antique-bronze/10 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-antique-bronze/20">
            <i class="fas fa-lock text-3xl text-antique-bronze"></i>
          </div>

          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
            {{ t('checkout.gold.buy.login_required_title') }}
          </h3>

          <p class="text-stone-grey font-body mb-6 leading-relaxed">
            {{ t('checkout.gold.buy.login_required_description') }}
          </p>

          <div class="flex flex-col gap-3">
            <router-link
              to="/login"
              class="w-full bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-3 px-6 rounded-md shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i class="fas fa-sign-in-alt"></i>
              {{ t('auth.login.submit') }}
            </router-link>
            <router-link
              to="/register"
              class="w-full bg-white/80 hover:bg-white text-antique-bronze font-medieval font-bold py-3 px-6 rounded-md border-2 border-antique-bronze/30 hover:border-antique-bronze transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i class="fas fa-user-plus"></i>
              {{ t('auth.register.submit') }}
            </router-link>
          </div>

          <div class="mt-5 pt-4 border-t border-antique-bronze/15">
            <button @click="showLoginModal = false" class="text-sm text-stone-grey hover:text-antique-bronze transition-colors font-body">
              {{ t('checkout.gold.buy.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { goldService } from '@/services/goldService'

const { t } = useI18n()
const authStore = useAuthStore()
const userGold = ref(0)
const loading = ref(false)
const showLoginModal = ref(false)
const customGoldAmount = ref(1000)
const customError = ref('')

const formatGold = (amount: number): string => {
  if (amount >= 10000) {
    return (amount / 1000).toFixed(0) + 'K'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return amount.toLocaleString('fr-FR')
}

const packages = [
  {
    name: t('checkout.gold.buy.packages.peasant.name'),
    amount: 100,
    priceInCents: 100,
    description: t('checkout.gold.buy.packages.peasant.description'),
    icon: 'fa-sack-dollar'
  },
  {
    name: t('checkout.gold.buy.packages.merchant.name'),
    amount: 500,
    priceInCents: 500,
    description: t('checkout.gold.buy.packages.merchant.description'),
    icon: 'fa-box-open'
  },
  {
    name: t('checkout.gold.buy.packages.king.name'),
    amount: 1500,
    priceInCents: 1500,
    description: t('checkout.gold.buy.packages.king.description'),
    icon: 'fa-gem'
  }
]

const customPriceInCents = computed(() => {
  const value = Number(customGoldAmount.value)
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.round(value)
})

onMounted(async () => {
  if (authStore.user) {
    try {
      const { gold } = await goldService.getBalance(authStore.user.id)
      userGold.value = gold
      authStore.user.gold = gold
    } catch (e) {
      console.error('Error fetching gold', e)
      if (authStore.user.gold) userGold.value = authStore.user.gold
    }
  }
})

const startCheckout = async (amountGold: number, priceInCents: number) => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }

  if (!authStore.user) return

  loading.value = true
  try {
    const res = await goldService.createCheckoutSession(authStore.user.id, amountGold, priceInCents)
    window.location.href = res.url
  } catch (e) {
    console.error('Checkout error:', e)
    alert(t('checkout.gold.buy.errors.session_creation'))
  } finally {
    loading.value = false
  }
}

const purchase = async (pkg: typeof packages[0]) => {
  await startCheckout(pkg.amount, pkg.priceInCents)
}

const purchaseCustom = async () => {
  customError.value = ''
  const amount = Number(customGoldAmount.value)

  if (!Number.isInteger(amount)) {
    customError.value = t('checkout.gold.buy.errors.integer_required')
    return
  }

  if (amount < 100 || amount > 100000) {
    customError.value = t('checkout.gold.buy.errors.out_of_range')
    return
  }

  await startCheckout(amount, customPriceInCents.value)
}
</script>
