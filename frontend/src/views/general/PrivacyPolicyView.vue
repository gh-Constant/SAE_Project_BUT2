<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey">
    <section class="relative bg-dark-wood py-20 md:py-28 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl mx-auto px-4">
        <MedievalSectionTitle theme="dark">{{ $t('pages.privacy.title') }}</MedievalSectionTitle>
        <p class="text-sm text-warm-sand/60">{{ $t('pages.lastUpdated') }}</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.preamble.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.privacy.preamble.p1') }}</p>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.privacy.preamble.p2') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.controller.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.privacy.controller.text') }} <router-link to="/contact" class="text-antique-bronze underline hover:text-dark-wood transition-colors">{{ $t('footer.contact') }}</router-link>.</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.dataCollected.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.privacy.dataCollected.intro') }}</p>
        <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6 mb-4">
          <h4 class="font-medieval font-bold text-iron-black mb-3">{{ $t('pages.privacy.dataCollected.directTitle') }}</h4>
          <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left">
            <li v-for="(item, i) in $tm('pages.privacy.dataCollected.direct')" :key="i">{{ item }}</li>
          </ul>
        </div>
        <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6 mb-4">
          <h4 class="font-medieval font-bold text-iron-black mb-3">{{ $t('pages.privacy.dataCollected.autoTitle') }}</h4>
          <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left">
            <li v-for="(item, i) in $tm('pages.privacy.dataCollected.auto')" :key="i">{{ item }}</li>
          </ul>
        </div>
        <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
          <h4 class="font-medieval font-bold text-iron-black mb-3">{{ $t('pages.privacy.dataCollected.paymentTitle') }}</h4>
          <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left">
            <li v-for="(item, i) in $tm('pages.privacy.dataCollected.payment')" :key="i">{{ item }}</li>
          </ul>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.purposes.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.privacy.purposes.intro') }}</p>
        <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left">
          <li v-for="(item, i) in $tm('pages.privacy.purposes.list')" :key="i">{{ item }}</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.retention.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.privacy.retention.text') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.sharing.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.privacy.sharing.intro') }}</p>
        <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left">
          <li v-for="(item, i) in $tm('pages.privacy.sharing.list')" :key="i">{{ item }}</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.security.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.privacy.security.intro') }}</p>
        <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left">
          <li v-for="(item, i) in $tm('pages.privacy.security.list')" :key="i">{{ item }}</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.rights.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.privacy.rights.intro') }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-4">
            <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.privacy.rights.access') }}</h4>
            <p class="text-sm leading-relaxed">{{ $t('pages.privacy.rights.accessDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-4">
            <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.privacy.rights.rectification') }}</h4>
            <p class="text-sm leading-relaxed">{{ $t('pages.privacy.rights.rectificationDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-4">
            <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.privacy.rights.erasure') }}</h4>
            <p class="text-sm leading-relaxed">{{ $t('pages.privacy.rights.erasureDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-4">
            <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.privacy.rights.portability') }}</h4>
            <p class="text-sm leading-relaxed">{{ $t('pages.privacy.rights.portabilityDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-4">
            <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.privacy.rights.opposition') }}</h4>
            <p class="text-sm leading-relaxed">{{ $t('pages.privacy.rights.oppositionDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-4">
            <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.privacy.rights.limitation') }}</h4>
            <p class="text-sm leading-relaxed">{{ $t('pages.privacy.rights.limitationDesc') }}</p>
          </div>
        </div>
        <p class="text-base leading-relaxed text-justify mt-4">{{ $t('pages.privacy.rights.outro') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.cookies.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.privacy.cookies.text') }}</p>
      </section>

      <section class="mb-6">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.privacy.changes.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.privacy.changes.text') }}</p>
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
</script>
