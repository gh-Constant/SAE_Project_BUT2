<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const showPopup = ref(false)
const showMinecraft = ref(false)

const languages = reactive([
  {
    code: 'en',
    name: 'English',
    flag: 'https://flagcdn.com/w40/us.png'
  },
  {
    code: 'fr',
    name: 'Français',
    flag: 'https://flagcdn.com/w40/fr.png'
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: 'https://flagcdn.com/w40/de.png'
  },
  {
    code: 'es',
    name: 'Español',
    flag: 'https://flagcdn.com/w40/es.png'
  },
  {
    code: 'mc',
    name: 'Minecraft',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Minecraft-creeper-face.svg/1024px-Minecraft-creeper-face.svg.png?20240523145431',
    special: true
  }
])

const displayedLanguages = computed(() => {
  return showMinecraft.value ? languages : languages.filter(lang => lang.code !== 'mc')
})

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value) || languages[0]
})

const togglePopup = () => {
  showPopup.value = !showPopup.value
}

const closePopup = () => {
  showPopup.value = false
}

const selectLanguage = (language: typeof languages[0]) => {
  locale.value = language.code
  closePopup()
}
</script>

<template>
  <div class="relative">
    <!-- Language Switcher Button -->
    <button
      class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      :class="{ 'minecraft-selected': currentLanguage.special }"
      @click="togglePopup"
    >
      <!--  made flag rounded -->
      <img
        :src="currentLanguage.flag"
        :alt="currentLanguage.name"
        class="w-5 h-5 rounded-full"
        :class="{ 'spin': currentLanguage.code === 'mc' }"
      >
      <span class="text-sm font-medium">{{ currentLanguage.name }}</span>
      <svg
        class="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Language Dropdown -->
    <div
      v-if="showPopup"
      class="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
      style="z-index: 10000;"
    >
      <div class="px-4 py-2 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900">
          Select Language
        </h3>
      </div>
      <div class="py-2">
        <button
          v-for="lang in displayedLanguages"
          :key="lang.code"
          class="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          :class="{ 'bg-blue-50': currentLanguage.code === lang.code, 'minecraft-selected': lang.special && currentLanguage.code === lang.code }"
          @click="selectLanguage(lang)"
        >
          <span class="flex items-center gap-3">
            <img
              :src="lang.flag"
              :alt="lang.name"
              class="w-5 h-5 rounded-full"
              :class="{ 'spin': lang.code === 'mc' && currentLanguage.code === 'mc' }"
            >
            <span class="text-sm font-medium text-gray-900">{{ lang.name }}</span>
          </span>
          <span
            v-if="currentLanguage.code === lang.code"
            class="text-blue-600"
          >
            <svg
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>
      </div>
      <div v-if="!showMinecraft" class="px-4 py-2 border-t border-gray-200">
        <button
          class="text-xs text-gray-500 hover:text-gray-700 underline"
          @click="showMinecraft = true"
        >
          Don't click
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.minecraft-selected {
  animation: minecraft-glow 1.5s ease-in-out infinite alternate;
  background: linear-gradient(45deg, rgba(0, 255, 0, 0.1), rgba(0, 200, 0, 0.05));
}

.spin {
  animation: spin 2s linear infinite;
}

@keyframes minecraft-glow {
  0% {
    box-shadow: inset 0 0 5px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.4);
    transform: scale(1.02);
  }
  100% {
    box-shadow: inset 0 0 5px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.2);
    transform: scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>