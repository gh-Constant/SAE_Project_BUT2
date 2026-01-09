/**
 * @file index.ts (router)
 * @description
 * Configuration du routeur Vue.js avec les guards d'authentification et de rôles.
 * Définit les routes de l'application et gère la navigation basée sur l'état d'authentification et les rôles utilisateur.
 *
 * @utilité
 * - Définit toutes les routes de l'application avec leurs composants.
 * - Implémente des guards pour protéger les routes nécessitant une authentification.
 * - Implémente des guards pour restreindre l'accès basé sur les rôles utilisateur.
 * - Gère la redirection automatique vers la page de connexion pour les utilisateurs non authentifiés.
 * - Gère la redirection vers la page d'accueil pour les utilisateurs n'ayant pas le rôle requis.
 *
 * @exports
 * - routes : tableau des routes de l'application.
 * - createAppRouter : fonction pour créer une instance du routeur.
 * - router : instance par défaut du routeur (pour compatibilité).
 *
 * @remarques
 * - Le guard d'authentification attend que l'état d'authentification soit prêt avant de décider.
 * - Les routes avec `meta: { requiresAuth: true }` sont protégées par authentification.
 * - Les routes avec `meta: { requiredRole: ROLE_ID }` sont protégées par rôle.
 * - Utilise l'historique HTML5 pour les URLs propres.
 */

// TODO: Créer une option afin de bloquer des pages en fonction du rôle de l'utilisateur

import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric,
} from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Role } from '@/mocks/users';

// Routes de l'application
export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    // Retirer meta: { requiresAuth: true } pour rendre la page accessible sans connexion
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('../views/MapPageView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'), // Page de connexion
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'), // Page d'inscription
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/admin/products',
    name: 'admin-products',
    component: () => import('../views/AdminProductsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/admin/quests',
    name: 'admin-quests',
    component: () => import('../views/AdminQuestsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/admin/quests/stats',
    name: 'admin-quest-stats',
    component: () => import('../views/AdminQuestStatsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/admin/locations',
    name: 'admin-locations',
    component: () => import('../views/AdminLocationsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/admin/quizzes',
    name: 'admin-quizzes',
    component: () => import('../views/AdminQuizzesView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/admin/quizzes/stats',
    name: 'admin-quizzes-stats',
    component: () => import('../views/AdminQuizStatsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/admin/shop/stats',
    name: 'admin-shop-stats',
    component: () => import('../views/AdminShopStatsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/prestataire',
    name: 'prestataire',
    component: () => import('../views/PrestataireView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.PRESTATAIRE_ROLE_ID },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-quests',
    name: 'my-quests',
    component: () => import('../views/UserQuestList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/prestataire/products',
    name: 'prestataire-products',
    component: () => import('../views/PrestataireProductsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.PRESTATAIRE_ROLE_ID },
  },
  {
    path: '/prestataire/locations',
    name: 'prestataire-locations',
    component: () => import('../views/prestataire/MyLocationsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.PRESTATAIRE_ROLE_ID },
  },
  {
    path: '/prestataire/quests',
    name: 'prestataire-quests',
    component: () => import('../views/PrestataireQuestsView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.PRESTATAIRE_ROLE_ID },
  },
  {
    path: '/prestataire/orders/scan',
    name: 'prestataire-order-scan',
    component: () => import('../views/PrestataireOrderScanView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.PRESTATAIRE_ROLE_ID },
  },
  {
    path: '/prestataire/location/:locationId/events',
    name: 'prestataire-location-events',
    component: () => import('../views/prestataire/LocationEventsManager.vue'),
    meta: { requiresAuth: true, requiredRole: Role.PRESTATAIRE_ROLE_ID },
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('../views/client/GlobalEventsView.vue'),
  },
  {
    path: '/location/:locationId/events',
    name: 'location-events',
    component: () => import('../views/client/LocationEventsView.vue'),
  },
  {
    path: '/events/:id',
    name: 'event-details',
    component: () => import('../views/client/EventDetailsView.vue'),
  },
  {
    path: '/my-reservations',
    name: 'my-reservations',
    component: () => import('../views/client/MyReservationsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-quests',
    name: 'my-quests',
    component: () => import('../views/UserQuestList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/editor-test',
    name: 'editor-test',
    component: () => import('../views/EditorTestView.vue'),
  },
  {
    path: '/boutique',
    name: 'boutique',
    component: () => import('../views/BoutiqueView.vue'),
  },
  {
    path: '/boutique/:locationId',
    name: 'boutique-location',
    component: () => import('../views/BoutiqueView.vue'),
  },
  {
    path: '/panier',
    name: 'panier',
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-quests',
    name: 'my-quests',
    component: () => import('../views/UserQuestList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-quests',
    name: 'my-quests',
    component: () => import('../views/UserQuestList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/commandes',
    name: 'commandes',
    component: () => import('../views/OrdersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-quests',
    name: 'my-quests',
    component: () => import('../views/UserQuestList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/AdminUsersView.vue'),
    meta: { requiresAuth: true, requiredRole: Role.ADMIN_ROLE_ID },
  },
  {
    path: '/qr/generate',
    name: 'qr-generate',
    component: () => import('../views/QRGenerateView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/qr/scan',
    name: 'qr-scan',
    component: () => import('../views/QRScanView.vue'),
  },
  // Quiz routes
  {
    path: '/quiz',
    name: 'quiz-list',
    component: () => import('../views/QuizListView.vue'),
  },
  {
    path: '/quiz/create',
    name: 'quiz-create',
    component: () => import('../views/QuizEditorView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/quiz/:id',
    name: 'quiz-play',
    component: () => import('../views/QuizPlayView.vue'),
  },
  {
    path: '/quiz/:id/edit',
    name: 'quiz-edit',
    component: () => import('../views/QuizEditorView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/quiz/:id/results',
    name: 'quiz-results',
    component: () => import('../views/QuizResultsView.vue'),
  },
  {
    path: '/conversations',
    name: 'conversations',
    component: () => import('../views/ConversationsView.vue'),
    meta: { requiresAuth: true },
  },
];

// Fonction guard qui redirige vers /login SI l'utilisateur n'est pas connecté ET que la route nécessite une authentification
async function redirectLogin(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedLoadedGeneric,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  // Attendre que l'authentification soit prête avant de vérifier
  // Problème résolu : Le routeur s'exécute avant que checkAuth() ne termine,
  // donc isAuthenticated est false même avec un token valide.
  // Solution : Attendre que authReady soit true via une Promise et un watcher Pinia.
  if (!authStore.authReady) {
    await new Promise<void>((resolve) => {
      const unwatch = authStore.$subscribe(() => { // Watcher Pinia pour détecter les changements d'état
        if (authStore.authReady) {
          unwatch(); // Arrêter le watcher une fois prêt
          resolve(); // Résoudre la Promise pour continuer le guard
        }
      });
    });
  }

  // Vérifier l'authentification après que l'état soit prêt
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login'); // Redirection forcée vers la page de connexion
  } else if (to.meta.requiredRole && authStore.user?.role !== to.meta.requiredRole) {
    next('/'); // Redirection vers la page d'accueil si rôle insuffisant
  } else {
    next(); // Autorise la navigation
  }
}

// Fonction pour créer le routeur (permet de le créer après l'initialisation de l'auth)
export function createAppRouter() {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // Utilisation des URLs HTML5 sans hashtag
    routes,
  });

  // Intercepteur vue-router exécuté avant chaque navigation
  router.beforeEach((to, from, next) => {
    redirectLogin(to, from, next);
  });

  return router;
}

// Création du routeur principal (pour compatibilité, mais remplacé dans main.ts)
const router = createAppRouter();

export default router;
