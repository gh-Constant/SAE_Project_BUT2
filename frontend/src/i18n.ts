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
import enPrestataire from './locales/en/prestataire.json';
import frPrestataire from './locales/fr/prestataire.json';
import dePrestataire from './locales/de/prestataire.json';
import esPrestataire from './locales/es/prestataire.json';
import mcPrestataire from './locales/mc/prestataire.json';

const messages = {
  en: {
    map: enMap,
    navbar: enNavbar,
    home: enHome,
    prestataire: enPrestataire
  },
  fr: {
    map: frMap,
    navbar: frNavbar,
    home: frHome,
    prestataire: frPrestataire
  },
  de: {
    map: deMap,
    navbar: deNavbar,
    home: deHome,
    prestataire: dePrestataire
  },
  es: {
    map: esMap,
    navbar: esNavbar,
    home: esHome,
    prestataire: esPrestataire
  },
  mc: {
    map: mcMap,
    navbar: mcNavbar,
    home: mcHome,
    prestataire: mcPrestataire
  }
};

// Récupérer la locale depuis localStorage ou utiliser 'fr' par défaut
const savedLocale = localStorage.getItem('locale') || 'fr';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'fr',
  messages,
  missingWarn: false, // Désactiver les warnings pour les traductions manquantes
  fallbackWarn: false
});

export default i18n;