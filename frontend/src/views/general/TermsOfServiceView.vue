<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey">
    <!-- Header -->
    <section class="relative bg-dark-wood py-20 md:py-28 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl mx-auto px-4">
        <MedievalSectionTitle theme="dark">{{ $t('pages.terms.title') }}</MedievalSectionTitle>
        <p class="text-sm text-warm-sand/60">{{ $t('pages.lastUpdated') }}</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art1.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.terms.art1.p1') }}</p>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.terms.art1.p2') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art2.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.terms.art2.intro') }}</p>
        <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left">
          <li v-for="(item, i) in $tm('pages.terms.art2.list')" :key="i">{{ item }}</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art3.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.terms.art3.intro') }}</p>
        <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left mb-4">
          <li v-for="(item, i) in $tm('pages.terms.art3.list')" :key="i">{{ item }}</li>
        </ul>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.terms.art3.oauth') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art4.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.terms.art4.intro') }}</p>
        <div class="space-y-4">
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-5">
            <h4 class="font-medieval font-bold text-iron-black mb-2">{{ $t('pages.terms.art4.client') }}</h4>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.terms.art4.clientDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-5">
            <h4 class="font-medieval font-bold text-iron-black mb-2">{{ $t('pages.terms.art4.prestataire') }}</h4>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.terms.art4.prestataireDesc') }}</p>
          </div>
          <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-5">
            <h4 class="font-medieval font-bold text-iron-black mb-2">{{ $t('pages.terms.art4.admin') }}</h4>
            <p class="text-sm leading-relaxed text-justify">{{ $t('pages.terms.art4.adminDesc') }}</p>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art5.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.terms.art5.intro') }}</p>
        <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left mb-4">
          <li v-for="(item, i) in $tm('pages.terms.art5.list')" :key="i">{{ item }}</li>
        </ul>
        <div class="bg-antique-bronze/10 border-l-4 border-antique-bronze p-4 rounded-r-sm">
          <p class="text-sm leading-relaxed text-justify">{{ $t('pages.terms.art5.retraction') }}</p>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art6.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.terms.art6.intro') }}</p>
        <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left mb-4">
          <li v-for="(item, i) in $tm('pages.terms.art6.list')" :key="i">{{ item }}</li>
        </ul>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.terms.art6.outro') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art7.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.terms.art7.p1') }}</p>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.terms.art7.p2') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art8.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.terms.art8.intro') }}</p>
        <ul class="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed text-left">
          <li v-for="(item, i) in $tm('pages.terms.art8.list')" :key="i">{{ item }}</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art9.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.terms.art9.text') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art10.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.terms.art10.text') }}</p>
      </section>

      <section class="mb-6">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.terms.art11.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.terms.art11.text') }}</p>
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
