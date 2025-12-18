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
import enCart from './locales/en/cart.json';
import frCart from './locales/fr/cart.json';
import deCart from './locales/de/cart.json';
import esCart from './locales/es/cart.json';
import enFooter from './locales/en/footer.json';
import frFooter from './locales/fr/footer.json';
import deFooter from './locales/de/footer.json';
import esFooter from './locales/es/footer.json';
import enAuth from './locales/en/auth.json';
import frAuth from './locales/fr/auth.json';
import deAuth from './locales/de/auth.json';
import esAuth from './locales/es/auth.json';
import enShop from './locales/en/shop.json';
import frShop from './locales/fr/shop.json';
import deShop from './locales/de/shop.json';
import esShop from './locales/es/shop.json';
import enCheckout from './locales/en/checkout.json';
import frCheckout from './locales/fr/checkout.json';
import deCheckout from './locales/de/checkout.json';
import esCheckout from './locales/es/checkout.json';
import enProfile from './locales/en/profile.json';
import frProfile from './locales/fr/profile.json';
import deProfile from './locales/de/profile.json';
import esProfile from './locales/es/profile.json';
import enOrders from './locales/en/orders.json';
import frOrders from './locales/fr/orders.json';
import deOrders from './locales/de/orders.json';
import esOrders from './locales/es/orders.json';
import enQuest from './locales/en/quest.json';
import frQuest from './locales/fr/quest.json';
import deQuest from './locales/de/quest.json';
import esQuest from './locales/es/quest.json';

import enAdmin from './locales/en/admin.json';
import frAdmin from './locales/fr/admin.json';
import deAdmin from './locales/de/admin.json';
import esAdmin from './locales/es/admin.json';

import enReservations from './locales/en/reservations.json';
import frReservations from './locales/fr/reservations.json';
import deReservations from './locales/de/reservations.json';
import esReservations from './locales/es/reservations.json';

import enEvents from './locales/en/events.json';
import frEvents from './locales/fr/events.json';
import deEvents from './locales/de/events.json';
import esEvents from './locales/es/events.json';

import enWidgets from './locales/en/widgets.json';
import frWidgets from './locales/fr/widgets.json';
import deWidgets from './locales/de/widgets.json';
import esWidgets from './locales/es/widgets.json';

import enQrcode from './locales/en/qrcode.json';
import frQrcode from './locales/fr/qrcode.json';
import deQrcode from './locales/de/qrcode.json';
import esQrcode from './locales/es/qrcode.json';



const messages = {
  en: {
    map: enMap,
    navbar: enNavbar,
    home: enHome,
    prestataire: enPrestataire,
    cart: enCart,
    footer: enFooter,
    auth: enAuth,
    shop: enShop,
    checkout: enCheckout,
    profile: enProfile,
    orders: enOrders,
    quest: enQuest,
    admin: enAdmin,
    reservations: enReservations,
    events: enEvents,
    widgets: enWidgets,
    qrcode: enQrcode
  },
  fr: {
    map: frMap,
    navbar: frNavbar,
    home: frHome,
    prestataire: frPrestataire,
    cart: frCart,
    footer: frFooter,
    auth: frAuth,
    shop: frShop,
    checkout: frCheckout,
    profile: frProfile,
    orders: frOrders,
    quest: frQuest,
    admin: frAdmin,
    reservations: frReservations,
    events: frEvents,
    widgets: frWidgets,
    qrcode: frQrcode
  },
  de: {
    map: deMap,
    navbar: deNavbar,
    home: deHome,
    prestataire: dePrestataire,
    cart: deCart,
    footer: deFooter,
    auth: deAuth,
    shop: deShop,
    checkout: deCheckout,
    profile: deProfile,
    orders: deOrders,
    quest: deQuest,
    admin: deAdmin,
    reservations: deReservations,
    events: deEvents,
    widgets: deWidgets,
    qrcode: deQrcode
  },
  es: {
    map: esMap,
    navbar: esNavbar,
    home: esHome,
    prestataire: esPrestataire,
    cart: esCart,
    footer: esFooter,
    auth: esAuth,
    shop: esShop,
    checkout: esCheckout,
    profile: esProfile,
    orders: esOrders,
    quest: esQuest,
    admin: esAdmin,
    reservations: esReservations,
    events: esEvents,
    widgets: esWidgets,
    qrcode: esQrcode
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