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
import enHome from './locales/en/home.json';
import frHome from './locales/fr/home.json';
import deHome from './locales/de/home.json';
import esHome from './locales/es/home.json';
import mcHome from './locales/mc/home.json';

const messages = {
  en: {
    map: enMap,
    navbar: enNavbar,
    home: enHome
  },
  fr: {
    map: frMap,
    navbar: frNavbar,
    home: frHome
  },
  de: {
    map: deMap,
    navbar: deNavbar,
    home: deHome
  },
  es: {
    map: esMap,
    navbar: esNavbar,
    home: esHome
  },
  mc: {
    map: mcMap,
    navbar: mcNavbar,
    home: mcHome
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;