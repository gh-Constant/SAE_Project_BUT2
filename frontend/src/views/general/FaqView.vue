<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey">
    <section class="relative bg-dark-wood py-20 md:py-28 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl mx-auto px-4">
        <MedievalSectionTitle theme="dark">{{ $t('pages.faq.title') }}</MedievalSectionTitle>
        <p class="text-lg text-warm-sand/80">{{ $t('pages.faq.subtitle') }}</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id"
          :class="['px-4 py-2 rounded-sm text-sm font-bold transition-colors duration-200 border',
            activeCategory === cat.id ? 'bg-antique-bronze text-parchment border-antique-bronze' : 'bg-warm-sand/50 text-iron-black border-antique-bronze/20 hover:bg-antique-bronze/10']">
          <i :class="cat.icon" class="mr-2"></i>{{ cat.label }}
        </button>
      </div>

      <div class="space-y-4">
        <div v-for="(faq, index) in filteredFaqs" :key="index" class="bg-warm-sand/50 border border-antique-bronze/20 rounded-sm overflow-hidden">
          <button @click="toggledIndexes.has(index) ? toggledIndexes.delete(index) : toggledIndexes.add(index); triggerUpdate()" class="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-antique-bronze/5 transition-colors">
            <span class="font-bold text-iron-black text-base">{{ faq.question }}</span>
            <i :class="toggledIndexes.has(index) ? 'fa-chevron-up' : 'fa-chevron-down'" class="fas text-antique-bronze text-sm flex-shrink-0"></i>
          </button>
          <div v-if="toggledIndexes.has(index)" class="px-6 pb-5">
            <p class="text-base leading-relaxed text-justify" v-html="faq.answer"></p>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-8">
        <i class="fas fa-question-circle text-antique-bronze text-3xl mb-4"></i>
        <h4 class="font-medieval font-bold text-iron-black text-xl mb-2">{{ $t('pages.faq.notFound') }}</h4>
        <p class="text-base text-stone-grey mb-6">{{ $t('pages.faq.notFoundDesc') }}</p>
        <router-link to="/contact" class="inline-block px-8 py-3 bg-antique-bronze text-parchment font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-dark-wood hover:border-dark-wood transition-colors duration-300">
          {{ $t('pages.faq.contactUs') }}
        </router-link>
      </div>

      <div class="text-center mt-12">
        <router-link to="/" class="inline-block px-8 py-3 bg-antique-bronze text-parchment font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-dark-wood hover:border-dark-wood transition-colors duration-300">
          {{ $t('pages.backToKingdom') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import MedievalSectionTitle from '@/components/ui/MedievalSectionTitle.vue';

const { t, tm } = useI18n();
const activeCategory = ref('all');
const toggledIndexes = reactive(new Set<number>());
const updateKey = ref(0);
function triggerUpdate() { updateKey.value++; }

const categories = computed(() => [
  { id: 'all', label: t('pages.faq.all'), icon: 'fas fa-th-large' },
  { id: 'general', label: t('pages.faq.general'), icon: 'fas fa-info-circle' },
  { id: 'account', label: t('pages.faq.account'), icon: 'fas fa-user' },
  { id: 'shop', label: t('pages.faq.shop'), icon: 'fas fa-shopping-bag' },
  { id: 'events', label: t('pages.faq.events'), icon: 'fas fa-calendar' },
  { id: 'quests', label: t('pages.faq.questsQuiz'), icon: 'fas fa-scroll' },
]);

const allFaqs = computed(() => {
  const items = tm('pages.faq.items') as Array<{ cat: string; q: string; a: string }>;
  return items.map(item => ({
    category: item.cat,
    question: item.q,
    answer: item.a,
  }));
});

const filteredFaqs = computed(() => {
  void updateKey.value;
  if (activeCategory.value === 'all') return allFaqs.value;
  return allFaqs.value.filter(f => f.category === activeCategory.value);
});
</script>
