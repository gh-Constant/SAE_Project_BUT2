/**
 * Ce fichier est un test unitaire pour le composant App.vue.
 * Il vérifie que l'application se charge correctement avec tous les plugins et composants.
 *
 * On l'utilise dans notre CLI de déploiement (deploy-frontend.yml) pour s'assurer que l'app ne plante pas dès le lancement.
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import { createPinia } from 'pinia';
import { createAppRouter } from '@/router';
import i18n from '@/i18n';
import { mount } from '@vue/test-utils';
import App from './App.vue';

// Mock fetch to avoid real API calls in tests
global.fetch = vi.fn();

describe('App', () => {
  it('renders properly', async () => {
    const pinia = createPinia();

    // Create router without triggering auth checks
    const router = createAppRouter();

    // Monte App avec les plugins nécessaires et stub le composant SimpleMapView
    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n, pinia],
        stubs: ['SimpleMapView']
      }
    });

    // Attend que le routeur soit prêt avant de tester
    await router.isReady();

    // Vérifie que le composant est bien rendu
    expect(wrapper.exists()).toBe(true);
  });
});
