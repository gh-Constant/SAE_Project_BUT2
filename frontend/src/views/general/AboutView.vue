<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey">
    <section class="relative bg-dark-wood py-20 md:py-28 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl mx-auto px-4">
        <MedievalSectionTitle theme="dark">{{ $t('pages.about.title') }}</MedievalSectionTitle>
        <p class="text-xl text-warm-sand font-body max-w-2xl mx-auto">{{ $t('pages.about.subtitle') }}</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <section class="mb-16">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.about.historyTitle') }}</h3>
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.about.historyP1') }}</p>
            <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.about.historyP2') }}</p>
            <p class="text-base leading-relaxed text-justify">{{ $t('pages.about.historyP3') }}</p>
          </div>
          <div class="relative">
            <div class="aspect-[4/3] bg-aged-paper rounded-sm border-4 border-double border-antique-bronze/40 shadow-xl overflow-hidden">
              <img src="/images/realfake.png" alt="Les Terres du Lion" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section class="mb-16">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.about.missionTitle') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-antique-bronze/10 rounded-full flex items-center justify-center border border-antique-bronze/20">
              <i class="fas fa-chess-rook text-antique-bronze text-2xl"></i>
            </div>
            <h4 class="font-medieval font-bold text-iron-black mb-2 text-center">{{ $t('pages.about.mission1Title') }}</h4>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.about.mission1Desc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-antique-bronze/10 rounded-full flex items-center justify-center border border-antique-bronze/20">
              <i class="fas fa-users text-antique-bronze text-2xl"></i>
            </div>
            <h4 class="font-medieval font-bold text-iron-black mb-2 text-center">{{ $t('pages.about.mission2Title') }}</h4>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.about.mission2Desc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-antique-bronze/10 rounded-full flex items-center justify-center border border-antique-bronze/20">
              <i class="fas fa-gamepad text-antique-bronze text-2xl"></i>
            </div>
            <h4 class="font-medieval font-bold text-iron-black mb-2 text-center">{{ $t('pages.about.mission3Title') }}</h4>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.about.mission3Desc') }}</p>
          </div>
        </div>
      </section>

      <section class="mb-16">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.about.teamTitle') }}</h3>
        <p class="text-base leading-relaxed text-center mb-8 max-w-3xl mx-auto">{{ $t('pages.about.teamDesc') }}</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center" v-for="member in teamMembers" :key="member.name">
            <div class="w-20 h-20 mx-auto mb-3 bg-antique-bronze/10 rounded-full flex items-center justify-center border-2 border-antique-bronze/30">
              <i :class="member.icon" class="text-antique-bronze text-2xl"></i>
            </div>
            <p class="font-bold text-iron-black text-sm">{{ member.name }}</p>
            <p class="text-xs text-stone-grey/70 italic">{{ $t(member.roleKey) }}</p>
          </div>
        </div>
      </section>

      <section class="mb-16">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.about.numbersTitle') }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6 text-center">
            <p class="text-3xl font-medieval font-bold text-antique-bronze mb-1">20+</p>
            <p class="text-sm text-stone-grey">{{ $t('pages.about.locations') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6 text-center">
            <p class="text-3xl font-medieval font-bold text-antique-bronze mb-1">50+</p>
            <p class="text-sm text-stone-grey">{{ $t('pages.about.events') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6 text-center">
            <p class="text-3xl font-medieval font-bold text-antique-bronze mb-1">10+</p>
            <p class="text-sm text-stone-grey">{{ $t('pages.about.quests') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6 text-center">
            <p class="text-3xl font-medieval font-bold text-antique-bronze mb-1">5</p>
            <p class="text-sm text-stone-grey">{{ $t('pages.about.languages') }}</p>
          </div>
        </div>
      </section>

      <div class="text-center">
        <router-link to="/" class="inline-block px-8 py-3 bg-antique-bronze text-parchment font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-dark-wood hover:border-dark-wood transition-colors duration-300">
          {{ $t('pages.backToKingdom') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MedievalSectionTitle from '@/components/ui/MedievalSectionTitle.vue';

const teamMembers = [
  { name: 'Constant', roleKey: 'pages.about.roleConstant', icon: 'fas fa-hat-wizard' },
  { name: 'Zakaria', roleKey: 'pages.about.roleZakaria', icon: 'fas fa-crown' },
  { name: 'Timothé', roleKey: 'pages.about.roleTimothe', icon: 'fas fa-shield-halved' },
  { name: 'Maxime', roleKey: 'pages.about.roleMaxime', icon: 'fas fa-scroll' },
];
</script>
