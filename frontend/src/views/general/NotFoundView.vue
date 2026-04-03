<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey flex items-center justify-center">
    <div class="text-center px-4 py-20">
      <p class="text-[8rem] md:text-[12rem] font-medieval font-bold text-antique-bronze/20 leading-none select-none">{{ $t('pages.notFound.code') }}</p>
      <h1 class="text-3xl md:text-4xl font-medieval font-bold text-iron-black -mt-8 mb-4">{{ $t('pages.notFound.title') }}</h1>
      <p class="text-lg text-stone-grey mb-4 max-w-md mx-auto">{{ $t('pages.notFound.description') }}</p>
      <p class="text-base text-stone-grey/60 mb-10 font-citation text-2xl">{{ $t('pages.notFound.quote') }}</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/" class="inline-block px-8 py-3 bg-antique-bronze text-parchment font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-dark-wood hover:border-dark-wood transition-colors duration-300">
          {{ $t('pages.notFound.backHome') }}
        </router-link>
        <router-link to="/map" class="inline-block px-8 py-3 text-antique-bronze font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-antique-bronze hover:text-parchment transition-colors duration-300">
          {{ $t('pages.notFound.viewMap') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
