/**
 * @file index.ts (router)
 * @description
 * Configuration du routeur Vue.js avec les guards d'authentification.
 * Définit les routes de l'application et gère la navigation basée sur l'état d'authentification.
 *
 * @utilité
 * - Définit toutes les routes de l'application avec leurs composants.
 * - Implémente des guards pour protéger les routes nécessitant une authentification.
 * - Gère la redirection automatique vers la page de connexion pour les utilisateurs non authentifiés.
 *
 * @exports
 * - routes : tableau des routes de l'application.
 * - createAppRouter : fonction pour créer une instance du routeur.
 * - router : instance par défaut du routeur (pour compatibilité).
 *
 * @remarques
 * - Le guard d'authentification attend que l'état d'authentification soit prêt avant de décider.
 * - Les routes avec `meta: { requiresAuth: true }` sont protégées.
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

// Routes de l'application
export const routes = [
  {
    path: '/',
    name: 'map',
    component: () => import('../views/HomeView.vue'),
    // Retirer meta: { requiresAuth: true } pour rendre la page accessible sans connexion
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
