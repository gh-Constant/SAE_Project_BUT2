import { createI18n } from 'vue-i18n';

// Import translation files
import enMap from './locales/en/map.json';
import frMap from './locales/fr/map.json';
import deMap from './locales/de/map.json';
import esMap from './locales/es/map.json';

const messages = {
  en: {
    map: enMap
  },
  fr: {
    map: frMap
  },
  de: {
    map: deMap
  },
  es: {
    map: esMap
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;