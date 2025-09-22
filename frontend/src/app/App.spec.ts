import { describe, it, expect } from 'vitest';
import { createPinia } from 'pinia';
import router from '../router';
import i18n from '../i18n';
import { mount } from '@vue/test-utils';
import App from './App.vue';

describe('App', () => {
  it('renders properly', async () => {
    const pinia = createPinia();
    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n, pinia],
        stubs: ['SimpleMapView']
      }
    });
    await router.isReady();
    expect(wrapper.exists()).toBe(true);
  });
});
