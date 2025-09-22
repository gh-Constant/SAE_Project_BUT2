import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric,
} from 'vue-router';
import { useAuthStore } from '@/stores/auth';

//TODO: Créer une option afin de bloquer des pages en fonction du rôle de l'utilisateur

// Création du routeur principal avec l’historique HTML5 et les routes de l’application
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Utilisation des url de base HTML et non pas de hashtag
  routes: [
    {
      path: '/',
      name: 'map',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }, // Cette route nécessite que l’utilisateur soit connecté
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'), // Page de connexion
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'), // Page d’inscription
    },
  ],
});

// Cette fonction renvoie l'utilisateur dans la page /login SI 'il n'est pas connecté' & que 'la route a comme variable requiresAuth: true'
function redirectLogin(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedLoadedGeneric,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login'); // Redirection forcée vers la page de connexion
  } else {
    next(); // Autorise la navigation
  }
}

// Intercepteur vue-router exécuté avant chaque navigation
router.beforeEach((to, from, next) => {
  redirectLogin(to, from, next);
});

export default router;
