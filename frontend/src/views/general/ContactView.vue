<template>
  <div class="bg-parchment min-h-screen font-body text-stone-grey">
    <section class="relative bg-dark-wood py-20 md:py-28 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl mx-auto px-4">
        <MedievalSectionTitle theme="dark">{{ $t('pages.contact.title') }}</MedievalSectionTitle>
        <p class="text-lg text-warm-sand/80">{{ $t('pages.contact.subtitle') }}</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Form -->
        <div class="text-left">
          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6">{{ $t('pages.contact.formTitle') }}</h3>
          <form @submit.prevent="submitForm" class="space-y-5">
            <div>
              <label for="name" class="block text-sm font-bold text-iron-black mb-1">{{ $t('pages.contact.name') }}</label>
              <input id="name" v-model="form.name" type="text" required :placeholder="$t('pages.contact.namePlaceholder')" class="w-full px-4 py-3 bg-warm-sand/50 border border-antique-bronze/30 rounded-sm text-iron-black placeholder-stone-grey/50 focus:outline-none focus:border-antique-bronze focus:ring-1 focus:ring-antique-bronze transition-colors" />
            </div>
            <div>
              <label for="email" class="block text-sm font-bold text-iron-black mb-1">{{ $t('pages.contact.email') }}</label>
              <input id="email" v-model="form.email" type="email" required :placeholder="$t('pages.contact.emailPlaceholder')" class="w-full px-4 py-3 bg-warm-sand/50 border border-antique-bronze/30 rounded-sm text-iron-black placeholder-stone-grey/50 focus:outline-none focus:border-antique-bronze focus:ring-1 focus:ring-antique-bronze transition-colors" />
            </div>
            <div>
              <label for="subject" class="block text-sm font-bold text-iron-black mb-1">{{ $t('pages.contact.subject') }}</label>
              <select id="subject" v-model="form.subject" required class="w-full px-4 py-3 bg-warm-sand/50 border border-antique-bronze/30 rounded-sm text-iron-black focus:outline-none focus:border-antique-bronze focus:ring-1 focus:ring-antique-bronze transition-colors">
                <option value="" disabled>{{ $t('pages.contact.subjectPlaceholder') }}</option>
                <option value="general">{{ $t('pages.contact.subjects.general') }}</option>
                <option value="account">{{ $t('pages.contact.subjects.account') }}</option>
                <option value="order">{{ $t('pages.contact.subjects.order') }}</option>
                <option value="event">{{ $t('pages.contact.subjects.event') }}</option>
                <option value="prestataire">{{ $t('pages.contact.subjects.prestataire') }}</option>
                <option value="bug">{{ $t('pages.contact.subjects.bug') }}</option>
                <option value="privacy">{{ $t('pages.contact.subjects.privacy') }}</option>
                <option value="other">{{ $t('pages.contact.subjects.other') }}</option>
              </select>
            </div>
            <div>
              <label for="message" class="block text-sm font-bold text-iron-black mb-1">{{ $t('pages.contact.message') }}</label>
              <textarea id="message" v-model="form.message" required rows="6" :placeholder="$t('pages.contact.messagePlaceholder')" class="w-full px-4 py-3 bg-warm-sand/50 border border-antique-bronze/30 rounded-sm text-iron-black placeholder-stone-grey/50 focus:outline-none focus:border-antique-bronze focus:ring-1 focus:ring-antique-bronze transition-colors resize-vertical"></textarea>
            </div>
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-sm p-4">
              <p class="text-red-700 font-bold text-sm"><i class="fas fa-exclamation-circle mr-2"></i>{{ error }}</p>
            </div>
            <div v-if="submitted" class="bg-emerald-50 border border-emerald-200 rounded-sm p-4">
              <p class="text-emerald-700 font-bold text-sm"><i class="fas fa-check-circle mr-2"></i>{{ $t('pages.contact.success') }}</p>
            </div>
            <button type="submit" :disabled="submitted || loading" class="w-full px-8 py-3 bg-antique-bronze text-parchment font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-dark-wood hover:border-dark-wood transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ loading ? $t('pages.contact.sending') : submitted ? $t('pages.contact.sent') : $t('pages.contact.send') }}
            </button>
          </form>
        </div>

        <!-- Info -->
        <div class="text-left">
          <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6">{{ $t('pages.contact.infoTitle') }}</h3>
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-antique-bronze/10 rounded-full flex items-center justify-center flex-shrink-0 border border-antique-bronze/20">
                <i class="fas fa-envelope text-antique-bronze text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.contact.emailLabel') }}</h4>
                <p class="text-base">{{ $t('pages.contact.emailValue') }}</p>
                <p class="text-sm text-stone-grey/70 mt-1">{{ $t('pages.contact.emailDelay') }}</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-antique-bronze/10 rounded-full flex items-center justify-center flex-shrink-0 border border-antique-bronze/20">
                <i class="fas fa-map-marker-alt text-antique-bronze text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.contact.locationLabel') }}</h4>
                <p class="text-base">{{ $t('pages.contact.locationValue') }}</p>
                <p class="text-sm text-stone-grey/70 mt-1">
                  {{ $t('pages.contact.locationLink', { link: '' }) }}
                  <router-link to="/map" class="text-antique-bronze underline hover:text-dark-wood transition-colors">{{ $t('pages.contact.mapLink') }}</router-link>
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-antique-bronze/10 rounded-full flex items-center justify-center flex-shrink-0 border border-antique-bronze/20">
                <i class="fas fa-clock text-antique-bronze text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-iron-black mb-1">{{ $t('pages.contact.hoursLabel') }}</h4>
                <p class="text-base">{{ $t('pages.contact.hoursValue') }}</p>
              </div>
            </div>
          </div>

          <div class="mt-10 bg-warm-sand/50 border border-antique-bronze/20 rounded-sm p-6">
            <h4 class="font-medieval font-bold text-iron-black mb-4">{{ $t('pages.contact.faqTitle') }}</h4>
            <div class="space-y-4">
              <div>
                <p class="font-bold text-iron-black text-sm">{{ $t('pages.contact.faq1q') }}</p>
                <p class="text-sm leading-relaxed text-justify">{{ $t('pages.contact.faq1a') }}</p>
              </div>
              <div>
                <p class="font-bold text-iron-black text-sm">{{ $t('pages.contact.faq2q') }}</p>
                <p class="text-sm leading-relaxed text-justify">{{ $t('pages.contact.faq2a') }}</p>
              </div>
              <div>
                <p class="font-bold text-iron-black text-sm">{{ $t('pages.contact.faq3q') }}</p>
                <p class="text-sm leading-relaxed text-justify">{{ $t('pages.contact.faq3a') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-16">
        <router-link to="/" class="inline-block px-8 py-3 bg-antique-bronze text-parchment font-medieval font-bold rounded-sm border-2 border-antique-bronze hover:bg-dark-wood hover:border-dark-wood transition-colors duration-300">
          {{ $t('pages.backToKingdom') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import MedievalSectionTitle from '@/components/ui/MedievalSectionTitle.vue';
import apiClient from '@/services/apiClient';

const form = reactive({ name: '', email: '', subject: '', message: '' });
const submitted = ref(false);
const error = ref('');
const loading = ref(false);

async function submitForm() {
  error.value = '';
  loading.value = true;
  try {
    await apiClient.post('/contact/general', { name: form.name, email: form.email, subject: form.subject, message: form.message });
    submitted.value = true;
    form.name = ''; form.email = ''; form.subject = ''; form.message = '';
  } catch (e: any) {
    error.value = e.response?.data?.error || 'An error occurred.';
  } finally {
    loading.value = false;
  }
}
</script>
