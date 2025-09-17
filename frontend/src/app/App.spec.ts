import { describe, it, expect } from 'vitest';
import router from '../router';
import i18n from '../i18n';
import { mount } from '@vue/test-utils';
import App from './App.vue';

describe('App', () => {
  it('renders properly', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
        stubs: ['SimpleMapView']
      }
    });
    await router.isReady();
    expect(wrapper.exists()).toBe(true);
  });
});
