<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const changeLanguage = (lang: string) => {
  locale.value = lang;
};
</script>

<template>
  <header>
    <div class="language-switcher">
      <button @click="changeLanguage('en')" :class="{ active: locale === 'en' }">EN</button>
      <button @click="changeLanguage('fr')" :class="{ active: locale === 'fr' }">FR</button>
      <button @click="changeLanguage('de')" :class="{ active: locale === 'de' }">DE</button>
      <button @click="changeLanguage('es')" :class="{ active: locale === 'es' }">ES</button>
    </div>
  </header>
  <RouterView />
</template>

<style scoped lang="css">
header {
  line-height: 1.5;
  max-width: 100vw;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.language-switcher button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.language-switcher button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

@media (min-width: 768px) {
  header {
    padding-right: calc(var(--section-gap) / 2);
    margin-left: auto;
    margin-right: auto;
    max-width: 768px;
  }
}
</style>
