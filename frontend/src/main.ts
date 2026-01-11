/**
 * @file main.ts
 * @description
 * Point d'entrée principal de l'application Vue.js.
 * Configure et initialise l'application avec tous les plugins nécessaires.
 *
 * @utilité
 * - Crée l'instance Vue et configure les plugins (Pinia, Router, i18n).
 * - Initialise l'authentification avant de créer le routeur pour éviter les problèmes de timing.
 * - Monte l'application sur le DOM.
 *
 * @exports
 * - Aucun export direct, fichier d'entrée.
 *
 * @remarques
 * - L'authentification est vérifiée avant la création du routeur pour s'assurer que les guards fonctionnent correctement.
 * - Utilise async/await pour attendre la fin de l'initialisation de l'authentification.
 */

import './styles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'highlight.js/styles/github.css';
import { createAppRouter } from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';

import App from './app/App.vue';
import i18n from './i18n';

const app = createApp(App);
const pinia = createPinia();

// Enregistre Pinia dans l'application
app.use(pinia);

// Initialiser l'authentification avant de créer le routeur pour éviter les problèmes de timing
const authStore = useAuthStore();
await authStore.checkAuth(); // Attendre que l'auth soit vérifiée

// Le panier est maintenant chargé automatiquement dans checkAuth() et login()
// Plus besoin de le charger ici manuellement

// Créer le routeur après la vérification d'authentification
const router = createAppRouter();

// Enregistre le routeur et i18n dans l'application
app.use(router);
app.use(i18n);

// Monte l'application sur l'élément HTML avec l'id 'root'
app.mount('#root');
