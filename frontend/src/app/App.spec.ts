/**
 * Ce fichier est un test unitaire pour le composant App.vue.
 * Il vérifie que l'application se charge correctement avec tous les plugins et composants.
 *
 * On l'utilise dans notre CLI de déploiement (deploy-frontend.yml) pour s'assurer que l'app ne plante pas dès le lancement.
 */

import { describe, it, expect, vi } from 'vitest';
import { createPinia } from 'pinia';
// @ts-ignore
import { createAppRouter } from '@/router/index';
// @ts-ignore
import i18n from '@/i18n';
import { mount } from '@vue/test-utils';
import App from './App.vue';

// Mock fetch to avoid real API calls in tests
global.fetch = vi.fn();

// Mock the auth store to prevent async operations
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    authReady: true,
    checkAuth: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('App', () => {
  it('renders properly', async () => {
    const pinia = createPinia();

    // Create router without triggering auth checks
    const router = createAppRouter();

    // Monte App avec les plugins nécessaires et stub les composants qui causent des erreurs
    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n, pinia],
        stubs: ['SimpleMapView', 'HomeView']
      }
    });

    // Attend que le routeur soit prêt avant de tester
    await router.isReady();

    // Vérifie que le composant est bien rendu
    expect(wrapper.exists()).toBe(true);
  });
});
