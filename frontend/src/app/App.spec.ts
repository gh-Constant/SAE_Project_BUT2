/**
 * Ce fichier est un test unitaire pour le composant App.vue.
 * Il vérifie que l'application se charge correctement avec tous les plugins et composants.
 *
 * On l'utilise dans notre CLI de déploiement (deploy-frontend.yml) pour s'assurer que l'app ne plante pas dès le lancement.
 */

import { describe, it, expect } from 'vitest';
import { createPinia } from 'pinia';
import router from '@/router';
import i18n from '@/i18n';
import { mount } from '@vue/test-utils';
import App from './App.vue';

describe('App', () => {
  it('renders properly', async () => {
    const pinia = createPinia();

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
