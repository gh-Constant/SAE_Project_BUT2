<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey">
    <section class="relative bg-dark-wood py-20 md:py-28 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl mx-auto px-4">
        <MedievalSectionTitle theme="dark">{{ $t('pages.legal.title') }}</MedievalSectionTitle>
        <p class="text-sm text-warm-sand/60">{{ $t('pages.legal.subtitle') }}</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.legal.editor.title') }}</h3>
        <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
          <ul class="space-y-3 text-base leading-relaxed">
            <li><strong>{{ $t('pages.legal.editor.name') }}</strong></li>
            <li>{{ $t('pages.legal.editor.type') }}</li>
            <li><strong>E-mail :</strong> {{ $t('pages.legal.editor.email') }}</li>
          </ul>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.legal.host.title') }}</h3>
        <div class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
          <ul class="space-y-3 text-base leading-relaxed">
            <li>{{ $t('pages.legal.host.name') }}</li>
          </ul>
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.legal.ip.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.legal.ip.p1') }}</p>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.legal.ip.p2') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.legal.data.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">
          {{ $t('pages.legal.data.p1') }}
          <router-link to="/privacy" class="text-antique-bronze underline hover:text-dark-wood transition-colors">{{ $t('footer.privacy') }}</router-link>.
        </p>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.legal.data.p2') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.legal.cookies.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.legal.cookies.text') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.legal.liability.title') }}</h3>
        <p class="text-base leading-relaxed text-justify mb-4">{{ $t('pages.legal.liability.p1') }}</p>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.legal.liability.p2') }}</p>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.legal.links.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.legal.links.text') }}</p>
      </section>

      <section class="mb-6">
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6 text-center">{{ $t('pages.legal.law.title') }}</h3>
        <p class="text-base leading-relaxed text-justify">{{ $t('pages.legal.law.text') }}</p>
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
