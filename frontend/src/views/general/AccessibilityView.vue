<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey">
    <section class="relative bg-dark-wood py-20 md:py-28 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl mx-auto px-4">
        <MedievalSectionTitle theme="dark">{{ $t('pages.accessibility.title') }}</MedievalSectionTitle>
        <p class="text-lg text-warm-sand/80">{{ $t('pages.accessibility.subtitle') }}</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      <section class="mb-12">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.accessibility.commitTitle') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.accessibility.commitP1') }}</p>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.accessibility.commitP2') }}</p>
      </section>

      <section class="mb-12">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.accessibility.festivalTitle') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center border border-purple-200"><i class="fas fa-wheelchair text-purple-500"></i></div>
              <h4 class="font-bold text-iron-black">{{ $t('pages.accessibility.mobility') }}</h4>
            </div>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.accessibility.mobilityDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200"><i class="fas fa-restroom text-emerald-500"></i></div>
              <h4 class="font-bold text-iron-black">{{ $t('pages.accessibility.sanitary') }}</h4>
            </div>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.accessibility.sanitaryDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200"><i class="fas fa-tint text-blue-500"></i></div>
              <h4 class="font-bold text-iron-black">{{ $t('pages.accessibility.water') }}</h4>
            </div>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.accessibility.waterDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200"><i class="fas fa-hands-helping text-amber-500"></i></div>
              <h4 class="font-bold text-iron-black">{{ $t('pages.accessibility.support') }}</h4>
            </div>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.accessibility.supportDesc') }}</p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.accessibility.platformTitle') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="item in platformItems" :key="item.key" class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-antique-bronze/10 rounded-full flex items-center justify-center border border-antique-bronze/20">
                <i :class="item.icon" class="text-antique-bronze"></i>
              </div>
              <h4 class="font-bold text-iron-black">{{ $t(`pages.accessibility.${item.key}`) }}</h4>
            </div>
            <p class="text-sm leading-relaxed text-justify">{{ $t(`pages.accessibility.${item.key}Desc`) }}</p>
          </div>
        </div>
      </section>

      <section class="mb-6">
        <div class="bg-antique-bronze/10 border-l-4 border-antique-bronze p-6 rounded-r-sm">
          <h4 class="font-medieval font-bold text-iron-black mb-2">{{ $t('pages.accessibility.reportTitle') }}</h4>
          <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.accessibility.reportDesc') }}</p>
          <router-link to="/contact" class="inline-block px-6 py-2 bg-antique-bronze text-parchment font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-dark-wood hover:border-dark-wood transition-colors duration-300 text-sm">
            {{ $t('pages.accessibility.reportButton') }}
          </router-link>
        </div>
      </section>

      <div class="text-center mt-12">
        <router-link to="/" class="inline-block px-8 py-3 bg-antique-bronze text-parchment font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-dark-wood hover:border-dark-wood transition-colors duration-300">
          {{ $t('pages.backToKingdom') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MedievalSectionTitle from '@/components/ui/MedievalSectionTitle.vue';

const platformItems = [
  { key: 'keyboard', icon: 'fas fa-keyboard' },
  { key: 'contrast', icon: 'fas fa-adjust' },
  { key: 'responsive', icon: 'fas fa-mobile-alt' },
  { key: 'altText', icon: 'fas fa-image' },
  { key: 'multilingual', icon: 'fas fa-globe' },
];
</script>
