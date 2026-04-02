<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey selection:bg-antique-bronze selection:text-white overflow-x-hidden">
    <section class="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      <div class="absolute inset-0 z-0">
        <img src="/images/realfake.png" :alt="t('home.hero.background_alt')" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.8)_100%)]"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
      </div>

      <div class="relative z-10">
        <div class="animate-slide-in-left">
          <img src="/images/transparent_logo.png" :alt="t('home.hero.logo_alt')"
            class="w-full max-w-[1200px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,1)]" />
        </div>
      </div>
    </section>

    <BrokenPaperSeparator color="#000000" />

    <section class="bg-parchment py-20 md:py-24 text-center relative z-10">
      <div class="max-w-4xl mx-auto px-4">
        <MedievalSectionTitle>{{ t('home.hero.title') }}</MedievalSectionTitle>
        <p class="text-lg md:text-xl text-stone-grey mb-10 leading-relaxed font-body">
          "{{ t('home.hero.subtitle') }}"
        </p>
        <div class="animate-fade-in-up">
          <MedievalButton href="#intro-section">
            {{ t('home.hero.cta') }}
          </MedievalButton>
        </div>
      </div>
    </section>

    <BrokenPaperSeparator color="#F3EAD6" />

    <section id="intro-section" class="bg-warm-sand py-20 md:py-32 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <MedievalSectionTitle>{{ t('home.intro.title') }}</MedievalSectionTitle>
            <p class="text-lg md:text-xl text-stone-grey mb-6 leading-relaxed">
              {{ t('home.intro.text_1') }}
            </p>
            <p class="text-lg md:text-xl text-stone-grey leading-relaxed">
              {{ t('home.intro.text_2') }}
            </p>
          </div>
          <div class="order-1 md:order-2 relative">
            <div class="aspect-[4/3] bg-aged-paper rounded-sm border-4 border-double border-antique-bronze/40 shadow-xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div class="w-full h-full flex items-center justify-center bg-black/5">
                <span class="font-citation text-4xl text-antique-bronze/50">{{ t('home.intro.visual_alt') }}</span>
                <img src="/images/activite_arc_compressed.png" :alt="t('home.intro.visual_alt')"
                  class="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BrokenPaperSeparator color="#E6D6BC" />

    <section class="bg-aged-paper py-20 md:py-32 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <MedievalSectionTitle>{{ t('home.features.title') }}</MedievalSectionTitle>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          <MedievalCard>
            <template #icon>
              <i class="fa-solid fa-map-location-dot text-3xl"></i>
            </template>
            <template #title>{{ t('home.features.discover.title') }}</template>
            <template #description>{{ t('home.features.discover.description') }}</template>
          </MedievalCard>

          <MedievalCard>
            <template #icon>
              <i class="fa-solid fa-calendar-days text-3xl"></i>
            </template>
            <template #title>{{ t('home.features.events.title') }}</template>
            <template #description>{{ t('home.features.events.description') }}</template>
          </MedievalCard>

          <MedievalCard>
            <template #icon>
              <i class="fa-solid fa-users text-3xl"></i>
            </template>
            <template #title>{{ t('home.features.community.title') }}</template>
            <template #description>{{ t('home.features.community.description') }}</template>
          </MedievalCard>
        </div>
      </div>
    </section>

    <BrokenPaperSeparator color="#D4C5A5" />

    <section class="bg-parchment py-20 md:py-28 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <MedievalSectionTitle>{{ t('home.commitments.title') }}</MedievalSectionTitle>
          <p class="text-lg text-stone-grey font-body max-w-2xl mx-auto">
            {{ t('home.commitments.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center group" v-for="item in commitmentItems" :key="item.titleKey">
            <div :class="item.wrapperClass" class="w-20 h-20 mx-auto mb-5 rounded-full border-2 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
              <i :class="item.iconClass"></i>
            </div>
            <h3 class="text-xl font-medieval font-bold text-iron-black mb-2">{{ t(item.titleKey) }}</h3>
            <p class="text-sm text-stone-grey font-body leading-relaxed">
              {{ t(item.descriptionKey) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <BrokenPaperSeparator color="#F3EAD6" />

    <section id="map-section" class="bg-parchment py-20 md:py-32 relative">
      <div class="w-full max-w-[95%] mx-auto px-4">
        <div class="text-center mb-12">
          <MedievalSectionTitle>{{ t('map.title') }}</MedievalSectionTitle>
        </div>

        <MapView />
      </div>
    </section>

    <BrokenPaperSeparator color="#F3EAD6" />

    <section class="bg-dark-wood py-20 md:py-32 text-center relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

      <div class="max-w-3xl mx-auto px-4 relative z-10">
        <MedievalSectionTitle theme="dark">{{ t('home.cta.title') }}</MedievalSectionTitle>
        <p class="text-xl text-warm-sand mb-10 font-body max-w-2xl mx-auto">
          {{ t('home.cta.subtitle') }}
        </p>
        <MedievalButton href="/register">
          {{ t('home.cta.button') }}
        </MedievalButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MapView from '@/components/shared/MapView.vue'
import BrokenPaperSeparator from '@/components/ui/BrokenPaperSeparator.vue'
import MedievalButton from '@/components/ui/MedievalButton.vue'
import MedievalSectionTitle from '@/components/ui/MedievalSectionTitle.vue'
import MedievalCard from '@/components/ui/MedievalCard.vue'

const { t } = useI18n()

const commitmentItems = [
  {
    titleKey: 'home.commitments.water.title',
    descriptionKey: 'home.commitments.water.description',
    wrapperClass: 'bg-blue-50 border-blue-200',
    iconClass: 'fas fa-tint text-blue-500 text-2xl'
  },
  {
    titleKey: 'home.commitments.power.title',
    descriptionKey: 'home.commitments.power.description',
    wrapperClass: 'bg-yellow-50 border-yellow-200',
    iconClass: 'fas fa-bolt text-yellow-500 text-2xl'
  },
  {
    titleKey: 'home.commitments.toilets.title',
    descriptionKey: 'home.commitments.toilets.description',
    wrapperClass: 'bg-emerald-50 border-emerald-200',
    iconClass: 'fas fa-restroom text-emerald-500 text-2xl'
  },
  {
    titleKey: 'home.commitments.accessibility.title',
    descriptionKey: 'home.commitments.accessibility.description',
    wrapperClass: 'bg-purple-50 border-purple-200',
    iconClass: 'fas fa-wheelchair text-purple-500 text-2xl'
  }
]
</script>

<style scoped>
</style>
