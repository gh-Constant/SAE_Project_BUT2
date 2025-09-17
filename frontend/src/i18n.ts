import { createI18n } from 'vue-i18n';

// Import translation files
import enMap from './locales/en/map.json';
import frMap from './locales/fr/map.json';
import deMap from './locales/de/map.json';
import esMap from './locales/es/map.json';
import enNavbar from './locales/en/navbar.json';
import frNavbar from './locales/fr/navbar.json';
import deNavbar from './locales/de/navbar.json';
import esNavbar from './locales/es/navbar.json';
import mcMap from './locales/mc/map.json';
import mcNavbar from './locales/mc/navbar.json';

const messages = {
  en: {
    map: enMap,
    navbar: enNavbar
  },
  fr: {
    map: frMap,
    navbar: frNavbar
  },
  de: {
    map: deMap,
    navbar: deNavbar
  },
  es: {
    map: esMap,
    navbar: esNavbar
  },
  mc: {
    map: mcMap,
    navbar: mcNavbar
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;